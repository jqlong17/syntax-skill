# Source Assets And Licensing

## Book metadata

- Title: *Syntax: A Cognitive Approach*
- Author: Edward A. F. Gibson
- Publisher: The MIT Press
- eBook ISBN: `9780262385053`
- Canonical EPUB citation root: `OEBPS/xhtml/`

## Official English access

Use the publisher's official Open Access page first:

- [MIT Press book page](https://mitpress.mit.edu/9780262553575/syntax/)
- [MIT Direct Open Access edition](https://doi.org/10.7551/mitpress/15535.001.0001)
- [TedLab preprint](https://tedlab.mit.edu/tedlab_website/researchpapers/Syntax_Gibson_MITPress_2025.pdf)

The MIT Press page identifies the book as Open Access under `CC BY-NC-ND 4.0`. That license permits sharing the original material for noncommercial purposes with attribution, but it does not permit distributing modified or derivative versions. See the [license deed](https://creativecommons.org/licenses/by-nc-nd/4.0/).

## Why the full EPUBs are not committed here

The repository is public and is intended to remain a methodology and citation skill. The English EPUB currently available on the local machine came from a third-party filename and is not treated as the canonical publisher distribution. The Chinese EPUB is a translation derivative. To avoid provenance ambiguity and unauthorized public redistribution:

- the repository stores official source links and citation metadata;
- the repository does not commit the full English or Chinese EPUB files;
- users may keep local copies and point an Agent to the local files through the manifest below;
- a public Chinese EPUB should only be added after the relevant rights holder grants permission.

## Local resource manifest

These are the verified local files used to build the citation map on September 18, 2026. They are intentionally outside this repository.

| Edition | Local path | SHA-256 |
|---|---|---|
| English source EPUB | `/Users/ruska/Downloads/Syntax - A Cognitive Approach (Edward A. F. Gibson) (z-library.sk, 1lib.sk, z-lib.sk).epub` | `1801b1e080eadf0def64c07e1daafcd728281d632a7b6df551fb572a08eafb1f` |
| Chinese final EPUB | `/Users/ruska/Desktop/句法：认知取向（最终版）.epub` | `57915886a77a149d985242cfa01760b750a8f61a694b4e937295db97fe1c5884` |

If a user moves either file, update the local path and retain the hash. The original English EPUB's XHTML paths and IDs should remain unchanged for citations such as `OEBPS/xhtml/chapter_10.xhtml#hsec10-1` and `#pg_274`.

## Private resource workflow

For a local-only setup, create a private directory outside the Git repository and configure the Agent with:

```yaml
source_book:
  english_epub: /absolute/path/to/Syntax-English.epub
  chinese_epub: /absolute/path/to/Syntax-Chinese.epub
  citation_root: OEBPS/xhtml
  verify_sha256: true
```

Never replace an XHTML anchor with a guessed page number. Read the cited section, the nearby pagebreaks, and the referenced examples or notes before making a source-grounded claim.

## Citation examples

- Chapter 3 dependency structure: `OEBPS/xhtml/chapter_3.xhtml#hsec3-1` near `#pg_51`.
- Chapter 4 locality: `OEBPS/xhtml/chapter_4.xhtml#hsec4-5` near `#pg_117`.
- Chapter 10 noisy-channel processing: `OEBPS/xhtml/chapter_10.xhtml#hsec10-1` near `#pg_274`.
- Chapter 11 form and meaning: `OEBPS/xhtml/chapter_11.xhtml#ch11` near `#pg_299`.
