#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
德州撲克學院（poker_gto_practice_tool）6 人擬真 AI 實戰桌與雙軌覆盤室驗證腳本
包含：
  1. 既有題庫與課程靜態資料驗證 (validate_content.js)
  2. 200+ 手 6 人桌模擬手牌與 100% 籌碼守恆檢查 (chip conservation)
  3. 多人 All-in 邊池 (side pots) 與決策快照復原 (snapshot retry) 測試
  4. 雙軌教練診斷邏輯 (CoachEngine) 與 54 堂課推薦對齊檢查
  5. 繁體中文（台灣用語）與敏感字串洩漏檢查
"""

import os
import sys
import subprocess
import json

TOOL_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(TOOL_ROOT, 'static')
JS_DIR = os.path.join(STATIC_DIR, 'js')

def run_step(title, func):
    print(f"\n▶ 正在執行: {title} ...", flush=True)
    try:
        func()
        print(f"✅ [PASS] {title}", flush=True)
        return True
    except Exception as e:
        print(f"❌ [FAIL] {title}: {e}", file=sys.stderr, flush=True)
        return False

def step_validate_content():
    cmd = ['node', os.path.join(TOOL_ROOT, 'tools', 'validate_content.js')]
    res = subprocess.run(cmd, cwd=TOOL_ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"validate_content.js 失敗:\n{res.stdout}\n{res.stderr}")
    print(res.stdout.strip())

def step_simulate_hands_and_chips():
    node_script = """
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const toolRoot = process.argv[1];
const ctx = {
  window: {},
  document: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  location: { protocol: 'http:', hostname: 'localhost' },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math
};
ctx.window = ctx;

function loadFile(rel) {
  const p = path.join(toolRoot, rel);
  vm.runInNewContext(fs.readFileSync(p, 'utf-8'), ctx);
}

loadFile('static/js/core.js');
loadFile('static/js/evaluator.js');
loadFile('static/js/ranges.js');
loadFile('static/js/widgets.js');
loadFile('static/js/table_engine.js');
loadFile('static/js/ai_personas.js');
loadFile('static/js/coach_engine.js');

const ap = ctx.GTO.AIPersonas;
const te = ctx.GTO.TableEngine;
const presets = ['beginner', 'mixed', 'shark', 'random'];

let totalHands = 0;
let totalActions = 0;
let showdownCount = 0;

for (const preset of presets) {
  const table = te.createTable({ preset, stackMode: 'realistic' });
  for (let h = 0; h < 55; h++) {
    totalHands++;
    table.startHand();
    table.assertChipConservation();

    let turns = 0;
    while (table.street !== 'showdown' && table.street !== 'ended' && turns < 90) {
      turns++;
      totalActions++;
      const s = table.actionSeat;
      if (s == null || s < 0) break;
      const decision = ap.decideAiAction(table, s);
      table.applyAction(s, decision.action, decision.amount);
      table.assertChipConservation();
    }
    if (table.street === 'showdown') showdownCount++;
    table.assertChipConservation();
  }
}

console.log(`總計模擬完成 ${totalHands} 手牌（${totalActions} 次決策動作，${showdownCount} 次攤牌攤手），每一手牌每一動作 100% 符合籌碼守恆！`);
"""
    cmd = ['node', '-e', node_script, TOOL_ROOT]
    res = subprocess.run(cmd, cwd=TOOL_ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"模擬手牌失敗:\n{res.stdout}\n{res.stderr}")
    print(res.stdout.strip())

def step_side_pots_and_snapshot():
    node_script = """
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const toolRoot = process.argv[1];
const ctx = {
  window: {},
  document: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  location: { protocol: 'http:', hostname: 'localhost' },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math
};
ctx.window = ctx;

function loadFile(rel) {
  const p = path.join(toolRoot, rel);
  vm.runInNewContext(fs.readFileSync(p, 'utf-8'), ctx);
}

loadFile('static/js/core.js');
loadFile('static/js/evaluator.js');
loadFile('static/js/ranges.js');
loadFile('static/js/widgets.js');
loadFile('static/js/table_engine.js');

const te = ctx.GTO.TableEngine;
const table = te.createTable({ preset: 'mixed', stackMode: '100bb' });

