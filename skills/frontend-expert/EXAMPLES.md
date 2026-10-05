# Frontend Expert examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Async search race

### Input

> The search results show the previous query when I type quickly. Fix it.

### Expected behavior

1. Locate the real input, request function and response state setter.
2. Reproduce delayed responses arriving out of order; inspect cancellation support.
3. Implement a request identity or cancellation fix following the existing client, then repeat fast typing and empty-query cases.

### Expected output structure

Trigger → observed request ordering → root cause with file evidence → minimal patch → race and regression checks.

### Boundary

Do not assume the cause is debouncing, or claim a browser reproduction without running it.

## Example 2 — Accessible settings dialog

### Input

> Add an account settings dialog using our existing design.

### Expected behavior

1. Inspect the shared dialog, form components and update endpoint.
2. Reuse the existing focus handling and form error pattern.
3. Verify opening, keyboard navigation, escape, failed save and focus return.

### Expected output structure

Reused components → state transitions → changed files → keyboard/network checks → remaining design questions.

### Boundary

Do not introduce another modal library if the current one can meet the request.

