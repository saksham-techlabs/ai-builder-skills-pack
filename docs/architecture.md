# Architecture

## Design boundaries

This project is a standalone Node.js package. It has no imports from a surrounding portfolio and no Next.js dependency. Runtime code uses only Node built-ins. TypeScript and Node type declarations are development dependencies.

The package root is resolved relative to the compiled core module, not the user's working directory. The working directory is used only as the default installation target. This lets the npm executable run from any project.

## Data flow

1. `src/cli/args.ts` parses a small explicit command/option grammar.
2. `src/core/catalog.ts` validates `skills.json` and the canonical Markdown.
3. `src/core/adapters.ts` loads the selected path and usage template.
4. `src/core/installer.ts` preflights owned destinations, stages files and records hashes.
5. The user loads the copied `SKILL.md` in their agent. Installation itself never invokes the agent.

The catalog is authoritative for available IDs, metadata, versions and source files. The CLI does not maintain a separate hardcoded skill list.

## Canonical content and adapters

Every skill owns three Markdown files. Adapters contain only `adapter.json` and `USAGE.template.md`. The same canonical bytes are copied for every preset; only the destination and generated usage note differ.

Templates support `{{id}}` and `{{path}}`. No JavaScript evaluation, shell execution or remote template fetching occurs. Adapter paths are limited to a single dot-directory followed by `skills`.

Adding a skill requires no CLI changes. Adding a preset changes the preset allowlist and requires path/behavior tests. Additional source resources require an explicit schema/ownership extension.

## Ownership and mutations

Each installation has:

```text
<id>/
├── SKILL.md
├── CHECKLIST.md
├── EXAMPLES.md
├── USAGE.md
└── .ai-builder-install.json
```

The receipt contains schema version, package owner label, skill ID/version, preset and SHA-256 hashes of four owned files. The hashes detect missing/edited content; they do not authenticate the author.

Before replacement/removal, the installer checks the receipt, allowed file names, all existing path components and file types. Extra files are preserved by refusing the operation. It never recursively deletes an existing user-owned tree. `--force` does not bypass malformed receipts, extra files, path confinement or link checks.

Each preset's `skills/` directory has an exclusive empty `.ai-builder.lock` directory while mutations run. This serializes cooperating CLI instances. It does not prevent unrelated processes from changing files.

## Failure and recovery

- All selected IDs and sources are validated before installation. Existing-destination conflicts are preflighted across the selection before the first skill is committed.
- A new skill is written to a randomly named staging directory under the selected preset root, then renamed into place.
- For replacement, the previous managed directory is first renamed to a random backup. If the new rename fails, the old directory is restored when the filesystem permits it.
- After a successful replacement, only the known files in the backup are removed.
- A runtime disk/permission error can leave earlier skills installed. The error lists earlier committed paths; this is not a multi-skill transaction.
- A crash can leave `.ai-builder-stage-*`, `.ai-builder-backup-*` or `.ai-builder.lock`. After confirming no installer is running, inspect the reported root. Preserve backup contents, compare receipts and recover the desired folder manually before removing abandoned artifacts.
- Removal is not transactional. An interrupted removal may leave some owned files missing. Back up the remainder, then retry with `--force` if the receipt is still valid. If ownership metadata is gone, inspect and clean up manually.
- Do not automate recursive cleanup of these directories in a shared or untrusted workspace.

Filesystems with rename restrictions or hostile concurrent writers are outside the atomicity guarantee. Symlinks and Windows junctions are deliberately unsupported.

## Validation and verification

`npm run check` runs strict TypeScript checking, canonical-content/adapter validation and Node test-runner integration tests. Tests invoke the built CLI in fresh temporary directories, covering all presets, conflict protection, edited/missing files, removal, path traversal, malformed metadata, link refusal and manifest errors.

`npm run test:package` creates a local tarball without lifecycle recursion, installs it offline in a temporary consumer and invokes the actual npm executable for help, listing, installation, inspection and removal. It verifies assets resolve without the source checkout.