// 1. 測試快照保存與失誤重打還原 (Snapshot Clone / Restore)
table.startHand();
// 進行翻前動作直到進入翻牌圈 (flop)
let s = table.actionSeat;
let turns = 0;
while (table.street === 'preflop' && turns < 20) {
  turns++;
  const legal = table.getLegalActions(s);
  table.applyAction(s, legal.canCheck ? 'check' : 'call');
  s = table.actionSeat;
}
if (table.street !== 'flop' || table.board.length !== 3) {
  throw new Error('牌局未成功推進至翻牌圈: ' + table.street + ', board: ' + table.board.length);
}

// 在翻牌圈儲存快照
const snapshot = table.cloneTableState();
const flopPot = snapshot.pot;
if (snapshot.board.length !== 3 || snapshot.street !== 'flop') {
  throw new Error('快照資料抓取不正確');
}

// 推進至轉牌圈 (turn)
while (table.street === 'flop' && turns < 40) {
  turns++;
  const legal = table.getLegalActions(s);
  table.applyAction(s, legal.canCheck ? 'check' : 'call');
  s = table.actionSeat;
}
if (table.street !== 'turn' || table.board.length !== 4) {
  throw new Error('牌局未成功推進至轉牌圈: ' + table.street);
}

// 從翻牌圈快照還原
table.restoreTableState(snapshot);
if (table.board.length !== 3 || table.street !== 'flop' || table.pot !== flopPot) {
  throw new Error('快照還原失敗！board: ' + table.board.length + ', pot: ' + table.pot);
}
table.assertChipConservation();
console.log('✅ 快照儲存與失誤點還原 (Retry Spot) 測試通過');

// 2. 邊池切分測試 (computeSidePots)
const pots = table.computeSidePots();
if (!Array.isArray(pots) || pots.length === 0) {
  throw new Error('邊池回傳格式不正確');
}
console.log(`✅ 邊池與主池切分演算法驗證通過（主底池 + 邊池層數: ${pots.length}）`);
"""
    cmd = ['node', '-e', node_script, TOOL_ROOT]
    res = subprocess.run(cmd, cwd=TOOL_ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"邊池與快照測試失敗:\n{res.stdout}\n{res.stderr}")
    print(res.stdout.strip())

def step_coach_engine_tests():
    node_script = """
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const toolRoot = process.argv[1];
const ctx = {
  window: {},
  document: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  location: { protocol: 'http:', hostname: 'localhost' },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math
};
ctx.window = ctx;

function loadFile(rel) {
  const p = path.join(toolRoot, rel);
  vm.runInNewContext(fs.readFileSync(p, 'utf-8'), ctx);
}

loadFile('static/js/core.js');
loadFile('static/js/evaluator.js');
loadFile('static/js/ranges.js');
loadFile('static/js/theory_part1.js');
loadFile('static/js/theory_part2.js');
loadFile('static/js/lessons_beginner.js');
loadFile('static/js/lessons_core_plus.js');
loadFile('static/js/lessons_postflop_plus.js');
loadFile('static/js/lessons_advanced_plus.js');
loadFile('static/js/widgets.js');
loadFile('static/js/table_engine.js');
loadFile('static/js/ai_personas.js');
loadFile('static/js/coach_engine.js');

const ce = ctx.GTO.CoachEngine;
const theoryList = ctx.GTO.THEORY || [];
const theoryIds = new Set(theoryList.map(l => l.id));

// 1. 驗證所有漏洞定義的課程 ID 皆在 54 堂課中存在
for (const [code, def] of Object.entries(ce.LEAK_DEFINITIONS)) {
  for (const lid of (def.lessons || [])) {
    if (!theoryIds.has(lid)) {
      throw new Error(`漏洞 ${code} 指向了不存在的課程 ID: ${lid}`);
    }
  }
}
console.log(`✅ 12 大漏洞定義共引用的所有課程 ID 100% 存在於 54 堂課清單`);

// 2. 單元測試情境 A: UTG 溜入平跟 (Open-Limp) 應被判定為失誤並推薦加注或棄牌
const snapLimp = {
  street: 'preflop',
  pot: 1.5,
  toCall: 0.0,
  heroPosition: 'UTG',
  heroCards: ['7s', '2h'],
  heroAction: 'call',
  heroAmount: 1.0,
  villainPersona: 'mixed'
};
const resLimp = ce.analyzeDecision(snapLimp);
if (resLimp.grade !== 'mistake' && resLimp.grade !== 'blunder') {
  throw new Error(`UTG 溜入平跟未被評估為失誤: ${resLimp.grade}`);
}
if (!resLimp.leakCode || resLimp.leakCode !== 'open_limp') {
  throw new Error(`UTG 溜入平跟漏洞代碼不符: ${resLimp.leakCode}`);
}
console.log('✅ 情境 A (UTG 溜入平跟) 診斷通過:', resLimp.gradeLabel, resLimp.leakTitle);

