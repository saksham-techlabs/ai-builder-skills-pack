# Backend Architect checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Map entry points, services/modules, persistence, queues and external integrations.
- [ ] Identify authentication context, tenant boundaries and transaction ownership.
- [ ] Read deployment constraints, existing metrics, job/retry behavior and the team's operating capacity.

## Execution

- [ ] Each business invariant has a clear owner and enforcement boundary.
- [ ] Request-scoped identity is propagated safely to async work.
- [ ] Transactions do not hold database locks while waiting on slow external calls.
- [ ] Retries distinguish transient failure from invalid requests.
- [ ] Duplicate delivery cannot create duplicate irreversible side effects.
- [ ] Deploy order supports old and new code during rollout; recovery is documented.

## Handoff

- [ ] The design handles duplicates, partial failure and recovery explicitly.
- [ ] The proposal fits observed deployment and maintenance constraints.
- [ ] Migration and verification steps are concrete enough to implement.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

