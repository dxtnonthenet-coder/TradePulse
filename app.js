const scenarios = [
  {
    id: "nq-open-trap",
    title: "NQ Opening Range Trap",
    scenarioCode: "Scenario 1247",
    market: "NQ",
    time: "Jun 14, 2024 · 9:45 AM",
    difficulty: "Hard",
    tags: ["VWAP", "Liquidity Sweep", "Opening Range"],
    question: "What is the highest probability move?",
    context:
      "CPI just released. Price is above VWAP, liquidity swept above prior highs, and delta is weakening near the opening range high.",
    answers: ["Breakout continuation", "Rejection back into range", "Sweep highs then reverse", "Consolidation / Chop"],
    correctAnswer: "Sweep highs then reverse",
    explanation:
      "Liquidity was taken above prior highs, buyers failed to hold the breakout, and price rotated back below the key area. That is a classic failed auction training setup.",
    pattern: "Liquidity Sweep",
    seed: 12,
    bias: "reversal"
  },
  {
    id: "es-vwap-reclaim",
    title: "ES VWAP Reclaim",
    scenarioCode: "Scenario 1312",
    market: "ES",
    time: "Jul 02, 2024 · 10:18 AM",
    difficulty: "Medium",
    tags: ["VWAP", "Reclaim", "Trend Day"],
    question: "What should the trader expect after the reclaim?",
    context:
      "ES sold below VWAP, held a higher low, then reclaimed VWAP with expanding bodies. The 15m trend remains constructive.",
    answers: ["Immediate short", "Bullish continuation", "Random chop", "Avoid because VWAP is useless"],
    correctAnswer: "Bullish continuation",
    explanation:
      "A failed move below VWAP followed by acceptance back above it can trap late shorts. In this training example, higher-timeframe pressure supports continuation.",
    pattern: "VWAP Reclaim",
    seed: 31,
    bias: "continuation"
  },
  {
    id: "cl-inventory-whipsaw",
    title: "CL News Whipsaw",
    scenarioCode: "Scenario 1478",
    market: "CL",
    time: "May 28, 2024 · 11:15 AM",
    difficulty: "Hard",
    tags: ["News", "Sweep", "Volatility"],
    question: "What is the best decision?",
    context:
      "Crude oil spiked on inventory data, swept both sides of the prior range, and candle bodies are widening with messy overlap.",
    answers: ["Enter long immediately", "Enter short immediately", "Wait for structure", "Double size because volatility is high"],
    correctAnswer: "Wait for structure",
    explanation:
      "After a two-sided news sweep, the skill is often waiting. The simulator rewards discipline because this is a poor-quality decision zone.",
    pattern: "News Whipsaw",
    seed: 64,
    bias: "chop"
  },
  {
    id: "gc-compression-break",
    title: "GC Compression Break",
    scenarioCode: "Scenario 1529",
    market: "GC",
    time: "Aug 08, 2024 · 8:54 AM",
    difficulty: "Medium",
    tags: ["Compression", "Breakout", "Higher Timeframe"],
    question: "What is most likely after this tight compression?",
    context:
      "Gold has compressed under the overnight high for 40 minutes. Lows are rising, pullbacks are shallow, and the 1h chart is pressing resistance.",
    answers: ["Breakout continuation", "Failed auction short", "Range expansion down", "No volatility all day"],
    correctAnswer: "Breakout continuation",
    explanation:
      "Compression directly under a key high can store energy. In this example, rising lows and higher-timeframe pressure support upside expansion.",
    pattern: "Compression Breakout",
    seed: 82,
    bias: "breakout"
  },
  {
    id: "nq-vwap-rejection",
    title: "NQ VWAP Rejection",
    scenarioCode: "Scenario 1634",
    market: "NQ",
    time: "Sep 10, 2024 · 10:06 AM",
    difficulty: "Medium",
    tags: ["VWAP", "Rejection", "Lower High"],
    question: "What is the better training read at VWAP?",
    context:
      "NQ bounced into VWAP after a sharp opening drop. The bounce is slowing, candles are overlapping, and price is forming a lower high under the morning breakdown area.",
    answers: ["Long through VWAP", "Short rejection from VWAP", "Wait for all-time highs", "Ignore the trend context"],
    correctAnswer: "Short rejection from VWAP",
    explanation:
      "When price trends lower, bounces into VWAP can become rejection zones. This scenario trains users to compare location, trend, and momentum before choosing a direction.",
    pattern: "VWAP Rejection",
    seed: 104,
    bias: "reversal"
  },
  {
    id: "es-opening-drive",
    title: "ES Opening Drive",
    scenarioCode: "Scenario 1681",
    market: "ES",
    time: "Oct 03, 2024 · 9:38 AM",
    difficulty: "Easy",
    tags: ["Opening Drive", "Momentum", "Trend"],
    question: "What does the opening drive suggest?",
    context:
      "ES opened above the prior day high and pushed higher with strong candle bodies. Pullbacks are shallow and buyers keep defending the opening range high.",
    answers: ["Trend continuation", "Immediate short reversal", "No movement expected", "Random candle noise"],
    correctAnswer: "Trend continuation",
    explanation:
      "An opening drive with shallow pullbacks and acceptance above a key reference level often favors continuation in a training environment.",
    pattern: "Opening Drive",
    seed: 129,
    bias: "continuation"
  },
  {
    id: "cl-demand-zone-bounce",
    title: "CL Demand Zone Bounce",
    scenarioCode: "Scenario 1726",
    market: "CL",
    time: "Oct 22, 2024 · 10:52 AM",
    difficulty: "Medium",
    tags: ["Demand Zone", "Reclaim", "Failed Breakdown"],
    question: "What is the most likely replay outcome?",
    context:
      "CL pushed below a marked demand zone, failed to accelerate lower, and reclaimed the zone with a strong green candle. Sellers are trapped below the level.",
    answers: ["Continuation lower", "Bounce from demand", "Sideways forever", "Avoid all replay practice"],
    correctAnswer: "Bounce from demand",
    explanation:
      "A failed breakdown below demand followed by a reclaim can trap sellers. The educational read is a bounce attempt from the reclaimed zone.",
    pattern: "Demand Reclaim",
    seed: 151,
    bias: "continuation"
  },
  {
    id: "btc-range-fakeout",
    title: "BTC Range Fakeout",
    scenarioCode: "Scenario 1794",
    market: "BTC",
    time: "Nov 06, 2024 · 2:15 PM",
    difficulty: "Hard",
    tags: ["Range", "Fakeout", "Liquidity"],
    question: "What happened after the range high break?",
    context:
      "BTC broke above a clean range high, paused briefly, then failed to attract continuation. Price is back near the range boundary with momentum fading.",
    answers: ["Clean breakout", "Fakeout back into range", "Guaranteed moonshot", "No setup exists"],
    correctAnswer: "Fakeout back into range",
    explanation:
      "This is a range fakeout example. The breakout could not hold acceptance above the range, so the training read is rotation back inside.",
    pattern: "Failed Breakout",
    seed: 177,
    bias: "reversal"
  },
  {
    id: "gc-news-expansion",
    title: "GC News Expansion",
    scenarioCode: "Scenario 1838",
    market: "GC",
    time: "Nov 14, 2024 · 8:31 AM",
    difficulty: "Hard",
    tags: ["News", "Expansion", "Momentum"],
    question: "What should the user recognize?",
    context:
      "Gold released from a tight premarket range after news. The first pullback held the breakout area and buyers immediately stepped back in.",
    answers: ["Momentum continuation", "Automatic reversal", "Do nothing because charts never matter", "Wait for a 4-hour candle only"],
    correctAnswer: "Momentum continuation",
    explanation:
      "After news, the first clean hold above the breakout area can signal continuation. This remains educational replay practice, not a live recommendation.",
    pattern: "News Expansion",
    seed: 203,
    bias: "breakout"
  },
  {
    id: "nq-lunch-chop",
    title: "NQ Lunch Chop",
    scenarioCode: "Scenario 1902",
    market: "NQ",
    time: "Dec 04, 2024 · 12:18 PM",
    difficulty: "Easy",
    tags: ["Chop", "Discipline", "No Trade"],
    question: "What is the best decision in this condition?",
    context:
      "NQ is moving sideways during lunch. Candles overlap, VWAP is flat, and price keeps rejecting both sides of a small range.",
    answers: ["Force a long", "Force a short", "Wait for better structure", "Trade every candle"],
    correctAnswer: "Wait for better structure",
    explanation:
      "Not every scenario should reward action. This trains patience and helps users avoid low-quality conditions.",
    pattern: "No Trade Discipline",
    seed: 241,
    bias: "chop"
  },
  {
    id: "es-prior-day-high-retest",
    title: "ES Prior Day High Retest",
    scenarioCode: "Scenario 1960",
    market: "ES",
    time: "Dec 12, 2024 · 11:04 AM",
    difficulty: "Medium",
    tags: ["Prior Day High", "Retest", "Continuation"],
    question: "What is the higher-quality interpretation?",
    context:
      "ES broke above the prior day high, pulled back to retest it, and held with smaller red candles followed by a strong green response.",
    answers: ["Failed breakout lower", "Retest hold and continuation", "Instant reversal because level was touched", "No historical context matters"],
    correctAnswer: "Retest hold and continuation",
    explanation:
      "A breakout above a major reference level followed by a controlled retest can support continuation in replay training.",
    pattern: "Retest Continuation",
    seed: 266,
    bias: "continuation"
  },
  {
    id: "cl-supply-zone-reject",
    title: "CL Supply Zone Reject",
    scenarioCode: "Scenario 2017",
    market: "CL",
    time: "Jan 07, 2025 · 9:58 AM",
    difficulty: "Medium",
    tags: ["Supply Zone", "Rejection", "Lower High"],
    question: "What is the setup showing?",
    context:
      "CL rallied into a marked supply zone after a morning selloff. The rally stalled, candles got smaller, and price failed to reclaim the prior breakdown level.",
    answers: ["Supply rejection", "Strong long continuation", "No sellers present", "Ignore the supply zone"],
    correctAnswer: "Supply rejection",
    explanation:
      "A slowing rally into supply after a selloff can signal rejection. The scenario trains users to read location and weakening momentum together.",
    pattern: "Supply Rejection",
    seed: 302,
    bias: "reversal"
  },
  {
    id: "btc-vwap-reclaim",
    title: "BTC VWAP Reclaim",
    scenarioCode: "Scenario 2088",
    market: "BTC",
    time: "Jan 18, 2025 · 1:42 PM",
    difficulty: "Medium",
    tags: ["VWAP", "Reclaim", "Trap"],
    question: "What does the reclaim suggest?",
    context:
      "BTC flushed below VWAP, failed to continue lower, then reclaimed VWAP with a strong candle. The next pullback held above VWAP.",
    answers: ["Bullish reclaim", "Fresh breakdown", "No volatility possible", "Short because price went green"],
    correctAnswer: "Bullish reclaim",
    explanation:
      "A failed move below VWAP followed by a reclaim and hold can trap sellers. This is a pattern-recognition training example.",
    pattern: "VWAP Reclaim",
    seed: 344,
    bias: "continuation"
  },
  {
    id: "nq-trend-exhaustion",
    title: "NQ Trend Exhaustion",
    scenarioCode: "Scenario 2145",
    market: "NQ",
    time: "Feb 03, 2025 · 10:47 AM",
    difficulty: "Hard",
    tags: ["Exhaustion", "Divergence", "Reversal"],
    question: "What is the risk after this final push?",
    context:
      "NQ made a new intraday high, but the push had smaller candle bodies and quickly fell back below the prior high. Momentum is no longer expanding.",
    answers: ["Exhaustion reversal risk", "Guaranteed continuation", "Market is closed", "No lesson here"],
    correctAnswer: "Exhaustion reversal risk",
    explanation:
      "A new high with weaker follow-through and fast failure can be an exhaustion clue. The simulator teaches users to notice when continuation quality changes.",
    pattern: "Exhaustion Reversal",
    seed: 389,
    bias: "reversal"
  }
];

const leaderboardBase = [
  { name: "MarketNinja", rank: "Master", streak: 18, base: 6240 },
  { name: "FuturesKing", rank: "Pro", streak: 14, base: 5310 },
  { name: "ChartMaster", rank: "Pro", streak: 11, base: 4890 },
  { name: "PriceActionPro", rank: "Sniper", streak: 8, base: 3725 }
];

const scenarioTemplates = [
  ["NQ", "Opening Range Pullback", "Opening Range", "Retest", "continuation"],
  ["ES", "VWAP Trap", "VWAP", "Trap", "reversal"],
  ["CL", "Supply Fade", "Supply Zone", "Rejection", "reversal"],
  ["GC", "Demand Reclaim", "Demand Zone", "Reclaim", "continuation"],
  ["BTC", "Range Rotation", "Range", "Chop", "chop"],
  ["NQ", "Trend Day Hold", "Trend", "Momentum", "continuation"],
  ["ES", "Prior High Fakeout", "Liquidity", "Failed Breakout", "reversal"],
  ["CL", "News Expansion", "News", "Expansion", "breakout"],
  ["GC", "Compression Break", "Compression", "Breakout", "breakout"],
  ["BTC", "VWAP Reclaim", "VWAP", "Reclaim", "continuation"]
];

const SHARED_SCENARIO_COUNT = scenarios.length;
const TOTAL_SCENARIO_COUNT = 250000;

function stringSeed(text) {
  return [...String(text || "replayedge")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function personalizedScenario(index) {
  const p = progress();
  const userOffset = stringSeed(p.signup?.email || p.signup?.name || "guest");
  const personalizedIndex = index - SHARED_SCENARIO_COUNT;
  const template = scenarioTemplates[(personalizedIndex + userOffset) % scenarioTemplates.length];
  const number = 10000 + personalizedIndex;
  const market = template[0];
  const setup = template[1];
  const bias = template[4];
  const answerByBias = {
    reversal: "Failure and rotation back",
    continuation: "Continuation after hold",
    breakout: "Breakout expansion",
    chop: "Wait for better structure"
  };

  return {
    id: `${market.toLowerCase()}-personal-${number}-${userOffset}`,
    title: `${market} ${setup} ${personalizedIndex + 1}`,
    scenarioCode: `Scenario ${number}`,
    market,
    time: `Personalized Set · ${String((personalizedIndex % 12) + 1).padStart(2, "0")}:${personalizedIndex % 2 ? "45" : "15"} ET`,
    difficulty: personalizedIndex % 3 === 0 ? "Hard" : personalizedIndex % 3 === 1 ? "Medium" : "Easy",
    tags: [template[2], template[3], "Pattern Recognition"],
    question: "What is the best training read?",
    context:
      `${market} is showing a ${setup.toLowerCase()} condition. This scenario is part of a personalized training pool, so most users see a different sequence after the shared starter set.`,
    answers: ["Breakout expansion", "Failure and rotation back", "Continuation after hold", "Wait for better structure"],
    correctAnswer: answerByBias[bias],
    explanation:
      `This scenario is built for ${setup.toLowerCase()} practice. Review location, momentum, and whether price accepted or failed around the key level. Educational practice only, not financial advice.`,
    pattern: setup,
    patternTags: [template[2], template[3], "Pattern Recognition"].map((tag) => String(tag).toLowerCase().replace(/\s+/g, "_")),
    clueCandle: 38 + (personalizedIndex % 7),
    clueDescription: `${template[3]} near the key ${template[2].toLowerCase()} area was the decision clue.`,
    seed: 9000 + personalizedIndex * 13 + userOffset,
    bias
  };
}

function humanDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "Date hidden";
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

function titleFromTag(tag = "market_read") {
  return tag.split("_").map((part) => `${part[0]?.toUpperCase() || ""}${part.slice(1)}`).join(" ");
}

function answerFromDirection(direction) {
  return { long: "Long", short: "Short", flat: "Flat" }[direction] || "Flat";
}

function biasFromDirection(direction) {
  return { long: "continuation", short: "reversal", flat: "chop" }[direction] || "chop";
}

function normalizeExternalScenario(raw, fallbackIndex = 0) {
  const primaryTag = raw.patternTags?.[0] || "market_read";
  const difficulty = `${raw.difficulty || "medium"}`.replace(/^./, (char) => char.toUpperCase());
  return {
    ...raw,
    scenarioCode: `Real Replay ${String(fallbackIndex + 1).padStart(2, "0")}`,
    title: raw.title || `${raw.market} ${titleFromTag(primaryTag)}`,
    time: "Date hidden until reveal",
    revealedTime: `${raw.market} · ${humanDate(raw.date)}`,
    difficulty,
    tags: raw.patternTags?.map(titleFromTag) || [titleFromTag(primaryTag)],
    question: "What is the best call at the decision point?",
    context: raw.contextHint || "Read the structure before the future candles are revealed.",
    answers: ["Long", "Short", "Flat"],
    correctAnswer: answerFromDirection(raw.answer?.direction),
    direction: raw.answer?.direction || "flat",
    explanation: raw.explanation || "The reveal showed which side accepted or failed around the key level.",
    coachExplanation: raw.coachExplanation || "Coach read: focus on location, acceptance, and the first pullback after the key level.",
    pattern: titleFromTag(primaryTag),
    patternTags: raw.patternTags || [primaryTag],
    clueCandle: Number(raw.clueCandle || raw.pauseAtCandle || 42),
    clueDescription: raw.clueDescription || raw.clue || "The confirmation candle at the decision point carried the highest-value clue.",
    seed: stringSeed(raw.id || `${raw.market}-${fallbackIndex}`),
    bias: biasFromDirection(raw.answer?.direction),
    isRealReplay: true,
    pauseAtCandle: Number(raw.pauseAtCandle || 42)
  };
}

async function loadScenarioFile(index) {
  if (!externalScenarioState.index.length) return null;
  const slot = ((index % externalScenarioState.index.length) + externalScenarioState.index.length) % externalScenarioState.index.length;
  if (externalScenarioState.cache.has(slot)) return externalScenarioState.cache.get(slot);
  if (externalScenarioState.loading.has(slot)) return externalScenarioState.loading.get(slot);
  const entry = externalScenarioState.index[slot];
  const promise = fetch(`data/scenarios/${entry.file}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Scenario ${entry.file} failed to load`);
      return response.json();
    })
    .then((data) => {
      const scenario = normalizeExternalScenario(data, slot);
      externalScenarioState.cache.set(slot, scenario);
      return scenario;
    })
    .catch((error) => {
      console.warn(error.message);
      return null;
    })
    .finally(() => externalScenarioState.loading.delete(slot));
  externalScenarioState.loading.set(slot, promise);
  return promise;
}

async function loadScenarioLibrary() {
  if (location.protocol === "file:") return;
  try {
    const response = await fetch("data/scenarios/index.json");
    if (!response.ok) throw new Error("Scenario index not available");
    externalScenarioState.index = await response.json();
    externalScenarioState.ready = true;
    renderBusinessFoundation();
    await Promise.all([0, 1, 2].map(loadScenarioFile));
    renderScenario();
    updateGameCards();
  } catch (error) {
    console.warn("Using built-in scenario fallback.", error.message);
    renderBusinessFoundation();
  }
}

function getScenario(index) {
  if (externalScenarioState.ready && externalScenarioState.index.length) {
    const slot = ((index % externalScenarioState.index.length) + externalScenarioState.index.length) % externalScenarioState.index.length;
    if (externalScenarioState.cache.has(slot)) return externalScenarioState.cache.get(slot);
    loadScenarioFile(slot).then((scenario) => {
      if (scenario && slot === state.scenarioIndex % externalScenarioState.index.length) renderScenario();
    });
    return normalizeExternalScenario({
      ...(externalScenarioState.index[slot] || {}),
      date: "",
      answer: { direction: "flat" },
      contextHint: "Loading real replay candles...",
      explanation: "Scenario data is loading.",
      coachExplanation: "Coach data is loading.",
      candles: []
    }, slot);
  }
  if (index < SHARED_SCENARIO_COUNT) return scenarios[index];
  return personalizedScenario(index);
}

function completionKey(scenarioId, mode = state.activeMode) {
  return `${mode}:${scenarioId}`;
}

function completedScenario(scenario, mode = state.activeMode) {
  const p = progress();
  const keyed = p.completed[completionKey(scenario.id, mode)];
  if (mode === "review" && keyed && !keyed.correct) return null;
  if (keyed) return keyed;

  const legacy = p.completed[scenario.id];
  const matchingAttempt = p.attempts.some((attempt) => attempt.scenarioId === scenario.id && (attempt.mode || "replay") === mode);
  return matchingAttempt ? legacy : null;
}

function isScenarioAnswered(index, mode = state.activeMode) {
  const scenario = getScenario(index);
  return Boolean(completedScenario(scenario, mode));
}

function findNextUnanswered(startIndex, step = 1, mode = state.activeMode) {
  const direction = step >= 0 ? 1 : -1;
  let index = ((startIndex % TOTAL_SCENARIO_COUNT) + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;

  for (let checked = 0; checked < TOTAL_SCENARIO_COUNT; checked += 1) {
    if (!isScenarioAnswered(index, mode)) return index;
    index = (index + direction + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;
  }

  return 0;
}

function scenarioMatchesFilter(index, filter = state.scenarioFilter) {
  if (!filter) return true;
  if (externalScenarioState.ready && externalScenarioState.index.length) {
    const slot = ((index % externalScenarioState.index.length) + externalScenarioState.index.length) % externalScenarioState.index.length;
    const entry = externalScenarioState.index[slot] || {};
    const searchable = `${entry.pattern || ""} ${(entry.patternTags || []).join(" ")}`.toLowerCase();
    return searchable.includes(filter);
  }
  const scenario = getScenario(index);
  const searchable = `${scenario.pattern || ""} ${(scenario.tags || []).join(" ")}`.toLowerCase();
  return searchable.includes(filter);
}

function findNextFilteredScenario(startIndex, step = 1, mode = state.activeMode, filter = state.scenarioFilter) {
  if (!filter) return findNextUnanswered(startIndex, step, mode);
  const direction = step >= 0 ? 1 : -1;
  let index = ((startIndex % TOTAL_SCENARIO_COUNT) + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;

  for (let checked = 0; checked < TOTAL_SCENARIO_COUNT; checked += 1) {
    if (scenarioMatchesFilter(index, filter) && !isScenarioAnswered(index, mode)) return index;
    index = (index + direction + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;
  }

  return findNextUnanswered(startIndex, step, mode);
}

function freshScenarioBase() {
  const p = progress();
  const userSeed = stringSeed(p.signup?.email || p.inviteEmail || p.signup?.name || "guest");
  const loginCount = Number(p.loginCount || 0);
  const spread = Math.max(1, TOTAL_SCENARIO_COUNT - SHARED_SCENARIO_COUNT);
  return SHARED_SCENARIO_COUNT + ((userSeed * 97 + loginCount * 7919 + Date.now()) % spread);
}

function startFreshScenarioSession() {
  const p = progress();
  const start = Number(p.sessionAttemptStart || 0);
  const previous = p.attempts.slice(start);
  if (previous.length) {
    p.lastSessionSummary = {
      count: previous.length,
      correct: previous.filter((attempt) => attempt.correct).length,
      xp: previous.reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0),
      endedAt: p.lastLoginAt || Date.now()
    };
  }
  p.loginCount = Number(p.loginCount || 0) + 1;
  p.lastLoginAt = Date.now();
  p.sessionAttemptStart = p.attempts.length;
  p.sessionStartIndex = freshScenarioBase();
  p.nextByMode = {};
  saveProgress();
}

function applyMissedDayFreeze() {
  // Streak integrity is handled by streakBootCheck() in streak.js (activity-based, not login-based).
  if (typeof streakBootCheck === "function") streakBootCheck();
}

function maybeShowReturnRecap() {
  renderNotificationSlot();
}

function returnRecapSummary() {
  const p = progress();
  if (!p.lastLoginAt) return null;
  const hoursAway = (Date.now() - Number(p.lastLoginAt)) / 3600000;
  if (hoursAway < 12) return null;
  const fallback = {
    count: Math.min(5, p.attempts.length),
    correct: p.attempts.slice(-5).filter((attempt) => attempt.correct).length,
    xp: p.attempts.slice(-5).reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0),
    endedAt: Number(p.lastLoginAt) || Date.now()
  };
  const summary = { ...fallback, ...(p.lastSessionSummary || {}) };
  return summary.count ? summary : null;
}

function isReturnRecapDismissed(summary) {
  const dismissedAt = Number(localStorage.getItem("lastSessionDismissedAt") || 0);
  return Boolean(summary?.endedAt && dismissedAt >= Number(summary.endedAt));
}

function shouldSuppressTopNotice(view = state.currentView || "home") {
  return ["profile", "plans", "elite", "coach", "billing"].includes(view);
}

function activeTopNotice() {
  const view = state.currentView || document.body.dataset.view || "home";
  const plan = getUserPlan();
  const playsLeft = freePlaysLeft();
  const isFree = plan === "free";
  const isHome = view === "home";

  if (shouldSuppressTopNotice(view)) return null;
  if (view === "leaderboard") return null;

  if (isHome && !sessionStorage.getItem("streakNoticeDismissed") && typeof streakStatus === "function") {
    const streakInfo = streakStatus();
    if (streakInfo.lost > 0) return { type: "streak-lost", value: streakInfo.lost };
    if (streakInfo.streak > 0 && !streakInfo.secured) return { type: "streak-reminder", streak: streakInfo.streak };
  }

  const recap = returnRecapSummary();
  if (isHome && recap && !isReturnRecapDismissed(recap)) return { type: "last-session", recap };
  return null;
}

function renderNotificationSlot() {
  const notice = activeTopNotice();
  const betaDismissed = sessionStorage.getItem("betaBannerDismissedAt");
  const isHome = (state.currentView || document.body.dataset.view || "home") === "home";

  els.returnRecap?.classList.add("hidden");
  els.freePlanBanner?.classList.add("hidden");
  els.betaBanner?.classList.toggle("hidden", !isHome || Boolean(notice) || Boolean(betaDismissed));

  if (!notice) return;

  if ((notice.type === "streak-reminder" || notice.type === "streak-lost") && els.returnRecap) {
    const copyEl = document.getElementById("return-recap-copy");
    if (copyEl) {
      copyEl.textContent = notice.type === "streak-reminder"
        ? `🔥 Your ${notice.streak}-day streak is at risk — one lesson or arcade run today keeps it alive.`
        : `Your ${notice.value}-day streak ended. Start a new one today — one lesson is all it takes.`;
    }
    els.returnRecap.dataset.noticeType = notice.type;
    els.returnRecap.classList.remove("hidden");
    return;
  }

  if (notice.type === "last-session" && els.returnRecap) {
    const { count, correct, xp } = notice.recap;
    document.getElementById("return-recap-copy").textContent =
      `Last session: ${count} plays · ${correct} correct · +${xp || 0} XP`;
    els.returnRecap.classList.remove("hidden");
    return;
  }

  if (els.freePlanBanner && els.freePlanBannerCopy) {
    const left = Number(notice.playsLeft || 0);
    els.freePlanBanner.classList.remove("free-plan-calm", "free-plan-warning", "used-up");
    els.freePlanBanner.classList.add(left <= 0 ? "used-up" : left === 1 ? "free-plan-warning" : "free-plan-calm");
    els.freePlanBannerCopy.textContent = left > 0
      ? `Free Plan · ${left} play${left === 1 ? "" : "s"} left`
      : "You've used all your free plays";
    els.freePlanBanner.classList.remove("hidden");
    if (left <= 0 && !sessionStorage.getItem("tradePulseFreePlanPaywallShown")) {
      sessionStorage.setItem("tradePulseFreePlanPaywallShown", "1");
      setTimeout(() => openUpgradeModal("paid"), 250);
    }
  }
}

function nextScenarioForMode(mode) {
  const p = progress();
  p.nextByMode ||= {};
  if (!p.sessionStartIndex) p.sessionStartIndex = freshScenarioBase();

  if (mode === "review") return reviewQueueScenarioIndex();
  if (mode === "daily") return dailyScenarioIndex();

  const key = state.scenarioFilter && mode === "replay" ? `${mode}:${state.scenarioFilter}` : mode;
  const savedIndex = Number(p.nextByMode[key]);
  const baseIndex = Number.isFinite(savedIndex) ? savedIndex : Number(p.sessionStartIndex);
  const index = mode === "replay" && state.scenarioFilter
    ? findNextFilteredScenario(baseIndex, 1, mode, state.scenarioFilter)
    : findNextProgressiveScenario(baseIndex, 1, mode);
  p.nextByMode[key] = index;
  saveProgress();
  return index;
}

function saveNextScenarioForMode(mode, fromIndex) {
  const p = progress();
  p.nextByMode ||= {};
  const key = state.scenarioFilter && mode === "replay" ? `${mode}:${state.scenarioFilter}` : mode;
  p.nextByMode[key] = mode === "replay" && state.scenarioFilter
    ? findNextFilteredScenario(fromIndex, 1, mode, state.scenarioFilter)
    : findNextProgressiveScenario(fromIndex, 1, mode);
  saveProgress();
}

function allowedDifficultiesForUser() {
  const xp = Number(progress().xp || 0);
  if (xp < 250) return ["Easy", "Medium"];
  if (xp < 1000) return ["Easy", "Medium"];
  return ["Easy", "Medium", "Hard"];
}

function findNextProgressiveScenario(startIndex, step = 1, mode = state.activeMode) {
  const allowed = allowedDifficultiesForUser();
  const direction = step >= 0 ? 1 : -1;
  let index = ((startIndex % TOTAL_SCENARIO_COUNT) + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;

  for (let checked = 0; checked < TOTAL_SCENARIO_COUNT; checked += 1) {
    const scenario = getScenario(index);
    if (!isScenarioAnswered(index, mode) && allowed.includes(scenario.difficulty || "Medium")) return index;
    index = (index + direction + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;
  }

  return findNextUnanswered(startIndex, step, mode);
}

const achievements = [
  { label: "10 Streak", value: "10", color: "green" },
  { label: "100 Scenarios", value: "100", color: "purple" },
  { label: "80% Accuracy", value: "80%", color: "blue" },
  { label: "5 Perfect Reads", value: "5", color: "gold" }
];

const rankTiers = [
  { name: "Rookie", xp: 0, attempts: 0, accuracy: 0, discipline: 0, reviewClears: 0, streak: 0, gem: "quartz", icon: "R" },
  { name: "Apprentice", xp: 500, attempts: 10, accuracy: 0, discipline: 0, reviewClears: 0, streak: 0, gem: "emerald", icon: "A" },
  { name: "Scalper", xp: 1500, attempts: 25, accuracy: 55, discipline: 55, reviewClears: 0, streak: 2, gem: "emerald", icon: "S" },
  { name: "Technician", xp: 4000, attempts: 60, accuracy: 60, discipline: 60, reviewClears: 3, streak: 3, gem: "sapphire", icon: "T" },
  { name: "Sniper", xp: 9000, attempts: 120, accuracy: 65, discipline: 68, reviewClears: 10, streak: 5, gem: "sapphire", icon: "N" },
  { name: "Strategist", xp: 18000, attempts: 220, accuracy: 68, discipline: 72, reviewClears: 20, streak: 7, gem: "amethyst", icon: "G" },
  { name: "Pro", xp: 35000, attempts: 400, accuracy: 72, discipline: 78, reviewClears: 35, streak: 10, gem: "amethyst", icon: "P" },
  { name: "Elite", xp: 70000, attempts: 750, accuracy: 75, discipline: 82, reviewClears: 60, streak: 14, gem: "ruby", icon: "E" },
  { name: "Funded", xp: 125000, attempts: 1200, accuracy: 78, discipline: 86, reviewClears: 100, streak: 21, gem: "diamond", icon: "F" },
  { name: "Market Master", xp: 225000, attempts: 2000, accuracy: 82, discipline: 90, reviewClears: 175, streak: 30, gem: "diamond", icon: "M" }
];

const state = {
  scenarioIndex: 0,
  timeframe: "1m",
  revealed: false,
  revealCount: 0,
  replayPlaying: false,
  replaySpeed: 1,
  selected: null,
  confidence: "medium",
  tradeDirection: "wait",
  survivalRound: 0,
  survivalCorrect: 0,
  activeMode: "replay",
  currentView: "home",
  scenarioFilter: "",
  pendingAnswer: null,
  timerRunning: false,
  timerStartedAt: 0,
  timerDuration: 20000,
  timerRaf: null,
  timerWarningPlayed: false,
  audioMuted: false,
  learningSlides: [],
  learningSlideIndex: 0,
  learningOpenKey: "",
  learningShownKeys: new Set(),
  chartGeometry: null,
  tradeDragMarker: null,
  subscriptionPlanStatus: "unknown",
  billingPeriod: "monthly",
  communityStats: {},
  communityStatsLoading: {},
  communityLeaderboard: [],
  communityLeaderboardLoaded: false,
  communityLeaderboardLoading: false,
  progress: JSON.parse(localStorage.getItem("tradePulseProgress") || "{}")
};

let audioContext;
let replayTimer;
let tapeScenarioCount;
const FREE_PLAY_LIMIT = 10;
const externalScenarioState = {
  index: [],
  cache: new Map(),
  loading: new Map(),
  ready: false
};

function renderBusinessFoundation() {
  const count = externalScenarioState.ready && externalScenarioState.index.length
    ? externalScenarioState.index.length
    : 120;
  const target = 500;
  const countEl = document.getElementById("curated-scenario-count");
  const fillEl = document.getElementById("curated-scenario-fill");
  if (countEl) countEl.textContent = count.toLocaleString();
  if (fillEl) fillEl.style.width = `${Math.min(100, Math.round((count / target) * 100))}%`;
  renderFirstSessionPath();
  renderWeeklyHabitLoop();
  renderPracticePaths();
}

function renderFirstSessionPath() {
  const container = document.getElementById("first-session-path");
  if (!container) return;
  const p = progress();
  const hasMarket = Boolean(p.signup?.market || p.marketPreference);
  const hasReplay = (p.attempts || []).length > 0;
  const hasReview = (p.attempts || []).some((attempt) => attempt.correct === false) || hasReplay;
  const hasSaved = Boolean(p.signup?.email);
  const steps = [
    { label: "Pick market", done: hasMarket, copy: p.signup?.market || p.marketPreference || "Choose NQ, ES, CL, GC, or BTC" },
    { label: "Play blind replay", done: hasReplay, copy: hasReplay ? `${p.attempts.length} replay${p.attempts.length === 1 ? "" : "s"} completed` : "Make one pressure decision" },
    { label: "Study reveal", done: hasReview, copy: hasReview ? "Learning path started" : "See the clue and missed read" },
    { label: "Save profile", done: hasSaved, copy: hasSaved ? "Progress attached to account" : "Keep XP, rank, and weak spots" }
  ];
  container.innerHTML = steps.map((step, index) => `
    <div class="first-session-step ${step.done ? "done" : ""}">
      <b>${String(index + 1).padStart(2, "0")}</b>
      <span><strong>${step.label}</strong><small>${step.copy}</small></span>
    </div>
  `).join("");
}

function startOfWeekMs(now = Date.now()) {
  const date = new Date(now);
  const day = date.getDay();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date.getTime();
}

function attemptsSince(ms) {
  return (progress().attempts || []).filter((attempt) => Number(attempt.completedAt || 0) >= ms);
}

function weeklyGoalData() {
  const weeklyAttempts = attemptsSince(startOfWeekMs());
  const correct = weeklyAttempts.filter((attempt) => attempt.correct).length;
  const goal = 20;
  const xp = weeklyAttempts.reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0);
  return {
    goal,
    total: weeklyAttempts.length,
    correct,
    xp,
    accuracy: weeklyAttempts.length ? Math.round((correct / weeklyAttempts.length) * 100) : 0,
    percent: Math.min(100, Math.round((weeklyAttempts.length / goal) * 100))
  };
}

function renderWeeklyHabitLoop() {
  const container = document.getElementById("weekly-habit-loop");
  if (!container) return;
  const weekly = weeklyGoalData();
  const weak = weakestPatternFromProgress();
  const nextCopy = weekly.total >= weekly.goal
    ? "Weekly goal complete. Push the leaderboard or clean up Review Queue."
    : weak
      ? `Next best rep: drill ${weak.pattern}.`
      : "Next best rep: complete your first blind replay.";
  container.innerHTML = `
    <div class="weekly-loop-header">
      <strong>This week's training loop</strong>
      <span>${weekly.total}/${weekly.goal} reps</span>
    </div>
    <div class="bar-track"><span style="width:${weekly.percent}%"></span></div>
    <small>${nextCopy}</small>
  `;
}

function renderPracticePaths() {
  const container = document.getElementById("practice-path-grid");
  if (!container) return;
  const p = progress();
  const weak = weakestPatternFromProgress();
  const reviewCount = (p.reviewQueue || []).length;
  const total = (p.attempts || []).length;
  const correct = (p.attempts || []).filter((attempt) => attempt.correct).length;
  const accuracyNow = total ? Math.round((correct / total) * 100) : 0;
  const paths = [
    {
      icon: "eye",
      label: "Beginner Path",
      title: "Blind Replay Foundations",
      copy: "Start with hidden-date market reads, learn the reveal, and build decision confidence before complexity.",
      stat: `${Math.min(total, 12)}/12 starter reps`,
      mode: "replay"
    },
    {
      icon: "rotate-ccw",
      label: "Mistake Path",
      title: reviewCount ? "Clear Your Review Queue" : "Mistake Queue Ready",
      copy: reviewCount
        ? `${reviewCount} missed scenario${reviewCount === 1 ? "" : "s"} waiting. Turn wrong answers into targeted reps.`
        : "Misses automatically become review reps, so every wrong answer creates your next drill.",
      stat: reviewCount ? `${reviewCount} to review` : "No misses saved yet",
      mode: "review"
    },
    {
      icon: "target",
      label: "Weakness Path",
      title: weak ? `${weak.pattern} Focus` : "Find Your Weakest Setup",
      copy: weak
        ? `Your current weak spot is ${weak.pattern}. Run focused games until this pattern improves.`
        : "Complete more games and ReplayEdge will surface your weakest pattern automatically.",
      stat: weak ? `${accuracyNow}% total accuracy` : "Needs more data",
      mode: weak ? "replay" : "daily"
    }
  ];
  container.innerHTML = paths.map((path) => `
    <button class="practice-path-card mode-start" type="button" data-mode="${path.mode}">
      <span class="practice-path-icon"><i data-lucide="${path.icon}"></i></span>
      <small>${path.label}</small>
      <strong>${path.title}</strong>
      <p>${path.copy}</p>
      <em>${path.stat}</em>
    </button>
  `).join("");
  container.querySelectorAll(".mode-start").forEach((button) => {
    button.addEventListener("click", () => startMode(button.dataset.mode || "replay"));
  });
  if (window.lucide) window.lucide.createIcons();
}

const els = {
  scenarioId: document.getElementById("scenario-id"),
  title: document.getElementById("scenario-title"),
  meta: document.getElementById("scenario-meta"),
  context: document.getElementById("context"),
  tags: document.getElementById("setup-tags"),
  question: document.getElementById("question"),
  answers: document.getElementById("answers"),
  resultPanel: document.getElementById("result-panel"),
  resultTitle: document.getElementById("result-title"),
  explanation: document.getElementById("explanation"),
  xpEarned: document.getElementById("xp-earned"),
  grade: document.getElementById("grade"),
  status: document.getElementById("replay-status"),
  timer: document.getElementById("timer"),
  tabs: document.getElementById("timeframe-tabs"),
  chart: document.getElementById("chart"),
  xp: document.getElementById("xp"),
  streak: document.getElementById("streak"),
  rank: document.getElementById("rank"),
  heroLevel: document.getElementById("hero-level"),
  heroXp: document.getElementById("hero-xp"),
  xpFill: document.getElementById("xp-fill"),
  heroAccuracy: document.getElementById("hero-accuracy"),
  heroStreak: document.getElementById("hero-streak"),
  heroScenarios: document.getElementById("hero-scenarios"),
  leaderboard: document.getElementById("leaderboard"),
  achievements: document.getElementById("achievements"),
  rankMeter: document.getElementById("rank-meter"),
  tapeMarket: document.getElementById("tape-market"),
  tapeMove: document.getElementById("tape-move"),
  tapeSession: document.getElementById("tape-session"),
  tapeAccuracy: document.getElementById("tape-accuracy"),
  tapeDelta: document.getElementById("tape-delta"),
  tapeScenarios: document.getElementById("tape-scenarios"),
  difficultyBadge: document.getElementById("difficulty-badge"),
  paywallProgress: document.getElementById("paywall-progress-line"),
  levelUpNudge: document.getElementById("level-up-nudge"),
  distributionSummary: document.getElementById("distribution-summary"),
  toastStack: document.getElementById("toast-stack"),
  exitIntent: document.getElementById("exit-intent"),
  returnRecap: document.getElementById("return-recap")
};

els.submitAnswer = document.getElementById("submit-answer");
els.countdownBar = document.getElementById("countdown-bar");
els.countdownFill = document.getElementById("countdown-fill");
els.comboBadge = document.getElementById("combo-badge");
els.streakDots = document.getElementById("streak-dots");
els.scenarioPills = document.getElementById("scenario-pills");
els.audioToggle = document.getElementById("audio-toggle");
els.topbarBack = document.getElementById("topbar-back");
els.gameHelp = document.getElementById("game-help");
els.resultNext = document.getElementById("result-next");
els.leaderboardFull = document.getElementById("leaderboard-full");
els.leaderboardRankScale = document.getElementById("leaderboard-rank-scale");
els.learningModal = document.getElementById("learning-modal");
els.learningStep = document.getElementById("learning-step");
els.learningVisual = document.getElementById("learning-visual");
els.learningTitle = document.getElementById("learning-title");
els.learningBody = document.getElementById("learning-body");
els.learningExtra = document.getElementById("learning-extra");
els.learningDots = document.getElementById("learning-dots");
els.learningPrev = document.getElementById("learning-prev");
els.learningNext = document.getElementById("learning-next");
els.learningClose = document.getElementById("learning-close");
els.freePlanBanner = document.getElementById("free-plan-banner");
els.freePlanBannerCopy = document.getElementById("free-plan-banner-copy");
els.notificationSlot = document.getElementById("notification-slot");
els.modeSearch = document.getElementById("mode-search");
els.catalogGrid = document.getElementById("catalog-grid");
els.catalogSearch = document.getElementById("catalog-search");
els.catalogCount = document.getElementById("catalog-count");
els.bookmarkScenario = document.getElementById("bookmark-scenario");
els.profilePlanBadge = document.getElementById("profile-plan-badge");
els.weeklyDigestToggle = document.getElementById("weekly-digest-toggle");
els.digestToggleWrap = document.getElementById("digest-toggle-wrap");
els.assistantFab = document.getElementById("assistant-fab");
els.assistantPanel = document.getElementById("assistant-panel");
els.assistantClose = document.getElementById("assistant-close");
els.assistantMessages = document.getElementById("assistant-messages");
els.assistantForm = document.getElementById("assistant-form");
els.assistantInput = document.getElementById("assistant-input");
els.assistantNotification = document.getElementById("assistant-notification");
els.waitlistCount = document.getElementById("waitlist-count");
els.quickMarket = document.getElementById("quick-market");
els.quickExperience = document.getElementById("quick-experience");
els.quickStart = document.getElementById("quick-start");
els.onboardingModal = document.getElementById("onboarding-modal");
els.closeOnboarding = document.getElementById("close-onboarding");
els.topbarStreak = document.getElementById("topbar-streak");
els.topbarXp = document.getElementById("topbar-xp");
els.topbarPlan = document.getElementById("topbar-plan");
els.topbarRankPill = document.getElementById("tp-topbar-rank-pill");
els.topbarRankName = document.getElementById("tp-topbar-rank-name");
els.topbarRankFill = document.getElementById("tp-topbar-rank-fill");
els.themeToggle = document.getElementById("theme-toggle");
els.googleSignin = document.getElementById("google-signin");
els.heroGoogleSignin = document.getElementById("hero-google-signin");
els.copyShareCard = document.getElementById("copy-share-card");
els.copyReferral = document.getElementById("copy-referral");
els.copyChallenge = document.getElementById("copy-challenge");
els.referralCode = document.getElementById("referral-code");
els.shareCardRank = document.getElementById("share-card-rank");
els.shareCardAccuracy = document.getElementById("share-card-accuracy");
els.shareCardStreak = document.getElementById("share-card-streak");
els.saveReviewQueue = document.getElementById("save-review-queue");
els.betaBanner = document.getElementById("beta-banner");
els.feedbackModal = document.getElementById("feedback-modal");
els.sidebarToggle = document.getElementById("side-toggle");
els.sidebarBackdrop = document.getElementById("sidebar-backdrop");
els.topbarLogin = document.getElementById("topbar-login");
els.topbarAvatar = document.getElementById("topbar-avatar");

const gate = {
  signupModal: document.getElementById("signup-modal"),
  signupForm: document.getElementById("signup-form"),
  paywallModal: document.getElementById("paywall-modal"),
  closePaywall: document.getElementById("close-paywall"),
  tradeForm: document.getElementById("trade-form"),
  activeModeLabel: document.getElementById("active-mode-label"),
  activeModeTitle: document.getElementById("active-mode-title"),
  activeModeCopy: document.getElementById("active-mode-copy"),
  confidencePicker: document.getElementById("confidence-picker"),
  thesisBuilder: document.getElementById("thesis-builder"),
  survivalStatus: document.getElementById("survival-status"),
  modeInstruction: document.getElementById("mode-instruction"),
  chartHotspots: document.getElementById("chart-hotspots"),
  resultBreakdown: document.getElementById("result-breakdown"),
  resultClueMarker: document.getElementById("result-clue-marker")
};

function viewExists(viewName) {
  return Boolean(
    document.querySelector(`[data-view="${viewName}"]`) ||
    [...document.querySelectorAll(".dashboard-section")].some((section) =>
      (section.dataset.dashboardPages || "").split(",").includes(viewName)
    )
  );
}

function navigateTo(viewName = "home", options = {}) {
  const view = viewExists(viewName) ? viewName : "home";
  const previousView = state.currentView;
  state.currentView = view;
  document.body.dataset.view = view;
  document.body.dataset.page = view;
  document.body.classList.toggle("playing", view === "game");

  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("active-view", section.dataset.view === view);
    section.classList.toggle("active-page", section.dataset.view === view);
  });
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    const allowedViews = (section.dataset.dashboardPages || "").split(",");
    const active = allowedViews.includes(view);
    section.classList.toggle("active-view", active);
    section.classList.toggle("active-page", active);
  });
  document.querySelectorAll(".nav-tab").forEach((button) => {
    const target = button.dataset.viewTarget || button.dataset.pageTarget || "home";
    const isActive = target === view || (view === "game" && target === "home");
    button.classList.toggle("active", isActive);
  });

  els.topbarBack?.classList.toggle("hidden", view !== "game");
  els.gameHelp?.classList.toggle("hidden", view !== "game");
  if (view !== "game" && previousView === "game") stopDecisionTimer();
  if (view === "game" && !state.revealed) startDecisionTimer();
  if (view === "profile") renderProfile();
  if (view === "elite") renderEliteDashboard();
  if (view === "leaderboard") renderLeaderboard();
  if (view === "catalog") renderGameCatalog();
  if (view === "academy" && typeof renderAcademy === "function") renderAcademy();
  if (view === "arcade" && typeof renderArcade === "function") renderArcade();
  if (view === "toolkit" && typeof renderToolkit === "function") renderToolkit();
  if (view === "compete" && typeof renderCompete === "function") renderCompete();
  if (view === "dashboard" && typeof renderTradersDashboard === "function") renderTradersDashboard();
  if (view === "propfirm" && typeof renderPropfirm === "function") renderPropfirm();
  if (view === "achievements" && typeof renderAchievements === "function") renderAchievements();
  if (view === "home") {
    if (typeof renderHomeAcademyPath === "function") renderHomeAcademyPath();
    if (typeof renderHomeArcadeRail === "function") renderHomeArcadeRail();
    if (typeof renderDailyQuests === "function") renderDailyQuests();
  }
  renderNotificationSlot();

  if (!options.fromHash && window.location.hash !== `#${view}`) {
    history.pushState({ view }, "", `#${view}`);
  }
  if (options.scroll !== false) {
    const topTarget = view === "home" ? document.querySelector(".hero") : null;
    (topTarget || document.documentElement).scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

function showPage(page) {
  navigateTo(page);
}

function defaultProgress() {
  return {
    xp: 0,
    streak: 0,
    topStreak: 0,
    attempts: [],
    completed: {},
    nextByMode: {},
    loginCount: 0,
    lastLoginAt: null,
    sessionStartIndex: null,
    loginDays: 1,
    freePlaysUsed: 0,
    signup: null,
    plan: null,
    streakFreezes: 0,
    freezeAwardedAtFive: false,
    bookmarks: [],
    reviewQueue: [],
    reviewQueueMeta: {},
    reviewClears: 0,
    disciplineScore: 80,
    referralCredits: 0,
    referralCode: null,
    referralStats: null,
    digestEnabled: false,
    traderArchetype: null,
    anonymousAccess: false,
    sessionAttemptStart: 0,
    lastSessionRecapAt: 0,
    lastSessionSummary: null,
    weeklyAccuracySnapshots: [],
    badges: []
  };
}

function progress() {
  if (!state.progress || typeof state.progress !== "object") {
    state.progress = defaultProgress();
  }
  const defaults = defaultProgress();
  Object.entries(defaults).forEach(([key, value]) => {
    if (state.progress[key] === undefined) {
      state.progress[key] = Array.isArray(value) ? [] : value && typeof value === "object" ? { ...value } : value;
    }
  });
  const trialActive = Boolean(state.progress.trialEndsAt && Date.now() < Number(state.progress.trialEndsAt));
  if (state.progress.trialPlan === "Player" && trialActive && state.progress.plan === "Elite") {
    state.progress.plan = null;
  }
  return state.progress;
}

function saveProgress() {
  localStorage.setItem("tradePulseProgress", JSON.stringify(progress()));
  updateLogoutButtons();
  if (typeof progressSyncSchedulePush === "function") progressSyncSchedulePush();
}

async function saveLead(type, payload) {
  const p = progress();
  const details = payload.details && typeof payload.details === "object" ? payload.details : {};
  const entry = {
    type,
    source: "ReplayEdge prototype",
    ...payload,
    referredBy: p.referredBy || "",
    referralCode: p.referralCode || "",
    details: {
      ...details,
      referredBy: p.referredBy || "",
      referralCode: p.referralCode || ""
    }
  };

  p.leads ||= [];
  p.leads.push({ ...entry, createdAt: new Date().toISOString() });
  saveProgress();

  if (location.protocol === "file:") return;

  try {
    await fetch("/api/signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.warn("Lead saved locally only.", error);
  }
}

function trackEvent(event, details = {}) {
  if (location.protocol === "file:") return;
  const payload = {
    event,
    page: state.currentView || document.body.dataset.view || "home",
    plan: getUserPlan(),
    mode: state.activeMode,
    details
  };
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {});
}

async function startCheckout(plan, trial = false, triggerButton = null) {
  const p = progress();
  if (location.protocol === "file:") {
    showToast("Open http://localhost:4173 to use Stripe checkout. This file view can only run the demo.", "warning");
    return false;
  }

  try {
    trackEvent("checkout_started", { plan, trial, billingPeriod: state.billingPeriod });
    checkoutButtonLoading(triggerButton, true);
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        trial,
        billingPeriod: state.billingPeriod,
        name: p.signup?.name || "",
        email: p.signup?.email || p.inviteEmail || ""
      })
    });
    const result = await response.json();
    if (result.url) {
      window.location.href = result.url;
      return true;
    }
    if (result.configured === false) {
      showToast(result.message, "warning");
      return false;
    }
    throw new Error(result.error || "Checkout did not return a URL.");
  } catch (error) {
    const friendly = /payment method types|capab/i.test(error.message || "")
      ? "Payments are being activated for our account — checkout opens again shortly. Try once more in a few minutes."
      : `Checkout setup needs attention: ${error.message}`;
    showToast(friendly, "error");
    return false;
  } finally {
    checkoutButtonLoading(triggerButton, false);
  }
}

