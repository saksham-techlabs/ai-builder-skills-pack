import { validateSkills } from '../src/core/catalog.js';
import { loadAdapter, presets } from '../src/core/adapters.js';

async function main(): Promise<void> {
  const manifest = await validateSkills();
  for (const preset of presets) await loadAdapter(preset);
  console.log(`Validated ${manifest.skills.length} skills and ${presets.length} adapters.`);
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
