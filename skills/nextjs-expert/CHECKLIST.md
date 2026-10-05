# Next.js Expert checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Read package metadata and lockfile for the installed Next.js and React versions; inspect node_modules/next/dist/docs when available.
- [ ] Map app/, pages/, layouts, route groups, handlers, proxy/middleware and runtime configuration actually present.
- [ ] Trace data access, session validation, cache directives and client boundaries for the requested route.

## Execution

- [ ] Server-only credentials and imports never cross a client boundary.
- [ ] Route handlers and server actions authorize independently of hidden UI or navigation guards.
- [ ] Dynamic parameters, cookies and headers follow installed-version APIs.
- [ ] Cache identity, lifetime and invalidation match tenant/user sensitivity.
- [ ] Loading, error and not-found boundaries preserve intended navigation.
- [ ] Hydration output is deterministic; browser-only APIs are used in appropriate contexts.

## Handoff

- [ ] The target route works in the relevant rendering and navigation modes.
- [ ] Authorization and cache isolation remain explicit.
- [ ] Installed-version checks and any unavailable runtime verification are recorded.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

