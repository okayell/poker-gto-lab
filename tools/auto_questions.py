#!/usr/bin/env python3
"""Weekly auto-generated GTO theory questions (content only — never a version bump).

The generated questions live in `data/auto_questions.json` (outside `static/`, so the release
manager never sees them). They reach the page as the virtual script `js/auto_questions.js`:
`server.py` serves it dynamically and `tools/build_dist.py` inlines it into the GitHub bundle.
"""
from __future__ import annotations

import json
import os
from typing import Any

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUTO_FILE = os.path.join(ROOT_DIR, 'data', 'auto_questions.json')
SCRIPT_REL = 'js/auto_questions.js'


def load() -> list[dict[str, Any]]:
  try:
    with open(AUTO_FILE, encoding='utf-8') as f:
      data = json.load(f)
    return data if isinstance(data, list) else []
  except (OSError, ValueError):
    return []


def save(items: list[dict[str, Any]]) -> None:
  os.makedirs(os.path.dirname(AUTO_FILE), exist_ok=True)
  tmp = AUTO_FILE + '.tmp'
  with open(tmp, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=1)
  os.replace(tmp, AUTO_FILE)


def script_js() -> str:
  body = json.dumps(load(), ensure_ascii=False).replace('</', '<\\/')
  return ('/* GTO 撲克學院 — auto_questions.js：每週自動新增的理論題（內容更新，不進版號） */\n'
          'window.GTO = window.GTO || {};\nGTO.QUESTIONS = GTO.QUESTIONS || [];\n'
          f'GTO.AUTO_QUESTIONS = {body};\n'
          'GTO.AUTO_QUESTIONS.forEach(function (q) { q.auto = true; GTO.QUESTIONS.push(q); });\n')


def mtime() -> float:
  return os.path.getmtime(AUTO_FILE) if os.path.exists(AUTO_FILE) else 0.0
