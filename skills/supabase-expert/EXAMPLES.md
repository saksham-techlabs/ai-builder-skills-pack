# Supabase Expert examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Auth and RLS audit

### Input

> Audit my Supabase authentication and RLS.

### Expected behavior

1. Discover actual clients, session checks, migrations and policies.
2. Build an actor/operation matrix and trace owner and cross-tenant paths.
3. Report evidence-backed gaps; request sanitized live policy exports if hosted state is unavailable.

### Expected output structure

Scope/evidence → identity map → RLS matrix → confirmed findings ranked by impact → unknowns → safe verification steps.

### Boundary

Do not claim the live database is exposed based only on absent migration files.

## Example 2 — Private file sharing

### Input

> Make uploaded invoices accessible only to their organization.

### Expected behavior

1. Inspect bucket visibility, upload path formation and membership schema.
2. Design checks for upload, read, update and delete with the effective user identity.
3. Verify forged organization paths and signed-URL access in an isolated environment.

### Expected output structure

Current storage path → intended access matrix → policy/client changes → positive and negative tests.

### Boundary

Do not assume a private bucket prevents all unauthorized signed URL issuance.

