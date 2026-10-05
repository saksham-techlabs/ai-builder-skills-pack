import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, mkdir, readdir, rm, symlink, cp, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parseManifest, validateSkills } from '../dist/src/core/catalog.js';
import { inside } from '../dist/src/core/paths.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const cliPath = path.join(root, 'dist/src/cli/index.js');
const manifest = JSON.parse(await readFile(path.join(root, 'skills.json'), 'utf8'));

async function temporary(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'ai-builder-test-'));
  t.after(async () => {
    // Only remove the exact fresh temporary directory created by this test.
    assert.equal(path.dirname(dir), path.resolve(os.tmpdir()));
    assert.ok(path.basename(dir).startsWith('ai-builder-test-'));
    await rm(dir, { recursive: true, force: true });
  });
  return dir;
}
function cli(args, cwd = root, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  if (!('npm_lifecycle_event' in extraEnv)) delete env.npm_lifecycle_event;
  if (!('INIT_CWD' in extraEnv)) delete env.INIT_CWD;
  const result = spawnSync(process.execPath, [cliPath, ...args], { cwd, env, encoding: 'utf8', timeout: 15000 });
  assert.ifError(result.error);
  return result;
}
function success(result) { assert.equal(result.status, 0, result.stderr); return result.stdout; }
function failure(result, pattern) { assert.equal(result.status, 1, result.stdout); assert.match(result.stderr, pattern); }

test('help and listing run from an unrelated working directory', async t => {
  const target = await temporary(t);
  assert.match(success(cli(['--help'], target)), /Usage: ai-builder-skills/);
  const output = success(cli(['list'], target));
  for (const skill of manifest.skills) assert.ok(output.includes(skill.id));
  assert.equal((await readdir(target)).length, 0);
});

for (const [preset, folder] of [['generic', '.ai-builder'], ['cursor', '.cursor'], ['codex', '.agents'], ['claude', '.claude']]) {
  test(`${preset}: install, list, overwrite refusal and remove preserve unrelated files`, async t => {
    const target = await temporary(t);
    const original = path.join(target, 'keep.txt');
    await writeFile(original, 'unrelated');
    const options = ['--preset', preset, '--target', target];
    success(cli(['install', 'security-auditor', 'debugging-expert', ...options]));
    const installed = path.join(target, folder, 'skills/security-auditor');
    assert.equal(await readFile(path.join(installed, 'SKILL.md'), 'utf8'), await readFile(path.join(root, 'skills/security-auditor/SKILL.md'), 'utf8'));
    assert.match(await readFile(path.join(installed, 'USAGE.md'), 'utf8'), /security-auditor/);
    assert.match(success(cli(['installed', '--target', target])), /security-auditor\s+0\.1\.0\s+unchanged/);
    failure(cli(['install', 'security-auditor', ...options]), /Already installed/);
    success(cli(['install', 'security-auditor', ...options, '--force']));
    success(cli(['remove', 'security-auditor', 'debugging-expert', ...options]));
    assert.match(success(cli(['installed', ...options])), /No managed skills/);
    assert.equal(await readFile(original, 'utf8'), 'unrelated');
  });
}

test('local edits and deleted files are detected; removal needs --force', async t => {
  const target = await temporary(t);
  const options = ['--preset', 'generic', '--target', target];
  success(cli(['init', 'security-auditor', ...options]));
  const dir = path.join(target, '.ai-builder/skills/security-auditor');
  await writeFile(path.join(dir, 'SKILL.md'), 'my local changes');
  await unlink(path.join(dir, 'CHECKLIST.md'));
  assert.match(success(cli(['installed', ...options])), /modified/);
  failure(cli(['remove', 'security-auditor', ...options]), /Local edits detected/);
  assert.equal(await readFile(path.join(dir, 'SKILL.md'), 'utf8'), 'my local changes');
  success(cli(['remove', 'security-auditor', ...options, '--force']));
});

test('unmanaged directories and extra files survive even --force', async t => {
  const target = await temporary(t);
  const options = ['--preset', 'generic', '--target', target];
  const dir = path.join(target, '.ai-builder/skills/security-auditor');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'custom.md'), 'preserve');
  failure(cli(['install', 'security-auditor', ...options, '--force']), /unmanaged directory/);
  failure(cli(['remove', 'security-auditor', ...options, '--force']), /unmanaged directory/);
  success(cli(['install', 'debugging-expert', ...options]));
  const extra = path.join(target, '.ai-builder/skills/debugging-expert/custom.md');
  await writeFile(extra, 'custom');
  failure(cli(['remove', 'debugging-expert', ...options, '--force']), /Unmanaged files/);
  failure(cli(['install', 'debugging-expert', ...options, '--force']), /Unmanaged files/);
  assert.equal(await readFile(extra, 'utf8'), 'custom');
});

