# Database Optimizer examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Slow tenant dashboard

### Input

> The dashboard's orders query takes several seconds. Optimize it.

### Expected behavior

1. Trace the real SQL, tenant filter, sort and page size.
2. Obtain a representative plan and separate pool wait from database execution.
3. Evaluate a query/index change and compare result equivalence and latency under the same workload.

### Expected output structure

Baseline → plan evidence → proposed change → correctness comparison → measured or pending performance checks.

### Boundary

Do not invent a composite index without inspecting filters and ordering.

## Example 2 — Batch import contention

### Input

> Our CSV importer makes other writes hang.

### Expected behavior

1. Inspect transaction size, constraints, retries and lock evidence.
2. Identify the competing statements and ordering of writes.
3. Propose bounded batches or consistent locking, then verify partial-failure recovery.

### Expected output structure

Lock/transaction evidence → contention path → safe batch design → retry and regression checks.

### Boundary

Do not disable constraints as a quick performance fix.