async function refreshSubscriptionStatus() {
  const p = progress();
  const email = p.signup?.email || p.inviteEmail;
  if (!email || location.protocol === "file:") return null;

  try {
    const response = await fetch(`/api/subscription-status?email=${encodeURIComponent(email)}`);
    const result = await response.json();
    p.subscriptionStatus = result;
    if (result.active && result.plan) {
      p.plan = result.plan;
      p.pendingPlan = null;
      if (result.status !== "trialing") {
        p.trialEndsAt = null;
      }
    } else if (p.plan && result.status && result.status !== "none") {
      p.plan = null;
    }
    saveProgress();
    updateProgressUi();
    if (document.body.dataset.page === "profile") renderProfile();
    return result;
  } catch (error) {
    console.warn("Subscription status refresh failed.", error);
    return null;
  }
}

async function startGoogleSignin() {
  if (location.protocol === "file:") {
    showToast("Open the live site or localhost server to use Google sign-in.", "warning");
    return;
  }
  try {
    const response = await fetch("/api/auth-config");
    const result = await response.json();
    if (!result.googleConfigured || !result.googleUrl) {
      showToast(result.message || "Google sign-in is not configured yet.", "warning");
      return;
    }
    window.location.href = result.googleUrl;
  } catch (error) {
    showToast(`Google sign-in needs attention: ${error.message}`, "error");
  }
}

async function handleGoogleAuthReturn() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const error = params.get("error_description") || params.get("error");
  if (error) {
    showToast(`Google sign-in failed: ${error}`, "error");
    history.replaceState({}, "", window.location.pathname);
    return;
  }
  if (!accessToken) return;
  try {
    const response = await fetch("/api/auth-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken })
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Could not finish Google sign-in.");
    const user = result.user;
    const p = progress();
    p.signup = {
      name: user.name || "Google Trader",
      email: user.email || "",
      experience: p.signup?.experience || "Beginner",
      market: p.signup?.market || "NQ",
      provider: "google",
      avatar: user.avatar || null
    };
    startFreshScenarioSession();
    saveProgress();
    await saveLead("google_signin", {
      name: p.signup.name,
      email: p.signup.email,
      plan: planDisplayName(),
      details: { provider: "google", mode: state.activeMode }
    });
    await refreshSubscriptionStatus();
    showToast("Google sign-in complete. Your training profile is ready.", "success");
    history.replaceState({}, "", window.location.pathname);
    updateProgressUi();
  } catch (error) {
    showToast(`Google sign-in needs attention: ${error.message}`, "error");
  }
}

async function openBillingPortal() {
  const p = progress();
  const email = p.signup?.email || p.inviteEmail;
  if (!email) {
    openSignup();
    return;
  }

  try {
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (result.url) {
      window.location.href = result.url;
      return;
    }
    showToast(result.message || result.error || "Billing portal is not ready for this account yet.", "warning");
  } catch (error) {
    showToast(`Billing portal needs attention: ${error.message}`, "error");
  }
}

function showToast(message, type = "success") {
  if (!els.toastStack) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  els.toastStack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, 3600);
}

function tone(frequency, start, duration, type, volume) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + start);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration + 0.02);
}

function playAnswerSound(correct) {
  if (state.audioMuted) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext ||= new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();

  if (correct) {
    tone(660, 0, 0.11, "sine", 0.12);
    tone(920, 0.1, 0.16, "sine", 0.11);
  } else {
    tone(130, 0, 0.16, "sawtooth", 0.1);
    tone(92, 0.12, 0.22, "square", 0.075);
  }
}

function playTimerWarningSound() {
  if (state.audioMuted) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext ||= new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();
  [0, 0.09, 0.18].forEach((offset) => tone(760, offset, 0.055, "square", 0.08));
}

function updateAudioToggle() {
  if (!els.audioToggle) return;
  els.audioToggle.setAttribute("aria-pressed", String(!state.audioMuted));
  els.audioToggle.classList.toggle("active", !state.audioMuted);
  els.audioToggle.innerHTML = `<i data-lucide="${state.audioMuted ? "volume-x" : "volume-2"}"></i>`;
  els.audioToggle.setAttribute("aria-label", state.audioMuted ? "Unmute sounds" : "Mute sounds");
  if (window.lucide) window.lucide.createIcons();
}

function applyTheme() {
  document.body.classList.remove("light-mode");
}

function canUseDecisionTimer() {
  return state.currentView === "game" && ["tape", "replay", "daily", "ranked", "notrade", "detective"].includes(state.activeMode);
}

function stopDecisionTimer() {
  if (state.timerRaf) cancelAnimationFrame(state.timerRaf);
  state.timerRaf = null;
  state.timerRunning = false;
  els.countdownBar?.classList.remove("amber", "red", "pulse");
}

function startDecisionTimer() {
  stopDecisionTimer();
  if (!canUseDecisionTimer() || state.revealed) {
    if (els.countdownFill) els.countdownFill.style.width = "0%";
    return;
  }

  state.timerDuration = state.activeMode === "tape" ? 8000 : 20000;
  state.timerRunning = true;
  state.timerStartedAt = performance.now();
  state.timerWarningPlayed = false;
  els.countdownBar?.classList.remove("amber", "red", "pulse");
  if (els.countdownFill) els.countdownFill.style.width = "100%";

  const tick = (now) => {
    if (!state.timerRunning || state.revealed) return;
    const elapsed = now - state.timerStartedAt;
    const remaining = Math.max(0, state.timerDuration - elapsed);
    const seconds = Math.ceil(remaining / 1000);
    const percent = (remaining / state.timerDuration) * 100;

    if (els.countdownFill) els.countdownFill.style.width = `${percent}%`;
    if (els.timer) els.timer.textContent = `${seconds}s`;
    els.countdownBar?.classList.toggle("amber", remaining <= 8000 && remaining > 4000);
    els.countdownBar?.classList.toggle("red", remaining <= 4000);
    els.countdownBar?.classList.toggle("pulse", remaining <= 4000);
    if (remaining <= 4000 && !state.timerWarningPlayed) {
      state.timerWarningPlayed = true;
      playTimerWarningSound();
    }
    if (remaining <= 0) {
      handleDecisionTimeout();
      return;
    }
    state.timerRaf = requestAnimationFrame(tick);
  };

  state.timerRaf = requestAnimationFrame(tick);
}

function handleDecisionTimeout() {
  if (state.revealed) return;
  stopDecisionTimer();
  state.lastAnswerRect = null;
  const scenario = getScenario(state.scenarioIndex);
  finishAttempt({
    answer: "Timed out",
    correct: false,
    earned: 0,
    correctAnswer: currentCorrectAnswer(scenario),
    metadata: { timeout: true }
  });
}

function hasProfileSession() {
  const p = progress();
  return Boolean(p.signup?.email || p.inviteEmail || p.subscriptionStatus?.active || p.attempts.length || p.freePlaysUsed);
}

function updateLogoutButtons() {
  const shouldShow = hasProfileSession();
  document.getElementById("menu-logout")?.classList.toggle("hidden", !shouldShow);
  document.getElementById("logout-profile")?.classList.toggle("hidden", !shouldShow);
}

function syncSidebarToggle() {
  const open = document.body.classList.contains("sidebar-expanded");
  els.sidebarToggle?.setAttribute("aria-expanded", String(open));
  els.sidebarToggle?.setAttribute("aria-label", open ? "Collapse navigation" : "Expand navigation");
  els.sidebarBackdrop?.classList.toggle("active", open);
}

function setSidebarOpen(open, persist = true) {
  document.body.classList.toggle("sidebar-expanded", Boolean(open));
  if (persist) localStorage.setItem("sidebarOpen", String(Boolean(open)));
  syncSidebarToggle();
}

function toggleSidebar() {
  setSidebarOpen(!document.body.classList.contains("sidebar-expanded"));
}

function logoutUser() {
  const ok = confirm("Logout clears this browser's current ReplayEdge profile and training session. Your Stripe subscription is not cancelled. Continue?");
  if (!ok) return;
  localStorage.removeItem("tradePulseProgress");
  sessionStorage.removeItem("tradePulseVisitStarted");
  state.progress = defaultProgress();
  state.scenarioIndex = 0;
  state.selected = null;
  state.revealed = false;
  closeModals();
  showPage("home");
  renderScenario();
  updateProgressUi();
  applyModeUi();
  updateLogoutButtons();
}

function rankStats(p = progress()) {
  const attempts = p.attempts || [];
  return {
    xp: Number(p.xp || 0),
    attempts: attempts.length,
    accuracy: accuracy(),
    discipline: Number(p.disciplineScore || 0),
    reviewClears: Number(p.reviewClears || 0),
    streak: Math.max(Number(p.topStreak || 0), Number(p.streak || 0))
  };
}

function rankRequirementMissing(tier, p = progress()) {
  const stats = rankStats(p);
  const missing = [];
  if (stats.xp < tier.xp) missing.push(`${(tier.xp - stats.xp).toLocaleString()} XP`);
  if (stats.attempts < tier.attempts) missing.push(`${tier.attempts - stats.attempts} scenarios`);
  if (stats.accuracy < tier.accuracy) missing.push(`${tier.accuracy}% accuracy`);
  if (stats.discipline < tier.discipline) missing.push(`${tier.discipline} discipline`);
  if (stats.reviewClears < tier.reviewClears) missing.push(`${tier.reviewClears - stats.reviewClears} review clears`);
  if (stats.streak < tier.streak) missing.push(`${tier.streak}-day streak`);
  return missing;
}

function rankUnlocked(tier, p = progress()) {
  return rankRequirementMissing(tier, p).length === 0;
}

function currentRankTier(p = progress()) {
  return [...rankTiers].reverse().find((tier) => rankUnlocked(tier, p)) || rankTiers[0];
}

function nextRankTier(p = progress()) {
  return rankTiers.find((tier) => !rankUnlocked(tier, p)) || rankTiers[rankTiers.length - 1];
}

function rankRequirementText(tier) {
  if (tier.xp === 0) return "Starting rank";
  return `${tier.xp.toLocaleString()} XP · ${tier.attempts} scenarios · ${tier.accuracy}% accuracy · ${tier.discipline} discipline`;
}

function levelThreshold(level) {
  if (level <= 1) return 0;
  return Math.round(300 * Math.pow(level - 1, 1.72));
}

function levelFromXp(xp) {
  let level = 1;
  while (level < 100 && xp >= levelThreshold(level + 1)) level += 1;
  return level;
}

function levelProgress(xp) {
  const level = levelFromXp(xp);
  const current = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return {
    level,
    currentXp: Math.max(0, xp - current),
    neededXp: Math.max(1, next - current),
    nextLevelXp: next
  };
}

function rankFromXp() {
  return currentRankTier().name;
}

function normalizePlan(plan) {
  return String(plan || "free").toLowerCase();
}

function planDisplayName(plan = getUserPlan()) {
  return {
    free: "Free",
    player: "Player",
    coach: "Coach",
    elite: "Elite"
  }[normalizePlan(plan)] || "Free";
}

function getUserPlan() {
  const p = progress();
  if (p.adminMode) return "elite"; // dev/admin unlock — every gated feature visible
  const remote = p.subscriptionStatus;
  if (remote?.active && remote.plan) return normalizePlan(remote.plan);
  if (p.plan) return normalizePlan(p.plan);
  if (isTrialActive()) return "player";
  return "free";
}

function hasAccess(feature) {
  const level = { free: 0, player: 1, coach: 2, elite: 3 }[getUserPlan()] || 0;
  const required = {
    paid: 1,
    unlimited: 1,
    tradersDashboard: 1,
    propfirm: 1,
    coachReview: 2,
    reviewQueue: 2,
    weeklyDigest: 2,
    bookmarks: 2,
    thesis: 2,
    riskCalculator: 2,
    mistakeJournal: 2,
    analytics: 2,
    weaknessRadar: 2,
    aiReview: 3,
    studyPlan: 3,
    eliteDashboard: 3,
    streakFreeze: 3,
    priorityScenarios: 3,
    survival: 3,
    elitePlaylist: 3,
    eliteFilters: 3
  }[feature] ?? 0;
  return level >= required;
}

function requiredPlanForFeature(feature) {
  return {
    paid: "Player",
    unlimited: "Player",
    tradersDashboard: "Player",
    propfirm: "Player",
    coachReview: "Coach",
    reviewQueue: "Coach",
    weeklyDigest: "Coach",
    bookmarks: "Coach",
    thesis: "Coach",
    riskCalculator: "Coach",
    mistakeJournal: "Coach",
    analytics: "Coach",
    weaknessRadar: "Coach",
    aiReview: "Elite",
    studyPlan: "Elite",
    eliteDashboard: "Elite",
    streakFreeze: "Elite",
    priorityScenarios: "Elite",
    survival: "Elite",
    elitePlaylist: "Elite",
    eliteFilters: "Elite"
  }[feature] || "Player";
}

function openUpgradeModal(feature) {
  const required = requiredPlanForFeature(feature);
  const bullets = {
    Player: ["Prop Firm Training Grounds: earn funded accounts and payouts (simulated dollars)", "Traders Dashboard: live market data, news, and AI session context", "XP, streaks, levels, and leaderboards"],
    Coach: ["Trader Toolkit: risk calculator, mistake journal, performance analytics", "+25% XP on every Arcade run", "Weekly digest and coach-level review"],
    Elite: ["Everything in Coach plus the personal Study Plan generator", "+50% XP on every Arcade run", "Elite dashboard, streak freeze bank, gold leaderboard identity"]
  }[required];
  renderPaywallProgress();
  const title = gate.paywallModal.querySelector("h2");
  const subtitle = gate.paywallModal.querySelector(".muted");
  const signal = gate.paywallModal.querySelector(".signal");
  if (signal) signal.textContent = `${required} Plan Required`;
  if (title) title.textContent = `Upgrade to ${required}`;
  if (subtitle) subtitle.innerHTML = `<span class="upgrade-list">${bullets.map((item) => `<b>• ${item}</b>`).join("")}</span>`;
  gate.paywallModal.classList.remove("hidden");
}

function hasCoachPlan() {
  return hasAccess("coachReview");
}

function communityStatsForScenario(scenario) {
  return state.communityStats?.[scenario?.id] || null;
}

function communityCorrectRate(scenario) {
  const stats = communityStatsForScenario(scenario);
  if (!stats || Number(stats.totalAttempts || 0) < 3 || !Number.isFinite(Number(stats.correctRate))) return null;
  return Math.round(Number(stats.correctRate));
}

function difficultyWinRate(scenario) {
  const communityRate = communityCorrectRate(scenario);
  if (communityRate !== null) return communityRate;
  if (scenario.difficulty === "Hard") return 29 + (scenario.seed % 9);
  if (scenario.difficulty === "Medium") return 46 + (scenario.seed % 12);
  return 66 + (scenario.seed % 14);
}

function currentUserIdentity() {
  const p = progress();
  let guestId = localStorage.getItem("tradePulseGuestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("tradePulseGuestId", guestId);
  }
  return {
    userId: p.signup?.email || p.inviteEmail || p.googleUser?.id || guestId,
    userName: p.signup?.name || p.googleUser?.name || p.signup?.email?.split("@")[0] || "Guest",
    email: p.signup?.email || p.inviteEmail || p.googleUser?.email || ""
  };
}

async function fetchScenarioCommunityStats(scenarioId) {
  if (!scenarioId || state.communityStats[scenarioId] || state.communityStatsLoading[scenarioId]) return;
  state.communityStatsLoading[scenarioId] = true;
  try {
    const response = await fetch(`/api/scenario-stats?scenarioId=${encodeURIComponent(scenarioId)}`);
    const data = await response.json();
    if (data.ok) {
      state.communityStats[scenarioId] = data;
      if (getScenario(state.scenarioIndex)?.id === scenarioId) {
        updateDifficultyMessage(getScenario(state.scenarioIndex));
        if (state.revealed) renderAnswers();
      }
    }
  } catch {
    // Local file previews keep using seeded demo stats until the server is running.
  } finally {
    state.communityStatsLoading[scenarioId] = false;
  }
}

async function syncAttempt(attempt, scenario, correctAnswer) {
  const identity = currentUserIdentity();
  try {
    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: identity.userId,
        userName: identity.userName,
        email: identity.email,
        scenarioId: scenario.id,
        mode: attempt.mode,
        market: scenario.market,
        pattern: scenario.pattern,
        answer: attempt.answer,
        correct: attempt.correct,
        correctAnswer,
        confidence: attempt.confidence,
        xpEarned: attempt.earned,
        difficulty: scenario.difficulty,
        session: attempt.session,
        metadata: {
          patternTags: attempt.patternTags,
          completedAt: attempt.completedAt,
          timeToAnswer: attempt.timeToAnswer || 0
        }
      })
    });
    const data = await response.json();
    if (data.ok && data.stats) {
      state.communityStats[scenario.id] = data.stats;
      state.communityLeaderboardLoaded = false;
    }
  } catch {
    // Attempt is already saved locally in progress; online community sync can retry on future plays.
  }
}

function checkoutButtonLoading(button, isLoading, label = "Redirecting to Stripe...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.defaultText ||= button.textContent;
    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = label;
    return;
  }
  button.disabled = false;
  button.classList.remove("is-loading");
  if (button.dataset.defaultText) button.textContent = button.dataset.defaultText;
}

function nextRankFromXp(xp) {
  return nextRankTier();
}

function currentRankTierFromXp(xp) {
  return currentRankTier();
}

function accuracy() {
  const attempts = progress().attempts;
  if (!attempts.length) return 0;
  return Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100);
}

function updateProgressUi() {
  const p = progress();
  const plan = getUserPlan();
  const levelInfo = levelProgress(p.xp);

  els.xp.textContent = p.xp;
  els.streak.textContent = p.streak;
  els.rank.textContent = rankFromXp(p.xp);
  els.heroLevel.textContent = levelInfo.level;
  els.heroXp.textContent = `${levelInfo.currentXp.toLocaleString()} / ${levelInfo.neededXp.toLocaleString()} XP`;
  els.xpFill.style.width = `${Math.min(100, (levelInfo.currentXp / levelInfo.neededXp) * 100)}%`;
  els.heroAccuracy.textContent = `${accuracy()}%`;
  els.heroStreak.textContent = `${Math.max(p.topStreak, p.streak)} Days`;
  els.heroScenarios.textContent = p.attempts.length;
  const currentLevel = levelFromXp(p.xp || 0);
  if (p.lastCelebratedLevel === undefined || p.lastCelebratedLevel === null) {
    p.lastCelebratedLevel = currentLevel;
  } else if (currentLevel > p.lastCelebratedLevel) {
    p.lastCelebratedLevel = currentLevel;
    saveProgress();
    setTimeout(() => {
      showToast(`⬆️ LEVEL UP — Level ${currentLevel}! Keep stacking.`, "success");
      if (typeof confettiBurst === "function") confettiBurst();
      if (typeof arcadeSound === "function") arcadeSound("bigwin");
    }, 200);
  }
  if (els.topbarStreak) {
    const secured = typeof streakSecuredToday === "function" && streakSecuredToday();
    const streakCount = Number(p.streak || 0);
    const mult = typeof streakXpMultiplier === "function" ? streakXpMultiplier() : 1;
    const boostBit = mult > 1 ? ` · +${Math.round((mult - 1) * 100)}% XP` : "";
    els.topbarStreak.textContent = `${streakCount} day streak${boostBit}${streakCount > 0 && !secured ? " · at risk" : ""}`;
    els.topbarStreak.title = mult > 1
      ? `Streak bonus active: all lesson & game XP pays ×${mult}`
      : (typeof streakNextBoostHint === "function" && streakNextBoostHint()) || "Complete a lesson or game daily to build an XP bonus";
    const chipWrap = els.topbarStreak.closest(".topbar-status");
    if (chipWrap) {
      chipWrap.classList.toggle("streak-secured", secured);
      chipWrap.classList.toggle("streak-risk", streakCount > 0 && !secured);
      chipWrap.classList.toggle("streak-zero", streakCount === 0);
    }
  }
  if (els.topbarXp) els.topbarXp.textContent = getUserPlan() === "free" ? "XP locked" : `${p.xp.toLocaleString()} XP`;
  if (els.topbarPlan) els.topbarPlan.textContent = getUserPlan() === "free" ? "Free Plan" : `${planDisplayName()} Plan`;
  renderTopbarRankPill();
  renderLeaderboard();
  renderAchievements();
  renderRankMeter();
  updateMarketTape();
  renderSidebarProgress();
  renderPaywallProgress();
  updateFreePlanBanner();
  updatePlanSurfaces();
  updateGrowthSurfaces();
  updateGameCards();
  renderBusinessFoundation();
}

function renderTopbarRankPill() {
  if (!els.topbarRankPill || !els.topbarRankName || !els.topbarRankFill) return;
  const p = progress();
  const currentTier = currentRankTierFromXp(p.xp);
  const nextTier = nextRankFromXp(p.xp);
  const previousXp = currentTier.xp;
  const nextXp = nextTier.xp > previousXp ? nextTier.xp : Math.max(previousXp + 1, p.xp || 1);
  const fill = nextTier.xp <= p.xp
    ? 100
    : Math.max(0, Math.min(100, ((p.xp - previousXp) / (nextXp - previousXp)) * 100));
  const rawName = p.signup?.name || p.signup?.email || p.inviteEmail || "Guest";
  const username = String(rawName).includes("@") ? String(rawName).split("@")[0] : String(rawName);
  const badge = els.topbarRankPill.querySelector(".tp-topbar-rank-badge");

  els.topbarRankName.textContent = username || "Guest";
  els.topbarRankFill.style.width = `${fill}%`;
  if (badge) {
    badge.className = `tp-topbar-rank-badge tp-topbar-rank-${currentTier.gem}`;
  }
  const missing = rankRequirementMissing(nextTier, p);
  els.topbarRankPill.title = missing.length
    ? `${currentTier.name} · next ${nextTier.name}: ${missing.slice(0, 3).join(", ")}`
    : `${currentTier.name} · top rank unlocked`;
  if (window.lucide) window.lucide.createIcons();
}

function renderSidebarProgress() {
  const p = progress();
  if (getUserPlan() === "free") {
    document.getElementById("side-progress-rank").textContent = "Free Plan";
    document.getElementById("side-progress-rank").title = "Subscribe to earn XP";
    document.getElementById("side-progress-xp").textContent = "Guest";
    document.getElementById("side-progress-fill").style.width = "0%";
    document.getElementById("side-progress-next").textContent = "Subscribe to earn XP";
    return;
  }
  const levelInfo = levelProgress(p.xp);
  const next = nextRankFromXp(p.xp);
  const missing = rankRequirementMissing(next, p);
  document.getElementById("side-progress-rank").textContent = `${planDisplayName()} Plan`;
  document.getElementById("side-progress-xp").textContent = `${rankFromXp(p.xp)} · Level ${levelInfo.level}`;
  document.getElementById("side-progress-fill").style.width = `${Math.min(100, (levelInfo.currentXp / levelInfo.neededXp) * 100)}%`;
  document.getElementById("side-progress-next").textContent = missing.length
    ? `${next.name}: ${missing.slice(0, 2).join(" + ")}`
    : "Top rank reached";
}

function updateFreePlanBanner() {
  renderNotificationSlot();
}

function referralCode() {
  const p = progress();
  if (p.referralCode) return p.referralCode;
  const seed = p.signup?.email || p.inviteEmail || p.signup?.name || "guest";
  return `RE-${stringSeed(seed).toString(36).toUpperCase().slice(0, 5)}`;
}

function referralUserId() {
  const p = progress();
  if (!p.userId) {
    p.userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    saveProgress();
  }
  return p.userId;
}

function referralLink(code = progress().referralCode) {
  return `replayedge.io?ref=${encodeURIComponent(code || "")}`;
}

function referralRewardLabel(status) {
  if (status === "applied") return `<span class="referral-status-applied">Applied ✓</span>`;
  if (status === "pending") return `<span class="referral-status-pending">Pending</span>`;
  return `<span class="muted">None</span>`;
}

