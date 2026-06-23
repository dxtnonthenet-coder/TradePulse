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
  { name: "MarketNinja", gain: 6240, rank: "Master", streak: 18 },
  { name: "FuturesKing", gain: 5310, rank: "Pro", streak: 14 },
  { name: "ChartMaster", gain: 4890, rank: "Pro", streak: 11 },
  { name: "PriceActionPro", gain: 3725, rank: "Sniper", streak: 8 }
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

function getScenario(index) {
  if (index < SHARED_SCENARIO_COUNT) return scenarios[index];
  return personalizedScenario(index);
}

function isScenarioAnswered(index) {
  const scenario = getScenario(index);
  return Boolean(progress().completed[scenario.id]);
}

function findNextUnanswered(startIndex, step = 1) {
  const direction = step >= 0 ? 1 : -1;
  let index = ((startIndex % TOTAL_SCENARIO_COUNT) + TOTAL_SCENARIO_COUNT) % TOTAL_SCENARIO_COUNT;

  for (let checked = 0; checked < TOTAL_SCENARIO_COUNT; checked += 1) {
    if (!isScenarioAnswered(index)) return index;
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
  p.loginCount = Number(p.loginCount || 0) + 1;
  p.lastLoginAt = Date.now();
  p.sessionStartIndex = freshScenarioBase();
  p.nextByMode = {};
  saveProgress();
}

function nextScenarioForMode(mode) {
  const p = progress();
  p.nextByMode ||= {};
  if (!p.sessionStartIndex) p.sessionStartIndex = freshScenarioBase();

  const savedIndex = Number(p.nextByMode[mode]);
  const baseIndex = Number.isFinite(savedIndex) ? savedIndex : Number(p.sessionStartIndex);
  const index = findNextUnanswered(baseIndex);
  p.nextByMode[mode] = index;
  saveProgress();
  return index;
}

function saveNextScenarioForMode(mode, fromIndex) {
  const p = progress();
  p.nextByMode ||= {};
  p.nextByMode[mode] = findNextUnanswered(fromIndex);
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
  selected: null,
  activeMode: "replay",
  progress: JSON.parse(localStorage.getItem("tradePulseProgress") || "{}")
};

let audioContext;

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
  rankMeter: document.getElementById("rank-meter")
};

const gate = {
  signupModal: document.getElementById("signup-modal"),
  signupForm: document.getElementById("signup-form"),
  paywallModal: document.getElementById("paywall-modal"),
  closePaywall: document.getElementById("close-paywall"),
  tradeForm: document.getElementById("trade-form"),
  activeModeLabel: document.getElementById("active-mode-label"),
  activeModeTitle: document.getElementById("active-mode-title"),
  activeModeCopy: document.getElementById("active-mode-copy")
};

function showPage(page) {
  document.body.dataset.page = page;
  document.body.classList.remove("playing");
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.toggle("active-page", section.dataset.page === page);
  });
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    const allowedPages = (section.dataset.dashboardPages || "").split(",");
    section.classList.toggle("active-page", allowedPages.includes(page));
  });
  document.querySelectorAll(".nav-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.pageTarget === page);
  });
  if (page === "profile") renderProfile();
  if (page === "elite") renderEliteDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    plan: null
  };
}

function progress() {
  state.progress = { ...defaultProgress(), ...state.progress };
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

async function startCheckout(plan, trial = false) {
  const p = progress();
  if (location.protocol === "file:") {
    alert("Open http://localhost:4173 to use Stripe/Supabase setup. This file view can only run the demo.");
    return false;
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        trial,
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
      alert(result.message);
      return false;
    }
    throw new Error(result.error || "Checkout did not return a URL.");
  } catch (error) {
    alert(`Checkout setup needs attention: ${error.message}`);
    return false;
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
    alert(result.message || result.error || "Billing portal is not ready for this account yet.");
  } catch (error) {
    alert(`Billing portal needs attention: ${error.message}`);
  }
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
}

function hasSignup() {
  return Boolean(progress().signup?.email);
}

function hasPaidPlan() {
  const plan = progress().plan;
  return plan === "Player" || plan === "Coach" || plan === "Elite" || isTrialActive();
}