CI is configured for Windows/Linux and Node 22/24. Configured CI is not evidence that those remote jobs have already run. Skill validation proves structural consistency, not model behavior; human/agent evaluation fixtures are planned.

## Packaging and release

`npm run build` compiles `src/` and the validator under `dist/`. The npm file allowlist includes only `dist/src/`, canonical skills, adapters and end-user docs/examples, plus repository policies. Tests and authoring TypeScript remain in the GitHub source repository.

`prepack` runs the checks. No publish or GitHub upload script is present. The intended package name must be verified before use. Add real repository, bugs and homepage metadata once the standalone GitHub repository exists.

## Standalone GitHub extraction

These PowerShell steps are **manual instructions**, not actions performed by the installer. They create a sibling directory so no nested Git repository is initialized inside the portfolio.

```powershell
$packSource = 'C:\Users\Saksh\portfolio\oss\ai-builder-skills-pack'
$packDestination = 'C:\Users\Saksh\ai-builder-skills-pack'
if (Test-Path -LiteralPath $packDestination) {
    throw 'Destination exists. Choose a new empty sibling directory.'
}
New-Item -ItemType Directory -Path $packDestination
Get-ChildItem -LiteralPath $packSource -Force |
    Where-Object { $_.Name -notin @('node_modules', 'dist', '.git') } |
    Copy-Item -Destination $packDestination -Recurse
Set-Location -LiteralPath $packDestination
npm ci
npm run check
npm run test:package
```

Stop if any check fails. After reviewing the source:

```powershell
git init -b main
git add .
git commit -m "Initial AI Builder Skills Pack"
```

Create an empty public GitHub repository named **ai-builder-skills-pack** through GitHub, without an additional README or license. Replace YOUR_USERNAME below with your actual GitHub account:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ai-builder-skills-pack.git
git push -u origin main
```

Recommended description: **Evidence-first engineering skills for Cursor, Codex and Claude Code, with a safe TypeScript installer.**

Then enable private vulnerability reporting under GitHub repository settings, add the real repository URLs to `package.json` and review CI results. This does not publish to npm. Do not run `npm publish` until package ownership, metadata and release checks are separately ready.

## Source tree

Generated outputs `dist/` and installed dependencies `node_modules/` are ignored. The complete maintained file tree is:

```text
ai-builder-skills-pack/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── adapters/
│   ├── claude/
│   │   ├── USAGE.template.md
│   │   └── adapter.json
│   ├── codex/
│   │   ├── USAGE.template.md
│   │   └── adapter.json
│   ├── cursor/
│   │   ├── USAGE.template.md
│   │   └── adapter.json
│   └── generic/
│       ├── USAGE.template.md
│       └── adapter.json
├── docs/
│   ├── architecture.md
│   ├── creating-a-skill.md
│   ├── getting-started.md
│   └── workflow.svg
├── examples/
│   ├── codex-example/
│   │   └── README.md
│   ├── cursor-example/
│   │   └── README.md
│   └── generic-example/
│       └── README.md
├── package-lock.json
├── package.json
├── scripts/
│   └── validate-skills.ts
├── skills/
│   ├── ai-rag-engineer/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── api-designer/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── backend-architect/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── blender-3d-expert/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── code-reviewer/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── database-optimizer/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── debugging-expert/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── frontend-expert/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── nextjs-expert/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── performance-optimizer/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── saas-architect/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── security-auditor/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   ├── supabase-expert/
│   │   ├── CHECKLIST.md
│   │   ├── EXAMPLES.md
│   │   └── SKILL.md
│   └── ui-ux-reviewer/
│       ├── CHECKLIST.md
│       ├── EXAMPLES.md
│       └── SKILL.md
├── skills.json
├── src/
│   ├── cli/
│   │   ├── args.ts
│   │   └── index.ts
│   └── core/
│       ├── adapters.ts
│       ├── catalog.ts
│       ├── installer.ts
│       └── paths.ts
├── tests/
│   ├── cli.test.mjs
│   └── package-smoke.mjs
└── tsconfig.json
```