function renderReferralCard(state = "ready") {
  const card = document.getElementById("profile-referral-card");
  if (!card) return;
  const p = progress();
  const stats = p.referralStats || { referrals: 0, rewardStatus: "none", joinedVia: Boolean(p.referredBy) };
  const code = p.referralCode;

  if (state === "loading") {
    card.innerHTML = `
      <div class="referral-loading">
        <div class="referral-skeleton referral-skeleton-title"></div>
        <div class="referral-skeleton referral-skeleton-copy"></div>
        <div class="referral-skeleton referral-skeleton-input"></div>
      </div>
    `;
    return;
  }

  if (state === "error") {
    card.innerHTML = `
      <div class="referral-header">
        <div class="panel-title"><i data-lucide="gift"></i> Refer a Friend</div>
        <span class="referral-pill">Earn 10% off</span>
      </div>
      <p class="referral-copy">Share your code. They get 10% off their first month. You get 10% off your next bill.</p>
      <p class="referral-error">Could not load referral info. <button type="button" id="referral-retry">Try again.</button></p>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  card.innerHTML = `
    <div class="referral-header">
      <div class="panel-title"><i data-lucide="gift"></i> Refer a Friend</div>
      <span class="referral-pill">Earn 10% off</span>
    </div>
    <p class="referral-copy">Share your code. They get 10% off their first month. You get 10% off your next bill.</p>
    <div class="referral-reward-grid" aria-label="Referral rewards">
      <div>
        <span>Friend saves</span>
        <strong>10%</strong>
      </div>
      <div>
        <span>You save</span>
        <strong>10%</strong>
      </div>
      <div>
        <span>Setup</span>
        <strong>Instant</strong>
      </div>
    </div>
    ${code ? `
      <div class="referral-code-row">
        <div class="referral-code-field" title="Referral code">${code}</div>
        <button class="ghost-button referral-copy-button" id="profile-copy-referral" type="button">Copy</button>
      </div>
      <div class="referral-link-row">
        <div class="referral-link-copy">
          <span>Your referral link</span>
          <strong title="${referralLink(code)}">${referralLink(code)}</strong>
        </div>
        <button class="ghost-button referral-share-button" id="profile-share-referral" type="button" aria-label="Share referral link"><i data-lucide="share-2"></i></button>
      </div>
      <div class="referral-stats-row">
        <div><span>Referrals</span><strong>${Number(stats.referrals || 0)}</strong></div>
        <div><span>Reward</span><strong>${referralRewardLabel(stats.rewardStatus)}</strong></div>
        <div><span>You joined via</span><strong>${stats.joinedVia ? '<span class="referral-status-applied">Referral ✓</span>' : '<span class="muted">—</span>'}</strong></div>
      </div>
    ` : `
      <div class="referral-empty-state">
        <div>
          <strong>Your code is ready to create</strong>
          <span>Generate it once, then share your personal invite link anywhere.</span>
        </div>
        <button class="primary-button referral-generate-button" id="referral-generate" type="button">Generate Code</button>
      </div>
    `}
  `;
  if (window.lucide) window.lucide.createIcons();
}

async function loadReferralStats(force = false) {
  const p = progress();
  if (p.referralStats && !force) {
    renderReferralCard();
    return;
  }
  renderReferralCard("loading");
  if (location.protocol === "file:") {
    p.referralStats = { referrals: 0, rewardStatus: "none", joinedVia: Boolean(p.referredBy) };
    saveProgress();
    renderReferralCard();
    return;
  }
  try {
    const params = new URLSearchParams({
      userId: referralUserId(),
      referredBy: p.referredBy || ""
    });
    const response = await fetch(`/api/referral/stats?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Referral stats unavailable");
    p.referralCode = data.code || p.referralCode || null;
    p.referralStats = data.stats || { referrals: 0, rewardStatus: "none", joinedVia: Boolean(p.referredBy) };
    saveProgress();
    renderReferralCard();
  } catch {
    renderReferralCard("error");
  }
}

async function generateReferralCode() {
  const p = progress();
  if (location.protocol === "file:") {
    p.referralCode = referralCode();
    p.referralStats = { referrals: 0, rewardStatus: "none", joinedVia: Boolean(p.referredBy) };
    saveProgress();
    renderReferralCard();
    showToast("Referral code generated.", "success");
    return;
  }
  renderReferralCard("loading");
  try {
    const response = await fetch("/api/referral/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: referralUserId(),
        email: p.signup?.email || p.inviteEmail || "",
        name: p.signup?.name || "",
        referredBy: p.referredBy || ""
      })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Referral code unavailable");
    p.referralCode = data.code;
    p.referralStats = data.stats || { referrals: 0, rewardStatus: "none", joinedVia: Boolean(p.referredBy) };
    saveProgress();
    renderReferralCard();
    showToast("Referral code generated.", "success");
  } catch {
    renderReferralCard("error");
    showToast("Could not generate referral code.", "error");
  }
}

function captureReferralFromUrl() {
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return;
  const p = progress();
  p.referredBy = ref.slice(0, 80);
  saveProgress();
}

async function syncReferralSignup() {
  const p = progress();
  if (!p.referredBy || p.referralSynced || location.protocol === "file:") return;
  try {
    await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: p.referredBy,
        email: p.signup?.email || p.inviteEmail || "",
        name: p.signup?.name || ""
      })
    });
    p.referralSynced = true;
    saveProgress();
  } catch {
    console.warn("Referral saved locally only.");
  }
}

function updateGrowthSurfaces() {
  const p = progress();
  const rank = getUserPlan() === "free" ? "Guest · Free Plan" : `${rankFromXp(p.xp)} · ${planDisplayName()}`;
  if (els.referralCode) els.referralCode.textContent = referralCode();
  if (els.shareCardRank) els.shareCardRank.textContent = rank;
  if (els.shareCardAccuracy) els.shareCardAccuracy.textContent = `${accuracy()}%`;
  if (els.shareCardStreak) els.shareCardStreak.textContent = Math.max(p.streak, p.topStreak);
}

