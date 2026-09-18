# 7. Multidimensional Agent Evaluation

## Source-grounded idea

Chapter 2 distinguishes acceptability from grammaticality and shows that judgments are affected by lexical frequency, world knowledge, contextual appropriateness, syntax frequency, memory load, and other factors. Chapter 10 shows why graded acceptability can reflect rational inference rather than a binary grammar label.

## Agent application

Evaluate an agent on separate dimensions: goal understanding, argument completeness, grounding, tool selection, execution correctness, verification, uncertainty calibration, policy compliance, and recoverability.

## Design rules

- Keep correctness, usefulness, confidence, and acceptability as distinct metrics.
- Test the same task under lexical, contextual, memory, and tool-noise variations.
- Score partial progress and repair quality, not only final success.
- Include adversarial cases where a fluent answer is wrong but plausible.
- Record which failure mode caused the result: interpretation, planning, execution, verification, or communication.

## Review checklist

- What exactly does the evaluation score?
- Does a high score hide unsafe guessing or missing verification?
- Are long-context and interference failures measured separately?
- Can the evaluator tell a bad plan from a bad tool result?

## Source locator

Gibson, Ch. 2, sec. 2.1-2.4, pp. 22-50, `OEBPS/xhtml/chapter_2.xhtml#hsec2-1` near `#pg_22`, `#x1-190002.2.2` near `#pg_29`, `#x1-240002.2.7` near `#pg_33`, and `#hsec2-4` near `#pg_48`; Ch. 10, sec. 10.4, pp. 286-289, `OEBPS/xhtml/chapter_10.xhtml#hsec10-4` near `#pg_286`. Retrieve `acceptability`, `surprisal`, `frequency`, `world knowledge`, and `rational inference`.
