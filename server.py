#!/usr/bin/env python3
"""GTO 撲克學院 (Poker GTO Practice Studio) — ThreadingHTTPServer Backend.

Serves the beginner-friendly Texas Hold'em / GTO learning studio: 54 illustrated
lessons (learning map from absolute beginner to GTO), 40 6-Max preflop range
charts, 11 endless randomized drill modes, a 200+ term glossary, tips / leaks /
cheat sheets / resources, and calculators — plus server-backed study progress.

Static text assets are gzip-compressed (cached per mtime) when the browser
accepts it; missing assets with a file extension return 404 instead of the SPA
shell so a not-yet-written content script never gets HTML as JavaScript.
"""
from __future__ import annotations

import argparse
import gzip
import json
import mimetypes
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
DATA_DIR = os.path.join(ROOT_DIR, 'data')
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
PROGRESS_FILE = os.path.join(DATA_DIR, 'progress.json')
SPA_ROUTES = ('home', 'learn', 'ranges', 'theory', 'quiz', 'glossary', 'wiki', 'tools', 'stats', 'feedback')

_GZ_CACHE: dict[str, tuple[float, bytes, bytes]] = {}
_GZ_LOCK = threading.Lock()


def _load_progress() -> dict:
  try:
    if os.path.isfile(PROGRESS_FILE):
      with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)
  except Exception:  # pylint: disable=broad-except
    pass
  return {}