function updatePlanSurfaces() {
  const plan = getUserPlan();
  document.body.dataset.plan = plan;
  document.body.classList.toggle("has-paid-plan", plan !== "free");
  const sideProfileLabel = document.getElementById("side-profile-label");
  if (sideProfileLabel) sideProfileLabel.textContent = hasProfileSession() ? "Profile" : "Login";
  if (els.topbarLogin) els.topbarLogin.classList.toggle("hidden", hasProfileSession());
  if (els.topbarAvatar) {
    els.topbarAvatar.classList.toggle("hidden", !hasProfileSession());
    const p = progress();
    const source = p.signup?.name || p.signup?.email || p.inviteEmail || "RE";
    const initials = source
      .split(/[ @._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "RE";
    els.topbarAvatar.innerHTML = `<span>${initials}</span>`;
  }
  document.querySelectorAll(".premium-lock").forEach((button) => {
    const feature = button.dataset.feature;
    const locked = feature ? !hasAccess(feature) : false;
    button.classList.toggle("locked", locked);
    button.querySelector(".side-lock")?.classList.toggle("hidden", !locked);
  });
  document.querySelectorAll(".coach-mode").forEach((item) => item.classList.toggle("hidden", !hasAccess("reviewQueue")));
  document.querySelectorAll(".plan-tier-badge").forEach((badge) => {
    badge.className = `plan-tier-badge plan-${plan}`;
    badge.textContent = planDisplayName(plan);
  });
  const reviewCount = progress().reviewQueue?.length || 0;
  document.getElementById("review-queue-count") && (document.getElementById("review-queue-count").textContent = reviewCount);
  if (els.weeklyDigestToggle && els.digestToggleWrap) {
    const allowed = hasAccess("weeklyDigest");
    els.weeklyDigestToggle.disabled = !allowed;
    els.weeklyDigestToggle.checked = Boolean(progress().digestEnabled);
    els.digestToggleWrap.classList.toggle("locked", !allowed);
    els.digestToggleWrap.title = allowed ? "Weekly digest enabled for Coach and Elite plans" : "Coach Plan only";
  }
  let freezeBank = document.getElementById("topbar-freeze-bank");
  if (!freezeBank) {
    freezeBank = document.createElement("div");
    freezeBank.id = "topbar-freeze-bank";
    freezeBank.className = "topbar-freeze-bank";
    document.querySelector(".topbar-actions")?.prepend(freezeBank);
  }
  const freezes = Number(progress().streakFreezes || 0);
  freezeBank.title = hasAccess("streakFreeze") ? `${freezes} Elite streak freeze${freezes === 1 ? "" : "s"} banked` : "Elite only";
  freezeBank.classList.toggle("locked", !hasAccess("streakFreeze"));
  freezeBank.innerHTML = [0, 1, 2].map((index) => `<span class="${hasAccess("streakFreeze") && index < freezes ? "active" : ""}">◆</span>`).join("");
}

function renderPaywallProgress() {
  if (!els.paywallProgress) return;
  const p = progress();
  const rank = rankFromXp(p.xp);
  const attempts = p.attempts.length;
  const signal = gate.paywallModal?.querySelector(".signal");
  const title = gate.paywallModal?.querySelector("h2");
  const subtitle = gate.paywallModal?.querySelector(".muted");
  if (signal) signal.textContent = getUserPlan() === "free" ? "Free Plan" : "Upgrade";
  if (title) title.textContent = freePlaysLeft() <= 0 && getUserPlan() === "free" ? "You've used all your free plays" : "Choose your plan";
  if (subtitle) subtitle.textContent = "Choose a plan to continue training. Billing is securely handled through Stripe.";
  els.paywallProgress.textContent = p.xp > 0
    ? `You've earned ${p.xp.toLocaleString()} XP and reached ${rank} rank. Keep your progress moving.`
    : "Start your first lesson now and keep every XP point, rank, and streak you earn.";
}

function hasSignup() {
  return Boolean(progress().signup?.email || progress().anonymousAccess);
}

function hasPaidPlan() {
  return hasAccess("paid");
}

function hasElitePlan() {
  return hasAccess("eliteDashboard");
}

function planLevel(plan) {
  return { free: 0, player: 1, coach: 2, elite: 3 }[normalizePlan(plan)] || 0;
}

function effectivePlan() {
  return planDisplayName(getUserPlan());
}

function modeRequirement(mode) {
  if (mode === "thesis") return "Coach";
  if (mode === "survival") return "Elite";
  return null;
}

function canUseMode(mode) {
  const required = modeRequirement(mode);
  if (!required) return true;
  return planLevel(getUserPlan()) >= planLevel(required);
}

function isTrialActive() {
  const trialEndsAt = progress().trialEndsAt;
  return Boolean(trialEndsAt && Date.now() < Number(trialEndsAt));
}

function activeAccessLabel() {
  if (isTrialActive()) return "3-Day Trial";
  return planDisplayName(getUserPlan());
}

function freePlaysLeft() {
  const used = Number(progress().freePlaysUsed || 0);
  return Math.max(0, FREE_PLAY_LIMIT - used);
}

function openSignup() {
  const p = progress();
  const market = document.getElementById("signup-market");
  const experience = document.getElementById("signup-experience");
  if (market && p.signup?.market) market.value = p.signup.market;
  if (experience && p.signup?.experience) experience.value = p.signup.experience;
  gate.signupModal.classList.remove("hidden");
}

function openPaywall() {
  renderPaywallProgress();
  gate.paywallModal.classList.remove("hidden");
}

function closeModals() {
  gate.signupModal.classList.add("hidden");
  gate.paywallModal.classList.add("hidden");
}

function startMode(mode) {
  if (!hasSignup()) {
    state.activeMode = mode;
    openSignup();
    return;
  }

  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }

  if (!canUseMode(mode)) {
    openUpgradeModal(mode === "survival" ? "survival" : mode === "review" ? "reviewQueue" : "thesis");
    return;
  }

  state.activeMode = mode;
  resetModeState();
  state.scenarioIndex = mode === "daily"
    ? dailyScenarioIndex()
    : mode === "review"
      ? reviewQueueScenarioIndex()
      : nextScenarioForMode(mode);
  navigateTo("game");
  applyModeUi();
  renderScenario();
  trackEvent("mode_started", { mode, scenarioIndex: state.scenarioIndex });
}

function modeLabel(mode) {
  return {
    tape: "Tape Sprint",
    liquidityhunt: "Liquidity Hunt",
    candlecrash: "Candle Crash",
    bossfight: "Prop Boss Fight",
    risklab: "Risk Lab",
    newsdesk: "News Impact Desk",
    propescape: "Prop Firm Escape",
    replay: "Replay Mode",
    daily: "Daily Challenge",
    ranked: "Ranked Battle",
    trade: "Trade Mode",
    spot: "Spot the Setup",
    survival: "Candle Survival",
    notrade: "No-Trade Challenge",
    detective: "Chart Detective",
    thesis: "Build the Thesis",
    review: "Review Queue"
  }[mode] || "this mode";
}

function reviewQueueScenarioIndex() {
  const p = progress();
  const queue = Array.isArray(p.reviewQueue) ? p.reviewQueue : [];
  const missed = p.attempts.filter((attempt) => !attempt.correct);
  if (!queue.length && !missed.length) return findNextProgressiveScenario(Number(p.sessionStartIndex || freshScenarioBase()), 1, "replay");
  const weakest = weakestPatternTag();
  const meta = p.reviewQueueMeta || {};
  const prioritized = [
    ...queue.map((scenarioId) =>
      missed.find((attempt) => attempt.scenarioId === scenarioId) || {
        scenarioId,
        patternTags: meta[scenarioId]?.patternTags || [],
        wrongAt: meta[scenarioId]?.wrongAt || 0
      }
    ).filter(Boolean),
    ...missed
  ].sort((a, b) => {
    const aTags = a.patternTags || [a.pattern || ""];
    const bTags = b.patternTags || [b.pattern || ""];
    const tagScore = Number(bTags.includes(weakest)) - Number(aTags.includes(weakest));
    return tagScore || Number(b.wrongAt || 0) - Number(a.wrongAt || 0);
  });
  const target = prioritized[0]?.scenarioId || missed[missed.length - 1].scenarioId;
  for (let index = 0; index < Math.min(TOTAL_SCENARIO_COUNT, 50000); index += 1) {
    if (getScenario(index).id === target) return index;
  }
  return nextScenarioForMode("replay");
}

function scenarioPatternTags(scenario) {
  return Array.isArray(scenario.patternTags) && scenario.patternTags.length
    ? scenario.patternTags
    : Array.isArray(scenario.tags)
      ? scenario.tags.map((tag) => String(tag).toLowerCase().replace(/\s+/g, "_"))
      : [];
}

function futureCandleCount(scenario = getScenario(state.scenarioIndex)) {
  if (Array.isArray(scenario.candles) && scenario.candles.length) {
    return Math.max(0, scenario.candles.length - Number(scenario.pauseAtCandle || 42));
  }
  return 18;
}

function pauseCandleIndex(scenario = getScenario(state.scenarioIndex)) {
  return Number(scenario.pauseAtCandle || 42);
}

function replayDateLabel(scenario) {
  const visibleDate = scenario.revealedTime || humanDate(scenario.date || scenario.time);
  return state.revealed ? visibleDate : "Date hidden until reveal";
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function dailyScenarioIndex() {
  const count = externalScenarioState.ready && externalScenarioState.index.length
    ? externalScenarioState.index.length
    : Math.min(SHARED_SCENARIO_COUNT, scenarios.length);
  return dayOfYear() % count;
}

function dailyCountdownText() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const ms = Math.max(0, midnight - now);
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `Resets in ${hours}h ${minutes}m`;
}

function modeLiveCount(mode) {
  const seed = stringSeed(`${mode}-${Math.floor(Date.now() / 5000)}`);
  const base = {
    tape: 1006,
    liquidityhunt: 880,
    candlecrash: 760,
    bossfight: 540,
    risklab: 719,
    newsdesk: 644,
    propescape: 502,
    replay: 1180,
    daily: 820,
    ranked: 610,
    trade: 520,
    spot: 700,
    survival: 930,
    notrade: 410,
    detective: 580,
    thesis: 370,
    review: 240
  }[mode] || 320;
  return base + (seed % 44);
}

const modeCardVisuals = {
  tape: { accent: "#29e7ff", bg: "#0a85d8", shape: "bolt" },
  liquidityhunt: { accent: "#55ff9a", bg: "#096e57", shape: "pool" },
  candlecrash: { accent: "#ffdf4d", bg: "#ba3c96", shape: "crash" },
  bossfight: { accent: "#ff5d73", bg: "#5b234f", shape: "boss" },
  risklab: { accent: "#ffb84d", bg: "#d66b10", shape: "scale" },
  newsdesk: { accent: "#7ad7ff", bg: "#176bb8", shape: "calendar" },
  propescape: { accent: "#ff5d73", bg: "#a51f3d", shape: "lock" },
  replay: { accent: "#7c4dff", bg: "#4d2db7", shape: "candles" },
  daily: { accent: "#16c8a7", bg: "#08796f", shape: "calendar" },
  ranked: { accent: "#ff4778", bg: "#d81e5b", shape: "trophy" },
  trade: { accent: "#ff9f2f", bg: "#e66b1f", shape: "target" },
  spot: { accent: "#20d6ff", bg: "#0879b8", shape: "scope" },
  survival: { accent: "#ff6b35", bg: "#bd3e22", shape: "timer" },
  notrade: { accent: "#ffd84d", bg: "#b8860b", shape: "shield" },
  detective: { accent: "#b965ff", bg: "#6530b8", shape: "search" },
  thesis: { accent: "#58d66d", bg: "#0b8f58", shape: "blocks" },
  review: { accent: "#5fd4ff", bg: "#216f9b", shape: "stack" }
};

function modeCardIllustration(mode) {
  const visual = modeCardVisuals[mode] || modeCardVisuals.replay;
  const common = `
    <circle cx="188" cy="64" r="42" fill="rgba(255,255,255,.12)"/>
    <circle cx="58" cy="178" r="34" fill="rgba(0,0,0,.12)"/>
    <path d="M18 194 C64 146 102 224 150 172 S226 151 246 108" fill="none" stroke="rgba(255,255,255,.17)" stroke-width="10" stroke-linecap="round"/>
  `;
  const shapes = {
    candles: `
      <rect x="62" y="62" width="34" height="116" rx="12" fill="#66f38b"/>
      <rect x="112" y="38" width="34" height="154" rx="12" fill="#fff7c8"/>
      <rect x="162" y="82" width="34" height="88" rx="12" fill="#ff5b5f"/>
      <path d="M79 42v156M129 20v190M179 58v132" stroke="#101620" stroke-width="7" stroke-linecap="round" opacity=".35"/>
    `,
    bolt: `
      <path d="M142 24L58 140h58l-18 88 94-126h-62l12-78z" fill="#fff7c8"/>
      <path d="M142 24L58 140h58l-18 88 94-126h-62l12-78z" fill="none" stroke="#101620" stroke-width="10" stroke-linejoin="round" opacity=".22"/>
      <circle cx="66" cy="70" r="18" fill="#66f38b"/>
      <circle cx="192" cy="184" r="24" fill="#ff5b5f"/>
      <path d="M42 184h52M158 64h52" stroke="#fff7c8" stroke-width="12" stroke-linecap="round" opacity=".55"/>
    `,
    scale: `
      <path d="M126 44v152M78 74h96" stroke="#101620" stroke-width="14" stroke-linecap="round" opacity=".34"/>
      <path d="M82 74l-38 70h76L82 74zM170 74l-38 70h76l-38-70z" fill="#fff7c8"/>
      <rect x="82" y="196" width="88" height="22" rx="11" fill="#101620" opacity=".36"/>
      <circle cx="126" cy="72" r="18" fill="#66f38b"/>
    `,
    lock: `
      <rect x="58" y="104" width="136" height="98" rx="24" fill="#fff7c8"/>
      <path d="M88 104V78c0-31 20-50 38-50s38 19 38 50v26" fill="none" stroke="#101620" stroke-width="18" stroke-linecap="round" opacity=".36"/>
      <circle cx="126" cy="146" r="16" fill="#ff5b5f"/>
      <path d="M126 158v22" stroke="#ff5b5f" stroke-width="12" stroke-linecap="round"/>
    `,
    calendar: `
      <rect x="55" y="58" width="138" height="134" rx="24" fill="#fff7c8"/>
      <path d="M55 92h138" stroke="#0b1620" stroke-width="14" opacity=".2"/>
      <path d="M88 48v34M160 48v34" stroke="#0b1620" stroke-width="14" stroke-linecap="round" opacity=".38"/>
      <path d="M94 134l24 24 48-58" fill="none" stroke="#12d98d" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    trophy: `
      <path d="M82 62h84v40c0 38-22 62-42 62s-42-24-42-62V62z" fill="#ffd84d"/>
      <path d="M82 78H48c0 42 20 58 42 58M166 78h34c0 42-20 58-42 58" fill="none" stroke="#fff7c8" stroke-width="16" stroke-linecap="round"/>
      <rect x="106" y="162" width="36" height="30" rx="10" fill="#fff7c8"/>
      <rect x="78" y="190" width="92" height="22" rx="11" fill="#0b1620" opacity=".35"/>
    `,
    target: `
      <circle cx="126" cy="126" r="78" fill="#fff7c8"/>
      <circle cx="126" cy="126" r="52" fill="#ff5b5f"/>
      <circle cx="126" cy="126" r="24" fill="#101620"/>
      <path d="M180 72l35-35M202 38h24v24" stroke="#fff7c8" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    scope: `
      <circle cx="126" cy="126" r="78" fill="#101620" opacity=".32"/>
      <circle cx="126" cy="126" r="52" fill="none" stroke="#fff7c8" stroke-width="16"/>
      <path d="M126 52v38M126 162v38M52 126h38M162 126h38" stroke="#66f38b" stroke-width="12" stroke-linecap="round"/>
      <circle cx="126" cy="126" r="12" fill="#ffde59"/>
    `,
    timer: `
      <circle cx="126" cy="132" r="70" fill="#fff7c8"/>
      <path d="M126 92v44l36 24" stroke="#101620" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="98" y="32" width="56" height="24" rx="12" fill="#101620" opacity=".35"/>
      <path d="M68 58l-22 22M184 58l22 22" stroke="#fff7c8" stroke-width="13" stroke-linecap="round"/>
    `,
    shield: `
      <path d="M126 42l82 30v54c0 48-32 76-82 96-50-20-82-48-82-96V72l82-30z" fill="#fff7c8"/>
      <path d="M92 126l24 24 50-60" fill="none" stroke="#12d98d" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M126 42v180" stroke="#101620" stroke-width="8" opacity=".18"/>
    `,
    search: `
      <circle cx="108" cy="106" r="58" fill="#fff7c8"/>
      <circle cx="108" cy="106" r="28" fill="#101620" opacity=".22"/>
      <path d="M152 150l54 54" stroke="#101620" stroke-width="22" stroke-linecap="round"/>
      <path d="M88 78h40M78 106h60" stroke="#ffde59" stroke-width="10" stroke-linecap="round"/>
    `,
    blocks: `
      <rect x="52" y="72" width="62" height="62" rx="16" fill="#fff7c8"/>
      <rect x="134" y="48" width="62" height="62" rx="16" fill="#66f38b"/>
      <rect x="114" y="142" width="72" height="72" rx="18" fill="#101620" opacity=".38"/>
      <path d="M82 134l68 8M165 110l-16 32" stroke="#fff7c8" stroke-width="10" stroke-linecap="round" opacity=".55"/>
    `,
    stack: `
      <rect x="62" y="58" width="128" height="88" rx="18" fill="#fff7c8"/>
      <rect x="48" y="88" width="128" height="88" rx="18" fill="#66f38b"/>
      <rect x="76" y="120" width="128" height="88" rx="18" fill="#101620" opacity=".42"/>
      <path d="M96 96h58M82 128h58M110 160h58" stroke="#101620" stroke-width="10" stroke-linecap="round" opacity=".3"/>
    `,
    pool: `
      <path d="M36 164 C62 106 108 192 136 128 S202 72 220 128" fill="none" stroke="#fff7c8" stroke-width="18" stroke-linecap="round" opacity=".82"/>
      <circle cx="76" cy="156" r="30" fill="#66f38b"/>
      <circle cx="180" cy="96" r="34" fill="#ffde59"/>
      <path d="M72 64h96M64 196h128" stroke="#101620" stroke-width="12" stroke-linecap="round" opacity=".32"/>
      <path d="M84 148l24 20 46-64" fill="none" stroke="#101620" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>
    `,
    crash: `
      <rect x="48" y="60" width="34" height="110" rx="12" fill="#66f38b"/>
      <rect x="102" y="92" width="34" height="92" rx="12" fill="#ff5b5f"/>
      <rect x="156" y="34" width="34" height="154" rx="12" fill="#fff7c8"/>
      <path d="M52 40l36 28M170 20l38 36M96 204l34-30" stroke="#ffde59" stroke-width="13" stroke-linecap="round"/>
      <circle cx="126" cy="126" r="28" fill="#101620" opacity=".32"/>
      <path d="M112 126h28M126 112v28" stroke="#ffde59" stroke-width="10" stroke-linecap="round"/>
    `,
    boss: `
      <path d="M62 92c0-34 28-58 64-58s64 24 64 58v68c0 34-28 58-64 58s-64-24-64-58V92z" fill="#101620" opacity=".44"/>
      <path d="M82 82l-24-32M170 82l24-32" stroke="#fff7c8" stroke-width="14" stroke-linecap="round"/>
      <circle cx="104" cy="118" r="14" fill="#ff5b5f"/>
      <circle cx="148" cy="118" r="14" fill="#ff5b5f"/>
      <path d="M98 164c18 12 38 12 56 0" stroke="#ffde59" stroke-width="13" stroke-linecap="round"/>
      <rect x="54" y="200" width="144" height="18" rx="9" fill="#66f38b"/>
    `
  };
  return `
    <svg class="flat-mode-illustration" viewBox="0 0 252 252" aria-hidden="true" focusable="false">
      <rect width="252" height="252" rx="0" fill="${visual.bg}"/>
      ${common}
      ${shapes[visual.shape] || shapes.candles}
    </svg>
  `;
}

function hydrateModeCardArt() {
  document.querySelectorAll(".game-mode-card").forEach((card) => {
    const mode = card.dataset.mode || "replay";
    const visual = modeCardVisuals[mode] || modeCardVisuals.replay;
    card.style.setProperty("--mode-accent", visual.accent);
    card.style.setProperty("--mode-bg", visual.bg);
    const art = card.querySelector(".game-art");
    if (art && !art.querySelector(".flat-mode-illustration")) {
      art.insertAdjacentHTML("afterbegin", modeCardIllustration(mode));
    }
  });
}

function updateGameCards() {
  organizeModeShelves();
  hydrateModeCardArt();
  document.querySelectorAll(".game-mode-card").forEach((card) => {
    const mode = card.dataset.mode || "replay";
    const required = modeRequirement(mode);
    const freeUsed = getUserPlan() === "free" && freePlaysLeft() <= 0;
    const earlyAccess = false;
    const locked = freeUsed || earlyAccess || Boolean(required && !canUseMode(mode));
    card.classList.toggle("locked-mode", locked);
    card.classList.toggle("free-locked", freeUsed);
    card.classList.toggle("early-access-locked", earlyAccess && !freeUsed);
    card.classList.toggle("elite-early-access", mode === "daily" && hasAccess("priorityScenarios"));
    card.setAttribute("aria-disabled", locked ? "true" : "false");
    const footer = card.querySelector(".game-footer b");
    const action = card.querySelector(".game-footer em");
    if (footer) {
      if (freeUsed) {
        footer.innerHTML = `<i></i> Free plays used`;
      } else if (earlyAccess) {
        footer.innerHTML = `<i></i> Available in 1d 23h`;
      } else if (mode === "daily" && hasAccess("priorityScenarios")) {
        footer.innerHTML = `<i></i> EARLY ACCESS`;
      } else if (locked) {
        footer.innerHTML = `<i></i> ${required} plan required`;
      } else if (mode === "daily") {
        footer.innerHTML = `<i></i> ${dailyCountdownText()}`;
      } else if (mode === "review") {
        const count = Math.max(progress().reviewQueue?.length || 0, progress().attempts.filter((attempt) => !attempt.correct).length);
        footer.innerHTML = `<i></i> ${count} to review`;
      } else {
        footer.innerHTML = `<i></i> ${modeLiveCount(mode).toLocaleString()} playing`;
      }
    }
    if (action) {
      if (freeUsed) action.textContent = "Upgrade ↗";
      else if (earlyAccess) action.textContent = "Elite only ↗";
      else action.textContent = locked ? `Unlock ${required} ↗` : action.textContent.replace(/^Unlock .+ ↗$/, "Play Now ↗");
    }
  });
}

const modeShelfGroups = [
  { title: "Start Here", subtitle: "Fast, clear games that teach the core loop first.", modes: ["tape", "liquidityhunt", "candlecrash", "daily"] },
  { title: "Skill Arcade", subtitle: "Simple drills for risk, news, rules, and patience.", modes: ["risklab", "newsdesk", "propescape", "notrade"] },
  { title: "Replay Arena", subtitle: "Deeper sims once the basics feel natural.", modes: ["replay", "trade", "ranked", "review"] }
];

const catalogShelfGroups = [
  ...modeShelfGroups,
  { title: "Advanced Lab", subtitle: "Longer, more analytical modes for experienced users.", modes: ["bossfight", "spot", "detective", "thesis", "survival"] }
];

const modeCatalogMeta = {
  tape: { category: "Start Here", title: "Tape Sprint", copy: "Pick Long, Short, or Flat before the clock runs out.", tag: "Fast reps" },
  candlecrash: { category: "Start Here", title: "Candle Crash", copy: "Watch the candle burst and choose what it means.", tag: "Arcade" },
  daily: { category: "One Shot", title: "Daily Challenge", copy: "One shared scenario each day for streaks and bonus XP.", tag: "Daily" },
  ranked: { category: "Arena", title: "Ranked Battle", copy: "Timed rounds with bigger XP and leaderboard pressure.", tag: "Ranked" },
  newsdesk: { category: "Macro Drill", title: "News Impact Desk", copy: "Sort news events by likely market danger.", tag: "Education" },
  replay: { category: "Core Sim", title: "Replay Mode", copy: "Study, predict, then reveal the hidden candles.", tag: "Signature" },
  liquidityhunt: { category: "Start Here", title: "Liquidity Hunt", copy: "Tap the stop pool price is most likely to hunt.", tag: "Arcade" },
  trade: { category: "Simulator", title: "Trade Mode", copy: "Choose direction, entry, stop, and target.", tag: "Execution" },
  survival: { category: "Advanced", title: "Candle Survival", copy: "Make five decisions as the chart develops.", tag: "Adaptive" },
  risklab: { category: "Skill Arcade", title: "Risk Lab", copy: "Adjust the numbers until the risk plan survives.", tag: "Education" },
  bossfight: { category: "Advanced", title: "Prop Boss Fight", copy: "Beat drawdown, rule breaks, and event risk.", tag: "Arcade" },
  propescape: { category: "Skill Arcade", title: "Prop Firm Escape", copy: "Choose the action that protects the account rules.", tag: "Rules" },
  spot: { category: "Advanced", title: "Spot the Setup", copy: "Click the exact area where the setup becomes visible.", tag: "Precision" },
  notrade: { category: "Skill Arcade", title: "No-Trade Challenge", copy: "Decide if the strongest move is to skip.", tag: "Patience" },
  detective: { category: "Advanced", title: "Chart Detective", copy: "Find the clue carrying the most decision value.", tag: "Clues" },
  thesis: { category: "Advanced", title: "Build the Thesis", copy: "Build a full read across five components.", tag: "Analysis" },
  review: { category: "Coach Drill", title: "Review Queue", copy: "Replay only scenarios you previously missed.", tag: "Coach" }
};

const modeQualityMeta = {
  tape: { skill: "Speed", time: "1 min", best: "Fast bias reads" },
  candlecrash: { skill: "Reflex", time: "2 min", best: "Candle identity" },
  daily: { skill: "Habit", time: "1 shot", best: "Streak pressure" },
  ranked: { skill: "Pressure", time: "3 min", best: "Competitive focus" },
  newsdesk: { skill: "Macro", time: "2 min", best: "Event risk" },
  replay: { skill: "Core", time: "4 min", best: "Blind market reads" },
  liquidityhunt: { skill: "Liquidity", time: "2 min", best: "Stop pools" },
  trade: { skill: "Execution", time: "5 min", best: "Entry and risk" },
  survival: { skill: "Adapt", time: "4 min", best: "Candle-by-candle" },
  risklab: { skill: "Risk", time: "3 min", best: "Position sizing" },
  bossfight: { skill: "Rules", time: "4 min", best: "Prop discipline" },
  propescape: { skill: "Discipline", time: "4 min", best: "Account rules" },
  spot: { skill: "Precision", time: "2 min", best: "Setup location" },
  notrade: { skill: "Patience", time: "2 min", best: "Avoid bad trades" },
  detective: { skill: "Evidence", time: "3 min", best: "Clue priority" },
  thesis: { skill: "Analysis", time: "6 min", best: "Full read building" },
  review: { skill: "Correction", time: "3 min", best: "Fix missed setups" }
};

function catalogStatusForMode(mode) {
  const required = modeRequirement(mode);
  if (getUserPlan() === "free" && freePlaysLeft() <= 0) return "Locked";
  if (required && !canUseMode(mode)) return `${required} Plan`;
  if (mode === "review") {
    const count = Math.max(progress().reviewQueue?.length || 0, progress().attempts.filter((attempt) => !attempt.correct).length);
    return `${count} to review`;
  }
  if (mode === "daily") return dailyCountdownText();
  return `${modeLiveCount(mode).toLocaleString()} playing`;
}

function renderGameCatalog() {
  if (!els.catalogGrid) return;
  const query = (els.catalogSearch?.value || "").trim().toLowerCase();
  let visibleCount = 0;

  const groupsMarkup = catalogShelfGroups.map((group) => {
    const cards = group.modes
      .map((mode) => ({ mode, meta: modeCatalogMeta[mode] }))
      .filter(({ mode, meta }) => {
        if (!meta) return false;
        const quality = modeQualityMeta[mode] || {};
        const haystack = `${meta.category} ${meta.title} ${meta.copy} ${meta.tag} ${quality.skill || ""} ${quality.time || ""} ${quality.best || ""} ${group.title} ${mode}`.toLowerCase();
        return !query || haystack.includes(query);
      })
      .map(({ mode, meta }) => {
        visibleCount += 1;
        const visual = modeCardVisuals[mode] || modeCardVisuals.replay;
        const quality = modeQualityMeta[mode] || { skill: "Training", time: "3 min", best: "Decision reps" };
        const required = modeRequirement(mode);
        const locked = (getUserPlan() === "free" && freePlaysLeft() <= 0) || Boolean(required && !canUseMode(mode));
        const badge = locked ? catalogStatusForMode(mode) : meta.tag;
        return `
          <button class="catalog-mode-card${locked ? " catalog-mode-locked" : ""}" type="button" data-mode="${mode}" style="--catalog-accent:${visual.accent};--catalog-bg:${visual.bg};">
            <span class="catalog-mode-art">
              ${modeCardIllustration(mode)}
              <b>${badge}</b>
            </span>
            <span class="catalog-mode-copy">
              <small>${meta.category}</small>
              <strong>${meta.title}</strong>
              <span>${meta.copy}</span>
              <em class="catalog-mode-proof"><b>${quality.skill}</b><i>${quality.time}</i><mark>${quality.best}</mark></em>
            </span>
            <span class="catalog-mode-status"><i></i>${catalogStatusForMode(mode)}</span>
          </button>
        `;
      })
      .join("");

    if (!cards) return "";
    return `
      <section class="catalog-group">
        <div class="catalog-group-head">
          <div>
            <h3>${group.title}</h3>
            <p>${group.subtitle}</p>
          </div>
          <span>${cards.match(/catalog-mode-card/g)?.length || 0} games</span>
        </div>
        <div class="catalog-card-grid">${cards}</div>
      </section>
    `;
  }).join("");

  els.catalogGrid.innerHTML = groupsMarkup || `
    <div class="catalog-empty">
      <strong>No games found</strong>
      <span>Try searching Replay, Risk, Daily, Ranked, or Education.</span>
    </div>
  `;
  if (els.catalogCount) els.catalogCount.textContent = `${visibleCount} game${visibleCount === 1 ? "" : "s"}`;
  window.lucide?.createIcons();
}

function organizeModeShelves() {
  document.querySelectorAll(".game-mode-grid").forEach((grid) => {
    if (grid.dataset.shelfReady === "true") return;
    const cards = [...grid.querySelectorAll(":scope > .game-mode-card")];
    if (!cards.length) return;
    grid.dataset.shelfReady = "true";
    grid.classList.add("mode-shelf-stack");
    grid.innerHTML = "";

    modeShelfGroups.forEach((group) => {
      const groupCards = group.modes
        .map((mode) => cards.find((card) => card.dataset.mode === mode))
        .filter(Boolean);
      if (!groupCards.length) return;

      const shelf = document.createElement("section");
      shelf.className = "mode-shelf";
      shelf.dataset.shelf = group.title.toLowerCase().replace(/\s+/g, "-");
      shelf.innerHTML = `
        <div class="mode-shelf-heading">
          <div>
            <h3>${group.title}</h3>
            <p>${group.subtitle}</p>
          </div>
          <div class="mode-shelf-actions">
            <button class="mode-shelf-view" type="button">View All</button>
            <button class="mode-shelf-arrow" type="button" data-direction="-1" aria-label="Previous ${group.title}">‹</button>
            <button class="mode-shelf-arrow" type="button" data-direction="1" aria-label="Next ${group.title}">›</button>
          </div>
        </div>
        <div class="mode-shelf-track"></div>
      `;
      const track = shelf.querySelector(".mode-shelf-track");
      groupCards.forEach((card) => track.appendChild(card));
      grid.appendChild(shelf);
    });
  });
}

function updateModeShelfVisibility() {
  document.querySelectorAll(".mode-shelf").forEach((shelf) => {
    const visibleCards = [...shelf.querySelectorAll(".game-mode-card")].filter((card) => !card.classList.contains("search-hidden"));
    shelf.classList.toggle("hidden", visibleCards.length === 0);
  });
}

function renderDifficultyBadge(scenario) {
  if (!els.difficultyBadge) return;
  const rate = difficultyWinRate(scenario);
  els.difficultyBadge.className = `difficulty-badge ${scenario.difficulty.toLowerCase()}`;
  els.difficultyBadge.textContent = `${scenario.difficulty} · only ${rate}% accuracy`;
}

function resetModeState() {
  stopReplay();
  document.querySelector(".trainer-grid")?.classList.remove("result-mode");
  state.learningOpenKey = "";
  state.revealed = false;
  state.revealCount = 0;
  state.selected = null;
  state.confidence = "medium";
  state.tradeDirection = "wait";
  state.tradeDragMarker = null;
  state.survivalRound = 0;
  state.survivalCorrect = 0;
  gate.resultClueMarker.classList.add("hidden");
}

function applyModeUi() {
  document.body.dataset.activeMode = state.activeMode;
  const copy = {
    tape: ["Tape Sprint", "Quick round: pick Long, Short, or Flat before the timer ends."],
    liquidityhunt: ["Liquidity Hunt", "Tap the price pool you think gets hunted next."],
    candlecrash: ["Candle Crash", "Watch the candle burst and choose the candle personality."],
    bossfight: ["Prop Boss Fight", "Advanced battle: protect the account from rule-breaking choices."],
    risklab: ["Risk Lab", "Set the risk numbers and see if the plan survives."],
    newsdesk: ["News Impact Desk", "Sort the news event by market danger before it hits."],
    propescape: ["Prop Firm Escape", "Pick the safest action without breaking funded-account rules."],
    replay: ["Replay Mode", "Study the chart, choose the likely move, then reveal what happened."],
    daily: ["Daily Challenge", "One shared scenario today. One clean decision."],
    ranked: ["Ranked Battle", "Timed replay rounds with bigger XP and leaderboard pressure."],
    trade: ["Trade Builder", "Build the trade: direction, entry, stop, and target."],
    spot: ["Spot the Setup", "Advanced drill: click the exact chart clue."],
    survival: ["Candle Survival", "Advanced run: adapt as each candle group appears."],
    notrade: ["No-Trade Challenge", "Decide if the smartest trade is no trade."],
    detective: ["Chart Detective", "Advanced drill: find the one clue that matters most."],
    thesis: ["Build the Thesis", "Coach drill: assemble a complete market read."],
    review: ["Review Queue", "Replay your misses until the mistake becomes obvious."]
  };
  const active = copy[state.activeMode] || copy.replay;
  gate.activeModeLabel.textContent = active[0];
  gate.activeModeTitle.textContent = active[0];
  const accessCopy = hasPaidPlan() ? "Unlimited access." : `${freePlaysLeft()} free plays left.`;
  gate.activeModeCopy.textContent = `${active[1]} ${accessCopy}`;
  gate.tradeForm.classList.toggle("hidden", state.activeMode !== "trade");
  gate.thesisBuilder.classList.toggle("hidden", state.activeMode !== "thesis");
  gate.survivalStatus.classList.toggle("hidden", state.activeMode !== "survival");
  gate.confidencePicker.classList.toggle("hidden", !["replay", "daily", "ranked", "notrade", "detective", "review"].includes(state.activeMode));
  gate.chartHotspots.classList.toggle("hidden", state.activeMode !== "spot" || state.revealed);

  const instructions = {
    tape: "Goal: make a fast directional read. Choose Long, Short, or Flat before the clock expires.",
    liquidityhunt: "Goal: find where stops are sitting. Tap the labeled pool most likely to get hunted.",
    candlecrash: "Goal: read candle intent. Choose whether the burst shows strength, trap, exhaustion, or indecision.",
    bossfight: "Goal: survive the account boss. Choose the safest rule-based action before chasing profit.",
    risklab: "Goal: protect the account. Adjust contracts, stop size, and max risk until the plan is survivable.",
    newsdesk: "Goal: understand event danger. Pick the event impact and the safest preparation.",
    propescape: "Goal: avoid rule violations. Choose the action that keeps the funded account alive.",
    replay: "Goal: build chart intuition. Inspect the timeframes, choose the likely outcome, then reveal.",
    daily: "Goal: one clean daily decision. Use the chart, choose once, and protect your streak.",
    ranked: "Goal: perform under pressure. Make timed decisions and climb by staying accurate.",
    trade: "Goal: practice execution. Choose direction, entry, stop, and target before the replay runs.",
    spot: "Goal: spot the exact clue. Click the chart zone where the setup becomes valid.",
    survival: "Goal: adapt as candles print. Make a fresh decision after each new candle group.",
    notrade: "Goal: protect patience. Decide if this is a trade or a skip.",
    detective: "Goal: prioritize evidence. Pick the clue that explains the next move best.",
    thesis: "Goal: build a full read. Complete each thesis component before submitting.",
    review: "Goal: fix your misses. Replay wrong answers and find the clue you skipped."
  };
  gate.modeInstruction.textContent = instructions[state.activeMode] || instructions.replay;
}

function updateDifficultyMessage(scenario) {
  const rate = difficultyWinRate(scenario);
  const intro = scenario.difficulty === "Hard"
    ? `This one's tough: only ${rate}% of players usually get this read. `
    : scenario.difficulty === "Medium"
      ? `Medium pressure drill: about ${rate}% choose the right read. `
      : `Starter-friendly drill: about ${rate}% of players get it right. `;
  gate.modeInstruction.textContent = `${intro}${gate.modeInstruction.textContent}`;
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeCandles(scenario, timeframe, revealAmount = 0) {
  if (Array.isArray(scenario.candles) && scenario.candles.length) {
    const pauseAt = Number(scenario.pauseAtCandle || 42);
    const future = revealAmount === true ? scenario.candles.length - pauseAt : Math.max(0, Number(revealAmount) || 0);
    return scenario.candles.slice(0, Math.min(scenario.candles.length, pauseAt + future)).map((candle, index) => ({
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
      volume: Number(candle.volume || 0),
      time: candle.time,
      future: index >= pauseAt
    }));
  }
  const multipliers = { "1m": 1, "5m": 1.7, "15m": 3.1, "1h": 5.7, "4h": 7.4 };
  const visible = 42;
  const future = revealAmount === true ? 18 : Math.max(0, Math.min(18, Number(revealAmount) || 0));
  const total = visible + future;
  const rand = seededRandom(scenario.seed + timeframe.charCodeAt(0) * 19);
  const candles = [];
  let price = 100 + scenario.seed / 8;

  for (let i = 0; i < total; i += 1) {
    const volatility = (multipliers[timeframe] || 1) * (0.44 + rand() * 0.68);
    let drift = Math.sin((i + scenario.seed) / 6) * 0.42;

    if (i > 18 && i < 32 && scenario.bias !== "chop") drift += 0.18;
    if (i >= visible) {
      if (scenario.bias === "reversal") drift -= 1.18;
      if (scenario.bias === "continuation") drift += 1.02;
      if (scenario.bias === "breakout") drift += i < visible + 6 ? 1.55 : 0.7;
      if (scenario.bias === "chop") drift += (i % 2 === 0 ? 1 : -1) * 1.04;
    }

    const open = price;
    const close = open + drift + (rand() - 0.5) * volatility;
    const wick = volatility * (0.8 + rand());
    const high = Math.max(open, close) + wick * rand();
    const low = Math.min(open, close) - wick * rand();

    candles.push({ open, high, low, close, future: i >= visible });
    price = close;
  }

  return candles;
}

function drawChartOn(canvas, scenario, timeframe, revealAmount = 0, compact = false) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const futureTotal = futureCandleCount(scenario);
  const pauseAt = pauseCandleIndex(scenario);
  const revealCount = revealAmount === true ? futureTotal : Math.max(0, Math.min(futureTotal, Number(revealAmount) || 0));
  const candles = makeCandles(scenario, timeframe, revealCount);
  const pad = compact ? { top: 18, right: 8, bottom: 18, left: 8 } : { top: 34, right: 68, bottom: 44, left: 54 };
  const plotW = width - pad.left - pad.right;
  const volumeH = compact ? 0 : 74;
  const plotH = height - pad.top - pad.bottom - volumeH;
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const xStep = plotW / candles.length;
  const candleW = Math.max(compact ? 3 : 5, xStep * 0.58);
  const yFor = (price) => pad.top + ((max - price) / range) * plotH;
  const geometry = {
    width,
    height,
    pad,
    plotW,
    plotH,
    candles,
    max,
    min,
    range,
    xStep,
    yFor,
    priceForY: (y) => max - ((Math.max(pad.top, Math.min(pad.top + plotH, y)) - pad.top) / plotH) * range
  };
  if (!compact && canvas === els.chart) state.chartGeometry = geometry;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#070c11";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = compact ? "#15212b" : "#1c2a36";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = pad.top + (plotH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    if (!compact) {
      ctx.fillStyle = "#8f9da8";
      ctx.font = "18px Inter, system-ui";
      ctx.fillText((max - (range / 5) * i).toFixed(2), width - pad.right + 10, y + 6);
    }
  }

  const vwap = candles.reduce((sum, candle) => sum + (candle.high + candle.low + candle.close) / 3, 0) / candles.length;
  const demand = candles.slice(14, 34).reduce((m, c) => Math.min(m, c.low), Infinity) + range * 0.07;
  const supply = candles.slice(6, 22).reduce((m, c) => Math.max(m, c.high), -Infinity) - range * 0.06;

  drawBand(ctx, pad.left, yFor(demand), plotW, compact ? 22 : 38, "rgba(86, 214, 109, 0.13)");
  drawBand(ctx, pad.left, yFor(supply), plotW, compact ? 22 : 38, "rgba(255, 95, 87, 0.12)");
  drawDashedLine(ctx, pad.left, yFor(vwap), width - pad.right, yFor(vwap), "#386cff");

  candles.forEach((candle, index) => {
    const x = pad.left + index * xStep + xStep / 2;
    const openY = yFor(candle.open);
    const closeY = yFor(candle.close);
    const highY = yFor(candle.high);
    const lowY = yFor(candle.low);
    const up = candle.close >= candle.open;
    const color = up ? "#56d66d" : "#ff5f57";

    ctx.globalAlpha = candle.future ? 1 : 0.94;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();
    ctx.fillRect(x - candleW / 2, Math.min(openY, closeY), candleW, Math.max(2, Math.abs(openY - closeY)));
  });

  ctx.globalAlpha = 1;

  if (!compact) {
    const maxVolume = Math.max(...candles.map((candle) => Number(candle.volume || 1)), 1);
    const volTop = pad.top + plotH + 14;
    candles.forEach((candle, index) => {
      const x = pad.left + index * xStep + xStep / 2;
      const barH = Math.max(2, (Number(candle.volume || 1) / maxVolume) * (volumeH - 20));
      ctx.globalAlpha = candle.future ? 0.78 : 0.42;
      ctx.fillStyle = candle.close >= candle.open ? "#56d66d" : "#e44646";
      ctx.fillRect(x - candleW / 2, volTop + volumeH - 18 - barH, candleW, barH);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#6f858d";
    ctx.font = "14px Inter, system-ui";
    ctx.fillText("Volume", pad.left, volTop + 13);
  }

  if (!compact && revealCount < futureTotal) {
    const hiddenX = pad.left + (pauseAt + revealCount) * xStep;
    ctx.fillStyle = "rgba(5, 9, 13, 0.72)";
    ctx.fillRect(hiddenX, pad.top, width - pad.right - hiddenX, plotH);
    ctx.strokeStyle = "#f6c34e";
    ctx.beginPath();
    ctx.moveTo(hiddenX, pad.top);
    ctx.lineTo(hiddenX, height - pad.bottom);
    ctx.stroke();
    ctx.fillStyle = "#eef7f1";
    ctx.font = "25px Inter, system-ui";
    const labelX = Math.min(hiddenX + 24, width - pad.right - 238);
    ctx.fillText(revealCount ? `${futureTotal - revealCount} candles locked` : "Future candles locked", labelX, pad.top + 52);
  }

  if (!compact && state.activeMode === "trade") {
    drawTradeExecutionLines(ctx, geometry);
  }

  if (!compact && state.revealed) {
    drawCanvasClue(ctx, scenario, geometry);
  }

  if (!compact) {
    ctx.fillStyle = "#eef7f1";
    ctx.font = "28px Inter, system-ui";
    ctx.fillText(`${scenario.market} · ${timeframe} · ${scenario.session || sessionName(scenario)}`, pad.left, 30);
    ctx.fillStyle = state.revealed ? "#56d66d" : "#9db5b9";
    ctx.font = "16px Inter, system-ui";
    ctx.fillText(replayDateLabel(scenario), pad.left + 330, 30);
    ctx.fillStyle = "#386cff";
    ctx.font = "18px Inter, system-ui";
    ctx.fillText("VWAP", width - pad.right - 88, yFor(vwap) - 9);
    ctx.fillStyle = "#56d66d";
    ctx.fillText("Demand Zone", width - pad.right - 150, yFor(demand) + 15);
    ctx.fillStyle = "#ff7770";
    ctx.fillText("Supply Zone", width - pad.right - 142, yFor(supply) + 15);
  }
}

function tradeMarkerValues() {
  return {
    entry: Number(document.getElementById("trade-entry")?.value || 0),
    stop: Number(document.getElementById("trade-stop")?.value || 0),
    target: Number(document.getElementById("trade-target")?.value || 0)
  };
}

function drawTradeExecutionLines(ctx, geometry) {
  const labels = [
    ["entry", "Entry", "#56d66d"],
    ["stop", "Stop", "#ff5f57"],
    ["target", "Target", "#f6c34e"]
  ];
  const values = tradeMarkerValues();
  ctx.save();
  labels.forEach(([key, label, color]) => {
    const value = Number(values[key]);
    if (!Number.isFinite(value) || value <= 0) return;
    const y = geometry.yFor(value);
    if (y < geometry.pad.top - 18 || y > geometry.pad.top + geometry.plotH + 18) return;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = key === state.tradeDragMarker ? 4 : 2;
    ctx.setLineDash(key === "entry" ? [] : [8, 8]);
    ctx.beginPath();
    ctx.moveTo(geometry.pad.left, y);
    ctx.lineTo(geometry.width - geometry.pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "bold 15px Inter, system-ui";
    ctx.fillText(`${label} ${value.toFixed(2)}`, geometry.pad.left + 10, y - 8);
  });
  ctx.restore();
}

function clueCandleIndex(scenario) {
  const pause = pauseCandleIndex(scenario);
  const raw = Number(scenario.clueCandle);
  if (Number.isFinite(raw) && raw >= 0) return Math.max(0, Math.min(pauseCandleIndex(scenario) + futureCandleCount(scenario) - 1, raw));
  return Math.max(4, pause - 2);
}

function drawCanvasClue(ctx, scenario, geometry) {
  const index = Math.min(geometry.candles.length - 1, clueCandleIndex(scenario));
  const candle = geometry.candles[index];
  if (!candle) return;
  const x = geometry.pad.left + index * geometry.xStep + geometry.xStep / 2;
  const y = geometry.yFor(candle.close);
  ctx.save();
  ctx.strokeStyle = "#f6c34e";
  ctx.fillStyle = "rgba(246, 195, 78, 0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 22);
  ctx.lineTo(x + 64, y - 54);
  ctx.stroke();
  ctx.fillStyle = "#ffe6a8";
  ctx.font = "bold 15px Inter, system-ui";
  ctx.fillText("Key clue", Math.min(x + 70, geometry.width - geometry.pad.right - 86), Math.max(geometry.pad.top + 20, y - 56));
  ctx.restore();
}

function drawBand(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y - height / 2, width, height);
}

function drawDashedLine(ctx, x1, y1, x2, y2, color) {
  ctx.save();
  ctx.setLineDash([9, 8]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawChart() {
  drawChartOn(els.chart, getScenario(state.scenarioIndex), state.timeframe, state.revealCount);
  renderCandlePopLayer(getScenario(state.scenarioIndex));
  updateReplayControls();
}

function renderCandlePopLayer(scenario) {
  const layer = document.getElementById("candle-pop-layer");
  if (!layer) return;
  layer.innerHTML = "";
  if (!state.revealed || state.revealCount <= 0 || !scenario) return;

  const geometry = state.chartGeometry;
  const count = Math.min(6, Number(state.revealCount || 0));
  const rand = seededRandom((Number(scenario.seed || 1) * 31) + Number(state.revealCount || 0) * 17);
  for (let index = 0; index < count; index += 1) {
    const candle = document.createElement("span");
    const up = index % 3 !== 1;
    const plotLeft = geometry?.pad?.left ? (geometry.pad.left / geometry.width) * 100 : 12;
    const plotRight = geometry?.pad?.right ? 100 - (geometry.pad.right / geometry.width) * 100 : 88;
    const left = plotLeft + (plotRight - plotLeft) * (0.64 + rand() * 0.3);
    const bottom = 18 + rand() * 52;
    candle.className = `pop-candle ${up ? "up" : "down"}`;
    candle.style.setProperty("--x", `${Math.min(88, Math.max(52, left))}%`);
    candle.style.setProperty("--b", `${bottom}%`);
    candle.style.setProperty("--h", `${28 + rand() * 42}px`);
    candle.style.setProperty("--w", `${56 + rand() * 54}px`);
    candle.style.setProperty("--delay", `${index * 54}ms`);
    candle.innerHTML = "<i></i>";
    layer.appendChild(candle);
  }
}

function drawPreviewCharts() {
  document.querySelectorAll(".mini-chart").forEach((canvas) => {
    const index = Number(canvas.dataset.preview || 0);
    const scenario = getScenario(index);
    drawChartOn(canvas, scenario, index === 2 ? "5m" : "1m", index === 1 ? 18 : 0, true);
  });
}

function updateReplayControls() {
  const maxFuture = futureCandleCount();
  document.getElementById("replay-controls")?.classList.toggle("hidden", !state.revealed);
  document.getElementById("candle-counter").textContent = `${state.revealCount} / ${maxFuture}`;
  document.getElementById("replay-play").textContent = state.replayPlaying ? "Ⅱ" : "▶";
  document.getElementById("replay-step-back").disabled = state.revealCount <= 0;
  document.getElementById("replay-step-forward").disabled = !state.revealed || state.revealCount >= maxFuture;
  document.getElementById("replay-play").disabled = !state.revealed || state.revealCount >= maxFuture;
  document.querySelectorAll("#speed-control button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.speed) === state.replaySpeed);
  });
}

function stopReplay() {
  clearInterval(replayTimer);
  replayTimer = null;
  state.replayPlaying = false;
  document.getElementById("replay-play")?.replaceChildren(document.createTextNode("▶"));
}

function playReplay() {
  const maxFuture = futureCandleCount();
  if (!state.revealed || state.revealCount >= maxFuture) return;
  if (state.replayPlaying) {
    stopReplay();
    updateReplayControls();
    return;
  }

  state.replayPlaying = true;
  updateReplayControls();
  const interval = Math.max(90, 620 / state.replaySpeed);
  replayTimer = setInterval(() => {
    state.revealCount = Math.min(maxFuture, state.revealCount + 1);
    drawChart();
    if (state.revealCount >= maxFuture) stopReplay();
  }, interval);
}

function animateReplay(from = 0) {
  stopReplay();
  state.revealCount = Math.max(0, Math.min(futureCandleCount(), from));
  drawChart();
  playReplay();
}

function renderScenario() {
  const scenario = getScenario(state.scenarioIndex);
  fetchScenarioCommunityStats(scenario.id);
  const completed = completedScenario(scenario);
  const maxFuture = futureCandleCount(scenario);
  state.revealed = Boolean(completed);
  state.revealCount = state.revealed ? maxFuture : 0;
  state.selected = completed?.selected || null;
  state.pendingAnswer = null;
  state.confidence = completed?.confidence || state.confidence || "medium";
  document.querySelectorAll("#confidence-picker button").forEach((button) => {
    button.classList.toggle("active", button.dataset.confidence === state.confidence);
  });
  stopReplay();
  gate.resultClueMarker.classList.toggle("hidden", !state.revealed);

  els.scenarioId.textContent = scenario.scenarioCode;
  els.title.textContent = scenario.title;
  els.meta.textContent = `${scenario.market} · ${replayDateLabel(scenario)} · ${scenario.difficulty}`;
  els.context.textContent = scenario.context;
  els.tags.textContent = scenario.tags.join(" · ");
  els.question.textContent = scenario.question;
  if (state.activeMode === "ranked") els.question.textContent = `Timed: ${scenario.question}`;
  if (state.activeMode === "tape") {
    els.question.textContent = "Fast read: Long, Short, or Flat?";
    els.context.textContent = "Tape Sprint strips the setup down to speed recognition. Make the highest-probability call before the clock runs out.";
  }
  if (state.activeMode === "risklab") {
    els.question.textContent = "Build a risk plan that survives the session.";
    els.context.textContent = "No chart needed. Your job is to keep risk controlled before a futures trade is ever allowed.";
  }
  if (state.activeMode === "liquidityhunt") {
    els.question.textContent = "Where is price most likely to hunt liquidity next?";
    els.context.textContent = "The chart is stripped down into stop pools and magnets. Tap the pool most likely to get swept before the reveal.";
  }
  if (state.activeMode === "candlecrash") {
    els.question.textContent = "Classify the candle burst before the combo breaks.";
    els.context.textContent = "Read candle personality fast: strength, trap, exhaustion, or indecision. Speed plus accuracy builds the combo.";
  }
  if (state.activeMode === "bossfight") {
    els.question.textContent = "Defeat the drawdown boss without breaking rules.";
    els.context.textContent = "Choose the disciplined response across size, loss, and event pressure. The boss punishes emotional action.";
  }
  if (state.activeMode === "newsdesk") {
    els.question.textContent = "Classify the calendar risk before the release.";
    els.context.textContent = "This desk trains macro awareness: which events move which markets, and when standing down is the professional decision.";
  }
  if (state.activeMode === "propescape") {
    els.question.textContent = "Escape the funded account day without breaking rules.";
    els.context.textContent = "Protect the account through contract limits, daily loss limits, news windows, and payout discipline.";
  }
  if (state.activeMode === "trade") els.question.textContent = "Build the highest-quality practice trade.";
  if (state.activeMode === "spot") els.question.textContent = "Where is the key setup forming?";
  if (state.activeMode === "survival") els.question.textContent = "What is your decision as the next candles develop?";
  if (state.activeMode === "notrade") els.question.textContent = "Does this setup deserve a trade?";
  if (state.activeMode === "detective") els.question.textContent = "Which clue matters most?";
  if (state.activeMode === "thesis") els.question.textContent = "Build the complete market thesis.";
  els.status.textContent = state.revealed ? "Future candles revealed" : "Future candles hidden";
  if (els.bookmarkScenario) {
    const saved = progress().bookmarks.includes(scenario.id);
    els.bookmarkScenario.classList.toggle("saved", saved);
    els.bookmarkScenario.title = hasAccess("bookmarks")
      ? (saved ? "Remove bookmark" : "Bookmark scenario")
      : "Upgrade to Coach to bookmark scenarios";
  }

  applyModeUi();
  updateDifficultyMessage(scenario);
  renderDifficultyBadge(scenario);
  renderScenarioPills(scenario);
  renderStreakDots();
  renderTabs();
  renderAnswers();
  renderChartHotspots();
  seedTradeFormFromScenario(scenario);
  updateTradePreview();
  drawChart();
  if (state.revealed) stopDecisionTimer();
  else startDecisionTimer();
  maybeOpenGameWalkthrough(state.activeMode);
}

function renderTabs() {
  els.tabs.innerHTML = "";
  ["1m", "5m", "15m", "1h", "4h"].forEach((timeframe) => {
    const button = document.createElement("button");
    button.textContent = timeframe;
    button.className = timeframe === state.timeframe ? "active" : "";
    button.addEventListener("click", () => {
      state.timeframe = timeframe;
      renderTabs();
      drawChart();
    });
    els.tabs.appendChild(button);
  });
}

function modeName(mode = state.activeMode) {
  const names = {
    tape: "Tape Sprint",
    liquidityhunt: "Liquidity Hunt",
    candlecrash: "Candle Crash",
    bossfight: "Prop Boss Fight",
    risklab: "Risk Lab",
    newsdesk: "News Impact Desk",
    propescape: "Prop Firm Escape",
    replay: "Replay Mode",
    daily: "Daily Challenge",
    ranked: "Ranked Battle",
    trade: "Trade Mode",
    spot: "Spot the Setup",
    survival: "Candle Survival",
    notrade: "No-Trade Challenge",
    detective: "Chart Detective",
    thesis: "Build the Thesis",
    review: "Review Queue"
  };
  return names[mode] || "Replay Mode";
}

function walkthroughStorageKey(mode = state.activeMode) {
  const p = progress();
  const userKey = (p.signup?.email || p.profile?.email || p.username || "guest").toString().toLowerCase();
  return `replayedge:walkthrough:${userKey}:${mode}`;
}

function modeWalkthrough(mode = state.activeMode) {
  const common = {
    replay: {
      icon: "candlestick-chart",
      why: "Replay Mode trains the core ReplayEdge skill: reading a real market moment while the future is hidden, then learning from the reveal.",
      steps: ["Study the visible candles and context first.", "Switch timeframes if you need a bigger-picture read.", "Choose the highest-probability outcome and submit.", "Watch the hidden candles reveal and study the clue you missed or nailed."]
    },
    daily: {
      icon: "calendar-check",
      why: "Daily Challenge builds the habit loop. Everyone gets one focused replay so your progress becomes consistent, not random.",
      steps: ["Open the daily scenario before the reset.", "Make one deliberate decision under the same conditions as everyone else.", "Protect your streak by completing it each day.", "Use the result breakdown to know what to practice tomorrow."]
    },
    ranked: {
      icon: "trophy",
      why: "Ranked Battle adds pressure. It trains you to stay accurate when timing, confidence, and leaderboard position are on the line.",
      steps: ["Read the scenario quickly without overthinking.", "Commit before the timer drains.", "Correct answers earn stronger XP and ranking momentum.", "Misses become practice material instead of random losses."]
    },
    trade: {
      icon: "target",
      why: "Trade Mode teaches structure: entry, stop, target, and risk-to-reward discipline before the replay exposes whether the plan survives.",
      steps: ["Pick the entry area you would actually use.", "Place a stop where the idea is invalidated.", "Set a target that makes the risk worth taking.", "Replay the move and judge the quality of your plan."]
    },
    tape: {
      icon: "zap",
      why: "Tape Sprint builds fast directional recognition. It strips the drill down to Long, Short, or Flat so you train clean first reads.",
      steps: ["Ignore the urge to overanalyze.", "Read momentum, location, and candle rhythm.", "Choose Long, Short, or Flat before time expires.", "Review whether speed helped or hurt your accuracy."]
    },
    liquidityhunt: {
      icon: "crosshair",
      why: "Liquidity Hunt teaches where price is likely to seek stops, magnets, and trapped positions before a cleaner move begins.",
      steps: ["Scan the map for obvious highs, lows, and VWAP magnets.", "Pick the pool most likely to be targeted next.", "Watch the sweep or failure unfold.", "Learn which liquidity clue mattered most."]
    },
    candlecrash: {
      icon: "flame",
      why: "Candle Crash trains candle personality so one big candle does not trick you into reacting too early.",
      steps: ["Watch the candle burst as it appears.", "Classify it as strength, trap, exhaustion, or indecision.", "Keep your combo alive with accurate reads.", "Use the reveal to learn what made the candle real or fake."]
    },
    bossfight: {
      icon: "shield-alert",
      why: "Prop Boss Fight trains rule survival. The enemy is not the market. It is impulse, over-sizing, and breaking account rules.",
      steps: ["Read the account pressure and rule limits.", "Choose the disciplined response, not the exciting one.", "Avoid drawdown boss attacks by protecting risk.", "Win by surviving cleanly, not by forcing trades."]
    },
    risklab: {
      icon: "calculator",
      why: "Risk Lab teaches the math behind staying alive: contracts, stop size, daily loss, and whether a plan fits the account.",
      steps: ["Start with account size and daily loss limit.", "Choose contracts and stop size.", "Check whether max loss stays inside the limit.", "Adjust the plan until risk is controlled."]
    },
    newsdesk: {
      icon: "newspaper",
      why: "News Impact Desk teaches macro awareness so you know when a headline or calendar event can override normal intraday patterns.",
      steps: ["Read the event type and market involved.", "Decide whether it is tradable, risky, or a stand-down moment.", "Match the event to likely volatility behavior.", "Review why the calendar mattered."]
    },
    propescape: {
      icon: "door-open",
      why: "Prop Firm Escape turns funded-account rules into a game. The goal is to keep the account eligible while pressure rises.",
      steps: ["Read the rule constraints before acting.", "Avoid choices that violate daily loss or news rules.", "Preserve payout eligibility through the scenario.", "Treat survival as the win condition."]
    },
    spot: {
      icon: "scan-search",
      why: "Spot the Setup trains visual location. You learn to find the active clue before deciding what the trade should be.",
      steps: ["Inspect the chart for the key area.", "Tap the zone where the setup is forming.", "Reveal whether your location matched the clue.", "Use misses to improve your chart scanning."]
    },
    survival: {
      icon: "heart-pulse",
      why: "Candle Survival trains adaptation. New candles arrive and you must decide whether to hold, change, enter, exit, or do nothing.",
      steps: ["Start with a bias, then stay flexible.", "React to each new candle without panic.", "Protect the combo by choosing the cleanest action.", "Learn when changing your mind is professional."]
    },
    notrade: {
      icon: "hand",
      why: "No-Trade Challenge teaches patience. Many traders lose because they force marginal setups, not because they lack entries.",
      steps: ["Judge whether the setup deserves risk.", "Choose trade or skip based on evidence.", "Get rewarded for passing on low-quality ideas.", "Study what made waiting the better read."]
    },
    detective: {
      icon: "search-check",
      why: "Chart Detective trains clue priority. It forces you to identify the single most important piece of evidence.",
      steps: ["Read the chart like a case file.", "Choose the clue that best explains the setup.", "Reveal which clue drove the move.", "Use the breakdown to sharpen pattern recognition."]
    },
    thesis: {
      icon: "clipboard-list",
      why: "Build the Thesis trains complete thinking: bias, invalidation, context, and execution quality in one structured read.",
      steps: ["Build a market bias from the evidence.", "Define what would invalidate that idea.", "Choose the best execution path.", "Compare your thesis against the reveal."]
    },
    review: {
      icon: "rotate-ccw",
      why: "Review Queue turns missed scenarios into targeted practice so your weakest reads become your fastest improvements.",
      steps: ["Replay only scenarios you previously missed.", "Focus on the clue that fooled you.", "Try the same pattern again with a cleaner read.", "Clear the queue by proving improvement."]
    }
  };
  return common[mode] || common.replay;
}

function ensureGameWalkthroughModal() {
  let modal = document.getElementById("game-walkthrough-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "game-walkthrough-modal";
  modal.className = "game-walkthrough-modal hidden";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="game-walkthrough-card" role="dialog" aria-modal="true" aria-labelledby="game-walkthrough-title">
      <button class="game-walkthrough-close" id="game-walkthrough-close" type="button" aria-label="Close walkthrough">
        <i data-lucide="x"></i>
      </button>
      <div class="game-walkthrough-head">
        <span class="game-walkthrough-icon" id="game-walkthrough-icon"><i data-lucide="gamepad-2"></i></span>
        <div>
          <p>How this game works</p>
          <h2 id="game-walkthrough-title">Replay Mode</h2>
        </div>
      </div>
      <p class="game-walkthrough-why" id="game-walkthrough-why"></p>
      <div class="game-walkthrough-steps" id="game-walkthrough-steps"></div>
      <button class="game-walkthrough-start" id="game-walkthrough-start" type="button">Got it, start training</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("#game-walkthrough-close")?.addEventListener("click", closeGameWalkthrough);
  modal.querySelector("#game-walkthrough-start")?.addEventListener("click", closeGameWalkthrough);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeGameWalkthrough();
  });
  return modal;
}

function openGameWalkthrough(mode = state.activeMode, options = {}) {
  const modal = ensureGameWalkthroughModal();
  const info = modeWalkthrough(mode);
  const title = modal.querySelector("#game-walkthrough-title");
  const why = modal.querySelector("#game-walkthrough-why");
  const icon = modal.querySelector("#game-walkthrough-icon");
  const steps = modal.querySelector("#game-walkthrough-steps");
  if (title) title.textContent = modeName(mode);
  if (why) why.textContent = info.why;
  if (icon) icon.innerHTML = `<i data-lucide="${info.icon}"></i>`;
  if (steps) {
    steps.innerHTML = info.steps.map((step, index) => `
      <div class="game-walkthrough-step">
        <b>${String(index + 1).padStart(2, "0")}</b>
        <span>${step}</span>
      </div>
    `).join("");
  }
  modal.dataset.mode = mode;
  modal.dataset.forced = options.forced ? "true" : "false";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  if (window.lucide) window.lucide.createIcons();
}

function closeGameWalkthrough() {
  const modal = document.getElementById("game-walkthrough-modal");
  if (!modal) return;
  const mode = modal.dataset.mode || state.activeMode;
  localStorage.setItem(walkthroughStorageKey(mode), "1");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function maybeOpenGameWalkthrough(mode = state.activeMode) {
  if (state.currentView !== "game") return;
  if (localStorage.getItem(walkthroughStorageKey(mode))) return;
  window.setTimeout(() => {
    if (state.currentView === "game" && state.activeMode === mode && !localStorage.getItem(walkthroughStorageKey(mode))) {
      openGameWalkthrough(mode);
    }
  }, 320);
}

function scenarioTrustLabel(scenario) {
  if (scenario.isRealReplay || scenario.realReplay || scenario.verified || scenario.source === "historical") return "Verified replay";
  if (scenario.personalized || String(scenario.id || "").includes("personal")) return "Personalized drill";
  if (scenario.externalId || scenario.source === "databento") return "Data-backed replay";
  return "Curated replay";
}

function scenarioTrustScore(scenario) {
  let score = 72;
  if (scenario.market) score += 4;
  if (scenario.pattern) score += 4;
  if (scenario.explanation) score += 5;
  if (scenario.coachExplanation || scenario.learningMoment) score += 5;
  if (scenario.clueCandle || scenario.clue) score += 4;
  if (scenario.isRealReplay || scenario.realReplay || scenario.verified || scenario.source === "historical") score += 8;
  return Math.min(98, score);
}

function scenarioTrustStrip(scenario) {
  const trust = scenarioTrustScore(scenario);
  return `
    <div class="verified-replay-strip">
      <span><i data-lucide="badge-check"></i>${scenarioTrustLabel(scenario)}</span>
      <span><i data-lucide="shield-check"></i>${trust}% scenario quality</span>
      <span><i data-lucide="book-open-check"></i>Clue reviewed after reveal</span>
    </div>
  `;
}

function resultShareText(scenario, correct, earned) {
  const p = progress();
  const rank = getUserPlan() === "free" ? "Guest" : rankFromXp(p.xp);
  const site = location.protocol === "file:" ? "replayedge.io" : location.origin;
  return `ReplayEdge replay result: ${correct ? "correct read" : "lesson logged"} on ${scenario.market} ${scenario.pattern}. ${correct ? `+${earned} XP` : "Missed clue added to review"}. Rank: ${rank}. Train blind replays: ${site}`;
}

function resultShareMomentMarkup(scenario, correct, earned) {
  return `
    <div class="result-share-moment">
      <div>
        <span>${correct ? "Shareable win" : "Training receipt"}</span>
        <strong>${correct ? "Show the read you nailed." : "Save the clue you missed."}</strong>
        <p>${scenario.market} · ${scenario.pattern} · ${correct ? `+${earned} XP` : "review drill"}</p>
      </div>
      <button id="result-copy-share" type="button">Copy Result</button>
    </div>
  `;
}

function sessionName(scenario) {
  if (/8:|9:|10:/.test(scenario.time)) return "New York Open";
  if (/11:|12:/.test(scenario.time)) return "Midday Session";
  if (/1:|2:/.test(scenario.time)) return "Afternoon Session";
  return "Replay Session";
}

function renderScenarioPills(scenario) {
  if (!els.scenarioPills) return;
  const difficulty = scenario.difficulty.toLowerCase();
  els.scenarioPills.innerHTML = `
    <span><i data-lucide="activity"></i>${scenario.market}</span>
    <span class="difficulty-pill ${difficulty}"><i data-lucide="gauge"></i>${scenario.difficulty}</span>
    <span><i data-lucide="clock-3"></i>${scenario.session || sessionName(scenario)}</span>
    <span><i data-lucide="scan-line"></i>Key level event</span>
    <span><i data-lucide="gamepad-2"></i>${modeName()}</span>
    <span class="verified-replay-pill"><i data-lucide="badge-check"></i>${scenarioTrustLabel(scenario)}</span>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function renderStreakDots() {
  if (!els.streakDots) return;
  const current = Math.min(5, progress().streak || 0);
  els.streakDots.innerHTML = Array.from({ length: 5 }, (_, index) =>
    `<span class="${index < current ? "filled" : ""}"></span>`
  ).join("");
}

function currentCorrectAnswer(scenario = getScenario(state.scenarioIndex)) {
  if (state.activeMode === "tape") return directionAnswer(scenario);
  if (state.activeMode === "notrade") return noTradeAnswer(scenario);
  if (state.activeMode === "detective") return detectiveOptions(scenario)[0];
  if (state.activeMode === "survival") return survivalAnswer(scenario, state.survivalRound);
  return scenario.correctAnswer;
}

function currentAnswerOptions(scenario = getScenario(state.scenarioIndex)) {
  if (state.activeMode === "tape") return ["Long", "Short", "Flat"];
  if (state.activeMode === "notrade") return ["Take the long", "Take the short", "Skip the trade"];
  if (state.activeMode === "detective") return detectiveOptions(scenario);
  if (state.activeMode === "survival") return ["Hold bias", "Change bias", "Enter", "Exit", "Do nothing"];
  return scenario.answers;
}

function selectPendingAnswer(answer) {
  if (state.revealed) return;
  state.pendingAnswer = answer;
  els.answers.querySelectorAll(".answer-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.answer === answer);
  });
  if (els.submitAnswer) {
    els.submitAnswer.disabled = false;
    els.submitAnswer.classList.remove("hidden");
    els.submitAnswer.textContent = "Submit Answer";
  }
}

function submitPendingAnswer() {
  if (!state.pendingAnswer || state.revealed) return;
  const scenario = getScenario(state.scenarioIndex);
  submitAnswer(state.pendingAnswer, currentCorrectAnswer(scenario), { activeSelection: true });
}

function difficultyDistributionPercent(scenario) {
  const communityRate = communityCorrectRate(scenario);
  if (communityRate !== null) return communityRate;
  if (scenario.difficulty === "Hard") return 32;
  if (scenario.difficulty === "Medium") return 54;
  return 74;
}

function decorateAnswerDistribution(button, item) {
  const wrap = document.createElement("span");
  wrap.className = "answer-distribution-bar";
  wrap.innerHTML = `<b>${item.percent}% chose this</b><i></i>`;
  button.appendChild(wrap);
  requestAnimationFrame(() => {
    wrap.querySelector("i").style.width = `${item.percent}%`;
  });
}

function renderAnswers() {
  const scenario = getScenario(state.scenarioIndex);
  els.answers.innerHTML = "";
  els.submitAnswer?.classList.add("hidden");
  if (els.submitAnswer) els.submitAnswer.disabled = true;

  if (!hasPaidPlan() && freePlaysLeft() <= 0 && !state.revealed) {
    openPaywall();
    ["Free plays used", "Choose Player", "Choose Coach", "Come back later"].forEach((label) => {
      const button = document.createElement("button");
      button.className = "answer-button";
      button.textContent = label;
      button.disabled = true;
      els.answers.appendChild(button);
    });
    return;
  }

  if (state.activeMode === "trade" || state.activeMode === "thesis" || state.activeMode === "spot") {
    if (state.revealed) {
      const completed = completedScenario(scenario);
      showResult(completed.correct, completed.earned, completed);
    } else {
      els.resultPanel.classList.add("hidden");
      gate.resultBreakdown.classList.add("hidden");
    }
    return;
  }

  if (["risklab", "newsdesk", "propescape", "liquidityhunt", "candlecrash", "bossfight"].includes(state.activeMode)) {
    renderEducationGame(scenario);
    return;
  }

  let answers = currentAnswerOptions(scenario);
  let correctAnswer = currentCorrectAnswer(scenario);

  if (state.activeMode === "survival") {
    document.getElementById("survival-round").textContent = Math.min(5, state.survivalRound + 1);
    document.getElementById("survival-progress").style.width = `${(state.survivalRound / 5) * 100}%`;
    document.getElementById("survival-score").textContent = `${state.survivalCorrect} strong decision${state.survivalCorrect === 1 ? "" : "s"}`;
  }

  const completed = state.revealed
    ? completedScenario(scenario) || progress().completed[completionKey(scenario.id, state.activeMode)]
    : null;
  const distribution = state.revealed && completed ? optionDistribution(scenario, completed) : [];

  answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.dataset.answer = answer;
    button.innerHTML = `<span class="answer-main"><b>${String.fromCharCode(65 + index)}</b><span>${answer}</span></span>`;
    button.disabled = state.revealed;

    if (state.revealed) {
      if (answer === correctAnswer) button.classList.add("correct");
      if (answer === state.selected && answer !== correctAnswer) button.classList.add("wrong");
      if (answer !== correctAnswer && answer !== state.selected) button.classList.add("dimmed");
      const item = distribution.find((row) => row.label === answer);
      if (item) decorateAnswerDistribution(button, item);
    }

    button.addEventListener("click", () => {
      if (state.activeMode === "survival") submitSurvivalDecision(answer);
      else selectPendingAnswer(answer);
    });
    els.answers.appendChild(button);
  });

  if (state.revealed) {
    els.submitAnswer?.classList.add("hidden");
    showResult(completed.correct, completed.earned, completed);
  } else {
    els.resultPanel.classList.add("hidden");
    gate.resultBreakdown.classList.add("hidden");
    if (canUseDecisionTimer() && els.submitAnswer) {
      els.submitAnswer.disabled = true;
      els.submitAnswer.classList.remove("hidden");
      els.submitAnswer.textContent = "Submit Answer";
    }
  }
}

function educationScenarioSeed(scenario) {
  return scenario.seed + stringSeed(state.activeMode) + state.scenarioIndex;
}

function renderEducationGame(scenario) {
  els.resultPanel.classList.toggle("hidden", !state.revealed);
  gate.resultBreakdown.classList.toggle("hidden", !state.revealed);
  if (state.revealed) {
    const completed = completedScenario(scenario);
    showResult(completed.correct, completed.earned, completed);
    return;
  }

  if (state.activeMode === "risklab") renderRiskLab(scenario);
  if (state.activeMode === "liquidityhunt") renderLiquidityHunt(scenario);
  if (state.activeMode === "candlecrash") renderCandleCrash(scenario);
  if (state.activeMode === "bossfight") renderBossFight(scenario);
  if (state.activeMode === "newsdesk") renderNewsDesk(scenario);
  if (state.activeMode === "propescape") renderPropEscape(scenario);
}

function liquidityTargetForScenario(scenario) {
  const text = `${scenario.pattern || ""} ${scenario.correctAnswer || ""} ${scenario.explanation || ""} ${(scenario.tags || []).join(" ")}`.toLowerCase();
  if (text.includes("below") || text.includes("low") || text.includes("sell-side") || text.includes("support")) return "Sell-side lows";
  if (text.includes("vwap") || text.includes("reclaim") || text.includes("magnet")) return "VWAP magnet";
  if (text.includes("range") || text.includes("chop") || text.includes("midpoint")) return "Range midpoint";
  return "Buy-side highs";
}

function renderArcadeCandles(count = 8, seed = 1) {
  const rand = seededRandom(seed || 1);
  return Array.from({ length: count }, (_, index) => {
    const up = rand() > 0.38;
    const height = 46 + Math.round(rand() * 92);
    const wick = height + 24 + Math.round(rand() * 56);
    const delay = Math.round(index * 90 + rand() * 80);
    const left = 10 + index * (80 / Math.max(1, count - 1));
    const top = 24 + Math.round(rand() * 25);
    return `<i class="arcade-candle ${up ? "up" : "down"}" style="--h:${height}px;--w:${wick}px;--x:${left}%;--y:${top}%;--delay:${delay}ms"><b></b><em></em><span></span></i>`;
  }).join("");
}

function arcadePriceBase(scenario) {
  if (scenario.market === "NQ") return 19840 + (scenario.seed % 320);
  if (scenario.market === "ES") return 5480 + (scenario.seed % 90);
  if (scenario.market === "CL") return 72 + (scenario.seed % 9);
  if (scenario.market === "GC") return 2320 + (scenario.seed % 180);
  return 64000 + (scenario.seed % 4200);
}

function renderArcadeChartChrome(scenario, label = "1m") {
  const base = arcadePriceBase(scenario);
  const step = scenario.market === "CL" ? 0.25 : scenario.market === "BTC" ? 180 : scenario.market === "NQ" ? 22.5 : 4.25;
  const prices = [2, 1, 0, -1, -2].map((offset) => base + offset * step);
  const times = ["09:30", "09:45", "10:00", "10:15", "10:30"];
  const rand = seededRandom((scenario.seed || 1) + 914);
  const volumeBars = Array.from({ length: 14 }, (_, index) => {
    const up = rand() > 0.42;
    const height = 18 + Math.round(rand() * 46);
    const delay = Math.round(index * 32);
    return `<i class="${up ? "up" : "down"}" style="--h:${height}px;--delay:${delay}ms"></i>`;
  }).join("");
  return `
    <div class="arcade-chart-header">
      <span>${scenario.market} · ${label}</span>
      <b>${state.revealed ? replayDateLabel(scenario) : "Date hidden"}</b>
    </div>
    <div class="arcade-price-axis">
      ${prices.map((price) => `<span>${scenario.market === "CL" ? price.toFixed(2) : price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>`).join("")}
    </div>
    <div class="arcade-time-axis">
      ${times.map((time) => `<span>${time}</span>`).join("")}
    </div>
    <div class="arcade-volume-bars" aria-hidden="true">${volumeBars}</div>
    <span class="arcade-crosshair vertical"></span>
    <span class="arcade-crosshair horizontal"></span>
  `;
}

function renderLiquidityHunt(scenario) {
  const target = liquidityTargetForScenario(scenario);
  const pools = ["Buy-side highs", "Sell-side lows", "VWAP magnet", "Range midpoint"];
  els.answers.innerHTML = `
    <div class="education-arena arcade-board liquidity-hunt-board">
      <section class="education-stage arcade-stage">
        <div class="education-stage-copy">
          <span>Liquidity Hunt</span>
          <strong>Find the stop pool before the sweep.</strong>
          <p>Price often moves toward obvious liquidity before the real move. Tap the pool most likely to get hunted next.</p>
        </div>
        <div class="arcade-chart-stage liquidity-map" aria-label="Animated liquidity hunt map">
          <div class="arcade-grid"></div>
          ${renderArcadeChartChrome(scenario, "1m")}
          ${renderArcadeCandles(8, educationScenarioSeed(scenario))}
          <span class="liquidity-line vwap">VWAP</span>
          ${pools.map((pool, index) => `<button class="liquidity-pool pool-${index}" type="button" data-pool="${pool}"><b>${pool}</b><small>Tap target</small></button>`).join("")}
          <div class="liquidity-sweep-beam"></div>
        </div>
      </section>
      <section class="education-controls arcade-controls">
        <div class="education-brief compact">
          <span>Mission</span>
          <strong>Hunt before the crowd sees it</strong>
          <p>Look for the most obvious pool. Good traders learn where pain is likely sitting.</p>
        </div>
        <div class="arcade-score-card"><span>Target type</span><b>Hidden until reveal</b></div>
        <div class="education-meter"><span>Goal</span><b>Tap the liquidity pool that best matches the scenario's strongest clue.</b></div>
      </section>
    </div>
  `;
  els.answers.querySelectorAll(".liquidity-pool").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.dataset.pool;
      button.classList.add("selected");
      finishAttempt({
        answer,
        correct: answer === target,
        earned: answer === target ? 150 : 20,
        correctAnswer: target,
        metadata: { educationGame: "liquidityhunt", target }
      });
    });
  });
}

function candleCrashAnswer(scenario) {
  const text = `${scenario.pattern || ""} ${scenario.correctAnswer || ""} ${scenario.explanation || ""}`.toLowerCase();
  if (text.includes("failed") || text.includes("fakeout") || text.includes("sweep") || text.includes("trap")) return "Trap candle";
  if (text.includes("continuation") || text.includes("breakout") || text.includes("drive")) return "Strength candle";
  if (text.includes("exhaust") || text.includes("weak") || text.includes("divergence")) return "Exhaustion candle";
  return "Indecision candle";
}

function renderCandleCrash(scenario) {
  const correctAnswer = candleCrashAnswer(scenario);
  const options = ["Strength candle", "Trap candle", "Exhaustion candle", "Indecision candle"];
  els.answers.innerHTML = `
    <div class="education-arena arcade-board candle-crash-board">
      <section class="education-stage arcade-stage">
        <div class="education-stage-copy">
          <span>Candle Crash</span>
          <strong>Classify the burst. Keep the combo alive.</strong>
          <p>A fast candle can mean strength, trap, exhaustion, or nothing at all. Read the personality before reacting.</p>
        </div>
        <div class="candle-crash-lane" aria-label="Animated candle crash lane">
          ${renderArcadeChartChrome(scenario, "5m")}
          <div class="combo-badge">COMBO READY</div>
          ${renderArcadeCandles(10, educationScenarioSeed(scenario) + 22)}
          <span class="crash-zone">IMPACT ZONE</span>
          <span class="crash-spark s1"></span><span class="crash-spark s2"></span><span class="crash-spark s3"></span>
        </div>
      </section>
      <section class="education-controls arcade-controls">
        <div class="education-brief compact">
          <span>Quick Read</span>
          <strong>What kind of candle burst is this?</strong>
          <p>Choose the behavior, not the color. The best answer matches context plus follow-through.</p>
        </div>
        <div class="arcade-choice-grid">
          ${options.map((option) => `<button class="arcade-choice" type="button" data-answer="${option}">${option}</button>`).join("")}
        </div>
        <div class="education-meter"><span>Goal</span><b>Build reflexes without turning every big candle into a trade signal.</b></div>
      </section>
    </div>
  `;
  els.answers.querySelectorAll(".arcade-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.dataset.answer;
      button.classList.add(answer === correctAnswer ? "correct" : "wrong");
      finishAttempt({
        answer,
        correct: answer === correctAnswer,
        earned: answer === correctAnswer ? 145 : 20,
        correctAnswer,
        metadata: { educationGame: "candlecrash", classification: correctAnswer }
      });
    });
  });
}

function bossFightAnswer(scenario) {
  const text = `${scenario.pattern || ""} ${scenario.context || ""} ${(scenario.tags || []).join(" ")}`.toLowerCase();
  if (text.includes("cpi") || text.includes("fomc") || text.includes("news") || text.includes("hard")) return "Stand down";
  if (text.includes("failed") || text.includes("sweep") || scenario.bias === "reversal") return "Cut size";
  if (text.includes("chop") || text.includes("range")) return "Wait for rules";
  return "Take partials";
}

function renderBossFight(scenario) {
  const correctAnswer = bossFightAnswer(scenario);
  const options = ["Cut size", "Stand down", "Wait for rules", "Take partials"];
  els.answers.innerHTML = `
    <div class="education-arena arcade-board boss-fight-board">
      <section class="education-stage arcade-stage">
        <div class="education-stage-copy">
          <span>Prop Boss Fight</span>
          <strong>Beat the rule-breaking boss.</strong>
          <p>The boss attacks with size temptation, news risk, drawdown pressure, and payout greed. Pick the professional counter.</p>
        </div>
        <div class="boss-arena" aria-label="Animated prop firm boss fight">
          <div class="boss-health"><span>Boss HP</span><i></i></div>
          <div class="player-health"><span>Account</span><i></i></div>
          <div class="boss-monster"><b></b><i></i><em></em></div>
          <div class="boss-attack attack-one">Drawdown</div>
          <div class="boss-attack attack-two">FOMO</div>
          <div class="boss-attack attack-three">News</div>
        </div>
      </section>
      <section class="education-controls arcade-controls">
        <div class="education-brief compact">
          <span>Counter Move</span>
          <strong>Protect eligibility first</strong>
          <p>Boss fights are won by staying alive. Choose the response that keeps the account tradable.</p>
        </div>
        <div class="arcade-choice-grid">
          ${options.map((option) => `<button class="arcade-choice boss-choice" type="button" data-answer="${option}">${option}</button>`).join("")}
        </div>
        <div class="education-meter"><span>Goal</span><b>Defeat the boss by respecting the rulebook under pressure.</b></div>
      </section>
    </div>
  `;
  els.answers.querySelectorAll(".arcade-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.dataset.answer;
      button.classList.add(answer === correctAnswer ? "correct" : "wrong");
      finishAttempt({
        answer,
        correct: answer === correctAnswer,
        earned: answer === correctAnswer ? 175 : 25,
        correctAnswer,
        metadata: { educationGame: "bossfight", counter: correctAnswer }
      });
    });
  });
}

function renderRiskLab(scenario) {
  const account = 50000 + (educationScenarioSeed(scenario) % 3) * 25000;
  const dailyLoss = Math.round(account * 0.03);
  const tickValue = scenario.market === "NQ" ? 5 : scenario.market === "ES" ? 12.5 : scenario.market === "CL" ? 10 : 10;
  els.answers.innerHTML = `
    <div class="education-arena risk-lab-board">
      <section class="education-stage">
        <div class="education-stage-copy">
          <span>Risk Control Console</span>
          <strong>$${account.toLocaleString()} practice account</strong>
          <p>Move the plan until the account stays protected. The goal is not bravery; it is survival math.</p>
        </div>
        <div class="risk-console">
          <div class="risk-orb" id="risk-orb">
            <b id="risk-percent">0.00%</b>
            <span>Account risk</span>
          </div>
          <div class="risk-needle-wrap"><i id="risk-needle"></i></div>
          <div class="risk-readouts">
            <span><b id="risk-dollars">$0</b>Trade risk</span>
            <span><b>$${dailyLoss.toLocaleString()}</b>Daily limit</span>
            <span><b>$${tickValue}</b>Tick value</span>
          </div>
        </div>
      </section>
      <section class="education-controls">
        <div class="education-brief compact">
          <span>Build The Plan</span>
          <strong>Keep the meter green</strong>
          <p>Risk must stay below 1% of account, below 40% of daily loss, and inside your own risk budget.</p>
        </div>
        <label><span>Contracts</span><input id="risk-contracts" type="range" min="1" max="10" value="2"><b id="risk-contracts-value">2</b></label>
        <label><span>Stop size in ticks</span><input id="risk-ticks" type="range" min="4" max="80" value="18"><b id="risk-ticks-value">18</b></label>
        <label><span>Max risk allowed today</span><input id="risk-budget" type="range" min="100" max="${dailyLoss}" value="${Math.round(account * 0.01)}"><b id="risk-budget-value">$${Math.round(account * 0.01).toLocaleString()}</b></label>
        <div class="education-meter" id="risk-meter-copy"><span>Goal</span><b>Keep trade risk under 1% and under 40% of daily loss.</b></div>
        <button class="primary-button game-submit" id="submit-risk-lab" type="button">Check Risk Plan</button>
      </section>
    </div>
  `;
  const syncRiskLab = () => updateRiskLabVisual(account, dailyLoss, tickValue);
  document.querySelectorAll("#risk-contracts, #risk-ticks, #risk-budget").forEach((input) => {
    input.addEventListener("input", syncRiskLab);
  });
  syncRiskLab();
  document.getElementById("submit-risk-lab").addEventListener("click", () => {
    const contracts = Number(document.getElementById("risk-contracts").value);
    const ticks = Number(document.getElementById("risk-ticks").value);
    const budget = Number(document.getElementById("risk-budget").value);
    const tradeRisk = contracts * ticks * tickValue;
    const correct = tradeRisk <= account * 0.01 && tradeRisk <= dailyLoss * 0.4 && tradeRisk <= budget;
    finishAttempt({
      answer: `$${Math.round(tradeRisk).toLocaleString()} planned risk`,
      correct,
      earned: correct ? 155 : 25,
      correctAnswer: "Risk under 1% account and 40% of daily loss",
      metadata: { educationGame: "risklab", tradeRisk, account, dailyLoss }
    });
  });
}

function renderNewsDesk(scenario) {
  const events = [
    { name: "CPI inflation release", risk: "High", market: "NQ", action: "Wait" },
    { name: "FOMC rate decision", risk: "High", market: "ES", action: "Wait" },
    { name: "Crude oil inventories", risk: "Medium", market: "CL", action: "Reduce Size" },
    { name: "Fed speaker midday", risk: "Medium", market: "NQ", action: "Reduce Size" },
    { name: "No major data", risk: "Low", market: "ES", action: "Normal Practice" }
  ];
  const event = events[educationScenarioSeed(scenario) % events.length];
  els.answers.innerHTML = `
    <div class="education-arena news-desk-board">
      <section class="education-stage">
        <div class="education-stage-copy">
          <span>Macro Control Room</span>
          <strong>${event.name}</strong>
          <p>Read the event before reading price. The mission is to classify risk, affected market, and whether action should slow down.</p>
        </div>
        <div class="news-board">
          <div class="news-event-card">
            <small>Incoming Event</small>
            <b>${event.name}</b>
            <span id="news-threat-label">Awaiting desk read</span>
          </div>
          <div class="risk-lanes" id="risk-lanes">
            <span data-risk="Low">Low</span>
            <span data-risk="Medium">Medium</span>
            <span data-risk="High">High</span>
          </div>
          <div class="market-impact-grid" id="market-impact-grid">
            ${["NQ", "ES", "CL", "GC", "BTC"].map((market) => `<span data-market="${market}">${market}</span>`).join("")}
          </div>
        </div>
      </section>
      <section class="education-controls">
        <div class="education-brief compact">
          <span>Desk Read</span>
          <strong>Classify the release</strong>
          <p>Good traders know when the environment is too unstable before they care about a setup.</p>
        </div>
        <label><span>Volatility risk</span><select id="news-risk"><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label><span>Most affected market</span><select id="news-market"><option>NQ</option><option>ES</option><option>CL</option><option>GC</option><option>BTC</option></select></label>
        <label><span>Best pre-release action</span><select id="news-action"><option>Normal Practice</option><option>Reduce Size</option><option>Wait</option></select></label>
        <div class="education-meter"><span>Goal</span><b>Identify volatility first, then decide whether action is even appropriate.</b></div>
        <button class="primary-button game-submit" id="submit-news-desk" type="button">Submit Desk Read</button>
      </section>
    </div>
  `;
  const syncNewsDesk = () => updateNewsDeskVisual();
  document.querySelectorAll("#news-risk, #news-market, #news-action").forEach((input) => input.addEventListener("input", syncNewsDesk));
  syncNewsDesk();
  document.getElementById("submit-news-desk").addEventListener("click", () => {
    const risk = document.getElementById("news-risk").value;
    const market = document.getElementById("news-market").value;
    const action = document.getElementById("news-action").value;
    const points = Number(risk === event.risk) + Number(market === event.market) + Number(action === event.action);
    finishAttempt({
      answer: `${risk} risk · ${market} · ${action}`,
      correct: points >= 2,
      earned: points === 3 ? 165 : points === 2 ? 95 : 20,
      correctAnswer: `${event.risk} risk · ${event.market} · ${event.action}`,
      metadata: { educationGame: "newsdesk", event: event.name, components: points }
    });
  });
}

function renderPropEscape(scenario) {
  const startBalance = 50000;
  const dayLoss = 1250;
  const maxContracts = scenario.market === "NQ" ? 3 : 5;
  els.answers.innerHTML = `
    <div class="education-arena prop-escape-board">
      <section class="education-stage">
        <div class="education-stage-copy">
          <span>Rules Escape Room</span>
          <strong>$${startBalance.toLocaleString()} evaluation day</strong>
          <p>Escape by protecting the rulebook. One bad choice can lock the account before skill ever matters.</p>
        </div>
        <div class="prop-path" id="prop-path">
          <span class="complete"><b>1</b>Open</span>
          <span><b>2</b>Size</span>
          <span><b>3</b>Drawdown</span>
          <span><b>4</b>News</span>
          <span><b>5</b>Close</span>
        </div>
        <div class="prop-health">
          <div><small>Daily loss limit</small><b>$${dayLoss.toLocaleString()}</b></div>
          <div><small>Max contracts</small><b>${maxContracts}</b></div>
          <div><small>News rule</small><b>Stand down</b></div>
        </div>
      </section>
      <section class="education-controls">
        <div class="education-brief compact">
          <span>Survival Choices</span>
          <strong>Do not break the rules</strong>
          <p>Winning the escape room means staying eligible. Rule safety beats action.</p>
        </div>
        <label><span>Contracts to use</span><input id="prop-contracts" type="range" min="1" max="10" value="${Math.max(1, maxContracts - 1)}"><b id="prop-contracts-value">${Math.max(1, maxContracts - 1)}</b></label>
        <label><span>Stop trading after loss reaches</span><input id="prop-stop" type="range" min="100" max="${dayLoss}" value="700"><b id="prop-stop-value">$700</b></label>
        <label><span>News window decision</span><select id="prop-news"><option>Trade normally</option><option>Cut size in half</option><option>Stand down</option></select></label>
        <div class="education-meter" id="prop-meter-copy"><span>Goal</span><b>Escape by respecting rule limits before chasing payout progress.</b></div>
        <button class="primary-button game-submit" id="submit-prop-escape" type="button">Run Rule Check</button>
      </section>
    </div>
  `;
  const syncPropEscape = () => updatePropEscapeVisual(maxContracts, dayLoss);
  document.querySelectorAll("#prop-contracts, #prop-stop, #prop-news").forEach((input) => input.addEventListener("input", syncPropEscape));
  syncPropEscape();
  document.getElementById("submit-prop-escape").addEventListener("click", () => {
    const contracts = Number(document.getElementById("prop-contracts").value);
    const stop = Number(document.getElementById("prop-stop").value);
    const news = document.getElementById("prop-news").value;
    const correct = contracts <= maxContracts && stop <= dayLoss * 0.75 && news === "Stand down";
    finishAttempt({
      answer: `${contracts} contracts · stop at $${stop} · ${news}`,
      correct,
      earned: correct ? 170 : 25,
      correctAnswer: `${maxContracts} or fewer contracts · stop before $${Math.round(dayLoss * 0.75)} · Stand down`,
      metadata: { educationGame: "propescape", contracts, stop, news }
    });
  });
}

function updateRiskLabVisual(account, dailyLoss, tickValue) {
  const contractsInput = document.getElementById("risk-contracts");
  const ticksInput = document.getElementById("risk-ticks");
  const budgetInput = document.getElementById("risk-budget");
  const contracts = Number(contractsInput?.value || 0);
  const ticks = Number(ticksInput?.value || 0);
  const budget = Number(budgetInput?.value || 0);
  const tradeRisk = contracts * ticks * tickValue;
  const accountRisk = account ? (tradeRisk / account) * 100 : 0;
  const dailyUsage = dailyLoss ? (tradeRisk / dailyLoss) * 100 : 0;
  const safe = accountRisk <= 1 && dailyUsage <= 40 && tradeRisk <= budget;
  const caution = !safe && accountRisk <= 1.5 && dailyUsage <= 60;
  const orb = document.getElementById("risk-orb");
  const needle = document.getElementById("risk-needle");
  const copy = document.getElementById("risk-meter-copy");
  const contractsValue = document.getElementById("risk-contracts-value");
  const ticksValue = document.getElementById("risk-ticks-value");
  const budgetValue = document.getElementById("risk-budget-value");
  const percentValue = document.getElementById("risk-percent");
  const dollarsValue = document.getElementById("risk-dollars");

  if (contractsValue) contractsValue.textContent = contracts;
  if (ticksValue) ticksValue.textContent = ticks;
  if (budgetValue) budgetValue.textContent = `$${budget.toLocaleString()}`;
  if (percentValue) percentValue.textContent = `${accountRisk.toFixed(2)}%`;
  if (dollarsValue) dollarsValue.textContent = `$${Math.round(tradeRisk).toLocaleString()}`;
  orb?.classList.toggle("safe", safe);
  orb?.classList.toggle("caution", caution);
  orb?.classList.toggle("danger", !safe && !caution);
  if (needle) needle.style.transform = `rotate(${Math.min(132, Math.max(-132, -132 + accountRisk * 90))}deg)`;
  if (copy) {
    copy.classList.toggle("safe", safe);
    copy.classList.toggle("danger", !safe);
    const copyText = copy.querySelector("b");
    if (copyText) {
      copyText.textContent = safe
        ? "Plan accepted: risk is controlled and the trade has room to be wrong without wrecking the day."
        : `Plan at risk: $${Math.round(tradeRisk).toLocaleString()} uses ${dailyUsage.toFixed(0)}% of the daily loss limit.`;
    }
  }
}

function updateNewsDeskVisual() {
  const risk = document.getElementById("news-risk")?.value || "Low";
  const market = document.getElementById("news-market")?.value || "NQ";
  const action = document.getElementById("news-action")?.value || "Normal Practice";
  document.querySelectorAll("#risk-lanes span").forEach((lane) => {
    const active = lane.dataset.risk === risk;
    lane.classList.toggle("active", active);
    lane.classList.toggle("high", active && lane.dataset.risk === "High");
    lane.classList.toggle("medium", active && lane.dataset.risk === "Medium");
  });
  document.querySelectorAll("#market-impact-grid span").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.market === market);
  });
  const label = document.getElementById("news-threat-label");
  if (label) label.textContent = `${risk} risk · ${market} focus · ${action}`;
}

function updatePropEscapeVisual(maxContracts, dayLoss) {
  const contracts = Number(document.getElementById("prop-contracts")?.value || 0);
  const stop = Number(document.getElementById("prop-stop")?.value || 0);
  const news = document.getElementById("prop-news")?.value || "Trade normally";
  const sizeOk = contracts <= maxContracts;
  const lossOk = stop <= dayLoss * 0.75;
  const newsOk = news === "Stand down";
  const contractsValue = document.getElementById("prop-contracts-value");
  const stopValue = document.getElementById("prop-stop-value");
  if (contractsValue) contractsValue.textContent = contracts;
  if (stopValue) stopValue.textContent = `$${stop.toLocaleString()}`;
  const states = [true, sizeOk, lossOk, newsOk, sizeOk && lossOk && newsOk];
  document.querySelectorAll("#prop-path span").forEach((step, index) => {
    step.classList.toggle("complete", Boolean(states[index]));
    step.classList.toggle("danger", index > 0 && !states[index]);
  });
  const copy = document.getElementById("prop-meter-copy");
  if (copy) {
    const clean = sizeOk && lossOk && newsOk;
    copy.classList.toggle("safe", clean);
    copy.classList.toggle("danger", !clean);
    const copyText = copy.querySelector("b");
    if (copyText) {
      copyText.textContent = clean
        ? "Escape route is clean: size, drawdown, and news behavior all respect the rulebook."
        : "Rule risk detected. Fix the highlighted path before the account gets locked.";
    }
  }
}

function noTradeAnswer(scenario) {
  if (scenario.bias === "chop" || scenario.pattern.includes("Whipsaw") || scenario.pattern.includes("No Trade")) return "Skip the trade";
  if (scenario.bias === "reversal") return "Take the short";
  return "Take the long";
}

function directionAnswer(scenario) {
  const text = `${scenario.correctAnswer || ""} ${scenario.explanation || ""} ${scenario.pattern || ""}`.toLowerCase();
  if (/\b(short|lower|bear|sell|supply|rejection|breakdown|failed)\b/.test(text)) return "Short";
  if (/\b(long|higher|bull|buy|demand|bounce|reclaim|breakout|continuation)\b/.test(text)) return "Long";
  if (/\b(flat|wait|avoid|chop|consolidation|sideways|no trade)\b/.test(text)) return "Flat";
  const direction = scenario.direction || scenario.bias;
  if (direction === "long" || direction === "breakout" || direction === "continuation") return "Long";
  if (direction === "short" || direction === "reversal") return "Short";
  return "Flat";
}

function detectiveOptions(scenario) {
  const primary = scenario.tags[1] || scenario.tags[0] || "Key level reaction";
  return [
    primary,
    "The candle color by itself",
    "A random lower-timeframe wick",
    "The market symbol"
  ];
}

function survivalAnswer(scenario, round) {
  if (round === 0) return "Hold bias";
  if (round === 1) return scenario.bias === "chop" ? "Do nothing" : "Enter";
  if (round === 2) return scenario.bias === "reversal" ? "Change bias" : "Hold bias";
  if (round === 3) return scenario.bias === "chop" ? "Do nothing" : "Hold bias";
  return "Exit";
}

function confidenceBonus(correct) {
  if (!correct) return 0;
  if (state.confidence === "medium") return 18;
  return 0;
}

function submitAnswer(answer, correctAnswer = getScenario(state.scenarioIndex).correctAnswer, options = {}) {
  if (!hasSignup()) {
    openSignup();
    return;
  }

  const paid = hasPaidPlan();

  if (!paid && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }

  const scenario = getScenario(state.scenarioIndex);
  const correct = answer === correctAnswer;
  const modeBonus = state.activeMode === "ranked" ? 80 : state.activeMode === "daily" ? 200 : state.activeMode === "tape" ? 65 : state.activeMode === "detective" ? 45 : state.activeMode === "notrade" ? 55 : 0;
  const baseEarned = correct ? 120 + modeBonus + confidenceBonus(correct) + Math.min(80, progress().streak * 20) : 20;
  const comboMultiplier = correct && progress().streak >= 2 ? 2 : 1;
  const confidenceMultiplier = correct && state.confidence === "high" ? 1.5 : 1;
  const earned = Math.round(baseEarned * comboMultiplier * confidenceMultiplier);
  const sourceButton = [...els.answers.querySelectorAll("button")].find((button) => button.dataset.answer === answer);
  state.lastAnswerRect = sourceButton?.getBoundingClientRect() || null;
  stopDecisionTimer();
  if (!correct && options.activeSelection) {
    sourceButton?.classList.add("wrong-flash");
    shakeGameCard();
    setTimeout(() => sourceButton?.classList.remove("wrong-flash"), 380);
  }
  finishAttempt({ answer, correct, earned, correctAnswer, metadata: { comboMultiplier, confidenceMultiplier } });
}

function submitSurvivalDecision(answer) {
  if (!hasSignup()) {
    openSignup();
    return;
  }
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }

  const scenario = getScenario(state.scenarioIndex);
  const expected = survivalAnswer(scenario, state.survivalRound);
  if (answer === expected) state.survivalCorrect += 1;
  state.survivalRound += 1;
  state.revealCount = Math.min(15, state.survivalRound * 3);
  playAnswerSound(answer === expected);
  drawChart();

  if (state.survivalRound >= 5) {
    const correct = state.survivalCorrect >= 3;
    const earned = 45 + state.survivalCorrect * 35;
    finishAttempt({
      answer: `${state.survivalCorrect}/5 strong decisions`,
      correct,
      earned,
      correctAnswer: "Adapt to all five candle decisions",
      metadata: { survivalCorrect: state.survivalCorrect }
    });
    return;
  }
  renderAnswers();
}

function awardBadgeOnce(key, label, message) {
  const p = progress();
  p.badges ||= [];
  if (p.badges.includes(key)) return false;
  p.badges.push(key);
  saveProgress();
  showToast(`${label} badge earned — ${message}`, "success");
  return true;
}

function postAttemptRewards({ correct, earned, attempt, previousStreak }) {
  const p = progress();
  const total = (p.attempts || []).length;
  const reviewCount = (p.reviewQueue || []).length;
  if (correct && earned > 0) {
    if (p.streak === 3) showToast("Combo armed. Your next clean read carries more weight.", "success");
    if (p.streak > 0 && p.streak % 5 === 0) showToast(`${p.streak} correct in a row. Hot streak active.`, "success");
  }
  if (!correct && reviewCount) {
    showToast(`Added to Review Queue. ${reviewCount} mistake${reviewCount === 1 ? "" : "s"} waiting to clean up.`, "warning");
  }
  if (attempt.mode === "daily") {
    showToast(correct ? "Daily Challenge logged. Come back tomorrow to protect the streak." : "Daily Challenge logged. Review the miss before tomorrow.", correct ? "success" : "warning");
  }
  if (total === 1) awardBadgeOnce("first-replay", "First Replay", "your training profile is alive.");
  if (total === 10) awardBadgeOnce("ten-reps", "10 Reps", "pattern memory is starting to build.");
  if (p.reviewClears === 5) awardBadgeOnce("review-cleaner", "Review Cleaner", "five old mistakes fixed.");
  if (p.topStreak >= 7) awardBadgeOnce("seven-streak", "7 Streak", "a full week of clean habit pressure.");
  if (correct && previousStreak >= 4 && p.streak > previousStreak) {
    awardBadgeOnce("pressure-combo", "Pressure Combo", "five straight correct reads under the clock.");
  }
}

function finishAttempt({ answer, correct, earned, correctAnswer, metadata = {} }) {
  const scenario = getScenario(state.scenarioIndex);
  const p = progress();
  const paid = hasPaidPlan();
  const xpAwarded = getUserPlan() === "free" ? 0 : earned;
  const previousStreak = Number(p.streak || 0);
  playAnswerSound(correct);
  stopReplay();
  state.selected = answer;
  state.revealed = true;
  p.xp += xpAwarded;
  if (!paid) p.freePlaysUsed = Number(p.freePlaysUsed || 0) + 1;
  p.streak = correct ? p.streak + 1 : 0;
  p.topStreak = Math.max(p.topStreak, p.streak);
  p.disciplineScore = Number.isFinite(Number(p.disciplineScore)) ? Number(p.disciplineScore) : 80;
  if (state.confidence === "high") {
    p.disciplineScore += correct ? 2 : -7;
  } else if (state.confidence === "medium" && correct) {
    p.disciplineScore += 1;
  } else if (!correct) {
    p.disciplineScore -= 2;
  }
  p.disciplineScore = Math.max(0, Math.min(100, Math.round(p.disciplineScore)));
  if (hasAccess("streakFreeze") && p.streak > 0 && p.streak % 7 === 0 && Number(p.streakFreezes || 0) < 3) {
    p.streakFreezes = Number(p.streakFreezes || 0) + 1;
    showToast("Streak Freeze banked — Elite streak protection ready.", "success");
  }
  const attempt = {
    scenarioId: scenario.id,
    answer,
    correct,
    earned: xpAwarded,
    pattern: scenario.pattern,
    patternTags: scenarioPatternTags(scenario),
    session: scenario.session || sessionName(scenario),
    mode: state.activeMode,
    confidence: state.confidence,
    completedAt: Date.now(),
    ...metadata
  };
  p.attempts.push(attempt);
  syncAttempt(attempt, scenario, correctAnswer);
  if (!p.firstReplayCompletedAt) p.firstReplayCompletedAt = Date.now();
  p.reviewQueueMeta ||= {};
  if (!correct) {
    p.reviewQueue ||= [];
    if (!p.reviewQueue.includes(scenario.id)) p.reviewQueue.push(scenario.id);
    const existing = p.reviewQueueMeta[scenario.id] || {};
    p.reviewQueueMeta[scenario.id] = {
      scenarioId: scenario.id,
      wrongAt: Date.now(),
      reviewedAt: existing.reviewedAt || null,
      wrongCount: Number(existing.wrongCount || 0) + 1,
      patternTags: scenarioPatternTags(scenario)
    };
  } else if (state.activeMode === "review") {
    p.reviewQueue = (p.reviewQueue || []).filter((scenarioId) => scenarioId !== scenario.id);
    p.reviewClears = Number(p.reviewClears || 0) + 1;
    p.reviewQueueMeta[scenario.id] = {
      ...(p.reviewQueueMeta[scenario.id] || {}),
      scenarioId: scenario.id,
      reviewedAt: Date.now(),
      patternTags: scenarioPatternTags(scenario)
    };
    showToast("Mistake cleared from Review Queue.", "success");
  }
  p.completed[completionKey(scenario.id)] = { selected: answer, correct, earned: xpAwarded, correctAnswer, confidence: state.confidence, ...metadata };
  p.nextByMode ||= {};
  const nextKey = state.scenarioFilter && state.activeMode === "replay" ? `${state.activeMode}:${state.scenarioFilter}` : state.activeMode;
  p.nextByMode[nextKey] = state.activeMode === "review"
    ? reviewQueueScenarioIndex()
    : state.activeMode === "daily"
      ? dailyScenarioIndex()
      : state.activeMode === "replay" && state.scenarioFilter
    ? findNextFilteredScenario(state.scenarioIndex + 1, 1, state.activeMode, state.scenarioFilter)
    : findNextProgressiveScenario(state.scenarioIndex + 1, 1, state.activeMode);
  saveProgress();
  trackEvent("scenario_completed", {
    scenarioId: scenario.id,
    correct,
    earned: xpAwarded,
    confidence: state.confidence,
    comboMultiplier: metadata.comboMultiplier || 1,
    timeout: Boolean(metadata.timeout)
  });
  updateProgressUi();
  renderStreakDots();
  animateXpGain(xpAwarded, correct);
  if (metadata.comboMultiplier > 1) flashCombo(metadata.comboMultiplier);
  const trainer = document.querySelector(".trainer-grid");
  trainer?.classList.toggle("hot-hand", correct && p.streak >= 3);
  if (!correct && previousStreak >= 3) {
    trainer?.classList.remove("hot-hand");
    showToast("Combo lost. Review the clue, then rebuild it.", "warning");
  }
  postAttemptRewards({ correct, earned: xpAwarded, attempt, previousStreak });
  els.status.textContent = "Replay ready";
  renderAnswers();
  renderChartHotspots();
  playRevealSequence(correct);
  animateReplay(0);
  maybeOpenSessionRecap();
}

function clueForScenario(scenario) {
  if (state.activeMode === "risklab") return "The clue was total dollar risk: contracts × stop ticks × tick value.";
  if (state.activeMode === "newsdesk") return "The clue was the event type, because CPI/FOMC-style events can override normal intraday behavior.";
  if (state.activeMode === "propescape") return "The clue was the rulebook, not the opportunity. Passing requires avoiding disqualification first.";
  if (scenario.pattern.includes("VWAP")) return "Price acceptance or rejection around VWAP was the key clue.";
  if (scenario.pattern.includes("Liquidity") || scenario.pattern.includes("Failed")) return "The failure to hold beyond the prior high or low exposed the trap.";
  if (scenario.bias === "chop") return "Overlapping candles and flat structure warned that no clean edge existed.";
  if (scenario.bias === "breakout") return "Compression and shallow pullbacks showed energy building before expansion.";
  return `${scenario.tags[1] || scenario.tags[0]} was the strongest contextual clue.`;
}

function candleSequenceForScenario(scenario) {
  if (state.activeMode === "risklab") return "You built a risk plan before action. The simulator checked whether contracts, stop size, and risk budget were survivable together.";
  if (state.activeMode === "newsdesk") return "You classified a scheduled event before the release. The desk checked volatility risk, affected market, and whether action should be reduced or avoided.";
  if (state.activeMode === "propescape") return "You managed a funded-account day. The rule check measured contracts, loss cutoff, and behavior around news risk.";
  const sequences = {
    reversal: "Price pushed through the reference level, failed to hold above it, printed a rejection candle, then rotated back through the breakout area as trapped momentum unwound.",
    continuation: "Price tested the key level, held it on smaller opposing candles, printed a firm response candle, then continued in the original direction with improving follow-through.",
    breakout: "Candles compressed near the range edge, pullbacks became shallower, the boundary broke with expansion, and the next candles accepted beyond the old range.",
    chop: "Price overlapped around VWAP, rejected both edges of the range, failed to produce follow-through, and returned repeatedly toward the middle."
  };
  return sequences[scenario.bias] || "Price tested the key reference, showed its response through candle structure, and confirmed the higher-quality decision during the reveal.";
}

function evidenceForScenario(scenario) {
  if (state.activeMode === "risklab") return "The correct plan worked because it respected both account risk and daily loss risk. Futures mistakes become expensive when size and stop distance are chosen separately.";
  if (state.activeMode === "newsdesk") return "The correct desk read worked because event risk comes before setup quality. High-impact releases can make otherwise clean ideas unstable.";
  if (state.activeMode === "propescape") return "The correct escape plan worked because funded-account survival depends on rules first: contract limit, daily loss limit, and standing down during red-risk windows.";
  if (scenario.pattern.includes("VWAP")) return "The strongest evidence was the reclaim or rejection at VWAP followed by acceptance on the correct side. Location and the next pullback mattered more than candle color alone.";
  if (scenario.pattern.includes("Liquidity") || scenario.pattern.includes("Failed")) return "The strongest evidence was the sweep beyond the prior extreme followed by immediate failure to hold. That combination identified trapped participation and favored rotation.";
  if (scenario.bias === "chop") return "The strongest evidence was the lack of displacement: overlapping bodies, a flat reference level, and repeated rejection on both sides made patience the highest-quality decision.";
  if (scenario.bias === "breakout") return "The strongest evidence was compression directly beneath the boundary followed by decisive expansion and acceptance outside the range.";
  if (scenario.bias === "reversal") return "The strongest evidence was weakening follow-through at an important location, followed by rejection and a close back through the level.";
  return "The strongest evidence was a controlled retest, smaller opposing candles, and a strong response that preserved the existing structure.";
}

function invalidationForScenario(scenario) {
  if (state.activeMode === "risklab") return "A plan becomes invalid when the dollar risk is too large for the account, too close to the daily loss limit, or bigger than the planned risk budget.";
  if (state.activeMode === "newsdesk") return "The read becomes invalid if the event is misclassified, the wrong market is affected, or the chosen action ignores volatility expansion.";
  if (state.activeMode === "propescape") return "The day becomes invalid when contracts exceed the rulebook, the stop comes too close to max loss, or the user trades inside a restricted news window.";
  if (scenario.bias === "reversal") return "Sustained acceptance beyond the swept level would invalidate the reversal read.";
  if (scenario.bias === "chop") return "A clean range break followed by acceptance would end the no-trade condition.";
  if (scenario.bias === "breakout") return "A quick close back inside the old range, followed by failure to reclaim the boundary, would invalidate the breakout.";
  return "A failed hold back through the key level would invalidate continuation. Risk belongs beyond the structure that proves the retest failed, not at an arbitrary distance.";
}

function genericAlternativeReason(scenario, answer) {
  const lower = answer.toLowerCase();
  if (answer === scenario.correctAnswer) return evidenceForScenario(scenario);
  if (lower.includes("breakout") || lower.includes("continuation") || lower.includes("long")) {
    return scenario.bias === "chop"
      ? "There was no acceptance or displacement to justify directional continuation."
      : "The move lacked a clean hold beyond the reference level, so continuation was not confirmed.";
  }
  if (lower.includes("reversal") || lower.includes("failure") || lower.includes("short")) {
    return "A reversal needed rejection plus structural failure. The reveal instead preserved or reclaimed the key level.";
  }
  if (lower.includes("wait") || lower.includes("avoid") || lower.includes("skip")) {
    return "Waiting protects capital in weak structure, but this reveal supplied enough location, confirmation, and follow-through to justify the correct action.";
  }
  return "This choice relied on a single surface clue and ignored the stronger combination of location, structure, and follow-through.";
}

function resultOptionsForScenario(scenario, completed) {
  if (["risklab", "newsdesk", "propescape"].includes(state.activeMode)) {
    return [
      {
        label: "Your plan",
        correct: Boolean(completed.correct),
        selected: true,
        reason: completed.correct
          ? evidenceForScenario(scenario)
          : `Your answer: ${completed.answer}. Correct target: ${completed.correctAnswer}.`
      },
      {
        label: "Professional habit",
        correct: true,
        selected: false,
        reason: invalidationForScenario(scenario)
      }
    ];
  }
  if (state.activeMode === "trade") {
    const expected = expectedDirection(scenario);
    return [
      { label: "Direction", correct: completed.direction === expected, reason: `The training direction was ${expected}. Your direction is scored separately from entry quality.` },
      { label: "Stop placement", correct: Number(completed.rr || 0) >= 1, reason: "The stop must sit beyond the structure that invalidates the idea, while keeping risk proportionate." },
      { label: "Target and R:R", correct: Number(completed.rr || 0) >= 1.5, reason: `${Number(completed.rr || 0).toFixed(2)}R was planned. The drill expects at least 1.50R unless the correct decision is no trade.` }
    ];
  }
  if (state.activeMode === "thesis") {
    const expected = expectedThesis(scenario);
    return Object.entries(expected).map(([key, value]) => ({
      label: `${key[0].toUpperCase()}${key.slice(1)}: ${completed.thesis?.[key] || "Not selected"}`,
      correct: completed.thesis?.[key] === value,
      reason: completed.thesis?.[key] === value ? `Matched the replay: ${value}.` : `The reveal supported ${value}.`
    }));
  }
  if (state.activeMode === "survival") {
    return [
      { label: "Early read", correct: Number(completed.survivalCorrect || 0) >= 1, reason: "The opening decisions should respect the original structure before reacting to noise." },
      { label: "Adaptation", correct: Number(completed.survivalCorrect || 0) >= 3, reason: "Strong survival play updates only when the developing candles materially change the thesis." },
      { label: "Exit discipline", correct: Number(completed.survivalCorrect || 0) >= 4, reason: "The final decision should protect the read when momentum or structure stops confirming it." }
    ];
  }
  if (state.activeMode === "spot") {
    const correctZone = (scenario.seed % 4) + 1;
    return ["Opening structure", "Key level test", "Failure / reclaim", "Expansion trigger"].map((label, index) => ({
      label: `Zone ${index + 1}: ${label}`,
      correct: index + 1 === correctZone,
      reason: index + 1 === correctZone
        ? "This zone combined the key location with the confirmation candle."
        : "This area was useful context, but it did not contain both location and confirmation."
    }));
  }

  let answers = scenario.answers;
  let correctAnswer = scenario.correctAnswer;
  if (state.activeMode === "notrade") {
    answers = ["Take the long", "Take the short", "Skip the trade"];
    correctAnswer = noTradeAnswer(scenario);
  }
  if (state.activeMode === "detective") {
    answers = detectiveOptions(scenario);
    correctAnswer = answers[0];
  }
  return answers.map((answer) => ({
    label: answer,
    correct: answer === correctAnswer,
    selected: answer === completed.selected,
    reason: answer === correctAnswer ? evidenceForScenario(scenario) : genericAlternativeReason(scenario, answer)
  }));
}

function renderOptionReview(scenario, completed) {
  const container = document.getElementById("option-review");
  container.innerHTML = "";
  resultOptionsForScenario(scenario, completed).forEach((option) => {
    const row = document.createElement("div");
    row.className = `option-review-item ${option.correct ? "correct" : "failed"} ${option.selected ? "selected" : ""}`;
    const verdict = option.correct ? "Worked" : option.selected ? "Your choice" : "Failed";
    row.innerHTML = `<span>${option.correct ? "✓" : "×"}</span><div><strong>${option.label}<small>${verdict}</small></strong><p>${option.reason}</p></div>`;
    container.appendChild(row);
  });
}

function clueMarkerForScenario(scenario) {
  if (state.chartGeometry?.candles?.length) {
    const geometry = state.chartGeometry;
    const index = Math.min(geometry.candles.length - 1, clueCandleIndex(scenario));
    const candle = geometry.candles[index];
    if (candle) {
      const x = geometry.pad.left + index * geometry.xStep + geometry.xStep / 2;
      const y = geometry.yFor(candle.close);
      return {
        left: Math.max(6, Math.min(94, (x / geometry.width) * 100)),
        top: Math.max(8, Math.min(88, (y / geometry.height) * 100)),
        label: scenario.clueDescription || clueForScenario(scenario)
      };
    }
  }
  const positions = {
    reversal: { left: 72, top: 31, label: "Rejection + close back through" },
    continuation: { left: 67, top: 57, label: "Retest hold + response candle" },
    breakout: { left: 76, top: 44, label: "Expansion candle + acceptance" },
    chop: { left: 60, top: 48, label: "Overlap around flat VWAP" }
  };
  return positions[scenario.bias] || { left: 68, top: 45, label: "Structure confirmation" };
}

function renderResultClueMarker(scenario) {
  const marker = clueMarkerForScenario(scenario);
  gate.resultClueMarker.style.left = `${marker.left}%`;
  gate.resultClueMarker.style.top = `${marker.top}%`;
  document.getElementById("result-clue-label").textContent = marker.label;
  gate.resultClueMarker.classList.remove("hidden");
}

function findSimilarScenarioIndex(scenario) {
  const tags = scenarioPatternTags(scenario);
  for (let offset = 1; offset <= 5000; offset += 1) {
    const index = (state.scenarioIndex + offset) % TOTAL_SCENARIO_COUNT;
    const candidate = getScenario(index);
    const overlap = scenarioPatternTags(candidate).filter((tag) => tags.includes(tag)).length;
    if (candidate.id !== scenario.id && overlap >= 2 && !isScenarioAnswered(index, state.activeMode)) return index;
  }
  for (let offset = 1; offset <= 5000; offset += 1) {
    const index = (state.scenarioIndex + offset) % TOTAL_SCENARIO_COUNT;
    const candidate = getScenario(index);
    if (candidate.id !== scenario.id && candidate.pattern === scenario.pattern && !isScenarioAnswered(index, state.activeMode)) return index;
  }
  for (let offset = 1; offset <= 5000; offset += 1) {
    const index = (state.scenarioIndex + offset) % TOTAL_SCENARIO_COUNT;
    const candidate = getScenario(index);
    if (candidate.id !== scenario.id && candidate.bias === scenario.bias && !isScenarioAnswered(index, state.activeMode)) return index;
  }
  return findNextUnanswered(state.scenarioIndex + 1, 1, state.activeMode);
}

function calibrationText() {
  const attempts = progress().attempts.filter((attempt) => attempt.confidence === state.confidence);
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const rate = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
  return `Your ${state.confidence} confidence calls are correct ${rate}% of the time across ${attempts.length} decision${attempts.length === 1 ? "" : "s"}.`;
}

function optionDistribution(scenario, completed) {
  const options = resultOptionsForScenario(scenario, completed).slice(0, 5);
  const stats = communityStatsForScenario(scenario);
  if (stats && Number(stats.totalAttempts || 0) >= 3 && Array.isArray(stats.distribution)) {
    const byAnswer = new Map(stats.distribution.map((item) => [item.answer, Number(item.percent || 0)]));
    const matched = options.filter((option) => byAnswer.has(option.label)).length;
    if (matched >= Math.min(2, options.length)) {
      const fallbackCorrect = difficultyDistributionPercent(scenario);
      return options.map((option) => ({
        label: option.label,
        correct: option.correct,
        selected: option.selected,
        percent: Math.max(1, Math.round(byAnswer.get(option.label) || (option.correct ? fallbackCorrect : 4)))
      }));
    }
  }
  const correctIndex = Math.max(0, options.findIndex((option) => option.correct));
  const rand = seededRandom(scenario.seed + stringSeed(state.activeMode) + 771);
  const correctPercent = difficultyDistributionPercent(scenario);
  let remaining = 100 - correctPercent;
  const values = options.map((_, index) => index === correctIndex ? correctPercent : 0);
  const otherIndexes = options.map((_, index) => index).filter((index) => index !== correctIndex);
  otherIndexes.forEach((index, order) => {
    const slotsLeft = otherIndexes.length - order;
    const minReserve = Math.max(0, slotsLeft - 1) * 6;
    const maxValue = Math.max(6, remaining - minReserve);
    const value = order === otherIndexes.length - 1 ? remaining : 6 + Math.floor(rand() * Math.max(1, maxValue - 5));
    values[index] = value;
    remaining -= value;
  });
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  return options.map((option, index) => ({
    label: option.label,
    correct: option.correct,
    selected: option.selected,
    percent: Math.round((values[index] / total) * 100)
  }));
}

function renderAnswerDistribution(scenario, completed) {
  const container = document.getElementById("answer-distribution");
  container.innerHTML = "";
  const distribution = optionDistribution(scenario, completed);
  const correctPercent = distribution.find((item) => item.correct)?.percent || difficultyWinRate(scenario);
  const selectedText = completed.correct
    ? `You chose correctly. ${100 - correctPercent}% of players usually miss this read.`
    : `You chose a tempting answer. Only ${correctPercent}% usually choose the correct read.`;
  if (els.distributionSummary) els.distributionSummary.textContent = selectedText;
  distribution.forEach((item) => {
    const row = document.createElement("div");
    row.className = `distribution-row ${item.correct ? "correct" : ""} ${item.selected ? "selected" : ""}`;
    row.innerHTML = `
      <strong><span>${item.label}</span><b>${item.percent}%</b></strong>
      <div><i style="width:${item.percent}%"></i></div>
    `;
    container.appendChild(row);
  });
}

function learningDistributionMarkup(scenario, completed) {
  return optionDistribution(scenario, completed).map((item) => `
    <div class="learning-dist-row ${item.correct ? "correct" : ""} ${item.selected ? "selected" : ""}">
      <strong><span>${item.label}</span><b>${item.percent}%</b></strong>
      <i><em style="width:${item.percent}%"></em></i>
    </div>
  `).join("");
}

function learningOptionReviewMarkup(scenario, completed) {
  return resultOptionsForScenario(scenario, completed).map((option) => {
    const verdict = option.correct ? "Worked" : option.selected ? "Your choice" : "Failed";
    return `
      <div class="learning-option ${option.correct ? "correct" : ""} ${option.selected ? "selected" : ""}">
        <span>${option.correct ? "✓" : "×"}</span>
        <div><strong>${option.label}<small>${verdict}</small></strong><p>${option.reason}</p></div>
      </div>
    `;
  }).join("");
}

function buildLearningSlides(scenario, completed) {
  const distribution = optionDistribution(scenario, completed);
  const correctPercent = distribution.find((item) => item.correct)?.percent || difficultyWinRate(scenario);
  const selected = resultOptionsForScenario(scenario, completed).find((option) => option.selected);
  const selectedLabel = selected?.label || "your answer";
  const coachTitle = hasCoachPlan() ? "Coach review" : "Coach review locked";
  const coachBody = coachReviewText(scenario, false);
  const scene = learningSceneForScenario(scenario, completed);
  return [
    {
      kicker: "What happened",
      title: "The reveal trapped the first read",
      body: candleSequenceForScenario(scenario),
      visual: "sequence",
      scene
    },
    {
      kicker: "Why the correct read worked",
      title: scenario.correctAnswer || "The higher-quality decision",
      body: evidenceForScenario(scenario),
      visual: "evidence",
      scene
    },
    {
      kicker: "What clue did you miss?",
      title: `The weak spot in "${selectedLabel}"`,
      body: `${clueForScenario(scenario)} The lesson is to wait for location plus confirmation, not just a candle that looks convincing by itself.`,
      visual: "clue",
      scene
    },
    {
      kicker: "Why each alternative failed",
      title: "Every choice had a reason",
      body: "Review the answer map below. Green is the decision that matched the reveal. Red marks the answer you chose.",
      visual: "options",
      scene,
      extra: learningOptionReviewMarkup(scenario, completed)
    },
    {
      kicker: "Risk reasoning",
      title: "What would invalidate this setup?",
      body: invalidationForScenario(scenario),
      visual: "risk",
      scene
    },
    {
      kicker: "Crowd read",
      title: `Only ${correctPercent}% usually get this right`,
      body: `You picked a tempting answer. Use this distribution to see where most traders get pulled off the best read.`,
      visual: "distribution",
      scene,
      extra: learningDistributionMarkup(scenario, completed)
    },
    {
      kicker: coachTitle,
      title: hasCoachPlan() ? "Run the next drill with a focus" : "Unlock deeper mistake review",
      body: coachBody,
      visual: hasCoachPlan() ? "coach" : "locked",
      scene
    },
    {
      kicker: "Streak reminder",
      title: "Come back for the next rep",
      body: streakReminderText(),
      visual: "streak",
      scene
    }
  ];
}

function learningSceneForScenario(scenario, completed = {}) {
  const mode = completed.mode || state.activeMode;
  if (mode === "risklab") return "risklab";
  if (mode === "liquidityhunt") return "liquidityhunt";
  if (mode === "candlecrash") return "candlecrash";
  if (mode === "bossfight") return "bossfight";
  if (mode === "newsdesk") return "newsdesk";
  if (mode === "propescape") return "propescape";
  if (mode === "trade") return "tradeplan";
  if (mode === "notrade") return "patience";
  if (mode === "detective") return "cluehunt";
  if (mode === "thesis") return "thesis";
  if (mode === "survival") return "survival";
  if (mode === "ranked") return "ranked";
  if (mode === "daily") return "daily";
  if (mode === "tape") return "blind";
  const text = `${scenario.pattern || ""} ${(scenario.tags || []).join(" ")} ${scenario.correctAnswer || ""}`.toLowerCase();
  if (text.includes("vwap")) return "vwap";
  if (text.includes("liquidity") || text.includes("sweep")) return "sweep";
  if (text.includes("failed") || text.includes("fakeout")) return "fakeout";
  if (text.includes("breakout") || text.includes("continuation")) return "breakout";
  if (text.includes("chop") || text.includes("range")) return "range";
  return "chart";
}

function learningVisualMarkup(scene, visual) {
  if (scene === "risklab") {
    return `
      <div class="learning-scene risklab-scene">
        <div class="learn-gauge"><b>0.82%</b><span>risk</span><i></i></div>
        <div class="learn-risk-bars"><span></span><span></span><span></span></div>
        <div class="learn-limit-line"><em></em><strong>daily loss limit</strong></div>
      </div>
    `;
  }
  if (scene === "liquidityhunt") {
    return `
      <div class="learning-scene liquidityhunt-scene">
        <div class="learn-liquidity-map">
          <span class="pool high">Buy stops</span>
          <span class="pool low">Sell stops</span>
          <i class="sweep-path"></i>
          <b></b>
        </div>
      </div>
    `;
  }
  if (scene === "candlecrash") {
    return `
      <div class="learning-scene candlecrash-scene">
        <div class="learn-crash-candles"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="learn-combo-token">COMBO</div>
      </div>
    `;
  }
  if (scene === "bossfight") {
    return `
      <div class="learning-scene bossfight-scene">
        <div class="learn-boss-health"><i></i></div>
        <div class="learn-boss-face"><b></b><span></span><em></em></div>
        <div class="learn-rule-shield">RULES</div>
      </div>
    `;
  }
  if (scene === "newsdesk") {
    return `
      <div class="learning-scene newsdesk-scene">
        <div class="learn-calendar"><span>08:30</span><b>CPI</b><em>HIGH IMPACT</em></div>
        <div class="learn-alert-ring"></div>
        <div class="learn-impact-chips"><span>NQ</span><span>ES</span><span>Wait</span></div>
      </div>
    `;
  }
  if (scene === "propescape") {
    return `
      <div class="learning-scene propescape-scene">
        <div class="learn-rule-path">
          <span class="complete">Open</span><span class="danger">Size</span><span>Loss</span><span>News</span><span>Pass</span>
        </div>
        <div class="learn-lock-card"><b>RULE CHECK</b><i></i><em>protect account</em></div>
      </div>
    `;
  }
  if (scene === "tradeplan") {
    return `
      <div class="learning-scene tradeplan-scene">
        <div class="learn-rr-ladder"><span class="target">TARGET</span><span class="entry">ENTRY</span><span class="stop">STOP</span></div>
        <div class="learn-trade-ticket"><b>R:R</b><strong>2.1R</strong><em>placement matters</em></div>
      </div>
    `;
  }
  if (scene === "patience") {
    return `
      <div class="learning-scene patience-scene">
        <div class="learn-stoplight"><span></span><span></span><span></span></div>
        <div class="learn-no-trade-zone">WAIT</div>
        <p>no clean edge</p>
      </div>
    `;
  }
  if (scene === "cluehunt") {
    return `
      <div class="learning-scene cluehunt-scene">
        <div class="learn-magnifier"></div>
        <div class="learn-clue-card"><span>VWAP</span><span>Volume</span><span>Trap</span></div>
      </div>
    `;
  }
  if (scene === "thesis") {
    return `
      <div class="learning-scene thesis-scene">
        <div class="learn-thesis-stack"><span>Trend</span><span>Location</span><span>Momentum</span><span>Action</span></div>
      </div>
    `;
  }
  if (scene === "survival") {
    return `
      <div class="learning-scene survival-scene">
        <div class="learn-health-bar"><i></i></div>
        <div class="learn-survival-steps"><span></span><span></span><span></span><span></span><span></span></div>
        <b>5 decisions</b>
      </div>
    `;
  }
  if (scene === "ranked") {
    return `
      <div class="learning-scene ranked-scene">
        <div class="learn-versus"><span>You</span><b>VS</b><span>Field</span></div>
        <div class="learn-trophy"></div>
      </div>
    `;
  }
  if (scene === "daily") {
    return `
      <div class="learning-scene daily-scene">
        <div class="learn-calendar-grid"><b>DAILY</b><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <em>one shot</em>
      </div>
    `;
  }
  if (scene === "blind") {
    return `
      <div class="learning-scene blind-scene">
        <div class="learn-hidden-date">??/??/????</div>
        <div class="learn-blind-candles"><span></span><span></span><span></span><span></span></div>
      </div>
    `;
  }
  const patternClass = `pattern-${scene}`;
  return `
    <div class="learning-chart ${patternClass}">
      <span class="learn-zone upper"></span>
      <span class="learn-zone lower"></span>
      <span class="learn-vwap"></span>
      <i class="learn-candle c1"></i>
      <i class="learn-candle c2"></i>
      <i class="learn-candle c3"></i>
      <i class="learn-candle c4"></i>
      <i class="learn-candle c5"></i>
      <b class="learn-ping"></b>
    </div>
  `;
}

function renderLearningSlide() {
  if (!els.learningModal || !state.learningSlides.length) return;
  const index = Math.max(0, Math.min(state.learningSlideIndex, state.learningSlides.length - 1));
  state.learningSlideIndex = index;
  const slide = state.learningSlides[index];
  els.learningStep.textContent = `${String(index + 1).padStart(2, "0")} / ${String(state.learningSlides.length).padStart(2, "0")}`;
  els.learningTitle.textContent = slide.title;
  els.learningTitle.previousElementSibling.textContent = slide.kicker;
  els.learningBody.textContent = slide.body;
  els.learningExtra.innerHTML = slide.extra || "";
  els.learningVisual.dataset.visual = slide.visual;
  els.learningVisual.dataset.scene = slide.scene || "chart";
  els.learningVisual.innerHTML = learningVisualMarkup(slide.scene || "chart", slide.visual);
  els.learningPrev.disabled = index === 0;
  els.learningNext.textContent = index === state.learningSlides.length - 1 ? "Continue →" : "Next";
  els.learningDots.innerHTML = state.learningSlides.map((_, dotIndex) => (
    `<button class="${dotIndex === index ? "active" : ""}" type="button" aria-label="Go to learning slide ${dotIndex + 1}"></button>`
  )).join("");
  els.learningDots.querySelectorAll("button").forEach((button, dotIndex) => {
    button.addEventListener("click", () => {
      state.learningSlideIndex = dotIndex;
      renderLearningSlide();
    });
  });
}

function learningAttemptKey(scenario, completed = {}) {
  const p = progress();
  const attemptCount = Array.isArray(p.attempts) ? p.attempts.length : 0;
  return [
    state.activeMode || "mode",
    scenario?.id || "scenario",
    completed.selected || state.selected || "answer",
    completed.correctAnswer || scenario?.correctAnswer || "correct",
    attemptCount
  ].join(":");
}

function learningStorageKey(key) {
  return `tradePulseLearningMoment:${key}`;
}

function hasSeenLearningMoment(key) {
  if (!key) return true;
  return state.learningShownKeys.has(key) || sessionStorage.getItem(learningStorageKey(key)) === "1";
}

function markLearningMomentSeen(key) {
  if (!key) return;
  state.learningShownKeys.add(key);
  sessionStorage.setItem(learningStorageKey(key), "1");
}

function closeLearningMoment(advance = true) {
  if (!els.learningModal || els.learningModal.classList.contains("hidden")) return;
  markLearningMomentSeen(state.learningOpenKey);
  state.learningOpenKey = "";
  els.learningModal.classList.add("hidden");
  els.learningModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("learning-open");
  state.learningSlides = [];
  state.learningSlideIndex = 0;
  if (advance) document.getElementById("next-scenario").click();
}

function openLearningMoment(scenario, completed, learningKey = "") {
  if (!els.learningModal) return;
  const key = learningKey || learningAttemptKey(scenario, completed);
  if (hasSeenLearningMoment(key) && state.learningOpenKey !== key) return;
  state.learningOpenKey = key;
  markLearningMomentSeen(key);
  state.learningSlides = buildLearningSlides(scenario, completed);
  state.learningSlideIndex = 0;
  renderLearningSlide();
  els.learningModal.classList.remove("hidden");
  els.learningModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("learning-open");
}

function coachReviewText(scenario, correct) {
  const clue = clueForScenario(scenario);
  if (!hasCoachPlan()) {
    return "Coach unlocks the deeper mistake review layer: exact clue priority, why the weak answer was tempting, and the drill to run next.";
  }
  if (scenario.coachExplanation) return scenario.coachExplanation;
  if (correct) {
    return `Coach read: good decision. You weighted the strongest evidence correctly: ${clue} Next, repeat this pattern on a different timeframe so the read becomes automatic.`;
  }
  return `Coach read: the missed piece was evidence stacking. Start with location, then ask whether momentum accepted or failed there. ${clue} Run a similar drill before switching patterns.`;
}

function streakReminderText() {
  const p = progress();
  if (p.streak > 0) return `Come back tomorrow to keep your ${p.streak}-day streak alive. One clean replay is enough to keep momentum.`;
  if (p.topStreak > 0) return `Your best streak is ${p.topStreak} days. Start a new streak tomorrow and try to beat it.`;
  return "Come back tomorrow for a fresh daily challenge and start building your first streak.";
}

function renderSessionSummary() {
  const p = progress();
  const summary = document.getElementById("session-summary");
  const stats = document.getElementById("session-summary-stats");
  const copy = document.getElementById("session-summary-copy");
  const attempts = p.attempts.slice(-5);

  if (p.attempts.length < 5 || p.attempts.length % 5 !== 0) {
    summary.classList.add("hidden");
    return;
  }

  const correct = attempts.filter((attempt) => attempt.correct).length;
  const earned = attempts.reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0);
  const patternCounts = attempts.reduce((acc, attempt) => {
    acc[attempt.pattern] = (acc[attempt.pattern] || 0) + 1;
    return acc;
  }, {});
  const bestPattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Pattern Recognition";
  stats.innerHTML = `
    <span><b>${correct}/5</b> accuracy</span>
    <span><b>+${earned}</b> XP</span>
    <span><b>${p.streak}</b> streak</span>
    <span><b>${bestPattern}</b> focus</span>
  `;
  copy.textContent = hasPaidPlan()
    ? "Nice session. Run one similar drill now while the pattern is still fresh."
    : "That is your natural session checkpoint. Upgrade when you want unlimited reps, leaderboards, and deeper review.";
  summary.classList.remove("hidden");
}

function currentSessionAttempts() {
  const p = progress();
  const start = Number.isFinite(Number(p.sessionAttemptStart)) ? Number(p.sessionAttemptStart) : 0;
  return p.attempts.slice(start);
}

function tagSummaryFromAttempts(attempts) {
  const rows = {};
  attempts.forEach((attempt) => {
    (attempt.patternTags?.length ? attempt.patternTags : [attempt.pattern || "Pattern Recognition"]).forEach((tag) => {
      const label = titleFromTag(String(tag).replace(/\s+/g, "_"));
      rows[label] ||= { pattern: label, total: 0, correct: 0 };
      rows[label].total += 1;
      if (attempt.correct) rows[label].correct += 1;
    });
  });
  return Object.values(rows).map((row) => ({
    ...row,
    accuracy: row.total ? Math.round((row.correct / row.total) * 100) : 0
  }));
}

function weakestPatternFromProgress() {
  const attempts = progress().attempts || [];
  const rows = tagSummaryFromAttempts(attempts);
  if (!rows.length) return null;
  return [...rows].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
}

function nextBestDrillForResult(scenario, correct) {
  const p = progress();
  const weak = weakestPatternFromProgress();
  const nextRank = nextRankFromXp(p.xp);
  const xpRemaining = Math.max(0, nextRank.xp - p.xp);
  const reviewCount = (p.reviewQueue || []).length;

  if (!correct && reviewCount > 0 && hasAccess("reviewQueue")) {
    return {
      action: "mode",
      mode: "review",
      badge: `${reviewCount} to review`,
      title: "Run the mistake back",
      copy: `Your Review Queue now has ${reviewCount} missed ${reviewCount === 1 ? "scenario" : "scenarios"}. Replay this pattern while the clue is fresh.`,
      cta: "Start Review Queue"
    };
  }

  if (!correct && !hasCoachPlan()) {
    return {
      action: "plans",
      badge: "Coach unlock",
      title: "Unlock the full mistake layer",
      copy: "Coach adds deeper reasoning, mistake review, bookmarks, and a queue built from scenarios you actually missed.",
      cta: "See Coach Plan"
    };
  }

  if (xpRemaining > 0 && xpRemaining <= 120 && hasPaidPlan()) {
    return {
      action: "mode",
      mode: state.activeMode,
      badge: `${xpRemaining} XP away`,
      title: `Push to ${nextRank.name}`,
      copy: `You are within one focused replay of the next rank. Stay on this mode and finish the climb.`,
      cta: "Play Another"
    };
  }

  if (weak && weak.total >= 2 && weak.accuracy < 70) {
    return {
      action: "mode",
      mode: "replay",
      badge: `${weak.accuracy}% weak spot`,
      title: `Drill ${weak.pattern}`,
      copy: `Your data says ${weak.pattern} needs the most reps. ReplayEdge will keep feeding similar blind reads until it improves.`,
      cta: "Start Focus Drill"
    };
  }

  if (state.activeMode !== "daily") {
    return {
      action: "mode",
      mode: "daily",
      badge: "One shot",
      title: "Take today's daily challenge",
      copy: "One shared scenario, one attempt, leaderboard pressure. It is the cleanest habit loop in the app.",
      cta: "Play Daily"
    };
  }

  return {
    action: "mode",
    mode: "replay",
    badge: scenario.pattern,
    title: "Try a similar blind replay",
    copy: "Keep the same pattern family going so the read starts becoming automatic instead of random.",
    cta: "Next Blind Replay"
  };
}

function resultNextStepMarkup(scenario, correct) {
  const next = nextBestDrillForResult(scenario, correct);
  return `
    <button class="result-next-step-card" id="result-next-step-card" type="button" data-action="${next.action}" data-mode="${next.mode || ""}">
      <span>${next.badge}</span>
      <strong>${next.title}</strong>
      <p>${next.copy}</p>
      <b>${next.cta} →</b>
    </button>
  `;
}

function shouldShowSaveProgressPrompt() {
  const p = progress();
  return Boolean(p.anonymousAccess && !p.signup?.email && (p.attempts || []).length <= 3);
}

function saveProgressPromptMarkup() {
  if (!shouldShowSaveProgressPrompt()) return "";
  return `
    <div class="result-save-progress-card">
      <div>
        <span>Progress not saved to an account yet</span>
        <strong>Keep your replay history, weak spots, and free-play status.</strong>
      </div>
      <button id="result-save-progress" type="button">Save Progress</button>
    </div>
  `;
}

function bindResultNextStepActions(container) {
  const nextCard = container.querySelector("#result-next-step-card");
  nextCard?.addEventListener("click", () => {
    const action = nextCard.dataset.action;
    const mode = nextCard.dataset.mode;
    if (action === "plans") {
      navigateTo("plans");
      return;
    }
    if (mode) startMode(mode);
  });

  container.querySelector("#result-save-progress")?.addEventListener("click", openSignup);

  container.querySelector("#result-copy-share")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const scenario = getScenario(state.scenarioIndex);
    const completed = completedScenario(scenario) || {};
    const shareText = resultShareText(scenario, Boolean(completed.correct), Number(completed.earned || 0));
    try {
      await navigator.clipboard.writeText(shareText);
      button.textContent = "Copied!";
      showToast("Result copied to clipboard.", "success");
      setTimeout(() => {
        button.textContent = "Copy Result";
      }, 1800);
    } catch (error) {
      showToast("Could not copy result. Try again.", "error");
    }
  });
}

function maybeOpenSessionRecap() {
  const p = progress();
  const attempts = currentSessionAttempts();
  if (!attempts.length || attempts.length % 5 !== 0 || p.lastSessionRecapAt === p.attempts.length) return;
  p.lastSessionRecapAt = p.attempts.length;
  saveProgress();
  setTimeout(() => {
    if (els.learningModal && !els.learningModal.classList.contains("hidden")) {
      setTimeout(() => openSessionRecap(attempts.slice(-5)), 2400);
      return;
    }
    openSessionRecap(attempts.slice(-5));
  }, 900);
}

function openSessionRecap(attempts) {
  let modal = document.getElementById("session-recap-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "session-recap-modal";
    modal.className = "session-recap-modal hidden";
    document.body.appendChild(modal);
  }
  const p = progress();
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const earned = attempts.reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0);
  const tags = tagSummaryFromAttempts(attempts);
  const best = [...tags].sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)[0]?.pattern || "Pattern Recognition";
  const weakest = [...tags].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0]?.pattern || "Pattern Recognition";
  const next = nextRankFromXp(p.xp);
  const remaining = Math.max(0, next.xp - p.xp);
  modal.innerHTML = `
    <section class="session-recap-card" role="dialog" aria-modal="true" aria-label="Session recap">
      <button class="session-recap-close" type="button" aria-label="Close recap">×</button>
      <p class="signal">Session Recap</p>
      <h3>${correct}/5 correct · +${earned} XP</h3>
      <div class="session-recap-stats">
        <span><b>${Math.round((correct / 5) * 100)}%</b>Accuracy</span>
        <span><b>${best}</b>Best pattern</span>
        <span><b>${weakest}</b>Weakest pattern</span>
        <span><b>${remaining || "Ready"}</b>${remaining ? `XP to ${next.name}` : "Rank goal"}</span>
      </div>
      <p>Suggested drill: run Review Queue or another ${weakest} replay while the pattern is still fresh.</p>
      <div class="session-recap-actions">
        <button class="primary-button" id="session-recap-play" type="button">Play Again</button>
        <button class="ghost-button" id="session-recap-home" type="button">Back To Modes</button>
      </div>
    </section>
  `;
  modal.classList.remove("hidden");
  modal.querySelector(".session-recap-close").addEventListener("click", () => modal.classList.add("hidden"));
  modal.querySelector("#session-recap-play").addEventListener("click", () => {
    modal.classList.add("hidden");
    document.getElementById("next-scenario").click();
  });
  modal.querySelector("#session-recap-home").addEventListener("click", () => {
    modal.classList.add("hidden");
    navigateTo("home");
  });
}

function animateXpGain(earned, correct) {
  const burst = document.createElement("div");
  burst.className = `xp-burst ${correct ? "correct" : "review"}`;
  burst.textContent = correct ? `+${earned} XP` : "-";
  if (state.lastAnswerRect) {
    burst.style.left = `${state.lastAnswerRect.left + state.lastAnswerRect.width / 2}px`;
    burst.style.top = `${state.lastAnswerRect.top + 10}px`;
  }
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 760);
}

function flashCombo(multiplier) {
  const combo = els.comboBadge || document.createElement("div");
  combo.className = "combo-badge";
  combo.textContent = `COMBO x${multiplier}`;
  if (!els.comboBadge) document.body.appendChild(combo);
  combo.classList.remove("hidden", "show");
  requestAnimationFrame(() => combo.classList.add("show"));
  setTimeout(() => {
    combo.classList.remove("show");
    if (!els.comboBadge) combo.remove();
    else combo.classList.add("hidden");
  }, 1500);
}

function shakeGameCard() {
  const card = document.querySelector(".trainer-grid");
  if (!card) return;
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
  setTimeout(() => card.classList.remove("shake"), 360);
}

function renderLevelUpNudge() {
  if (!els.levelUpNudge) return;
  const p = progress();
  const next = nextRankFromXp(p.xp);
  const missing = rankRequirementMissing(next, p);
  const remaining = Math.max(0, next.xp - p.xp);
  if (!missing.length) {
    els.levelUpNudge.classList.add("hidden");
  } else if (remaining > 0 && remaining <= 250) {
    els.levelUpNudge.textContent = `Only ${remaining} XP to reach ${next.name}. One focused replay could do it.`;
    els.levelUpNudge.classList.remove("hidden");
  } else if (remaining === 0 && missing.length <= 3) {
    els.levelUpNudge.textContent = `${next.name} is XP-ready. Unlock it by finishing: ${missing.join(", ")}.`;
    els.levelUpNudge.classList.remove("hidden");
  } else {
    els.levelUpNudge.classList.add("hidden");
  }
}

function relatedAnswerMatch(answer = "", correctAnswer = "") {
  const a = String(answer || "").toLowerCase();
  const c = String(correctAnswer || "").toLowerCase();
  if (!a || !c) return false;
  const shared = ["long", "short", "flat", "wait", "breakout", "reversal", "continuation", "vwap", "sweep", "reclaim", "liquidity", "risk", "news", "rule", "trap", "target", "stop"];
  return shared.some((word) => a.includes(word) && c.includes(word));
}

function resultQuality(scenario, correct, completed = {}) {
  const confidence = completed.confidence || state.confidence;
  const comboMultiplier = Number(completed.comboMultiplier || 1);
  const timeout = Boolean(completed.timeout);
  const survivalCorrect = Number(completed.survivalCorrect || 0);
  const selected = completed.selected || state.selected;
  const correctAnswer = completed.correctAnswer || scenario.correctAnswer;

  if (correct && comboMultiplier > 1) {
    return { grade: "S", title: "Combo Read", tone: "You chained clean decisions together. That is exactly how pattern memory starts to feel automatic." };
  }
  if (correct && confidence === "high") {
    return { grade: "S", title: "Perfect Read", tone: "High conviction matched the reveal. Strong calibration under pressure." };
  }
  if (correct && state.activeMode === "survival" && survivalCorrect >= 4) {
    return { grade: "S", title: "Pressure Survived", tone: "You adapted through multiple candle decisions without losing the bigger structure." };
  }
  if (correct) {
    return { grade: "A", title: "Good Read", tone: "Clean decision. Now repeat this setup until the clue feels familiar before the reveal." };
  }
  if (timeout) {
    return { grade: "C", title: "Timed Out", tone: "The clock beat the read. Train the first-pass clue, then refine the details after." };
  }
  if (relatedAnswerMatch(selected, correctAnswer)) {
    return { grade: "B", title: "Close, But Early", tone: "You saw part of the idea, but the reveal needed one more confirmation clue before acting." };
  }
  if (confidence === "high") {
    return { grade: "C", title: "Wrong Bias", tone: "Useful miss: confidence and evidence were out of sync. That is the exact habit to correct." };
  }
  return { grade: "C", title: "Good Idea, Bad Timing", tone: "The idea was tempting, but location, confirmation, or risk context did not line up yet." };
}

function modeResultHook(scenario, correct, completed = {}) {
  const mode = state.activeMode;
  if (mode === "risklab") return correct ? "Risk plan survived. Try tightening the same idea with one fewer contract." : "Risk failed first. Rebuild the plan before thinking about direction.";
  if (mode === "liquidityhunt") return correct ? "You found the pool before the sweep. That is the read this drill is training." : "Replay the target labels: the obvious pool usually pulls price before the real move.";
  if (mode === "candlecrash") return correct ? "Good candle personality read. Size, context, and follow-through lined up." : "The candle looked loud, but the surrounding structure told the real story.";
  if (mode === "bossfight") return correct ? "Boss round cleared. You protected process before chasing the move." : "Boss fights punish one loose assumption. Slow the next read down.";
  if (mode === "newsdesk") return correct ? "Good desk call. Event type changed how much trust the setup deserved." : "The news context was the hidden boss. Treat event risk as part of the setup.";
  if (mode === "propescape") return correct ? "Rule survival first. That is how funded accounts stay alive." : "Opportunity did not matter until the rulebook was protected.";
  if (mode === "tape") return correct ? "Fast tape read landed. Try one more before the rhythm cools." : "Speed is useful only when the first clue is clean. Re-run the same pattern.";
  if (mode === "daily") return correct ? "Daily rep banked. Come back tomorrow to defend the streak." : "Daily miss logged. This is exactly what the Review Queue is for.";
  if (scenario.pattern?.includes("VWAP")) return "Next focus: acceptance versus touch. VWAP reads get cleaner when you wait for the hold or failure.";
  if (scenario.pattern?.includes("Liquidity")) return "Next focus: do not trust the first break. Ask who got trapped before choosing direction.";
  return correct ? "Good rep. Push into a similar drill while the setup is fresh." : "Good miss. The fastest improvement comes from replaying the same pattern immediately.";
}

function playRevealSequence(correct) {
  const host = document.querySelector(".chart-frame") || document.querySelector(".game-panel");
  if (!host) return;
  host.querySelector(".reveal-sequence")?.remove();
  const sequence = document.createElement("div");
  sequence.className = "reveal-sequence";
  sequence.innerHTML = `
    <span>${correct ? "Decision locked" : "Mistake captured"}</span>
    <strong>Revealing the next candles</strong>
    <em>Reading follow-through...</em>
  `;
  host.appendChild(sequence);
  requestAnimationFrame(() => sequence.classList.add("show"));
  setTimeout(() => sequence.remove(), 1650);
}

function resultCoachTone(scenario, correct, completed = {}) {
  if (correct && completed.confidence === "high") return "High-confidence hit: that is the kind of calibrated conviction ReplayEdge is trying to build.";
  if (correct) return "Clean read. The goal now is repetition until this setup feels familiar under pressure.";
  if (state.activeMode === "risklab") return "Good miss to study: the risk plan failed before the trade idea mattered.";
  if (state.activeMode === "newsdesk") return "Good miss to study: event context changed the rules of the setup.";
  if (state.activeMode === "propescape") return "Good miss to study: rule survival comes before opportunity.";
  if (scenario.pattern.includes("Liquidity")) return "Good miss to study: liquidity traps are designed to look obvious one candle too early.";
  if (scenario.pattern.includes("VWAP")) return "Good miss to study: VWAP reads depend on acceptance, not just a touch.";
  return "Good miss to study: the clue was there, but the confirmation threshold was higher than it looked.";
}

function showResult(correct, earned, completed = {}) {
  const paid = hasPaidPlan();
  const scenario = getScenario(state.scenarioIndex);
  const quality = resultQuality(scenario, correct, completed);
  document.querySelector(".trainer-grid")?.classList.add("result-mode");
  els.resultPanel.classList.remove("hidden");
  els.grade.textContent = quality.grade;
  els.resultTitle.textContent = quality.title;
  els.explanation.textContent = hasAccess("coachReview")
    ? `${scenario.explanation} Coach tip: review location, momentum, and whether price accepted or failed around the key level. Educational practice only, not financial advice.`
    : scenario.explanation;
  els.xpEarned.textContent = `+${earned} XP`;
  let resultExtras = document.getElementById("result-extras");
  if (!resultExtras) {
    resultExtras = document.createElement("div");
    resultExtras.id = "result-extras";
    resultExtras.className = "result-extras";
    els.resultPanel.querySelector(".result-next-button")?.before(resultExtras);
  }
  const crowdRate = difficultyDistributionPercent(scenario);
  resultExtras.innerHTML = `
    <div class="result-compact-summary">
      <div class="coach-tone-line"><b>${quality.tone}</b><span>${resultCoachTone(scenario, correct, completed)}</span></div>
      <div class="beat-crowd-stat">${correct ? `${100 - crowdRate}% usually miss this read.` : `Only ${crowdRate}% usually choose the correct read.`}</div>
    </div>
    <div class="result-momentum-hook">${modeResultHook(scenario, correct, completed)}</div>
    <div class="result-compact-grid">
      ${scenarioTrustStrip(scenario)}
      ${state.activeMode === "daily" ? renderDailyExamBoard(scenario, completed) : ""}
      ${state.activeMode === "trade" ? tradeScoreBreakdown(completed) : ""}
      ${resultNextStepMarkup(scenario, correct)}
      ${resultShareMomentMarkup(scenario, correct, earned)}
      ${saveProgressPromptMarkup()}
    </div>
  `;
  bindResultNextStepActions(resultExtras);
  gate.resultBreakdown.classList.add("hidden");
  document.getElementById("candle-sequence").textContent = candleSequenceForScenario(scenario);
  document.getElementById("why-correct").textContent = evidenceForScenario(scenario);
  renderOptionReview(scenario, completed);
  document.getElementById("missed-clue").textContent = correct
    ? `You recognized it. ${clueForScenario(scenario)} The marker shows the exact confirmation area.`
    : `${clueForScenario(scenario)} The marker shows the exact candle area where the evidence became actionable.`;
  document.getElementById("invalidation").textContent = invalidationForScenario(scenario);
  document.getElementById("calibration").textContent = completed.confidence ? calibrationText() : "Complete confidence-rated decisions to build your calibration score.";
  renderAnswerDistribution(scenario, completed);
  const coachSection = document.getElementById("coach-review-section");
  coachSection.classList.toggle("locked", !hasCoachPlan());
  document.getElementById("coach-review-title").textContent = hasCoachPlan() ? "Coach Review" : "Coach Review Locked";
  document.getElementById("coach-review").textContent = coachReviewText(scenario, correct);
  document.getElementById("streak-reminder").textContent = streakReminderText();
  renderLevelUpNudge();
  renderSessionSummary();
  document.getElementById("similar-pattern-label").textContent = `Try another ${scenario.pattern} drill`;
  if (els.saveReviewQueue) {
    els.saveReviewQueue.classList.toggle("hidden", correct);
    const saved = progress().reviewQueue?.includes(scenario.id);
    els.saveReviewQueue.classList.toggle("saved", Boolean(saved));
    els.saveReviewQueue.querySelector("strong").textContent = saved ? "Saved to Review Queue" : "Save to Review Queue";
  }
  renderResultClueMarker(scenario);
  applyModeUi();
  if (!correct) {
    const learningKey = learningAttemptKey(scenario, completed);
    if (!hasSeenLearningMoment(learningKey) && state.learningOpenKey !== learningKey) {
      state.learningOpenKey = learningKey;
      setTimeout(() => {
        if (state.learningOpenKey !== learningKey || hasSeenLearningMoment(learningKey)) return;
        openLearningMoment(scenario, completed, learningKey);
      }, 420);
    }
  }
  if (correct && !paid && freePlaysLeft() <= 0) {
    setTimeout(openPaywall, 800);
  }
}

function renderDailyExamBoard(scenario, completed) {
  const seed = stringSeed(`daily-${dayOfYear()}-${scenario.id}`);
  const rand = seededRandom(seed);
  const rows = [
    { name: "MarketNinja", score: 920 + Math.round(rand() * 90) },
    { name: "FuturesKing", score: 840 + Math.round(rand() * 80) },
    { name: "You", score: completed.correct ? 780 + Number(completed.earned || 0) : 520 + Number(completed.earned || 0), you: true }
  ].sort((a, b) => b.score - a.score);
  return `
    <div class="daily-exam-board">
      <strong>Daily Market Exam</strong>
      <span>Same blind replay for everyone · ${dailyCountdownText()}</span>
      ${rows.map((row, index) => `<p class="${row.you ? "you" : ""}"><b>#${index + 1} ${row.name}</b><em>${row.score} pts</em></p>`).join("")}
    </div>
  `;
}

function renderChartHotspots() {
  gate.chartHotspots.innerHTML = "";
  if (state.activeMode !== "spot" || state.revealed) {
    gate.chartHotspots.classList.add("hidden");
    return;
  }

  gate.chartHotspots.classList.remove("hidden");
  const scenario = getScenario(state.scenarioIndex);
  const correctIndex = scenario.seed % 4;
  ["Opening structure", "Key level test", "Failure / reclaim", "Expansion trigger"].forEach((label, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.left = `${15 + index * 22}%`;
    button.style.top = `${index % 2 ? 38 : 58}%`;
    button.innerHTML = `<span>${index + 1}</span><small>${label}</small>`;
    button.addEventListener("click", () => {
      const correct = index === correctIndex;
      finishAttempt({
        answer: `Zone ${index + 1}: ${label}`,
        correct,
        earned: correct ? 165 : 25,
        correctAnswer: `Zone ${correctIndex + 1}`,
        metadata: { zone: index + 1 }
      });
    });
    gate.chartHotspots.appendChild(button);
  });
}

function expectedDirection(scenario) {
  if (scenario.bias === "chop") return "wait";
  if (scenario.bias === "reversal") return "short";
  return "long";
}

function updateTradePreview() {
  const entry = Number(document.getElementById("trade-entry").value);
  const stop = Number(document.getElementById("trade-stop").value);
  const target = Number(document.getElementById("trade-target").value);
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const rr = risk > 0 ? reward / risk : 0;
  document.getElementById("trade-rr-preview").textContent = `${rr.toFixed(2)}R`;
  return rr;
}

function seedTradeFormFromScenario(scenario) {
  if (state.activeMode !== "trade" || state.revealed) return;
  const candles = makeCandles(scenario, state.timeframe, 0);
  const last = candles[Math.max(0, pauseCandleIndex(scenario) - 1)] || candles[candles.length - 1];
  if (!last) return;
  const range = Math.max(0.25, candles.slice(-12).reduce((sum, candle) => sum + Math.abs(candle.high - candle.low), 0) / 12);
  const direction = expectedDirection(scenario);
  const entry = last.close;
  const stop = direction === "short" ? entry + range * 1.15 : entry - range * 1.15;
  const target = direction === "short" ? entry - range * 2.2 : entry + range * 2.2;
  document.getElementById("trade-entry").value = entry.toFixed(2);
  document.getElementById("trade-stop").value = stop.toFixed(2);
  document.getElementById("trade-target").value = target.toFixed(2);
  state.tradeDirection = direction === "wait" ? "wait" : direction;
  document.querySelectorAll("#trade-direction button").forEach((button) => {
    button.classList.toggle("active", button.dataset.direction === state.tradeDirection);
  });
}

function canvasPoint(event) {
  const rect = els.chart.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * els.chart.width,
    y: ((event.clientY - rect.top) / rect.height) * els.chart.height
  };
}

function nearestTradeMarker(y) {
  if (state.activeMode !== "trade" || state.revealed || !state.chartGeometry) return null;
  const values = tradeMarkerValues();
  return Object.keys(values)
    .map((key) => ({ key, distance: Math.abs(state.chartGeometry.yFor(values[key]) - y) }))
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance)[0]?.distance <= 22
    ? Object.keys(values).map((key) => ({ key, distance: Math.abs(state.chartGeometry.yFor(values[key]) - y) })).sort((a, b) => a.distance - b.distance)[0].key
    : null;
}

function updateTradeMarkerFromPointer(event) {
  if (!state.tradeDragMarker || !state.chartGeometry) return;
  const { y } = canvasPoint(event);
  const price = state.chartGeometry.priceForY(y);
  const input = document.getElementById(`trade-${state.tradeDragMarker}`);
  if (input) input.value = price.toFixed(2);
  updateTradePreview();
  drawChart();
}

function tradeScoreBreakdown(completed = {}) {
  const rr = Number(completed.rr || 0);
  const score = Number(completed.tradeScore || 0);
  const expected = expectedDirection(getScenario(state.scenarioIndex));
  const directionGood = completed.direction === expected;
  const stopScore = Math.min(100, Math.round(Math.max(0, rr) * 40));
  const timingScore = directionGood ? 86 : 34;
  const drawdownScore = rr >= 2 ? 88 : rr >= 1.5 ? 72 : 46;
  const patienceScore = completed.direction === "wait" && expected === "wait" ? 94 : directionGood ? 78 : 40;
  return `
    <div class="trade-score-card">
      <strong>Trade Execution Score <b>${score}/100</b></strong>
      <div class="trade-score-grid">
        <span><b>${rr.toFixed(2)}R</b>Risk / reward</span>
        <span><b>${stopScore}</b>Stop placement</span>
        <span><b>${timingScore}</b>Entry timing</span>
        <span><b>${drawdownScore}</b>Drawdown control</span>
        <span><b>${patienceScore}</b>Patience</span>
      </div>
    </div>
  `;
}

function submitTradeBuilder() {
  if (!hasSignup()) {
    openSignup();
    return;
  }
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }

  const scenario = getScenario(state.scenarioIndex);
  const rr = updateTradePreview();
  const directionCorrect = state.tradeDirection === expectedDirection(scenario);
  const placementScore = Math.min(40, Math.round(rr * 16));
  const directionScore = directionCorrect ? 60 : 10;
  const totalScore = Math.min(100, directionScore + placementScore);
  const correct = directionCorrect && (state.tradeDirection === "wait" || rr >= 1.5);
  const earned = 35 + totalScore;
  finishAttempt({
    answer: `${state.tradeDirection.toUpperCase()} · ${rr.toFixed(2)}R`,
    correct,
    earned,
    correctAnswer: `${expectedDirection(scenario).toUpperCase()} with disciplined risk`,
    metadata: { rr: Number(rr.toFixed(2)), tradeScore: totalScore, direction: state.tradeDirection }
  });
}

function expectedThesis(scenario) {
  return {
    trend: scenario.bias === "reversal" ? "Bearish" : scenario.bias === "chop" ? "Neutral" : "Bullish",
    location: scenario.bias === "reversal" ? "Premium" : scenario.bias === "chop" ? "Mid-range" : "Discount",
    momentum: scenario.bias === "reversal" ? "Weakening" : scenario.bias === "chop" ? "Balanced" : "Strengthening",
    liquidity: scenario.bias === "reversal" ? "Above price" : scenario.bias === "chop" ? "Both sides" : "Below price",
    action: scenario.bias === "reversal" ? "Short" : scenario.bias === "chop" ? "Avoid" : "Long"
  };
}

function submitThesisBuilder() {
  if (!hasSignup()) {
    openSignup();
    return;
  }
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }

  const scenario = getScenario(state.scenarioIndex);
  const expected = expectedThesis(scenario);
  const chosen = {
    trend: document.getElementById("thesis-trend").value,
    location: document.getElementById("thesis-location").value,
    momentum: document.getElementById("thesis-momentum").value,
    liquidity: document.getElementById("thesis-liquidity").value,
    action: document.getElementById("thesis-action").value
  };
  const components = Object.keys(expected).filter((key) => chosen[key] === expected[key]).length;
  const correct = components >= 4;
  finishAttempt({
    answer: `${components}/5 thesis components`,
    correct,
    earned: 30 + components * 35,
    correctAnswer: Object.values(expected).join(" · "),
    metadata: { thesisScore: components, thesis: chosen }
  });
}

async function requestCommunityLeaderboard() {
  if (state.communityLeaderboardLoaded || state.communityLeaderboardLoading) return;
  state.communityLeaderboardLoading = true;
  try {
    const response = await fetch("/api/community-leaderboard");
    const data = await response.json();
    if (data.ok && Array.isArray(data.rows)) {
      state.communityLeaderboard = data.rows;
      state.communityLeaderboardLoaded = true;
      if (state.currentView === "leaderboard") renderLeaderboard();
    }
  } catch {
    state.communityLeaderboardLoaded = true;
  } finally {
    state.communityLeaderboardLoading = false;
  }
}

function localLeaderboardRow() {
  const p = progress();
  const plan = getUserPlan();
  const weeklyGain = Math.max(420, p.attempts.slice(-12).reduce((sum, attempt) => sum + (attempt.correct ? 180 : 45), 0) + p.streak * 90);
  return {
    name: plan === "free" ? "Guest" : "You",
    gain: weeklyGain,
    rank: rankFromXp(p.xp),
    streak: Math.max(p.streak, p.topStreak),
    you: true,
    plan
  };
}

function leaderboardResetCountdown() {
  const now = new Date();
  const reset = new Date(now);
  reset.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  reset.setHours(23, 59, 59, 0);
  const ms = reset - now;
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  return `${days}d ${hours}h`;
}

function leaderboardInitials(name = "?") {
  const parts = String(name).replace(/[^\w\s]/g, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
}

function leaderboardHue(name = "") {
  let hash = 0;
  for (const char of String(name)) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

function renderLeaderboard() {
  requestCommunityLeaderboard();
  const p = progress();
  const plan = getUserPlan();
  const seed = stringSeed(p.signup?.email || p.inviteEmail || "weekly-board") + Math.floor(Date.now() / 3600000);
  const rand = seededRandom(seed);
  const competitors = leaderboardBase.map((row, index) => ({
    ...row,
    gain: Math.max(900, row.base + Math.round(rand() * 900) - index * 120),
    streak: Math.max(3, row.streak + Math.round(rand() * 4) - 2)
  }));
  const identity = currentUserIdentity();
  const communityRows = (state.communityLeaderboard || []).map((row) => {
    const isYou = row.userId === identity.userId || row.email === identity.email;
    const rowPlan = isYou ? plan : "player";
    return {
      name: isYou ? (plan === "free" ? "Guest" : "You") : row.userName,
      gain: Math.max(0, Number(row.xp || 0)),
      rank: isYou ? rankFromXp(p.xp) : "Community",
      streak: Math.max(1, Math.round(Number(row.total || 1) / 3)),
      you: isYou,
      plan: rowPlan
    };
  });
  const hasYou = communityRows.some((row) => row.you);
  const rows = (communityRows.length ? [
    ...(hasYou ? [] : [localLeaderboardRow()]),
    ...communityRows
  ] : [
    localLeaderboardRow(),
    ...competitors
  ]).sort((a, b) => b.gain - a.gain);

  // compact home widget
  if (els.leaderboard) {
    els.leaderboard.innerHTML = rows.slice(0, 5).map((row, index) => `
      <div class="leader-row gainer-row ${row.you ? "you" : ""} ${index < 3 ? "top-gainer" : ""}">
        <strong class="gainer-rank">${index + 1}</strong>
        <span class="gainer-name">${row.plan === "elite" ? "♛ " : ""}${row.name}<br><small>${row.rank} · ${row.streak} day streak</small></span>
        <strong class="gainer-points">+${row.gain.toLocaleString()} XP</strong>
      </div>
    `).join("");
  }

  // full arena view
  if (els.leaderboardFull) {
    const top = rows.slice(0, 3);
    const rest = rows.slice(3, 12);
    const maxGain = rows[0]?.gain || 1;
    const youIndex = rows.findIndex((row) => row.you);
    const podiumOrder = [top[1], top[0], top[2]].filter(Boolean);
    const podiumMarkup = podiumOrder.map((row) => {
      const place = rows.indexOf(row) + 1;
      return `
        <div class="podium-slot place-${place} ${row.you ? "you" : ""}">
          ${place === 1 ? '<span class="podium-crown">👑</span>' : ""}
          <span class="podium-avatar" style="--hue:${leaderboardHue(row.name)}">${row.you && typeof userAvatarUrl === "function" && userAvatarUrl() ? `<img src="${userAvatarUrl()}" alt="" />` : leaderboardInitials(row.name)}</span>
          <strong class="podium-name">${row.plan === "elite" ? "♛ " : ""}${row.name}</strong>
          <small class="podium-meta">${row.streak}🔥 streak</small>
          <b class="podium-xp">+${row.gain.toLocaleString()} XP</b>
          <div class="podium-base"><span>${place}</span></div>
        </div>
      `;
    }).join("");

    const listMarkup = rest.map((row) => {
      const place = rows.indexOf(row) + 1;
      const width = Math.max(6, Math.round((row.gain / maxGain) * 100));
      return `
        <div class="arena-row ${row.you ? "you" : ""}">
          <b class="arena-place">${place}</b>
          <span class="arena-avatar" style="--hue:${leaderboardHue(row.name)}">${row.you && typeof userAvatarUrl === "function" && userAvatarUrl() ? `<img src="${userAvatarUrl()}" alt="" />` : leaderboardInitials(row.name)}</span>
          <span class="arena-name"><span class="arena-name-line">${row.plan === "elite" ? "♛ " : ""}${row.name}${row.you ? '<i class="arena-you-tag">YOU</i>' : ""}</span><small>${row.rank} · ${row.streak}🔥</small></span>
          <span class="arena-bar"><i style="width:${width}%"></i></span>
          <strong class="arena-xp">+${row.gain.toLocaleString()}</strong>
        </div>
      `;
    }).join("");

    const youRow = youIndex >= 0 ? rows[youIndex] : null;
    const chaseMarkup = youRow && youIndex > 2
      ? `<div class="arena-chase">You're <b>#${youIndex + 1}</b> — ${(rows[youIndex - 1].gain - youRow.gain + 1).toLocaleString()} XP behind ${rows[youIndex - 1].name}. One good Arcade run closes it.</div>`
      : youRow && youIndex <= 2
        ? `<div class="arena-chase gold">You're on the podium at <b>#${youIndex + 1}</b>. Defend it.</div>`
        : "";

    els.leaderboardFull.innerHTML = `
      <div class="arena-topbar">
        <span class="arena-live"><i></i> WEEKLY XP RACE</span>
        <span class="arena-reset">Resets in <b>${leaderboardResetCountdown()}</b></span>
      </div>
      <div class="arena-podium">${podiumMarkup}</div>
      ${chaseMarkup}
      <div class="arena-list">${listMarkup}</div>
    `;
  }
  renderLeaderboardRankScale();
}

function renderLeaderboardRankScale() {
  if (!els.leaderboardRankScale) return;
  const p = progress();
  const currentRank = rankFromXp(p.xp);
  const next = nextRankFromXp(p.xp);
  const missing = rankRequirementMissing(next, p);
  els.leaderboardRankScale.innerHTML = `
    <div class="leaderboard-rank-scale-header">
      <div>
        <div class="panel-title">Rank Scale</div>
        <p>Ranks unlock through XP plus skill gates: accuracy, discipline, streaks, and review improvement.</p>
      </div>
      <strong>${currentRank}</strong>
    </div>
    <div class="rank-gate-summary">
      <b>Next: ${next.name}</b>
      <span>${missing.length ? `Still need ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "..." : ""}` : "Top rank unlocked. Keep defending it."}</span>
    </div>
    <div class="leaderboard-rank-scale-track">
      ${rankTiers.map((tier) => `
        <div class="leaderboard-rank-scale-item ${tier.name === currentRank ? "current" : ""} ${rankUnlocked(tier, p) ? "unlocked" : ""}">
          <b class="rank-gem ${tier.gem}">${tier.icon}</b>
          <strong>${tier.name}</strong>
          <small>${rankRequirementText(tier)}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function updateMarketTape() {
  const p = progress();
  const markets = ["NQ", "ES", "CL", "GC", "BTC"];
  const sessions = ["New York", "London", "Asia", "Replay Lab"];
  const tick = Math.floor(Date.now() / 4000);
  const seed = stringSeed(p.signup?.email || p.inviteEmail || "guest") + tick;
  const rand = seededRandom(seed);
  const market = p.signup?.market && markets.includes(p.signup.market) ? p.signup.market : markets[seed % markets.length];
  const move = ((rand() * 2.8) - 1.1).toFixed(2);
  const benchmark = Math.max(38, Math.min(82, 54 + Math.round(rand() * 18) + Math.round(accuracy() / 10)));
  if (!tapeScenarioCount) tapeScenarioCount = 248901 + p.attempts.length * 11;
  tapeScenarioCount += 1 + (seed % 3);
  els.tapeMarket.textContent = market;
  els.tapeMove.textContent = `${Number(move) >= 0 ? "+" : ""}${move}%`;
  els.tapeMove.classList.toggle("negative", Number(move) < 0);
  els.tapeSession.textContent = sessions[(seed + p.attempts.length) % sessions.length];
  els.tapeAccuracy.textContent = `${benchmark}.${seed % 10}%`;
  els.tapeDelta.textContent = `+${(1.4 + rand() * 3.8).toFixed(1)}%`;
  els.tapeScenarios.textContent = tapeScenarioCount.toLocaleString();
}

function renderAchievements() {
  const p = progress();
  const acc = accuracy();
  const unlocked = [
    p.topStreak >= 10 || p.streak >= 10,
    p.attempts.length >= 100,
    acc >= 80 && p.attempts.length >= 3,
    Object.values(p.completed).filter((item) => item.correct && item.earned >= 160).length >= 5
  ];

  els.achievements.innerHTML = "";
  achievements.forEach((achievement, index) => {
    const item = document.createElement("div");
    item.className = "achievement";
    item.style.opacity = unlocked[index] ? "1" : "0.54";
    item.innerHTML = `<b>${achievement.value}</b><span>${achievement.label}</span>`;
    els.achievements.appendChild(item);
  });
}

function renderRankMeter() {
  const p = progress();
  const currentRank = rankFromXp(p.xp);
  const nextRank = nextRankFromXp(p.xp);
  const maxXp = rankTiers[rankTiers.length - 1].xp;
  const progressPercent = Math.min(100, (p.xp / maxXp) * 100);
  const missing = rankRequirementMissing(nextRank, p);

  els.rankMeter.innerHTML = `
    <div class="rank-track"><span style="width:${progressPercent}%"></span></div>
    <div class="rank-gems">
      ${rankTiers.map((tier) => `
        <div class="rank-gem-item ${tier.name === currentRank ? "current" : ""} ${rankUnlocked(tier, p) ? "unlocked" : ""}">
          <b class="rank-gem ${tier.gem}">${tier.icon}</b>
          <strong>${tier.name}</strong>
          <small>${rankRequirementText(tier)}</small>
        </div>
      `).join("")}
    </div>
    <p class="rank-next">${missing.length ? `${nextRank.name} unlock needs ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "..." : ""}.` : "Top rank reached. Keep defending your spot."}</p>
  `;
}

