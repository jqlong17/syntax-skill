# 1. Form Is Not Meaning

## Source-grounded idea

The book distinguishes the form of a language from the meanings and thoughts communicated through that form. Chapter 9 treats language as a communication system rather than the same thing as thought; Chapter 11 applies that distinction directly to large language models, arguing that models can represent linguistic form without thereby representing the meaning a person intends.

## Agent application

Never treat a fluent answer as proof that the system has a grounded world model. Keep explicit state for entities, facts, goals, permissions, time, and uncertainty. The LLM may map between forms, but the system needs other mechanisms to establish referents and verify world claims.

## Agent card

- **Trigger**: fluent output is being treated as proof of understanding, truth, or completion.
- **State fields**: `utterance`, `interpretation`, `world_state`, `commitment`, `provenance`.
- **Invariant**: no linguistic output becomes an external fact or commitment without grounding.
- **Decision policy**: paraphrase freely; ground facts and actions; confirm when the referent or consequence is material.
- **Failure recovery**: reopen the source or ask for the missing referent; do not polish an ungrounded claim.
- **Minimum test**: present identical wording under two different world states and check that the system asks for or retrieves the difference.

## Design rules

- Separate `utterance`, `interpretation`, `world_state`, and `commitment` objects.
- Require grounding for names, dates, quantities, locations, and external facts.
- Preserve alternative interpretations until evidence resolves them.
- Make translation, summarization, and paraphrase visibly different from factual verification.
- Add a provenance field to every state item that can affect an action.

## Review checklist

- Could the same fluent output be produced under two different world states?
- Which component resolves reference and temporal scope?
- Is the system claiming understanding when it has only generated a likely form?
- Can a reviewer trace a committed fact back to evidence?

## Source locator

Gibson, *Syntax: A Cognitive Approach*, Ch. 9, sec. 9.2, pp. 251-255, `OEBPS/xhtml/chapter_9.xhtml#hsec9-2` near `#pg_251`; Ch. 11, pp. 297-300, `OEBPS/xhtml/chapter_11.xhtml#ch11` near `#pg_299`. Retrieve the phrases `language vs. thought`, `communication`, `large language models`, `form`, and `meaning`.
