# Source Map

## Citation format

Use citations in this form:

> Edward A. F. Gibson, *Syntax: A Cognitive Approach*, Chapter X, section X.Y, pp. N-M, `OEBPS/xhtml/chapter_X.xhtml`, `#hsecX-Y` or `#secN`, plus a nearby `#pg_N` pagebreak anchor.

The printed page number is the book page represented by the EPUB's `pg_N` anchor. A section anchor identifies the beginning of the section; a page anchor identifies the local reading position. When a claim depends on an example, also record its example anchor such as `#x1-1680121`.

## High-value retrieval map

| Design topic | Primary source location | Useful retrieval terms |
|---|---|---|
| Form versus meaning, LLM limits | Ch. 9, sec. 9.2, pp. 251-255, `chapter_9.xhtml#hsec9-2`, `#pg_251`; Ch. 11, pp. 297-300, `chapter_11.xhtml#ch11`, `#pg_299` | language vs. thought; communication; large language models; form; meaning |
| Dependency structure | Ch. 3, sec. 3.1, pp. 51-53, `chapter_3.xhtml#hsec3-1`, `#pg_51`; sec. 3.3, pp. 56-61, `#hsec3-3`, `#pg_56` | heads; dependents; dependency tree; combinatorial rules; mutual information |
| Structured alternatives and constructions | Ch. 3, sec. 3.18-3.19, pp. 90-98, `chapter_3.xhtml#hsec3-18`, `#hsec3-19`; Ch. 7, sec. 7.8, pp. 183-195, `chapter_7.xhtml#hsec7-8` | ambiguity; long-distance dependency; constituency; semantic structure |
| Noisy-channel inference | Ch. 10, sec. 10.1-10.3, pp. 274-286, `chapter_10.xhtml#hsec10-1`, `#hsec10-3`; sec. 10.4, pp. 286-289, `#hsec10-4` | noisy channel; rational inference; word order; prior; likelihood |
| Lossy memory and forgetting | Ch. 2, sec. 2.2.7-2.2.10, pp. 33-40, `chapter_2.xhtml#x1-240002.2.7`, `#pg_33`; Ch. 10, sec. 10.5-10.6, pp. 289-296, `chapter_10.xhtml#hsec10-5`, `#hsec10-6` | memory overload; nested structures; lossy-context surprisal; forgetting |
| Locality and reference distance | Ch. 4, sec. 4.1-4.8, pp. 99-134, `chapter_4.xhtml#hsec4-1`, `#hsec4-8` | dependency locality; distance; interference; online processing |
| Dependency length and design economy | Ch. 5, sec. 5.1-5.3, pp. 135-154, `chapter_5.xhtml#hsec5-1`, `#hsec5-3` | dependency length minimization; harmonic order; compression |
| Planning, grammar, and learnability | Ch. 3, sec. 3.10, pp. 74-77, `chapter_3.xhtml#hsec3-10`; Ch. 8, sec. 8.1-8.3, pp. 198-221, `chapter_8.xhtml#hsec8-1`, `#hsec8-3` | compressed representation; movement; learnability; complexity |
| Evaluation and graded acceptability | Ch. 2, sec. 2.1-2.4, pp. 22-50, `chapter_2.xhtml#hsec2-1`, `#hsec2-4`; Ch. 10, sec. 10.4, pp. 286-289, `#hsec10-4` | acceptability; surprisal; frequency; world knowledge; rational inference |

## Chapter index

- Chapter 1: `OEBPS/xhtml/chapter_1.xhtml`, pp. 1-20. Especially `#hsec1-2`, `#hsec1-4`, and `#sec5`.
- Chapter 2: `OEBPS/xhtml/chapter_2.xhtml`, pp. 21-50. Especially `#hsec2-1`, `#x1-190002.2.2`, `#x1-240002.2.7`, `#hsec2-3`, and `#hsec2-4`.
- Chapter 3: `OEBPS/xhtml/chapter_3.xhtml`, pp. 51-98. Especially `#hsec3-1`, `#hsec3-3`, `#hsec3-10`, `#hsec3-18`, and `#hsec3-19`.
- Chapter 4: `OEBPS/xhtml/chapter_4.xhtml`, pp. 99-134. Especially `#hsec4-1`, `#hsec4-2`, `#hsec4-5`, `#hsec4-6`, and `#hsec4-8`.
- Chapter 5: `OEBPS/xhtml/chapter_5.xhtml`, pp. 135-154. Especially `#hsec5-1`, `#hsec5-2`, and `#hsec5-3`.
- Chapter 6: `OEBPS/xhtml/chapter_6.xhtml`, pp. 155-164. `#ch6` and `#sec1`.
- Chapter 7: `OEBPS/xhtml/chapter_7.xhtml`, pp. 165-195. Especially `#hsec7-1`, `#hsec7-2`, `#hsec7-3`, and `#hsec7-8`.
- Chapter 8: `OEBPS/xhtml/chapter_8.xhtml`, pp. 197-241. Especially `#hsec8-1`, `#hsec8-2`, `#hsec8-3`, and `#hsec8-4`.
- Chapter 9: `OEBPS/xhtml/chapter_9.xhtml`, pp. 243-272. Especially `#hsec9-1`, `#hsec9-2`, `#hsec9-3`, `#hsec9-4`, and `#hsec9-5`.
- Chapter 10: `OEBPS/xhtml/chapter_10.xhtml`, pp. 273-296. Especially `#hsec10-1`, `#hsec10-2`, `#hsec10-3`, `#hsec10-4`, `#hsec10-5`, and `#hsec10-6`.
- Chapter 11: `OEBPS/xhtml/chapter_11.xhtml`, pp. 297-300. Especially `#ch11` and `#pg_299`.

## Context retrieval protocol

When a citation is used, reopen the cited section, then inspect the preceding and following pagebreaks and any referenced example or note. Do not retrieve only the single sentence containing the claim. For engineering use, keep the citation and a one-line retrieval query together so another model can recover the surrounding argument.