test('preflight prevents partial selection on a known conflict or unknown ID', async t => {
  const target = await temporary(t);
  const options = ['--preset', 'generic', '--target', target];
  failure(cli(['install', 'frontend-expert', 'does-not-exist', ...options]), /Unknown skill/);
  assert.deepEqual(await readdir(target), []);
  success(cli(['install', 'security-auditor', ...options]));
  failure(cli(['install', 'frontend-expert', 'security-auditor', ...options]), /Already installed/);
  assert.doesNotMatch(success(cli(['installed', ...options])), /frontend-expert/);
});

test('noninteractive init, malformed flags and traversal fail explicitly', async t => {
  const target = await temporary(t);
  failure(cli(['init'], target), /requires a terminal/);
  failure(cli(['install', 'security-auditor', '--preset']), /Missing value/);
  failure(cli(['install', 'security-auditor', '--preset', 'wrong']), /Unknown preset/);
  failure(cli(['install', '--all', 'security-auditor', '--preset', 'generic']), /not both/);
  failure(cli(['remove', '../keep', '--preset', 'generic', '--target', target]), /No installed skills|Invalid skill/);
  failure(cli(['list', '--force']), /does not accept/);
  failure(cli(['installed', '--all']), /accepts only/);
  failure(cli(['wat']), /Unknown command/);
  assert.throws(() => inside(target, '../escape'), /inside its root/);
  assert.throws(() => inside(target, '.'), /inside its root/);
});

test('all skills install using the manifest and default target', async t => {
  const target = await temporary(t);
  success(cli(['install', '--all', '--preset', 'generic'], target));
  const installed = success(cli(['installed'], target)).trim().split('\n');
  assert.equal(installed.length, manifest.skills.length);
});

test('install defaults to generic and remove detects the preset', async t => {
  const target = await temporary(t);
  assert.match(success(cli(['install', 'security-auditor', '--target', target])), /using generic/);
  await readFile(path.join(target, '.ai-builder/skills/security-auditor/SKILL.md'));
  assert.match(success(cli(['remove', 'security-auditor', '--target', target])), /Removed security-auditor \(generic\)/);
  assert.deepEqual(await readdir(path.join(target, '.ai-builder/skills')), []);
  failure(cli(['remove', 'security-auditor', '--target', target]), /Not installed/);
  failure(cli(['remove', '../keep', '--target', target]), /Invalid skill ID/);
});

test('remove refuses to guess when a skill exists in several presets', async t => {
  const target = await temporary(t);
  success(cli(['install', 'code-reviewer', '--preset', 'cursor', '--target', target]));
  success(cli(['install', 'code-reviewer', '--preset', 'claude', '--target', target]));
  failure(cli(['remove', 'code-reviewer', '--target', target]), /cursor, claude\. Pass --preset/);
  success(cli(['remove', 'code-reviewer', '--preset', 'cursor', '--target', target]));
  assert.match(success(cli(['remove', 'code-reviewer', '--target', target])), /\(claude\)/);
});

test('npm run cli targets the directory npm was invoked from', async t => {
  const target = await temporary(t);
  success(cli(['install', 'debugging-expert'], root, { npm_lifecycle_event: 'cli', INIT_CWD: target }));
  await readFile(path.join(target, '.ai-builder/skills/debugging-expert/SKILL.md'));
  success(cli(['remove', 'debugging-expert'], root, { npm_lifecycle_event: 'cli', INIT_CWD: target }));
});

test('installation receipts cannot request arbitrary deletion', async t => {
  const target = await temporary(t);
  const options = ['--preset', 'generic', '--target', target];
  success(cli(['install', 'security-auditor', ...options]));
  const marker = path.join(target, '.ai-builder/skills/security-auditor/.ai-builder-install.json');
  const record = JSON.parse(await readFile(marker, 'utf8'));
  record.hashes['../../keep.txt'] = '0'.repeat(64);
  await writeFile(marker, JSON.stringify(record));
  await writeFile(path.join(target, 'keep.txt'), 'keep');
  failure(cli(['remove', 'security-auditor', ...options, '--force']), /Invalid receipt hashes/);
  assert.equal(await readFile(path.join(target, 'keep.txt'), 'utf8'), 'keep');
});

