/* GTO 撲克學院 — ai_personas.js
 * 6 種擬真 AI 性格、場次生態、動態上頭（Tilt）、時間馬腳與決策引擎。
 * 支援隱藏真實性格、即時 HUD 追蹤、玩家自訂筆記標籤與 Web Worker 非同步勝率運算。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  const AI_NAMES_POOL = [
    '阿哲', 'Kevin_TW', '信義區散步', '夜貓阿翔', 'Mia_88',
    '晴天小狗', '小林', '大谷', 'Jason_K', 'Ray_01',
    '小安', '台北大叔', '咖啡中毒', 'Leo_TPE', '波波',
    '小明', 'Gary_Poker', '蛋餅加蛋', 'Andy_C', '老陳',
  ];

  const AI_PERSONAS = {
    station: {
      id: 'station',
      name: '跟注站新手',
      badge: '🐟 跟注站新手',
      tagIcon: '🐟',
      vpipTarget: 0.52,
      pfrTarget: 0.08,
      threeBetTarget: 0.03,
      desc: '極高入池率，超愛翻前平跟（Limp 1bb）與冷跟加注；翻後只要有任何底對、卡順、高牌就極難棄牌；極少主動詐唬，常打出 1bb 最小注或隨意小注。',
      stackRange: [38, 85],
      tiltSusceptibility: 0.85, // 易上頭
    },
    maniac: {
      id: 'maniac',
      name: '亂加注瘋子',
      badge: '💣 亂加注瘋子',
      tagIcon: '💣',
      vpipTarget: 0.62,
      pfrTarget: 0.44,
      threeBetTarget: 0.22,
      desc: '極具侵略性，翻前翻後動輒亂跳尺度加注、1.5x～2.2x 超池狂轟或 1bb 最小反加，經常連開三槍純空氣詐唬。',
      stackRange: [60, 160],
      tiltSusceptibility: 0.95, // 極易狂暴上頭
    },
    jammer: {
      id: 'jammer',
      name: '無腦 All-in 客',
      badge: '🚀 無腦 All-in 客',
      tagIcon: '🚀',
      vpipTarget: 0.38,
      pfrTarget: 0.30,
      threeBetTarget: 0.25,
      desc: '偏好中短碼或受情緒推動，翻前頻繁以中小對子、Ax 或高牌直接 Open-shove 或 3-Bet All-in；翻牌中頂對或聽牌也常無視底池直接推光。',
      stackRange: [35, 75],
      tiltSusceptibility: 0.90,
    },
    nit: {
      id: 'nit',
      name: '緊弱岩石',
      badge: '🪨 緊弱岩石',
      tagIcon: '🪨',
      vpipTarget: 0.14,
      pfrTarget: 0.11,
      threeBetTarget: 0.04,
      desc: '只玩金字塔頂端強牌（TT+、AK），翻後沒中強牌傾向過牌棄牌（Fit-or-fold）；轉河若主動大注或加注，手中幾乎必有兩對或暗三條以上強牌。',
      stackRange: [80, 110],
      tiltSusceptibility: 0.25, // 冷靜不易上頭
    },
    shark: {
      id: 'shark',
      name: '實戰剝削好手',
      badge: '🦈 實戰剝削好手',
      tagIcon: '🦈',
      vpipTarget: 0.26,
      pfrTarget: 0.22,
      threeBetTarget: 0.09,
      desc: '熟悉位置優勢，遇到前位溜入會打 3bb+1bb 隔離加注；懂得對跟注站多打薄價值、對瘋子設陷阱、對緊弱施加偷池壓力。',
      stackRange: [100, 150],
      tiltSusceptibility: 0.30,
    },
    gto: {
      id: 'gto',
      name: 'GTO 均衡高手',
      badge: '🤖 GTO 均衡高手',
      tagIcon: '🤖',
      vpipTarget: 0.25,
      pfrTarget: 0.21,
      threeBetTarget: 0.08,
      desc: '嚴格參照 6-Max 翻前 40 組 GTO 範圍表與混合頻率；翻後依牌面乾燥/潮濕結構、幾何下注尺度與 MDF 保持進攻與防守平衡。',
      stackRange: [100, 140],
      tiltSusceptibility: 0.05, // 機器人般無情緒
    },
  };

  const ECOLOGY_PRESETS = {
    beginner: {
      id: 'beginner',
      title: '🐣 新手歡樂場',
      sub: '充滿跟注站、無腦推擠客與緊弱玩家，最適合練習打純價值與剝削軟柿子',
      roster: ['station', 'station', 'jammer', 'nit', 'maniac'],
    },
    mixed: {
      id: 'mixed',
      title: '🎲 真實混編場 (預設)',
      sub: '模擬真實線上 6-Max：魚、瘋子、緊弱與 1～2 位好手同桌，考驗精準讀人',
      roster: ['station', 'maniac', 'jammer', 'nit', 'shark'],
    },
    shark: {
      id: 'shark',
      title: '🦈 高手修羅場',
      sub: '高手與 GTO 均衡玩家盤據，容錯率低，極度考驗範圍理解與下注尺度',
      roster: ['shark', 'gto', 'shark', 'gto', 'maniac'],
    },
    random: {
      id: 'random',
      title: '🎁 全隨機盲盒桌',
      sub: '5 位對手性格完全隨機抽取，必須全靠現場 HUD 數據與行動馬腳摸清底細',
      roster: null, // 動態隨機
    },
    custom: {
      id: 'custom',
      title: '🛠️ 自訂座位場',
      sub: '自由指定每席 AI 的性格與帶入籌碼量，進行專項特訓',
      roster: null,
    },
  };

  const USER_TAGS = [
    { key: '', label: '❓ 未標記', icon: '❓' },
    { key: 'station', label: '🐟 跟注魚', icon: '🐟' },
    { key: 'maniac', label: '💣 瘋子', icon: '💣' },
    { key: 'jammer', label: '🚀 無腦推', icon: '🚀' },
    { key: 'nit', label: '🪨 緊弱', icon: '🪨' },
    { key: 'shark', label: '🦈 高手', icon: '🦈' },
  ];

  /** 為座位配置指定生態的性格與名稱 */
  function populateTableRoster(table, presetKey, stackMode) {
    presetKey = presetKey || 'mixed';
    stackMode = stackMode || 'realistic';
    const preset = ECOLOGY_PRESETS[presetKey] || ECOLOGY_PRESETS.mixed;
    const allKeys = Object.keys(AI_PERSONAS);
    const shuffledNames = GTO.shuffle ? GTO.shuffle(AI_NAMES_POOL.slice()) : AI_NAMES_POOL.slice();

    for (let i = 1; i < 6; i++) {
      let pKey;
      if (preset.roster && preset.roster[i - 1]) {
        pKey = preset.roster[i - 1];
      } else {
        pKey = allKeys[Math.floor(Math.random() * allKeys.length)];
      }
      const persona = AI_PERSONAS[pKey] || AI_PERSONAS.station;
      const seat = table.seats[i];
      seat.persona = pKey;
      seat.personaBadge = persona.badge;
      seat.name = shuffledNames[i - 1] || '牌手 ' + i;
      seat.tilt = 0;

      if (stackMode === '100bb') {
        seat.stack = 100.0;
      } else {
        const [minB, maxB] = persona.stackRange;
        seat.stack = GTO.TableEngine.roundBb(minB + Math.random() * (maxB - minB));
      }
    }
  }

  /** 手牌字串轉正規格式，如 ['Ah', 'Kd'] → 'AKo' */
  function cardsToHandKey(cards) {
    if (!cards || cards.length < 2) return '';
    const r1 = cards[0][0], s1 = cards[0][1];
    const r2 = cards[1][0], s2 = cards[1][1];
    const idx1 = GTO.rankIdx ? GTO.rankIdx(r1) : 'AKQJT98765432'.indexOf(r1);
    const idx2 = GTO.rankIdx ? GTO.rankIdx(r2) : 'AKQJT98765432'.indexOf(r2);
    if (idx1 === idx2) return r1 + r2;
    const hi = idx1 < idx2 ? r1 : r2;
    const lo = idx1 < idx2 ? r2 : r1;
    const suited = s1 === s2;
    return hi + lo + (suited ? 's' : 'o');
  }

  /** 估算手牌原始強度（0..1） */
  function rawHandStrength(holeCards) {
    if (!holeCards || holeCards.length < 2) return 0.2;
    const key = cardsToHandKey(holeCards);
    const hi = key[0], lo = key[1], suited = key[2] === 's';
    const ranks = '23456789TJQKA';
    const v1 = ranks.indexOf(hi), v2 = ranks.indexOf(lo);
    if (v1 === v2) return 0.5 + (v1 / 12) * 0.5; // 對子 0.5 ~ 1.0
    let sc = (Math.max(v1, v2) * 1.5 + Math.min(v1, v2)) / 30;
    if (suited) sc += 0.12;
    if (Math.abs(v1 - v2) <= 2) sc += 0.06; // 連張
    return Math.min(0.95, Math.max(0.05, sc));
  }

  /** 查閱 GTO 範圍表取得動作建議 */
  function queryGtoPreflop(pos, holeCards, currentBet) {
    const handKey = cardsToHandKey(holeCards);
    if (!handKey) return null;
    let scId = '';
    if (currentBet <= 1.0) {
      // 未被加注，屬於開池 (RFI)
      const rfiMap = { UTG: 'rfi_utg', HJ: 'rfi_hj', CO: 'rfi_co', BTN: 'rfi_btn', SB: 'rfi_sb' };
      scId = rfiMap[pos] || 'rfi_btn';
    } else {
      // 面對開池
      const vsMap = { BB: 'vsrfi_bb_btn', SB: 'vsrfi_sb_btn', BTN: 'vsrfi_btn_co', CO: 'vsrfi_co_hj', HJ: 'vsrfi_hj_utg' };
      scId = vsMap[pos] || 'vsrfi_bb_btn';
    }
    const sc = GTO.SCENARIOS ? GTO.SCENARIOS[scId] : null;
    if (sc && sc.cells && sc.cells[handKey]) {
      return { scId, cell: sc.cells[handKey] };
    }
    return null;
  }

  /** AI 核心決策引擎 */
  function decideAiAction(table, seatId) {
    const s = table.seats[seatId];
    const legal = table.getLegalActions(seatId);
    const personaKey = s.persona || 'station';
    const persona = AI_PERSONAS[personaKey] || AI_PERSONAS.station;
    const street = table.street;
    const pot = table.pot;
    const currentBet = table.currentBet;
    const toCall = GTO.TableEngine.roundBb(currentBet - s.currentBet);
    const pos = s.position || 'UTG';
    const holeCards = s.holeCards || [];
    const handKey = cardsToHandKey(holeCards);
    const rawPower = rawHandStrength(holeCards);

    // 上頭 (Tilt) 效應修正
    const tiltFactor = (s.tilt || 0) / 100.0 * persona.tiltSusceptibility;

    let action = 'fold';
    let targetAmount = 0.0;
    let timingTell = '⏱️ 正常';
    let delayMs = 900;
    let reason = '';

    // =========================================================================
    // 翻牌前 (Preflop)
    // =========================================================================
    if (street === 'preflop') {
      const isUnopened = currentBet <= 1.0;

      if (personaKey === 'gto') {
        const gtoRes = queryGtoPreflop(pos, holeCards, currentBet);
        if (gtoRes && gtoRes.cell) {
          const c = gtoRes.cell;
          const rnd = Math.random();
          if (rnd < c.primary) {
            action = isUnopened ? (legal.canBet ? 'bet' : 'raise') : (legal.canRaise ? 'raise' : 'call');
            targetAmount = isUnopened ? (pos === 'SB' ? 3.0 : 2.5) : GTO.TableEngine.roundBb(currentBet * 3.0);
            reason = '依 GTO 範圍表採取標準頻率進攻';
          } else if (rnd < c.primary + c.call) {
            action = legal.canCheck ? 'check' : 'call';
            reason = '依 GTO 範圍表跟注防守';
          } else {
            action = legal.canCheck ? 'check' : 'fold';
            reason = '依 GTO 範圍表邊緣牌棄牌';
          }
        } else {
          // 預設標準打法
          action = rawPower >= 0.5 ? (isUnopened ? 'raise' : 'call') : (legal.canCheck ? 'check' : 'fold');
          targetAmount = pos === 'SB' ? 3.0 : 2.5;
        }
      } else if (personaKey === 'station') {
        // 跟注站：翻前超愛溜入 (Limp 1bb) 或平跟加注
        if (isUnopened) {
          if (rawPower >= 0.8) {
            action = 'raise';
            targetAmount = 2.5;
            reason = '拿到超強大牌才主動加注';
          } else if (rawPower >= 0.28 || Math.random() < 0.45) {
            action = 'call'; // 溜入 1bb
            reason = '喜歡用各種起手牌便宜溜入看翻牌';
          } else {
            action = legal.canCheck ? 'check' : 'fold';
          }
        } else {
          // 面對加注
          if (toCall <= 4.0 && (rawPower >= 0.35 || Math.random() < 0.48)) {
            action = 'call';
            timingTell = '⚡ 秒跟';
            delayMs = 280;
            reason = '賠率差不多就跟注進去看翻牌';
          } else if (legal.canCheck) {
            action = 'check';
          } else {
            action = 'fold';
          }
        }
      } else if (personaKey === 'maniac') {
        // 瘋子：超高頻加注，亂跳尺度
        const crazySizes = [2.0, 4.0, 5.5, 7.0, 9.0];
        const pickSize = crazySizes[Math.floor(Math.random() * crazySizes.length)];

        if (Math.random() < 0.65 + tiltFactor * 0.25) {
          action = legal.canBet ? 'bet' : 'raise';
          targetAmount = isUnopened ? pickSize : GTO.TableEngine.roundBb(currentBet * 2.8 + pickSize);
          timingTell = '⚡ 秒推';
          delayMs = 250;
          reason = '瘋狂加注施壓';
        } else if (legal.canCheck) {
          action = 'check';
        } else if (toCall <= 5.0) {
          action = 'call';
        } else {
          action = 'fold';
        }
      } else if (personaKey === 'jammer') {
        // 推擠客：翻前動不動 Open-shove
        if (rawPower >= 0.55 || (tiltFactor > 0.4 && rawPower >= 0.4)) {
          action = 'allin';
          targetAmount = legal.maxRaiseTo;
          timingTell = '⚡ 秒推';
          delayMs = 300;
          reason = '中短碼或上頭直接全下推擠';
        } else if (legal.canCheck) {
          action = 'check';
        } else if (isUnopened && rawPower >= 0.4) {
          action = 'call';
        } else {
          action = 'fold';
        }
      } else if (personaKey === 'nit') {
        // 緊弱：只玩強牌
        if (rawPower >= 0.75) {
          action = legal.canBet ? 'bet' : 'raise';
          targetAmount = isUnopened ? 2.5 : GTO.TableEngine.roundBb(currentBet * 3.2);
          timingTell = '⏳ 長考';
          delayMs = 2800;
          reason = '只在拿到頂尖強牌時才慎重加注';
        } else if (legal.canCheck) {
          action = 'check';
        } else if (rawPower >= 0.65 && toCall <= 2.5) {
          action = 'call';
        } else {
          action = 'fold';
          delayMs = 400;
        }
      } else if (personaKey === 'shark') {
        // 剝削好手：位置敏感、隔離溜入
        if (table.limpersCount >= 1 && table.preflopRaiseCount === 0) {
          // 面對溜入者精準隔離加注
          if (rawPower >= 0.42) {
            action = legal.canRaise ? 'raise' : (legal.canBet ? 'bet' : 'call');
            const oopExtra = (pos === 'SB' || pos === 'BB') ? 1.0 : 0.0;
            targetAmount = GTO.TableEngine.roundBb(3.0 + table.limpersCount * 1.0 + oopExtra);
            reason = '針對 ' + table.limpersCount + ' 位前位溜入者進行標準隔離加注';
          } else {
            action = legal.canCheck ? 'check' : 'fold';
          }
        } else if (isUnopened) {
          action = rawPower >= 0.45 ? (legal.canBet ? 'bet' : 'raise') : (legal.canCheck ? 'check' : 'fold');
          targetAmount = pos === 'SB' ? 3.0 : 2.5;
        } else {
          // 前面有人加注進池
          action = rawPower >= 0.6 ? (legal.canRaise ? 'raise' : 'call') : (rawPower >= 0.42 && toCall <= 3.0 ? 'call' : (legal.canCheck ? 'check' : 'fold'));
          targetAmount = GTO.TableEngine.roundBb(currentBet * 3.0);
        }
      }
    } else {
      // =========================================================================
      // 翻後 (Flop / Turn / River)
      // =========================================================================
      const board = table.board || [];
      let evalScore = 0;
      let handCategory = 0;
      if (holeCards.length === 2 && board.length >= 3) {
        const five = GTO.pk.bestFive(holeCards.concat(board));
        evalScore = five.score;
        handCategory = five.cat; // 0:高牌, 1:一對, 2:兩對, 3:三條, 4:順子, 5:同花...
      }

      const hasMonster = handCategory >= 3;
      const hasTwoPairPlus = handCategory >= 2;
      const hasOnePair = handCategory >= 1;

      if (personaKey === 'station') {
        // 跟注站翻後：極度不肯棄牌
        if (hasOnePair || hasMonster) {
          if (currentBet === 0) {
            // 偶爾 1bb donk bet
            if (Math.random() < 0.28) {
              action = 'bet';
              targetAmount = 1.0;
              reason = '翻後隨意打出 1bb 探路小注';
            } else {
              action = 'check';
            }
          } else {
            action = 'call';
            timingTell = '⚡ 秒跟';
            delayMs = 260;
            reason = '只要有對子就堅持跟注到底';
          }
        } else {
          // 空氣或高牌
          if (legal.canCheck) {
            action = 'check';
          } else if (toCall <= 1.5 || Math.random() < 0.3) {
            action = 'call';
            reason = '抱著僥倖心態看下一張牌';
          } else {
            action = 'fold';
          }
        }
      } else if (personaKey === 'maniac') {
        // 瘋子翻後：超池或過牌加注狂轟
        if (currentBet === 0) {
          action = 'bet';
          const over = Math.random() < 0.45 ? 1.5 : 0.75;
          targetAmount = GTO.TableEngine.roundBb(Math.max(1.0, pot * over));
          timingTell = '⚡ 秒推';
          delayMs = 280;
          reason = '翻後超池重砲下注';
        } else {
          if (Math.random() < 0.55 + tiltFactor * 0.35 && legal.canRaise) {
            action = 'raise';
            targetAmount = GTO.TableEngine.roundBb(currentBet * 2.5 + pot * 0.5);
            reason = '兇狠反加施壓';
          } else if (legal.canCheck) {
            action = 'check';
          } else {
            action = 'call';
          }
        }
      } else if (personaKey === 'jammer') {
        // 推擠客翻後：中頂對或聽牌直接推
        if (hasOnePair || hasMonster || Math.random() < 0.25) {
          action = 'allin';
          targetAmount = legal.maxRaiseTo;
          timingTell = '⚡ 秒推';
          delayMs = 320;
          reason = '中對或上頭無視底池直接推光';
        } else if (legal.canCheck) {
          action = 'check';
        } else {
          action = 'fold';
        }
      } else if (personaKey === 'nit') {
        // 緊弱翻後：沒兩對以上不打大牌
        if (hasTwoPairPlus) {
          action = currentBet === 0 ? 'bet' : (legal.canRaise ? 'raise' : 'call');
          targetAmount = GTO.TableEngine.roundBb(currentBet === 0 ? pot * 0.65 : currentBet * 2.8);
          timingTell = '⏳ 長考';
          delayMs = 3000;
          reason = '拿到兩對以上真正強牌才謹慎開火';
        } else if (hasOnePair && currentBet === 0) {
          action = 'check';
          reason = '弱成牌隨後控池過牌';
        } else if (hasOnePair && toCall <= pot * 0.4) {
          action = 'call';
        } else if (legal.canCheck) {
          action = 'check';
        } else {
          action = 'fold';
          delayMs = 450;
        }
      } else if (personaKey === 'shark') {
        // 剝削好手翻後：依位置與對手打價值
        if (hasTwoPairPlus || hasMonster) {
          action = currentBet === 0 ? 'bet' : (legal.canRaise ? 'raise' : 'call');
          targetAmount = GTO.TableEngine.roundBb(currentBet === 0 ? pot * 0.75 : currentBet * 2.5);
        } else if (hasOnePair) {
          if (currentBet === 0) {
            action = Math.random() < 0.65 ? 'bet' : 'check';
            targetAmount = GTO.TableEngine.roundBb(pot * 0.33);
          } else if (toCall <= pot * 0.55) {
            action = 'call';
          } else {
            action = 'fold';
          }
        } else if (legal.canCheck) {
          action = 'check';
        } else {
          action = 'fold';
        }
      } else {
        // GTO 均衡高手翻後：依下注尺度模型
        if (currentBet === 0) {
          if (hasTwoPairPlus || hasMonster || Math.random() < 0.4) {
            action = 'bet';
            targetAmount = GTO.TableEngine.roundBb(pot * 0.33); // 小注持續下注
            reason = '利用範圍優勢進行標準小注 C-Bet';
          } else {
            action = 'check';
          }
        } else {
          const reqEq = toCall / (pot + toCall);
          if (hasTwoPairPlus || (hasOnePair && reqEq <= 0.35)) {
            action = 'call';
          } else if (legal.canCheck) {
            action = 'check';
          } else {
            action = 'fold';
          }
        }
      }
    }

    // 防呆保護：若動作不合法，自動退回合法安全動作
    if (action === 'check' && !legal.canCheck) {
      action = legal.canCall ? 'call' : 'fold';
    } else if (action === 'call' && !legal.canCall) {
      action = legal.canCheck ? 'check' : 'fold';
    } else if ((action === 'bet' || action === 'raise') && !legal.canBet && !legal.canRaise) {
      action = legal.canCall ? 'call' : (legal.canCheck ? 'check' : 'fold');
    }

    if (action === 'bet' || action === 'raise') {
      targetAmount = Math.max(legal.minRaiseTo, Math.min(legal.maxRaiseTo, targetAmount));
      targetAmount = GTO.TableEngine.roundBb(targetAmount);
    } else {
      targetAmount = 0.0;
    }

    s.timingTell = timingTell;
    return {
      action,
      targetAmount,
      timingTell,
      delayMs,
      reason,
    };
  }

  // ===========================================================================
  // 玩家自訂筆記與標籤儲存（localStorage）
  // ===========================================================================
  const NOTES_KEY = 'gto_poker_player_notes_v1';
  function loadPlayerNotes() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function savePlayerNote(playerName, tagKey, noteText) {
    if (!playerName) return;
    const all = loadPlayerNotes();
    all[playerName] = {
      tag: tagKey || '',
      note: (noteText || '').slice(0, 150),
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    } catch (_) {}
  }

  // ===========================================================================
  // Web Worker 非同步勝率運算（含主執行緒安全 Fallback）
  // ===========================================================================
  let workerClient = null;
  function createWorkerClient() {
    let worker = null;
    let seq = 0;
    const pending = {};

    function init() {
      if (typeof Worker === 'undefined' || typeof Blob === 'undefined') return;
      try {
        const src = `
self.onmessage = function (e) {
  var data = e.data || {};
  var id = data.id;
  var p1 = data.p1 || [];
  var p2 = data.p2 || [];
  var board = data.board || [];

  function cardToInt(c) {
    var rMap = { '2':0, '3':1, '4':2, '5':3, '6':4, '7':5, '8':6, '9':7, 'T':8, 'J':9, 'Q':10, 'K':11, 'A':12 };
    var sMap = { 's':0, 'h':1, 'd':2, 'c':3 };
    return (rMap[c[0]] << 2) | sMap[c[1]];
  }
  var counts = new Int32Array(13);
  var suitMask = new Int32Array(4);
  var suitCnt = new Int32Array(4);

  function straightHigh(mask) {
    for (var hi = 12; hi >= 4; hi--) {
      var m = 0x1f << (hi - 4);
      if ((mask & m) === m) return hi;
    }
    if ((mask & 0x100f) === 0x100f) return 3;
    return -1;
  }
  function topBits(mask, n) {
    var v = 0, k = 0;
    for (var r = 12; r >= 0 && k < n; r--) {
      if (mask & (1 << r)) { v = (v << 4) | r; k++; }
    }
    while (k < n) { v <<= 4; k++; }
    return v;
  }
  function evalCards(cards, n) {
    counts.fill(0); suitMask.fill(0); suitCnt.fill(0);
    var rankMask = 0;
    for (var i = 0; i < n; i++) {
      var c = cards[i], r = c >> 2, s = c & 3;
      counts[r]++; suitMask[s] |= 1 << r; suitCnt[s]++; rankMask |= 1 << r;
    }
    for (var s = 0; s < 4; s++) {
      if (suitCnt[s] >= 5) {
        var sf = straightHigh(suitMask[s]);
        if (sf >= 0) return (8 << 20) | (sf << 16);
        return (5 << 20) | topBits(suitMask[s], 5);
      }
    }
    var quad = -1, trips1 = -1, trips2 = -1, pair1 = -1, pair2 = -1;
    for (var r = 12; r >= 0; r--) {
      var k = counts[r];
      if (k === 4) quad = r;
      else if (k === 3) { if (trips1 < 0) trips1 = r; else if (trips2 < 0) trips2 = r; }
      else if (k === 2) { if (pair1 < 0) pair1 = r; else if (pair2 < 0) pair2 = r; }
    }
    if (quad >= 0) {
      var kick = topBits(rankMask & ~(1 << quad), 1);
      return (7 << 20) | (quad << 16) | (kick << 12);
    }
    if (trips1 >= 0 && (trips2 >= 0 || pair1 >= 0)) {
      var p = Math.max(trips2, pair1);
      return (6 << 20) | (trips1 << 16) | (p << 12);
    }
    var st = straightHigh(rankMask);
    if (st >= 0) return (4 << 20) | (st << 16);
    if (trips1 >= 0) {
      var k = topBits(rankMask & ~(1 << trips1), 2);
      return (3 << 20) | (trips1 << 16) | (k << 8);
    }
    if (pair1 >= 0 && pair2 >= 0) {
      var k = topBits(rankMask & ~(1 << pair1) & ~(1 << pair2), 1);
      return (2 << 20) | (pair1 << 16) | (pair2 << 12) | (k << 8);
    }
    if (pair1 >= 0) {
      var k = topBits(rankMask & ~(1 << pair1), 3);
      return (1 << 20) | (pair1 << 16) | (k << 4);
    }
    return topBits(rankMask, 5);
  }

  if (!p1 || p1.length < 2 || !p2 || p2.length < 2) {
    postMessage({ id: id, equity: 0.5, win: 0.5 });
    return;
  }
  var c1 = [cardToInt(p1[0]), cardToInt(p1[1])];
  var c2 = [cardToInt(p2[0]), cardToInt(p2[1])];
  var b = board.map(cardToInt);
  var used = {};
  used[c1[0]] = true; used[c1[1]] = true;
  used[c2[0]] = true; used[c2[1]] = true;
  for (var i = 0; i < b.length; i++) used[b[i]] = true;

  var deck = [];
  for (var i = 0; i < 52; i++) if (!used[i]) deck.push(i);

  var need = 5 - b.length;
  var win = 0, tie = 0, iters = 1500;
  var pool = new Int32Array(7);

  for (var t = 0; t < iters; t++) {
    for (var i = 0; i < need; i++) {
      var idx = i + Math.floor(Math.random() * (deck.length - i));
      var tmp = deck[i]; deck[i] = deck[idx]; deck[idx] = tmp;
    }
    for (var i = 0; i < b.length; i++) pool[i] = b[i];
    for (var i = 0; i < need; i++) pool[b.length + i] = deck[i];

    pool[5] = c1[0]; pool[6] = c1[1];
    var s1 = evalCards(pool, 7);

    pool[5] = c2[0]; pool[6] = c2[1];
    var s2 = evalCards(pool, 7);

    if (s1 > s2) win++;
    else if (s1 === s2) tie++;
  }
  var eq = (win + tie * 0.5) / iters;
  postMessage({ id: id, equity: Math.round(eq * 1000) / 1000, win: Math.round((win / iters) * 1000) / 1000 });
};`;
        const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        worker = new Worker(url);
        worker.onmessage = function (ev) {
          const res = ev.data || {};
          const cb = pending[res.id];
          if (cb) {
            delete pending[res.id];
            cb(res);
          }
        };
        worker.onerror = function (err) {
          if (err && err.preventDefault) err.preventDefault();
          worker = null;
        };
      } catch (_) {
        worker = null;
      }
    }

    init();

    return {
      simulateEquity: function (p1Cards, p2Cards, boardCards, callback) {
        seq++;
        const id = seq;
        if (worker) {
          pending[id] = callback;
          worker.postMessage({ id, p1: p1Cards, p2: p2Cards, board: boardCards });
        } else {
          // 主執行緒即時 fallback
          setTimeout(function () {
            let res = { equity: 0.5 };
            if (GTO.handVsHand && p1Cards && p2Cards && p1Cards.length === 2 && p2Cards.length === 2) {
              try {
                const sim = GTO.handVsHand(p1Cards, p2Cards, 2000, boardCards);
                res = { equity: sim.equity[0], win: sim.win[0] };
              } catch (_) {}
            }
            callback(res);
          }, 0);
        }
      },
    };
  }

  workerClient = createWorkerClient();

  GTO.AIPersonas = {
    AI_PERSONAS,
    ECOLOGY_PRESETS,
    USER_TAGS,
    cardsToHandKey,
    populateTableRoster,
    decideAiAction,
    loadPlayerNotes,
    savePlayerNote,
    simulateEquityAsync: function (p1, p2, board, cb) {
      workerClient.simulateEquity(p1, p2, board, cb);
    },
  };
})();
