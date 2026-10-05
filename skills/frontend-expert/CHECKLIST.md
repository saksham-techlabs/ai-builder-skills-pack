# Frontend Expert checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Locate the route, component hierarchy, design tokens, shared controls and styling approach.
- [ ] Trace props, URL state, local state and server data ownership; inspect fetching and form conventions.
- [ ] Identify browser support, test tooling, accessibility expectations and available screenshots or design references.

## Execution

- [ ] Forms expose labels, validation messages and a usable submit state.
- [ ] Loading, empty, permission-denied and retry states are deliberate.
- [ ] Dialog focus is contained and restored; interactive elements use native semantics.
- [ ] Stale requests cannot overwrite newer input; effects clean up listeners and timers.
- [ ] Long content, zoom, reduced motion and narrow viewports remain usable.
- [ ] Sensitive or privileged decisions are enforced on the server, even if controls are hidden.

## Handoff

- [ ] The requested interaction covers success, failure and empty states.
- [ ] Existing design conventions and adjacent routes remain intact.
- [ ] Keyboard and responsive checks are recorded or handed off explicitly.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

