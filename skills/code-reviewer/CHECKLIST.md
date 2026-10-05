# Code Reviewer checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Establish the exact base/head or staged/working-tree scope; inspect status and do not overwrite changes.
- [ ] Read project instructions, changed files, surrounding code and relevant callers/tests.
- [ ] Identify public contracts, migrations, feature flags and deployment ordering touched by the change.

## Execution

- [ ] New branches preserve expected success and failure behavior.
- [ ] Changed APIs and schemas remain compatible with actual callers and mixed-version rollout.
- [ ] Resource ownership and tenant checks survive refactoring.
- [ ] Async work handles duplicate, cancelled and out-of-order execution where relevant.
- [ ] Tests assert the affected behavior and would catch the reported regression.
- [ ] Configuration changes do not silently weaken validation, error handling or build checks.

## Handoff

- [ ] Every reported defect is tied to the reviewed change and a defensible failure path.
- [ ] Relevant callers and compatibility constraints have been inspected.
- [ ] Executed checks and unresolved uncertainty are disclosed.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