function eliteStats() {
  const attempts = progress().attempts;
  const fallback = [
    { pattern: "VWAP Reclaim", correct: false, mode: "replay" },
    { pattern: "Liquidity Sweep", correct: true, mode: "ranked" },
    { pattern: "No Trade Discipline", correct: false, mode: "trade" },
    { pattern: "Opening Drive", correct: true, mode: "daily" },
    { pattern: "Failed Breakout", correct: false, mode: "replay" }
  ];
  const data = attempts.length ? attempts : fallback;
  const byPattern = data.reduce((acc, item) => {
    const key = item.pattern || "Pattern Recognition";
    acc[key] ||= { total: 0, correct: 0 };
    acc[key].total += 1;
    if (item.correct) acc[key].correct += 1;
    return acc;
  }, {});
  const rows = Object.entries(byPattern).map(([pattern, value]) => ({
    pattern,
    total: value.total,
    correct: value.correct,
    accuracy: Math.round((value.correct / value.total) * 100)
  }));
  rows.sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
  return { data, rows };
}

function actualPatternStats() {
  const attempts = progress().attempts;
  const byPattern = attempts.reduce((acc, item) => {
    const key = item.pattern || "Pattern Recognition";
    acc[key] ||= { total: 0, correct: 0 };
    acc[key].total += 1;
    if (item.correct) acc[key].correct += 1;
    return acc;
  }, {});

  return Object.entries(byPattern).map(([pattern, value]) => ({
    pattern,
    total: value.total,
    correct: value.correct,
    accuracy: Math.round((value.correct / value.total) * 100)
  }));
}

