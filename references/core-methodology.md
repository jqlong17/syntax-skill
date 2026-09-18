# Core Methodology

## One-sentence abstraction

Language form is structured evidence about meaning, not meaning itself. Reliable understanding therefore requires dependency structure, context, memory, world state, uncertainty handling, and verification.

## Eight propositions

### 1. Form is not meaning

Fluent language can be generated without grounded reference or correct world state. Keep utterance, interpretation, fact, and commitment separate.

### 2. Structure carries the work

Dependencies explain how local elements combine into larger meanings. For Agents, represent a request as a typed graph of entities, actions, arguments, constraints, prerequisites, and evidence.

### 3. Communication is noisy

Every boundary can corrupt information: speech recognition, user wording, retrieval, model generation, tool results, and execution. Preserve the observed signal, candidate interpretations, priors, and evidence separately.

### 4. Memory is resource-bounded

Compression and forgetting are not exceptional; they are part of processing under limited resources. A useful memory therefore stores provenance, scope, time, confidence, invalidation conditions, and a rehydration path.

### 5. Dependencies should stay local

Longer and more interference-prone dependencies cost more to process. Keep active entities, parameters, constraints, and next actions in a local state block and refresh it at stage boundaries.

### 6. Planning is not verbalization

Generated prose is not an execution plan. Use typed intermediate representations, preconditions, postconditions, gates, tool traces, verification, and bounded replanning.

### 7. Quality is graded and multidimensional

Acceptability and usefulness depend on more than formal well-formedness. Evaluate understanding, grounding, argument completeness, tool choice, execution, verification, calibration, policy compliance, and recoverability separately.

### 8. Candidate generation is not arbitration

LLMs are useful for proposing interpretations, plans, arguments, summaries, and explanations. Facts, permissions, safety decisions, and completion status require independent evidence, tools, policies, validators, or human approval.

## Engineering compression

The book-grounded distinctions can be compressed into this control loop:

```text
observe -> interpret -> bind -> structure -> gate -> act -> verify -> compress -> report
```

The central design discipline is:

```text
structure before inference
uncertainty before commitment
verification before completion
```

This is an engineering application of the book's ideas, not a claim that the book presents a modern Agent software stack in this exact form.

## Source anchors

- Form, meaning, and LLM limits: Ch. 9, sec. 9.2, pp. 251-255, `OEBPS/xhtml/chapter_9.xhtml#hsec9-2`; Ch. 11, pp. 297-300, `OEBPS/xhtml/chapter_11.xhtml#ch11` near `#pg_299`.
- Dependency structure: Ch. 3, sec. 3.1 and 3.3, pp. 51-61, `OEBPS/xhtml/chapter_3.xhtml#hsec3-1` and `#hsec3-3`.
- Locality and dependency distance: Ch. 4, pp. 99-134, `OEBPS/xhtml/chapter_4.xhtml#hsec4-1`; Ch. 5, pp. 135-154, `OEBPS/xhtml/chapter_5.xhtml#hsec5-1`.
- Noisy channel and rational inference: Ch. 10, pp. 274-296, `OEBPS/xhtml/chapter_10.xhtml#hsec10-1` near `#pg_274` and `#hsec10-5`.
- Acceptability and memory load: Ch. 2, pp. 22-50, `OEBPS/xhtml/chapter_2.xhtml#hsec2-1` and `#x1-240002.2.7`.
