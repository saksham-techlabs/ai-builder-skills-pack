#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { parseArgs } from './args.js';
import { loadManifest, validateSkills } from '../core/catalog.js';
import { loadAdapter, parsePreset, presets, type Preset } from '../core/adapters.js';
import { installedPresets, installSkills, listInstalled, removeSkills } from '../core/installer.js';

const help = `AI Builder Skills Pack

Usage: ai-builder-skills <command> [skill-id ...] [options]

Commands:
  init              Select skills and a preset interactively (TTY required)
  install <ids...>  Install one or more skills; --all selects the catalog
  list              Show available skills
  installed         List managed installations (all presets by default)
  remove <ids...>   Remove explicitly named, managed skills
  help              Show this help (also --help or -h)

Options:
  --preset <name>   generic | cursor | codex | claude
                    install defaults to generic; remove detects the preset when unambiguous
  --target <path>   Destination project (default: the directory you ran the command from)
  --all             Install all skills (init/install only)
  --force           Replace managed skills or remove modified owned files

Examples:
  ai-builder-skills init
  ai-builder-skills install security-auditor
  ai-builder-skills install security-auditor debugging-expert --preset codex --target ../app
  ai-builder-skills installed --target ../app
  ai-builder-skills remove security-auditor --target ../app

Noninteractive installs require skill IDs (or --all).
Unmanaged directories, unexpected files and symbolic links are never overwritten.
No network access, package installation, or agent configuration edits are performed.
`;

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === 'help') { console.log(help); return; }
  const manifest = await loadManifest();
  if (options.command === 'list') {
    for (const skill of manifest.skills) console.log(`${skill.id.padEnd(24)} ${skill.description}`);
    return;
  }
  if (options.command === 'installed') {
    let count = 0;
    for (const preset of options.preset ? [parsePreset(options.preset)] : presets) {
      for (const item of await listInstalled(options.target, await loadAdapter(preset))) {
        console.log(`${preset}\t${item.id}\t${item.version}\t${item.status}\t${item.directory}`);
        count++;
      }
    }
    if (!count) console.log('No managed skills installed. Manually copied skills are not tracked.');
    return;
  }
  if (options.command === 'remove') {
    if (!options.ids.length) throw new Error('remove requires one or more skill IDs.');
    if (options.preset) {
      await removeSkills(options.ids, options.target, await loadAdapter(parsePreset(options.preset)), options.force);
      for (const id of options.ids) console.log(`Removed ${id}`);
      return;
    }
    const byPreset = new Map<Preset, string[]>();
    for (const id of options.ids) {
      const found = await installedPresets(id, options.target);
      if (!found.length) throw new Error(`Not installed by this tool in any preset: ${id}. Run installed to see managed skills.`);
      if (found.length > 1) throw new Error(`${id} is installed for ${found.join(', ')}. Pass --preset to choose one.`);
      byPreset.set(found[0]!, [...(byPreset.get(found[0]!) ?? []), id]);
    }
    for (const [preset, ids] of byPreset) {
      await removeSkills(ids, options.target, await loadAdapter(preset), options.force);
      for (const id of ids) console.log(`Removed ${id} (${preset})`);
    }
    return;
  }
  if (options.command === 'init' && (!options.preset || (!options.ids.length && !options.all))) {
    if (!stdin.isTTY || !stdout.isTTY) throw new Error('Interactive init requires a terminal. Use init <skill-id> --preset <preset> --target <path>, or install --all --preset <preset>.');
    const prompt = createInterface({ input: stdin, output: stdout });
    try {
      if (!options.preset) options.preset = (await prompt.question(`Preset (${presets.join(', ')}) [generic]: `)).trim() || 'generic';
      parsePreset(options.preset);
      if (!options.ids.length && !options.all) {
        manifest.skills.forEach((skill, index) => console.log(`${index + 1}. ${skill.id} — ${skill.description}`));
        const answer = (await prompt.question('Choose IDs or numbers, separated by spaces/commas (or all): ')).trim();
        if (answer === 'all') options.all = true;
        else options.ids = [...new Set(answer.split(/[\s,]+/).filter(Boolean).map(value => /^\d+$/.test(value) ? manifest.skills[Number(value) - 1]?.id ?? value : value))];
      }
    } finally { prompt.close(); }
  }
  if (!options.ids.length && !options.all) throw new Error('Provide skill IDs (or --all). Use init for interactive selection.');
  if (!options.preset) {
    options.preset = 'generic';
    console.log('No --preset given; using generic (.ai-builder/skills). Choose cursor, codex or claude with --preset.');
  }
  await validateSkills();
  const selected = options.all ? manifest.skills : options.ids.map(id => {
    const skill = manifest.skills.find(item => item.id === id);
    if (!skill) throw new Error(`Unknown skill: ${id}. Run list to see available IDs.`);
    return skill;
  });
  const adapter = await loadAdapter(parsePreset(options.preset));
  for (const directory of await installSkills(selected, options.target, adapter, options.force)) console.log(`Installed ${directory}`);
  console.log('Read USAGE.md in each installed folder for loading instructions.');
}

main().catch((error: unknown) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
