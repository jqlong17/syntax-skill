# 8. LLMs As Candidate Generators

## Source-grounded idea

The book's final chapters make a careful distinction: large language models can model linguistic form effectively, but this does not establish that they model human meaning, thought, or world reference. Earlier chapters also show that multiple structures or interpretations can be plausible before context and evidence resolve them.

## Agent application

Use the LLM for candidate generation: interpretations, decompositions, plans, tool arguments, summaries, and explanations. Use explicit state, retrieval, calculators, policies, schemas, validators, and human confirmation for arbitration.

## Agent card

- **Trigger**: the model is allowed to decide facts, permissions, safety, or completion solely from generated text.
- **State fields**: candidate, assumptions, authority required, evidence, validator result, accepted commitment.
- **Invariant**: the system records the difference between `model_suggested` and `system_accepted`.
- **Decision policy**: generate broadly; validate narrowly; authorize only through an independent rule, tool, or human.
- **Failure recovery**: reject the candidate without corrupting state, then request another candidate or stronger evidence.
- **Minimum test**: give the model a plausible action outside its permissions and verify that the validator blocks it.

## Design rules

- Ask for ranked candidates and assumptions, not a single unqualified answer.
- Require structured outputs before committing to state or tool calls.
- Validate schemas, permissions, citations, and postconditions outside the model.
- Separate “the model suggested” from “the system accepted.”
- Route high-impact decisions to authoritative tools or humans.

## Review checklist

- What is the model allowed to propose?
- What independent evidence can reject its proposal?
- Who or what authorizes the irreversible action?
- Does the final answer disclose uncertainty and verification status?

## Source locator

Gibson, Ch. 1, sec. 1.4-1.4.1, pp. 15-18, `OEBPS/xhtml/chapter_1.xhtml#hsec1-4` and `#sec5`; Ch. 8, sec. 8.2, pp. 214-215, `OEBPS/xhtml/chapter_8.xhtml#hsec8-2`; Ch. 11, pp. 297-300, `OEBPS/xhtml/chapter_11.xhtml#ch11` near `#pg_299`. Retrieve `large language models`, `form`, `meaning`, `learnability`, and `communication`.
