# SaaS Architect checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Map the actual product journey, actors, existing stack and deployment constraints.
- [ ] Inspect users, organizations, memberships, billing integration, usage tracking and background work.
- [ ] Record expected workload, budget and support capacity as sourced inputs or explicitly labeled assumptions.

## Execution

- [ ] Tenant identity cannot be chosen freely by an untrusted client.
- [ ] Membership revocation affects active sessions and background operations appropriately.
- [ ] Billing webhooks are verified, deduplicated and reconciled with provider state.
- [ ] Entitlements and quotas are checked on the operation that incurs cost.
- [ ] Downgrades, failed payments and account deletion have explicit data behavior.
- [ ] Cost assumptions, operational responsibilities and recovery limits are visible.

## Handoff

- [ ] The design protects tenant data and enforces paid capabilities server-side.
- [ ] Failure states, offboarding and operating ownership are specified.
- [ ] The first milestone is independently useful and estimates disclose their assumptions.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

