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
  return [...String(text || "tradepulse")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
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
    await Promise.all([0, 1, 2].map(loadScenarioFile));
    renderScenario();
    updateGameCards();
  } catch (error) {
    console.warn("Using built-in scenario fallback.", error.message);
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
  const p = progress();
  if (!p.lastLoginAt || !p.streak) return;
  const daysAway = Math.floor((Date.now() - Number(p.lastLoginAt)) / 86400000);
  if (daysAway <= 1) return;
  if (hasAccess("streakFreeze") && Number(p.streakFreezes || 0) > 0) {
    p.streakFreezes = Number(p.streakFreezes || 0) - 1;
    showToast("Streak Freeze used — streak protected.", "success");
  } else {
    p.streak = 0;
  }
}

function maybeShowReturnRecap() {
  const p = progress();
  if (!p.lastLoginAt || sessionStorage.getItem("tradePulseReturnRecapShown")) return;
  const hoursAway = (Date.now() - Number(p.lastLoginAt)) / 3600000;
  if (hoursAway < 12 || !els.returnRecap) return;
  const summary = p.lastSessionSummary || {
    count: Math.min(5, p.attempts.length),
    correct: p.attempts.slice(-5).filter((attempt) => attempt.correct).length,
    xp: p.attempts.slice(-5).reduce((sum, attempt) => sum + Number(attempt.earned || 0), 0)
  };
  if (!summary.count) return;
  document.getElementById("return-recap-copy").textContent =
    `Last session: ${summary.count} scenarios, ${summary.correct} correct, +${summary.xp || 0} XP. Ready to continue?`;
  els.returnRecap.classList.remove("hidden");
  sessionStorage.setItem("tradePulseReturnRecapShown", "true");
}

function nextScenarioForMode(mode) {
  const p = progress();
  p.nextByMode ||= {};
  if (!p.sessionStartIndex) p.sessionStartIndex = freshScenarioBase();

  const savedIndex = Number(p.nextByMode[mode]);
  const baseIndex = Number.isFinite(savedIndex) ? savedIndex : Number(p.sessionStartIndex);
  const index = findNextUnanswered(baseIndex, 1, mode);
  p.nextByMode[mode] = index;
  saveProgress();
  return index;
}

function saveNextScenarioForMode(mode, fromIndex) {
  const p = progress();
  p.nextByMode ||= {};
  p.nextByMode[mode] = findNextUnanswered(fromIndex, 1, mode);
  saveProgress();
}

const achievements = [
  { label: "10 Streak", value: "10", color: "green" },
  { label: "100 Scenarios", value: "100", color: "purple" },
  { label: "80% Accuracy", value: "80%", color: "blue" },
  { label: "5 Perfect Reads", value: "5", color: "gold" }
];

const rankTiers = [
  { name: "Rookie", xp: 0, gem: "quartz", icon: "R" },
  { name: "Scalper", xp: 70, gem: "emerald", icon: "S" },
  { name: "Sniper", xp: 180, gem: "sapphire", icon: "N" },
  { name: "Pro", xp: 360, gem: "amethyst", icon: "P" },
  { name: "Master", xp: 650, gem: "ruby", icon: "M" },
  { name: "Funded", xp: 1000, gem: "diamond", icon: "F" }
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
  pendingAnswer: null,
  timerRunning: false,
  timerStartedAt: 0,
  timerDuration: 20000,
  timerRaf: null,
  timerWarningPlayed: false,
  audioMuted: true,
  learningSlides: [],
  learningSlideIndex: 0,
  subscriptionPlanStatus: "unknown",
  billingPeriod: "monthly",
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
els.resultNext = document.getElementById("result-next");
els.leaderboardFull = document.getElementById("leaderboard-full");
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
els.modeSearch = document.getElementById("mode-search");
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
  if (view !== "game" && previousView === "game") stopDecisionTimer();
  if (view === "game" && !state.revealed) startDecisionTimer();
  if (view === "profile") renderProfile();
  if (view === "elite") renderEliteDashboard();
  if (view === "leaderboard") renderLeaderboard();

  if (!options.fromHash && window.location.hash !== `#${view}`) {
    history.pushState({ view }, "", `#${view}`);
  }
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
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
    referralCredits: 0,
    digestEnabled: false,
    traderArchetype: null,
    anonymousAccess: false,
    sessionAttemptStart: 0,
    lastSessionSummary: null,
    weeklyAccuracySnapshots: []
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
}

