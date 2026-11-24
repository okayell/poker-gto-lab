#!/usr/bin/env python3
"""Builds standalone single-file HTML and portable web/PWA ZIP packages for GTO 撲克學院.

Outputs in dist/:
1. poker_gto_academy_single.html  — 100% self-contained single-file HTML (zero install, double-click anywhere offline).
2. poker_gto_academy_web.zip      — Full static website + PWA + Windows/Mac launchers, ready for Cloudflare Pages / Netlify Drop / GitHub Pages / Vercel.
"""
from __future__ import annotations

import json
import os
import re
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools import auto_questions  # pylint: disable=wrong-import-position

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
DIST_DIR = os.path.join(ROOT_DIR, 'dist')

MANIFEST_JSON = {
    'name': 'GTO 撲克學院 · 德州撲克從零到 GTO 教學練習工具',
    'short_name': 'GTO 撲克學院',
    'description': '54 堂圖解課程、30 天計畫、40 張 6-Max 翻前範圍表、14 種隨機練習模式與 262 個撲克術語百科。',
    'start_url': './index.html#/home',
    'display': 'standalone',
    'background_color': '#0d1012',
    'theme_color': '#0d1012',
    'icons': [
        {
            'src': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='28' fill='%23059669'/%3E%3Ctext x='64' y='88' font-size='76' text-anchor='middle' fill='%23fff'%3E%E2%99%A0%3C/text%3E%3C/svg%3E",
            'sizes': '192x192',
            'type': 'image/svg+xml',
        }
    ],
}

SW_JS = """\
// GTO 撲克學院 — Offline PWA Service Worker
const CACHE_NAME = 'poker-gto-academy-v2';
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const net = fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
"""

START_WIN_BAT = """\
@echo off
chcp 65001 >nul
title GTO 撲克學院 (Poker GTO Practice Studio)
echo ============================================================
echo   ♠ GTO 撲克學院 — 本機啟動工具
echo ============================================================
where python >nul 2>nul
if %errorlevel%==0 (
  echo 正在啟動本機網頁伺服器 http://127.0.0.1:8898 ...
  start "" "http://127.0.0.1:8898/#/home"
  python -m http.server 8898
) else (
  echo 未偵測到 Python，直接為您用瀏覽器開啟離線網頁版 ...
  start "" "%~dp0index.html"
)
"""

START_MAC_COMMAND = """\
#!/bin/bash
cd "$(dirname "$0")"
echo "============================================================"
echo "  ♠ GTO 撲克學院 — 本機啟動工具"
echo "============================================================"
if command -v python3 >/dev/null 2>&1; then
  echo "正在啟動本機網頁伺服器 http://127.0.0.1:8898 ..."
  (sleep 1 && (open "http://127.0.0.1:8898/#/home" 2>/dev/null || xdg-open "http://127.0.0.1:8898/#/home" 2>/dev/null)) &
  python3 -m http.server 8898
else
  open "./index.html" 2>/dev/null || xdg-open "./index.html" 2>/dev/null
fi
"""

README_MD = """\
# ♠ GTO 撲克學院（Poker GTO Practice Studio）— 外部安裝與免費架站指南

本工具為 **100% 純前端架構（HTML + CSS + Vanilla JS，零外部依賴、零 Google 內部套件依賴）**，所有課程進度、練習統計與錯題本皆自動儲存於使用者的瀏覽器 `localStorage` 中。

---

## 方式一：傳檔案給朋友直接打開（免安裝、完全離線）

1. **單一檔案版（最推薦傳給朋友）**：
   - 直接將 `poker_gto_academy_single.html` 透過 LINE、Telegram、Email、AirDrop 或雲端硬碟傳給朋友。
   - 對方收到後**不需要安裝任何軟體**，直接用 Chrome / Edge / Safari / Firefox 點兩下打開該 `.html` 檔，即可完整使用 54 堂課、30 天計畫、40 張範圍表與 14 種練習模式！
2. **完整資料夾版（本壓縮包）**：
   - 解壓縮後直接點兩下 `index.html`，或執行 `啟動_Windows.bat`（Windows）/ `啟動_Mac或Linux.command`（Mac/Linux）。

---

## 方式二：30 秒免費架成真正的公開網站（讓所有人用手機/電腦連上線）

因為本壓縮包已經是標準靜態網站（並內建 PWA 手機主畫面安裝設定），你可以用以下任一免費平台在 **30 秒內** 取得永久公開的 `https://` 網址：

### 🚀 選擇 A：Cloudflare Pages（最推薦：免費、全球 CDN 極快、免寫程式）
1. 用個人帳號登入 [Cloudflare Dashboard](https://dash.cloudflare.com/) → 左側點 **Workers & Pages** → **Create** → 切到 **Pages** 分頁 → 點 **Upload assets（直接上傳）**。
2. 輸入你喜歡的專案名稱（例如 `poker-gto-academy`，網址就會是 `https://poker-gto-academy.pages.dev`）。
3. 把這份 `poker_gto_academy_web.zip`（或解壓後的資料夾）直接拖曳進去 → 點 **Deploy site**。
4. **完成！** 把產生的 `https://xxxx.pages.dev` 網址傳給任何朋友，手機或電腦點開就能直接用（iPhone / Android 還可以在瀏覽器選單點「加入主畫面」當成 App 用）。

### ⚡ 選擇 B：Netlify Drop（拖拉 ZIP 立即上線）
1. 打開 [https://app.netlify.com/drop](https://app.netlify.com/drop)。
2. 直接把解壓縮後的資料夾（或 `poker_gto_academy_web.zip`）拖進網頁虛線框。
3. 5 秒內就會自動產生一個 `https://xxxx.netlify.app` 公開網址（也可在 Site settings 免費改成好記的子網域）。

### 🐙 選擇 C：GitHub Pages（適合用 Git 管理）
1. 在個人 GitHub 建立一個新的公開 Repository（例如 `poker-gto`）。
2. 將本壓縮包內的所有檔案上傳到該 Repo 根目錄。
3. 到 Repo 的 **Settings → Pages → Build and deployment**，Source 選 `Deploy from a branch`（`main` / `/ (root)`）並按 Save。
4. 1 分鐘後即可透過 `https://<你的GitHub帳號>.github.io/poker-gto/` 造訪。
"""


