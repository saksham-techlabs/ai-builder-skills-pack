import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readdir, rename, rmdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadAdapter, presets, type Adapter, type Preset } from './adapters.js';
import { idPattern, object, requiredFiles, type Skill } from './catalog.js';
import { ensureDirectory, exists, inside, noLinks, packageRoot, readRegular } from './paths.js';

const markerName = '.ai-builder-install.json';
const ownedFiles = [...requiredFiles, 'USAGE.md'];
interface Receipt {
  schemaVersion: 1; owner: 'ai-builder-skills'; id: string; version: string;
  preset: string; hashes: Record<string, string>;
}
export interface Installation { id: string; version: string; status: 'unchanged' | 'modified'; directory: string }
const hash = (content: Buffer | string): string => createHash('sha256').update(content).digest('hex');

function skillDirectory(root: string, id: string): string {
  if (!idPattern.test(id) || id.length > 64) throw new Error(`Invalid skill ID: ${id}`);
  return inside(root, id);
}

async function receipt(directory: string, id: string, adapter: Adapter): Promise<Receipt> {
  const file = inside(directory, markerName);
  if (!await exists(file)) throw new Error(`Refusing unmanaged directory: ${directory}. Move it aside manually first.`);
  const data: unknown = JSON.parse((await readRegular(file)).toString('utf8'));
  if (!object(data) || data.owner !== 'ai-builder-skills' || data.schemaVersion !== 1 || data.id !== id || data.preset !== adapter.id || typeof data.version !== 'string' || !object(data.hashes)) throw new Error(`Invalid installation receipt: ${file}`);
  const hashes = data.hashes;
  if (Object.keys(hashes).length !== ownedFiles.length || !ownedFiles.every(name => typeof hashes[name] === 'string' && /^[a-f0-9]{64}$/.test(hashes[name] as string))) throw new Error(`Invalid receipt hashes: ${file}`);
  return data as unknown as Receipt;
}

async function inspect(directory: string, id: string, adapter: Adapter): Promise<Installation> {
  await noLinks(directory);
  const data = await receipt(directory, id, adapter);
  const entries = await readdir(directory);
  const unexpected = entries.filter(name => name !== markerName && !ownedFiles.includes(name));
  if (unexpected.length) throw new Error(`Unmanaged files in ${directory}: ${unexpected.join(', ')}. Move them out before replacing/removing.`);
  let modified = false;
  for (const name of ownedFiles) {
    const file = inside(directory, name);
    if (!await exists(file)) modified = true;
    else if (hash(await readRegular(file)) !== data.hashes[name]) modified = true;
  }
  return { id, version: data.version, status: modified ? 'modified' : 'unchanged', directory };
}

// Delete only the exact owned leaf files; never recursively delete user directories.
async function deleteOwned(directory: string): Promise<void> {
  await noLinks(directory);
  const names = await readdir(directory);
  if (names.some(name => name !== markerName && !ownedFiles.includes(name))) throw new Error(`Unexpected files; preserved ${directory}`);
  for (const name of names) await readRegular(inside(directory, name));
  for (const name of names.filter(name => name !== markerName)) await unlink(inside(directory, name));
  if (names.includes(markerName)) await unlink(inside(directory, markerName));
  await rmdir(directory);
}

async function locked<T>(root: string, action: () => Promise<T>): Promise<T> {
  await ensureDirectory(root);
  const lock = inside(root, '.ai-builder.lock');
  try { await mkdir(lock); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new Error(`Installer lock exists: ${lock}. If no installer is running, remove this empty directory and retry.`);
    throw error;
  }
  try { return await action(); }
  finally { await rmdir(lock); }
}

