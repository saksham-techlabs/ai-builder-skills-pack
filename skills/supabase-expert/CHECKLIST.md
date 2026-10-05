# Supabase Expert checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Inspect Supabase package versions, client factories, migrations, schema, functions and storage usage.
- [ ] Map browser, server, background-job and Edge Function clients; record credential types by variable name only.
- [ ] Identify tenant membership rules, Auth/session validation and access to local or hosted policy evidence.

## Execution

- [ ] RLS is enabled where required and grants do not undermine intended access.
- [ ] INSERT/UPDATE checks prevent forged owner_id or tenant_id; SELECT/DELETE restrictions match the access matrix.
- [ ] Service-role/secret keys stay server-only; public publishable/anon keys are not labeled secret merely because they are visible.
- [ ] Authenticated users still need resource ownership or tenant membership checks.
- [ ] Views, database functions and security-definer code cannot bypass isolation unexpectedly.
- [ ] Storage buckets, object paths, signed URLs and realtime subscriptions match data sensitivity.
- [ ] Server session validation uses the installed SDK's trustworthy validation path, not a blindly trusted cookie payload.

## Handoff

- [ ] Every in-scope resource has a documented identity and policy path.
- [ ] Owner/non-owner and cross-tenant checks are executed or explicitly pending.
- [ ] No privileged credential is exposed and no unapproved hosted changes are made.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