function hasElitePlan() {
  return progress().plan === "Elite";
}

function isTrialActive() {
  const trialEndsAt = progress().trialEndsAt;
  return Boolean(trialEndsAt && Date.now() < Number(trialEndsAt));
}

function activeAccessLabel() {
  if (isTrialActive()) return "3-Day Trial";
  return progress().plan || null;
}

function freePlaysLeft() {
  const used = Number(progress().freePlaysUsed || 0);
  return Math.max(0, 3 - used);
}

function openSignup() {
  gate.signupModal.classList.remove("hidden");
}

function openPaywall() {
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

  state.activeMode = mode;
  state.scenarioIndex = nextScenarioForMode(mode);
  showPage("modes");
  document.getElementById("trainer").scrollIntoView({ behavior: "smooth" });
  applyModeUi();
  renderScenario();
}

function applyModeUi() {
  const copy = {
    replay: ["Replay Mode", "Switch timeframes, make the call, then reveal the next candles."],
    daily: ["Daily Challenge", "One scenario. One chance. Bonus XP for consistency."],
    ranked: ["Ranked Battle", "Timed decisions with bigger XP and leaderboard pressure."],
    trade: ["Trade Mode", "Pick a training entry, stop, and target before revealing the replay."]
  };
  const active = copy[state.activeMode] || copy.replay;
  gate.activeModeLabel.textContent = active[0];
  gate.activeModeTitle.textContent = active[0];
  gate.activeModeCopy.textContent = `${active[1]} Access: ${hasPaidPlan() ? "Unlimited" : `${freePlaysLeft()} free plays left`}.`;
  gate.tradeForm.classList.toggle("hidden", state.activeMode !== "trade");
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeCandles(scenario, timeframe, reveal) {
  const multipliers = { "1m": 1, "5m": 1.7, "15m": 3.1, "1h": 5.7, "4h": 7.4 };
  const visible = 42;
  const future = reveal ? 18 : 0;
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

function drawChartOn(canvas, scenario, timeframe, reveal, compact = false) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const candles = makeCandles(scenario, timeframe, reveal);
  const pad = compact ? { top: 18, right: 8, bottom: 18, left: 8 } : { top: 34, right: 68, bottom: 44, left: 54 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
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

  if (!compact && !reveal) {
    const hiddenX = pad.left + 42 * xStep;
    ctx.fillStyle = "rgba(5, 9, 13, 0.72)";
    ctx.fillRect(hiddenX, pad.top, width - pad.right - hiddenX, plotH);
    ctx.strokeStyle = "#f6c34e";
    ctx.beginPath();
    ctx.moveTo(hiddenX, pad.top);
    ctx.lineTo(hiddenX, height - pad.bottom);
    ctx.stroke();
    ctx.fillStyle = "#eef7f1";
    ctx.font = "25px Inter, system-ui";
    ctx.fillText("Future candles locked", hiddenX + 24, pad.top + 52);
  }

  if (!compact) {
    ctx.fillStyle = "#eef7f1";
    ctx.font = "28px Inter, system-ui";
    ctx.fillText(`${scenario.market} ${timeframe}`, pad.left, 30);
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
  drawChartOn(els.chart, getScenario(state.scenarioIndex), state.timeframe, state.revealed);
}

function drawPreviewCharts() {
  document.querySelectorAll(".mini-chart").forEach((canvas) => {
    const index = Number(canvas.dataset.preview || 0);
    const scenario = getScenario(index);
    drawChartOn(canvas, scenario, index === 2 ? "5m" : "1m", index === 1, true);
  });
}

function renderScenario() {
  const scenario = getScenario(state.scenarioIndex);
  const completed = progress().completed[scenario.id];
  state.revealed = Boolean(completed);
  state.selected = completed?.selected || null;

  els.scenarioId.textContent = scenario.scenarioCode;
  els.title.textContent = scenario.title;
  els.meta.textContent = `${scenario.market} · ${scenario.time} · ${scenario.difficulty}`;
  els.context.textContent = scenario.context;
  els.tags.textContent = scenario.tags.join(" · ");
  els.question.textContent = scenario.question;
  if (state.activeMode === "ranked") els.question.textContent = `Timed: ${scenario.question}`;
  if (state.activeMode === "trade") els.question.textContent = "Place your practice trade, then choose the most likely replay outcome.";
  els.status.textContent = state.revealed ? "Future candles revealed" : "Future candles hidden";

  renderTabs();
  renderAnswers();
  drawChart();
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

function renderAnswers() {
  const scenario = getScenario(state.scenarioIndex);
  els.answers.innerHTML = "";

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

  scenario.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = `${String.fromCharCode(65 + index)}  ${answer}`;
    button.disabled = state.revealed;

    if (state.revealed) {
      if (answer === scenario.correctAnswer) button.classList.add("correct");
      if (answer === state.selected && answer !== scenario.correctAnswer) button.classList.add("wrong");
    }

    button.addEventListener("click", () => submitAnswer(answer));
    els.answers.appendChild(button);
  });

  if (state.revealed) {
    const completed = progress().completed[scenario.id];
    showResult(completed.correct, completed.earned);
  } else {
    els.resultPanel.classList.add("hidden");
  }
}

function submitAnswer(answer) {
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
  const p = progress();
  const correct = answer === scenario.correctAnswer;
  const modeBonus = state.activeMode === "ranked" ? 80 : state.activeMode === "daily" ? 200 : state.activeMode === "trade" ? 60 : 0;
  const earned = correct ? 120 + modeBonus + Math.min(80, p.streak * 20) : 20;

  playAnswerSound(correct);
  state.selected = answer;
  state.revealed = true;
  p.xp += earned;
  if (!paid) p.freePlaysUsed = Number(p.freePlaysUsed || 0) + 1;
  p.streak = correct ? p.streak + 1 : 0;
  p.topStreak = Math.max(p.topStreak, p.streak);
  p.attempts.push({ scenarioId: scenario.id, answer, correct, pattern: scenario.pattern, mode: state.activeMode });
  p.completed[scenario.id] = { selected: answer, correct, earned };
  p.nextByMode ||= {};
  p.nextByMode[state.activeMode] = findNextUnanswered(state.scenarioIndex + 1);
  saveProgress();
  updateProgressUi();
  els.status.textContent = "Future candles revealed";
  renderAnswers();
  drawChart();
}

function showResult(correct, earned) {
  const paid = hasPaidPlan();
  const scenario = getScenario(state.scenarioIndex);
  els.resultPanel.classList.remove("hidden");
  els.grade.textContent = correct ? "S" : "C";
  els.resultTitle.textContent = correct ? "Correct read" : "Study the reveal";
  els.explanation.textContent = paid && (progress().plan === "Coach" || progress().plan === "Elite")
    ? `${scenario.explanation} Coach tip: review location, momentum, and whether price accepted or failed around the key level. Educational practice only, not financial advice.`
    : scenario.explanation;
  els.xpEarned.textContent = `+${earned} XP`;
  applyModeUi();
  if (!paid && freePlaysLeft() <= 0) {
    setTimeout(openPaywall, 800);
  }
}

function renderLeaderboard() {
  const p = progress();
  const weeklyGain = Math.max(420, p.attempts.slice(-12).reduce((sum, attempt) => sum + (attempt.correct ? 180 : 45), 0) + p.streak * 90);
  const rows = [
    { name: "You", gain: weeklyGain, rank: rankFromXp(p.xp), streak: Math.max(p.streak, p.topStreak), you: true },
    ...leaderboardBase
  ].sort((a, b) => b.gain - a.gain);
  const medals = ["1", "2", "3"];
  els.leaderboard.innerHTML = "";
  rows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = `leader-row gainer-row ${row.you ? "you" : ""} ${index < 3 ? "top-gainer" : ""}`;
    item.innerHTML = `
      <strong class="gainer-rank">${medals[index] || index + 1}</strong>
      <span class="gainer-name">${row.name}<br><small>${row.rank} · ${row.streak} day streak</small></span>
      <strong class="gainer-points">+${row.gain.toLocaleString()} XP</strong>
    `;
    els.leaderboard.appendChild(item);
  });
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
      detail: p.plan === "Elite" ? "$100/month active access" : p.plan === "Coach" ? "$50/month active access" : "$19.99/month active access"
    };
  }

  if (p.pendingPlan) {
    return {
      title: `${p.pendingPlan} Pending`,
      detail: "Checkout started, waiting for payment confirmation"
    };
  }

  return {
    title: "Free",
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
  const modes = ["replay", "daily", "ranked", "trade"];
  const modeLabels = {
    replay: "Replay Mode",
    daily: "Daily Challenge",
    ranked: "Ranked Battle",
    trade: "Trade Mode"
  };

  document.getElementById("profile-avatar").textContent = initials;
  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-email").textContent = email;
  document.getElementById("profile-access").textContent = access.title;
  document.getElementById("profile-trial").textContent = access.detail;
  document.getElementById("profile-rank").textContent = rankFromXp(p.xp);
  document.getElementById("profile-level").textContent = level;
  document.getElementById("profile-xp-label").textContent = `${currentLevelXp} / 500 XP`;
  document.getElementById("profile-xp-fill").style.width = `${Math.min(100, (currentLevelXp / 500) * 100)}%`;
  document.getElementById("profile-accuracy").textContent = `${accuracy()}%`;
  document.getElementById("profile-top-streak").textContent = `${Math.max(p.topStreak, p.streak)} Days`;
  document.getElementById("profile-scenarios").textContent = p.attempts.length;
  document.getElementById("profile-strongest").textContent = strongest ? `${strongest.pattern} · ${strongest.accuracy}%` : "Not enough data";
  document.getElementById("profile-weakest").textContent = weakest ? `${weakest.pattern} · ${weakest.accuracy}%` : "Not enough data";
  document.getElementById("profile-subscription").textContent = access.title;
  document.getElementById("profile-subscription-copy").textContent =
    access.title === "Free"
      ? "Start the 3-day trial or choose a plan to unlock unlimited training."
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

  document.getElementById("profile-pattern-bars").innerHTML = patterns.length ? patterns
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
  const overallAccuracy = Math.round((data.filter((item) => item.correct).length / data.length) * 100);
  const discipline = Math.max(45, Math.min(96, overallAccuracy + 14));
  const overtrade = Math.max(4, 100 - discipline);

  document.getElementById("elite-weakest").textContent = weakest.pattern;
  document.getElementById("elite-weakness-copy").textContent =
    `${weakest.pattern} is currently your highest-priority training focus. Elite will build drills around this until accuracy improves.`;
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

  const mistakes = data.filter((item) => !item.correct).slice(-4).reverse();
  document.getElementById("mistake-journal").innerHTML = mistakes.length ? mistakes.map((item) => `
    <div class="journal-item">
      <strong>${item.pattern || "Pattern Recognition"}</strong>
      <span>You missed this in ${item.mode || "replay"} mode. Review acceptance, rejection, and whether the setup deserved action.</span>
    </div>
  `).join("") : `<div class="journal-item"><strong>No mistakes yet</strong><span>Answer more scenarios to build your mistake journal.</span></div>`;

  document.getElementById("weekly-report").textContent =
    `This week you completed ${data.length} scenarios with ${overallAccuracy}% accuracy. Recommended focus: ${weakest.pattern}. Next goal: raise this setup above 70%.`;

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const topics = [weakest.pattern, "VWAP decision quality", "No-trade discipline", "Liquidity sweep review", "Ranked pressure test", "Trade Mode scoring", "Progress check"];
  document.getElementById("elite-curriculum").innerHTML = days.map((day, index) => `
    <div class="curriculum-item"><strong>${day}</strong><span>${topics[index]}</span></div>
  `).join("");
}

