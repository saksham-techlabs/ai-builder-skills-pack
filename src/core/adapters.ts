import { inside, packageRoot, readRegular } from './paths.js';
import { object } from './catalog.js';

export const presets = ['generic', 'cursor', 'codex', 'claude'] as const;
export type Preset = typeof presets[number];
export interface Adapter { id: Preset; name: string; directory: string; template: string }

export function parsePreset(value: string): Preset {
  if (!(presets as readonly string[]).includes(value)) throw new Error(`Unknown preset: ${value}. Choose ${presets.join(', ')}.`);
  return value as Preset;
}
export async function loadAdapter(preset: Preset, root = packageRoot): Promise<Adapter> {
  const data: unknown = JSON.parse((await readRegular(inside(root, `adapters/${preset}/adapter.json`))).toString('utf8'));
  if (!object(data) || data.id !== preset || typeof data.name !== 'string' || typeof data.directory !== 'string' || !/^\.[a-z][a-z0-9-]*\/skills$/.test(data.directory)) throw new Error(`Invalid adapter: ${preset}`);
  const template = (await readRegular(inside(root, `adapters/${preset}/USAGE.template.md`))).toString('utf8');
  if (!template.includes('{{id}}') || !template.includes('{{path}}')) throw new Error(`Invalid usage template: ${preset}`);
  return { id: preset, name: data.name, directory: data.directory, template };
}
