# SaaS Architect examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Team subscriptions

### Input

> Add team plans to my existing single-user SaaS.

### Expected behavior

1. Inspect user ownership, subscriptions and existing usage logic.
2. Plan organization membership and a compatible data migration.
3. Define seat counting, invitation races, failed payment and membership revocation behavior.

### Expected output structure

Current ownership → tenant model → entitlement/billing transitions → migration → staged acceptance checks.

### Boundary

Do not invent the billing provider, pricing or database tables.

## Example 2 — AI feature budget

### Input

> Can I offer document Q&A profitably on a small monthly plan?

### Expected behavior

1. Identify ingestion frequency, document size, query volume and retention assumptions.
2. Build cost formulas for ingestion, storage, retrieval and generation using verified prices only if available.
3. Propose enforceable limits and experiments to replace unknowns.

### Expected output structure

Known inputs → explicit assumptions → cost formula → abuse/limit controls → validation experiment.

### Boundary

Do not assert profitability or fabricate user demand.

