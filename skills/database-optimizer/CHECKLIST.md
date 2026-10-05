# Database Optimizer checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Identify database engine/version, ORM, schema, migrations and the exact query or ORM-generated SQL.
- [ ] Collect sanitized parameters, cardinality, index definitions, row estimates, query frequency and latency distribution where available.
- [ ] Identify production/staging access, replication, transaction isolation and migration tooling before running diagnostics.

## Execution

- [ ] Pagination and result limits bound rows read and returned.
- [ ] Composite index order matches filters, joins and ordering; duplicate indexes are identified.
- [ ] Query rewriting preserves null, duplicate and ordering semantics.
- [ ] Foreign keys, uniqueness and transactions protect invariants under concurrency.
- [ ] Long transactions and connection exhaustion are considered separately from SQL cost.
- [ ] Migration locking, disk headroom and backfill batch size are accounted for.

## Handoff

- [ ] The bottleneck is supported by evidence or explicitly remains a hypothesis.
- [ ] Proposed changes preserve result semantics and schema invariants.
- [ ] Measurement and rollout/rollback steps are reproducible.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

