# Performance Optimizer checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Identify the slow journey, target device/network, workload, concurrency and expected budget.
- [ ] Inspect runtime/deployment versions, data path, asset pipeline, cache behavior and existing telemetry.
- [ ] Record available profiling tools and test environment differences; avoid assuming production access.

## Execution

- [ ] Cold and warm cache behavior are distinguished.
- [ ] Bundle and asset changes correspond to the actual route, device and network.
- [ ] Caching keys include all identity/tenant inputs and have a valid invalidation policy.
- [ ] Long tasks, unnecessary work and repeated round trips are measured before intervention.
- [ ] Memory tests distinguish retained objects from normal transient allocation.
- [ ] Load tests respect rate limits, test budgets and downstream services.

## Handoff

- [ ] The targeted bottleneck has measured evidence or is marked unverified.
- [ ] Comparisons use consistent workloads and cache conditions.
- [ ] Behavior and resource tradeoffs are reviewed alongside latency.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