def is_stale() -> bool:
  single_out = os.path.join(DIST_DIR, 'poker_gto_academy_single.html')
  zip_out = os.path.join(DIST_DIR, 'poker_gto_academy_web.zip')
  if not (os.path.isfile(single_out) and os.path.isfile(zip_out)):
    return True
  dist_mtime = min(os.path.getmtime(single_out), os.path.getmtime(zip_out))
  for root, _, files in os.walk(STATIC_DIR):
    for fn in files:
      if os.path.getmtime(os.path.join(root, fn)) > dist_mtime:
        return True
  if auto_questions.mtime() > dist_mtime:
    return True
  return os.path.getmtime(os.path.abspath(__file__)) > dist_mtime


def build_all() -> dict[str, str]:
  os.makedirs(DIST_DIR, exist_ok=True)
  index_fp = os.path.join(STATIC_DIR, 'index.html')
  with open(index_fp, 'r', encoding='utf-8') as f:
    index_html = f.read()

  # 1. Build Single-File Standalone HTML
  css_fp = os.path.join(STATIC_DIR, 'styles.css')
  with open(css_fp, 'r', encoding='utf-8') as f:
    css_text = f.read()

  script_srcs = re.findall(r'<script\s+src="([^"]+)"\s*></script>', index_html)
  inline_scripts = ['<script>window.GTO_STATIC_ONLY = true;</script>']
  for src in script_srcs:
    clean_rel = src.split('?')[0].lstrip('/')
    if clean_rel == auto_questions.SCRIPT_REL:  # virtual script generated from data/
      js_code = auto_questions.script_js()
    else:
      js_fp = os.path.join(STATIC_DIR, clean_rel)
      with open(js_fp, 'r', encoding='utf-8') as f:
        js_code = f.read()
    # Prevent accidental </script> closing tag inside string literals
    js_code = js_code.replace('</script>', '<\\/script>')
    inline_scripts.append(f'<!-- {clean_rel} -->\n<script>\n{js_code}\n</script>')

  single_html = re.sub(
      r'<link\s+rel="stylesheet"\s+href="styles\.css[^"]*"\s*/?>',
      lambda _: f'<style>\n{css_text}\n</style>',
      index_html,
  )
  # Replace all <script src="..."></script> with the combined inline block at the first script position
  first_script = re.search(r'<script\s+src="[^"]+"\s*></script>', single_html)
  if first_script:
    start_idx = first_script.start()
    single_html = (
        single_html[:start_idx]
        + '\n'.join(inline_scripts)
        + '\n</body>\n</html>\n'
    )

  single_out = os.path.join(DIST_DIR, 'poker_gto_academy_single.html')
  with open(single_out, 'w', encoding='utf-8') as f:
    f.write(single_html)

  # 2. Build Web + PWA + Offline Launcher ZIP
  zip_out = os.path.join(DIST_DIR, 'poker_gto_academy_web.zip')
  pwa_head_inject = (
      '  <script>window.GTO_STATIC_ONLY = true;</script>\n'
      '  <link rel="manifest" href="manifest.webmanifest" />\n'
      '  <meta name="theme-color" content="#0d1012" />\n'
      '  <meta name="apple-mobile-web-app-capable" content="yes" />\n'
  )
  pwa_body_inject = (
      '  <script>\n'
      "    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {\n"
      "      window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));\n"
      '    }\n'
      '  </script>\n'
  )
  if '<head>' in index_html:
    web_index = index_html.replace('<head>', '<head>\n' + pwa_head_inject.rstrip('\n'), 1)
  else:
    web_index = index_html.replace('</head>', pwa_head_inject + '</head>', 1)
  web_index = web_index.replace('</body>', pwa_body_inject + '</body>', 1)

  with zipfile.ZipFile(zip_out, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    zf.writestr('index.html', web_index)
    zf.write(css_fp, 'styles.css')
    js_dir = os.path.join(STATIC_DIR, 'js')
    for fn in sorted(os.listdir(js_dir)):
      if fn.endswith('.js'):
        zf.write(os.path.join(js_dir, fn), f'js/{fn}')
    zf.writestr(auto_questions.SCRIPT_REL, auto_questions.script_js())
    zf.writestr('manifest.webmanifest', json.dumps(MANIFEST_JSON, ensure_ascii=False, indent=2))
    zf.writestr('sw.js', SW_JS)
    zf.writestr('啟動_Windows.bat', START_WIN_BAT.replace('\n', '\r\n'))
    mac_info = zipfile.ZipInfo('啟動_Mac或Linux.command')
    mac_info.external_attr = 0o755 << 16
    zf.writestr(mac_info, START_MAC_COMMAND)
    zf.writestr('README_外部安裝與免費架站指南.md', README_MD)

  return {
      'single_path': single_out,
      'single_bytes': os.path.getsize(single_out),
      'zip_path': zip_out,
      'zip_bytes': os.path.getsize(zip_out),
  }


if __name__ == '__main__':
  info = build_all()
  print(json.dumps(info, ensure_ascii=False, indent=2))
