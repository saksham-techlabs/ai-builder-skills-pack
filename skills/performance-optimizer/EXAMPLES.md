# Performance Optimizer examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Slow dashboard load

### Input

> Our dashboard loads slowly on mobile. Make it faster.

### Expected behavior

1. Measure the real route on a representative mobile profile.
2. Separate asset transfer, hydration/render work and data requests.
3. Change the dominant evidenced cost and repeat measurements with the same setup.

### Expected output structure

Metric/baseline → trace evidence → change → comparable measurements → functional checks.

### Boundary

Do not promise a Lighthouse score or a speedup before measuring.

## Example 2 — Rising worker memory

### Input

> Our background worker uses more memory every hour.

### Expected behavior

1. Inspect job lifetime, caches, listeners and workload.
2. Gather a bounded heap/memory timeline around repeated jobs.
3. Test the suspected retention path and verify job correctness after the fix.

### Expected output structure

Workload → memory evidence → retaining path → fix → repeated-run results.

### Boundary

Do not label ordinary allocation spikes a memory leak without retention evidence.