async function saveLead(type, payload) {
  const entry = {
    type,
    source: "TradePulse prototype",
    ...payload
  };

  const p = progress();
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

async function startCheckout(plan, trial = false, triggerButton = null) {
  const p = progress();
  if (location.protocol === "file:") {
    showToast("Open http://localhost:4173 to use Stripe checkout. This file view can only run the demo.", "warning");
    return false;
  }

  try {
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
    showToast(`Checkout setup needs attention: ${error.message}`, "error");
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
  els.audioToggle.innerHTML = `<i data-lucide="${state.audioMuted ? "volume-x" : "volume-2"}"></i><span>${state.audioMuted ? "Muted" : "Sound On"}</span>`;
  if (window.lucide) window.lucide.createIcons();
}

function canUseDecisionTimer() {
  return state.currentView === "game" && ["replay", "daily", "ranked", "notrade", "detective"].includes(state.activeMode);
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

function logoutUser() {
  const ok = confirm("Logout clears this browser's current TradePulse profile and training session. Your Stripe subscription is not cancelled. Continue?");
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

function rankFromXp(xp) {
  if (xp >= 1000) return "Funded";
  if (xp >= 650) return "Master";
  if (xp >= 360) return "Pro";
  if (xp >= 180) return "Sniper";
  if (xp >= 70) return "Scalper";
  return "Rookie";
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
    coachReview: 2,
    reviewQueue: 2,
    weeklyDigest: 2,
    bookmarks: 2,
    thesis: 2,
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
    coachReview: "Coach",
    reviewQueue: "Coach",
    weeklyDigest: "Coach",
    bookmarks: "Coach",
    thesis: "Coach",
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
    Player: ["Unlimited replay access", "Daily, Ranked, and Trade Mode", "XP, streaks, levels, and leaderboards"],
    Coach: ["Review Queue for missed scenarios", "Deeper educational mistake review", "Weekly digest and scenario bookmarks"],
    Elite: ["Elite analytics dashboard", "Streak Freeze Bank", "Priority scenario unlocks and gold leaderboard identity"]
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

function difficultyWinRate(scenario) {
  if (scenario.difficulty === "Hard") return 29 + (scenario.seed % 9);
  if (scenario.difficulty === "Medium") return 46 + (scenario.seed % 12);
  return 66 + (scenario.seed % 14);
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
  return rankTiers.find((tier) => tier.xp > xp) || rankTiers[rankTiers.length - 1];
}

function accuracy() {
  const attempts = progress().attempts;
  if (!attempts.length) return 0;
  return Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100);
}

function updateProgressUi() {
  const p = progress();
  const plan = getUserPlan();
  const level = Math.max(1, Math.floor(p.xp / 500) + 1);
  const currentLevelXp = p.xp % 500;

  els.xp.textContent = p.xp;
  els.streak.textContent = p.streak;
  els.rank.textContent = rankFromXp(p.xp);
  els.heroLevel.textContent = level;
  els.heroXp.textContent = `${currentLevelXp} / 500 XP`;
  els.xpFill.style.width = `${Math.min(100, (currentLevelXp / 500) * 100)}%`;
  els.heroAccuracy.textContent = `${accuracy()}%`;
  els.heroStreak.textContent = `${Math.max(p.topStreak, p.streak)} Days`;
  els.heroScenarios.textContent = p.attempts.length;
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
}

function renderSidebarProgress() {
  const p = progress();
  if (getUserPlan() === "free") {
    document.getElementById("side-progress-rank").textContent = "Free Plan";
    document.getElementById("side-progress-rank").title = "Subscribe to earn XP";
    document.getElementById("side-progress-xp").textContent = "XP locked";
    document.getElementById("side-progress-fill").style.width = "0%";
    document.getElementById("side-progress-next").textContent = "Subscribe to earn XP";
    return;
  }
  const level = Math.max(1, Math.floor(p.xp / 500) + 1);
  const currentLevelXp = p.xp % 500;
  const next = nextRankFromXp(p.xp);
  document.getElementById("side-progress-rank").textContent = `${rankFromXp(p.xp)} · Level ${level}`;
  document.getElementById("side-progress-xp").textContent = `${currentLevelXp} / 500 XP`;
  document.getElementById("side-progress-fill").style.width = `${Math.min(100, (currentLevelXp / 500) * 100)}%`;
  document.getElementById("side-progress-next").textContent = next.xp <= p.xp ? "Top rank reached" : `Next rank: ${next.name}`;
}

function updateFreePlanBanner() {
  if (!els.freePlanBanner) return;
  const isFree = getUserPlan() === "free";
  els.freePlanBanner.classList.toggle("hidden", !isFree);
  if (!isFree) return;
  const left = freePlaysLeft();
  els.freePlanBanner.classList.toggle("used-up", left <= 0);
  els.freePlanBannerCopy.textContent = left > 0
    ? `You're on the Free Plan — ${left} play${left === 1 ? "" : "s"} remaining`
    : "You've used all your free plays";
  if (left <= 0 && !sessionStorage.getItem("tradePulseFreePlanPaywallShown")) {
    sessionStorage.setItem("tradePulseFreePlanPaywallShown", "1");
    setTimeout(() => openUpgradeModal("paid"), 250);
  }
}

function referralCode() {
  const p = progress();
  const seed = p.signup?.email || p.inviteEmail || p.signup?.name || "guest";
  return `TP-${stringSeed(seed).toString(36).toUpperCase().slice(0, 5)}`;
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
  document.querySelectorAll(".coach-mode").forEach((item) => item.classList.toggle("hidden", !hasAccess("reviewQueue")));
  document.querySelectorAll(".plan-tier-badge").forEach((badge) => {
    badge.className = `plan-tier-badge plan-${plan}`;
    badge.textContent = planDisplayName(plan);
  });
  const reviewCount = Math.max(progress().reviewQueue?.length || 0, progress().attempts.filter((attempt) => !attempt.correct).length);
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
  els.paywallProgress.textContent = attempts
    ? `You've earned ${p.xp.toLocaleString()} XP and reached ${rank} rank. Keep your progress moving.`
    : "Start your first replay now and keep every XP point, rank, and streak you earn.";
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
  if (mode === "review") return "Coach";
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
}

function modeLabel(mode) {
  return {
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
  if (!missed.length) return nextScenarioForMode("replay");
  const weakest = weakestPatternTag();
  const prioritized = [
    ...queue.map((scenarioId) => missed.find((attempt) => attempt.scenarioId === scenarioId)).filter(Boolean),
    ...missed
  ].sort((a, b) => {
    const aTags = a.patternTags || [a.pattern || ""];
    const bTags = b.patternTags || [b.pattern || ""];
    return Number(bTags.includes(weakest)) - Number(aTags.includes(weakest));
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

function updateGameCards() {
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

function renderDifficultyBadge(scenario) {
  if (!els.difficultyBadge) return;
  const rate = difficultyWinRate(scenario);
  els.difficultyBadge.className = `difficulty-badge ${scenario.difficulty.toLowerCase()}`;
  els.difficultyBadge.textContent = `${scenario.difficulty} · only ${rate}% accuracy`;
}

function resetModeState() {
  stopReplay();
  state.revealed = false;
  state.revealCount = 0;
  state.selected = null;
  state.confidence = "medium";
  state.tradeDirection = "wait";
  state.survivalRound = 0;
  state.survivalCorrect = 0;
  gate.resultClueMarker.classList.add("hidden");
}

function applyModeUi() {
  const copy = {
    replay: ["Replay Mode", "Switch timeframes, make the call, then reveal the next candles."],
    daily: ["Daily Challenge", "One scenario. One chance. Bonus XP for consistency."],
    ranked: ["Ranked Battle", "Timed decisions with bigger XP and leaderboard pressure."],
    trade: ["Trade Builder", "Choose direction, entry, stop, and target before running the replay."],
    spot: ["Spot the Setup", "Click the chart zone where the highest-value setup forms."],
    survival: ["Candle Survival", "Make a new decision as each group of candles develops."],
    notrade: ["No-Trade Challenge", "Decide whether the setup deserves action or should be skipped."],
    detective: ["Chart Detective", "Find the strongest clue that explains what happens next."],
    thesis: ["Build the Thesis", "Assemble a complete market read instead of guessing one answer."],
    review: ["Review Queue", "Replay only the scenarios you missed so mistakes turn into reps."]
  };
  const active = copy[state.activeMode] || copy.replay;
  gate.activeModeLabel.textContent = active[0];
  gate.activeModeTitle.textContent = active[0];
  gate.activeModeCopy.textContent = `${active[1]} Access: ${hasPaidPlan() ? "Unlimited" : `${freePlaysLeft()} free plays left`}.`;
  gate.tradeForm.classList.toggle("hidden", state.activeMode !== "trade");
  gate.thesisBuilder.classList.toggle("hidden", state.activeMode !== "thesis");
  gate.survivalStatus.classList.toggle("hidden", state.activeMode !== "survival");
  gate.confidencePicker.classList.toggle("hidden", !["replay", "daily", "ranked", "notrade", "detective", "review"].includes(state.activeMode));
  gate.chartHotspots.classList.toggle("hidden", state.activeMode !== "spot" || state.revealed);

  const instructions = {
    replay: "Inspect every timeframe, choose the likely outcome, then rate your confidence.",
    daily: "One scored attempt. Use every timeframe before committing.",
    ranked: "Speed matters, but high-confidence mistakes carry a calibration penalty.",
    trade: "Build the trade first. The simulator scores direction, placement, and risk/reward.",
    spot: "Click one of the glowing chart zones where the key setup is forming.",
    survival: "The chart advances after every choice. Adapt as new candles appear.",
    notrade: "The best trade may be no trade. Protect discipline over activity.",
    detective: "Identify the clue that most strongly supports the replay outcome.",
    thesis: "Complete all five parts of the thesis. Each component is scored separately.",
    review: "This queue focuses on missed scenarios. Slow down and find the clue you skipped last time."
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
  updateReplayControls();
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
  const completed = completedScenario(scenario);
  const maxFuture = futureCandleCount(scenario);
  state.revealed = Boolean(completed);
  state.revealCount = state.revealed ? maxFuture : 0;
  state.selected = completed?.selected || null;
  state.pendingAnswer = null;
  state.confidence = completed?.confidence || state.confidence || "medium";
  stopReplay();
  gate.resultClueMarker.classList.toggle("hidden", !state.revealed);

  els.scenarioId.textContent = scenario.scenarioCode;
  els.title.textContent = scenario.title;
  els.meta.textContent = `${scenario.market} · ${replayDateLabel(scenario)} · ${scenario.difficulty}`;
  els.context.textContent = scenario.context;
  els.tags.textContent = scenario.tags.join(" · ");
  els.question.textContent = scenario.question;
  if (state.activeMode === "ranked") els.question.textContent = `Timed: ${scenario.question}`;
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
  updateTradePreview();
  drawChart();
  if (state.revealed) stopDecisionTimer();
  else startDecisionTimer();
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
  if (state.activeMode === "notrade") return noTradeAnswer(scenario);
  if (state.activeMode === "detective") return detectiveOptions(scenario)[0];
  if (state.activeMode === "survival") return survivalAnswer(scenario, state.survivalRound);
  return scenario.correctAnswer;
}

function currentAnswerOptions(scenario = getScenario(state.scenarioIndex)) {
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

  let answers = currentAnswerOptions(scenario);
  let correctAnswer = currentCorrectAnswer(scenario);

  if (state.activeMode === "survival") {
    document.getElementById("survival-round").textContent = Math.min(5, state.survivalRound + 1);
    document.getElementById("survival-progress").style.width = `${(state.survivalRound / 5) * 100}%`;
    document.getElementById("survival-score").textContent = `${state.survivalCorrect} strong decision${state.survivalCorrect === 1 ? "" : "s"}`;
  }

  const completed = state.revealed ? completedScenario(scenario) : null;
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

function noTradeAnswer(scenario) {
  if (scenario.bias === "chop" || scenario.pattern.includes("Whipsaw") || scenario.pattern.includes("No Trade")) return "Skip the trade";
  if (scenario.bias === "reversal") return "Take the short";
  return "Take the long";
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
  if (state.confidence === "high") return 48;
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
  const modeBonus = state.activeMode === "ranked" ? 80 : state.activeMode === "daily" ? 200 : state.activeMode === "detective" ? 45 : state.activeMode === "notrade" ? 55 : 0;
  const baseEarned = correct ? 120 + modeBonus + confidenceBonus(correct) + Math.min(80, progress().streak * 20) : 20;
  const comboMultiplier = correct && progress().streak >= 2 ? 2 : 1;
  const earned = Math.round(baseEarned * comboMultiplier);
  const sourceButton = [...els.answers.querySelectorAll("button")].find((button) => button.dataset.answer === answer);
  state.lastAnswerRect = sourceButton?.getBoundingClientRect() || null;
  stopDecisionTimer();
  if (!correct && options.activeSelection) {
    sourceButton?.classList.add("wrong-flash");
    shakeGameCard();
    setTimeout(() => sourceButton?.classList.remove("wrong-flash"), 380);
  }
  finishAttempt({ answer, correct, earned, correctAnswer, metadata: { comboMultiplier } });
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

function finishAttempt({ answer, correct, earned, correctAnswer, metadata = {} }) {
  const scenario = getScenario(state.scenarioIndex);
  const p = progress();
  const paid = hasPaidPlan();
  const xpAwarded = getUserPlan() === "free" ? 0 : earned;
  playAnswerSound(correct);
  stopReplay();
  state.selected = answer;
  state.revealed = true;
  p.xp += xpAwarded;
  if (!paid) p.freePlaysUsed = Number(p.freePlaysUsed || 0) + 1;
  p.streak = correct ? p.streak + 1 : 0;
  p.topStreak = Math.max(p.topStreak, p.streak);
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
    ...metadata
  };
  p.attempts.push(attempt);
  if (!correct) {
    p.reviewQueue ||= [];
    if (!p.reviewQueue.includes(scenario.id)) p.reviewQueue.push(scenario.id);
  }
  p.completed[completionKey(scenario.id)] = { selected: answer, correct, earned: xpAwarded, correctAnswer, confidence: state.confidence, ...metadata };
  p.nextByMode ||= {};
  p.nextByMode[state.activeMode] = findNextUnanswered(state.scenarioIndex + 1);
  saveProgress();
  updateProgressUi();
  renderStreakDots();
  animateXpGain(xpAwarded, correct);
  if (metadata.comboMultiplier > 1) flashCombo(metadata.comboMultiplier);
  els.status.textContent = "Replay ready";
  renderAnswers();
  renderChartHotspots();
  animateReplay(0);
}

function clueForScenario(scenario) {
  if (scenario.pattern.includes("VWAP")) return "Price acceptance or rejection around VWAP was the key clue.";
  if (scenario.pattern.includes("Liquidity") || scenario.pattern.includes("Failed")) return "The failure to hold beyond the prior high or low exposed the trap.";
  if (scenario.bias === "chop") return "Overlapping candles and flat structure warned that no clean edge existed.";
  if (scenario.bias === "breakout") return "Compression and shallow pullbacks showed energy building before expansion.";
  return `${scenario.tags[1] || scenario.tags[0]} was the strongest contextual clue.`;
}

function candleSequenceForScenario(scenario) {
  const sequences = {
    reversal: "Price pushed through the reference level, failed to hold above it, printed a rejection candle, then rotated back through the breakout area as trapped momentum unwound.",
    continuation: "Price tested the key level, held it on smaller opposing candles, printed a firm response candle, then continued in the original direction with improving follow-through.",
    breakout: "Candles compressed near the range edge, pullbacks became shallower, the boundary broke with expansion, and the next candles accepted beyond the old range.",
    chop: "Price overlapped around VWAP, rejected both edges of the range, failed to produce follow-through, and returned repeatedly toward the middle."
  };
  return sequences[scenario.bias] || "Price tested the key reference, showed its response through candle structure, and confirmed the higher-quality decision during the reveal.";
}

function evidenceForScenario(scenario) {
  if (scenario.pattern.includes("VWAP")) return "The strongest evidence was the reclaim or rejection at VWAP followed by acceptance on the correct side. Location and the next pullback mattered more than candle color alone.";
  if (scenario.pattern.includes("Liquidity") || scenario.pattern.includes("Failed")) return "The strongest evidence was the sweep beyond the prior extreme followed by immediate failure to hold. That combination identified trapped participation and favored rotation.";
  if (scenario.bias === "chop") return "The strongest evidence was the lack of displacement: overlapping bodies, a flat reference level, and repeated rejection on both sides made patience the highest-quality decision.";
  if (scenario.bias === "breakout") return "The strongest evidence was compression directly beneath the boundary followed by decisive expansion and acceptance outside the range.";
  if (scenario.bias === "reversal") return "The strongest evidence was weakening follow-through at an important location, followed by rejection and a close back through the level.";
  return "The strongest evidence was a controlled retest, smaller opposing candles, and a strong response that preserved the existing structure.";
}

function invalidationForScenario(scenario) {
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
  return [
    {
      kicker: "What happened",
      title: "The reveal trapped the first read",
      body: candleSequenceForScenario(scenario),
      visual: "sequence"
    },
    {
      kicker: "Why the correct read worked",
      title: scenario.correctAnswer || "The higher-quality decision",
      body: evidenceForScenario(scenario),
      visual: "evidence"
    },
    {
      kicker: "What clue did you miss?",
      title: `The weak spot in "${selectedLabel}"`,
      body: `${clueForScenario(scenario)} The lesson is to wait for location plus confirmation, not just a candle that looks convincing by itself.`,
      visual: "clue"
    },
    {
      kicker: "Why each alternative failed",
      title: "Every choice had a reason",
      body: "Review the answer map below. Green is the decision that matched the reveal. Red marks the answer you chose.",
      visual: "options",
      extra: learningOptionReviewMarkup(scenario, completed)
    },
    {
      kicker: "Risk reasoning",
      title: "What would invalidate this setup?",
      body: invalidationForScenario(scenario),
      visual: "risk"
    },
    {
      kicker: "Crowd read",
      title: `Only ${correctPercent}% usually get this right`,
      body: `You picked a tempting answer. Use this distribution to see where most traders get pulled off the best read.`,
      visual: "distribution",
      extra: learningDistributionMarkup(scenario, completed)
    },
    {
      kicker: coachTitle,
      title: hasCoachPlan() ? "Run the next drill with a focus" : "Unlock deeper mistake review",
      body: coachBody,
      visual: hasCoachPlan() ? "coach" : "locked"
    },
    {
      kicker: "Streak reminder",
      title: "Come back for the next rep",
      body: streakReminderText(),
      visual: "streak"
    }
  ];
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

function closeLearningMoment(advance = true) {
  if (!els.learningModal || els.learningModal.classList.contains("hidden")) return;
  els.learningModal.classList.add("hidden");
  els.learningModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("learning-open");
  state.learningSlides = [];
  state.learningSlideIndex = 0;
  if (advance) document.getElementById("next-scenario").click();
}

function openLearningMoment(scenario, completed) {
  if (!els.learningModal) return;
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
  const remaining = next.xp - p.xp;
  if (remaining > 0 && remaining <= 50) {
    els.levelUpNudge.textContent = `Only ${remaining} XP to reach ${next.name}. One focused replay could do it.`;
    els.levelUpNudge.classList.remove("hidden");
  } else {
    els.levelUpNudge.classList.add("hidden");
  }
}

function showResult(correct, earned, completed = {}) {
  const paid = hasPaidPlan();
  const scenario = getScenario(state.scenarioIndex);
  els.resultPanel.classList.remove("hidden");
  els.grade.textContent = correct ? "S" : "C";
  els.resultTitle.textContent = correct ? "Correct read" : "Study the reveal";
  els.explanation.textContent = hasAccess("coachReview")
    ? `${scenario.explanation} Coach tip: review location, momentum, and whether price accepted or failed around the key level. Educational practice only, not financial advice.`
    : scenario.explanation;
  els.xpEarned.textContent = `+${earned} XP`;
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
    setTimeout(() => openLearningMoment(scenario, completed), 420);
  }
  if (correct && !paid && freePlaysLeft() <= 0) {
    setTimeout(openPaywall, 800);
  }
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

function renderLeaderboard() {
  const p = progress();
  const plan = getUserPlan();
  const weeklyGain = Math.max(420, p.attempts.slice(-12).reduce((sum, attempt) => sum + (attempt.correct ? 180 : 45), 0) + p.streak * 90);
  const seed = stringSeed(p.signup?.email || p.inviteEmail || "weekly-board") + Math.floor(Date.now() / 3600000);
  const rand = seededRandom(seed);
  const competitors = leaderboardBase.map((row, index) => ({
    ...row,
    gain: Math.max(900, row.base + Math.round(rand() * 900) - index * 120),
    streak: Math.max(3, row.streak + Math.round(rand() * 4) - 2)
  }));
  const rows = [
    { name: plan === "free" ? "Guest" : "You", gain: weeklyGain, rank: rankFromXp(p.xp), streak: Math.max(p.streak, p.topStreak), you: true, plan },
    ...competitors
  ].sort((a, b) => b.gain - a.gain);
  const medals = ["1", "2", "3"];
  const containers = [els.leaderboard, els.leaderboardFull].filter(Boolean);
  containers.forEach((container) => {
    container.innerHTML = "";
  });
  rows.forEach((row, index) => {
    containers.forEach((container) => {
      const item = document.createElement("div");
      item.className = `leader-row gainer-row ${row.you ? "you" : ""} ${row.plan ? `plan-${row.plan}` : ""} ${index < 3 ? "top-gainer" : ""}`;
      const crown = row.plan === "elite" ? "♛ " : "";
      item.innerHTML = `
        <strong class="gainer-rank">${medals[index] || index + 1}</strong>
        <span class="gainer-name">${crown}${row.name}<br><small>${row.rank} · ${row.streak} day streak</small></span>
        <strong class="gainer-points">+${row.gain.toLocaleString()} XP</strong>
      `;
      container.appendChild(item);
    });
  });
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
  const remaining = Math.max(0, nextRank.xp - p.xp);

  els.rankMeter.innerHTML = `
    <div class="rank-track"><span style="width:${progressPercent}%"></span></div>
    <div class="rank-gems">
      ${rankTiers.map((tier) => `
        <div class="rank-gem-item ${tier.name === currentRank ? "current" : ""} ${p.xp >= tier.xp ? "unlocked" : ""}">
          <b class="rank-gem ${tier.gem}">${tier.icon}</b>
          <strong>${tier.name}</strong>
          <small>${tier.xp.toLocaleString()} XP</small>
        </div>
      `).join("")}
    </div>
    <p class="rank-next">${remaining === 0 ? "Top rank reached. Keep defending your spot." : `${remaining.toLocaleString()} XP until ${nextRank.name}.`}</p>
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
      detail: p.plan === "Elite" ? "$49.99/month active access" : p.plan === "Coach" ? "$29.99/month active access" : "$19.99/month active access"
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
    .toUpperCase() || "TP";
  const level = Math.max(1, Math.floor(p.xp / 500) + 1);
  const currentLevelXp = p.xp % 500;
  const access = profileAccess();
  const patterns = actualPatternStats();
  const strongest = [...patterns].sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)[0];
  const weakest = [...patterns].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
  const modes = ["replay", "daily", "ranked", "trade", "spot", "survival", "notrade", "detective", "thesis"];
  const modeLabels = {
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
  document.getElementById("profile-level").textContent = level;
  document.getElementById("profile-xp-label").textContent = `${currentLevelXp} / 500 XP`;
  document.getElementById("profile-xp-fill").style.width = `${Math.min(100, (currentLevelXp / 500) * 100)}%`;
  document.getElementById("profile-accuracy").textContent = `${accuracy()}%`;
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
  document.getElementById("profile-pattern-bars").innerHTML = neededForReport ? `
    <div class="profile-report-progress">
      <strong>Pattern Report loading</strong>
      <span>Complete ${neededForReport} more scenario${neededForReport === 1 ? "" : "s"} to unlock your first pattern report.</span>
      <div class="bar-track"><span style="width:${Math.min(100, (p.attempts.length / 5) * 100)}%"></span></div>
    </div>
  ` : patterns.length ? patterns
    .sort((a, b) => b.total - a.total || b.accuracy - a.accuracy)
    .slice(0, 5)
    .map((row) => `
      <div class="profile-pattern-bar">
        <strong><span>${row.pattern}</span><span>${row.accuracy}% · ${row.total}x</span></strong>
        <div class="bar-track"><span style="width:${row.accuracy}%"></span></div>
      </div>
    `).join("") : `<p class="muted">Answer a few scenarios and your pattern report will build itself here.</p>`;

  document.getElementById("profile-recent").innerHTML = p.attempts.length ? p.attempts.slice(-6).reverse().map((attempt) => `
    <div class="profile-recent-row">
      <div><strong>${attempt.pattern || "Pattern Recognition"}</strong><span>${modeLabels[attempt.mode] || "Training"} · ${attempt.answer || "Answered"}</span></div>
      <b>${attempt.correct ? "Correct" : "Review"}</b>
    </div>
  `).join("") : `<p class="muted">No completed scenarios yet. Start Training to build your history.</p>`;
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
  resetModeState();
  state.scenarioIndex = findNextUnanswered(state.scenarioIndex + 1);
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
      high: "High confidence earns a 40% correct-answer bonus and tests calibration."
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
  document.getElementById(id).addEventListener("input", updateTradePreview);
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
  if (!p.reviewQueue.includes(scenario.id)) {
    p.reviewQueue.push(scenario.id);
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
    if (window.innerWidth <= 760) {
      document.body.classList.remove("sidebar-expanded");
      document.getElementById("side-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
});

document.getElementById("brand-home").addEventListener("click", () => {
  navigateTo("home");
});

els.topbarBack?.addEventListener("click", () => {
  navigateTo("home");
});

els.audioToggle?.addEventListener("click", () => {
  state.audioMuted = !state.audioMuted;
  updateAudioToggle();
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
  document.getElementById("mode-search-empty")?.classList.toggle("hidden", visibleCount > 0);
});

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

document.getElementById("side-toggle")?.addEventListener("click", () => {
  const isExpanded = document.body.classList.toggle("sidebar-expanded");
  document.getElementById("side-toggle")?.setAttribute("aria-expanded", String(isExpanded));
  document.getElementById("side-toggle")?.setAttribute("aria-label", isExpanded ? "Collapse navigation" : "Expand navigation");
  localStorage.setItem("tradePulseSidebarExpanded", String(isExpanded));
});

document.getElementById("exit-game").addEventListener("click", () => {
  navigateTo("home");
});

els.quickStart?.addEventListener("click", () => {
  const p = progress();
  p.signup ||= {};
  p.signup.market = els.quickMarket?.value || p.signup.market || "NQ";
  p.signup.experience = els.quickExperience?.value || p.signup.experience || "Beginner";
  saveProgress();
  startMode("replay");
});

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
    market: document.getElementById("signup-market").value
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
document.getElementById("logout-profile").addEventListener("click", logoutUser);
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

document.getElementById("share-button").addEventListener("click", async () => {
  const text = "TradePulse: a gamified market replay trainer for pattern recognition practice.";
  if (navigator.share) {
    await navigator.share({ title: "TradePulse", text });
  } else {
    await navigator.clipboard.writeText(text);
    document.getElementById("share-label").textContent = "Copied";
    showToast("Copied to clipboard.", "success");
    setTimeout(() => {
      document.getElementById("share-label").textContent = "Share";
    }, 1300);
  }
});

els.copyReferral?.addEventListener("click", async () => {
  await navigator.clipboard.writeText(referralCode());
  showToast("Referral code copied.", "success");
});

els.copyChallenge?.addEventListener("click", async () => {
  const scenario = getScenario(state.scenarioIndex || 0);
  const url = `${location.origin}${location.pathname}#challenge-${scenario.id}`;
  await navigator.clipboard.writeText(url);
  showToast("Challenge link copied.", "success");
});

els.copyShareCard?.addEventListener("click", async () => {
  const p = progress();
  const text = `TradePulse stats: ${accuracy()}% accuracy, ${Math.max(p.streak, p.topStreak)} day streak, ${rankFromXp(p.xp)} rank. Can you beat my replay score?`;
  await navigator.clipboard.writeText(text);
  showToast("Share card text copied.", "success");
});

document.getElementById("dismiss-beta")?.addEventListener("click", () => {
  localStorage.setItem("tradePulseBetaDismissed", "1");
  els.betaBanner?.classList.add("hidden");
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
    document.querySelectorAll(".plan-price").forEach((price) => {
      price.textContent = price.dataset[period] || price.textContent;
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
    content: "Hey! I'm your TradePulse assistant. Ask me anything about the platform, your plan, or how the games work."
  }]);
}

function openAssistant() {
  seedAssistantGreeting();
  renderAssistantMessages();
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

els.assistantForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = els.assistantInput.value.trim();
  if (!text) return;
  const messages = [...assistantMessages(), { role: "user", content: text }];
  saveAssistantMessages(messages);
  els.assistantInput.value = "";
  renderAssistantMessages(true);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Chat failed");
    saveAssistantMessages([...messages, { role: "assistant", content: result.message }]);
  } catch {
    saveAssistantMessages([...messages, {
      role: "assistant",
      content: "Sorry, I'm having trouble connecting. Try again in a moment."
    }]);
  }
  renderAssistantMessages();
});

if (els.assistantNotification && sessionStorage.getItem("tradePulseAssistantOpened")) {
  els.assistantNotification.classList.add("hidden");
}

document.getElementById("close-return-recap")?.addEventListener("click", () => {
  els.returnRecap?.classList.add("hidden");
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
      autoBillingAmount: "$19.99/month"
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
if (els.betaBanner && !localStorage.getItem("tradePulseBetaDismissed")) {
  els.betaBanner.classList.remove("hidden");
}
document.body.classList.remove("sidebar-expanded");
document.getElementById("side-toggle")?.setAttribute("aria-expanded", "false");
document.getElementById("side-toggle")?.setAttribute("aria-label", "Expand navigation");
refreshSubscriptionStatus();
handleGoogleAuthReturn();
loadScenarioLibrary();
drawPreviewCharts();
updateProgressUi();
applyModeUi();
renderScenario();
updateAudioToggle();
navigateTo(window.location.hash.replace("#", "") || "home", { fromHash: true, scroll: false });
setInterval(updateMarketTape, 4000);
setInterval(updateGameCards, 30000);
setInterval(() => {
  if (!els.waitlistCount) return;
  const next = Number(els.waitlistCount.textContent.replace(/\D/g, "") || 1407) + (1 + Math.floor(Math.random() * 3));
  els.waitlistCount.textContent = next.toLocaleString();
}, 4500);