function patternTagStats() {
  const attempts = progress().attempts;
  const byTag = attempts.reduce((acc, item) => {
    const tags = Array.isArray(item.patternTags) && item.patternTags.length
      ? item.patternTags
      : [String(item.pattern || "pattern_recognition").toLowerCase().replace(/\s+/g, "_")];
    tags.forEach((tag) => {
      acc[tag] ||= { total: 0, correct: 0 };
      acc[tag].total += 1;
      if (item.correct) acc[tag].correct += 1;
    });
    return acc;
  }, {});
  return Object.entries(byTag).map(([tag, value]) => ({
    tag,
    label: titleFromTag(tag),
    total: value.total,
    correct: value.correct,
    accuracy: Math.round((value.correct / value.total) * 100)
  }));
}

function weakestPatternTag() {
  return patternTagStats()
    .filter((row) => row.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0]?.tag || "";
}

function profileAccess() {
  const p = progress();
  const remote = p.subscriptionStatus;
  if (remote?.active && remote.plan) {
    const statusLabel = remote.status === "trialing" ? "Trial" : "Active";
    return {
      title: `${remote.plan} ${statusLabel}`,
      detail: remote.cancelAtPeriodEnd
        ? "Cancels at the end of the current billing period"
        : remote.status === "trialing"
          ? "Stripe trial is active"
          : "Stripe subscription is active"
    };
  }

  if (isTrialActive()) {
    const daysLeft = Math.max(1, Math.ceil((Number(p.trialEndsAt) - Date.now()) / (24 * 60 * 60 * 1000)));
    return {
      title: "Player Trial",
      detail: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left before Player billing`
    };
  }

  if (p.plan) {
    return {
      title: `${p.plan} Plan`,
      detail: p.plan === "Elite"
        ? "Launch deal: $69.99/month active access, normally $139.99"
        : p.plan === "Coach"
          ? "Launch deal: $44.99/month active access, normally $74.99"
          : "$24.99/month active access"
    };
  }

  if (p.pendingPlan) {
    return {
      title: `${p.pendingPlan} Pending`,
      detail: "Checkout started, waiting for payment confirmation"
    };
  }

  return {
    title: "Free Plan",
    detail: `${freePlaysLeft()} free play${freePlaysLeft() === 1 ? "" : "s"} left`
  };
}

function timeAgo(timestamp) {
  const value = Number(timestamp || 0);
  if (!value) return "recently";
  const diff = Math.max(0, Date.now() - value);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

function modeLabelFor(mode) {
  return {
    tape: "Tape Sprint",
    liquidityhunt: "Liquidity Hunt",
    candlecrash: "Candle Crash",
    bossfight: "Prop Boss Fight",
    risklab: "Risk Lab",
    newsdesk: "News Impact Desk",
    propescape: "Prop Firm Escape",
    replay: "Replay Mode",
    daily: "Daily Challenge",
    ranked: "Ranked Battle",
    trade: "Trade Builder",
    spot: "Spot the Setup",
    survival: "Candle Survival",
    notrade: "No-Trade Challenge",
    detective: "Chart Detective",
    thesis: "Build the Thesis",
    review: "Review Queue"
  }[mode] || modeName(mode || "replay");
}

function renderProfileWeeklyGoal() {
  const container = document.getElementById("profile-weekly-goal");
  if (!container) return;
  const weekly = weeklyGoalData();
  const weak = weakestPatternFromProgress();
  const remaining = Math.max(0, weekly.goal - weekly.total);
  const goalDone = remaining === 0;
  const nextLabel = weak ? `Drill ${weak.pattern}` : "Start Blind Replay";
  container.innerHTML = `
    <div class="profile-weekly-head">
      <div>
        <div class="panel-title">Weekly Goal</div>
        <p>${goalDone ? "Goal complete. Keep your rank pressure on." : `${remaining} rep${remaining === 1 ? "" : "s"} left to finish this week's training target.`}</p>
      </div>
      <strong>${weekly.total}/${weekly.goal}</strong>
    </div>
    <div class="profile-weekly-track">
      <span style="width:${weekly.percent}%"></span>
    </div>
    <div class="profile-weekly-stats">
      <div><span>Accuracy</span><strong>${weekly.accuracy}%</strong></div>
      <div><span>XP earned</span><strong>${weekly.xp.toLocaleString()}</strong></div>
      <div><span>Next focus</span><strong>${nextLabel}</strong></div>
    </div>
    <button class="ghost-button profile-weekly-cta" id="profile-weekly-drill" type="button">${nextLabel}</button>
  `;
  document.getElementById("profile-weekly-drill")?.addEventListener("click", () => {
    if (weak) state.scenarioFilter = weak.pattern.toLowerCase();
    startMode(weak ? "replay" : "replay");
  });
}

function renderProfileCommandCenter() {
  const card = document.getElementById("profile-command-center");
  if (!card) return;

  const p = progress();
  const plan = getUserPlan();
  const weak = weakestPatternFromProgress();
  const nextRank = nextRankFromXp(p.xp);
  const xpLeft = Math.max(0, Number(nextRank.xp || 0) - Number(p.xp || 0));
  const missedAttempts = (p.attempts || []).filter((attempt) => !attempt.correct).length;
  const reviewCount = Math.max(p.reviewQueue?.length || 0, missedAttempts);
  const freeLeft = freePlaysLeft();
  const command = {
    title: "Build your first read",
    copy: "Play one blind replay to start mapping your strengths, misses, and next drills.",
    focus: "Blind Replay",
    sub: "Core skill",
    cta: "Start Training",
    mode: "replay",
    view: null
  };

  if (p.attempts.length === 0) {
    command.title = "Start with a blind market read";
    command.copy = "Your first replay unlocks the profile data ReplayEdge uses to build better drills for you.";
    command.focus = "First Scenario";
    command.sub = "Activation";
    command.cta = "Play First Replay";
    command.mode = "replay";
  } else if (reviewCount > 0 && hasAccess("reviewQueue")) {
    command.title = "Clear your missed setups";
    command.copy = `${reviewCount} missed ${reviewCount === 1 ? "scenario is" : "scenarios are"} waiting. Fixing mistakes is the fastest way to raise your decision quality.`;
    command.focus = "Review Queue";
    command.sub = "Weakness repair";
    command.cta = "Start Review Queue";
    command.mode = "review";
  } else if (weak && weak.total >= 2 && weak.accuracy < 70) {
    command.title = `Drill ${weak.pattern}`;
    command.copy = `${weak.pattern} is your lowest-scoring pattern right now. Run focused reps until the read becomes automatic.`;
    command.focus = weak.pattern;
    command.sub = `${weak.accuracy}% accuracy`;
    command.cta = "Start Focus Drill";
    command.mode = "replay";
  } else if (plan === "free" && freeLeft <= 2) {
    command.title = "Protect your progress";
    command.copy = freeLeft > 0
      ? `You have ${freeLeft} free ${freeLeft === 1 ? "play" : "plays"} left. Upgrade when you are ready for unlimited reps and deeper review.`
      : "Your free plays are used. Pick the plan that matches how seriously you want to train.";
    command.focus = "Access";
    command.sub = "Upgrade path";
    command.cta = "View Plans";
    command.mode = null;
    command.view = "plans";
  } else if (p.streak === 0) {
    command.title = "Restart your streak today";
    command.copy = "One daily scenario is enough to rebuild consistency and keep your training loop alive.";
    command.focus = "Daily Challenge";
    command.sub = dailyCountdownText();
    command.cta = "Play Daily";
    command.mode = "daily";
  } else {
    command.title = "Keep the reps compounding";
    command.copy = `${rankFromXp(p.xp)} is building. The next clean session should focus on speed, patience, and one higher-quality read.`;
    command.focus = "Replay Mode";
    command.sub = `${xpLeft.toLocaleString()} XP to ${nextRank.name}`;
    command.cta = "Continue Training";
    command.mode = "replay";
  }

  document.getElementById("profile-command-title").textContent = command.title;
  document.getElementById("profile-command-copy").textContent = command.copy;
  const focus = document.getElementById("profile-command-focus");
  if (focus) {
    focus.innerHTML = `<span>Focus</span><strong>${command.focus}</strong><small>${command.sub}</small>`;
  }
  document.getElementById("profile-command-review").textContent = reviewCount.toLocaleString();
  document.getElementById("profile-command-rank").textContent = xpLeft > 0 ? `${xpLeft.toLocaleString()} XP` : "Ready";
  document.getElementById("profile-command-free").textContent = plan === "free" ? String(freeLeft) : "Unlimited";
  const cta = document.getElementById("profile-command-cta");
  if (cta) {
    cta.textContent = command.cta;
    cta.onclick = () => {
      if (command.view) {
        navigateTo(command.view);
        return;
      }
      if (weak && command.mode === "replay") state.scenarioFilter = weak.pattern.toLowerCase();
      startMode(command.mode || "replay");
    };
  }
}

function renderProfile() {
  const p = progress();
  const name = p.signup?.name || "Guest Trader";
  const email = p.signup?.email || p.inviteEmail || "Create a profile to save your training data.";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "RE";
  const levelInfo = levelProgress(p.xp);
  const access = profileAccess();
  const patterns = actualPatternStats();
  const strongest = [...patterns].sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)[0];
  const weakest = [...patterns].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
  const modes = ["tape", "liquidityhunt", "candlecrash", "bossfight", "risklab", "newsdesk", "propescape", "replay", "daily", "ranked", "trade", "spot", "survival", "notrade", "detective", "thesis"];
  const modeLabels = {
    tape: "Tape Sprint",
    liquidityhunt: "Liquidity Hunt",
    candlecrash: "Candle Crash",
    bossfight: "Prop Boss Fight",
    risklab: "Risk Lab",
    newsdesk: "News Impact Desk",
    propescape: "Prop Firm Escape",
    replay: "Replay Mode",
    daily: "Daily Challenge",
    ranked: "Ranked Battle",
    trade: "Trade Builder",
    spot: "Spot the Setup",
    survival: "Candle Survival",
    notrade: "No-Trade Challenge",
    detective: "Chart Detective",
    thesis: "Build the Thesis"
  };

  document.getElementById("profile-avatar").textContent = initials;
  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-email").textContent = email;
  document.getElementById("profile-access").textContent = access.title;
  document.getElementById("profile-trial").textContent = access.detail;
  if (els.profilePlanBadge) {
    const plan = getUserPlan();
    els.profilePlanBadge.className = `plan-tier-badge plan-${plan}`;
    els.profilePlanBadge.textContent = planDisplayName(plan);
  }
  document.getElementById("profile-rank").textContent = rankFromXp(p.xp);
  document.getElementById("profile-level").textContent = levelInfo.level;
  document.getElementById("profile-xp-label").textContent = `${levelInfo.currentXp.toLocaleString()} / ${levelInfo.neededXp.toLocaleString()} XP`;
  document.getElementById("profile-xp-fill").style.width = `${Math.min(100, (levelInfo.currentXp / levelInfo.neededXp) * 100)}%`;
  document.getElementById("profile-accuracy").textContent = `${accuracy()}%`;
  const disciplineEl = document.getElementById("profile-discipline");
  if (disciplineEl) disciplineEl.textContent = Number(p.disciplineScore || 80);
  document.getElementById("profile-top-streak").textContent = `${Math.max(p.topStreak, p.streak)} Days`;
  document.getElementById("profile-scenarios").textContent = p.attempts.length;
  document.getElementById("profile-freeze").textContent = Number(p.streakFreezes || 0);
  document.getElementById("profile-freeze-copy").textContent = Number(p.streakFreezes || 0)
    ? "Banked and ready if you miss a training day."
    : "Reach a 5-day streak to bank one.";
  document.getElementById("profile-empty-state").classList.toggle("hidden", p.attempts.length > 0);
  document.getElementById("profile-strongest").textContent = strongest ? `${strongest.pattern} · ${strongest.accuracy}%` : "Not enough data";
  document.getElementById("profile-weakest").textContent = weakest ? `${weakest.pattern} · ${weakest.accuracy}%` : "Not enough data";
  document.getElementById("profile-subscription").textContent = access.title;
  document.getElementById("profile-subscription-copy").textContent =
    getUserPlan() === "free"
      ? `${freePlaysLeft()} free play${freePlaysLeft() === 1 ? "" : "s"} left. Upgrade when you want unlimited training and deeper review.`
      : `Your current access is ${access.title}. ${access.detail}.`;
  document.getElementById("manage-billing").classList.toggle("hidden", !p.subscriptionStatus?.active);
  document.getElementById("profile-billing-note").classList.toggle("hidden", !p.subscriptionStatus?.active);
  updateLogoutButtons();
  renderProfileCommandCenter();

  document.getElementById("profile-modes").innerHTML = modes.map((mode) => {
    const attempts = p.attempts.filter((attempt) => attempt.mode === mode);
    const correct = attempts.filter((attempt) => attempt.correct).length;
    const modeAccuracy = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
    return `
      <div class="profile-mode-row">
        <div><strong>${modeLabels[mode]}</strong><span>${attempts.length} completed · ${correct} correct</span></div>
        <b>${modeAccuracy}%</b>
      </div>
    `;
  }).join("");

  const neededForReport = Math.max(0, 5 - p.attempts.length);
  const patternMap = tagSummaryFromAttempts(p.attempts);
  const weakestTag = [...patternMap].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
  document.getElementById("profile-pattern-bars").innerHTML = neededForReport ? `
    <div class="profile-report-progress">
      <strong>Pattern Report loading</strong>
      <span>Complete ${neededForReport} more scenario${neededForReport === 1 ? "" : "s"} to unlock your first pattern report.</span>
      <div class="bar-track"><span style="width:${Math.min(100, (p.attempts.length / 5) * 100)}%"></span></div>
    </div>
  ` : patternMap.length ? `
    <div class="profile-mastery-map">
      <strong>Pattern Mastery Map</strong>
      <span>Weakest-first. Drill the lowest score until it improves.</span>
    </div>
    ${patternMap
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, 5)
    .map((row) => `
      <div class="profile-pattern-bar">
        <strong><span>${row.pattern}</span><span>${row.accuracy}% · ${row.total}x</span></strong>
        <div class="bar-track"><span style="width:${row.accuracy}%"></span></div>
      </div>
    `).join("")}
    ${weakestTag ? `<button class="ghost-button pattern-drill-cta" id="profile-pattern-drill" data-filter="${weakestTag.pattern.toLowerCase()}">Drill ${weakestTag.pattern}</button>` : ""}
  ` : `<p class="muted">Answer a few scenarios and your pattern report will build itself here.</p>`;

  document.getElementById("profile-pattern-drill")?.addEventListener("click", (event) => {
    state.scenarioFilter = event.currentTarget.dataset.filter || "";
    startMode("replay");
  });

  renderProfileWeeklyGoal();

  document.getElementById("profile-recent").innerHTML = p.attempts.length ? p.attempts.slice(-8).reverse().map((attempt) => {
    const mode = modeLabelFor(attempt.mode);
    const result = attempt.correct ? "Correct" : "Review";
    const nextStep = attempt.correct ? "Repeat similar pressure" : "Send to Review Queue";
    return `
      <div class="profile-recent-row training-journal-row ${attempt.correct ? "is-correct" : "needs-review"}">
        <div>
          <strong>${attempt.pattern || "Pattern Recognition"}</strong>
          <span>${mode} · ${attempt.answer || "Answered"} · ${timeAgo(attempt.completedAt)}</span>
          <small>${nextStep}</small>
        </div>
        <b>${result}<em>+${Number(attempt.earned || 0).toLocaleString()} XP</em></b>
      </div>
    `;
  }).join("") : `<p class="muted">No completed scenarios yet. Start Training to build your history.</p>`;

  renderReferralCard(p.referralStats ? "ready" : "loading");
  loadReferralStats();
}

function renderEliteDashboard() {
  const { data, rows } = eliteStats();
  const weakest = rows[0] || { pattern: "No data yet", accuracy: 0 };
  const overallAccuracy = data.length ? Math.round((data.filter((item) => item.correct).length / data.length) * 100) : 0;
  const discipline = Math.max(45, Math.min(96, overallAccuracy + 14));
  const overtrade = Math.max(4, 100 - discipline);
  const eliteUnlocked = hasElitePlan();
  const sessions = data.reduce((acc, item) => {
    const key = item.session || "New York Open";
    acc[key] = acc[key] || { total: 0, correct: 0 };
    acc[key].total += 1;
    if (item.correct) acc[key].correct += 1;
    return acc;
  }, {});
  const bestSession = Object.entries(sessions)
    .map(([name, stats]) => ({ name, rate: Math.round((stats.correct / stats.total) * 100) }))
    .sort((a, b) => b.rate - a.rate)[0]?.name || "New York Open";
  const communityAverageXp = 1240;
  const archetype = progress().traderArchetype || (overallAccuracy >= 70 ? "Pattern Sniper" : overallAccuracy >= 45 ? "Structure Builder" : "Replay Grinder");
  document.getElementById("elite").classList.toggle("elite-locked-preview", !eliteUnlocked);

  document.getElementById("elite-weakest").textContent = weakest.pattern;
  document.getElementById("elite-weakness-copy").textContent =
    eliteUnlocked
      ? `${weakest.pattern} is currently your highest-priority training focus. Elite will build drills around this until accuracy improves.`
      : `Preview: Elite turns your weakest setup into targeted drills, custom filters, a mistake journal, and weekly curriculum. Choose Elite to activate the buttons below.`;
  document.getElementById("elite-accuracy").textContent = `${overallAccuracy}%`;
  document.getElementById("elite-discipline").textContent = discipline;
  document.getElementById("elite-overtrade").textContent = overtrade;
  document.getElementById("elite-speed").textContent = `${Math.max(6, 18 - data.length)}s`;

  document.getElementById("elite-bars").innerHTML = rows.slice(0, 4).map((row) => `
    <div class="elite-bar">
      <strong>${row.pattern} · ${row.accuracy}%</strong>
      <div class="bar-track"><span style="width:${row.accuracy}%"></span></div>
    </div>
  `).join("");

  const playlist = rows.slice(0, 4).map((row, index) => `
    <div class="playlist-item">
      <strong>${index + 1}. ${row.pattern} Drill</strong>
      <span>${5 + index * 2} targeted scenarios · ${row.accuracy}% current accuracy</span>
    </div>
  `).join("");
  document.getElementById("elite-playlist").innerHTML = playlist;
  document.getElementById("start-elite-playlist").textContent = eliteUnlocked ? "Start Custom Playlist" : "Unlock Elite Playlist";
  document.getElementById("apply-elite-filters").textContent = eliteUnlocked ? "Build Filtered Drill" : "Unlock Elite Filters";

  const mistakes = data.filter((item) => !item.correct).slice(-4).reverse();
  document.getElementById("mistake-journal").innerHTML = mistakes.length ? mistakes.map((item) => `
    <div class="journal-item">
      <strong>${item.pattern || "Pattern Recognition"}</strong>
      <span>You missed this in ${item.mode || "replay"} mode. Review acceptance, rejection, and whether the setup deserved action.</span>
    </div>
  `).join("") : `<div class="journal-item"><strong>No mistakes yet</strong><span>Answer more scenarios to build your mistake journal.</span></div>`;

  document.getElementById("weekly-report").innerHTML = `
    <div class="elite-insight-grid">
      <div><span>7-day accuracy trend</span><b class="elite-trend-line"><i style="height:34%"></i><i style="height:48%"></i><i style="height:42%"></i><i style="height:62%"></i><i style="height:56%"></i><i style="height:70%"></i><i style="height:${Math.max(18, overallAccuracy)}%"></i></b></div>
      <div><span>Most missed pattern</span><strong>${weakest.pattern}</strong></div>
      <div><span>Best session time</span><strong>${bestSession}</strong></div>
      <div><span>Total XP vs community</span><strong>${progress().xp.toLocaleString()} / ${communityAverageXp.toLocaleString()}</strong></div>
      <div><span>Your trader archetype</span><strong>${archetype}</strong></div>
    </div>
  `;

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const topics = [weakest.pattern, "VWAP decision quality", "No-trade discipline", "Liquidity sweep review", "Ranked pressure test", "Trade Mode scoring", "Progress check"];
  document.getElementById("elite-curriculum").innerHTML = days.map((day, index) => `
    <div class="curriculum-item"><strong>${day}</strong><span>${topics[index]}</span></div>
  `).join("");
}

function startElitePlaylist() {
  if (!hasElitePlan()) {
    openUpgradeModal("elitePlaylist");
    return;
  }

  state.activeMode = "replay";
  state.scenarioIndex = findNextUnanswered(SHARED_SCENARIO_COUNT + stringSeed(document.getElementById("elite-weakest").textContent || "elite") % 9000);
  navigateTo("game");
  applyModeUi();
  renderScenario();
}

function applyEliteFilters() {
  if (!hasElitePlan()) {
    openUpgradeModal("eliteFilters");
    return;
  }

  const market = document.getElementById("elite-filter-market").value;
  const setup = document.getElementById("elite-filter-setup").value;
  const difficulty = document.getElementById("elite-filter-difficulty").value;
  const key = `${market}-${setup}-${difficulty}`;
  state.activeMode = "replay";
  state.scenarioIndex = findNextUnanswered(SHARED_SCENARIO_COUNT + stringSeed(key) % 50000);
  navigateTo("game");
  applyModeUi();
  renderScenario();
}

document.getElementById("next-scenario").addEventListener("click", () => {
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }
  state.learningOpenKey = "";
  resetModeState();
  state.scenarioIndex = state.activeMode === "review"
    ? reviewQueueScenarioIndex()
    : state.activeMode === "daily"
      ? dailyScenarioIndex()
      : findNextProgressiveScenario(state.scenarioIndex + 1, 1, state.activeMode);
  saveNextScenarioForMode(state.activeMode, state.scenarioIndex);
  renderScenario();
});

els.resultNext?.addEventListener("click", () => {
  document.getElementById("next-scenario").click();
});

els.learningClose?.addEventListener("click", () => closeLearningMoment(true));

els.learningPrev?.addEventListener("click", () => {
  if (state.learningSlideIndex <= 0) return;
  state.learningSlideIndex -= 1;
  renderLearningSlide();
});

els.learningNext?.addEventListener("click", () => {
  if (state.learningSlideIndex >= state.learningSlides.length - 1) {
    closeLearningMoment(true);
    return;
  }
  state.learningSlideIndex += 1;
  renderLearningSlide();
});

document.getElementById("previous-scenario").addEventListener("click", () => {
  state.learningOpenKey = "";
  resetModeState();
  state.scenarioIndex = findNextUnanswered(state.scenarioIndex - 1, -1);
  saveNextScenarioForMode(state.activeMode, state.scenarioIndex);
  renderScenario();
});

document.getElementById("reset-progress").addEventListener("click", () => {
  localStorage.removeItem("tradePulseProgress");
  sessionStorage.removeItem("tradePulseVisitStarted");
  state.progress = defaultProgress();
  renderScenario();
  updateProgressUi();
  applyModeUi();
  updateLogoutButtons();
});

document.querySelectorAll(".mode-start").forEach((button) => {
  button.addEventListener("click", () => startMode(button.dataset.mode || "replay"));
});

document.getElementById("start-free-replay")?.addEventListener("click", () => {
  const p = progress();
  p.anonymousAccess = true;
  p.marketPreference ||= "NQ";
  p.experienceLevel ||= "Beginner";
  saveProgress();
  startMode("replay");
});

document.querySelectorAll("#confidence-picker button").forEach((button) => {
  button.addEventListener("click", () => {
    state.confidence = button.dataset.confidence;
    document.querySelectorAll("#confidence-picker button").forEach((item) => item.classList.toggle("active", item === button));
    const copy = {
      low: "Low confidence has no XP modifier.",
      medium: "Medium confidence earns a 15% correct-answer bonus.",
      high: "High confidence earns 1.5x XP when correct, but hurts discipline when wrong."
    };
    document.getElementById("confidence-copy").textContent = copy[state.confidence];
  });
});

document.querySelectorAll("#trade-direction button").forEach((button) => {
  button.addEventListener("click", () => {
    state.tradeDirection = button.dataset.direction;
    document.querySelectorAll("#trade-direction button").forEach((item) => item.classList.toggle("active", item === button));
  });
});

["trade-entry", "trade-stop", "trade-target"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    updateTradePreview();
    drawChart();
  });
});

els.chart?.addEventListener("pointerdown", (event) => {
  if (state.activeMode !== "trade" || state.revealed) return;
  const point = canvasPoint(event);
  const marker = nearestTradeMarker(point.y);
  if (!marker) return;
  state.tradeDragMarker = marker;
  els.chart.setPointerCapture?.(event.pointerId);
  els.chart.classList.add("dragging-trade-line");
  updateTradeMarkerFromPointer(event);
});

els.chart?.addEventListener("pointermove", (event) => {
  if (state.tradeDragMarker) updateTradeMarkerFromPointer(event);
});

["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  els.chart?.addEventListener(eventName, () => {
    state.tradeDragMarker = null;
    els.chart.classList.remove("dragging-trade-line");
    drawChart();
  });
});

document.getElementById("submit-trade").addEventListener("click", submitTradeBuilder);
document.getElementById("submit-thesis").addEventListener("click", submitThesisBuilder);
document.getElementById("show-clue").addEventListener("click", () => {
  const chartFrame = document.querySelector(".chart-frame");
  renderResultClueMarker(getScenario(state.scenarioIndex));
  chartFrame.classList.remove("clue-focus");
  requestAnimationFrame(() => chartFrame.classList.add("clue-focus"));
  chartFrame.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("similar-scenario").addEventListener("click", () => {
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }
  const scenario = getScenario(state.scenarioIndex);
  const similarIndex = findSimilarScenarioIndex(scenario);
  resetModeState();
  state.scenarioIndex = similarIndex;
  saveNextScenarioForMode(state.activeMode, similarIndex);
  renderScenario();
  document.getElementById("trainer").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.saveReviewQueue?.addEventListener("click", () => {
  const p = progress();
  const scenario = getScenario(state.scenarioIndex);
  p.reviewQueue ||= [];
  p.reviewQueueMeta ||= {};
  if (!p.reviewQueue.includes(scenario.id)) {
    p.reviewQueue.push(scenario.id);
    p.reviewQueueMeta[scenario.id] = {
      scenarioId: scenario.id,
      wrongAt: Date.now(),
      reviewedAt: null,
      wrongCount: Number(p.reviewQueueMeta[scenario.id]?.wrongCount || 0),
      patternTags: scenarioPatternTags(scenario)
    };
    saveProgress();
    showToast("Saved to Review Queue.", "success");
  } else {
    showToast("Already in Review Queue.", "success");
  }
  els.saveReviewQueue.classList.add("saved");
  els.saveReviewQueue.querySelector("strong").textContent = "Saved to Review Queue";
});
document.getElementById("replay-restart").addEventListener("click", () => {
  stopReplay();
  state.revealCount = 0;
  drawChart();
});
document.getElementById("replay-step-back").addEventListener("click", () => {
  stopReplay();
  state.revealCount = Math.max(0, state.revealCount - 1);
  drawChart();
});
document.getElementById("replay-step-forward").addEventListener("click", () => {
  stopReplay();
  if (!state.revealed) return;
  state.revealCount = Math.min(futureCandleCount(), state.revealCount + 1);
  drawChart();
});
document.getElementById("replay-play").addEventListener("click", playReplay);
document.querySelectorAll("#speed-control button").forEach((button) => {
  button.addEventListener("click", () => {
    const wasPlaying = state.replayPlaying;
    stopReplay();
    state.replaySpeed = Number(button.dataset.speed);
    updateReplayControls();
    if (wasPlaying) playReplay();
  });
});

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.viewTarget || button.dataset.pageTarget || "home");
    if (window.innerWidth < 768) setSidebarOpen(false);
  });
});

document.addEventListener("click", (event) => {
  const shelfViewAll = event.target.closest(".mode-shelf-view");
  if (!shelfViewAll) return;
  event.preventDefault();
  navigateTo("catalog");
});

document.addEventListener("click", (event) => {
  const catalogCard = event.target.closest(".catalog-mode-card");
  if (!catalogCard) return;
  startMode(catalogCard.dataset.mode || "replay");
});

document.getElementById("brand-home").addEventListener("click", () => {
  navigateTo("home");
});

els.topbarBack?.addEventListener("click", () => {
  navigateTo("home");
});

els.gameHelp?.addEventListener("click", () => {
  openGameWalkthrough(state.activeMode, { forced: true });
});

els.topbarRankPill?.addEventListener("click", () => {
  navigateTo("profile");
});

els.submitAnswer?.addEventListener("click", submitPendingAnswer);

document.getElementById("start-elite-playlist").addEventListener("click", startElitePlaylist);
document.getElementById("apply-elite-filters").addEventListener("click", applyEliteFilters);

els.modeSearch?.addEventListener("input", () => {
  const query = els.modeSearch.value.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll(".game-mode-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    const hidden = Boolean(query && !text.includes(query));
    card.classList.toggle("search-hidden", hidden);
    if (!hidden) visibleCount += 1;
  });
  updateModeShelfVisibility();
  document.getElementById("mode-search-empty")?.classList.toggle("hidden", visibleCount > 0);
});

els.catalogSearch?.addEventListener("input", renderGameCatalog);

document.querySelectorAll("#scenario-filter-pills button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "";
    state.scenarioFilter = filter;
    document.querySelectorAll("#scenario-filter-pills button").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".game-mode-card").forEach((card) => card.classList.remove("search-hidden"));
    updateModeShelfVisibility();
    document.getElementById("mode-search-empty")?.classList.add("hidden");
    const label = filter ? `${button.textContent.trim()} replays selected for your next Blind Replay.` : "All replay patterns selected.";
    showToast(label, "success");
  });
});

document.addEventListener("click", (event) => {
  const arrow = event.target.closest(".mode-shelf-arrow, .mode-grid-arrow");
  if (!arrow) return;
  const shelf = arrow.closest(".mode-shelf");
  const track = shelf?.querySelector(".mode-shelf-track") || document.querySelector(".mode-shelf-track");
  if (!track) return;
  const direction = Number(arrow.dataset.direction || (arrow.textContent.includes("‹") ? -1 : 1));
  track.scrollBy({ left: direction * Math.max(260, track.clientWidth * 0.72), behavior: "smooth" });
});

setInterval(() => {
  const replays = document.getElementById("proof-replays");
  const traders = document.getElementById("proof-traders");
  if (replays) {
    const next = Number(replays.textContent.replace(/\D/g, "") || 248901) + (1 + Math.floor(Math.random() * 3));
    replays.textContent = next.toLocaleString();
  }
  if (traders && Math.random() > 0.72) {
    const next = Number(traders.textContent.replace(/\D/g, "") || 1400) + 1;
    traders.textContent = next.toLocaleString();
  }
}, 30000);

els.bookmarkScenario?.addEventListener("click", () => {
  if (!hasAccess("bookmarks")) {
    showToast("Upgrade to Coach to bookmark scenarios.", "warning");
    openUpgradeModal("bookmarks");
    return;
  }
  const p = progress();
  const scenario = getScenario(state.scenarioIndex);
  p.bookmarks ||= [];
  const exists = p.bookmarks.includes(scenario.id);
  p.bookmarks = exists ? p.bookmarks.filter((id) => id !== scenario.id) : [...p.bookmarks, scenario.id];
  saveProgress();
  els.bookmarkScenario.classList.toggle("saved", !exists);
  showToast(exists ? "Bookmark removed." : "Scenario bookmarked.", "success");
});

els.weeklyDigestToggle?.addEventListener("change", async () => {
  if (!hasAccess("weeklyDigest")) {
    els.weeklyDigestToggle.checked = false;
    showToast("Weekly Digest is Coach Plan only.", "warning");
    openUpgradeModal("weeklyDigest");
    return;
  }
  const p = progress();
  p.digestEnabled = els.weeklyDigestToggle.checked;
  saveProgress();
  try {
    await fetch("/api/digest-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: p.signup?.email || p.inviteEmail || "",
        name: p.signup?.name || "",
        enabled: p.digestEnabled
      })
    });
    showToast(p.digestEnabled ? "Weekly Digest enabled." : "Weekly Digest disabled.", "success");
  } catch {
    showToast("Digest preference saved locally. Server sync failed.", "warning");
  }
});

document.querySelectorAll(".premium-lock").forEach((button) => {
  button.addEventListener("click", (event) => {
    const feature = button.dataset.feature;
    if (feature && !hasAccess(feature)) {
      event.preventDefault();
      event.stopPropagation();
      openUpgradeModal(feature);
    }
  }, true);
});

document.getElementById("side-billing")?.addEventListener("click", () => {
  if (progress().subscriptionStatus?.active) {
    openBillingPortal();
    return;
  }
  navigateTo("profile");
  showToast("Billing appears after you start a paid subscription.", "warning");
});

els.sidebarToggle?.addEventListener("click", toggleSidebar);
els.sidebarBackdrop?.addEventListener("click", () => setSidebarOpen(false));

document.getElementById("exit-game").addEventListener("click", () => {
  navigateTo("home");
});

els.quickStart?.addEventListener("click", () => {
  const p = progress();
  p.signup ||= {};
  p.signup.market = els.quickMarket?.value || p.signup.market || "NQ";
  p.signup.experience = els.quickExperience?.value || p.signup.experience || "Beginner";
  saveProgress();
  els.onboardingModal?.classList.add("hidden");
  els.onboardingModal?.setAttribute("aria-hidden", "true");
  localStorage.setItem("tradePulseOnboardingSeen", "true");
  const firstLesson = typeof academyNextLesson === "function" ? academyNextLesson() : null;
  if (firstLesson && typeof openAcademyLesson === "function") openAcademyLesson(firstLesson.lesson.id);
  else navigateTo("academy");
});

els.closeOnboarding?.addEventListener("click", () => {
  els.onboardingModal?.classList.add("hidden");
  els.onboardingModal?.setAttribute("aria-hidden", "true");
  localStorage.setItem("tradePulseOnboardingSeen", "true");
  if (typeof maybeStartFeatureTour === "function") maybeStartFeatureTour();
});

if (!localStorage.getItem("tradePulseOnboardingSeen") && els.onboardingModal) {
  setTimeout(() => {
    els.onboardingModal.classList.remove("hidden");
    els.onboardingModal.setAttribute("aria-hidden", "false");
  }, 650);
}

[els.googleSignin, els.heroGoogleSignin].forEach((button) => {
  button?.addEventListener("click", startGoogleSignin);
});

gate.signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const p = progress();
  p.signup = {
    name: document.getElementById("signup-name").value,
    email: document.getElementById("signup-email").value,
    experience: document.getElementById("signup-experience").value,
    market: document.getElementById("signup-market").value,
    referredBy: p.referredBy || ""
  };
  startFreshScenarioSession();
  saveProgress();
  saveLead("free_signup", {
    name: p.signup.name,
    email: p.signup.email,
    plan: "Free",
    details: {
      experience: p.signup.experience,
      market: p.signup.market,
      mode: state.activeMode
    }
  });
  syncReferralSignup();
  closeModals();
  refreshSubscriptionStatus();
  startMode(state.activeMode);
});

document.getElementById("close-signup").addEventListener("click", () => {
  gate.signupModal.classList.add("hidden");
});
gate.closePaywall.addEventListener("click", closeModals);

document.getElementById("manage-billing").addEventListener("click", openBillingPortal);
document.getElementById("logout-profile")?.addEventListener("click", logoutUser);
document.getElementById("menu-logout").addEventListener("click", () => {
  logoutUser();
});

document.querySelectorAll(".plan-button").forEach((button) => {
  button.addEventListener("click", async () => {
    if (button.disabled) return;
    const p = progress();
    const selectedPlan = button.dataset.plan;
    p.pendingPlan = selectedPlan;
    saveProgress();
    saveLead("plan_selected", {
      name: p.signup?.name || "",
      email: p.signup?.email || p.inviteEmail || "",
      plan: selectedPlan,
      details: {
        xp: p.xp,
        freePlaysUsed: p.freePlaysUsed,
        attempts: p.attempts.length
      }
    });
    await startCheckout(selectedPlan, false, button);
    closeModals();
    await refreshSubscriptionStatus();
    applyModeUi();
    updateProgressUi();
  });
});

document.getElementById("share-button")?.addEventListener("click", async () => {
  const text = "ReplayEdge: a gamified market replay trainer for pattern recognition practice.";
  if (navigator.share) {
    await navigator.share({ title: "ReplayEdge", text });
  } else {
    await navigator.clipboard.writeText(text);
    const shareLabel = document.getElementById("share-label");
    if (shareLabel) shareLabel.textContent = "Copied";
    showToast("Copied to clipboard.", "success");
    setTimeout(() => {
      if (shareLabel) shareLabel.textContent = "Share";
    }, 1300);
  }
});

els.copyReferral?.addEventListener("click", async () => {
  await navigator.clipboard.writeText(referralCode());
  showToast("Referral code copied.", "success");
});

document.getElementById("profile-referral-card")?.addEventListener("click", async (event) => {
  const generateButton = event.target.closest("#referral-generate");
  const retryButton = event.target.closest("#referral-retry");
  const copyButton = event.target.closest("#profile-copy-referral");
  const shareButton = event.target.closest("#profile-share-referral");
  const code = progress().referralCode;
  const link = referralLink(code);

  if (generateButton) {
    await generateReferralCode();
    return;
  }

  if (retryButton) {
    await loadReferralStats(true);
    return;
  }

  if (copyButton && code) {
    await navigator.clipboard.writeText(link);
    copyButton.textContent = "Copied!";
    showToast("Referral link copied.", "success");
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 2000);
    return;
  }

  if (shareButton && code) {
    if (navigator.share) {
      await navigator.share({
        title: "ReplayEdge",
        text: `Train your chart eye with ReplayEdge: ${link}`
      });
    } else {
      await navigator.clipboard.writeText(link);
      showToast("Referral link copied.", "success");
    }
  }
});

els.copyChallenge?.addEventListener("click", async () => {
  const scenario = getScenario(state.scenarioIndex || 0);
  const url = `${location.origin}${location.pathname}#challenge-${scenario.id}`;
  await navigator.clipboard.writeText(url);
  showToast("Challenge link copied.", "success");
});

