# 6. Separate Planning From Generation

## Source-grounded idea

Chapter 3 describes grammar as a compressed system for organizing allowable combinations. Chapter 8 contrasts movement-based analyses with approaches that explain complexity through learned, structured relations and discusses learnability.

## Agent application

Natural-language generation should not be the sole planner. Use a staged pipeline: interpret, build a task graph, check constraints, plan, execute tools, verify results, update state, and then verbalize.

## Design rules

- Make the plan a typed intermediate representation, not a paragraph.
- Validate preconditions before execution and postconditions after execution.
- Keep plan generation and response wording as separate calls or modules when risk is material.
- Allow replanning after tool evidence; do not force the original narrative to remain consistent.
- Keep a complete execution trace independent of the final prose.

## Review checklist

- Can the plan be inspected without reading the generated explanation?
- Which constraints are checked before tools run?
- Which component decides that the task is complete?
- Can a tool failure trigger a local repair rather than a fabricated success message?

## Source locator

Gibson, Ch. 3, sec. 3.10, pp. 74-77, `OEBPS/xhtml/chapter_3.xhtml#hsec3-10` near `#pg_74`; Ch. 8, sec. 8.1-8.3, pp. 198-221, `OEBPS/xhtml/chapter_8.xhtml#hsec8-1` near `#pg_198` and `#hsec8-3` near `#pg_215`. Retrieve `compressed representation`, `movement`, `learnability`, and `complexity`.
