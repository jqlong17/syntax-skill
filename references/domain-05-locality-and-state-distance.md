# 5. Locality And State Distance

## Source-grounded idea

Chapter 4 studies dependency locality: longer or more interference-prone dependencies increase processing cost. Chapter 5 generalizes dependency-length minimization across languages and uses it to explain harmonic word-order patterns.

## Agent application

Conversation state has a reference distance too. If an action depends on a fact buried many turns away, the system is more likely to bind the wrong entity, parameter, or version. Keep active dependencies local through explicit state blocks and stage summaries.

## Design rules

- Put the current goal, active entities, constraints, and next action in a compact state block.
- Rebind pronouns and shorthand to stable IDs before tool calls.
- Refresh a stage summary after major transitions.
- Measure retrieval distance and interference, not just token count.
- Prefer task-local memory over globally similar memory when resolving references.

## Review checklist

- Which facts does the next action depend on?
- How far away are those facts from the action in the prompt and state store?
- Could another entity or task interfere with the same label?
- Is the active state regenerated after a tool result changes the plan?

## Source locator

Gibson, Ch. 4, sec. 4.1-4.8, pp. 99-134, `OEBPS/xhtml/chapter_4.xhtml#hsec4-1` near `#pg_100`, `#hsec4-5` near `#pg_117`, `#hsec4-6` near `#pg_120`, and `#hsec4-8` near `#pg_133`; Ch. 5, sec. 5.1-5.3, pp. 135-154, `OEBPS/xhtml/chapter_5.xhtml#hsec5-1` near `#pg_135` and `#hsec5-3` near `#pg_144`. Retrieve `dependency locality`, `distance`, `interference`, and `dependency length minimization`.
