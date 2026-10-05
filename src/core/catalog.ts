import { readdir } from 'node:fs/promises';
import { inside, packageRoot, readRegular } from './paths.js';

export const requiredFiles = ['SKILL.md', 'CHECKLIST.md', 'EXAMPLES.md'] as const;
export const requiredHeadings = ['Purpose', 'When to use', 'When NOT to use', 'Expert role', 'Repository discovery', 'Step-by-step workflow', 'Checks', 'Decision rules', 'Safety constraints', 'Expected output', 'Definition of done', 'Common mistakes'] as const;
export const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export interface Skill {
  id: string; name: string; description: string; category: string;
  tags: string[]; version: string; files: string[]; recommendedFor: string[];
}
export interface Manifest { schemaVersion: 1; skills: Skill[] }

export function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' && v.trim().length > 0) && new Set(value).size === value.length;
}
export function parseManifest(value: unknown): Manifest {
  if (!object(value) || value.schemaVersion !== 1 || !Array.isArray(value.skills) || !value.skills.length) throw new Error('Manifest requires schemaVersion: 1 and a non-empty skills array.');
  const seen = new Set<string>();
  for (const item of value.skills) {
    if (!object(item)) throw new Error('Invalid manifest skill: expected an object.');
    for (const key of ['id', 'name', 'description', 'category', 'version']) {
      if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error(`Invalid manifest field: ${key}`);
    }
    const id = item.id as string;
    if (!idPattern.test(id) || id.length > 64) throw new Error(`Invalid skill ID: ${id}`);
    if (seen.has(id)) throw new Error(`Duplicate skill ID: ${id}`);
    seen.add(id);
    if (!versionPattern.test(item.version as string)) throw new Error(`Invalid version for ${id}; use x.y.z.`);
    if (!strings(item.tags) || !strings(item.recommendedFor) || !strings(item.files)) throw new Error(`Invalid arrays for ${id}.`);
    if (item.files.length !== requiredFiles.length || !requiredFiles.every(file => (item.files as string[]).includes(file))) throw new Error(`Invalid files for ${id}; expected exactly ${requiredFiles.join(', ')}.`);
    const allowed = ['id', 'name', 'description', 'category', 'tags', 'version', 'files', 'recommendedFor'];
    if (Object.keys(item).some(key => !allowed.includes(key))) throw new Error(`Unknown manifest field for ${id}.`);
  }
  if (Object.keys(value).some(key => !['schemaVersion', 'skills'].includes(key))) throw new Error('Unknown top-level manifest field.');
  return value as unknown as Manifest;
}

export async function loadManifest(root = packageRoot): Promise<Manifest> {
  return parseManifest(JSON.parse((await readRegular(inside(root, 'skills.json'))).toString('utf8')));
}

export async function validateSkills(root = packageRoot): Promise<Manifest> {
  const manifest = await loadManifest(root);
  const directories = await readdir(inside(root, 'skills'), { withFileTypes: true });
  const declared = new Set(manifest.skills.map(skill => skill.id));
  for (const entry of directories) {
    if (!entry.isDirectory() || !declared.has(entry.name)) throw new Error(`Unexpected entry in skills/: ${entry.name}`);
  }
  for (const skill of manifest.skills) {
    const entries = await readdir(inside(root, `skills/${skill.id}`), { withFileTypes: true });
    if (entries.some(entry => !entry.isFile() || !skill.files.includes(entry.name))) throw new Error(`Unexpected file or linked entry in ${skill.id}.`);
    for (const file of skill.files) {
      const content = (await readRegular(inside(root, `skills/${skill.id}/${file}`))).toString('utf8').replace(/\r\n/g, '\n');
      if (!content.trim()) throw new Error(`Empty ${skill.id}/${file}`);
      if (file === 'SKILL.md') {
        const frontmatter = content.match(/^---\nname: ([a-z0-9-]+)\ndescription: (.+)\n---\n/);
        if (!frontmatter || frontmatter[1] !== skill.id || !frontmatter[2]?.trim()) throw new Error(`Invalid frontmatter: ${skill.id}`);
        const lines = content.split('\n');
        let previous = -1;
        for (const heading of requiredHeadings) {
          const index = lines.indexOf(`## ${heading}`);
          if (index === -1) throw new Error(`Missing heading "${heading}" in ${skill.id}`);
          if (index < previous) throw new Error(`Heading "${heading}" is out of order in ${skill.id}`);
          previous = index;
        }
        if (!content.includes('[CHECKLIST.md](CHECKLIST.md)') || !content.includes('[EXAMPLES.md](EXAMPLES.md)')) throw new Error(`Missing supporting links: ${skill.id}`);
      }
      if (file === 'CHECKLIST.md' && !content.includes('- [ ] ')) throw new Error(`Missing checklist: ${skill.id}`);
      if (file === 'EXAMPLES.md' && (content.match(/^## Example \d+/gm)?.length ?? 0) < 2) throw new Error(`At least two examples required: ${skill.id}`);
    }
  }
  return manifest;
}
