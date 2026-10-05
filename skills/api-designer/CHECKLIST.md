# API Designer checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Read existing routes, schemas, generated clients and OpenAPI or equivalent contracts.
- [ ] Trace identity, resource ownership and error serialization conventions.
- [ ] Identify existing consumers, compatibility guarantees, payload sizes and retry behavior.

## Execution

- [ ] Input validation happens server-side before dangerous operations.
- [ ] Object and tenant ownership are checked independently of authentication.
- [ ] Responses allowlist fields and do not serialize internal records wholesale.
- [ ] Pagination bounds protect memory and database work.
- [ ] Error bodies are stable, useful and free of secrets or stack traces.
- [ ] Timeouts, rate limits, CORS and content types match the actual client model.

## Handoff

- [ ] Client and server agree on success and error shapes.
- [ ] Validation and authorization are enforced on the implemented path.
- [ ] Compatibility and retry behavior are tested or explicitly left unverified.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

