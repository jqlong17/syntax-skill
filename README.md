# syntax-skill

`syntax-skill` is a reusable Codex skill that turns the central distinctions in Edward A. F. Gibson's *Syntax: A Cognitive Approach* into a practical theory layer for AI and agent design.

It is intended for systems where language is only one part of the problem: memory, dialogue, task decomposition, planning, tool use, verification, uncertainty, and multi-agent coordination. The skill helps an implementation team ask a prior question before adding more prompting: what structure, state, evidence, and control loop must exist outside the language model?

## What it provides

The skill contains one entrypoint and eight focused reference skills:

1. **Form vs. meaning**: keep fluent language separate from grounded world state.
2. **Dependency task representation**: convert requests into typed graphs of entities, actions, constraints, and dependencies.
3. **Noisy-channel inference**: treat input, retrieval, tools, and execution as channels with corruption and uncertainty.
4. **Lossy memory**: compress context while preserving provenance, confidence, scope, and recovery paths.
5. **Locality and state distance**: keep facts near the actions that consume them and reduce reference interference.
6. **Planning vs. generation**: separate task graphs, planning, execution, verification, and final wording.
7. **Multidimensional evaluation**: measure understanding, grounding, execution, verification, calibration, and repairability separately.
8. **Candidate generation vs. arbitration**: let the LLM propose; let tools, policies, schemas, validators, and humans decide.

## Why this matters for AI and agents

The core design risk in language-first systems is confusing a well-formed string with a solved task. This skill provides a compact vocabulary for avoiding that confusion:

- A dialogue manager can treat each turn as evidence about a dependency graph rather than as an isolated prompt.
- A memory system can summarize aggressively without losing the route back to original evidence.
- A planner can keep commitments and preconditions explicit instead of hiding them in generated prose.
- A tool-using agent can decide when to infer, when to ask, and when to verify.
- An evaluation suite can distinguish a bad interpretation from a bad plan, a failed tool call, or an unverified answer.

The result is a methodology skill, not a claim that the book directly specifies a modern agent architecture. The engineering patterns are explicitly marked as applications of source-grounded distinctions.

## Source traceability

Every domain reference includes a source locator with:

- book and author;
- chapter and section;
- printed page range;
- original EPUB XHTML file;
- section and pagebreak anchors such as `#hsec10-1` and `#pg_274`;
- retrieval terms for reopening the surrounding context.

The canonical citation map is [references/source-map.md](references/source-map.md). It is based on the original English EPUB, not on a summary or a retyped excerpt. The repository intentionally does not copy the full book.

## Installation

Copy the `syntax-skill` directory into the Codex skills directory, or invoke it explicitly as `$syntax-skill` after installation. Automatic discovery remains enabled through the standard skill metadata.

## Typical uses

- Design a long-term memory architecture for an assistant.
- Review a dialogue manager that loses entity bindings across turns.
- Build a task decomposition and planning protocol.
- Specify a tool-use and verification loop.
- Create evaluation dimensions for a multi-agent workflow.
- Analyze when an LLM output needs grounding, retrieval, or human approval.

## Validation

Run:

```bash
python3 /Users/ruska/.codex/skills/.system/skill-creator/scripts/quick_validate.py /path/to/syntax-skill
python3 /path/to/syntax-skill/scripts/validate_source_links.py /path/to/syntax-skill
```

The first command checks the Codex skill scaffold. The second checks that each domain reference contains chapter, page, XHTML, anchor, and retrieval guidance.

## License and attribution

This repository is an original methodology and indexing layer. It is based on the ideas and source locations in Edward A. F. Gibson's *Syntax: A Cognitive Approach*. It does not redistribute the full copyrighted book or the translated EPUB.
