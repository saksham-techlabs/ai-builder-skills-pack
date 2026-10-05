# Debugging Expert checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Collect the exact trigger, expected/actual behavior, error text, environment, versions and frequency.
- [ ] Inspect the relevant entry point, logs, recent diff and existing tests; preserve unrelated working-tree changes.
- [ ] Determine whether reproduction requires credentials, external services, timing or private data; request only missing essentials.

## Execution

- [ ] The reproduction matches the reported environment and trigger.
- [ ] Stack trace frames are followed to the originating failure rather than only the last exception.
- [ ] Async ordering, retries, stale state and concurrency are considered when behavior is intermittent.
- [ ] Configuration and data differences are distinguished from code defects.
- [ ] The fix preserves intended error handling and does not swallow exceptions.
- [ ] Regression coverage asserts observable behavior instead of mirroring implementation.

## Handoff

- [ ] The root cause is supported by a trace or discriminating experiment.
- [ ] The smallest justified change is implemented if requested.
- [ ] Original failure and relevant regressions are verified, or the fix is clearly marked pending verification.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