els.copyShareCard?.addEventListener("click", async () => {
  const p = progress();
  const text = `ReplayEdge stats: ${accuracy()}% accuracy, ${Math.max(p.streak, p.topStreak)} day streak, ${rankFromXp(p.xp)} rank. Can you beat my replay score?`;
  await navigator.clipboard.writeText(text);
  showToast("Share card text copied.", "success");
});

document.getElementById("dismiss-beta")?.addEventListener("click", () => {
  sessionStorage.setItem("betaBannerDismissedAt", String(Date.now()));
  els.betaBanner?.classList.add("hidden");
  renderNotificationSlot();
});

document.getElementById("open-feedback")?.addEventListener("click", () => {
  els.feedbackModal?.classList.remove("hidden");
});

document.getElementById("close-feedback")?.addEventListener("click", () => {
  els.feedbackModal?.classList.add("hidden");
});

document.getElementById("feedback-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  checkoutButtonLoading(button, true, "Sending...");
  try {
    const payload = {
      email: progress().signup?.email || progress().inviteEmail || "",
      page: state.currentView,
      rating: document.getElementById("feedback-rating").value,
      message: document.getElementById("feedback-message").value
    };
    if (location.protocol !== "file:") {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Could not save feedback");
    }
    showToast("Feedback sent. Thank you.", "success");
    document.getElementById("feedback-message").value = "";
    els.feedbackModal?.classList.add("hidden");
  } catch {
    showToast("Feedback saved locally failed to sync. Try again in a moment.", "warning");
  } finally {
    checkoutButtonLoading(button, false);
  }
});

