# API Designer examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Project invitation endpoint

### Input

> Design an endpoint that invites teammates to a project.

### Expected behavior

1. Inspect membership roles, invitation model and existing endpoints.
2. Define who can invite, duplicate invitation semantics and email side effects.
3. Specify invalid email, existing member, expired invite and cross-project cases.

### Expected output structure

Actor matrix → request/response contract → duplicate behavior → error cases → verification.

### Boundary

Do not invent role names or assume sending an email is authorized by a design-only request.

## Example 2 — Pagination repair

### Input

> Our activity feed API skips items between pages.

### Expected behavior

1. Inspect the current ordering, cursor and concurrent inserts.
2. Identify whether tie-breaking or mutable sort values make the cursor unstable.
3. Propose a compatible cursor contract and test equal timestamps and inserts between requests.

### Expected output structure

Observed ordering → cursor invariant → contract/implementation change → edge-case results.

### Boundary

Do not claim cursor pagination fixes the bug without tracing how the current cursor is encoded and queried.

