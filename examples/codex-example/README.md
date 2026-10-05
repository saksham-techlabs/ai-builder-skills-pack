# Codex example

This is a request template, not a sample audit with fabricated results.

## Install

From the pack checkout:

```sh
npm run cli -- install security-auditor --preset codex --target "../my-app"
```

## Use in the target application

Open the application in your agent. Attach or explicitly load `.agents/skills/security-auditor/SKILL.md`, then ask:

> Read .agents/skills/security-auditor/SKILL.md. Audit authentication and organization access. Do not change code. Separate confirmed findings from investigation items. Inspect the actual project before making claims. Cite evidence and report checks that could not be run.

Load the adjacent checklist/examples when relevant. Discovery behavior can vary by tool version; explicit file loading is the fallback.

## Review the response

Expect a scope/context summary, actual evidence, decisions or prioritized findings, relevant checks and exact next steps. A missing browser or database connection must be reported as a limitation, not simulated.

## Inspect and remove the installation

```sh
npm run cli -- installed --preset codex --target "../my-app"
npm run cli -- remove security-auditor --preset codex --target "../my-app"
```

Back up edits before using `--force`. Manually copied folders are not managed by the installer.

