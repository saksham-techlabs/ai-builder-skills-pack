# Backend Architect examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Invoice generation job

### Input

> Move invoice generation out of the request so checkout is faster.

### Expected behavior

1. Trace checkout commit and current invoice side effects.
2. Identify how a durable invoice job can be recorded with the order.
3. Design idempotency, pending UI and recovery for worker crashes.

### Expected output structure

Current latency path → proposed durable handoff → duplicate/failure matrix → rollout and checks.

### Boundary

Do not assume a queue is already installed or that every invoice provider supports idempotency.

## Example 2 — Module boundaries

### Input

> Our API file does everything. Help split it safely.

### Expected behavior

1. Map existing handlers and shared database/business logic.
2. Choose modules around responsibilities without changing public behavior.
3. Move one vertical slice, preserving transaction boundaries and existing verification.

### Expected output structure

Responsibility map → minimal extraction sequence → compatibility evidence → deferred work.

### Boundary

Do not replace the framework or split deployments merely because the file is large.