function startElitePlaylist() {
  if (!hasElitePlan()) {
    openPaywall();
    return;
  }

  state.activeMode = "replay";
  state.scenarioIndex = findNextUnanswered(SHARED_SCENARIO_COUNT + stringSeed(document.getElementById("elite-weakest").textContent || "elite") % 9000);
  showPage("modes");
  applyModeUi();
  renderScenario();
  document.getElementById("trainer").scrollIntoView({ behavior: "smooth" });
}

function applyEliteFilters() {
  if (!hasElitePlan()) {
    openPaywall();
    return;
  }

  const market = document.getElementById("elite-filter-market").value;
  const setup = document.getElementById("elite-filter-setup").value;
  const difficulty = document.getElementById("elite-filter-difficulty").value;
  const key = `${market}-${setup}-${difficulty}`;
  state.activeMode = "replay";
  state.scenarioIndex = findNextUnanswered(SHARED_SCENARIO_COUNT + stringSeed(key) % 50000);
  showPage("modes");
  applyModeUi();
  renderScenario();
  document.getElementById("trainer").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("next-scenario").addEventListener("click", () => {
  if (!hasPaidPlan() && freePlaysLeft() <= 0) {
    openPaywall();
    return;
  }
  state.scenarioIndex = findNextUnanswered(state.scenarioIndex + 1);
  saveNextScenarioForMode(state.activeMode, state.scenarioIndex);
  renderScenario();
});

document.getElementById("previous-scenario").addEventListener("click", () => {
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

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.pageTarget || "home");
    if (window.innerWidth <= 760) {
      document.body.classList.remove("sidebar-expanded");
      document.getElementById("side-toggle").setAttribute("aria-expanded", "false");
    }
  });
});

