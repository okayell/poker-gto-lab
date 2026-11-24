#!/usr/bin/env python3
"""Build clean static GitHub Pages site into docs/ (for main branch /docs hosting)."""
from __future__ import annotations

import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(ROOT, "static")
DOCS_DIR = os.path.join(ROOT, "docs")


def main() -> None:
    if os.path.exists(DOCS_DIR):
        shutil.rmtree(DOCS_DIR)
    shutil.copytree(STATIC_DIR, DOCS_DIR)
    # Prevent GitHub Pages Jekyll processing
    with open(os.path.join(DOCS_DIR, ".nojekyll"), "w", encoding="utf-8") as f:
        f.write("")
    print(f"Built standalone GitHub Pages bundle -> {DOCS_DIR}")


if __name__ == "__main__":
    main()