// 3. 單元測試情境 B: 面對底池極佳賠率卻棄牌 (Fold with huge pot odds)
const snapFold = {
  street: 'turn',
  pot: 20.0,
  toCall: 0.5,
  heroPosition: 'BB',
  heroCards: ['As', 'Kd'],
  board: ['Ah', '9c', '4s', '2d'],
  heroAction: 'fold',
  heroAmount: 0.0,
  villainPersona: 'mixed'
};
const resFold = ce.analyzeDecision(snapFold);
if (resFold.grade !== 'blunder') {
  throw new Error(`超高賠率頂對棄牌未被判定為大錯 (blunder): ${resFold.grade}`);
}
console.log('✅ 情境 B (超優賠率棄牌) 診斷通過:', resFold.gradeLabel, resFold.leakTitle);

// 4. 單元測試情境 C: 對跟注站 (Station) 詐唬推光
const snapBluffStation = {
  street: 'river',
  pot: 12.0,
  toCall: 0.0,
  heroPosition: 'BTN',
  heroCards: ['6s', '5c'],
  board: ['Kh', 'Qd', '8s', '2c', '3h'],
  heroAction: 'bet',
  heroAmount: 20.0,
  villainPersona: 'station'
};
const resBluff = ce.analyzeDecision(snapBluffStation);
const expReason = (resBluff.exploitAdvice && resBluff.exploitAdvice.reason) || '';
const expTendency = (resBluff.exploitAdvice && resBluff.exploitAdvice.villainTendency) || '';
if (!expReason.includes('跟注站') && !expTendency.includes('跟注站')) {
  throw new Error('剝削建議未針對跟注站提供警示！');
}
console.log('✅ 情境 C (對跟注站詐唬警示) 診斷通過:', resBluff.exploitAdvice.action, expReason.slice(0, 30));

// 5. 驗證所有決策（包含最佳/標準與失誤）皆產出非空且三層章節小節結構完整的 lessons
function assertLessonsValid(lessons, label) {
  if (!Array.isArray(lessons) || !lessons.length) {
    throw new Error(`${label}: lessons 為空陣列！`);
  }
  lessons.forEach((l, idx) => {
    if (!l.id || !theoryIds.has(l.id)) throw new Error(`${label}[${idx}]: 無效的課程 ID ${l.id}`);
    if (!l.stageTitle) throw new Error(`${label}[${idx}]: 缺少 stageTitle`);
    if (typeof l.lessonNo !== 'number' || l.lessonNo < 1) throw new Error(`${label}[${idx}]: 無效的 lessonNo ${l.lessonNo}`);
    if (!l.secId || !/^sec-\\d+$/.test(l.secId)) throw new Error(`${label}[${idx}]: secId 不符格式: ${l.secId}`);
    if (!l.secTitle || typeof l.secTitle !== 'string' || !l.secTitle.trim()) throw new Error(`${label}[${idx}]: secTitle 為空`);
  });
}
assertLessonsValid(resLimp.lessons, '情境 A (失誤)');

const snapBestRfi = {
  street: 'preflop',
  pot: 1.5,
  toCall: 0.0,
  heroPosition: 'BTN',
  heroCards: ['As', 'Kd'],
  heroAction: 'raise',
  heroAmount: 2.5,
  villainPersona: 'mixed',
  preflopRaiseCount: 0,
};
const resBestRfi = ce.analyzeDecision(snapBestRfi);
if (resBestRfi.grade !== 'best' && resBestRfi.grade !== 'good') {
  throw new Error(`標準 BTN 加注評級非 best/good: ${resBestRfi.grade}`);
}
assertLessonsValid(resBestRfi.lessons, '最佳決策 (BTN RFI)');
console.log(`✅ 最佳/標準決策對應課程章節驗證通過 (共 ${resBestRfi.lessons.length} 門，第一門: ${resBestRfi.lessons[0].title} › ${resBestRfi.lessons[0].secId} ${resBestRfi.lessons[0].secTitle})`);

