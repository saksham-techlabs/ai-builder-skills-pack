# Getting started

## Prepare the standalone folder

Use Node.js 22+ and npm. All commands in this guide run from the AI Builder Skills Pack root, not from a surrounding portfolio or application.

```sh
npm ci
npm run check
npm run cli -- list
```

The lockfile belongs to this project. Nothing requires the parent application's packages, Next.js, Git history or environment variables.

## Install into a target application

Interactive selection:

```sh
npm run cli -- init --target "../my-app"
```

Enter a preset and one or more IDs or menu numbers. Commas and spaces are accepted. Enter `all` only if you want the full catalog.

Noninteractive selection:

```sh
npm run cli -- install security-auditor debugging-expert --preset codex --target "../my-app"
```

A missing target directory is created. The current directory is the default, so use an explicit target while working from the pack checkout. Relative targets are resolved from the shell's current working directory.

## Load and verify

Open the copied `USAGE.md`, then explicitly ask your agent to read the adjacent `SKILL.md`. Give a narrow task and inspect the agent's first discovery steps. Installation alone does not verify that the agent loaded or followed the skill.

```sh
npm run cli -- installed --target "../my-app"
```

The output includes preset, ID, version, `unchanged`/`modified` and path. It tracks installer-owned copies, not arbitrary manually copied skills. It does not compare versions to a remote registry.

## Updating and removal

Updating from this checkout replaces the selected managed copy:

```sh
npm run cli -- install security-auditor --preset codex --target "../my-app" --force
```

Back up local changes first. The flag explicitly authorizes discarding edits to owned files. Added custom files cause refusal even with the flag; move them aside manually.

```sh
npm run cli -- remove security-auditor --preset codex --target "../my-app"
```

Removal requires `--force` if owned files changed or are missing. It refuses unowned or malformed installations. Empty preset parent directories remain.

## Troubleshooting

| Symptom | Next action |
| --- | --- |
| Interactive init requires a terminal | Run in an interactive terminal, or provide IDs and `--preset` |
| Already installed | Inspect/back up local edits; use `--force` only for intended replacement |
| Unmanaged directory or extra files | Move your files aside manually; the installer will not take ownership |
| Symbolic link or junction rejected | Use a real project directory with no linked ancestors; do not bypass the check |
| Installer lock exists | Confirm no installer process is running, then remove only the reported empty lock directory |
| Agent does not discover a skill | Check your installed tool's documentation and explicitly attach/read `SKILL.md` |
| Checks pass but agent output is weak | Record a sanitized task and actual behavior; improve the skill using that evidence |

## Verify before publishing

```sh
npm ci
npm run check
npm pack --dry-run
```

`npm pack` creates a local tarball; it does not publish. The `prepack` lifecycle runs the checks again. Test a tarball in a disposable directory to prove packaged file paths resolve independently.

Before any npm release, verify control of the package name, add real repository/homepage/bugs metadata to `package.json`, enable private GitHub reporting and review the included files. No publisher credentials or release automation are included.

