# Using {{id}} with Claude Code

This preset uses the project skill location documented for Claude Code. If discovery is unavailable or restricted, explicitly load the Markdown. No CLAUDE.md, tool permissions or global configuration is modified.

Open or attach `{{path}}` and ask:

> Read {{path}} and use it for the following scoped task: describe your task here. Inspect the actual project before making claims. Report evidence, unknowns and checks not run.

The canonical instructions are unchanged. CHECKLIST.md and EXAMPLES.md sit beside SKILL.md. Installing a skill does not execute it or grant additional permissions.

Review the copied instructions before loading them. Tool integration paths may evolve; see the package README for official documentation links and the manual fallback.