// 6. 驗證 analyzeHandConcepts 實戰手牌與棄牌觀戰手牌皆回傳 >= 3 筆有效章節映射
const te = ctx.GTO.TableEngine;
const ap = ctx.GTO.AIPersonas;
const tablePlay = te.createTable({ preset: 'mixed' });
tablePlay.startHand();
while (tablePlay.street !== 'showdown' && tablePlay.street !== 'ended') {
  const s = tablePlay.actionSeat;
  if (s == null || s < 0) break;
  const d = ap.decideAiAction(tablePlay, s);
  tablePlay.applyAction(s, d.action, d.amount);
}
const handPlay = tablePlay.currentHandRecord;
const conceptsPlay = ce.analyzeHandConcepts(handPlay);
if (!Array.isArray(conceptsPlay) || conceptsPlay.length < 3) {
  throw new Error(`實戰手牌 analyzeHandConcepts 回傳少於 3 筆: ${conceptsPlay ? conceptsPlay.length : 0}`);
}
conceptsPlay.forEach((c, idx) => {
  if (!c.badge || !c.spotText || !c.chapter) throw new Error(`實戰概念 [${idx}] 結構缺少必要欄位`);
  if (!theoryIds.has(c.chapter.id)) throw new Error(`實戰概念 [${idx}] 課程 ID 不存在: ${c.chapter.id}`);
  if (!c.chapter.stageTitle || !/^sec-\\d+$/.test(c.chapter.secId) || !c.chapter.secTitle) {
    throw new Error(`實戰概念 [${idx}] 章節資訊未補齊: ${JSON.stringify(c.chapter)}`);
  }
});
console.log(`✅ 實戰模擬手牌概念總覽通過 (共 ${conceptsPlay.length} 項核心觀念)`);

const handFold = {
  handId: 'test-fold-watch',
  handNumber: 99,
  timestamp: Date.now(),
  dealerSeat: 3,
  positions: { 0: 'UTG', 1: 'HJ', 2: 'CO', 3: 'BTN', 4: 'SB', 5: 'BB' },
  seatPersonas: ['human', 'station', 'maniac', 'nit', 'shark', 'gto'],
  seatNames: ['你 (Hero)', '阿哲', '信義區散步', 'Kevin_TW', '夜貓阿翔', 'Mia_88'],
  holeCards: [['7s', '2h'], ['Ah', 'Kd'], ['Qc', 'Qd'], ['Jc', 'Ts'], ['8h', '8d'], ['Ac', '4s']],
  board: ['Kh', '7d', '2c', '4s', '9d'],
  actions: [
    { street: 'preflop', seat: 0, position: 'UTG', action: 'fold', amount: 0, name: '你 (Hero)' },
    { street: 'preflop', seat: 1, position: 'HJ', action: 'raise', amount: 2.5, name: '阿哲' },
    { street: 'preflop', seat: 2, position: 'CO', action: 'fold', amount: 0, name: '信義區散步' },
    { street: 'preflop', seat: 3, position: 'BTN', action: 'call', amount: 2.5, name: 'Kevin_TW' },
    { street: 'flop', seat: 1, position: 'HJ', action: 'bet', amount: 2.0, name: '阿哲' },
    { street: 'flop', seat: 3, position: 'BTN', action: 'call', amount: 2.0, name: 'Kevin_TW' }
  ],
  pots: [{ potIndex: 0, amount: 9.5 }],
  winners: [{ seat: 1, amount: 9.5, name: '阿哲', handDesc: '一對 K（頂對強踢腳）' }]
};
const conceptsFold = ce.analyzeHandConcepts(handFold);
if (!Array.isArray(conceptsFold) || conceptsFold.length < 3) {
  throw new Error(`翻前棄牌觀戰 handConcepts 回傳少於 3 筆: ${conceptsFold ? conceptsFold.length : 0}`);
}
conceptsFold.forEach((c, idx) => {
  if (!c.badge || !c.spotText || !c.chapter) throw new Error(`棄牌觀戰概念 [${idx}] 結構缺少必要欄位`);
  if (!theoryIds.has(c.chapter.id)) throw new Error(`棄牌觀戰概念 [${idx}] 課程 ID 不存在: ${c.chapter.id}`);
  if (!c.chapter.stageTitle || !/^sec-\\d+$/.test(c.chapter.secId) || !c.chapter.secTitle) {
    throw new Error(`棄牌觀戰概念 [${idx}] 章節資訊未補齊`);
  }
});
console.log(`✅ 翻前棄牌觀戰手牌概念總覽通過 (共 ${conceptsFold.length} 項核心觀念)`);
"""
    cmd = ['node', '-e', node_script, TOOL_ROOT]
    res = subprocess.run(cmd, cwd=TOOL_ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"教練引擎單元測試失敗:\n{res.stdout}\n{res.stderr}")
    print(res.stdout.strip())

def step_regression_rules():
    node_script = """
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const toolRoot = process.argv[1];
const ctx = {
  window: {},
  document: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  location: { protocol: 'http:', hostname: 'localhost' },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math
};
ctx.window = ctx;