export async function installSkills(skills: Skill[], target: string, adapter: Adapter, force = false, sourceRoot = packageRoot): Promise<string[]> {
  const root = inside(path.resolve(target), adapter.directory);
  // Read and validate all sources before writing anything in the target.
  const prepared = await Promise.all(skills.map(async skill => {
    const contents: Record<string, Buffer | string> = {};
    for (const name of skill.files) {
      if (!requiredFiles.includes(name as typeof requiredFiles[number])) throw new Error(`Unexpected source file: ${name}`);
      contents[name] = await readRegular(inside(sourceRoot, `skills/${skill.id}/${name}`));
    }
    contents['USAGE.md'] = adapter.template.replaceAll('{{id}}', skill.id).replaceAll('{{path}}', `${adapter.directory}/${skill.id}/SKILL.md`);
    const record: Receipt = { schemaVersion: 1, owner: 'ai-builder-skills', id: skill.id, version: skill.version, preset: adapter.id, hashes: Object.fromEntries(Object.entries(contents).map(([name, content]) => [name, hash(content)])) };
    return { skill, contents, record };
  }));
  return locked(root, async () => {
    // Preflight the whole selection before committing the first skill.
    for (const { skill } of prepared) {
      const directory = skillDirectory(root, skill.id);
      await noLinks(directory);
      if (await exists(directory)) {
        await inspect(directory, skill.id, adapter);
        if (!force) throw new Error(`Already installed: ${skill.id}. Use --force to replace owned files (including local edits).`);
      }
    }
    const installed: string[] = [];
    for (const { skill, contents, record } of prepared) {
      const directory = skillDirectory(root, skill.id);
      const stage = inside(root, `.ai-builder-stage-${randomUUID()}`);
      const backup = inside(root, `.ai-builder-backup-${randomUUID()}`);
      await mkdir(stage);
      let backedUp = false;
      try {
        for (const [name, content] of Object.entries(contents)) await writeFile(inside(stage, name), content, { flag: 'wx' });
        await writeFile(inside(stage, markerName), `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
        await noLinks(directory);
        if (await exists(directory)) {
          await inspect(directory, skill.id, adapter);
          await rename(directory, backup);
          backedUp = true;
        }
        try { await rename(stage, directory); }
        catch (error) {
          if (backedUp) await rename(backup, directory);
          throw error;
        }
        if (backedUp) await deleteOwned(backup);
        installed.push(directory);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message}\nCommitted earlier in this run: ${installed.join(', ') || 'none'}. Inspect ${root} before retrying; any backup is retained on cleanup failure.`);
      } finally {
        if (await exists(stage)) await deleteOwned(stage);
      }
    }
    return installed;
  });
}

export async function listInstalled(target: string, adapter: Adapter): Promise<Installation[]> {
  const root = inside(path.resolve(target), adapter.directory);
  await noLinks(root);
  if (!await exists(root)) return [];
  const results: Installation[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!idPattern.test(entry.name)) continue;
    const directory = inside(root, entry.name);
    await noLinks(directory);
    if (!entry.isDirectory() || !await exists(inside(directory, markerName))) continue;
    results.push(await inspect(directory, entry.name, adapter));
  }
  return results.sort((a, b) => a.id.localeCompare(b.id));
}

export async function installedPresets(id: string, target: string, sourceRoot = packageRoot): Promise<Preset[]> {
  const found: Preset[] = [];
  for (const preset of presets) {
    const adapter = await loadAdapter(preset, sourceRoot);
    const directory = skillDirectory(inside(path.resolve(target), adapter.directory), id);
    await noLinks(directory);
    if (await exists(inside(directory, markerName))) found.push(preset);
  }
  return found;
}

export async function removeSkills(ids: string[], target: string, adapter: Adapter, force = false): Promise<void> {
  const root = inside(path.resolve(target), adapter.directory);
  await noLinks(root);
  if (!await exists(root)) throw new Error(`No installed skills at ${root}`);
  await locked(root, async () => {
    for (const id of ids) {
      const item = await inspect(skillDirectory(root, id), id, adapter);
      if (item.status === 'modified' && !force) throw new Error(`Local edits detected: ${id}. Back them up, then use --force if you want to discard them.`);
    }
    for (const id of ids) await deleteOwned(skillDirectory(root, id));
  });
}
