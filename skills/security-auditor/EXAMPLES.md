# Security Auditor examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Supabase isolation review

### Input

> Use the security auditor skill to audit our Supabase auth and RLS.

### Expected behavior

1. Inspect actual session/client code, policies and privileged calls.
2. Trace resource IDs from requests into queries and test with owner/non-owner identities only if authorized tools exist.
3. Document live-state gaps separately from confirmed code-level findings.

### Expected output structure

Scope → trust map → confirmed findings with redacted file evidence → RLS coverage matrix → unknowns → prioritized fixes and tests.

### Boundary

No vulnerability claim is justified merely because the agent cannot access the hosted database.

## Example 2 — Upload endpoint audit

### Input

> Check whether our upload API is safe.

### Expected behavior

1. Trace authentication, object ownership, size limits, path construction, content processing and download behavior.
2. Inspect whether user-controlled files can execute or be served as active content.
3. Use benign local files for bounded checks; rank only observed weaknesses.

### Expected output structure

Upload/download flow → controls inspected → evidence-backed attack paths if any → fix and regression cases.

### Boundary

Do not upload malicious payloads to production or claim an exploit succeeded without execution evidence.