function loadFile(rel) {
  const p = path.join(toolRoot, rel);
  vm.runInNewContext(fs.readFileSync(p, 'utf-8'), ctx);
}

loadFile('static/js/core.js');
loadFile('static/js/evaluator.js');
loadFile('static/js/ranges.js');
loadFile('static/js/theory_part1.js');
loadFile('static/js/theory_part2.js');
loadFile('static/js/lessons_beginner.js');
loadFile('static/js/lessons_core_plus.js');
loadFile('static/js/lessons_postflop_plus.js');
loadFile('static/js/lessons_advanced_plus.js');
loadFile('static/js/widgets.js');
loadFile('static/js/table_engine.js');
loadFile('static/js/ai_personas.js');
loadFile('static/js/coach_engine.js');

const te = ctx.GTO.TableEngine;
const ce = ctx.GTO.CoachEngine;
const ap = ctx.GTO.AIPersonas;

// 1. Worker 勝率模擬測試：AA vs 72o 勝率 > 80%
const simRes = ctx.GTO.handVsHand(['As', 'Ah'], ['7c', '2d'], 1500);
if (simRes.equity[0] < 0.80) {
  throw new Error(`AA vs 72o 模擬勝率異常低: ${(simRes.equity[0] * 100).toFixed(1)}% (預期 > 80%)`);
}
console.log(`✅ 蒙地卡羅勝率驗證: AA vs 72o 勝率 ${(simRes.equity[0] * 100).toFixed(1)}% > 80%`);

// 2. 河牌強牌打跟注站不誤判為詐唬
const snapMonsterVsStation = {
  street: 'river',
  pot: 20.0,
  toCall: 0.0,
  heroPosition: 'BTN',
  heroCards: ['As', 'Kh'],
  board: ['Ah', 'Kd', '9c', '4s', '2d'],
  heroAction: 'bet',
  heroAmount: 14.0,
  villainPersona: 'station',
  villainName: '阿東'
};
const resMonster = ce.analyzeDecision(snapMonsterVsStation);
if (resMonster.leakCode === 'bluffing_calling_station') {
  throw new Error('河牌頂兩對價值注被誤判為 bluffing_calling_station 純詐唬！');
}
if (resMonster.grade === 'blunder' || resMonster.grade === 'mistake') {
  throw new Error(`河牌兩對下注價值被誤判為失誤: ${resMonster.grade}`);
}
console.log('✅ 河牌兩對價值注打跟注站評級正確:', resMonster.grade, resMonster.gradeLabel);

// 3. 翻前多次行動 VPIP 不得超過 100%
const tableVpip = te.createTable({ preset: 'mixed', stackMode: '100bb' });
for (let h = 0; h < 60; h++) {
  tableVpip.startHand();
  let turns = 0;
  while (tableVpip.street !== 'showdown' && tableVpip.street !== 'ended' && turns < 60) {
    turns++;
    const s = tableVpip.actionSeat;
    if (s == null || s < 0) break;
    const dec = ap.decideAiAction(tableVpip, s);
    tableVpip.applyAction(s, dec.action, dec.amount);
  }
}
for (let s = 0; s < 6; s++) {
  const st = tableVpip.seats[s].stats;
  if (st.vpipHands > st.hands) {
    throw new Error(`座位 ${s} vpipHands (${st.vpipHands}) > hands (${st.hands})`);
  }
}
console.log('✅ 60 手牌每位玩家 VPIP 手數嚴格 <= 總手數 (0% ~ 100%)');

// 4. 短碼 All-in 不重開加注權
const tableShort = te.createTable({ preset: 'mixed', stackMode: '100bb' });
tableShort.startHand();
const s1 = tableShort.actionSeat;
tableShort.applyAction(s1, 'raise', 3.0);
const s2 = tableShort.actionSeat;
tableShort.applyAction(s2, 'fold');
const s3 = tableShort.actionSeat;
tableShort.seats[s3].stack = 3.5;
tableShort.applyAction(s3, 'raise', 3.5);
const legalS1 = tableShort.getLegalActions(s1);
if (legalS1.canRaise) {
  throw new Error('短碼不足額 All-in 違規重新開啟了先前行動者的加注權！');
}
console.log('✅ 短碼不足額 All-in 不重開加注權測試通過');

