# Debugging Expert examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Duplicate submission

### Input

> Users sometimes create two orders after clicking Pay once. Find and fix the cause.

### Expected behavior

1. Inspect client submission, API retries and server idempotency; use a test payment environment.
2. Trace whether duplicate requests or duplicate processing creates the second record.
3. Fix the evidenced boundary and verify retry/concurrent-submission behavior.

### Expected output structure

Reproduction → request/effect trace → root cause → minimal fix → duplicate and normal-flow checks.

### Boundary

Do not charge real cards or assume the button alone is responsible.

## Example 2 — Cannot reproduce locally

### Input

> It works locally but crashes after deployment.

### Expected behavior

1. Compare sanitized deployment logs, runtime version, build command and required variable names.
2. Form hypotheses around observed differences and propose narrow read-only checks.
3. Report a diagnosis only when evidence discriminates among those hypotheses.

### Expected output structure

Environment comparison → supporting/contradicting evidence → next diagnostic command → verified cause or explicit unknown.

### Boundary

Do not invent deployment logs or expose variable values.

