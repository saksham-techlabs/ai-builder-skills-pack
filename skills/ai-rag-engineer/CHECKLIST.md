# AI RAG Engineer checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Inspect document sources, ingestion/parsing, chunk metadata, embeddings, indexes, retrieval filters and generation code.
- [ ] Identify model/provider versions, context/token limits, data retention policies and available local alternatives.
- [ ] Collect representative queries and expected supporting sources, including unanswerable and cross-tenant cases.

## Execution

- [ ] Chunks retain stable source identity, version and location for citations.
- [ ] Updates and deletions invalidate indexes and relevant caches.
- [ ] Embedding dimensions and model versions match the index.
- [ ] Tenant/user filters run before content enters model or reranker context.
- [ ] Retrieved prompt injections cannot grant tool permissions or override task instructions.
- [ ] Unanswerable questions produce an honest limitation rather than invented citations.
- [ ] Evaluation includes difficult negatives, duplicate documents and stale evidence.

## Handoff

- [ ] Authorized source passages can be traced from ingestion to answer citations.
- [ ] Cross-tenant and unanswerable cases are evaluated or clearly pending.
- [ ] Quality, latency and cost claims come from recorded runs, not invented benchmarks.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