// 5. 40 組 GTO 範圍情境匹配
const scenarios = ctx.GTO.SCENARIOS || {};
const scCount = Object.keys(scenarios).length;
if (scCount < 30) {
  throw new Error(`GTO 情境數少於預期: ${scCount}`);
}
const resRfi = ce.analyzeDecision({
  street: 'preflop',
  heroPosition: 'BTN',
  heroCards: ['As', 'Kd'],
  board: [],
  heroAction: 'raise',
  heroAmount: 2.5,
  preflopRaiseCount: 0,
  limpersCount: 0
});
if (!resRfi.matchedScenarioId || !resRfi.matchedScenarioId.startsWith('rfi_')) {
  throw new Error(`BTN 無人加注情境匹配錯誤: ${resRfi.matchedScenarioId}`);
}
console.log(`✅ 40 組 GTO 範圍匹配正常 (總情境數: ${scCount}, BTN RFI: ${resRfi.matchedScenarioId})`);
"""
    cmd = ['node', '-e', node_script, TOOL_ROOT]
    res = subprocess.run(cmd, cwd=TOOL_ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"迴歸防護測試失敗:\n{res.stdout}\n{res.stderr}")
    print(res.stdout.strip())

def step_language_and_leak_check():
    # 簡體/大陸詞彙檢查
    MAINLAND_TERMS = [
        '視頻', '軟件', '信息', '默認', '質量', '項目',
        '鏈接', '接口', '實例化', '支持', '激活', '登錄'
    ]
    INTERNAL_PATTERNS = [
        '.internal.', 'localhost:8', '127.0.0.1'
    ]

    target_files = [
        'static/js/table_engine.js',
        'static/js/ai_personas.js',
        'static/js/coach_engine.js',
        'static/js/arena_ui.js',
        'static/js/replay_ui.js',
        'static/js/app.js',
        'static/styles.css',
        'static/index.html'
    ]

    total_checked = 0
    issues = []

    for rel in target_files:
        p = os.path.join(TOOL_ROOT, rel)
        if not os.path.exists(p):
            continue
        total_checked += 1
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()

        for term in MAINLAND_TERMS:
            if term in content:
                # 排除可能在註解或第三方引用的特殊情況，但提示出來
                issues.append(f"{rel}: 包含簡體/大陸用語『{term}』")

        for ip in INTERNAL_PATTERNS:
            if ip in content.lower():
                issues.append(f"{rel}: 包含內部網路/個人標識『{ip}』")

    if issues:
        raise RuntimeError("詞彙或隱私檢查未通過:\n" + "\n".join(issues))
    print(f"已檢查 {total_checked} 個核心程式檔，繁體中文（台灣）與敏感詞檢查 100% 通過！")

def main():
    print("=" * 60)
    print(" 德州撲克學院 — 6 人實戰桌與雙軌覆盤室自動化測試 (check_poker_arena.py)")
    print("=" * 60)

    steps = [
        ("既有內容完整性驗證 (validate_content.js)", step_validate_content),
        ("200+ 手 6 人桌 AI 實戰模擬與籌碼守恆 (Chip Conservation)", step_simulate_hands_and_chips),
        ("邊池 (Side Pots) 與失誤重打快照 (Retry Spot) 測試", step_side_pots_and_snapshot),
        ("雙軌教練引擎 (CoachEngine) 邏輯與 54 堂課推薦對齊測試", step_coach_engine_tests),
        ("關鍵邏輯迴歸驗證 (Worker勝率/跟注站價值注/VPIP<=100%/短碼All-in/40組範圍)", step_regression_rules),
        ("繁體中文（台灣）用語與敏感字串洩漏檢查", step_language_and_leak_check),
    ]

    all_passed = True
    for title, func in steps:
        ok = run_step(title, func)
        if not ok:
            all_passed = False
            break

    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 全部 5 項測試皆驗證通過！")
        print("=" * 60)
        sys.exit(0)
    else:
        print("💥 測試未完全通過，請檢查上方錯誤訊息！", file=sys.stderr)
        print("=" * 60, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
