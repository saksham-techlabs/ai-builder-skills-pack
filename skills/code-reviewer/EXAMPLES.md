# Code Reviewer examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Membership permission diff

### Input

> Review this PR that changes organization membership permissions.

### Expected behavior

1. Read the exact diff and existing membership/authorization helpers.
2. Trace role changes and resource access for owner, member and outsider.
3. Report only demonstrated regressions with focused line references.

### Expected output structure

Review scope → prioritized findings if supported → verification evidence → coverage gaps.

### Boundary

Do not report a missing check if an unchanged shared helper already enforces it.

## Example 2 — No supported defect

### Input

> Review my staged pagination cleanup.

### Expected behavior

1. Inspect staged changes, sort order and API callers.
2. Check cursor stability, empty pages and existing pagination tests.
3. Discard speculative findings that are contradicted by actual code.

### Expected output structure

Intended behavior → confirmed findings or none → checks run → remaining uncertainty.

### Boundary

Do not invent a finding to make the review look useful.