document.getElementById("brand-home").addEventListener("click", () => {
  showPage("home");
});

document.getElementById("start-elite-playlist").addEventListener("click", startElitePlaylist);
document.getElementById("apply-elite-filters").addEventListener("click", applyEliteFilters);

document.getElementById("side-toggle").addEventListener("click", () => {
  const isExpanded = document.body.classList.toggle("sidebar-expanded");
  document.getElementById("side-toggle").setAttribute("aria-expanded", String(isExpanded));
  document.getElementById("side-toggle").setAttribute("aria-label", isExpanded ? "Collapse navigation" : "Expand navigation");
  localStorage.setItem("tradePulseSidebarExpanded", String(isExpanded));
});

document.getElementById("exit-game").addEventListener("click", () => {
  showPage("modes");
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
  closeModals();
  refreshSubscriptionStatus();
  startMode(state.activeMode);
});

gate.closePaywall.addEventListener("click", closeModals);

document.getElementById("manage-billing").addEventListener("click", openBillingPortal);
document.getElementById("logout-profile").addEventListener("click", logoutUser);
document.getElementById("menu-logout").addEventListener("click", () => {
  logoutUser();
});

document.querySelectorAll(".plan-button").forEach((button) => {
  button.addEventListener("click", async () => {
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
    await startCheckout(selectedPlan, false);
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
    setTimeout(() => {
      document.getElementById("share-label").textContent = "Share";
    }, 1300);
  }
});

document.getElementById("invite-form").addEventListener("submit", async (event) => {
  event.preventDefault();
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
  event.currentTarget.querySelector("button").textContent = "Trial started";
  await startCheckout("Player", true);
  await refreshSubscriptionStatus();
});

window.addEventListener("resize", () => {
  drawChart();
  drawPreviewCharts();
});

function prepareVisitScenarioSession() {
  const p = progress();
  if (!p.sessionStartIndex) {
    p.sessionStartIndex = freshScenarioBase();
    saveProgress();
  }

  if (hasSignup() && !sessionStorage.getItem("tradePulseVisitStarted")) {
    startFreshScenarioSession();
    sessionStorage.setItem("tradePulseVisitStarted", String(Date.now()));
  }

  state.scenarioIndex = nextScenarioForMode(state.activeMode);
}

prepareVisitScenarioSession();
if (localStorage.getItem("tradePulseSidebarExpanded") === "true" && window.innerWidth > 760) {
  document.body.classList.add("sidebar-expanded");
  document.getElementById("side-toggle").setAttribute("aria-expanded", "true");
  document.getElementById("side-toggle").setAttribute("aria-label", "Collapse navigation");
}
refreshSubscriptionStatus();
drawPreviewCharts();
updateProgressUi();
applyModeUi();
renderScenario();
showPage("home");
