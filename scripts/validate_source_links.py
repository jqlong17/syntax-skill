#!/usr/bin/env python3
"""Check that every domain reference contains auditable source locators."""

from pathlib import Path
import re
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
refs = sorted((root / "references").glob("domain-*.md"))
required = [
    "Ch.",
    "pp.",
    "OEBPS/xhtml/chapter_",
    "#pg_",
    "Retrieve",
    "## Agent card",
    "**Trigger**",
    "**Invariant**",
    "**Decision policy**",
    "**Failure recovery**",
    "**Minimum test**",
]
errors = []
for path in refs:
    text = path.read_text(encoding="utf-8")
    missing = [token for token in required if token not in text]
    if missing:
        errors.append(f"{path.name}: missing {', '.join(missing)}")
    if not re.search(r"#(?:hsec|sec|ch|x1-)[^\s,;`]+", text):
        errors.append(f"{path.name}: no XHTML anchor found")

if errors:
    print("SOURCE LINK VALIDATION FAILED")
    print("\n".join(errors))
    raise SystemExit(1)

print(f"SOURCE LINK VALIDATION PASSED: {len(refs)} domain references")