def _save_progress(payload: dict) -> None:
  os.makedirs(DATA_DIR, exist_ok=True)
  tmp = PROGRESS_FILE + '.tmp'
  with open(tmp, 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
  os.replace(tmp, PROGRESS_FILE)


def _read_asset(fp: str) -> tuple[bytes, bytes]:
  """Returns (raw, gzipped) bytes for a static file, cached by mtime."""
  mtime = os.path.getmtime(fp)
  with _GZ_LOCK:
    hit = _GZ_CACHE.get(fp)
    if hit and hit[0] == mtime:
      return hit[1], hit[2]
  with open(fp, 'rb') as f:
    raw = f.read()
  gz = gzip.compress(raw, compresslevel=6)
  with _GZ_LOCK:
    _GZ_CACHE[fp] = (mtime, raw, gz)
  return raw, gz


class PokerGTOHandler(BaseHTTPRequestHandler):
  """HTTP handler for static assets and progress API."""

  def log_message(self, fmt: str, *args) -> None:  # noqa: D401
    return

  def _send_json(self, code: int, data: dict) -> None:
    raw = json.dumps(data, ensure_ascii=False).encode('utf-8')
    self.send_response(code)
    self.send_header('Content-Type', 'application/json; charset=utf-8')
    self.send_header('Cache-Control', 'no-store')
    self.send_header('Content-Length', str(len(raw)))
    self.end_headers()
    self.wfile.write(raw)

  def do_HEAD(self) -> None:  # noqa: N802
    self.send_response(200)
    self.send_header('Content-Type', 'text/html; charset=utf-8')
    self.end_headers()

  def do_GET(self) -> None:  # noqa: N802
    parsed = urlparse(self.path)
    path = parsed.path or '/'

    if path == '/api/progress':
      self._send_json(200, _load_progress())
      return
    if path == '/api/release_status':
      from tools import release_mgr  # pylint: disable=import-outside-toplevel
      self._send_json(200, release_mgr.get_release_status())
      return
    if path == '/api/feedback':
      from tools import feedback_mailer  # pylint: disable=import-outside-toplevel
      self._send_json(200, {'ok': True, 'items': feedback_mailer.list_feedback()})
      return
    if path == '/api/health':
      self._send_json(200, {'ok': True, 'service': 'poker-gto-studio'})
      return
    if path in ('/download/single', '/download/index.html', '/download/zip'):
      from tools import build_dist  # pylint: disable=import-outside-toplevel
      single_fp = os.path.join(DIST_DIR, 'poker_gto_academy_single.html')
      zip_fp = os.path.join(DIST_DIR, 'poker_gto_academy_web.zip')
      if not (os.path.isfile(single_fp) and os.path.isfile(zip_fp)) or build_dist.is_stale():
        build_dist.build_all()
      if path == '/download/index.html':
        target_fp = single_fp
        dl_name = 'index.html'
        dl_type = 'text/html; charset=utf-8'
      elif path == '/download/single':
        target_fp = single_fp
        dl_name = 'GTO_Poker_Academy_Standalone.html'
        dl_type = 'text/html; charset=utf-8'
      else:
        target_fp = zip_fp
        dl_name = 'GTO_Poker_Academy_Web_Package.zip'
        dl_type = 'application/zip'
      with open(target_fp, 'rb') as f:
        payload = f.read()
      self.send_response(200)
      self.send_header('Content-Type', dl_type)
      self.send_header('Content-Disposition', f'attachment; filename="{dl_name}"')
      self.send_header('Cache-Control', 'no-store')
      self.send_header('Content-Length', str(len(payload)))
      self.end_headers()
      self.wfile.write(payload)
      return

    if path == '/js/auto_questions.js':
      from tools import auto_questions  # pylint: disable=import-outside-toplevel
      payload = auto_questions.script_js().encode('utf-8')
      self.send_response(200)
      self.send_header('Content-Type', 'application/javascript; charset=utf-8')
      self.send_header('Cache-Control', 'no-cache')
      self.send_header('Content-Length', str(len(payload)))
      self.end_headers()
      self.wfile.write(payload)
      return

    rel = path.lstrip('/')
    if not rel or rel in SPA_ROUTES:
      rel = 'index.html'
    fp = os.path.normpath(os.path.join(STATIC_DIR, rel))
    if not fp.startswith(STATIC_DIR) or not os.path.isfile(fp):
      if os.path.splitext(rel)[1]:
        self.send_response(404)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', '9')
        self.end_headers()
        self.wfile.write(b'not found')
        return
      fp = os.path.join(STATIC_DIR, 'index.html')

    ctype, _ = mimetypes.guess_type(fp)
    if not ctype:
      ctype = 'application/octet-stream'
    is_text = ctype.startswith('text/') or ctype in ('application/javascript', 'application/json', 'image/svg+xml')
    if is_text:
      ctype += '; charset=utf-8'

    raw, gz = _read_asset(fp)
    use_gz = is_text and 'gzip' in (self.headers.get('Accept-Encoding') or '') and len(raw) > 1024
    body = gz if use_gz else raw
    self.send_response(200)
    self.send_header('Content-Type', ctype)
    self.send_header('Cache-Control', 'no-cache')
    if use_gz:
      self.send_header('Content-Encoding', 'gzip')
      self.send_header('Vary', 'Accept-Encoding')
    self.send_header('Content-Length', str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def do_POST(self) -> None:  # noqa: N802
    parsed = urlparse(self.path)
    if parsed.path == '/api/progress':
      length = int(self.headers.get('Content-Length', '0') or '0')
      raw = self.rfile.read(length) if length > 0 else b'{}'
      try:
        data = json.loads(raw.decode('utf-8'))
        if isinstance(data, dict):
          _save_progress(data)
          self._send_json(200, {'ok': True})
          return
      except Exception as e:  # pylint: disable=broad-except
        self._send_json(400, {'ok': False, 'error': str(e)})
        return
    if parsed.path == '/api/release_publish':
      length = int(self.headers.get('Content-Length', '0') or '0')
      raw = self.rfile.read(length) if length > 0 else b'{}'
      try:
        data = json.loads(raw.decode('utf-8'))
        from tools import release_mgr  # pylint: disable=import-outside-toplevel
        res = release_mgr.publish_release(
            bump_type=str(data.get('bump_type') or data.get('bump') or ''),
            title=str(data.get('title') or ''),
            highlights=data.get('highlights') or [],
        )
        with _GZ_LOCK:
          _GZ_CACHE.clear()
        self._send_json(200, res)
        return
      except Exception as e:  # pylint: disable=broad-except
        self._send_json(400, {'ok': False, 'error': str(e)})
        return
    if parsed.path == '/api/feedback':
      length = int(self.headers.get('Content-Length', '0') or '0')
      raw = self.rfile.read(length) if length > 0 else b'{}'
      try:
        data = json.loads(raw.decode('utf-8'))
        from tools import feedback_mailer  # pylint: disable=import-outside-toplevel
        res = feedback_mailer.submit_feedback(data if isinstance(data, dict) else {})
        self._send_json(200, res)
        return
      except ValueError as e:
        self._send_json(400, {'ok': False, 'error': str(e)})
        return
      except Exception as e:  # pylint: disable=broad-except
        self._send_json(500, {'ok': False, 'error': str(e)})
        return
    self._send_json(404, {'ok': False, 'error': 'not_found'})


def main() -> None:
  parser = argparse.ArgumentParser(description='GTO Poker Academy Web Server')
  parser.add_argument('--host', default='0.0.0.0')
  parser.add_argument('--port', type=int, default=8898)
  args = parser.parse_args()

  os.makedirs(DATA_DIR, exist_ok=True)
  httpd = ThreadingHTTPServer((args.host, args.port), PokerGTOHandler)
  print(f'GTO Poker Academy listening on http://{args.host}:{args.port}')
  httpd.serve_forever()


if __name__ == '__main__':
  main()
