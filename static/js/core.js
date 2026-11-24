/* GTO 撲克學院 — core.js
 * 常數、169 手牌工具、範圍字串解析、撲克牌呈現、進度儲存（localStorage + 伺服器同步）、共用小工具。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  // ---------------------------------------------------------------------------
  // 常數
  // ---------------------------------------------------------------------------
  const RANKS = 'AKQJT98765432';           // 13×13 表的順序（A 在最前）
  const RANKS_LOW = '23456789TJQKA';       // 牌力評估用（2 = 0 ... A = 12）
  const SUITS = 'shdc';
  const SUIT_SYM = { s: '♠', h: '♥', d: '♦', c: '♣' };
  const SUIT_ZH = { s: '黑桃', h: '紅心', d: '方塊', c: '梅花' };
  const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const POS_ZH = { UTG: '槍口位', HJ: '劫持位', CO: '關煞位', BTN: '按鈕位', SB: '小盲位', BB: '大盲位' };

  // 動作：顯示名稱與顏色（顏色也定義在 CSS 變數中，這裡給 canvas/inline 用）
  const ACTIONS = {
    raise: { label: '加注', short: 'R', en: 'Raise', color: 'var(--act-raise)', aggressive: true },
    '3bet': { label: '3-Bet', short: '3B', en: '3-Bet', color: 'var(--act-3bet)', aggressive: true },
    '4bet': { label: '4-Bet', short: '4B', en: '4-Bet', color: 'var(--act-4bet)', aggressive: true },
    '5bet': { label: '5-Bet 全下', short: 'AI', en: '5-Bet All-in', color: 'var(--act-5bet)', aggressive: true },
    call: { label: '跟注', short: 'C', en: 'Call', color: 'var(--act-call)', aggressive: false },
    fold: { label: '棄牌', short: 'F', en: 'Fold', color: 'var(--act-fold)', aggressive: false },
  };

  // ---------------------------------------------------------------------------
  // 169 手牌
  // ---------------------------------------------------------------------------
  const HANDS = [];
  const HAND_INFO = {};
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      let h, type;
      if (r === c) { h = RANKS[r] + RANKS[c]; type = 'pair'; }
      else if (r < c) { h = RANKS[r] + RANKS[c] + 's'; type = 'suited'; }
      else { h = RANKS[c] + RANKS[r] + 'o'; type = 'offsuit'; }
      HANDS.push(h);
      HAND_INFO[h] = { r, c, type, combos: type === 'pair' ? 6 : type === 'suited' ? 4 : 12 };
    }
  }
  const TOTAL_COMBOS = 1326;

  function rankIdx(ch) { return RANKS.indexOf(ch); }

  /** 正規化手牌字串，例如 "kaS" → "AKs"、"tt" → "TT"。無法辨識回傳 null。 */
  function normHand(s) {
    if (!s) return null;
    s = String(s).trim().replace(/10/g, 'T');
    const m = s.match(/^([2-9TJQKA])([2-9TJQKA])([sSoO]?)$/i);
    if (!m) return null;
    let a = m[1].toUpperCase(), b = m[2].toUpperCase();
    const suf = m[3].toLowerCase();
    if (rankIdx(a) > rankIdx(b)) [a, b] = [b, a];
    if (a === b) return suf ? null : a + b;
    if (!suf) return null;
    return a + b + suf;
  }

  // ---------------------------------------------------------------------------
  // 範圍字串解析：支援 "22+", "TT-77", "A2s+", "A5s-A2s", "KQo", "KQ", "AKs:50"
  // ---------------------------------------------------------------------------
  function suffixes(base, s) {
    s = (s || '').toLowerCase();
    if (s) return [base + s];
    return [base + 's', base + 'o'];
  }

  function expandToken(tok) {
    tok = tok.trim().replace(/10/g, 'T');
    if (!tok) return [];
    const up = tok.toUpperCase();
    let m;
    if ((m = up.match(/^([AKQJT2-9])\1-([AKQJT2-9])\2$/))) {
      const a = rankIdx(m[1]), b = rankIdx(m[2]);
      const res = [];
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) res.push(RANKS[i] + RANKS[i]);
      return res;
    }
    if ((m = up.match(/^([AKQJT2-9])\1(\+)?$/))) {
      if (!m[2]) return [m[1] + m[1]];
      const res = [];
      for (let i = 0; i <= rankIdx(m[1]); i++) res.push(RANKS[i] + RANKS[i]);
      return res;
    }
    if ((m = up.match(/^([AKQJT2-9])([AKQJT2-9])([SO]?)-([AKQJT2-9])([AKQJT2-9])([SO]?)$/))) {
      let h1 = m[1], k1 = m[2], s1 = m[3], h2 = m[4], k2 = m[5], s2 = m[6];
      if (rankIdx(h1) > rankIdx(k1)) [h1, k1] = [k1, h1];
      if (rankIdx(h2) > rankIdx(k2)) [h2, k2] = [k2, h2];
      if (h1 !== h2 || s1 !== s2 || h1 === k1 || h2 === k2) return null;
      const a = rankIdx(k1), b = rankIdx(k2), hi = rankIdx(h1);
      const res = [];
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
        if (i <= hi) continue;
        res.push(...suffixes(h1 + RANKS[i], s1));
      }
      return res;
    }
    if ((m = up.match(/^([AKQJT2-9])([AKQJT2-9])([SO]?)(\+)?$/))) {
      let h = m[1], k = m[2];
      const s = m[3], plus = m[4];
      if (h === k) return null;
      if (rankIdx(h) > rankIdx(k)) [h, k] = [k, h];
      if (!plus) return suffixes(h + k, s);
      const res = [];
      for (let i = rankIdx(h) + 1; i <= rankIdx(k); i++) res.push(...suffixes(h + RANKS[i], s));
      return res;
    }
    return null;
  }

  /** 解析範圍字串 → { hand: weight(0~1) }。無法解析時丟出錯誤。 */
  function parseRange(str) {
    const out = {};
    if (!str) return out;
    const tokens = String(str).split(/[,，;\s]+/).filter(Boolean);
    for (let tok of tokens) {
      let w = 1;
      const m = tok.match(/^(.*?)[:@](\d+(?:\.\d+)?)%?$/);
      if (m) { tok = m[1]; w = Math.max(0, Math.min(100, parseFloat(m[2]))) / 100; }
      const hands = expandToken(tok);
      if (!hands) throw new Error('無法解析的範圍片段：「' + tok + '」');
      for (const h of hands) out[h] = Math.max(out[h] || 0, w);
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // 撲克牌
  // ---------------------------------------------------------------------------
  /** 牌字串 "As" → int (rank*4 + suit)，rank: 2=0 ... A=12 */
  function cardToInt(cs) {
    const r = RANKS_LOW.indexOf(cs[0].toUpperCase().replace('1', 'T'));
    const s = SUITS.indexOf(cs[1].toLowerCase());
    if (r < 0 || s < 0) return -1;
    return r * 4 + s;
  }

  /** 解析連續牌字串 "AsKh 7d" → ["As","Kh","7d"]，不合法回傳 null */
  function parseCards(str) {
    if (!str) return [];
    const s = String(str).replace(/10/g, 'T').replace(/[\s,，]+/g, '');
    if (s.length % 2) return null;
    const out = [];
    for (let i = 0; i < s.length; i += 2) {
      const c = s[i].toUpperCase() + s[i + 1].toLowerCase();
      if (cardToInt(c) < 0) return null;
      out.push(c);
    }
    return out;
  }

  /** 由手牌類別隨機產生具體花色，例如 "AKs" → ["Ah","Kh"] */
  function randomCombo(hand) {
    const info = HAND_INFO[hand];
    const a = hand[0], b = hand[1];
    const s1 = SUITS[randInt(4)];
    if (info.type === 'suited') return [a + s1, b + s1];
    let s2;
    do { s2 = SUITS[randInt(4)]; } while (s2 === s1);
    return [a + s1, b + s2];
  }

  /** 列出一個手牌類別的所有具體組合（int 陣列對）。 */
  function handCombos(hand) {
    const info = HAND_INFO[hand];
    if (!info) return [];
    const ra = RANKS_LOW.indexOf(hand[0]), rb = RANKS_LOW.indexOf(hand[1]);
    const res = [];
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = 0; s2 < 4; s2++) {
        if (info.type === 'pair') { if (s2 <= s1) continue; }
        else if (info.type === 'suited') { if (s1 !== s2) continue; }
        else if (s1 === s2) continue;
        res.push([ra * 4 + s1, rb * 4 + s2]);
      }
    }
    return res;
  }

  function cardHtml(cs, size) {
    const r = cs[0].toUpperCase(), s = cs[1].toLowerCase();
    const label = r === 'T' ? '10' : r;
    const sym = SUIT_SYM[s];
    return '<span class="pcard ' + (size || '') + ' suit-' + s + '" title="' + SUIT_ZH[s] + label + '">' +
      '<span class="pc-corner"><span class="pc-r">' + label + '</span><span class="pc-s">' + sym + '</span></span>' +
      '<span class="pc-pip" aria-hidden="true">' + sym + '</span></span>';
  }
  function cardsHtml(list, size) {
    return '<span class="pcards">' + list.map((c) => cardHtml(c, size)).join('') + '</span>';
  }
  function cardBackHtml(size) { return '<span class="pcard back ' + (size || '') + '"></span>'; }

  /** 把容器內 <span class="cards">AsKh</span> 轉成撲克牌圖示 */
  function hydrateCards(root) {
    (root || document).querySelectorAll('span.cards:not([data-done])').forEach((el) => {
      const list = parseCards(el.textContent);
      el.setAttribute('data-done', '1');
      if (list && list.length) el.innerHTML = cardsHtml(list, 'mini');
    });
  }

  // ---------------------------------------------------------------------------
  // 小工具
  // ---------------------------------------------------------------------------
  function randInt(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[randInt(arr.length)]; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function weightedPick(items, weightFn) {
    let total = 0;
    const ws = items.map((it) => { const w = Math.max(0, weightFn(it)); total += w; return w; });
    if (total <= 0) return pick(items);
    let x = Math.random() * total;
    for (let i = 0; i < items.length; i++) { x -= ws[i]; if (x <= 0) return items[i]; }
    return items[items.length - 1];
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtNum(x, digits) {
    const d = digits == null ? 1 : digits;
    return Number(x).toFixed(d).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }
  function todayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  const ENT_MAP = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
  function stripTags(html) {
    if (!html) return '';
    return String(html)
      .replace(/<[^>]*>/g, '')
      .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, (m) => ENT_MAP[m] || m);
  }

  // 簡易事件
  const listeners = {};
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); }
  function emit(evt, data) { (listeners[evt] || []).forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', () => {
      const hidden = !!document.hidden;
      if (document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.toggle('is-hidden', hidden);
      }
      emit('visibility', hidden);
    });
  }

  function toast(msg, kind) {
    let box = document.getElementById('toastBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toastBox';
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
  }

  // ---------------------------------------------------------------------------
  // 進度儲存（localStorage 為主，若由本機 server.py 提供則同步到本機檔案）
  // ---------------------------------------------------------------------------
  const STORE_KEY = 'gto_poker_academy_progress_v1';
  function defaultProgress() {
    return {
      v: 1,
      updatedAt: 0,
      totals: { a: 0, c: 0 },
      modes: {},          // mode → {a, c}
      preflop: { byType: {}, byPos: {}, byScenario: {}, missed: {} },
      qstats: {},         // theory question id → {a, c, t}
      lessonsRead: {},    // lesson id → timestamp
      mistakes: [],       // 最近錯題
      daily: {},          // YYYY-MM-DD → 題數
      streak: { cur: 0, best: 0 },
      paint: { best: {} },// scenario → best accuracy
      settings: {
        theme: '', dailyGoal: 30,
        preflopTypes: ['rfi', 'vsrfi', 'vs3bet', 'vs4bet'],
        preflopHeroes: POSITIONS.slice(),
        sampling: 'focus',
        autoNext: false,
      },
    };
  }
  function mergeDefaults(p) {
    const d = defaultProgress();
    if (!p || typeof p !== 'object') return d;
    for (const k of Object.keys(d)) {
      if (p[k] === undefined) p[k] = d[k];
      else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) {
        for (const k2 of Object.keys(d[k])) if (p[k][k2] === undefined) p[k][k2] = d[k][k2];
      }
    }
    return p;
  }

  let progress = defaultProgress();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) progress = mergeDefaults(JSON.parse(raw));
  } catch (e) { console.warn('progress load failed', e); }

  const isPublicStaticHost = /\.github\.io$|\.pages\.dev$|\.netlify\.app$|\.vercel\.app$/i.test(
    (typeof location !== 'undefined' && location.hostname) || ''
  );
  let serverAvailable = !window.GTO_STATIC_ONLY && !isPublicStaticHost && (location.protocol === 'http:' || location.protocol === 'https:');
  let saveTimer = null;

  function isLocalServer() {
    return !!(serverAvailable && !window.GTO_STATIC_ONLY && !isPublicStaticHost);
  }

  function saveProgress(immediate) {
    progress.updatedAt = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* quota */ }
    emit('progress', progress);
    if (!serverAvailable) return;
    clearTimeout(saveTimer);
    const push = () => {
      if (!serverAvailable) return;
      fetch('api/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(progress),
      }).catch(() => {});
    };
    if (immediate) push(); else saveTimer = setTimeout(push, 1200);
  }

  async function syncFromServer() {
    if (!serverAvailable) return;
    try {
      const res = await fetch('api/progress', { cache: 'no-store' });
      if (!res.ok) { serverAvailable = false; emit('progress-replaced', progress); return; }
      const ct = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
      if (!ct.includes('application/json')) { serverAvailable = false; emit('progress-replaced', progress); return; }
      const data = await res.json();
      if (data && data.updatedAt && data.updatedAt > (progress.updatedAt || 0)) {
        progress = mergeDefaults(data);
        try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
        emit('progress', progress);
        emit('progress-replaced', progress);
      } else if ((progress.updatedAt || 0) > (data.updatedAt || 0)) {
        saveProgress(true);
      }
    } catch (e) {
      serverAvailable = false; /* server 沒有提供 API 時切換為純靜態 localStorage 模式 */
      emit('progress-replaced', progress);
    }
  }

  function bump(obj, key, correct) {
    const o = obj[key] || (obj[key] = { a: 0, c: 0 });
    o.a++;
    if (correct) o.c++;
    return o;
  }

  /** 記錄一次作答。 */
  function recordAnswer(mode, correct, extra) {
    const p = progress;
    p.totals.a++;
    if (correct) p.totals.c++;
    bump(p.modes, mode, correct);
    const dk = todayKey();
    p.daily[dk] = (p.daily[dk] || 0) + 1;
    if (correct) { p.streak.cur++; p.streak.best = Math.max(p.streak.best, p.streak.cur); }
    else p.streak.cur = 0;
    if (extra && extra.mistake && !correct) {
      p.mistakes.unshift(Object.assign({ t: Date.now(), mode }, extra.mistake));
      if (p.mistakes.length > 300) p.mistakes.length = 300;
    }
    saveProgress();
  }

  function studyDays() {
    // 連續學習天數（含今天或昨天結尾）
    const days = progress.daily;
    let n = 0;
    const d = new Date();
    if (!days[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (days[todayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function resetProgress() {
    const settings = progress.settings;
    progress = defaultProgress();
    progress.settings = settings;
    saveProgress(true);
    emit('progress-replaced', progress);
  }

  // ---------------------------------------------------------------------------
  // 匯出
  // ---------------------------------------------------------------------------
  Object.assign(GTO, {
    RANKS, RANKS_LOW, SUITS, POSITIONS, POS_ZH, ACTIONS,
    HANDS, HAND_INFO, TOTAL_COMBOS,
    rankIdx, normHand, parseRange,
    cardToInt, parseCards, randomCombo, handCombos, cardsHtml, cardBackHtml, hydrateCards,
    randInt, pick, shuffle, weightedPick, esc, fmtNum, todayKey, stripTags,
    on, emit, toast,
    saveProgress, syncFromServer, isLocalServer, recordAnswer, bump, studyDays, resetProgress,
  });
  // Object.assign 只會複製 getter 當下的值；用 defineProperty 讓 GTO.progress 永遠指向最新進度
  //（syncFromServer / resetProgress 會換掉整個 progress 物件）
  Object.defineProperty(GTO, 'progress', { get: () => progress, enumerable: true, configurable: true });
})();
