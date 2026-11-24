#!/usr/bin/env node
/* GTO 撲克學院 — 內容資料驗證工具
 * 用法：node tools/validate_content.js
 * 依 index.html 的順序載入全部資料檔（不需瀏覽器），檢查課程 / 題庫 / 術語 / 知識庫的 schema、ID、站內連結與互動元件名稱。
 * 有 error 時 exit code = 1。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const JS = path.join(ROOT, 'static', 'js');

const BASE_FILES = ['core.js', 'evaluator.js', 'ranges.js', 'theory_part1.js', 'theory_part2.js', 'glossary.js', 'questions.js'];
const CONTENT_FILES = ['lessons_beginner.js', 'lessons_core_plus.js', 'lessons_postflop_plus.js', 'lessons_advanced_plus.js',
  'glossary_extra.js', 'knowledge.js', 'lesson_meta.js', 'postflop_spots.js', 'questions_extra.js', 'faq.js', 'study_plan.js', 'en_terms.js'];

const STAGES = ['beginner', 'basics', 'gto', 'preflop', 'postflop', 'advanced'];
const WIDGETS = ['hand-rankings', 'showdown-game', 'hand-walkthrough', 'position-table', 'hand-tiers', 'outs-table',
  'draw-outs-examples', 'pot-odds-mini', 'bet-size-table', 'preflop-cheatsheet'];
const QUIZ_MODES = ['preflop', 'paint', 'theory', 'math', 'terms', 'equity', 'mix', 'showdown', 'handname', 'outs', 'position', 'nuts', 'texture', 'spots'];
const WIKI_TABS = ['glossary', 'faq', 'tips', 'leaks', 'cheatsheet', 'resources'];
const GLOSS_CATS = ['gto', 'action', 'position', 'math', 'strategy', 'hand', 'board', 'player', 'basic', 'tournament', 'slang'];
const RES_CATS = ['book', 'site', 'blog', 'video', 'course', 'tool', 'solver', 'community', 'zh'];
const EXPECTED_NEW = {
  'lessons_beginner.js': ['welcome', 'hand-rankings', 'hand-flow', 'betting-actions', 'reading-board', 'starting-hands-101',
    'beginner-strategy', 'beginner-mistakes', 'etiquette', 'outs-odds'],
  'lessons_core_plus.js': ['fold-equity', 'blockers', 'blind-defense', 'squeeze-coldcall', 'limped-pots'],
  'lessons_postflop_plus.js': ['postflop-bet-types', 'draws-play', 'hand-reading', '3bet-pots', 'oop-play', 'river-decisions'],
  'lessons_advanced_plus.js': ['player-types', 'live-tells', 'mental-game', 'mtt-basics', 'icm-pushfold', 'game-formats',
    'solver-basics', 'game-selection', 'hand-review'],
};

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------------------
// 沙箱
// ---------------------------------------------------------------------------
const noop = () => {};
const fakeEl = () => ({ addEventListener: noop, appendChild: noop, querySelector: () => null, querySelectorAll: () => [], classList: { add: noop, remove: noop, toggle: noop }, style: {}, setAttribute: noop });
const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Map, Set, Promise, Symbol, Error, URLSearchParams,
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  location: { protocol: 'file:', hash: '', href: 'file:///index.html' },
  navigator: { userAgent: 'node' },
  fetch: () => Promise.reject(new Error('no fetch in validator')),
  document: { addEventListener: noop, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], createElement: fakeEl, body: fakeEl(), documentElement: fakeEl() },
  addEventListener: noop,
  requestAnimationFrame: (f) => setTimeout(f, 0),
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const loaded = [];
function load(file, optional) {
  const p = path.join(JS, file);
  if (!fs.existsSync(p)) { if (!optional) err('缺少必要檔案 ' + file); return false; }
  const src = fs.readFileSync(p, 'utf8');
  const before = {
    theory: (sandbox.GTO && sandbox.GTO.THEORY || []).length,
    q: (sandbox.GTO && sandbox.GTO.QUESTIONS || []).length,
  };
  try {
    vm.runInContext(src, sandbox, { filename: file });
  } catch (e) {
    err(file + ' 執行失敗：' + e.message);
    return false;
  }
  const G = sandbox.GTO || {};
  loaded.push({ file, lessons: (G.THEORY || []).slice(before.theory).map((l) => l.id), questions: (G.QUESTIONS || []).length - before.q });
  return true;
}
BASE_FILES.forEach((f) => load(f, false));
CONTENT_FILES.forEach((f) => load(f, true));
const G = sandbox.GTO || {};

// ---------------------------------------------------------------------------
// 共用工具
// ---------------------------------------------------------------------------
const lessons = G.THEORY || [];
const lessonIds = new Set();
lessons.forEach((l) => {
  if (lessonIds.has(l.id)) err('課程 id 重複：' + l.id);
  lessonIds.add(l.id);
});
const allGloss = (G.GLOSSARY || []).concat((G.GLOSSARY_EXTRA || []).map((g) => g));
const glossIds = new Set();
allGloss.forEach((g) => { if (g && g.id) glossIds.add(g.id); });
const scenarios = G.SCENARIOS || {};

function isHttps(u) { return typeof u === 'string' && /^https:\/\/[^\s]+\.[^\s]+/.test(u); }
function checkSources(where, sources, min) {
  if (!Array.isArray(sources) || sources.length < min) { err(where + ' sources 至少要 ' + min + ' 筆'); return; }
  sources.forEach((s, i) => {
    if (!s || typeof s.title !== 'string' || !s.title.trim()) err(where + ' sources[' + i + '] 缺 title');
    if (!s || !isHttps(s.url)) err(where + ' sources[' + i + '] url 必須是 https 網址：' + (s && s.url));
  });
}

function checkRoute(where, href) {
  const raw = href.replace(/^#\/?/, '');
  const [p, q] = raw.split('?');
  const segs = p.split('/').filter(Boolean);
  const page = segs[0] || 'home';
  const sub = segs[1] || '';
  const ok = (() => {
    switch (page) {
      case 'home': case 'tools': case 'stats': case 'feedback': case 'play': case 'replay': return true;
      case 'learn': case 'theory': return !sub || lessonIds.has(sub);
      case 'ranges': return !sub || !!scenarios[sub];
      case 'quiz':
        if (sub && !QUIZ_MODES.includes(sub)) return false;
        if (q) {
          const m = /topic=([^&]+)/.exec(q);
          if (m && !lessonIds.has(decodeURIComponent(m[1]))) return false;
        }
        return true;
      case 'wiki':
        if (sub && !WIKI_TABS.includes(sub)) return false;
        if (sub === 'glossary' && segs[2] && !glossIds.has(segs[2])) return false;
        return true;
      case 'glossary': return !sub || glossIds.has(sub);
      default: return false;
    }
  })();
  if (!ok) err(where + ' 站內連結無效：' + href);
}

const CARD_RE = /^([AKQJT98765432][shdc])+$/;
function checkHtml(where, html) {
  if (typeof html !== 'string') { err(where + ' 不是字串'); return; }
  if (/<h[12][\s>]/i.test(html)) err(where + ' 不可使用 <h1>/<h2>，請從 <h3> 開始');
  if (html.includes('${')) err(where + ' 含有 ${');
  for (const tag of ['div', 'table', 'ul', 'ol', 'tr', 'span', 'strong']) {
    const open = (html.match(new RegExp('<' + tag + '[\\s>]', 'gi')) || []).length;
    const close = (html.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
    if (open !== close) err(where + ' <' + tag + '> 開關標籤數不一致（' + open + ' vs ' + close + '）');
  }
  let m;
  const reChart = /data-scenario="([^"]+)"/g;
  while ((m = reChart.exec(html))) if (!scenarios[m[1]]) err(where + ' embed-chart scenario 不存在：' + m[1]);
  const reWidget = /data-widget="([^"]+)"/g;
  while ((m = reWidget.exec(html))) if (!WIDGETS.includes(m[1])) err(where + ' 互動元件名稱無效：' + m[1]);
  const reHref = /href="(#[^"]*)"/g;
  while ((m = reHref.exec(html))) checkRoute(where, m[1]);
  const reCards = /<span class="cards">([^<]*)<\/span>/g;
  while ((m = reCards.exec(html))) {
    const c = m[1].replace(/\s+/g, '');
    if (!CARD_RE.test(c)) err(where + ' .cards 內容格式錯誤（需為 AsKh 這種格式）：' + m[1]);
  }
  const reHand = /<span class="hand">([^<]*)<\/span>/g;
  while ((m = reHand.exec(html))) {
    const t = m[1].trim();
    if (G.normHand && !G.normHand(t) && !/[+\-–,]/.test(t) && !/^[AKQJT2-9xX]{1,2}[so]?$/.test(t)) warn(where + ' .hand 不是標準 169 手牌寫法（例如 AKs / TT / 72o）：' + t);
  }
}

// ---------------------------------------------------------------------------
// 1. 課程
// ---------------------------------------------------------------------------
lessons.forEach((l) => {
  const w = '課程[' + l.id + ']';
  ['id', 'part', 'title', 'icon', 'summary', 'html'].forEach((k) => { if (typeof l[k] !== 'string' || !l[k].trim()) err(w + ' 缺少欄位 ' + k); });
  if (![1, 2, 3].includes(l.level)) err(w + ' level 必須是 1–3');
  if (typeof l.minutes !== 'number' || l.minutes <= 0) err(w + ' minutes 必須是正數');
  if (!Array.isArray(l.keyPoints) || l.keyPoints.length < 3) err(w + ' keyPoints 至少 3 條');
  checkHtml(w + '.html', l.html || '');
  if (l.stage !== undefined) {
    if (!STAGES.includes(l.stage)) err(w + ' stage 無效：' + l.stage);
    if (typeof l.tldr !== 'string' || l.tldr.length < 10) err(w + ' 缺少 tldr（一句話重點）');
    if (typeof l.plain !== 'string' || l.plain.length < 20) err(w + ' 缺少 plain（白話比喻）');
    checkSources(w, l.sources, 2);
    const nh3 = (l.html.match(/<h3[\s>]/g) || []).length;
    if (nh3 < 3) warn(w + ' 建議至少 3 個 <h3> 小節（目前 ' + nh3 + '）');
    if (l.html.length < 3000) warn(w + ' 內文偏短（' + l.html.length + ' 字元）');
  }
});
Object.entries(EXPECTED_NEW).forEach(([file, ids]) => {
  if (!fs.existsSync(path.join(JS, file))) return;
  ids.forEach((id) => { if (!lessonIds.has(id)) err(file + ' 缺少指定課程 id：' + id); });
});

// ---------------------------------------------------------------------------
// 2. 題庫
// ---------------------------------------------------------------------------
const qIds = new Set();
const qPerTopic = {};
(G.QUESTIONS || []).forEach((q, i) => {
  const w = '題目[' + (q && q.id || '#' + i) + ']';
  if (!q || !q.id) { err(w + ' 缺 id'); return; }
  if (qIds.has(q.id)) err('題目 id 重複：' + q.id);
  qIds.add(q.id);
  if (!lessonIds.has(q.topic)) err(w + ' topic 不是存在的課程 id：' + q.topic);
  qPerTopic[q.topic] = (qPerTopic[q.topic] || 0) + 1;
  if (![1, 2, 3].includes(q.lv)) err(w + ' lv 必須是 1–3');
  if (typeof q.q !== 'string' || q.q.length < 6) err(w + ' 題目文字過短');
  if (!Array.isArray(q.opts) || q.opts.length !== 4) err(w + ' opts 必須剛好 4 個');
  else {
    if (q.opts.some((o) => typeof o !== 'string' || !o.trim())) err(w + ' opts 不可有空字串');
    if (new Set(q.opts).size !== 4) err(w + ' opts 不可重複');
  }
  if (![0, 1, 2, 3].includes(q.ans)) err(w + ' ans 必須是 0–3');
  if (typeof q.exp !== 'string' || q.exp.length < 10) err(w + ' exp 詳解過短');
  if (/<[a-z][^>]*>/i.test((q.q || '') + (q.opts || []).join('') + (q.exp || ''))) warn(w + ' 題目/選項/詳解含 HTML 標籤（會被當純文字顯示）');
});
lessons.filter((l) => l.stage !== undefined).forEach((l) => {
  if ((qPerTopic[l.id] || 0) < 5) err('課程[' + l.id + '] 題目少於 5 題（目前 ' + (qPerTopic[l.id] || 0) + '）');
});

// ---------------------------------------------------------------------------
// 3. 術語補充
// ---------------------------------------------------------------------------
const baseGlossIds = new Set((G.GLOSSARY || []).map((g) => g.id));
const extraSeen = new Set();
(G.GLOSSARY_EXTRA || []).forEach((g, i) => {
  const w = '術語[' + (g && g.id || '#' + i) + ']';
  if (!g || !g.id) { err(w + ' 缺 id'); return; }
  if (baseGlossIds.has(g.id)) err(w + ' id 與既有 glossary.js 重複');
  if (extraSeen.has(g.id)) err(w + ' id 重複');
  extraSeen.add(g.id);
  ['term', 'zh', 'short', 'def'].forEach((k) => { if (typeof g[k] !== 'string' || !g[k].trim()) err(w + ' 缺少欄位 ' + k); });
  if (!Array.isArray(g.aka)) err(w + ' aka 必須是陣列');
  if (!GLOSS_CATS.includes(g.cat)) err(w + ' cat 無效：' + g.cat);
  if (![1, 2, 3].includes(g.imp)) err(w + ' imp 必須是 1–3');
  if (g.ex !== undefined && typeof g.ex !== 'string') err(w + ' ex 必須是字串');
  if (!Array.isArray(g.rel)) err(w + ' rel 必須是陣列');
  else g.rel.forEach((r) => { if (!glossIds.has(r)) warn(w + ' rel 找不到術語 id：' + r); });
  checkHtml(w + '.def', g.def || '');
  if (g.ex) checkHtml(w + '.ex', g.ex);
});

// ---------------------------------------------------------------------------
// 4. 知識庫
// ---------------------------------------------------------------------------
if (G.TIPS) {
  const cats = new Set((G.TIP_CATS || []).map((c) => c.id));
  if (!cats.size) err('knowledge.js 缺少 TIP_CATS');
  const seen = new Set();
  G.TIPS.forEach((t, i) => {
    const w = '技巧[' + (t && t.id || '#' + i) + ']';
    if (!t || !t.id) { err(w + ' 缺 id'); return; }
    if (seen.has(t.id)) err(w + ' id 重複');
    seen.add(t.id);
    if (!cats.has(t.cat)) err(w + ' cat 不在 TIP_CATS：' + t.cat);
    if (![1, 2, 3].includes(t.level)) err(w + ' level 必須是 1–3');
    if (typeof t.title !== 'string' || !t.title.trim()) err(w + ' 缺 title');
    if (typeof t.text !== 'string' || t.text.length < 10) err(w + ' text 過短');
    if (t.lesson && !lessonIds.has(t.lesson)) warn(w + ' lesson 不存在：' + t.lesson);
    checkHtml(w + '.text', t.text || '');
  });
}
if (G.LEAKS) {
  const seen = new Set();
  G.LEAKS.forEach((t, i) => {
    const w = '漏洞[' + (t && t.id || '#' + i) + ']';
    if (!t || !t.id) { err(w + ' 缺 id'); return; }
    if (seen.has(t.id)) err(w + ' id 重複');
    seen.add(t.id);
    ['title', 'symptom', 'why', 'fix'].forEach((k) => { if (typeof t[k] !== 'string' || !t[k].trim()) err(w + ' 缺少欄位 ' + k); });
    if (![1, 2, 3].includes(t.level)) err(w + ' level 必須是 1–3');
    if (t.lesson && !lessonIds.has(t.lesson)) warn(w + ' lesson 不存在：' + t.lesson);
    if (t.drill) checkRoute(w + '.drill', t.drill);
    ['symptom', 'why', 'fix'].forEach((k) => checkHtml(w + '.' + k, t[k] || ''));
  });
}
if (G.RESOURCES) {
  const seen = new Set();
  G.RESOURCES.forEach((r, i) => {
    const w = '資源[' + (r && r.id || '#' + i) + ']';
    if (!r || !r.id) { err(w + ' 缺 id'); return; }
    if (seen.has(r.id)) err(w + ' id 重複');
    seen.add(r.id);
    if (!RES_CATS.includes(r.cat)) err(w + ' cat 無效：' + r.cat);
    if (typeof r.title !== 'string' || !r.title.trim()) err(w + ' 缺 title');
    if (!isHttps(r.url)) err(w + ' url 必須是 https：' + r.url);
    if (typeof r.desc !== 'string' || r.desc.length < 8) err(w + ' desc 過短');
    if (![1, 2, 3].includes(r.level)) err(w + ' level 必須是 1–3');
  });
}
if (G.MAXIMS) G.MAXIMS.forEach((m, i) => { if (!m || typeof m.text !== 'string' || !m.text.trim()) err('格言[#' + i + '] 缺 text'); });

// ---------------------------------------------------------------------------
// 5b. 翻後情境題 postflop_spots.js
// ---------------------------------------------------------------------------
if (G.POSTFLOP_SPOTS) {
  const seen = new Set();
  const POS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  G.POSTFLOP_SPOTS.forEach((s, i) => {
    const w = '翻後情境[' + (s && s.id || '#' + i) + ']';
    if (!s || !s.id) { err(w + ' 缺 id'); return; }
    if (seen.has(s.id)) err(w + ' id 重複');
    seen.add(s.id);
    if (![1, 2, 3].includes(s.lv)) err(w + ' lv 必須是 1–3');
    if (!lessonIds.has(s.topic)) warn(w + ' topic 不是存在的課程 id：' + s.topic);
    if (!POS.includes(s.hero)) err(w + ' hero 位置無效：' + s.hero);
    if (s.villain && !POS.concat(['多人']).includes(s.villain)) err(w + ' villain 位置無效：' + s.villain);
    const hc = String(s.heroCards || '').replace(/\s+/g, '');
    const bd = String(s.board || '').replace(/\s+/g, '');
    if (!/^([AKQJT98765432][shdc]){2}$/.test(hc)) err(w + ' heroCards 必須是 2 張牌，例如 AhQd');
    if (!/^([AKQJT98765432][shdc]){3,5}$/.test(bd)) err(w + ' board 必須是 3–5 張牌，例如 Ks7d2c');
    const all = (hc + bd).match(/../g) || [];
    if (new Set(all).size !== all.length) err(w + ' 底牌與公共牌有重複的牌');
    const streetN = { flop: 3, turn: 4, river: 5 }[s.street];
    if (!streetN) err(w + ' street 必須是 flop / turn / river');
    else if (bd.length / 2 !== streetN) err(w + ' street 與 board 張數不符');
    if (!(s.pot > 0)) err(w + ' pot 必須是正數（bb）');
    if (!(s.stack > 0)) err(w + ' stack 必須是正數（bb，有效籌碼）');
    ['title', 'history', 'q', 'exp'].forEach((k) => { if (typeof s[k] !== 'string' || s[k].trim().length < 4) err(w + ' 缺少欄位 ' + k); });
    if (!Array.isArray(s.opts) || s.opts.length < 2 || s.opts.length > 4) err(w + ' opts 必須 2–4 個');
    else if (new Set(s.opts).size !== s.opts.length) err(w + ' opts 不可重複');
    if (!Number.isInteger(s.ans) || s.ans < 0 || s.ans >= (s.opts || []).length) err(w + ' ans 超出範圍');
    if (/<[a-z][^>]*>/i.test(s.q + (s.opts || []).join('') + s.exp + s.history)) warn(w + ' 含 HTML 標籤（會被當純文字顯示）');
  });
}

// ---------------------------------------------------------------------------
// 5c. 新手 FAQ faq.js
// ---------------------------------------------------------------------------
if (G.FAQ) {
  const seen = new Set();
  const cats = new Set((G.FAQ_CATS || []).map((c) => c.id));
  if (!cats.size) err('faq.js 缺少 FAQ_CATS');
  G.FAQ.forEach((f, i) => {
    const w = 'FAQ[' + (f && f.id || '#' + i) + ']';
    if (!f || !f.id) { err(w + ' 缺 id'); return; }
    if (seen.has(f.id)) err(w + ' id 重複');
    seen.add(f.id);
    if (!cats.has(f.cat)) err(w + ' cat 不在 FAQ_CATS：' + f.cat);
    if (typeof f.q !== 'string' || f.q.length < 4) err(w + ' 缺 q');
    if (typeof f.a !== 'string' || f.a.length < 20) err(w + ' a 過短');
    if (f.lesson && !lessonIds.has(f.lesson)) warn(w + ' lesson 不存在：' + f.lesson);
    checkHtml(w + '.a', f.a || '');
  });
}

// ---------------------------------------------------------------------------
// 5d. 30 天學習計畫 study_plan.js
// ---------------------------------------------------------------------------
if (G.STUDY_PLAN) {
  const days = new Set();
  const weeks = new Set((G.STUDY_PLAN_WEEKS || []).map((w) => w.week));
  if (!weeks.size) err('study_plan.js 缺少 STUDY_PLAN_WEEKS');
  const covered = new Set();
  G.STUDY_PLAN.forEach((d, i) => {
    const w = '學習計畫[Day ' + (d && d.day) + ']';
    if (!d || !Number.isInteger(d.day) || d.day < 1 || d.day > 60) { err('學習計畫[#' + i + '] day 必須是 1–60 的整數'); return; }
    if (days.has(d.day)) err(w + ' day 重複');
    days.add(d.day);
    if (!weeks.has(d.week)) err(w + ' week 不在 STUDY_PLAN_WEEKS');
    ['title', 'goal'].forEach((k) => { if (typeof d[k] !== 'string' || d[k].trim().length < 2) err(w + ' 缺少欄位 ' + k); });
    if (!(d.minutes > 0)) err(w + ' minutes 必須是正數');
    if (!Array.isArray(d.lessons)) err(w + ' lessons 必須是陣列');
    else d.lessons.forEach((l) => { if (!lessonIds.has(l)) err(w + ' lessons 有不存在的課程 id：' + l); else covered.add(l); });
    if (!Array.isArray(d.drills)) err(w + ' drills 必須是陣列');
    else d.drills.forEach((x) => {
      if (!x || !QUIZ_MODES.includes(x.mode)) err(w + ' drills.mode 無效：' + (x && x.mode));
      if (!x || !(x.count > 0)) err(w + ' drills.count 必須是正數');
      if (x && x.topic && !lessonIds.has(x.topic)) err(w + ' drills.topic 不存在：' + x.topic);
    });
    if (d.tip !== undefined && typeof d.tip !== 'string') err(w + ' tip 必須是字串');
  });
  const missing = Array.from(lessonIds).filter((id) => !covered.has(id));
  if (missing.length) warn('學習計畫尚未涵蓋的課程：' + missing.join('、'));
}

// ---------------------------------------------------------------------------
// 5e. 中英術語對照 en_terms.js
// ---------------------------------------------------------------------------
if (G.EN_TERMS) {
  const ASCII = /^[\x20-\x7e]+$/;
  const HAN = /[\u3400-\u9fff]/;
  const zhSeen = {};
  G.EN_TERMS.forEach((t, i) => {
    const w = 'EN_TERMS[#' + i + (t && t.en ? ' ' + t.en : '') + ']';
    if (!t || typeof t.en !== 'string' || !t.en.trim() || !ASCII.test(t.en)) { err(w + ' en 必須是英文字串'); return; }
    if (t.abbr !== undefined && (typeof t.abbr !== 'string' || !ASCII.test(t.abbr))) err(w + ' abbr 必須是英文字串');
    if (!Array.isArray(t.zh) || !t.zh.length) { err(w + ' zh 必須是非空陣列'); return; }
    t.zh.forEach((z) => {
      if (typeof z !== 'string' || !HAN.test(z) || z.trim() !== z) err(w + ' zh 必須是含中文、前後無空白的字串：' + z);
      else if (zhSeen[z]) err(w + ' zh「' + z + '」與 ' + zhSeen[z] + ' 重複');
      else zhSeen[z] = t.en;
    });
    ['nb', 'na'].forEach((k) => { if (t[k] !== undefined && typeof t[k] !== 'string') err(w + ' ' + k + ' 必須是字串'); });
    if (t.alt !== undefined && (!t.alt || typeof t.alt.near !== 'string' || typeof t.alt.en !== 'string' || !ASCII.test(t.alt.en))) err(w + ' alt 必須是 { near, en }');
  });
  Object.entries(G.EN_LABELS || {}).forEach(([k, v]) => {
    if (!HAN.test(k) || typeof v !== 'string' || !ASCII.test(v)) err('EN_LABELS「' + k + '」格式錯誤（中文 → 英文）');
  });
}

// ---------------------------------------------------------------------------
// 6. 既有課程補充 meta
// ---------------------------------------------------------------------------
if (G.LESSON_META) {
  Object.entries(G.LESSON_META).forEach(([id, m]) => {
    const w = 'LESSON_META[' + id + ']';
    if (!lessonIds.has(id)) err(w + ' 不是存在的課程 id');
    if (typeof m.tldr !== 'string' || m.tldr.length < 10) err(w + ' 缺 tldr');
    if (typeof m.plain !== 'string' || m.plain.length < 20) err(w + ' 缺 plain');
    checkSources(w, m.sources, 2);
  });
  lessons.filter((l) => l.stage === undefined).forEach((l) => { if (!G.LESSON_META[l.id]) warn('既有課程 ' + l.id + ' 尚無 LESSON_META'); });
}

// ---------------------------------------------------------------------------
// 輸出
// ---------------------------------------------------------------------------
console.log('== 載入檔案 ==');
loaded.forEach((x) => console.log('  ' + x.file.padEnd(26) + (x.lessons.length ? ' 課程 +' + x.lessons.length : '') + (x.questions ? ' 題目 +' + x.questions : '')));
console.log('== 統計 ==');
console.log('  課程 ' + lessons.length + '｜題目 ' + (G.QUESTIONS || []).length + '｜術語 ' + (G.GLOSSARY || []).length + ' + 補充 ' + (G.GLOSSARY_EXTRA || []).length +
  '｜技巧 ' + (G.TIPS || []).length + '｜漏洞 ' + (G.LEAKS || []).length + '｜資源 ' + (G.RESOURCES || []).length + '｜格言 ' + (G.MAXIMS || []).length +
  '｜LESSON_META ' + Object.keys(G.LESSON_META || {}).length + '｜翻後情境 ' + (G.POSTFLOP_SPOTS || []).length + '｜FAQ ' + (G.FAQ || []).length + '｜學習計畫 ' + (G.STUDY_PLAN || []).length + ' 天' +
  '｜中英術語 ' + (G.EN_TERMS || []).length);
if (warns.length) { console.log('== 警告（' + warns.length + '）=='); warns.slice(0, 80).forEach((m) => console.log('  ⚠ ' + m)); if (warns.length > 80) console.log('  …其餘 ' + (warns.length - 80) + ' 筆'); }
if (errors.length) { console.log('== 錯誤（' + errors.length + '）=='); errors.forEach((m) => console.log('  ✖ ' + m)); process.exit(1); }
console.log('✅ 驗證通過（0 error）');
