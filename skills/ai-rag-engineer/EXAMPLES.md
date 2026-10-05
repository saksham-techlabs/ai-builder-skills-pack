# AI RAG Engineer examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Wrong-document answers

### Input

> Our document chatbot keeps answering from the wrong uploaded file.

### Expected behavior

1. Trace document IDs, retrieval filters and actual retrieved chunks for a failing query.
2. Check cache identity and ingestion metadata before modifying prompts.
3. Test the minimal fix with duplicate titles, multiple users and missing-answer cases.

### Expected output structure

Query/source evidence → retrieval/filter diagnosis → change → provenance/isolation regression checks.

### Boundary

Do not infer a prompt problem until the retrieved context is inspected.

## Example 2 — Local evaluation

### Input

> Add an evaluation process before we change our RAG pipeline.

### Expected behavior

1. Inspect existing fixtures and gather a small representative set with expected supporting passages.
2. Define recall/support, citation correctness, abstention and permission checks separately.
3. Provide an executable plan using available tooling and record only runs actually performed.

### Expected output structure

Dataset provenance → rubrics → baseline procedure → actual results or not-run status → comparison rules.

### Boundary

Do not fabricate evaluation scores or require paid model calls without authorization.

