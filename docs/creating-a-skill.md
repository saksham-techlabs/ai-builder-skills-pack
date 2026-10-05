# Creating a skill

## Choose a real boundary

Start with two user requests the skill should handle and one it should not. Identify which decisions a capable agent tends to get wrong. Put those decisions in the instructions; avoid generic roleplay and exhaustive background tutorials.

Use lowercase hyphenated IDs under 65 characters. The folder name, frontmatter `name` and manifest `id` must agree.

## Required files

```text
skills/your-skill/
├── SKILL.md
├── CHECKLIST.md
└── EXAMPLES.md
```

Use an existing focused skill as a structural reference, not as text to duplicate wholesale.

Start `SKILL.md` with this constrained frontmatter (single-line description; double quotes are supported):

```yaml
---
name: your-skill
description: "Describe the concrete capability and when it applies."
---
```

Use these exact second-level headings:

- `## Purpose`
- `## When to use`
- `## When NOT to use`
- `## Expert role`
- `## Repository discovery`
- `## Step-by-step workflow`
- `## Checks`
- `## Decision rules`
- `## Safety constraints`
- `## Expected output`
- `## Definition of done`
- `## Common mistakes`

The validator intentionally supports this small frontmatter subset rather than all YAML. Keep `name` first and `description` second. Link the companion files exactly as `[CHECKLIST.md](CHECKLIST.md)` and `[EXAMPLES.md](EXAMPLES.md)`.

## Write useful instructions

- Name actual artifacts to discover: route handlers, query plans, tenant membership rules, scene inventory or evaluation datasets.
- Describe a causal workflow, not a list of flattering role titles.
- Include rules for missing tools, missing context, conflicting evidence and uncertain versions.
- Separate audit permission from permission to implement, publish or mutate production.
- Require file evidence or executed checks for concrete findings.
- Define success in observable terms. A blocked check is not a passed check.
- Keep supporting procedures local to the skill so manually copied folders remain useful.

`CHECKLIST.md` needs actionable Markdown task items. `EXAMPLES.md` needs at least two `## Example 1` / `## Example 2` sections, each with input, expected behavior, expected output structure and an evidence/scope boundary. Do not populate fictional findings or metrics.

## Register the skill

Add an entry under `skills` in `skills.json`:

```json
{
  "id": "your-skill",
  "name": "Your Skill",
  "description": "A concise capability description.",
  "category": "quality",
  "tags": ["example"],
  "version": "0.1.0",
  "files": ["SKILL.md", "CHECKLIST.md", "EXAMPLES.md"],
  "recommendedFor": ["A concrete task type"]
}
```

The manifest uses `schemaVersion: 1`. Required strings must be nonempty, arrays must be nonempty with unique strings, IDs must be unique and versions use `x.y.z`. Unknown fields and additional source files are rejected. Supporting scripts/assets need an intentional schema and safety review before introduction.

## Validate structure and behavior

```sh
npm run validate
npm test
```

Then manually try a realistic task and an insufficient-context case using an available agent. Record the actual input, artifacts inspected, decisions and outcome. A heading validator cannot prove a skill is useful or that a model will obey it.

Update the README skill table and changelog. Increment the skill version when changing its behavior; increment the package version when cutting a package release. Do not duplicate the skill in an adapter.

