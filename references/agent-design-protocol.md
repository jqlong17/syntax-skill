# Agent Design Protocol

This file is the operational layer shared by all eight domains. Use it before turning a theoretical insight into prompts, memory schemas, tools, or orchestration code.

## 1. State model

Keep these objects distinct. They may live in one database, but they must not be conflated in a prompt or a log.

```yaml
utterance:
  text: "raw user or tool-facing string"
  source: user|asr|ocr|retrieval|tool|model
  observed_at: timestamp
interpretations:
  - id: interpretation-1
    intent: "candidate goal"
    assumptions: []
    confidence: 0.0
    evidence: []
world_state:
  entities: []
  facts: []
  permissions: []
  time_scope: null
task_graph:
  nodes: []
  edges: []
  unresolved: []
plan:
  steps: []
  preconditions: []
  postconditions: []
execution:
  tool_calls: []
  results: []
  verification: []
response:
  status: proposed|executing|verified|blocked|needs_confirmation
  claims: []
  citations: []
```

The exact schema can vary, but the boundaries should remain visible. A generated sentence is not automatically a fact, a plan, an execution result, or a verification record.

## 2. Domain card contract

When reading a domain reference, extract these seven items:

1. **Trigger**: what design symptom activates the domain?
2. **Objects**: which state objects or data structures are affected?
3. **Invariant**: what must remain true across turns or steps?
4. **Decision policy**: what makes the system infer, ask, defer, execute, or refuse?
5. **Failure modes**: what can go wrong and how is it detected?
6. **Verification**: what evidence can confirm or falsify the design?
7. **Source locator**: where can the book's surrounding argument be reopened?

If a domain cannot answer these questions, the design is still conceptual and needs another pass before implementation.

## 3. Standard control loop

Use this loop for dialogue, task execution, memory updates, and multi-agent work:

1. **Observe**: record the raw signal and source.
2. **Interpret**: produce one or more structured candidates.
3. **Bind**: resolve entities, parameters, constraints, time, and permissions.
4. **Plan**: build or update the dependency/task graph.
5. **Gate**: decide whether evidence is sufficient for the next irreversible step.
6. **Act**: call a tool or ask a targeted clarification.
7. **Verify**: check the result against explicit postconditions and authoritative evidence.
8. **Compress**: update durable memory with provenance and invalidation rules.
9. **Report**: state what was observed, done, verified, and left unresolved.

Do not let the report step silently create facts or mark a task complete.

## 4. Decision thresholds

Use a small policy table instead of vague confidence language:

| Situation | Default action |
|---|---|
| Low-risk ambiguity, reversible action, strong prior | Infer, record the assumption, continue |
| Ambiguity changes parameters but action is reversible | Ask a targeted clarification or branch candidates |
| High-risk, irreversible, permission-sensitive, or externally visible action | Confirm or obtain authoritative evidence before acting |
| Conflicting evidence | Preserve alternatives, surface conflict, do not average it away |
| Missing required dependency | Block the dependent step and request the missing value |
| Tool result violates postconditions | Mark execution as failed, repair or replan |

## 5. Minimum architecture output

For a design task, produce a compact table:

| Layer | Question | Required artifact |
|---|---|---|
| Interpretation | What could the user mean? | ranked candidates + assumptions |
| State | What is currently believed? | entities, facts, permissions, time scope |
| Task graph | What depends on what? | typed nodes and edges |
| Memory | What is retained or forgotten? | summary + provenance + rehydration path |
| Planning | What steps are allowed? | preconditions, steps, postconditions |
| Execution | What actually happened? | tool trace and raw results |
| Verification | Why trust the result? | checks, evidence, unresolved issues |
| Communication | What should be said? | status-aware response with uncertainty |

## 6. Cross-domain review

Before implementation, ask:

- Does every important claim have a source, tool result, or explicit assumption?
- Does every action have required arguments, preconditions, and a verification path?
- Can a later Agent recover why a decision was made?
- Are active dependencies close enough to avoid reference interference?
- Can the system stop safely instead of fabricating completion?
- Is the LLM proposing, deciding, or merely verbalizing at each step?

## 7. Falsification tests

Use at least one test from each applicable class:

- **Form/meaning**: same wording under two different world states.
- **Dependency**: missing, duplicated, or conflicting argument.
- **Noise**: ASR/OCR typo, stale retrieval, malformed tool output.
- **Memory**: compressed summary missing a negative constraint or provenance link.
- **Locality**: two entities share similar names across long context.
- **Planning**: tool failure after partial execution.
- **Evaluation**: fluent but ungrounded answer.
- **Authority**: model proposes an action it is not allowed to authorize.

The design is not ready when it succeeds only on the clean, single-turn case.

## 8. Worked miniature

Request: “Find the cheapest refundable flight for next Tuesday and book it.”

Do not treat this as one free-form generation step. Decompose it as:

```yaml
goal: book_flight
constraints:
  - price: minimize
  - refundable: required
  - date: unresolved_relative_date
dependencies:
  - resolve_date -> search_flights
  - search_flights -> compare_options
  - compare_options -> user_confirmation
  - user_confirmation -> purchase
evidence:
  - calendar_or_timezone_for_date
  - live_flight_search
  - fare_rules_for_refundability
gates:
  - do_not_purchase_before_confirmation
```

The language model may propose candidate dates, search parameters, and explanations. A date resolver, flight search, fare-rule source, and confirmation gate determine what is accepted. If a result is not refundable or the date is ambiguous, the system should block the dependent step instead of producing a polished booking narrative.
