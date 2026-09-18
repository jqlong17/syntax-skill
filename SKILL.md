---
name: syntax-skill
description: "Apply the cognitive-syntax methodology of Syntax: A Cognitive Approach to designing AI systems, LLM applications, memory, dialogue, planning, tool use, uncertainty handling, and agent evaluation. Use when a design needs an explicit bridge between linguistic form, meaning, structure, context, memory, and verification; do not use this as an EPUB translation workflow."
---

# Syntax Methodology

Use this skill as a theory-to-design layer for AI and agent systems. It is based on Edward A. F. Gibson's *Syntax: A Cognitive Approach* and deliberately separates the book's claims from engineering extrapolations.

## Core stance

- Treat linguistic form as evidence about an intended meaning, not as meaning itself.
- Represent user goals as dependency-structured objects: entities, relations, constraints, actions, and expected outcomes.
- Treat user input, memory retrieval, tool output, and execution traces as noisy channels.
- Allow memory to be lossy only when provenance, confidence, and a recovery path are retained.
- Keep high-value dependencies local in the active state: bind entities, parameters, and constraints near the step that consumes them.
- Separate candidate generation from planning, authorization, execution, verification, and final judgment.
- Evaluate agents across multiple dimensions instead of reducing quality to a single correct/incorrect label.
- Let an LLM propose interpretations and plans; let explicit state, tools, policies, and validators decide what is true or permitted.

## How to use the references

Read only the domain reference that matches the current design problem, then read `references/source-map.md` for the full citation scheme and neighboring context. Each domain file contains:

1. the book's source-grounded claim;
2. the engineering interpretation, clearly marked as an application;
3. concrete design rules and a review checklist;
4. exact EPUB file, section anchor, page range, and retrieval terms.

## Domain routing

- Form, meaning, and world state: `references/domain-01-form-vs-meaning.md`
- Dependency graphs and structured task representation: `references/domain-02-dependency-task-representation.md`
- Noisy-channel inference and robust communication: `references/domain-03-noisy-channel.md`
- Lossy memory and recoverable context: `references/domain-04-lossy-memory.md`
- Locality and active-state reference distance: `references/domain-05-locality-and-state-distance.md`
- Planning separated from language generation: `references/domain-06-planning-vs-generation.md`
- Acceptability as multidimensional agent evaluation: `references/domain-07-agent-evaluation.md`
- LLMs as candidate generators rather than final arbiters: `references/domain-08-llm-as-candidate-generator.md`

## Required output pattern

When using this skill to propose or review a system, produce:

1. a structured statement of the user's goal and the unresolved ambiguities;
2. a dependency/task graph with explicit entities, parameters, constraints, and state transitions;
3. a noise and uncertainty inventory, including what requires confirmation;
4. the memory layers and provenance/recovery strategy;
5. the separation between candidate generation, planning, execution, verification, and final response;
6. evaluation dimensions and failure-recovery paths;
7. citations to the source map, including chapter, section, page, XHTML file, and anchor.

Do not present an engineering extrapolation as if it were a direct quotation from the book. Do not copy the book wholesale into a prompt. Use short paraphrases, retrieval terms, and precise locations so a later model can reopen the original context.

## Source boundary

The primary source is the local EPUB edition of *Syntax: A Cognitive Approach* by Edward A. F. Gibson. The citation map is based on the original English XHTML files and their pagebreak anchors. The Chinese EPUB is a reading aid; it is not the canonical source for claims.
