# Generic agent example

This is a request template, not a sample audit with fabricated results.

## Install

From the pack checkout:

```sh
npm run cli -- install debugging-expert --preset generic --target "../my-app"
```

## Use in the target application

Open the application in your agent. Attach or explicitly load `.ai-builder/skills/debugging-expert/SKILL.md`, then ask:

> Read .ai-builder/skills/debugging-expert/SKILL.md. Reproduce the failed settings save, trace the actual request and implement the smallest safe fix. Inspect the actual project before making claims. Cite evidence and report checks that could not be run.

Load the adjacent checklist/examples when relevant. Discovery behavior can vary by tool version; explicit file loading is the fallback.

## Review the response

Expect a scope/context summary, actual evidence, decisions or prioritized findings, relevant checks and exact next steps. A missing browser or database connection must be reported as a limitation, not simulated.

## Inspect and remove the installation

```sh
npm run cli -- installed --preset generic --target "../my-app"
npm run cli -- remove debugging-expert --preset generic --target "../my-app"
```

Back up edits before using `--force`. Manually copied folders are not managed by the installer.

