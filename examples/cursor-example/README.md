# Cursor example

This is a request template, not a sample audit with fabricated results.

## Install

From the pack checkout:

```sh
npm run cli -- install frontend-expert --preset cursor --target "../my-app"
```

## Use in the target application

Open the application in your agent. Attach or explicitly load `.cursor/skills/frontend-expert/SKILL.md`, then ask:

> Read .cursor/skills/frontend-expert/SKILL.md. Repair the settings form's loading, validation and retry states using our existing components. Inspect the actual project before making claims. Cite evidence and report checks that could not be run.

Load the adjacent checklist/examples when relevant. Discovery behavior can vary by tool version; explicit file loading is the fallback.

## Review the response

Expect a scope/context summary, actual evidence, decisions or prioritized findings, relevant checks and exact next steps. A missing browser or database connection must be reported as a limitation, not simulated.

## Inspect and remove the installation

```sh
npm run cli -- installed --preset cursor --target "../my-app"
npm run cli -- remove frontend-expert --preset cursor --target "../my-app"
```

Back up edits before using `--force`. Manually copied folders are not managed by the installer.

