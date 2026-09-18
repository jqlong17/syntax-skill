# syntax-skill

> The Chinese README is the default entry point: [README.md](README.md)

> Read the Chinese edition online: <https://shelf.notta.uk/book/6f8d032b-5775-43a1-ab7f-1e0c98da8e38>

`syntax-skill` is a reusable Codex skill that turns the central distinctions in Edward A. F. Gibson's *Syntax: A Cognitive Approach* into a practical theory layer for AI and agent design.

It is intended for systems where language is only one part of the problem: memory, dialogue, task decomposition, planning, tool use, verification, uncertainty, and multi-agent coordination. The skill asks a prior question before adding more prompting: what structure, state, evidence, and control loop must exist outside the language model?

## What it provides

The skill contains one entrypoint, a shared Agent Design Protocol, and eight focused domain references:

1. **Form vs. meaning**: keep fluent language separate from grounded world state.
2. **Dependency task representation**: convert requests into typed graphs of entities, actions, constraints, and dependencies.
3. **Noisy-channel inference**: treat input, retrieval, tools, and execution as channels with corruption and uncertainty.
4. **Lossy memory**: compress context while preserving provenance, confidence, scope, and recovery paths.
5. **Locality and state distance**: keep facts near the actions that consume them and reduce reference interference.
6. **Planning vs. generation**: separate task graphs, planning, execution, verification, and final wording.
7. **Multidimensional evaluation**: measure understanding, grounding, execution, verification, calibration, and repairability separately.
8. **Candidate generation vs. arbitration**: let the LLM propose; let tools, policies, schemas, validators, and humans decide.

The shared [Agent Design Protocol](references/agent-design-protocol.md) defines the state model, domain-card contract, observe-to-verify control loop, risk-sensitive gates, architecture deliverables, and falsification tests.

## Why this matters for AI and agents

The core design risk in language-first systems is confusing a well-formed string with a solved task. This skill gives an implementation team a compact vocabulary for keeping interpretation, world state, planning, execution, verification, memory, and communication separate.

## Source traceability

Every domain reference includes the book and author, chapter and section, printed page range, original EPUB XHTML file, section and pagebreak anchors, and retrieval terms for reopening the surrounding context. See [references/source-map.md](references/source-map.md).

The repository does not redistribute the full Chinese translation. See [references/source-assets.md](references/source-assets.md) for the official English open-access entry points, local file manifest, licensing notes, and private-resource workflow.

The translated Chinese edition is available for online reading through [NottaShelf](https://shelf.notta.uk/book/6f8d032b-5775-43a1-ab7f-1e0c98da8e38).

## Typical uses

- Design a long-term memory architecture for an assistant.
- Review a dialogue manager that loses entity bindings across turns.
- Build a task decomposition and planning protocol.
- Specify a tool-use and verification loop.
- Create evaluation dimensions for a multi-agent workflow.
- Analyze when an LLM output needs grounding, retrieval, or human approval.

## Tool compatibility

This repository supports both Codex and Cursor.

### Codex

Use `SKILL.md` as the entrypoint. Copy the repository into the Codex skills directory or invoke it explicitly as `$syntax-skill`.

### Cursor

Open this repository in Cursor to use the project rule at `.cursor/rules/syntax-skill.mdc`. The rule is agent-requested through its MDC frontmatter and routes Cursor to `SKILL.md`, the shared Agent Design Protocol, and only the domain references relevant to the current task. When copying it to another Cursor project, also copy `SKILL.md` and the `references/` directory so the relative paths and source map remain valid.

## Validation

```bash
python3 /Users/ruska/.codex/skills/.system/skill-creator/scripts/quick_validate.py /path/to/syntax-skill
python3 /path/to/syntax-skill/scripts/validate_source_links.py /path/to/syntax-skill
```

## License and attribution

This repository is an original methodology and indexing layer based on the ideas and source locations in Edward A. F. Gibson's *Syntax: A Cognitive Approach*. It does not redistribute the full book or the translated EPUB.
