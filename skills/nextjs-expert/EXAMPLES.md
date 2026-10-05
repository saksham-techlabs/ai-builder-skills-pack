# Next.js Expert examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Stale account page

### Input

> Our Next.js account page shows old data after saving.

### Expected behavior

1. Read versions, mutation code, read path and cache directives.
2. Determine whether staleness comes from server cache, client state or an unsaved mutation.
3. Select invalidation using the installed API and verify a second session cannot observe the first user's data.

### Expected output structure

Version/context → actual stale-data path → fix → mutation/navigation/isolation checks.

### Boundary

Do not prescribe revalidation APIs until their version and caching mode are known.

## Example 2 — Hydration mismatch

### Input

> Fix the hydration error on the dashboard.

### Expected behavior

1. Capture the actual warning and route.
2. Compare server and initial client values around dates, randomness, storage and conditional markup.
3. Fix the mismatched source and verify direct load plus subsequent navigation.

### Expected output structure

Warning evidence → mismatching render inputs → minimal change → reproduction outcome.

### Boundary

Do not hide the mismatch with suppression unless the mismatch is intentional and the tradeoff is documented.

