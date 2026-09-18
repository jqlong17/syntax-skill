# 4. Lossy Memory With Recovery

## Source-grounded idea

The book links complexity, memory overload, nested dependencies, and forgetting. Chapter 10's resource-rational lossy-context surprisal account makes memory loss part of the processing model: earlier information can be forgotten, changing later expectations and processing cost.

## Agent application

Compression is acceptable only when the system retains enough metadata to reconstruct the decision context. A summary without provenance is not memory; it is an untraceable rewrite.

## Design rules

- Separate working memory, task memory, semantic memory, episodic memory, and evidence memory.
- Store source pointers, timestamps, confidence, scope, and invalidation conditions with compressed memories.
- Summarize around dependencies and unresolved decisions, not only around prose topics.
- Keep a reversible link from each summary claim to source messages, documents, or tool traces.
- Rehydrate context before a high-stakes action or when a dependency is missing.

## Review checklist

- What information is allowed to be forgotten?
- Can the system recover the source context for a summary claim?
- Does compression preserve negative constraints and unresolved questions?
- Does the system know when a stale memory must be revalidated?

## Source locator

Gibson, Ch. 2, sec. 2.2.7-2.2.10, pp. 33-40, `OEBPS/xhtml/chapter_2.xhtml#x1-240002.2.7` near `#pg_33`; Ch. 10, sec. 10.5-10.6, pp. 289-296, `OEBPS/xhtml/chapter_10.xhtml#hsec10-5` and `#hsec10-6`. Retrieve `memory overload`, `nested structures`, `lossy-context surprisal`, and `forgetting`.
