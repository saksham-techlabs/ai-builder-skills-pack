import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run with npm run test:package so npm_execpath points to the current npm CLI.
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this check using npm run test:package.');
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await mkdtemp(path.join(os.tmpdir(), 'ai-builder-package-'));

function npm(args, cwd) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, encoding: 'utf8', timeout: 60000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

try {
  // check/build run separately; avoid recursively invoking prepack's checks.
  const packed = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root))[0];
  assert.ok(packed.files.some(file => file.path === 'dist/src/cli/index.js'));
  assert.ok(packed.files.some(file => file.path === 'skills/security-auditor/SKILL.md'));
  assert.ok(!packed.files.some(file => /^(node_modules|tests|src)\//.test(file.path)));
  const consumer = path.join(temporary, 'consumer');
  await mkdir(consumer);
  npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', path.join(temporary, packed.filename)], consumer);
  const exec = args => npm(['exec', '--offline', '--', 'ai-builder-skills', ...args], consumer);
  assert.match(exec(['--help']), /Usage: ai-builder-skills/);
  assert.match(exec(['list']), /blender-3d-expert/);
  const target = path.join(temporary, 'target with spaces');
  exec(['install', 'security-auditor', '--preset', 'codex', '--target', target]);
  assert.equal(await readFile(path.join(target, '.agents/skills/security-auditor/SKILL.md'), 'utf8'), await readFile(path.join(root, 'skills/security-auditor/SKILL.md'), 'utf8'));
  assert.match(exec(['installed', '--target', target]), /security-auditor/);
  exec(['remove', 'security-auditor', '--preset', 'codex', '--target', target]);
  console.log(`Packed ${packed.files.length} files. Offline install and npm executable help/list/install/installed/remove passed outside the source tree.`);
} finally {
  assert.equal(path.dirname(temporary), path.resolve(os.tmpdir()));
  assert.ok(path.basename(temporary).startsWith('ai-builder-package-'));
  await rm(temporary, { recursive: true, force: true });
}
