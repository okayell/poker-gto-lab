/* GTO 撲克學院 — coach_engine.js
 * 「GTO 基準 ＋ 實戰剝削」雙軌牌局覆盤教練引擎
 * 評估每個 Hero 決策點，產出數學透視（賠率/MDF/SPR/勝率）、GTO 建議、剝削建議、
 * 決策評級（best/good/inaccuracy/mistake/blunder）與 54 課精準對應。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  // 實戰常見漏洞類型定義（Leak Codes）與對應課程清單（100% 存在於 GTO.THEORY）
  const LEAK_DEFINITIONS = {
    open_limp: {
      code: 'open_limp',
      title: '翻前主動溜入平跟（Open Limp）',
      desc: '在無人加注時平跟 1bb 溜入，放棄翻前主動權與棄牌權益，極易被後位隔離加注。',
      lessons: ['preflop-rfi', 'limped-pots', 'positions'],
    },
    unisolated_limper: {
      code: 'unisolated_limper',
      title: '面對溜入未進行隔離加注',
      desc: '前位有魚溜入 1bb 時跟著平跟，讓盲注便宜看翻牌，應以 3bb+1bb/limper 進行隔離。',
      lessons: ['limped-pots', 'preflop-vs-open', 'squeeze-coldcall'],
    },
    dominated_cold_call: {
      code: 'dominated_cold_call',
      title: '用易被壓制的非同花牌冷跟',
      desc: '面對前位開池，用 KJo、QTo、A7o 等冷跟，翻後極易命中次大頂對輸大底池。',
      lessons: ['preflop-vs-open', 'starting-hands-101', 'positions'],
    },
    passive_blind_defense: {
      code: 'passive_blind_defense',
      title: '盲注防守尺度失當',
      desc: '大盲位面對按鈕小尺度開池放棄過多好賠率手牌，或小盲位頻繁冷跟失去位置。',
      lessons: ['blind-defense', 'poker-math', 'outs-odds'],
    },
    missed_cbet_dry: {
      code: 'missed_cbet_dry',
      title: '乾燥高張面錯失持續下注（C-Bet）',
      desc: '在 K72 彩虹面等加注者絕對優勢面隨後過牌，未用 1/3 底池小注向對手空氣牌施壓。',
      lessons: ['cbet', 'board-texture', 'bet-sizing'],
    },
    underbet_wet_board: {
      code: 'underbet_wet_board',
      title: '潮濕動態牌面下注尺度過小',
      desc: '在 JT9 雙色動態面僅下注 1bb 或 20% 底池，給對手聽牌極便宜的成牌賠率。',
      lessons: ['bet-sizing', 'board-texture', 'draws-play'],
    },
    bad_pot_odds_chase: {
      code: 'bad_pot_odds_chase',
      title: '賠率不足硬追弱聽牌',
      desc: '底池賠率需 30% 以上勝率，卻拿 4 張 Outs（約 8.7% 勝率）的卡順強行跟注大注。',
      lessons: ['poker-math', 'outs-odds', 'draws-play'],
    },
    bluffing_calling_station: {
      code: 'bluffing_calling_station',
      title: '向跟注站連開三槍純詐唬',
      desc: '面對從不棄掉任何一對的跟注魚，在河牌進行純空氣大注詐唬，屬於嚴重負 EV。',
      lessons: ['river-decisions', 'player-types', 'exploit'],
    },
    paying_off_nit: {
      code: 'paying_off_nit',
      title: '硬跟緊弱岩石的轉河大注',
      desc: '緊弱玩家轉牌/河牌大注或加注幾乎 100% 為兩對或暗三條以上強牌，硬跟損耗籌碼。',
      lessons: ['player-types', 'exploit', 'hand-reading'],
    },
    folding_to_maniac: {
      code: 'folding_to_maniac',
      title: '面對瘋子過牌加注或超池注過度棄牌',
      desc: '瘋子擁有大量純空氣詐唬範圍，手握強頂對或優質抓詐牌時應依底池賠率堅定抓詐。',
      lessons: ['mdf-alpha', 'defense-postflop', 'player-types'],
    },
    multiway_air_cbet: {
      code: 'multiway_air_cbet',
      title: '多人底池拿空氣盲目 C-Bet',
      desc: '3 人以上底池至少一位對手命中的機率大幅提高，拿空氣牌應放棄下注節省籌碼。',
      lessons: ['multiway', 'cbet', 'range-thinking'],
    },
    spr_commitment_error: {
      code: 'spr_commitment_error',
      title: '低 SPR 底池籌碼承諾誤判',
      desc: '翻牌圈 SPR < 2 時頂對頂踢腳已實質套池，不應過牌控池或中途棄牌。',
      lessons: ['spr', 'bet-sizing', '3bet-pots'],
    },
    overfolding_to_tiny_bet: {
      code: 'overfolding_to_tiny_bet',
      title: '面對極小注過度棄牌',
      desc: '當底池賠率低於 10% 時，成牌或弱聽牌具備極高跟注期望值，棄牌屬於嚴重大錯。',
      lessons: ['poker-math', 'outs-odds', 'defense-postflop'],
    },
  };

  /** 計算手牌 Outs 數（簡化快算） */
  function estimateOuts(holeCards, board) {
    if (!holeCards || holeCards.length < 2 || !board || board.length < 3 || board.length >= 5) return 0;
    const all = holeCards.concat(board);
    const suits = {};
    all.forEach((c) => { suits[c[1]] = (suits[c[1]] || 0) + 1; });
    let maxSuit = 0;
    for (const s in suits) if (suits[s] > maxSuit) maxSuit = suits[s];

    let outs = 0;
    if (maxSuit === 4) outs += 9; // 同花聽牌 9 outs
    // 粗估順子聽牌
    const rSet = new Set(all.map((c) => '23456789TJQKA'.indexOf(c[0])));
    if (rSet.size >= 4) outs += 4; // 順子聽牌約 4~8 outs
    return Math.min(15, outs);
  }

  // ===========================================================================
  // 54 課章節小節索引器與對照解析
  // ===========================================================================
  const STAGE_META_FALLBACK = {
    beginner: { no: 0, title: '新手村', icon: '🐣' },
    basics: { no: 1, title: '基礎功', icon: '🧱' },
    gto: { no: 2, title: 'GTO 核心', icon: '♟️' },
    preflop: { no: 3, title: '翻前系統', icon: '🃏' },
    postflop: { no: 4, title: '翻後系統', icon: '🎯' },
    advanced: { no: 5, title: '實戰進階', icon: '🚀' },
  };

  const PART_TO_STAGE_FALLBACK = {
    '〇、新手村': 'beginner',
    '一、基礎篇': 'basics',
    '二、GTO 核心觀念': 'gto',
    '三、翻前策略': 'preflop',
    '四、翻後策略': 'postflop',
    '五、實戰與進階': 'advanced',
  };

  const LESSON_ORDER_FALLBACK = [
    'welcome', 'hand-rankings', 'hand-flow', 'betting-actions', 'reading-board', 'starting-hands-101',
    'beginner-strategy', 'beginner-mistakes', 'etiquette',
    'rules', 'positions', 'hands-combos', 'poker-math', 'outs-odds',
    'gto-intro', 'mdf-alpha', 'value-bluff', 'range-thinking', 'equity-realization', 'fold-equity', 'blockers',
    'preflop-rfi', 'preflop-vs-open', 'blind-defense', 'preflop-3bet', 'squeeze-coldcall', 'preflop-vs-3bet',
    'preflop-4bet', 'limped-pots',
    'board-texture', 'cbet', 'postflop-bet-types', 'bet-sizing', 'spr', 'defense-postflop', 'oop-play',
    'draws-play', 'hand-reading', '3bet-pots', 'turn-river', 'river-decisions',
    'exploit', 'player-types', 'multiway', 'live-tells', 'mental-game', 'bankroll-mindset', 'game-formats',
    'mtt-basics', 'icm-pushfold', 'solver-basics', 'game-selection', 'hand-review', 'study-plan',
  ];

  let _lessonIndexCache = null;

  /**
   * 初始化 54 課完整章節與 <h3> 小節快取
   */
  function initLessonIndexCache() {
    if (_lessonIndexCache) return _lessonIndexCache;
    const theoryList = GTO.THEORY || [];
    const stageMap = (GTO.ui && GTO.ui.STAGE_MAP) || STAGE_META_FALLBACK;
    const stageOrder = (GTO.ui && GTO.ui.LESSON_ORDER) || LESSON_ORDER_FALLBACK;

    const byStage = {};
    Object.keys(STAGE_META_FALLBACK).forEach((sid) => { byStage[sid] = []; });

    theoryList.forEach((l) => {
      const sid = l.stage || PART_TO_STAGE_FALLBACK[l.part] || 'advanced';
      if (!byStage[sid]) byStage[sid] = [];
      byStage[sid].push(l);
    });

    Object.keys(byStage).forEach((sid) => {
      byStage[sid].sort((a, b) => {
        const ia = stageOrder.indexOf(a.id);
        const ib = stageOrder.indexOf(b.id);
        return (ia >= 0 ? ia : 999) - (ib >= 0 ? ib : 999);
      });
    });

    _lessonIndexCache = {};
    Object.keys(byStage).forEach((sid) => {
      const list = byStage[sid];
      list.forEach((l, idx) => {
        const stageInfo = stageMap[sid] || STAGE_META_FALLBACK[sid] || { no: 0, title: '撲克課程', icon: '📘' };
        const sections = [];
        const re = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
        let m;
        let secIdx = 1;
        while ((m = re.exec(l.html || '')) !== null) {
          const rawTitle = m[1].replace(/<[^>]+>/g, '').trim().replace(/^\s*\d+[.、]\s*/, '');
          sections.push({
            secId: 'sec-' + secIdx,
            secNo: secIdx,
            secTitle: rawTitle || ('第 ' + secIdx + ' 節'),
          });
          secIdx++;
        }
        if (!sections.length) {
          sections.push({ secId: 'sec-1', secNo: 1, secTitle: l.title });
        }

        _lessonIndexCache[l.id] = {
          id: l.id,
          icon: l.icon || '📘',
          title: l.title,
          stage: sid,
          stageNo: stageInfo.no !== undefined ? stageInfo.no : 0,
          stageTitle: stageInfo.title || sid,
          stageIcon: stageInfo.icon || '📘',
          lessonNo: idx + 1,
          sections,
          minutes: l.minutes || 5,
          tldr: l.tldr || l.summary || '',
        };
      });
    });

    return _lessonIndexCache;
  }

  /**
   * 精準解析課程指定章節小節（三層定位）
   * @param {string} lessonId 54 課之一的 ID
   * @param {string|RegExp|number} keywordRegexOrIdx 關鍵字正則、字串、或小節序號 (1-based)
   * @param {Object} opts { role, conceptTag, whyHere }
   */
  function resolveLessonChapter(lessonId, keywordRegexOrIdx, opts) {
    opts = opts || {};
    const cache = initLessonIndexCache();
    const info = cache[lessonId] || (GTO.THEORY || []).find((l) => l.id === lessonId);
    if (!info) return null;

    const sections = info.sections || [{ secId: 'sec-1', secNo: 1, secTitle: info.title }];
    let pickedSec = sections[0];

    if (typeof keywordRegexOrIdx === 'number') {
      const idx = Math.max(1, Math.min(sections.length, keywordRegexOrIdx));
      pickedSec = sections[idx - 1] || sections[0];
    } else if (typeof keywordRegexOrIdx === 'string' && keywordRegexOrIdx.startsWith('sec-')) {
      pickedSec = sections.find((s) => s.secId === keywordRegexOrIdx) || sections[0];
    } else if (keywordRegexOrIdx) {
      const pat = typeof keywordRegexOrIdx === 'string' ? new RegExp(keywordRegexOrIdx, 'i') : keywordRegexOrIdx;
      const found = sections.find((s) => pat.test(s.secTitle));
      if (found) pickedSec = found;
    }

    const secId = pickedSec.secId || 'sec-1';
    return {
      id: info.id,
      icon: info.icon || '📘',
      title: info.title,
      stage: info.stage,
      stageNo: info.stageNo !== undefined ? info.stageNo : 0,
      stageTitle: info.stageTitle || '撲克系統',
      stageIcon: info.stageIcon || '📘',
      lessonNo: info.lessonNo || 1,
      secId,
      secNo: pickedSec.secNo || 1,
      secTitle: pickedSec.secTitle,
      href: '#/learn/' + info.id + '?sec=' + secId,
      quizHref: '#/quiz/theory?topic=' + info.id,
      role: opts.role || 'applied',
      conceptTag: opts.conceptTag || '',
      whyHere: opts.whyHere || info.tldr || '',
      tldr: info.tldr || '',
      minutes: info.minutes || 5,
    };
  }

  /**
   * 當玩家做出正確標準行動（best / good）時，挑選 2～3 個本步實際運用的章節
   */
  function getAppliedLessonsForDecision(ctx) {
    const list = [];
    const street = ctx.street || 'preflop';
    const heroPos = ctx.heroPos || 'BTN';

    if (street === 'preflop') {
      if (ctx.isUnopened) {
        list.push({
          id: 'preflop-rfi',
          kw: /範圍|尺度|一覽表/i,
          why: '在 ' + heroPos + ' 位置遵守標準 RFI 開池加注/棄牌頻率。',
          conceptTag: '開池加注策略',
        });
        list.push({
          id: 'positions',
          kw: /位置|優勢/i,
          why: '充分利用 ' + heroPos + ' 的位置特性，控制入池手牌品質。',
          conceptTag: '位置優勢',
        });
        list.push({
          id: 'starting-hands-101',
          kw: /起手牌|評級/i,
          why: '嚴格篩選起手牌，杜絕邊緣負期望值手牌入池。',
          conceptTag: '起手牌篩選',
        });
      } else if (ctx.limpersCount >= 1) {
        list.push({
          id: 'limped-pots',
          kw: /隔離加注|尺度/i,
          why: '面對前位溜入進行標準隔離加注，奪取翻前主動權與死錢。',
          conceptTag: '隔離加注',
        });
        list.push({
          id: 'positions',
          kw: /位置|優勢/i,
          why: '在後位隔離可建立翻後絕對的位置優勢。',
          conceptTag: '位置優勢',
        });
        list.push({
          id: 'squeeze-coldcall',
          kw: /壓榨|冷跟/i,
          why: '隔離加注施壓多方，避免多人混戰稀釋手牌勝率。',
          conceptTag: '壓榨加注',
        });
      } else if (ctx.pfrCount === 1) {
        list.push({
          id: 'preflop-vs-open',
          kw: /面對開池|防守/i,
          why: '面對開池加注，根據自身位置與對手範圍制定標準應對。',
          conceptTag: '面對開池',
        });
        if (['SB', 'BB'].includes(heroPos)) {
          list.push({
            id: 'blind-defense',
            kw: /防守|大盲/i,
            why: '大盲位依底池賠率計算防守門檻，守衛盲注資產。',
            conceptTag: '盲注防守',
          });
        } else {
          list.push({
            id: 'preflop-3bet',
            kw: /3-Bet|頻率/i,
            why: '維持足夠的 3-Bet 施壓頻率奪取翻前主動權。',
            conceptTag: '3-Bet 施壓',
          });
        }
        list.push({
          id: 'positions',
          kw: /位置|優勢/i,
          why: '評估翻後是否有位置，決定跟注或加注策略。',
          conceptTag: '位置優勢',
        });
      } else {
        list.push({
          id: 'preflop-vs-3bet',
          kw: /3-Bet|防守/i,
          why: '面對 3-Bet 依 MDF 防守門檻與手牌可玩性做出正確抉擇。',
          conceptTag: '面對 3-Bet',
        });
        list.push({
          id: 'preflop-4bet',
          kw: /4-Bet|價值/i,
          why: '用強牌價值 4-Bet 或精準阻擋牌進行平衡詐唬。',
          conceptTag: '4-Bet 策略',
        });
        list.push({
          id: 'mdf-alpha',
          kw: /MDF|最低防守/i,
          why: '計算最低防守頻率（MDF），防止對手無成本 3-Bet 剝削。',
          conceptTag: '最低防守頻率',
        });
      }
    } else if (street === 'flop') {
      list.push({
        id: 'board-texture',
        kw: /質地|乾燥|潮濕/i,
        why: '翻牌圈質地（' + (ctx.tex === 'dry' ? '乾燥彩虹面' : ctx.tex === 'wet' ? '潮濕動態面' : '牌面質地') + '）深刻影響雙方範圍優勢與下注策略。',
        conceptTag: '牌面質地',
      });
      list.push({
        id: 'cbet',
        kw: /C-Bet|頻率|IP/i,
        why: '翻牌圈持續下注或過牌控池精確對齊範圍優勢。',
        conceptTag: '持續下注',
      });
      if (ctx.outs >= 4) {
        list.push({
          id: 'draws-play',
          kw: /聽牌|出牌/i,
          why: '聽牌依據出牌數（Outs）與隱含賠率進行正確跟注或半詐唬。',
          conceptTag: '聽牌處理',
        });
      } else {
        list.push({
          id: 'bet-sizing',
          kw: /尺度|幾何/i,
          why: '下注尺度符合底池比例（1/3 小注控池施壓或大注防守）。',
          conceptTag: '下注尺度',
        });
      }
    } else {
      list.push({
        id: 'turn-river',
        kw: /轉牌|河牌/i,
        why: '轉牌與河牌圈隨著牌面延伸重新評估雙方範圍強弱。',
        conceptTag: '轉牌與河牌',
      });
      list.push({
        id: 'river-decisions',
        kw: /價值|詐唬|抓詐/i,
        why: '河牌極化下注、薄價值提取或冷靜抓詐。',
        conceptTag: '河牌決策',
      });
      if (ctx.villain === 'station') {
        list.push({
          id: 'exploit',
          kw: /剝削|跟注站/i,
          why: '針對跟注站性格特點調整價值下注與過牌決策。',
          conceptTag: '對手剝削',
        });
      } else {
        list.push({
          id: 'poker-math',
          kw: /賠率|勝率/i,
          why: '嚴格比對底池賠率與當前勝率/聽牌實現率。',
          conceptTag: '底池賠率',
        });
      }
    }
    return list;
  }

  /**
   * 整手牌涵蓋觀念與課程章節總覽
   * @param {Object} handRecord 完整手牌紀錄
   * @returns {Array} 3～6 個核心觀念，每個帶有 { badge, spotText, chapter }
   */
  function analyzeHandConcepts(handRecord) {
    if (!handRecord) return [];
    const concepts = [];
    const seenLessons = new Set();

    function addConcept(badge, spotText, lessonId, keywordRegexOrIdx, whyHere) {
      if (seenLessons.has(lessonId)) return;
      const ch = resolveLessonChapter(lessonId, keywordRegexOrIdx, { role: 'applied', whyHere, conceptTag: badge });
      if (ch) {
        seenLessons.add(lessonId);
        concepts.push({ badge, spotText, chapter: ch });
      }
    }

    const heroPos = (handRecord.positions && handRecord.positions[0]) || 'BTN';
    const board = handRecord.board || [];
    const actions = handRecord.actions || [];
    const seatPersonas = handRecord.seatPersonas || [];
    const winners = handRecord.winners || [];
    const pots = handRecord.pots || [];

    // 1. 翻前結構 (Preflop Structure)
    let hasLimp = false;
    let preflopRaises = 0;
    actions.forEach((a) => {
      if (a.street === 'preflop') {
        if (a.action === 'call' && a.amount <= 1.0) hasLimp = true;
        if (a.action === 'raise' || (a.action === 'bet' && a.amount > 1.0)) preflopRaises++;
      }
    });

    if (hasLimp) {
      addConcept(
        '翻前結構',
        '牌局翻前出現平跟入池（Limp），底池進入溜入底池動態。',
        'limped-pots',
        /隔離加注|尺度|誰會溜入/i,
        '面對溜入者應以 3bb + 1bb/limper 積極隔離加注奪取翻後主動權。'
      );
    } else if (preflopRaises >= 2) {
      addConcept(
        '翻前結構',
        '翻前出現 3-Bet 加注對抗，底池膨脹且 SPR 顯著下降。',
        'preflop-3bet',
        /3-Bet|頻率|冷跟/i,
        '3-Bet 能夠奪取主動權並有效壓縮後位對手的進入空間。'
      );
    } else {
      addConcept(
        '翻前結構',
        '翻前標準開池加注（RFI）動態，位置（' + heroPos + '）直接決定防守與入池邊界。',
        'preflop-rfi',
        /範圍|尺度|表/i,
        '嚴格遵守位置 RFI 範圍，保持翻前加注或棄牌的進攻頻率。'
      );
    }

    // 2. 位置意識 (Positions)
    addConcept(
      '位置優勢',
      'Hero 本手牌坐於 ' + heroPos + ' 位，' + (['BTN', 'CO'].includes(heroPos) ? '擁有後位絕對進攻主動性' : '在沒有位置優勢下需更謹慎控池') + '。',
      'positions',
      /位置|優勢/i,
      '位置是德州撲克最大利潤來源，後位能獲取對手完整行動情報後再做決策。'
    );

    // 3. 牌面質地與翻後架構 (Board Texture)
    if (board && board.length >= 3) {
      const flop = board.slice(0, 3);
      let tex = 'dry';
      if (GTO.flopTexture) {
        tex = GTO.flopTexture(flop);
      }
      const boardStr = board.join(' ');
      const texDesc = tex === 'dry' ? '乾燥彩虹高張面' : tex === 'wet' ? '潮濕雙色動態面' : tex === 'paired' ? '公對配對面' : '單色同花面';
      addConcept(
        '牌面質地',
        '公共牌發出 ' + boardStr + '（' + texDesc + '），深刻影響雙方範圍領先分布。',
        'board-texture',
        /質地|乾燥|潮濕|動態/i,
        '翻牌圈質地直接決定持續下注（C-Bet）的頻率與尺度規劃。'
      );

      const hasCbet = actions.some((a) => a.street === 'flop' && (a.action === 'bet' || a.action === 'raise'));
      if (hasCbet) {
        addConcept(
          '翻後進攻',
          '翻牌圈發動持續下注（C-Bet），利用範圍優勢向防守方施壓。',
          'cbet',
          /C-Bet|頻率|IP/i,
          '在乾燥面以 1/3 底池高頻小注，在潮濕面以大注保護價值範圍。'
        );
      }
    }

    // 4. 多人底池 / SPR / 籌碼承諾
    const flopActionSeats = new Set();
    actions.forEach((a) => {
      if (a.street === 'flop') flopActionSeats.add(a.seat);
    });
    const isMultiway = flopActionSeats.size >= 3;
    const isAllin = actions.some((a) => a.allin || a.isAllin) || pots.length > 1;

    if (isMultiway) {
      addConcept(
        '多人底池',
        '翻牌圈有 ' + flopActionSeats.size + ' 位玩家同時入池，多人底池防守強度顯著提高。',
        'multiway',
        /多人|質變|收緊/i,
        '多人底池至少一位對手命中強牌的機率大增，純空氣詐唬應大幅降低。'
      );
    } else if (isAllin) {
      addConcept(
        '撲克數學',
        '底池出現 All-in 邊池與極低 SPR，進入籌碼承諾與打光結算。',
        'spr',
        /SPR|承諾|閾值/i,
        '低 SPR（< 3）時強頂對已實質套池，不應過牌控池或中途棄牌。'
      );
    }

    // 5. 對手性格與剝削 (Villain Exploit)
    const inPotPersonas = [];
    seatPersonas.forEach((p, sIdx) => {
      if (sIdx !== 0 && p && p !== 'hero') inPotPersonas.push(p);
    });
    if (inPotPersonas.includes('station')) {
      addConcept(
        '對手剝削',
        '同桌參與者包含「🐟 跟注站新手」，翻後成牌黏著極難棄牌。',
        'player-types',
        /跟注站|魚/i,
        '面對跟注站應最大化薄價值下注，徹底放棄純空氣詐唬。'
      );
    } else if (inPotPersonas.includes('maniac')) {
      addConcept(
        '對手剝削',
        '同桌參與者包含「🔥 激進瘋子」，經常以超池大注與加注進行範圍施壓。',
        'player-types',
        /瘋子|激進/i,
        '面對瘋子應適度拓寬抓詐（Bluff Catcher）範圍，並避免對其反向詐唬。'
      );
    } else if (inPotPersonas.includes('rock')) {
      addConcept(
        '對手剝削',
        '同桌參與者包含「🪨 緊弱岩石」，轉牌與河牌主動下注範圍極強。',
        'player-types',
        /岩石|緊弱/i,
        '面對緊弱岩石的大注應極度過度棄牌，翻前則頻繁偷取其盲注。'
      );
    }

    // 6. 馬腳判讀 (Timing Tells)
    const hasTell = actions.some((a) => a.timingTell && (a.timingTell.includes('⚡') || a.timingTell.includes('⏳') || a.timingTell.includes('fast') || a.timingTell.includes('tank')));
    if (hasTell) {
      addConcept(
        '馬腳判讀',
        '對手在關鍵決策出現思考時間馬腳（秒跟／長考），透露手牌真實傾向。',
        'live-tells',
        /思考時間|秒跟|長考/i,
        '線上與即時對局中，快速過牌/跟注往往代表弱聽牌或中弱對子。'
      );
    }

    // 7. 攤牌牌型與比牌 (Showdown & Hand Rankings)
    if (winners && winners.length && winners[0].handDesc && winners[0].handDesc !== '對手全數棄牌獲勝') {
      addConcept(
        '攤牌牌型',
        '最終進入攤牌結算，贏家以「' + winners[0].handDesc + '」贏得底池。',
        'hand-rankings',
        /牌型大小|等級/i,
        '熟悉十三種牌型大小等級與絕對牌力在不同公共牌面的相對價值。'
      );
    } else if (concepts.length < 3) {
      addConcept(
        '撲克數學',
        '德州撲克所有行動皆以底池賠率（Pot Odds）與預期勝率（Equity）為決策核心。',
        'poker-math',
        /賠率|公式|二四法則/i,
        '隨時計算付出成本與總底池比例，唯有正期望值（+EV）能長遠獲利。'
      );
    }
    if (concepts.length < 3) {
      addConcept(
        '起手牌篩選',
        '起手牌強度決定後續多條街的可玩性（Playability）與實現率。',
        'starting-hands-101',
        /起手牌|評級/i,
        '優質起手牌能避免命中第二大對子等受壓制慘劇。'
      );
    }

    return concepts.slice(0, 6);
  }

  /**
   * 雙軌教練核心評估函式
   * @param {Object} snap 決策快照
   * @param {Object} table 牌桌上下文
   */
  function analyzeDecision(snap, table) {
    const street = snap.street || 'preflop';
    const pot = snap.pot || 1.5;
    const toCall = GTO.TableEngine.roundBb(snap.toCall || 0);
    const stack = snap.heroStack || 100.0;
    const effectiveStack = snap.effectiveStack || stack;
    const heroCards = snap.heroCards || [];
    const heroPos = snap.heroPosition || 'BTN';
    const heroAction = snap.heroAction || 'fold';
    const heroAmount = GTO.TableEngine.roundBb(snap.heroAmount || 0);
    const board = snap.board || [];
    const villain = snap.villainPersona || 'mixed';
    const villainSampleCount = snap.villainHands || 0;

    const potOddsPct = toCall > 0 ? GTO.TableEngine.roundBb((toCall / (pot + toCall)) * 100) : 0;
    const mdfPct = toCall > 0 ? GTO.TableEngine.roundBb((pot / (pot + toCall)) * 100) : 100;
    const spr = GTO.TableEngine.roundBb(effectiveStack / Math.max(1, pot));
    const outs = estimateOuts(heroCards, board);
    const estEquityPct = outs > 0 ? Math.min(95, outs * (street === 'flop' ? 4 : 2)) : 35;

    let grade = 'good';
    let gradeLabel = '✅ 合理標準';
    let evLossBb = 0.0;
    let recAction = heroAction;
    let recAmount = heroAmount;
    let leak = null;
    let gtoAdvice = { action: '', size: '', reason: '' };
    let exploitAdvice = { action: '', targetVillain: villain, villainTendency: '', reason: '' };
    let matchedScenarioId = '';

    // =========================================================================
    // 1. 翻牌前 (Preflop)
    // =========================================================================
    if (street === 'preflop') {
      const hPos = (heroPos || 'BTN').toUpperCase();
      const hPosL = hPos.toLowerCase();
      const pfrCount = snap.preflopRaiseCount !== undefined ? snap.preflopRaiseCount : (toCall > 0 ? 1 : 0);
      const isUnopened = pfrCount === 0 && (toCall <= 0 || (snap.currentBet <= 1.0 && heroPos !== 'BB'));
      const handKey = heroCards.length === 2 ? (GTO.AIPersonas && GTO.AIPersonas.cardsToHandKey ? GTO.AIPersonas.cardsToHandKey(heroCards) : heroCards[0][0] + heroCards[1][0]) : '';

      if (isUnopened) {
        const rfiMap = { UTG: 'rfi_utg', HJ: 'rfi_hj', CO: 'rfi_co', BTN: 'rfi_btn', SB: 'rfi_sb' };
        matchedScenarioId = rfiMap[hPos] || 'rfi_btn';
      } else if (pfrCount === 1) {
        const oPos = (snap.openerPos || 'UTG').toLowerCase();
        const cand = 'vsrfi_' + hPosL + '_' + oPos;
        matchedScenarioId = (GTO.SCENARIOS && GTO.SCENARIOS[cand]) ? cand : ('vsrfi_' + hPosL + '_co' in (GTO.SCENARIOS || {}) ? 'vsrfi_' + hPosL + '_co' : 'vsrfi_btn_co');
      } else if (pfrCount === 2) {
        const tPos = (snap.threeBettorPos || 'BTN').toLowerCase();
        const cand = 'vs3bet_' + hPosL + '_' + tPos;
        matchedScenarioId = (GTO.SCENARIOS && GTO.SCENARIOS[cand]) ? cand : ('vs3bet_' + hPosL + '_btn' in (GTO.SCENARIOS || {}) ? 'vs3bet_' + hPosL + '_btn' : 'vs3bet_btn_bb');
      } else {
        const fPos = (snap.fourBettorPos || 'CO').toLowerCase();
        const cand = 'vs4bet_' + hPosL + '_' + fPos;
        matchedScenarioId = (GTO.SCENARIOS && GTO.SCENARIOS[cand]) ? cand : 'vs4bet_btn_co';
      }

      const sc = GTO.SCENARIOS ? GTO.SCENARIOS[matchedScenarioId] : null;
      const cell = sc && sc.cells ? sc.cells[handKey] : null;

      if (isUnopened) {

        if (heroAction === 'call') {
          // 致命失誤：翻前主動平跟溜入 (Open Limp)
          grade = 'blunder';
          gradeLabel = '❌ 嚴重失誤';
          evLossBb = 2.2;
          recAction = cell && cell.primary > 0.3 ? 'raise' : 'fold';
          recAmount = heroPos === 'SB' ? 3.0 : 2.5;
          leak = LEAK_DEFINITIONS.open_limp;
          gtoAdvice = {
            action: recAction === 'raise' ? '加注 2.5bb' : '直接棄牌',
            size: '2.5bb',
            reason: '6-Max 翻前無人加注時應嚴格遵守「加注或棄牌（Raise-or-Fold）」，絕不主動溜入平跟。',
          };
          exploitAdvice = {
            action: '開池加注 2.5bb',
            villainTendency: '後位有盲注與侵略型玩家',
            reason: '主動溜入平跟只會引來後位加注孤立你，白白損失盲注並在沒位置情況下被動挨打。',
          };
        } else if (cell) {
          if (cell.primary >= 0.7 && heroAction === 'fold') {
            grade = 'mistake';
            gradeLabel = '⚠️ 明顯失誤';
            evLossBb = 1.8;
            recAction = 'raise';
            recAmount = heroPos === 'SB' ? 3.0 : 2.5;
            leak = LEAK_DEFINITIONS.open_limp;
            gtoAdvice = { action: '加注開池', size: '2.5bb', reason: handKey + ' 在 ' + heroPos + ' 是 100% 必開核心手牌，棄牌過度緊弱。' };
          } else if (cell.fold >= 0.8 && (heroAction === 'raise' || heroAction === 'bet')) {
            grade = 'inaccuracy';
            gradeLabel = '💡 小瑕疵';
            evLossBb = 0.8;
            recAction = 'fold';
            gtoAdvice = { action: '棄牌', size: '0bb', reason: handKey + ' 超出 ' + heroPos + ' 開池範圍，屬於邊緣負期望值手牌。' };
          } else {
            grade = 'best';
            gradeLabel = '🌟 最佳決策';
            gtoAdvice = { action: heroAction, size: heroAmount + 'bb', reason: '完全符合 ' + heroPos + ' GTO 範圍矩陣標準頻率。' };
          }
        }
      } else {
        // 面對前位動作
        if (snap.limpersCount && snap.limpersCount >= 1 && heroAction === 'call') {
          grade = 'mistake';
          gradeLabel = '⚠️ 明顯失誤';
          evLossBb = 1.5;
          recAction = 'raise';
          recAmount = GTO.TableEngine.roundBb(3.0 + snap.limpersCount * 1.0);
          leak = LEAK_DEFINITIONS.unisolated_limper;
          gtoAdvice = { action: '隔離加注', size: recAmount + 'bb', reason: '前位有魚溜入，應加注隔離（3bb + 1bb/溜入者），爭奪主動權與死錢。' };
          exploitAdvice = {
            action: '隔離加注至 ' + recAmount + 'bb',
            villainTendency: '跟注站魚喜歡便宜看翻牌',
            reason: '隔離後單挑進翻後，利用位置與範圍優勢持續施壓收割底池。',
          };
        } else {
          grade = 'good';
          gradeLabel = '✅ 合理標準';
          gtoAdvice = { action: heroAction, size: heroAmount + 'bb', reason: '翻前防守與行動符合底池賠率。' };
        }
      }
    } else {
      // =========================================================================
      // 2. 翻後 (Flop / Turn / River)
      // =========================================================================
      const tex = GTO.flopTexture ? GTO.flopTexture(board.slice(0, 3)) : null;

      if (street === 'flop' && heroAction === 'check' && toCall === 0 && tex === 'dry') {
        // 乾燥面錯失 C-Bet
        grade = 'inaccuracy';
        gradeLabel = '💡 小瑕疵';
        evLossBb = 0.6;
        recAction = 'bet';
        recAmount = GTO.TableEngine.roundBb(pot * 0.33);
        leak = LEAK_DEFINITIONS.missed_cbet_dry;
        gtoAdvice = {
          action: '持續下注 1/3 底池',
          size: recAmount + 'bb',
          reason: '乾燥彩虹面加注者具有絕對範圍優勢，應以 1/3 底池高頻持續下注。',
        };
      } else if (toCall > 0 && (toCall / (pot + toCall)) < 0.08 && heroAction === 'fold') {
        // 面對極小注過度棄牌
        grade = 'blunder';
        gradeLabel = '❌ 嚴重失誤';
        evLossBb = GTO.TableEngine.roundBb(pot * 0.35);
        recAction = 'call';
        leak = LEAK_DEFINITIONS.overfolding_to_tiny_bet;
        gtoAdvice = {
          action: '輕鬆跟注',
          size: toCall + 'bb',
          reason: '底池賠率僅需 ' + potOddsPct + '% 勝率，面對極小注棄牌嚴重違反數學期望值。',
        };
      } else if (toCall > pot * 0.7 && outs > 0 && outs <= 4 && heroAction === 'call') {
        // 賠率不足硬追卡順
        grade = 'mistake';
        gradeLabel = '⚠️ 明顯失誤';
        evLossBb = toCall;
        recAction = 'fold';
        leak = LEAK_DEFINITIONS.bad_pot_odds_chase;
        gtoAdvice = {
          action: '棄牌',
          size: '0bb',
          reason: '卡順只有 4 張 Outs（約 8.7% 勝率），面對大注跟注必要勝率達 ' + potOddsPct + '%，嚴重負 EV。',
        };
      } else if (street === 'river' && villain === 'station') {
        let heroCat = 0;
        if (heroCards && heroCards.length === 2 && board && board.length >= 3) {
          const evalRes = (GTO.pk && GTO.pk.bestFive) ? GTO.pk.bestFive(heroCards.concat(board)) : null;
          if (evalRes) heroCat = evalRes.cat;
        }
        const isMonster = heroCat >= 2;
        const isPair = heroCat === 1;
        const isAir = heroCat === 0;

        if ((heroAction === 'bet' || heroAction === 'raise') && isAir) {
          // 致命失誤：拿純空氣對跟注站詐唬
          grade = 'blunder';
          gradeLabel = '❌ 嚴重失誤';
          evLossBb = heroAmount;
          recAction = 'check';
          leak = LEAK_DEFINITIONS.bluffing_calling_station;
          gtoAdvice = { action: '過牌放棄', size: '0bb', reason: '河牌空氣牌無法獲得更差牌跟注，亦無詐唬棄牌率。' };
          exploitAdvice = {
            action: '過牌放棄',
            villainTendency: '跟注站絕不棄對子',
            reason: '跟注站棄牌率遠低於理論 Alpha，任何空氣詐唬都是白送籌碼（負 EV）。',
          };
        } else if (heroAction === 'check' && (isMonster || isPair)) {
          // 瑕疵：對跟注站錯失價值下注
          grade = 'inaccuracy';
          gradeLabel = '💡 小瑕疵';
          evLossBb = GTO.TableEngine.roundBb(pot * 0.5);
          recAction = 'bet';
          recAmount = GTO.TableEngine.roundBb(pot * 0.65);
          gtoAdvice = { action: '薄價值下注', size: recAmount + 'bb', reason: '成牌面對弱範圍應主動下注獲取價值。' };
          exploitAdvice = {
            action: '打價值注 65% 底池',
            villainTendency: '跟注站用弱對子甚至高牌跟注',
            reason: '面對跟注站必須最大化價值下注，過牌給對手免費看牌錯失大把籌碼。',
          };
        } else {
          grade = 'best';
          gradeLabel = '🌟 最佳決策';
          gtoAdvice = { action: heroAction, size: heroAmount + 'bb', reason: '河牌行動精準對齊牌力與底池結構。' };
          exploitAdvice = {
            action: heroAction,
            villainTendency: '跟注站成牌黏著',
            reason: (heroAction === 'bet' || heroAction === 'raise') ? '成牌打大注完美榨取跟注站價值！' : '無成牌果斷過牌停損。',
          };
        }
      } else {
        grade = 'good';
        gradeLabel = '✅ 合理標準';
        gtoAdvice = { action: heroAction, size: heroAmount + 'bb', reason: '決策符合牌面結構與籌碼深度比例。' };
        exploitAdvice = {
          action: heroAction,
          villainTendency: snap.villainHands >= 8 ? '對手在桌樣本充足' : '對手手數樣本 < 8，維持均衡',
          reason: snap.villainHands >= 8 ? '依對手即時傾向維持高 EV 應對。' : '在對手足夠樣本累積前，以 GTO 均衡頻率為防守基準。',
        };
      }
    }

    // 確保雙軌建議必填且完整
    if (!gtoAdvice.action) {
      gtoAdvice = {
        action: heroAction,
        size: (heroAmount || 0) + 'bb',
        reason: '決策符合基礎期望值（EV）與牌面結構。',
      };
    }
    if (!exploitAdvice.action) {
      const hasSample = snap.villainHands >= 8;
      exploitAdvice = {
        action: heroAction,
        targetVillain: villain,
        villainTendency: hasSample ? '對手在桌樣本統計' : '對手手數 < 8，維持均衡',
        reason: hasSample ? '依對手統計破綻實施針對性調整。' : '對手樣本不足，優先遵守 GTO 均衡防守避免被反向剝削。',
      };
    }

    // 關聯到真實 54 課教材（支援三層章節小節定位）
    const matchedLessons = [];
    if (leak && Array.isArray(leak.lessons)) {
      leak.lessons.forEach((lid) => {
        const ch = resolveLessonChapter(lid, null, {
          role: 'fix',
          whyHere: leak.desc || leak.title,
          conceptTag: leak.title,
        });
        if (ch) matchedLessons.push(ch);
      });
    } else {
      // leak == null: best 或 good，絕對不可留空！
      const appliedList = getAppliedLessonsForDecision({
        street,
        heroPos,
        heroAction,
        heroAmount,
        pot,
        toCall,
        spr,
        outs,
        tex: GTO.flopTexture && board && board.length >= 3 ? GTO.flopTexture(board.slice(0, 3)) : 'dry',
        villain,
        pfrCount: snap.preflopRaiseCount !== undefined ? snap.preflopRaiseCount : (toCall > 0 ? 1 : 0),
        limpersCount: snap.limpersCount || 0,
        isUnopened: street === 'preflop' && (snap.preflopRaiseCount === 0 || snap.preflopRaiseCount === undefined) && (toCall <= 0 || (snap.currentBet <= 1.0 && heroPos !== 'BB')),
        gradeLabel,
      });
      appliedList.forEach((it) => {
        const ch = resolveLessonChapter(it.id, it.kw, {
          role: 'applied',
          whyHere: it.why,
          conceptTag: it.conceptTag || gradeLabel,
        });
        if (ch) matchedLessons.push(ch);
      });
    }

    return {
      grade,
      gradeLabel,
      evLossBb: GTO.TableEngine.roundBb(evLossBb),
      heroAction,
      heroAmount,
      recommendedAction: recAction,
      recommendedAmount: recAmount,
      potOddsPct,
      mdfPct,
      spr,
      outs,
      equityPct: estEquityPct,
      matchedScenarioId,
      leakCode: leak ? leak.code : '',
      leakTitle: leak ? leak.title : '',
      gtoAdvice,
      exploitAdvice,
      lessons: matchedLessons,
    };
  }

  /**
   * 累積戰績至進度物件 GTO.progress.arenaStats
   */
  function recordArenaHandSummary(handRecord) {
    if (!handRecord || !GTO.progress) return;
    const p = GTO.progress;
    p.arenaStats = p.arenaStats || {
      handsPlayed: 0,
      totalProfitBb: 0.0,
      totalDecisions: 0,
      goodDecisions: 0,
      leaks: {},
    };
    const st = p.arenaStats;
    st.handsPlayed++;
    const heroProfit = handRecord.netProfit ? Number(handRecord.netProfit[0] || 0) : 0;
    st.totalProfitBb = GTO.TableEngine.roundBb(st.totalProfitBb + heroProfit);

    const decisions = handRecord.heroDecisions || [];
    decisions.forEach((d) => {
      st.totalDecisions++;
      if (d.analysis) {
        if (d.analysis.grade === 'best' || d.analysis.grade === 'good') {
          st.goodDecisions++;
        }
        if (d.analysis.leakCode) {
          const c = d.analysis.leakCode;
          const cur = st.leaks[c] || {
            code: c,
            title: d.analysis.leakTitle,
            count: 0,
            evLossBb: 0.0,
            lessons: d.analysis.lessons ? d.analysis.lessons.map((l) => l.id) : [],
          };
          cur.count++;
          cur.evLossBb = GTO.TableEngine.roundBb(cur.evLossBb + (d.analysis.evLossBb || 0));
          st.leaks[c] = cur;
        }
      }
    });

    if (GTO.saveProgress) GTO.saveProgress();
  }

  GTO.CoachEngine = {
    LEAK_DEFINITIONS,
    STAGE_META_FALLBACK,
    PART_TO_STAGE_FALLBACK,
    initLessonIndexCache,
    resolveLessonChapter,
    analyzeHandConcepts,
    analyzeDecision,
    recordArenaHandSummary,
    estimateOuts,
  };
})();
