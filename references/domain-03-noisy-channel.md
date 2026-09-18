# 3. Noisy-Channel Inference

## Source-grounded idea

Chapter 10 treats communication as inference through a noisy channel. A comprehender combines the observed signal with expectations about likely meanings, forms, and errors. Word order and acceptability are discussed as consequences of robust communication and rational inference.

## Agent application

Treat every input and output boundary as potentially noisy: speech recognition, OCR, user wording, retrieval, model generation, tool results, and execution. Infer when the cost of being wrong is low; confirm when risk or irreversibility is high.

## Agent card

- **Trigger**: input comes from ASR/OCR/retrieval/tools, or an inference depends heavily on a prior.
- **State fields**: observed signal, channel, candidate interpretations, priors, likelihood/evidence, risk level.
- **Invariant**: the system can distinguish observed text from inferred intent and from accepted state.
- **Decision policy**: infer only under a low-risk threshold; ask or verify for high-risk or irreversible steps.
- **Failure recovery**: preserve the raw signal, show the competing interpretations, and replay inference after corrected evidence arrives.
- **Minimum test**: inject a plausible typo and a rare but correct interpretation; verify that priors do not erase the signal.

## Design rules

- Maintain separate fields for observed text, candidate interpretation, prior assumptions, and evidence.
- Score or rank alternatives rather than collapsing uncertainty too early.
- Use risk-sensitive thresholds: low-risk defaults, high-risk confirmation.
- Model common corruption modes explicitly for each channel.
- Log which inference was made because of evidence and which because of prior expectation.

## Review checklist

- What noise model is assumed at each boundary?
- Can the system distinguish a likely user intent from a merely common one?
- Does confirmation happen before an irreversible action?
- Can the system explain whether a conclusion came from the signal, the prior, or a tool?

## Source locator

Gibson, Ch. 10, sec. 10.1-10.3, pp. 274-286, `OEBPS/xhtml/chapter_10.xhtml#hsec10-1` near `#pg_274` and `#hsec10-3` near `#pg_282`; sec. 10.4, pp. 286-289, `#hsec10-4` near `#pg_286`. Retrieve `noisy channel`, `rational inference`, `word order`, `prior`, and `likelihood`.