document.querySelectorAll(".billing-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".billing-option").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const period = button.dataset.billing || "monthly";
    state.billingPeriod = period;
    document.querySelector(".plans-section")?.classList.toggle("annual-pricing", period === "annual");
    document.querySelectorAll(".plan-price").forEach((price) => {
      const current = price.dataset[period] || price.textContent;
      const old = price.dataset[`old${period.charAt(0).toUpperCase()}${period.slice(1)}`];
      const discount = price.dataset.discount;
      const deal = price.dataset.deal;
      if (old && discount) {
        price.innerHTML = `<small><s>${old}</s><em>${discount}</em></small><b>${current}</b>`;
      } else if (deal) {
        price.innerHTML = `<small>${deal}</small><b>${current}</b>`;
      } else {
        price.textContent = current;
      }
    });
  });
});

function assistantMessages() {
  try {
    return JSON.parse(sessionStorage.getItem("tradePulseAssistantMessages") || "[]");
  } catch {
    return [];
  }
}

function saveAssistantMessages(messages) {
  sessionStorage.setItem("tradePulseAssistantMessages", JSON.stringify(messages.slice(-20)));
}

function renderAssistantMessages(typing = false) {
  if (!els.assistantMessages) return;
  const messages = assistantMessages();
  els.assistantMessages.innerHTML = messages.map((message) => `
    <div class="assistant-bubble ${message.role === "user" ? "user" : "assistant"}">${message.content}</div>
  `).join("") + (typing ? `<div class="assistant-bubble assistant typing"><i></i><i></i><i></i></div>` : "");
  els.assistantMessages.scrollTop = els.assistantMessages.scrollHeight;
}

function seedAssistantGreeting() {
  const messages = assistantMessages();
  if (messages.length) return;
  saveAssistantMessages([{
    role: "assistant",
    content: "Hey! 👋 I'm your ReplayEdge assistant. I can tell you exactly what to train next, explain streaks and unlocks, or handle plan questions — ask away or tap a quick question below."
  }]);
}

function openAssistant() {
  seedAssistantGreeting();
  renderAssistantMessages();
  if (typeof renderAssistantChips === "function") renderAssistantChips();
  els.assistantPanel?.classList.remove("hidden");
  els.assistantNotification?.classList.add("hidden");
  sessionStorage.setItem("tradePulseAssistantOpened", "true");
  setTimeout(() => els.assistantInput?.focus(), 50);
}

function closeAssistant() {
  els.assistantPanel?.classList.add("hidden");
}

els.assistantFab?.addEventListener("click", openAssistant);
els.assistantClose?.addEventListener("click", closeAssistant);

function assistantAsk(text) {
  const clean = String(text || "").trim();
  if (!clean) return;
  saveAssistantMessages([...assistantMessages(), { role: "user", content: clean }]);
  if (els.assistantInput) els.assistantInput.value = "";
  renderAssistantMessages(true);
  setTimeout(() => {
    const reply = typeof assistantBrain === "function"
      ? assistantBrain(clean)
      : "I can help with plans, streaks, unlocks, and training — what do you need?";
    saveAssistantMessages([...assistantMessages(), { role: "assistant", content: reply }]);
    renderAssistantMessages();
  }, 550);
}

els.assistantForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  assistantAsk(els.assistantInput?.value);
});

if (els.assistantNotification && sessionStorage.getItem("tradePulseAssistantOpened")) {
  els.assistantNotification.classList.add("hidden");
}

document.getElementById("close-return-recap")?.addEventListener("click", () => {
  if (els.returnRecap?.dataset.noticeType?.startsWith("streak")) {
    sessionStorage.setItem("streakNoticeDismissed", "1");
    delete els.returnRecap.dataset.noticeType;
  }
  const summary = returnRecapSummary();
  localStorage.setItem("lastSessionDismissedAt", String(summary?.endedAt || Date.now()));
  renderNotificationSlot();
});

document.getElementById("exit-close")?.addEventListener("click", () => {
  els.exitIntent?.classList.add("hidden");
});

document.getElementById("exit-claim")?.addEventListener("click", () => {
  els.exitIntent?.classList.add("hidden");
  openSignup();
});

document.addEventListener("mouseleave", (event) => {
  if (event.clientY > 8) return;
  if (hasSignup() || hasPaidPlan() || sessionStorage.getItem("tradePulseExitIntentShown")) return;
  sessionStorage.setItem("tradePulseExitIntentShown", "true");
  els.exitIntent?.classList.remove("hidden");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.learningModal?.classList.contains("hidden")) {
    closeLearningMoment(true);
    return;
  }
  if (!els.learningModal?.classList.contains("hidden")) return;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  if (document.body.dataset.view !== "game") return;
  if (event.key === "Escape") {
    navigateTo("home");
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    playReplay();
    return;
  }
  if (/^[1-5]$/.test(event.key) && !state.revealed) {
    const button = els.answers.querySelectorAll("button")[Number(event.key) - 1];
    if (button && !button.disabled) button.click();
  }
  if (event.key === "Enter") {
    if (state.revealed) document.getElementById("next-scenario").click();
    else submitPendingAnswer();
  }
  if (event.key.toLowerCase() === "n" && state.revealed) {
    document.getElementById("next-scenario").click();
  }
});

window.addEventListener("hashchange", () => {
  navigateTo(window.location.hash.replace("#", "") || "home", { fromHash: true });
});

document.getElementById("invite-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = event.currentTarget.querySelector("button");
  if (submitButton.disabled) return;
  const name = document.getElementById("invite-name").value;
  const email = document.getElementById("invite-email").value;
  const p = progress();
  p.inviteEmail = email;
  p.signup = {
    name,
    email,
    experience: "Trial user",
    market: "Not selected yet"
  };
  p.plan = null;
  p.trialPlan = "Player";
  p.trialStartedAt = Date.now();
  p.trialEndsAt = Date.now() + 3 * 24 * 60 * 60 * 1000;
  startFreshScenarioSession();
  saveProgress();
  saveLead("trial_started", {
    name,
    email,
    plan: "Player after 3-day trial",
    details: {
      trialStartedAt: p.trialStartedAt,
      trialEndsAt: p.trialEndsAt,
      autoBillingAmount: "$24.99/month"
    }
  });
  updateProgressUi();
  applyModeUi();
  submitButton.textContent = "Trial started";
  await startCheckout("Player", true, submitButton);
  await refreshSubscriptionStatus();
});

window.addEventListener("resize", () => {
  drawChart();
  drawPreviewCharts();
});

window.addEventListener("load", () => {
  if (window.lucide) window.lucide.createIcons();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }
});

function prepareVisitScenarioSession() {
  const p = progress();
  if (!p.sessionStartIndex) {
    p.sessionStartIndex = freshScenarioBase();
    saveProgress();
  }

  if (hasSignup() && !sessionStorage.getItem("tradePulseVisitStarted")) {
    maybeShowReturnRecap();
    applyMissedDayFreeze();
    startFreshScenarioSession();
    sessionStorage.setItem("tradePulseVisitStarted", String(Date.now()));
  }

  state.scenarioIndex = nextScenarioForMode(state.activeMode);
}

prepareVisitScenarioSession();
captureReferralFromUrl();
syncSidebarToggle();
refreshSubscriptionStatus();
handleGoogleAuthReturn();
renderBusinessFoundation();
loadScenarioLibrary();
drawPreviewCharts();
updateProgressUi();
applyModeUi();
renderScenario();
updateAudioToggle();
applyTheme();
navigateTo(window.location.hash.replace("#", "") || "home", { fromHash: true, scroll: false });
setInterval(updateMarketTape, 4000);
setInterval(updateGameCards, 30000);
setInterval(() => {
  if (!els.waitlistCount) return;
  const next = Number(els.waitlistCount.textContent.replace(/\D/g, "") || 1407) + (1 + Math.floor(Math.random() * 3));
  els.waitlistCount.textContent = next.toLocaleString();
}, 4500);