test('installer lock prevents concurrent writes without stealing the lock', async t => {
  const target = await temporary(t);
  const lock = path.join(target, '.ai-builder/skills/.ai-builder.lock');
  await mkdir(lock, { recursive: true });
  failure(cli(['install', 'security-auditor', '--preset', 'generic', '--target', target]), /Installer lock exists/);
  assert.deepEqual(await readdir(lock), []);
});

test('symlink/junction destination is refused without touching its referent', async t => {
  const target = await temporary(t);
  const outside = await temporary(t);
  await writeFile(path.join(outside, 'keep.txt'), 'keep');
  await symlink(outside, path.join(target, '.ai-builder'), process.platform === 'win32' ? 'junction' : 'dir');
  failure(cli(['install', 'security-auditor', '--preset', 'generic', '--target', target]), /symbolic link or junction/);
  assert.deepEqual(await readdir(outside), ['keep.txt']);
});

test('validates catalog and rejects invalid manifest entries', async () => {
  await validateSkills(root);
  const mutations = [
    m => { m.skills.push({ ...m.skills[0] }); },
    m => { m.skills[0].id = '../outside'; },
    m => { m.skills[0].description = ''; },
    m => { m.skills[0].version = 'latest'; },
    m => { m.skills[0].tags = 'security'; },
    m => { m.skills[0].files = ['../outside']; },
    m => { delete m.skills[0].recommendedFor; },
    m => { m.schemaVersion = 2; },
    m => { m.skills[0].typo = true; },
  ];
  for (const mutate of mutations) {
    const copy = structuredClone(manifest);
    mutate(copy);
    assert.throws(() => parseManifest(copy));
  }
});

test('missing skill directories, required files and headings fail validation', async t => {
  const fixture = await temporary(t);
  const single = { schemaVersion: 1, skills: [manifest.skills[0]] };
  await writeFile(path.join(fixture, 'skills.json'), JSON.stringify(single));
  await mkdir(path.join(fixture, 'skills'));
  await assert.rejects(validateSkills(fixture));
  const id = single.skills[0].id;
  const dir = path.join(fixture, 'skills', id);
  await cp(path.join(root, 'skills', id), dir, { recursive: true });
  await validateSkills(fixture);
  const skillPath = path.join(dir, 'SKILL.md');
  const content = await readFile(skillPath, 'utf8');
  await writeFile(skillPath, content.replace('## Step-by-step workflow', '## Missing'));
  await assert.rejects(validateSkills(fixture), /Missing heading/);
  await writeFile(skillPath, content.replace('## Purpose', '## Temp').replace('## Common mistakes', '## Purpose').replace('## Temp', '## Common mistakes'));
  await assert.rejects(validateSkills(fixture), /out of order/);
  await writeFile(skillPath, content);
  await unlink(path.join(dir, 'CHECKLIST.md'));
  await assert.rejects(validateSkills(fixture), /ENOENT/);
});

test('extra source files and linked source folders fail validation', async t => {
  const fixture = await temporary(t);
  const single = { schemaVersion: 1, skills: [manifest.skills[0]] };
  await writeFile(path.join(fixture, 'skills.json'), JSON.stringify(single));
  const dir = path.join(fixture, 'skills', single.skills[0].id);
  await cp(path.join(root, 'skills', single.skills[0].id), dir, { recursive: true });
  await writeFile(path.join(dir, 'extra.md'), 'not declared');
  await assert.rejects(validateSkills(fixture), /Unexpected file/);
  await unlink(path.join(dir, 'extra.md'));
  await validateSkills(fixture);
  const linkedFixture = await temporary(t);
  await writeFile(path.join(linkedFixture, 'skills.json'), JSON.stringify(single));
  await mkdir(path.join(linkedFixture, 'skills'));
  await symlink(dir, path.join(linkedFixture, 'skills', single.skills[0].id), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(validateSkills(linkedFixture), /Unexpected entry/);
});

test('force replacement restores canonical bytes after local editing', async t => {
  const target = await temporary(t);
  const options = ['--preset', 'generic', '--target', target];
  success(cli(['install', 'frontend-expert', ...options]));
  const skill = path.join(target, '.ai-builder/skills/frontend-expert/SKILL.md');
  await writeFile(skill, 'local version');
  failure(cli(['install', 'frontend-expert', ...options]), /Already installed/);
  assert.equal(await readFile(skill, 'utf8'), 'local version');
  success(cli(['install', 'frontend-expert', ...options, '--force']));
  assert.equal(await readFile(skill, 'utf8'), await readFile(path.join(root, 'skills/frontend-expert/SKILL.md'), 'utf8'));
  assert.match(success(cli(['installed', ...options])), /unchanged/);
});
