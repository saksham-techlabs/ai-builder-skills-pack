# Contributing

Useful contributions improve decisions, verification or installation safety. More words alone are not an improvement.

## Local development

Use Node.js 22 or newer and npm. From this project's root:

```sh
npm ci
npm run check
npm run cli -- list
```

The installer has no runtime dependencies. TypeScript and Node type definitions are development-only dependencies. Keep package changes inside this repository.

## Skill contributions

Follow [Creating a skill](docs/creating-a-skill.md). Include a narrowly scoped description, actual discovery steps, decision rules that change engineering behavior, and at least two realistic inputs with expected procedures. Do not invent audited code, measurements, test results or users.

Keep one canonical source in `skills/`. Do not copy skill bodies into adapters. Update the manifest, README table and changelog when adding or materially changing a skill. Bump its version when its behavior changes.

## Installer contributions

Preserve refusal of unknown files, path traversal, symbolic links, malformed receipts and unconfirmed overwrites. Add behavior tests in `tests/cli.test.mjs` for meaningful safety or CLI changes. Use fresh temporary directories; never test removal on a real user's project. Avoid introducing shell execution or network calls into installation.

## Review checklist

- Describe the concrete user problem and new behavior.
- Include actual verification commands and results; distinguish checks not run.
- Review examples for secrets, fabricated results and unsupported tool claims.
- Run `npm run check`, `npm run test:package` and `npm pack --dry-run`.
- For a skill change, manually try a representative task and an insufficient-context case. Record what the agent actually did; schema validation cannot prove instruction quality.
- Explain compatibility and migration effects for adapter changes.

Open a focused pull request after a repository is published. Report sensitive vulnerabilities using [SECURITY.md](SECURITY.md), not a public issue.
