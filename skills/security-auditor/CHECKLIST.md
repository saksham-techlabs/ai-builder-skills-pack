# Security Auditor checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Define assets, actors, trust boundaries, deployment surfaces and audit scope from actual code and configuration.
- [ ] Locate authentication/session code, authorization checks, APIs, database policies, file handlers, dependencies and environment variable references.
- [ ] Read lockfiles and security tooling; establish safe test identities and environments without displaying secrets.

## Execution

- [ ] Authentication validates session integrity, expiration and expected issuer/audience where applicable.
- [ ] Authorization covers object IDs, tenant IDs, role changes and every write path.
- [ ] RBAC rules fail closed and cannot be changed by client-submitted roles.
- [ ] RLS and data-layer checks apply to unprivileged users; service-role keys remain server-only.
- [ ] Environment variables, bundles, logs and error responses do not disclose secrets.
- [ ] API validation bounds types, sizes and allowed fields; injection sinks use safe APIs.
- [ ] Uploads constrain size, path, content handling and execution; metadata is not trusted.
- [ ] Rate limits, CORS and CSRF controls match actual credential and client behavior.
- [ ] Sensitive logs are redacted; dependency advisories match installed versions and scope.

## Handoff

- [ ] Every confirmed finding has evidence, impact and a testable fix.
- [ ] Authentication, authorization, secrets, APIs, data access and applicable platform controls have recorded coverage.
- [ ] Report distinguishes no finding observed from not inspected; no unsafe proof-of-concept was executed.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

