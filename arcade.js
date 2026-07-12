/* ReplayEdge Arcade — curriculum-tied, casino-style skill games.
   Loads after app.js + academy.js and uses their globals
   (progress, saveProgress, updateProgressUi, showToast, trackEvent, navigateTo,
    hasSignup, openSignup, awardBadgeOnce, playAnswerSound, academyTiers,
    academyTierUnlocked, academyLessonPassed). */

/* ---------- shared utilities ---------- */

function arcadeRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function genArcadeCandles(count, opts = {}) {
  const rand = opts.rand || arcadeRng(Math.floor(Math.random() * 1e9));
  let price = opts.base ?? 100;
  let momentum = opts.momentum ?? 0;
  const vol = opts.vol ?? 1;
  const candles = [];
  for (let i = 0; i < count; i += 1) {
    const localVol = vol * (0.6 + rand() * 0.8);
    momentum = momentum * 0.82 + (rand() - 0.5) * localVol;
    if (opts.drift) momentum += opts.drift * 0.18;
    const open = price;
    const close = open + momentum + (rand() - 0.5) * localVol * 0.6;
    const high = Math.max(open, close) + rand() * localVol * 0.55;
    const low = Math.min(open, close) - rand() * localVol * 0.55;
    candles.push({ open, high, low, close });
    price = close;
  }
  return candles;
}

function drawArcadeChart(canvas, candles, opts = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 560;
  const cssHeight = canvas.clientHeight || 300;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const pad = { top: 18, bottom: 14, left: 10, right: opts.rightPad ?? 56 };
  const plotW = cssWidth - pad.left - pad.right;
  const plotH = cssHeight - pad.top - pad.bottom;

  let min = Infinity;
  let max = -Infinity;
  candles.forEach((candle) => {
    min = Math.min(min, candle.low);
    max = Math.max(max, candle.high);
  });
  (opts.lines || []).forEach((line) => {
    min = Math.min(min, line.price);
    max = Math.max(max, line.price);
  });
  (opts.zones || []).forEach((zone) => {
    min = Math.min(min, zone.from);
    max = Math.max(max, zone.to);
  });
  const span = (max - min) || 1;
  min -= span * 0.06;
  max += span * 0.06;

  const yFor = (price) => pad.top + (1 - (price - min) / (max - min)) * plotH;
  const step = plotW / Math.max(candles.length, 1);
  const bodyW = Math.max(3, Math.min(14, step * 0.62));

  // grid
  ctx.strokeStyle = "rgba(90, 240, 200, 0.06)";
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g += 1) {
    const y = pad.top + (plotH / 4) * g;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
  }

  // zones
  (opts.zones || []).forEach((zone) => {
    const y1 = yFor(zone.to);
    const y2 = yFor(zone.from);
    ctx.fillStyle = zone.color || "rgba(124, 92, 255, 0.16)";
    ctx.fillRect(pad.left, y1, plotW, Math.max(2, y2 - y1));
    if (zone.label) {
      ctx.fillStyle = zone.labelColor || "rgba(238, 247, 241, 0.85)";
      ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(zone.label, pad.left + plotW + 6, (y1 + y2) / 2 + 4);
    }
  });

  // candles
  candles.forEach((candle, index) => {
    const x = pad.left + step * index + step / 2;
    const up = candle.close >= candle.open;
    const color = candle.dim
      ? "rgba(141, 166, 158, 0.35)"
      : up ? "#3dffa2" : "#ff5f6e";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, yFor(candle.high));
    ctx.lineTo(x, yFor(candle.low));
    ctx.stroke();
    const yOpen = yFor(candle.open);
    const yClose = yFor(candle.close);
    const top = Math.min(yOpen, yClose);
    const height = Math.max(2, Math.abs(yClose - yOpen));
    if (candle.glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x - bodyW / 2, top, bodyW, height);
    ctx.shadowBlur = 0;
  });

  // lines
  (opts.lines || []).forEach((line) => {
    const y = yFor(line.price);
    ctx.strokeStyle = line.color || "#f6c34e";
    ctx.lineWidth = line.width || 1.6;
    ctx.setLineDash(line.dash || [7, 5]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
    ctx.setLineDash([]);
    if (line.label) {
      ctx.fillStyle = line.color || "#f6c34e";
      ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(line.label, pad.left + plotW + 6, y + 4);
    }
  });

  return { yFor, priceFor: (y) => min + (1 - (y - pad.top) / plotH) * (max - min), pad, plotW, plotH };
}

/* ---------- sound design ---------- */

function arcadeAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioContext ||= new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function arcadeSound(name, level = 0) {
  if (typeof state !== "undefined" && state.audioMuted) return;
  if (!arcadeAudio()) return;
  switch (name) {
    case "win":
      tone(660, 0, 0.11, "sine", 0.12);
      tone(920, 0.1, 0.16, "sine", 0.11);
      break;
    case "lose":
      tone(130, 0, 0.16, "sawtooth", 0.1);
      tone(92, 0.12, 0.22, "square", 0.075);
      break;
    case "cashout":
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.07, 0.13, "triangle", 0.12));
      break;
    case "crash":
      [520, 430, 340, 250, 160, 95].forEach((f, i) => tone(f, i * 0.06, 0.1, "sawtooth", 0.11));
      tone(55, 0.1, 0.55, "square", 0.09);
      break;
    case "tick":
      tone(420 + Math.min(level, 14) * 46, 0, 0.05, "square", 0.05);
      break;
    case "flip":
      tone(330 + Math.min(level, 12) * 30, 0, 0.07, "triangle", 0.09);
      tone(660 + Math.min(level, 12) * 30, 0.03, 0.05, "sine", 0.05);
      break;
    case "bigwin":
      [523, 659, 784, 1046, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.09, 0.15, "triangle", 0.12));
      break;
    case "timeout":
      [0, 0.09, 0.18].forEach((offset) => tone(760, offset, 0.055, "square", 0.08));
      break;
  }
}

/* ---------- arcade progress ---------- */

function arcadeData() {
  const p = progress();
  if (!p.arcade || typeof p.arcade !== "object") p.arcade = {};
  if (!p.arcade.best || typeof p.arcade.best !== "object") p.arcade.best = {};
  if (!p.arcade.runs || typeof p.arcade.runs !== "object") p.arcade.runs = {};
  if (typeof p.arcade.totalXp !== "number") p.arcade.totalXp = 0;
  if (typeof p.arcade.runsTotal !== "number") p.arcade.runsTotal = 0;
  return p.arcade;
}

/* ---------- weekly 2X spotlight: one game per trading style, rotates every week ---------- */

function arcadeWeekNumber() {
  // weeks flip Monday 00:00 UTC (epoch day 0 was a Thursday, +3 aligns to Monday)
  return Math.floor((Math.floor(Date.now() / 86400000) + 3) / 7);
}

function arcadeWeeklyBoostFor(trackId) {
  const pool = arcadeGames.filter((game) => !game.trackOnly || game.trackOnly === trackId);
  if (!pool.length) return null;
  // offset per track so the five markets never spotlight the same core game in one week
  const offset = Object.keys(typeof TRACKS === "object" && TRACKS ? TRACKS : { futures: 1 }).indexOf(trackId);
  return pool[(arcadeWeekNumber() + Math.max(0, offset) * 3) % pool.length];
}

function arcadeBoostedGameId() {
  const track = typeof currentTrackId === "function" ? currentTrackId() : "futures";
  return arcadeWeeklyBoostFor(track)?.id || null;
}

function arcadeWeeklyResetLabel() {
  const now = new Date();
  const day = now.getUTCDay(); // 0 Sun … 6 Sat
  const daysLeft = ((8 - day) % 7) || 7; // days until next Monday UTC
  return daysLeft === 1 ? "rotates tonight" : `rotates in ${daysLeft} days`;
}

/* ---------- session brief: read the tape before you touch it ----------
   A daily simulated desk brief per market. Trains the habit every real
   trader has — checking risk tone, drivers, and the calendar first. */

const SESSION_BRIEF_POOLS = {
  futures: {
    tone: [
      "Cautious — choppy ahead of US data",
      "Risk-on — indexes grinding higher on light volume",
      "Defensive — overnight sell program still echoing",
      "Balanced — two-sided auction, no initiative yet",
      "Aggressive — trend day signature off the open"
    ],
    driver: [
      "Bonds bid, yields easing — growth names catching a lift",
      "Crude ripping on supply headlines; energy dragging the tape",
      "Soft CPI print — shorts covering into resistance",
      "Dollar strength pressuring commodities across the board",
      "VIX creeping up — hedging flows leaning on every rally"
    ],
    watch: [
      "FOMC minutes at 14:00 ET — expect a liquidity vacuum",
      "US ISM at 10:00 ET — high-impact risk window",
      "NFP Friday 08:30 ET — size down into the print",
      "Fed speakers all afternoon — headline risk elevated",
      "Weekly crude inventories at 10:30 ET — CL gets violent"
    ],
    avoid: [
      "Chasing breakouts inside the pre-data chop",
      "Fading a trend day after two failed attempts",
      "Full size during lunch — the book is thin",
      "Revenge entries after a stop-out sweep",
      "Holding through the number to 'see what happens'"
    ]
  },
  forex: {
    tone: [
      "Cautious — USD bid, majors heavy into US data",
      "Risk-on — carry pairs grinding with equities",
      "Choppy — rate repricing whipping both directions",
      "Quiet — inside day so far, ranges compressed",
      "Trending — clean dollar leg since London open"
    ],
    driver: [
      "USD strength continues; rates repricing hawkish",
      "EUR offered after soft PMI round — parity chatter returns",
      "JPY volatility — intervention watch keeps shorts nervous",
      "Commodity currencies bid on China stimulus headlines",
      "Gilt yields dragging GBP around — UK data in focus"
    ],
    watch: [
      "US CPI at 13:30 — high-impact risk window",
      "ECB presser at 13:45 — EUR pairs will gap",
      "Tokyo fix in 2 hours — JPY flows distort price",
      "BoE rate decision at 12:00 — GBP spreads widen",
      "London/NY overlap — best liquidity of the day"
    ],
    avoid: [
      "Fading strong USD momentum without a level",
      "Trading the first 15 minutes of a news release",
      "Oversizing exotic crosses — spreads eat the edge",
      "Chasing a London breakout during the NY lunch fade",
      "Stacking correlated EUR shorts and calling it diversified"
    ]
  },
  stocks: {
    tone: [
      "Cautious — breadth negative under a flat index",
      "Risk-on — leaders breaking out on volume",
      "Rotational — money spinning sectors, index pinned",
      "Heavy — distribution days stacking up",
      "Constructive — pullback to support on light volume"
    ],
    driver: [
      "Mega-cap earnings carrying the whole tape",
      "Yields backing up — growth multiples compressing",
      "Semis leading again; watch the laggards for catch-up",
      "Buyback window open — dips getting absorbed",
      "Breadth thrust yesterday — dip buyers emboldened"
    ],
    watch: [
      "Mega-cap earnings after the bell — gap risk overnight",
      "Fed chair testimony at 10:00 ET — rate-sensitive names move",
      "Triple witching Friday — pinning and weird prints",
      "CPI premarket — the open will be decided by 08:31",
      "Sector ETF rebalance at the close — MOC imbalances"
    ],
    avoid: [
      "Buying the first gap fill on fading volume",
      "Shorting a strong stock because it 'went up too much'",
      "Holding size through an earnings report",
      "Trading the open without checking premarket levels",
      "Averaging down on a broken support level"
    ]
  },
  options: {
    tone: [
      "Cautious — IV elevated into the event, premium expensive",
      "Quiet — IV crushed post-earnings, theta grinding",
      "Two-sided — dealers short gamma, moves exaggerated",
      "Pinned — heavy OI magnetizing spot to the strike",
      "Explosive — cheap vol and a catalyst on deck"
    ],
    driver: [
      "Dealers short gamma below spot — dips accelerate",
      "Post-earnings IV crush punishing long premium",
      "0DTE flows dominating the intraday tape",
      "Skew steepening — someone is paying up for crash protection",
      "Vol sellers back in force — every spike fades"
    ],
    watch: [
      "Weekly OPEX Friday — pin risk at round strikes",
      "Earnings tonight — IV percentile at 92%",
      "VIX expiry Wednesday morning — hedges roll",
      "Fed decision 14:00 ET — vol crush after the presser",
      "Ex-dividend date tomorrow — early assignment risk"
    ],
    avoid: [
      "Buying premium right before the IV crush",
      "Selling naked options into a binary event",
      "Ignoring liquidity — wide spreads are a hidden loss",
      "Holding 0DTE through the final hour without a stop",
      "Trading the greeks you haven't calculated"
    ]
  },
  crypto: {
    tone: [
      "Cautious — funding crowded long into resistance",
      "Risk-on — spot bid leading perps, healthy tape",
      "Choppy — weekend liquidity, wicks both ways",
      "Fearful — cascade liquidations still fresh",
      "Grinding — slow bleed up on declining volume"
    ],
    driver: [
      "ETF inflows five days straight — spot demand real",
      "Funding flipped negative — shorts paying, squeeze fuel",
      "BTC dominance climbing — alts bleeding against the majors",
      "Large wallet moved coins to exchange — distribution watch",
      "Stablecoin supply expanding — dry powder building"
    ],
    watch: [
      "US session open — spot flows pick up",
      "Monthly futures expiry Friday 08:00 UTC",
      "Funding reset in 3 hours — positioning may flush",
      "FOMC at 18:00 UTC — crypto trades it like a risk asset",
      "Token unlock tomorrow — supply hits the market"
    ],
    avoid: [
      "Longing crowded funding into a resistance block",
      "Trading illiquid alts during Asia hours",
      "Full size on a weekend — books are paper thin",
      "Chasing a liquidation wick without confirmation",
      "Ignoring BTC while trading an altcoin chart"
    ]
  }
};

function sessionLabelNow() {
  const hour = new Date().getHours();
  const stamp = `${String(hour).padStart(2, "0")}:00`;
  if (hour >= 2 && hour < 8) return `LONDON OPEN · ${stamp}`;
  if (hour >= 8 && hour < 12) return `NY OPEN · ${stamp}`;
  if (hour >= 12 && hour < 16) return `NY AFTERNOON · ${stamp}`;
  if (hour >= 16 && hour < 21) return `AFTER HOURS · ${stamp}`;
  return `ASIA SESSION · ${stamp}`;
}

function sessionBriefFor(trackId) {
  // fully randomized every read — the arcade is simulated practice, so every
  // session hands the trader a fresh set of exterior factors to weigh
  const pools = SESSION_BRIEF_POOLS[trackId] || SESSION_BRIEF_POOLS.futures;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  return {
    session: sessionLabelNow(),
    tone: pick(pools.tone),
    driver: pick(pools.driver),
    watch: pick(pools.watch),
    avoid: pick(pools.avoid)
  };
}

function sessionBriefMarkup(trackId, options = {}) {
  const brief = sessionBriefFor(trackId);
  const trackLabel = typeof TRACKS === "object" && TRACKS?.[trackId] ? TRACKS[trackId].label : "Futures";
  return `
    <div class="session-brief ${options.compact ? "compact" : ""}">
      <header class="sb-head">
        <span class="sb-live"><i></i>RE.AI · SESSION BRIEF</span>
        <span class="sb-session">${brief.session}</span>
      </header>
      <div class="sb-rows">
        <div class="sb-row"><span class="sb-icon tone"><i data-lucide="bot"></i></span><div><small><b class="sb-dot tone"></b>RISK TONE</small><p>${brief.tone}</p></div></div>
        <div class="sb-row"><span class="sb-icon driver"><i data-lucide="trending-up"></i></span><div><small><b class="sb-dot driver"></b>KEY DRIVER</small><p>${brief.driver}</p></div></div>
        <div class="sb-row"><span class="sb-icon watch"><i data-lucide="calendar"></i></span><div><small><b class="sb-dot watch"></b>WATCH</small><p>${brief.watch}</p></div></div>
        <div class="sb-row"><span class="sb-icon avoid"><i data-lucide="triangle-alert"></i></span><div><small><b class="sb-dot avoid"></b>AVOID</small><p>${brief.avoid}</p></div></div>
      </div>
      <footer class="sb-foot">Simulated ${trackLabel} desk brief — a new one every day. Real traders read this first.</footer>
    </div>
  `;
}

function sessionBriefAckKey() {
  return new Date().toDateString();
}

function sessionBriefAcked(trackId) {
  const data = arcadeData();
  return data.briefAck && data.briefAck[trackId] === sessionBriefAckKey();
}

function sessionBriefAcknowledge(trackId) {
  const data = arcadeData();
  if (!data.briefAck || typeof data.briefAck !== "object") data.briefAck = {};
  data.briefAck[trackId] = sessionBriefAckKey();
  saveProgress();
}

function arcadeGameUnlocked(game) {
  if (game.special === "orderflow") {
    if (typeof orderflowUnlocked !== "function") return false;
    return orderflowUnlocked() && ORDERFLOW_TIERS.some((tier) => tier.lessons.some((lesson) => academyLessonPassed(lesson.id)));
  }
  if (game.tier === 0) return true;
  const tier = academyTiers[game.tier];
  if (!tier) return true;
  return academyTierUnlocked(game.tier) && tier.lessons.some((lesson) => academyLessonPassed(lesson.id));
}

function arcadeUnlockHint(game) {
  if (game.special === "orderflow") {
    if (typeof orderflowUnlocked === "function" && orderflowUnlocked()) return "Pass 1 Orderflow lesson to unlock";
    return "Graduate the base Futures Academy first";
  }
  const tier = academyTiers[game.tier];
  if (!tier) return "";
  if (!academyTierUnlocked(game.tier)) return `Unlock Tier ${game.tier + 1} in the Academy first`;
  return `Pass 1 lesson in ${tier.title} to unlock`;
}

function arcadePlanBoost() {
  const plan = typeof getUserPlan === "function" ? getUserPlan() : "free";
  return plan === "elite" ? 1.5 : plan === "coach" ? 1.25 : 1;
}

function arcadeAwardXp(gameId, amount, score) {
  const clean = Math.max(0, Math.round(amount));
  const data = arcadeData();
  const weekly = arcadeBoostedGameId() === gameId ? 2 : 1;
  const streakMult = typeof streakXpMultiplier === "function" ? streakXpMultiplier() : 1;
  const boosted = Math.round(clean * weekly * arcadePlanBoost() * streakMult);
  data.totalXp += boosted;
  data.runsTotal += 1;
  data.runs[gameId] = (data.runs[gameId] || 0) + 1;
  if (score !== undefined && score > (data.best[gameId] || 0)) data.best[gameId] = Math.round(score);
  if (!Array.isArray(data.history)) data.history = [];
  data.history.push({ gameId, xp: boosted, ts: Date.now() });
  if (data.history.length > 40) data.history = data.history.slice(-40);
  const p = progress();
  p.xp += boosted;
  if (clean === 0 && typeof journalRecord === "function") {
    journalRecord({ type: "bust", gameId });
  }
  saveProgress();
  updateProgressUi();
  trackEvent("arcade_run_finished", { gameId, xp: boosted });
  if (!p.lifetime || typeof p.lifetime !== "object") p.lifetime = { wins: 0, busts: 0 };
  if (clean > 0) p.lifetime.wins += 1; else p.lifetime.busts += 1;
  if (typeof dailyBump === "function") {
    dailyBump("runs");
    if (clean > 0) dailyBump("wins");
    if (boosted > 0) dailyBump("xp", boosted);
  }
  if (typeof checkAchievements === "function") checkAchievements();
  if (typeof gauntletRecordRun === "function") gauntletRecordRun(gameId, boosted);
  if (typeof trainerNotifyRun === "function") trainerNotifyRun(gameId);
  if (typeof propfirmTrainingReward === "function") propfirmTrainingReward(clean > 0 ? "win" : "run");
  return boosted;
}

function arcadeGateGuest() {
  if (typeof hasSignup === "function" && !hasSignup() && arcadeData().runsTotal >= 6) {
    if (typeof openSignup === "function") openSignup();
    return true;
  }
  return false;
}

/* ---------- overlay shell ---------- */

const arcadeState = { activeGame: null, cleanup: null };

function ensureArcadeOverlay() {
  let overlay = document.getElementById("arcade-overlay");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "arcade-overlay";
  overlay.className = "arcade-overlay hidden";
  overlay.innerHTML = `
    <div class="arcade-shell">
      <header class="arcade-shell-head">
        <div class="arcade-shell-title">
          <span class="arcade-shell-icon" id="arcade-shell-icon"></span>
          <div>
            <h2 id="arcade-shell-name"></h2>
            <small id="arcade-shell-tag"></small>
          </div>
        </div>
        <div class="arcade-hud">
          <div class="arcade-hud-item"><span>POT</span><strong id="arcade-hud-pot">0</strong></div>
          <div class="arcade-hud-item"><span>MULT</span><strong id="arcade-hud-mult">1.0x</strong></div>
          <div class="arcade-hud-item"><span>STREAK</span><strong id="arcade-hud-streak">0</strong></div>
        </div>
        <button class="arcade-shell-close" id="arcade-shell-close" type="button" aria-label="Exit game"><i data-lucide="x"></i></button>
      </header>
      <div class="arcade-play-stage" id="arcade-stage"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#arcade-shell-close").addEventListener("click", closeArcadeGame);
  return overlay;
}

function arcadeHud(values = {}) {
  const pot = document.getElementById("arcade-hud-pot");
  const mult = document.getElementById("arcade-hud-mult");
  const streak = document.getElementById("arcade-hud-streak");
  if (pot && values.pot !== undefined) pot.textContent = `${Math.round(values.pot)} XP`;
  if (mult && values.mult !== undefined) mult.textContent = `${Number(values.mult).toFixed(values.mult >= 10 ? 0 : 1)}x`;
  if (streak && values.streak !== undefined) streak.textContent = values.streak;
}

function openArcadeGame(gameId) {
  const game = arcadeGames.find((item) => item.id === gameId);
  if (!game) return;
  if (!arcadeGameUnlocked(game)) {
    showToast(arcadeUnlockHint(game), "info");
    navigateTo("academy");
    return;
  }
  if (arcadeGateGuest()) return;
  if (arcadeState.cleanup) arcadeState.cleanup();
  const overlay = ensureArcadeOverlay();
  overlay.classList.remove("hidden");
  document.body.classList.add("arcade-playing");
  arcadeState.activeGame = gameId;
  document.getElementById("arcade-shell-icon").innerHTML = `<i data-lucide="${game.icon}"></i>`;
  const meta = arcadeGameMeta(game);
  document.getElementById("arcade-shell-name").textContent = meta.title;
  document.getElementById("arcade-shell-tag").textContent = arcadeBoostedGameId() === gameId ? `${meta.tagline} · 2X XP THIS WEEK` : meta.tagline;
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  const stage = document.getElementById("arcade-stage");
  stage.innerHTML = "";
  trackEvent("arcade_game_opened", { gameId });
  const briefTrack = game.trackOnly || (typeof currentTrackId === "function" ? currentTrackId() : "futures");
  if (!sessionBriefAcked(briefTrack)) {
    stage.innerHTML = `
      <div class="sb-stage">
        ${sessionBriefMarkup(briefTrack)}
        <button class="arcade-btn primary sb-enter" type="button" id="sb-enter">Read it? Enter the session →</button>
      </div>
    `;
    stage.querySelector("#sb-enter").addEventListener("click", () => {
      sessionBriefAcknowledge(briefTrack);
      if (typeof arcadeSound === "function") arcadeSound("flip");
      stage.innerHTML = "";
      game.start(stage);
      if (window.lucide) window.lucide.createIcons();
    });
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  game.start(stage);
  if (window.lucide) window.lucide.createIcons();
}

function closeArcadeGame() {
  if (arcadeState.cleanup) {
    arcadeState.cleanup();
    arcadeState.cleanup = null;
  }
  const overlay = document.getElementById("arcade-overlay");
  if (overlay) overlay.classList.add("hidden");
  document.body.classList.remove("arcade-playing");
  arcadeState.activeGame = null;
  renderArcade();
  renderHomeArcadeRail();
}

function arcadeResultScreen(stage, { gameId, xp, headline, sub, lesson }) {
  const earned = arcadeAwardXp(gameId, xp, xp);
  const boostBits = [];
  if (arcadeBoostedGameId() === gameId) boostBits.push("2X WEEKLY");
  if (arcadePlanBoost() > 1) boostBits.push(arcadePlanBoost() === 1.5 ? "ELITE +50%" : "COACH +25%");
  if (typeof streakBoostLabel === "function" && streakBoostLabel()) boostBits.push(streakBoostLabel());
  const boosted = boostBits.length > 0;
  stage.innerHTML = `
    <div class="arcade-result">
      <div class="arcade-result-xp ${earned > 0 ? "win" : "bust"}">
        <span>${earned > 0 ? "+" : ""}${earned}</span>
        <small>XP ${boosted && earned > 0 ? `· ${boostBits.join(" · ")}` : ""}</small>
      </div>
      <h3>${headline}</h3>
      ${sub ? `<p>${sub}</p>` : ""}
      ${lesson ? `<div class="arcade-result-lesson"><i data-lucide="lightbulb"></i><span>${lesson}</span></div>` : ""}
      <div class="arcade-result-actions">
        <button class="arcade-btn ghost" type="button" id="arcade-result-exit">All Games</button>
        <button class="arcade-btn primary" type="button" id="arcade-result-again">Play Again</button>
      </div>
    </div>
  `;
  stage.querySelector("#arcade-result-exit").addEventListener("click", closeArcadeGame);
  stage.querySelector("#arcade-result-again").addEventListener("click", () => openArcadeGame(gameId));
  if (earned > 0) arcadeSound(earned >= 200 ? "bigwin" : "cashout");
  if (window.lucide) window.lucide.createIcons();
}


/* ---------- track skins: every market gets its own arcade ---------- */

const ARCADE_TRACK_SKINS = {
  forex: {
    symbol: "EUR/USD",
    candlerush: { title: "Pip Rush", tagline: "Call the next EUR/USD candle. Ride the streak." },
    zonesniper: { title: "Session Sniper", tagline: "Call where the London wick lands." },
    stophunt: { title: "Asia Sweep", tagline: "London is hunting the overnight range. Escape first.", pool: "ASIA HIGH", hint: "The Asia range high is a pool of stops. London pushes toward it — cash out before the sweep." },
    gaphunter: { title: "FX Gap Hunter", tagline: "Spot the real displacement gap on the majors." },
    traportrade: { title: "Trap or Trade: London", tagline: "7 seconds. Session setup or session trap?" },
    riskmines: { title: "Margin Mines", tagline: "Flip clean habits. Dodge the margin-call killers." },
    proprun: { title: "FX Funded Run", tagline: "Pass the funded FX evaluation. Spreads count." },
    flowreader: { title: "Flow Reader", tagline: "Read the footprint: absorption or initiative?" }
  },
  stocks: {
    symbol: "AAPL",
    candlerush: { title: "Tape Rush", tagline: "Call the next candle on an in-play stock." },
    zonesniper: { title: "VWAP Sniper", tagline: "Call where the flush wick reclaims." },
    stophunt: { title: "Stop Run", tagline: "The open is hunting premarket stops. Escape first.", pool: "PREMARKET HIGH", hint: "Premarket highs hold breakout stops. The open drives into them — bank before the fade." },
    gaphunter: { title: "Gap & Go Hunter", tagline: "Find the real gap that continues, not the fade." },
    traportrade: { title: "Trap or Trade: The Open", tagline: "7 seconds. ORB setup or opening trap?" },
    riskmines: { title: "Halt Mines", tagline: "Flip clean habits. Dodge the halt-risk killers." },
    proprun: { title: "Small Account Run", tagline: "Grow the account without breaching the rules." },
    flowreader: { title: "Flow Reader", tagline: "Read the footprint: absorption or initiative?" }
  },
  options: {
    symbol: "SPX 0DTE",
    candlerush: { title: "Delta Rush", tagline: "Call the underlying. Gamma pays the streak." },
    zonesniper: { title: "Strike Sniper", tagline: "Call the level where the pin fights back." },
    stophunt: { title: "Gamma Sweep", tagline: "Price grinds to the gamma wall. Escape the flip.", pool: "GAMMA WALL", hint: "Dealers defend the gamma wall until they don't. Multiplier climbs into it — theta eats the greedy." },
    gaphunter: { title: "IV Gap Hunter", tagline: "Spot the true displacement gap before the crush." },
    traportrade: { title: "Trap or Trade: 0DTE", tagline: "7 seconds. Defined-risk setup or theta trap?" },
    riskmines: { title: "Theta Mines", tagline: "Flip clean habits. Dodge the decay killers." },
    proprun: { title: "Premium Run", tagline: "Grow the book with defined risk only." },
    flowreader: { title: "Flow Reader", tagline: "Read the footprint: absorption or initiative?" }
  },
  crypto: {
    symbol: "BTC",
    candlerush: { title: "Sat Rush", tagline: "Call the next BTC candle. Crypto speed." },
    zonesniper: { title: "Wick Sniper", tagline: "Call where the deviation wick lands." },
    stophunt: { title: "Liquidation Hunt", tagline: "Price grinds to the liq cluster. Escape the cascade.", pool: "LIQ CLUSTER", hint: "Leveraged longs stack liquidations above the highs. The cascade takes everything — cash out first." },
    gaphunter: { title: "CME Gap Hunter", tagline: "Spot the real inefficiency the market must fill." },
    traportrade: { title: "Trap or Trade: Perps", tagline: "7 seconds. Real move or engineered liquidity?" },
    riskmines: { title: "Leverage Mines", tagline: "Flip clean habits. Dodge the 100x killers." },
    proprun: { title: "Funded Perps Run", tagline: "Survive the vol. Hit target. Keep the account." },
    flowreader: { title: "Flow Reader", tagline: "Read the footprint: absorption or initiative?" }
  }
};

function arcadeSkinFor(gameId) {
  const track = typeof currentTrackId === "function" ? currentTrackId() : "futures";
  return (ARCADE_TRACK_SKINS[track] && ARCADE_TRACK_SKINS[track][gameId]) || {};
}

function arcadeGameMeta(game) {
  const skin = arcadeSkinFor(game.id);
  return { title: skin.title || game.title, tagline: skin.tagline || game.tagline };
}

/* niche decks for Trap or Trade */
const TRAP_DECKS_BY_TRACK = {
  forex: [
    { context: "London just swept the Asia low and displaced back through the range with force.", valid: true, why: "The session playbook: sweep of the overnight pool plus displacement is the day's A+ setup.", drift: -0.4 },
    { context: "EUR/USD breaks out 10 minutes before CPI drops.", valid: false, why: "News invalidates structure in one candle. Nothing before red folders.", drift: 0.6 },
    { context: "Your pair setup is long, and DXY is simultaneously breaking down from resistance.", valid: true, why: "Two inversely-correlated charts agreeing is macro confluence — the tide is with you.", drift: 0.5 },
    { context: "It's 1 PM ET, spreads are wide, volume is dead, but you've been flat all day.", valid: false, why: "The dead zone pays nobody. Boredom is not a session.", drift: 0 },
    { context: "Price sweeps the London low during the NY overlap and shifts structure up.", valid: true, why: "Killzone sweep + MSS during peak volume — the highest-odds window in FX.", drift: -0.5 },
    { context: "An exotic pair is moving fast and the spread is 12 pips. Your target is 20.", valid: false, why: "The spread eats 60% of the move before you start. Cost kills the edge.", drift: 0.7 },
    { context: "Clean uptrend on the 1h, corrective pullback into the origin zone at the 0.62.", valid: true, why: "Trend + discount + fresh zone: the core continuation entry in any market.", drift: 0.5 },
    { context: "You want to 'make back' yesterday's loss with 10 mini lots instead of 2.", valid: false, why: "That's revenge sizing. The market doesn't know you're down.", drift: -0.2 }
  ],
  stocks: [
    { context: "Low-float gapper, RVOL 8, breaks the opening range high and holds above it.", valid: true, why: "Catalyst + participation + break-and-hold: the ORB with fuel behind it.", drift: 0.8 },
    { context: "A quiet mega-cap with no news drifts near yesterday's close. You're bored.", valid: false, why: "No catalyst, no range, no trade. In-play stocks or nothing.", drift: 0 },
    { context: "Strong stock flushes below VWAP, sweeps stops, then reclaims with a full-bodied candle.", valid: true, why: "The flush was the liquidity grab; the reclaim is the confirmation.", drift: 0.5 },
    { context: "Stock is 9% extended above VWAP, fourth green candle in a row. FOMO is loud.", valid: false, why: "Chasing maximum extension is buying everyone else's exit.", drift: 0.9 },
    { context: "Halt-prone runner reopens: you want full size immediately with a market order.", valid: false, why: "Halt reopens gap through stops. Size down or stand down.", drift: 0.6 },
    { context: "Gap up on heavy premarket volume holds above the premarket high after the open.", valid: true, why: "Gap-and-go continuation: volume voted, and acceptance confirmed.", drift: 0.7 },
    { context: "Earnings in 20 minutes. The 5-minute chart looks 'perfect'.", valid: false, why: "The report resets everything. That's a coin flip with commissions.", drift: 0.2 },
    { context: "Leader stock pulls back to VWAP on declining volume in a strong sector.", valid: true, why: "Corrective pullback to the day's fair value in a leader — dip-buy location.", drift: 0.4 }
  ],
  options: [
    { context: "IV rank is 95 pre-earnings and you want to buy naked calls for the beat.", valid: false, why: "You'd pay peak fear. Even a win gets crushed by the IV collapse.", drift: 0.3 },
    { context: "Clean sweep-and-shift at your level; you take a 0.5-delta call with premium sized to 1%.", valid: true, why: "Chart thesis first, correct vehicle second, risk defined. Textbook.", drift: 0.5 },
    { context: "Your 0DTE is flat through lunch chop. 'It'll come back after 2.'", valid: false, why: "Theta is a blowtorch at 0DTE. Dead trades die fast or they kill you slowly.", drift: 0 },
    { context: "Rich IV, bullish thesis: you structure a debit spread selling the strike at your target.", valid: true, why: "The short leg sells expensive premium and caps where you'd exit anyway.", drift: 0.4 },
    { context: "You're down two trades and eye a far-OTM lottery call to 'fix the day'.", valid: false, why: "Lottery tickets after losses is tilt wearing a strategy costume.", drift: -0.3 },
    { context: "SPX sweeps the session low at 10:05, displaces up, and you enter the retrace with defined risk.", valid: true, why: "The window, the sweep, the displacement — with premium as your capped risk.", drift: -0.4 },
    { context: "A random ticker's weekly options have a 40-cent spread and no volume.", valid: false, why: "Illiquid chains tax you in and out. Trade liquid underlyings only.", drift: 0.2 },
    { context: "Your spread hits 70% of max value with three days left.", valid: true, why: "Take it. The last 30% fights time and pin risk for pennies.", drift: 0.3 }
  ],
  crypto: [
    { context: "BTC cascades through the liq cluster, instantly reclaims the level with aggression.", valid: true, why: "Forced sellers exhausted into absorbing buyers — the cascade reversal script.", drift: -0.6 },
    { context: "An alt pumps 40% on news straight into major HTF resistance. You want in.", valid: false, why: "News spikes into supply are exit liquidity ceremonies.", drift: 0.9 },
    { context: "Saturday 3 AM, thin books, a violent pump on no volume.", valid: false, why: "Weekend ghost moves get swept when real volume returns. Let it go.", drift: 0.5 },
    { context: "Funding is heavily positive at resistance and price prints a structure shift down.", valid: true, why: "Crowded longs at supply plus a shift — squeeze fuel is loaded your way.", drift: 0.4 },
    { context: "Your alt long looks perfect but BTC just lost a major level with force.", valid: false, why: "Correlation goes to 1 in stress. The tide overrides the setup.", drift: -0.5 },
    { context: "BTC sweeps the weekend low into Monday volume and reclaims with displacement.", valid: true, why: "Thin-book liquidity taken, then real participation confirms — textbook reclaim.", drift: -0.4 },
    { context: "The exchange offers 100x and your liquidation would sit 0.8% away.", valid: false, why: "If liquidation is your stop, sizing already failed. 2–5x with real stops.", drift: 0.3 },
    { context: "ETH holds its low while BTC sweeps a new one — you long the reclaim.", valid: true, why: "SMT-style divergence between the majors flags the engineered move.", drift: -0.3 }
  ]
};

/* ============================================================
   GAME 1 — CANDLE RUSH (Tier 1: Foundations)
   Hi-lo streak game: call the next candle, ride the multiplier,
   cash out before one wrong call wipes the pot.
============================================================ */

const CANDLE_RUSH_MULTS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 7, 10, 14, 20];

function startCandleRush(stage) {
  const rand = arcadeRng(Math.floor(Math.random() * 1e9));
  const series = genArcadeCandles(60, { rand, vol: 1.1 });
  let visible = 24;
  let pot = 0;
  let streak = 0;
  let locked = false;

  stage.innerHTML = `
    <div class="arcade-game candle-rush">
      <canvas class="arcade-canvas" id="rush-canvas"></canvas>
      <div class="arcade-controls">
        <button class="arcade-call long" id="rush-long" type="button"><i data-lucide="trending-up"></i> LONG<small id="rush-next-mult">next win ×1.2</small></button>
        <button class="arcade-cashout" id="rush-cashout" type="button" disabled>CASH OUT<small>0 XP</small></button>
        <button class="arcade-call short" id="rush-short" type="button"><i data-lucide="trending-down"></i> SHORT<small>&nbsp;</small></button>
      </div>
      <p class="arcade-hint">Read the momentum. Each correct call grows the multiplier — one wrong call and the pot is gone.</p>
    </div>
  `;

  const canvas = stage.querySelector("#rush-canvas");
  const cashoutBtn = stage.querySelector("#rush-cashout");
  const draw = () => {
    const shown = series.slice(visible - 24, visible).map((candle, index, arr) => ({ ...candle, glow: index === arr.length - 1 }));
    drawArcadeChart(canvas, shown, { rightPad: 20 });
  };

  const multFor = (s) => CANDLE_RUSH_MULTS[Math.min(s, CANDLE_RUSH_MULTS.length - 1)];

  const refresh = () => {
    arcadeHud({ pot, mult: multFor(streak), streak });
    cashoutBtn.disabled = pot <= 0;
    cashoutBtn.querySelector("small").textContent = `${Math.round(pot)} XP`;
    const nextLabel = stage.querySelector("#rush-next-mult");
    if (nextLabel) nextLabel.textContent = `next win ×${multFor(streak + 1)}`;
  };

  const guess = (direction) => {
    if (locked || visible >= series.length) return;
    locked = true;
    const next = series[visible];
    visible += 1;
    draw();
    const up = next.close >= next.open;
    const correct = (direction === "long" && up) || (direction === "short" && !up);
    setTimeout(() => {
      if (correct) {
        streak += 1;
        pot += 10 * multFor(streak);
        refresh();
        arcadeSound("flip", streak);
        locked = false;
      } else {
        arcadeSound("crash");
        if (streak >= 4 && typeof telemetryRecord === "function") telemetryRecord("greed");
        arcadeResultScreen(stage, {
          gameId: "candlerush",
          xp: 0,
          headline: `BUSTED at ${streak} streak`,
          sub: `You left ${Math.round(pot)} XP on the table. The candle closed ${up ? "green" : "red"}.`,
          lesson: "Banking profits beats squeezing one more win — cash out is a skill."
        });
      }
    }, 260);
  };

  stage.querySelector("#rush-long").addEventListener("click", () => guess("long"));
  stage.querySelector("#rush-short").addEventListener("click", () => guess("short"));
  cashoutBtn.addEventListener("click", () => {
    arcadeResultScreen(stage, {
      gameId: "candlerush",
      xp: pot,
      headline: `Cashed out at ${streak} streak`,
      sub: `Momentum read like a pro.`,
      lesson: "Consistent banked wins compound. Greed doesn't."
    });
  });

  draw();
  refresh();
  if (window.lucide) window.lucide.createIcons();
}

/* ============================================================
   GAME 2 — ZONE SNIPER (Tier 2: Structure)
   Tap the price where the reversal lands. Closer = bigger score.
============================================================ */

function startZoneSniper(stage) {
  const SHOTS = 5;
  let shot = 0;
  let totalScore = 0;
  let pot = 0;

  stage.innerHTML = `
    <div class="arcade-game zone-sniper">
      <div class="arcade-round-strip" id="sniper-rounds"></div>
      <div class="arcade-canvas-wrap" id="sniper-wrap">
        <canvas class="arcade-canvas" id="sniper-canvas"></canvas>
        <div class="sniper-line hidden" id="sniper-line"><span id="sniper-line-label"></span></div>
      </div>
      <div class="arcade-controls single">
        <button class="arcade-btn primary big" id="sniper-fire" type="button" disabled>SET LINE FIRST</button>
      </div>
      <p class="arcade-hint" id="sniper-hint">Price is pulling back. Click the chart where you think the reversal wick lands — old levels catch price.</p>
    </div>
  `;

  const canvas = stage.querySelector("#sniper-canvas");
  const wrap = stage.querySelector("#sniper-wrap");
  const lineEl = stage.querySelector("#sniper-line");
  const fireBtn = stage.querySelector("#sniper-fire");
  const roundsEl = stage.querySelector("#sniper-rounds");

  let round = null;
  let guessPrice = null;
  let geometry = null;

  const renderRounds = () => {
    roundsEl.innerHTML = Array.from({ length: SHOTS }, (_, i) =>
      `<span class="${i < shot ? "done" : i === shot ? "active" : ""}">${i + 1}</span>`
    ).join("");
  };

  const newRound = () => {
    const rand = arcadeRng(Math.floor(Math.random() * 1e9));
    const history = genArcadeCandles(22, { rand, vol: 1.2 });
    // pick the key level from history extremes, then force the future to reverse near it
    const goingDown = rand() > 0.5;
    const lows = history.map((candle) => candle.low);
    const highs = history.map((candle) => candle.high);
    const level = goingDown ? Math.min(...lows) : Math.max(...highs);
    const last = history[history.length - 1].close;
    const future = [];
    let price = last;
    const steps = 7;
    const target = level + (goingDown ? 1 : -1) * (rand() - 0.35) * 0.4;
    for (let i = 0; i < steps; i += 1) {
      const toward = i < 4 ? (target - price) * (0.35 + rand() * 0.25) : (last - price) * (0.3 + rand() * 0.2);
      const open = price;
      const close = open + toward + (rand() - 0.5) * 0.5;
      const high = Math.max(open, close) + rand() * 0.4;
      const low = Math.min(open, close) - rand() * 0.4;
      future.push({ open, high, low, close });
      price = close;
    }
    const extreme = goingDown
      ? Math.min(...future.map((candle) => candle.low))
      : Math.max(...future.map((candle) => candle.high));
    round = { history, future, extreme, goingDown };
    guessPrice = null;
    lineEl.classList.add("hidden");
    fireBtn.disabled = true;
    fireBtn.textContent = "SET LINE FIRST";
    stage.querySelector("#sniper-hint").textContent = goingDown
      ? "Price is dropping. Click where the low of the move lands."
      : "Price is climbing. Click where the high of the move lands.";
    geometry = drawArcadeChart(canvas, round.history, { rightPad: 20 });
    renderRounds();
  };

  wrap.addEventListener("click", (event) => {
    if (!round || !geometry || fireBtn.dataset.revealing === "true") return;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    guessPrice = geometry.priceFor(y);
    lineEl.classList.remove("hidden");
    lineEl.style.top = `${y}px`;
    stage.querySelector("#sniper-line-label").textContent = guessPrice.toFixed(2);
    fireBtn.disabled = false;
    fireBtn.textContent = "FIRE 🎯";
  });

  fireBtn.addEventListener("click", () => {
    if (guessPrice === null || !round) return;
    fireBtn.dataset.revealing = "true";
    fireBtn.disabled = true;
    const all = [...round.history, ...round.future.map((candle) => ({ ...candle, glow: true }))];
    geometry = drawArcadeChart(canvas, all, {
      rightPad: 56,
      lines: [
        { price: guessPrice, color: "#58c7ff", label: "YOU", dash: [4, 4] },
        { price: round.extreme, color: "#f6c34e", label: "WICK" }
      ]
    });
    const range = Math.max(...all.map((candle) => candle.high)) - Math.min(...all.map((candle) => candle.low));
    const distance = Math.abs(guessPrice - round.extreme) / (range || 1);
    let score = 0;
    let verdict = "MISS";
    if (distance <= 0.03) { score = 100; verdict = "BULLSEYE 🎯"; }
    else if (distance <= 0.07) { score = 60; verdict = "CLOSE"; }
    else if (distance <= 0.14) { score = 25; verdict = "NEAR"; }
    totalScore += score;
    pot = Math.round(totalScore / 4);
    arcadeHud({ pot, mult: 1 + shot * 0.2, streak: shot + 1 });
    stage.querySelector("#sniper-hint").textContent = `${verdict} — ${score} points. The wick landed at ${round.extreme.toFixed(2)}.`;
    arcadeSound(score >= 100 ? "bigwin" : score > 0 ? "win" : "lose");
    shot += 1;
    setTimeout(() => {
      fireBtn.dataset.revealing = "false";
      if (shot >= SHOTS) {
        arcadeResultScreen(stage, {
          gameId: "zonesniper",
          xp: pot,
          headline: `${totalScore} / ${SHOTS * 100} precision`,
          sub: totalScore >= 300 ? "Sniper-grade level reading." : "Keep drilling — wicks hunt old levels.",
          lesson: "Reversals cluster at prior highs and lows. Draw the level before the move, not after."
        });
      } else {
        newRound();
      }
    }, 1700);
  });

  newRound();
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
}

/* ============================================================
   GAME 3 — STOP HUNT (Tier 3: Liquidity) — crash-style
   Price grinds toward the liquidity pool. Multiplier climbs.
   Cash out before the sweep takes everything.
============================================================ */

function startStopHunt(stage) {
  const rand = arcadeRng(Math.floor(Math.random() * 1e9));
  const history = genArcadeCandles(16, { rand, vol: 1 });
  // engineer equal highs pool above current price
  const maxHigh = Math.max(...history.map((candle) => candle.high));
  const pool = maxHigh + 1.2;
  history[6].high = pool - 0.06;
  history[12].high = pool - 0.02;
  const start = history[history.length - 1].close;
  const climbLength = 5 + Math.floor(rand() * 8); // sweep hits candle N
  let candleIndex = 0;
  let mult = 1;
  let alive = true;
  let timer = null;
  const shown = [...history];

  stage.innerHTML = `
    <div class="arcade-game stop-hunt">
      <canvas class="arcade-canvas" id="hunt-canvas"></canvas>
      <div class="hunt-mult" id="hunt-mult">1.00x</div>
      <div class="arcade-controls single">
        <button class="arcade-cashout mega" id="hunt-cashout" type="button">CASH OUT<small id="hunt-cash-label">25 XP</small></button>
      </div>
      <p class="arcade-hint">${arcadeSkinFor("stophunt").hint || "Equal highs = a pool of stops. Price is being pushed up to take them. Every candle pays more… until the sweep."}</p>
    </div>
  `;

  const canvas = stage.querySelector("#hunt-canvas");
  const multEl = stage.querySelector("#hunt-mult");
  const cashBtn = stage.querySelector("#hunt-cashout");

  const draw = () => {
    drawArcadeChart(canvas, shown.slice(-26), {
      lines: [{ price: pool, color: "#f6c34e", label: arcadeSkinFor("stophunt").pool || "POOL", width: 2 }]
    });
  };

  const payout = () => Math.round(25 * mult);

  const tick = () => {
    if (!alive) return;
    candleIndex += 1;
    if (candleIndex >= climbLength) {
      // THE SWEEP: spike through pool, close hard below
      alive = false;
      const open = shown[shown.length - 1].close;
      const sweep = { open, high: pool + 0.7 + rand() * 0.5, low: open - 2.6 - rand() * 1.4, close: open - 2.2 - rand() * 1.2, glow: true };
      shown.push(sweep);
      draw();
      arcadeSound("crash");
      multEl.textContent = "SWEPT";
      multEl.classList.add("crashed");
      cashBtn.disabled = true;
      setTimeout(() => {
        arcadeResultScreen(stage, {
          gameId: "stophunt",
          xp: 0,
          headline: `SWEPT at ${mult.toFixed(2)}x`,
          sub: "The wick took the pool — and your pot with it.",
          lesson: "The closer price gets to obvious liquidity, the closer the reversal. Never buy INTO the pool."
        });
      }, 1400);
      return;
    }
    // climb candle toward pool
    const open = shown[shown.length - 1].close;
    const remaining = pool - open;
    const push = Math.max(0.08, remaining * (0.18 + rand() * 0.2));
    const close = open + push - rand() * 0.12;
    shown.push({
      open,
      high: Math.min(close + rand() * 0.25, pool - 0.03),
      low: open - rand() * 0.3,
      close,
      glow: true
    });
    if (shown.length > 2) delete shown[shown.length - 2].glow;
    mult *= 1.22 + rand() * 0.1;
    arcadeSound("tick", candleIndex);
    arcadeHud({ pot: payout(), mult, streak: candleIndex });
    multEl.textContent = `${mult.toFixed(2)}x`;
    stage.querySelector("#hunt-cash-label").textContent = `${payout()} XP`;
    draw();
    timer = setTimeout(tick, 850 + rand() * 350);
  };

  cashBtn.addEventListener("click", () => {
    if (!alive) return;
    alive = false;
    clearTimeout(timer);
    arcadeResultScreen(stage, {
      gameId: "stophunt",
      xp: payout(),
      headline: `Cashed out at ${mult.toFixed(2)}x`,
      sub: `Banked before the sweep hit.`,
      lesson: "Smart money exits INTO strength — before the liquidity grab, not after."
    });
  });

  arcadeState.cleanup = () => clearTimeout(timer);
  draw();
  arcadeHud({ pot: payout(), mult: 1, streak: 0 });
  timer = setTimeout(tick, 1100);
}

/* ============================================================
   GAME 4 — GAP HUNTER (Tier 4: Smart Money)
   Find the true Fair Value Gap among decoys before time runs out.
============================================================ */

function startGapHunter(stage) {
  const ROUNDS = 5;
  let roundIndex = 0;
  let combo = 0;
  let pot = 0;
  let timer = null;
  let deadline = null;

  stage.innerHTML = `
    <div class="arcade-game gap-hunter">
      <div class="arcade-round-strip" id="gap-rounds"></div>
      <canvas class="arcade-canvas" id="gap-canvas"></canvas>
      <div class="gap-timer"><i id="gap-timer-fill"></i></div>
      <div class="arcade-controls" id="gap-choices"></div>
      <p class="arcade-hint" id="gap-hint">One of these zones is a real Fair Value Gap left by displacement. Pick it before the clock dies.</p>
    </div>
  `;

  const canvas = stage.querySelector("#gap-canvas");
  const choicesEl = stage.querySelector("#gap-choices");
  const roundsEl = stage.querySelector("#gap-rounds");
  const timerFill = stage.querySelector("#gap-timer-fill");
  let round = null;

  const renderRounds = () => {
    roundsEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<span class="${i < roundIndex ? "done" : i === roundIndex ? "active" : ""}">${i + 1}</span>`
    ).join("");
  };

  const endRun = () => {
    arcadeResultScreen(stage, {
      gameId: "gaphunter",
      xp: pot,
      headline: `${pot} XP hunted`,
      sub: combo >= 3 ? "You see the gaps like an algorithm." : "Displacement leaves the gap. Train the eye.",
      lesson: "A real FVG comes from a violent middle candle — wicks that never touch. Weak drift gaps are noise."
    });
  };

  const newRound = () => {
    const rand = arcadeRng(Math.floor(Math.random() * 1e9));
    const candles = genArcadeCandles(26, { rand, vol: 0.9 });
    // inject displacement + true FVG
    const i = 8 + Math.floor(rand() * 10);
    const big = candles[i];
    const up = rand() > 0.5;
    const size = 2.6 + rand() * 1.2;
    if (up) {
      big.open = candles[i - 1].close;
      big.close = big.open + size;
      big.high = big.close + 0.3;
      big.low = big.open - 0.15;
      candles[i + 1].open = big.close;
      candles[i + 1].close = big.close + 0.4;
      candles[i + 1].low = candles[i - 1].high + size * 0.45; // gap stays open
      candles[i + 1].high = candles[i + 1].close + 0.3;
    } else {
      big.open = candles[i - 1].close;
      big.close = big.open - size;
      big.low = big.close - 0.3;
      big.high = big.open + 0.15;
      candles[i + 1].open = big.close;
      candles[i + 1].close = big.close - 0.4;
      candles[i + 1].high = candles[i - 1].low - size * 0.45;
      candles[i + 1].low = candles[i + 1].close - 0.3;
    }
    // re-chain following candles from the displaced close
    for (let k = i + 2; k < candles.length; k += 1) {
      const shift = candles[k - 1].close - candles[k].open;
      candles[k].open += shift;
      candles[k].close += shift;
      candles[k].high += shift;
      candles[k].low += shift;
    }
    const gapFrom = up ? candles[i - 1].high : candles[i + 1].high;
    const gapTo = up ? candles[i + 1].low : candles[i - 1].low;
    const trueZone = { from: Math.min(gapFrom, gapTo), to: Math.max(gapFrom, gapTo) };

    const min = Math.min(...candles.map((candle) => candle.low));
    const max = Math.max(...candles.map((candle) => candle.high));
    const range = max - min;
    const trueHeight = trueZone.to - trueZone.from;
    const decoyHeight = Math.min(trueHeight, range * 0.14);
    const decoys = [];
    let guard = 0;
    while (decoys.length < 2 && guard < 200) {
      guard += 1;
      const margin = decoyHeight * 0.4;
      const from = min - range * 0.04 + rand() * (range * 1.08 - decoyHeight);
      const candidate = { from, to: from + decoyHeight * (0.8 + rand() * 0.4) };
      const overlapsTrue = candidate.from < trueZone.to + margin && candidate.to > trueZone.from - margin;
      const overlapsDecoy = decoys.some((zone) => candidate.from < zone.to + margin && candidate.to > zone.from - margin);
      if (!overlapsTrue && !overlapsDecoy) decoys.push(candidate);
    }
    // guarantee: park any missing decoys just beyond the chart extremes
    while (decoys.length < 2) {
      const below = decoys.length === 0;
      decoys.push(below
        ? { from: min - decoyHeight * 1.6, to: min - decoyHeight * 0.6 }
        : { from: max + decoyHeight * 0.6, to: max + decoyHeight * 1.6 });
    }
    const options = [trueZone, ...decoys]
      .map((zone, index) => ({ ...zone, isTrue: index === 0 }))
      .sort(() => rand() - 0.5)
      .map((zone, index) => ({ ...zone, letter: ["A", "B", "C"][index] }));

    round = { candles, options };
    drawArcadeChart(canvas, candles, {
      zones: options.map((zone) => ({
        from: zone.from,
        to: zone.to,
        color: "rgba(88, 199, 255, 0.14)",
        label: zone.letter,
        labelColor: "#58c7ff"
      }))
    });
    choicesEl.innerHTML = options.map((zone) =>
      `<button class="arcade-btn zone-pick" type="button" data-letter="${zone.letter}">${zone.letter}</button>`
    ).join("");
    choicesEl.querySelectorAll(".zone-pick").forEach((button) => {
      button.addEventListener("click", () => pick(button.dataset.letter));
    });
    stage.querySelector("#gap-hint").textContent = "One zone is a real FVG from displacement. The others are bait.";
    renderRounds();

    // 8s timer
    deadline = Date.now() + 8000;
    timerFill.style.transition = "none";
    timerFill.style.width = "100%";
    requestAnimationFrame(() => {
      timerFill.style.transition = "width 8s linear";
      timerFill.style.width = "0%";
    });
    clearTimeout(timer);
    timer = setTimeout(() => pick(null), 8000);
  };

  const pick = (letter) => {
    clearTimeout(timer);
    if (!round) return;
    const chosen = round.options.find((zone) => zone.letter === letter);
    const truth = round.options.find((zone) => zone.isTrue);
    const correct = Boolean(chosen && chosen.isTrue);
    drawArcadeChart(canvas, round.candles, {
      zones: round.options.map((zone) => ({
        from: zone.from,
        to: zone.to,
        color: zone.isTrue ? "rgba(61, 255, 162, 0.22)" : "rgba(255, 95, 110, 0.12)",
        label: zone.isTrue ? `${zone.letter} ✓` : zone.letter,
        labelColor: zone.isTrue ? "#3dffa2" : "#ff5f6e"
      }))
    });
    if (correct) {
      combo += 1;
      const gain = Math.round(20 * (1 + (combo - 1) * 0.5));
      pot += gain;
      stage.querySelector("#gap-hint").textContent = `+${gain} XP — that's the displacement gap. Combo ×${combo}.`;
    } else {
      combo = 0;
      stage.querySelector("#gap-hint").textContent = letter
        ? `Bait taken. The true gap was ${truth.letter} — look for the violent candle.`
        : `Too slow. The gap was ${truth.letter}.`;
    }
    arcadeHud({ pot, mult: 1 + combo * 0.5, streak: combo });
    arcadeSound(correct ? "win" : letter ? "lose" : "timeout");
    roundIndex += 1;
    round = null;
    setTimeout(() => (roundIndex >= ROUNDS ? endRun() : newRound()), 1800);
  };

  arcadeState.cleanup = () => clearTimeout(timer);
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  newRound();
}

/* ============================================================
   GAME 5 — TRAP OR TRADE (Tier 5: Strategies)
   Setup cards flash. 7 seconds. Take it or skip it.
============================================================ */

const TRAP_OR_TRADE_DECK = [
  { context: "Breaks above equal highs. No sweep behind it, no retest — just vertical FOMO.", valid: false, why: "Obvious breakouts into liquidity are usually the trap. No acceptance, no trade.", drift: 0.8 },
  { context: "Swept the session low, displaced up through structure, now retracing into the gap.", valid: true, why: "Sweep → displacement → retrace. That's the reversal script, by the book.", drift: -0.5 },
  { context: "Fifth test of the same support in two hours.", valid: false, why: "Every test consumes the orders defending it. Worn levels break.", drift: -0.2 },
  { context: "Clean uptrend, slow overlapping pullback into the demand zone that launched it.", valid: true, why: "Corrective pullback to a fresh zone with the trend — textbook continuation.", drift: 0.6 },
  { context: "CPI prints in 3 minutes. The chart looks perfect.", valid: false, why: "News invalidates structure in one candle. Flat is the position.", drift: 0.1 },
  { context: "Break of structure up, first retrace into the order block that caused it.", valid: true, why: "First return to the origin of displacement — highest quality entry location.", drift: 0.5 },
  { context: "Price accepted below the old low — four closes under it. You want to long the 'sweep'.", valid: false, why: "Sweeps reject instantly. Multiple closes beyond = genuine break, not a sweep.", drift: -0.7 },
  { context: "London open just ran the Asia high and shifted structure down with force.", valid: true, why: "Killzone sweep + market structure shift = the session playbook firing.", drift: 0.4 },
  { context: "Dead lunch hour. Tiny candles. You're bored and want action.", valid: false, why: "Boredom is not a setup. Low-volume chop pays nobody.", drift: 0 },
  { context: "Bull flag after a strong impulse, breaking flag high inside the NY killzone.", valid: true, why: "Compression breaking with trend at high-volume time — continuation odds stacked.", drift: 0.7 },
  { context: "You just took two losses and this 'setup' would make it all back at 5x size.", valid: false, why: "That's revenge, not analysis. The market doesn't owe you a recovery.", drift: -0.3 },
  { context: "HTF bias up, discount zone, liquidity swept, displacement confirmed, killzone active.", valid: true, why: "Full confluence stack. These are the only trades that deserve size.", drift: 0.5 },
  { context: "A doji formed. Mid-range. No level, no sweep, no bias. But it's a pretty doji.", valid: false, why: "A candle without location is noise. Context makes the trade.", drift: 0 },
  { context: "Double top rejection at yesterday's high with a violent engulfing candle.", valid: true, why: "Liquidity above yesterday's high got tapped and slammed — rejection with force.", drift: 0.6 },
  { context: "Guru posted 'HUGE LONG NOW 🚀'. Chart shows nothing on your checklist.", valid: false, why: "Other people's conviction is the most expensive entry signal in trading.", drift: 0.2 },
  { context: "Trend pullback landed on the 0.62, tapped the FVG, and printed a structure shift up.", valid: true, why: "Discount + inefficiency + confirmation. Take it and manage it.", drift: 0.5 }
];

function startTrapOrTrade(stage) {
  const CARDS = 8;
  const track = typeof currentTrackId === "function" ? currentTrackId() : "futures";
  const niche = TRAP_DECKS_BY_TRACK[track] || [];
  const pool = niche.length ? [...niche, ...TRAP_OR_TRADE_DECK.slice(0, 8)] : [...TRAP_OR_TRADE_DECK];
  const deck = pool.sort(() => Math.random() - 0.5).slice(0, CARDS);
  let cardIndex = 0;
  let combo = 0;
  let pot = 0;
  let correctCount = 0;
  let timer = null;

  stage.innerHTML = `
    <div class="arcade-game trap-trade">
      <div class="arcade-round-strip" id="trap-rounds"></div>
      <canvas class="arcade-canvas short" id="trap-canvas"></canvas>
      <div class="trap-context" id="trap-context"></div>
      <div class="gap-timer"><i id="trap-timer-fill"></i></div>
      <div class="arcade-controls">
        <button class="arcade-call short wide" id="trap-skip" type="button"><i data-lucide="shield"></i> SKIP</button>
        <button class="arcade-call long wide" id="trap-take" type="button"><i data-lucide="zap"></i> TAKE</button>
      </div>
      <p class="arcade-hint" id="trap-hint">Half these setups are traps. Your edge is knowing which trades NOT to take.</p>
    </div>
  `;

  const canvas = stage.querySelector("#trap-canvas");
  const contextEl = stage.querySelector("#trap-context");
  const roundsEl = stage.querySelector("#trap-rounds");
  const timerFill = stage.querySelector("#trap-timer-fill");
  let card = null;

  const renderRounds = () => {
    roundsEl.innerHTML = deck.map((_, i) =>
      `<span class="${i < cardIndex ? "done" : i === cardIndex ? "active" : ""}">${i + 1}</span>`
    ).join("");
  };

  const endRun = () => {
    arcadeResultScreen(stage, {
      gameId: "traportrade",
      xp: pot,
      headline: `${correctCount}/${CARDS} correct reads`,
      sub: correctCount >= 6 ? "Discipline like that passes prop evals." : "The skip button is a weapon. Use it more.",
      lesson: "Professionals are paid for the trades they don't take."
    });
  };

  const decide = (take) => {
    clearTimeout(timer);
    if (!card) return;
    const correct = take === card.valid;
    if (take && !card.valid && typeof telemetryRecord === "function") telemetryRecord("chase");
    if (correct) {
      combo += 1;
      correctCount += 1;
      const gain = Math.round(15 * (1 + (combo - 1) * 0.4));
      pot += gain;
      stage.querySelector("#trap-hint").textContent = `✓ +${gain} XP — ${card.why}`;
    } else {
      combo = 0;
      stage.querySelector("#trap-hint").textContent = `✗ ${card.why}`;
    }
    arcadeHud({ pot, mult: 1 + combo * 0.4, streak: combo });
    arcadeSound(correct ? "win" : "lose");
    cardIndex += 1;
    card = null;
    setTimeout(() => (cardIndex >= CARDS ? endRun() : nextCard()), 2100);
  };

  const nextCard = () => {
    card = deck[cardIndex];
    const rand = arcadeRng(Math.floor(Math.random() * 1e9));
    const candles = genArcadeCandles(22, { rand, vol: 1, drift: card.drift });
    candles[candles.length - 1].glow = true;
    drawArcadeChart(canvas, candles, { rightPad: 20 });
    contextEl.textContent = card.context;
    stage.querySelector("#trap-hint").textContent = "Trap or trade? 7 seconds.";
    renderRounds();
    timerFill.style.transition = "none";
    timerFill.style.width = "100%";
    requestAnimationFrame(() => {
      timerFill.style.transition = "width 7s linear";
      timerFill.style.width = "0%";
    });
    timer = setTimeout(() => {
      // no decision = an implicit TAKE of doing nothing; hesitation on valid setups costs
      arcadeSound("timeout");
      const wasValid = card.valid;
      if (wasValid && typeof telemetryRecord === "function") telemetryRecord("hesitation");
      combo = 0;
      stage.querySelector("#trap-hint").textContent = wasValid
        ? "✗ Froze on a valid setup. A plan you can't execute isn't a plan."
        : "✓ Slow, but skipping was right.";
      if (!wasValid) { correctCount += 1; pot += 8; }
      arcadeHud({ pot, mult: 1, streak: 0 });
      cardIndex += 1;
      card = null;
      setTimeout(() => (cardIndex >= CARDS ? endRun() : nextCard()), 2100);
    }, 7000);
  };

  stage.querySelector("#trap-take").addEventListener("click", () => decide(true));
  stage.querySelector("#trap-skip").addEventListener("click", () => decide(false));
  arcadeState.cleanup = () => clearTimeout(timer);
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  nextCard();
  if (window.lucide) window.lucide.createIcons();
}

/* ============================================================
   GAME 6 — RISK MINES (Tier 6: Psychology & Risk)
   16 cards. 4 account-killers. Flip habits, ride the multiplier,
   cash out before you hit one.
============================================================ */

const RISK_MINES_SAFE = [
  "Took partials at 1R", "Skipped the news candle", "Sized from the stop",
  "Kept risk at 1%", "Logged the trade", "Walked away after 2 losses",
  "Waited for the killzone", "Let the winner reach target", "Checked HTF bias first",
  "Stop beyond the zone", "Accepted the small loss", "Followed the checklist",
  "Ended a green day early", "Traded the plan, not the P&L", "One setup, mastered"
];

const RISK_MINES_MINES = [
  "REVENGE TRADED THE LOSS", "REMOVED THE STOP LOSS", "10% SIZE ON A HUNCH", "AVERAGED DOWN A LOSER"
];

function startRiskMines(stage) {
  const GRID = 16;
  const MINES = 4;
  const rand = arcadeRng(Math.floor(Math.random() * 1e9));
  const mineSet = new Set();
  while (mineSet.size < MINES) mineSet.add(Math.floor(rand() * GRID));
  const safeTexts = [...RISK_MINES_SAFE].sort(() => rand() - 0.5);
  const mineTexts = [...RISK_MINES_MINES].sort(() => rand() - 0.5);
  let safePicks = 0;
  let pot = 0;
  let alive = true;

  stage.innerHTML = `
    <div class="arcade-game risk-mines">
      <div class="mines-grid" id="mines-grid">
        ${Array.from({ length: GRID }, (_, i) => `
          <button class="mine-card" type="button" data-index="${i}"><span class="mine-card-back"><i data-lucide="help-circle"></i></span></button>
        `).join("")}
      </div>
      <div class="arcade-controls single">
        <button class="arcade-cashout mega" id="mines-cashout" type="button" disabled>CASH OUT<small>0 XP</small></button>
      </div>
      <p class="arcade-hint">12 disciplined habits. 4 account-killers. Every good habit multiplies the pot — one bad habit ends it. Just like real trading.</p>
    </div>
  `;

  const cashBtn = stage.querySelector("#mines-cashout");
  const multFor = () => Math.pow(1.25, safePicks);

  const reveal = (button, index, deathBlow) => {
    const isMine = mineSet.has(index);
    button.disabled = true;
    button.classList.add("flipped", isMine ? "mine" : "safe");
    const text = isMine ? mineTexts[[...mineSet].indexOf(index) % mineTexts.length] : safeTexts[index % safeTexts.length];
    button.innerHTML = `<span class="mine-card-face">${isMine ? "💥 " : ""}${text}</span>`;
    if (deathBlow && !isMine) button.classList.add("dim");
  };

  stage.querySelectorAll(".mine-card").forEach((button) => {
    button.addEventListener("click", () => {
      if (!alive || button.disabled) return;
      const index = Number(button.dataset.index);
      if (mineSet.has(index)) {
        alive = false;
        if (typeof telemetryRecord === "function") telemetryRecord("tilt");
        reveal(button, index);
        stage.querySelectorAll(".mine-card:not(.flipped)").forEach((other) => reveal(other, Number(other.dataset.index), true));
        cashBtn.disabled = true;
        arcadeSound("crash");
        setTimeout(() => {
          arcadeResultScreen(stage, {
            gameId: "riskmines",
            xp: 0,
            headline: "ACCOUNT BLOWN",
            sub: `One bad habit erased ${Math.round(pot)} XP of good decisions.`,
            lesson: "That's the real math of tilt: one violation wipes out weeks of discipline."
          });
        }, 1600);
      } else {
        safePicks += 1;
        pot = Math.round(12 * safePicks * multFor());
        reveal(button, index);
        arcadeHud({ pot, mult: multFor(), streak: safePicks });
        cashBtn.disabled = false;
        cashBtn.querySelector("small").textContent = `${pot} XP`;
        arcadeSound("flip", safePicks);
        if (safePicks >= GRID - MINES) {
          alive = false;
          if (typeof awardBadgeOnce === "function") awardBadgeOnce("mines_perfect", "Perfect Discipline", "You cleared Risk Mines without a single account-killer.");
          setTimeout(() => {
            arcadeResultScreen(stage, {
              gameId: "riskmines",
              xp: pot * 1.5,
              headline: "PERFECT DISCIPLINE",
              sub: "Every good habit found. Every killer avoided.",
              lesson: "This is what a funded trader's month looks like."
            });
          }, 900);
        }
      }
    });
  });

  cashBtn.addEventListener("click", () => {
    if (!alive || pot <= 0) return;
    alive = false;
    arcadeResultScreen(stage, {
      gameId: "riskmines",
      xp: pot,
      headline: `Banked at ${multFor().toFixed(2)}x`,
      sub: `${safePicks} clean decisions, walked away paid.`,
      lesson: "Knowing when to stop is the rarest trading skill."
    });
  });

  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  if (window.lucide) window.lucide.createIcons();
}

/* ============================================================
   GAME 7 — PROP RUN (Tier 7: Proving Ground)
   Survive the evaluation: pick your risk, dodge the drawdown,
   hit the target to get "funded".
============================================================ */

function startPropRun(stage) {
  const START = 50000;
  const TARGET = 53000;
  const TRAIL = 2000;
  const MAX_ROUNDS = 12;
  let equity = START;
  let peak = START;
  let roundNum = 0;
  let setup = null;

  stage.innerHTML = `
    <div class="arcade-game prop-run">
      <div class="prop-bars">
        <div class="prop-bar">
          <div class="prop-bar-head"><span>EQUITY</span><strong id="prop-equity">$50,000</strong></div>
          <div class="prop-track"><i id="prop-equity-fill"></i><b id="prop-floor-mark"></b></div>
          <div class="prop-bar-foot"><small id="prop-floor">Floor $48,000</small><small>Target $53,000</small></div>
        </div>
      </div>
      <canvas class="arcade-canvas short" id="prop-canvas"></canvas>
      <div class="prop-quality" id="prop-quality"></div>
      <div class="arcade-controls">
        <button class="arcade-btn ghost wide" id="prop-skip" type="button">SKIP</button>
        <button class="arcade-btn primary wide" id="prop-risk1" type="button">RISK $250</button>
        <button class="arcade-btn danger wide" id="prop-risk2" type="button">RISK $500</button>
      </div>
      <p class="arcade-hint" id="prop-hint">12 setups. Read the confluence chips — skip the junk, size the A+. Breach the floor and the evaluation ends.</p>
    </div>
  `;

  const canvas = stage.querySelector("#prop-canvas");
  const qualityEl = stage.querySelector("#prop-quality");
  const hintEl = stage.querySelector("#prop-hint");
  const money = (value) => `$${Math.round(value).toLocaleString()}`;

  const floor = () => peak - TRAIL;

  const refreshBars = () => {
    document.getElementById("prop-equity").textContent = money(equity);
    document.getElementById("prop-floor").textContent = `Floor ${money(floor())}`;
    const low = START - TRAIL;
    const pct = Math.max(0, Math.min(1, (equity - low) / (TARGET - low)));
    document.getElementById("prop-equity-fill").style.width = `${pct * 100}%`;
    const floorPct = Math.max(0, Math.min(1, (floor() - low) / (TARGET - low)));
    document.getElementById("prop-floor-mark").style.left = `${floorPct * 100}%`;
    arcadeHud({ pot: Math.max(0, equity - START) / 10, mult: 1, streak: roundNum });
  };

  const CHIPS = ["HTF aligned", "Liquidity swept", "Killzone", "Fresh zone", "Displacement"];

  const newSetup = () => {
    roundNum += 1;
    const rand = arcadeRng(Math.floor(Math.random() * 1e9));
    const grade = rand();
    const quality = grade > 0.62 ? "A" : grade > 0.3 ? "B" : "C";
    const winRate = quality === "A" ? 0.7 : quality === "B" ? 0.55 : 0.33;
    const chipCount = quality === "A" ? 4 : quality === "B" ? 3 : 1;
    const chips = [...CHIPS].sort(() => rand() - 0.5).map((chip, index) => ({ chip, on: index < chipCount }));
    setup = { quality, winRate, rand };
    const candles = genArcadeCandles(20, { rand, vol: 1, drift: (rand() - 0.5) * 0.8 });
    candles[candles.length - 1].glow = true;
    drawArcadeChart(canvas, candles, { rightPad: 20 });
    qualityEl.innerHTML = chips.map(({ chip, on }) =>
      `<span class="prop-chip ${on ? "on" : "off"}">${on ? "✓" : "✗"} ${chip}</span>`
    ).join("");
    hintEl.textContent = `Setup ${roundNum}/${MAX_ROUNDS} — count the confluence before you size.`;
  };

  const finish = (funded, busted) => {
    const profit = equity - START;
    if (funded) {
      if (typeof awardBadgeOnce === "function") awardBadgeOnce("prop_run_funded", "Funded Trader", "You passed the Prop Run evaluation.");
      arcadeResultScreen(stage, {
        gameId: "proprun",
        xp: 250,
        headline: "FUNDED 🏆",
        sub: `Target hit with ${money(equity)} — evaluation passed.`,
        lesson: "Small consistent risk on quality setups. That's the whole cheat code."
      });
    } else if (busted) {
      arcadeResultScreen(stage, {
        gameId: "proprun",
        xp: 0,
        headline: "EVALUATION FAILED",
        sub: `Trailing floor breached at ${money(equity)}.`,
        lesson: "Prop evals aren't lost to bad setups — they're lost to oversized ones."
      });
    } else {
      arcadeResultScreen(stage, {
        gameId: "proprun",
        xp: Math.max(10, Math.round(profit / 15)),
        headline: profit >= 0 ? `Survived with ${money(equity)}` : `Ended at ${money(equity)}`,
        sub: "Out of setups before the target — consistency over home runs.",
        lesson: "Skipping C-setups IS the strategy. Only size when confluence stacks."
      });
    }
  };

  const act = (risk) => {
    if (!setup) return;
    if (risk === 500 && setup.quality === "C" && typeof telemetryRecord === "function") telemetryRecord("oversize");
    if (risk > 0) {
      const won = setup.rand() < setup.winRate;
      const change = won ? risk * 1.8 : -risk;
      equity += change;
      peak = Math.max(peak, equity);
      hintEl.textContent = won
        ? `✓ +${money(change)} — the ${setup.quality}-setup paid 1.8R.`
        : `✗ ${money(change)} — even good reads lose sometimes. Size made it survivable${setup.quality === "C" ? "... barely. That was a C-setup." : "."}`;
      arcadeSound(won ? "win" : "lose");
    } else {
      hintEl.textContent = setup.quality === "C"
        ? "✓ Good skip — that was a C-grade setup."
        : `Skipped a ${setup.quality}-setup. Selective is fine; scared is expensive.`;
    }
    refreshBars();
    setup = null;
    if (equity <= floor()) return setTimeout(() => finish(false, true), 1200);
    if (equity >= TARGET) return setTimeout(() => finish(true, false), 1200);
    if (roundNum >= MAX_ROUNDS) return setTimeout(() => finish(false, false), 1200);
    setTimeout(newSetup, 1400);
  };

  stage.querySelector("#prop-skip").addEventListener("click", () => act(0));
  stage.querySelector("#prop-risk1").addEventListener("click", () => act(250));
  stage.querySelector("#prop-risk2").addEventListener("click", () => act(500));

  refreshBars();
  newSetup();
}


/* ============================================================
   GAME 8 — FLOW READER (Orderflow stage) — NEW
   Read the footprint at a key level: absorption or initiative?
============================================================ */

function startFlowReader(stage) {
  const ROUNDS = 8;
  let roundIndex = 0;
  let combo = 0;
  let pot = 0;
  let timer = null;
  let round = null;

  stage.innerHTML = `
    <div class="arcade-game flow-reader">
      <div class="arcade-round-strip" id="flow-rounds"></div>
      <div class="flow-context" id="flow-context"></div>
      <div class="flow-grid-wrap">
        <div class="flow-grid-head"><span>PRICE</span><span>BID×ASK</span><span>Δ DELTA</span></div>
        <div class="flow-grid" id="flow-grid"></div>
        <div class="flow-summary" id="flow-summary"></div>
      </div>
      <div class="gap-timer"><i id="flow-timer-fill"></i></div>
      <div class="arcade-controls">
        <button class="arcade-call long wide" id="flow-absorb" type="button"><i data-lucide="shield"></i> ABSORPTION — fade it</button>
        <button class="arcade-call short wide" id="flow-drive" type="button"><i data-lucide="zap"></i> INITIATIVE — ride it</button>
      </div>
      <p class="arcade-hint" id="flow-hint">Aggression into a wall that holds = absorption. Aggression that keeps paying = initiative.</p>
    </div>
  `;

  const gridEl = stage.querySelector("#flow-grid");
  const contextEl = stage.querySelector("#flow-context");
  const summaryEl = stage.querySelector("#flow-summary");
  const roundsEl = stage.querySelector("#flow-rounds");
  const timerFill = stage.querySelector("#flow-timer-fill");

  const renderRounds = () => {
    roundsEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<span class="${i < roundIndex ? "done" : i === roundIndex ? "active" : ""}">${i + 1}</span>`
    ).join("");
  };

  const endRun = () => {
    arcadeResultScreen(stage, {
      gameId: "flowreader",
      xp: pot,
      headline: `${pot} XP of flow read`,
      sub: combo >= 4 ? "You read the tape like a prop desk." : "Volume vs progress — keep drilling the divergence.",
      lesson: "Massive volume with zero progress means a passive wall is winning. Progress WITH the volume means the aggressors still rule."
    });
  };

  const newRound = () => {
    const rand = arcadeRng(Math.floor(Math.random() * 1e9));
    const isAbsorption = rand() > 0.5;
    const atSupport = rand() > 0.5;
    const base = 100 + Math.round(rand() * 400);
    const rows = [];
    for (let i = 0; i < 6; i += 1) {
      const price = (base - i * 0.25).toFixed(2);
      let bid;
      let ask;
      const hot = i >= 4; // the key level rows at the bottom (or top mirrored)
      if (isAbsorption) {
        // heavy aggression into the level, one-sided, but price holds
        if (atSupport) { bid = hot ? 900 + Math.round(rand() * 900) : 120 + Math.round(rand() * 180); ask = 60 + Math.round(rand() * 120); }
        else { ask = hot ? 900 + Math.round(rand() * 900) : 120 + Math.round(rand() * 180); bid = 60 + Math.round(rand() * 120); }
      } else {
        // stacked imbalances driving through
        if (atSupport) { ask = 400 + Math.round(rand() * 700); bid = Math.round(ask / (3.2 + rand() * 2)); }
        else { bid = 400 + Math.round(rand() * 700); ask = Math.round(bid / (3.2 + rand() * 2)); }
      }
      rows.push({ price, bid, ask });
    }
    const delta = rows.reduce((sum, row) => sum + (row.ask - row.bid), 0);
    const priceChange = isAbsorption ? (rand() * 0.5 - 0.25).toFixed(2) : (atSupport ? "+" : "-") + (2 + rand() * 3).toFixed(2);
    round = { isAbsorption, atSupport };

    contextEl.textContent = atSupport
      ? "Price just swept a marked support level. The last three minutes of executed volume:"
      : "Price just ran a marked resistance level. The last three minutes of executed volume:";

    gridEl.innerHTML = rows.map((row) => {
      const ratio = Math.max(row.bid, row.ask) / Math.max(1, Math.min(row.bid, row.ask));
      const imbalance = ratio >= 3 ? (row.ask > row.bid ? "ask-imb" : "bid-imb") : "";
      return `
        <div class="flow-row ${imbalance}">
          <span class="flow-price">${row.price}</span>
          <span class="flow-vol"><b class="bid">${row.bid}</b> × <b class="ask">${row.ask}</b></span>
          <span class="flow-delta ${row.ask - row.bid >= 0 ? "pos" : "neg"}">${row.ask - row.bid >= 0 ? "+" : ""}${row.ask - row.bid}</span>
        </div>
      `;
    }).join("");
    summaryEl.innerHTML = `
      <span>Bar delta: <b class="${delta >= 0 ? "pos" : "neg"}">${delta >= 0 ? "+" : ""}${delta}</b></span>
      <span>Price progress: <b class="${String(priceChange).startsWith("-") ? "neg" : "pos"}">${priceChange} pts</b></span>
    `;
    stage.querySelector("#flow-hint").textContent = "10 seconds: is the wall winning, or the aggression?";
    renderRounds();

    timerFill.style.transition = "none";
    timerFill.style.width = "100%";
    requestAnimationFrame(() => {
      timerFill.style.transition = "width 10s linear";
      timerFill.style.width = "0%";
    });
    clearTimeout(timer);
    timer = setTimeout(() => decide(null), 10000);
  };

  const decide = (saidAbsorption) => {
    clearTimeout(timer);
    if (!round) return;
    const correct = saidAbsorption === round.isAbsorption;
    if (saidAbsorption === null) {
      combo = 0;
      stage.querySelector("#flow-hint").textContent = `Too slow — it was ${round.isAbsorption ? "absorption: huge volume, no progress" : "initiative: stacked imbalances with follow-through"}.`;
      arcadeSound("timeout");
    } else if (correct) {
      combo += 1;
      const gain = Math.round(25 * (1 + (combo - 1) * 0.5));
      pot += gain;
      stage.querySelector("#flow-hint").textContent = `✓ +${gain} XP — ${round.isAbsorption ? "maximum effort, zero progress: the wall won." : "aggression kept paying: ride the drive."}`;
      arcadeSound("win");
    } else {
      combo = 0;
      stage.querySelector("#flow-hint").textContent = `✗ ${round.isAbsorption ? "That volume bought NO progress — a passive wall was absorbing it." : "Delta and price agreed — that was initiative, not a wall."}`;
      arcadeSound("lose");
    }
    arcadeHud({ pot, mult: 1 + combo * 0.5, streak: combo });
    roundIndex += 1;
    round = null;
    setTimeout(() => (roundIndex >= ROUNDS ? endRun() : newRound()), 2200);
  };

  stage.querySelector("#flow-absorb").addEventListener("click", () => decide(true));
  stage.querySelector("#flow-drive").addEventListener("click", () => decide(false));
  arcadeState.cleanup = () => clearTimeout(timer);
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  newRound();
  if (window.lucide) window.lucide.createIcons();
}


/* ============================================================
   SIGNATURE GAMES — one unique teacher per market
============================================================ */

/* helper: decision-round shell shared by signature games */
function startDecisionRounds(stage, config) {
  const ROUNDS = config.rounds || 8;
  let roundIndex = 0;
  let combo = 0;
  let pot = 0;
  let correctCount = 0;
  let timer = null;
  let current = null;

  stage.innerHTML = `
    <div class="arcade-game sig-game">
      <div class="arcade-round-strip" id="sig-rounds"></div>
      <div class="sig-board ${config.boardClass || ""}" id="sig-board"></div>
      <div class="gap-timer"><i id="sig-timer-fill"></i></div>
      <div class="arcade-controls" id="sig-controls"></div>
      <p class="arcade-hint" id="sig-hint">${config.hint}</p>
    </div>
  `;
  const boardEl = stage.querySelector("#sig-board");
  const controlsEl = stage.querySelector("#sig-controls");
  const roundsEl = stage.querySelector("#sig-rounds");
  const timerFill = stage.querySelector("#sig-timer-fill");
  const hintEl = stage.querySelector("#sig-hint");

  const renderRounds = () => {
    roundsEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<span class="${i < roundIndex ? "done" : i === roundIndex ? "active" : ""}">${i + 1}</span>`
    ).join("");
  };

  const endRun = () => {
    arcadeResultScreen(stage, {
      gameId: config.gameId,
      xp: pot,
      headline: `${correctCount}/${ROUNDS} correct reads`,
      sub: correctCount >= ROUNDS - 2 ? config.winSub : config.loseSub,
      lesson: config.lesson
    });
  };

  const decide = (answerKey) => {
    clearTimeout(timer);
    if (!current) return;
    const correct = answerKey === current.answer;
    if (answerKey === null) {
      combo = 0;
      hintEl.textContent = `⏱ Too slow — ${current.explain}`;
      arcadeSound("timeout");
    } else if (correct) {
      combo += 1;
      correctCount += 1;
      const gain = Math.round(18 * (1 + (combo - 1) * 0.45));
      pot += gain;
      hintEl.textContent = `✓ +${gain} XP — ${current.explain}`;
      arcadeSound("win");
    } else {
      combo = 0;
      hintEl.textContent = `✗ ${current.explain}`;
      arcadeSound("lose");
    }
    if (current.revealHtml) boardEl.insertAdjacentHTML("beforeend", current.revealHtml);
    if (config.boardClass === "swipe-deck") {
      const top = boardEl.querySelector(".judge-card");
      if (top) top.classList.add(answerKey === "go" || answerKey === "up" ? "swipe-right" : "swipe-left");
    }
    arcadeHud({ pot, mult: 1 + combo * 0.45, streak: combo });
    roundIndex += 1;
    const answered = current;
    current = null;
    setTimeout(() => (roundIndex >= ROUNDS ? endRun() : nextRound()), 2300);
  };

  const nextRound = () => {
    current = config.makeRound();
    boardEl.innerHTML = current.board;
    controlsEl.innerHTML = current.controls;
    controlsEl.querySelectorAll("[data-sig-answer]").forEach((button) => {
      button.addEventListener("click", () => decide(button.dataset.sigAnswer));
    });
    boardEl.querySelectorAll("[data-sig-answer]").forEach((tile) => {
      tile.addEventListener("click", () => decide(tile.dataset.sigAnswer));
    });
    hintEl.textContent = current.prompt || config.hint;
    renderRounds();
    timerFill.style.transition = "none";
    timerFill.style.width = "100%";
    requestAnimationFrame(() => {
      timerFill.style.transition = `width ${config.seconds || 9}s linear`;
      timerFill.style.width = "0%";
    });
    timer = setTimeout(() => decide(null), (config.seconds || 9) * 1000);
    if (window.lucide) window.lucide.createIcons();
  };

  arcadeState.cleanup = () => clearTimeout(timer);
  arcadeHud({ pot: 0, mult: 1, streak: 0 });
  nextRound();
}

/* PAIR MATRIX (forex) — spot the correlation liar */
function startPairMatrix(stage) {
  startDecisionRounds(stage, {
    gameId: "pairmatrix",
    boardClass: "matrix-arena",
    rounds: 8,
    seconds: 9,
    hint: "Four correlated charts. One is lying. Click the divergence.",
    winSub: "You read cross-market flows like a desk head.",
    loseSub: "Check every pair against the dollar tide first.",
    lesson: "When correlated instruments disagree, the odd one out is usually the engineered move — and the trade.",
    makeRound: () => {
      const dollarUp = Math.random() > 0.5;
      const tiles = [
        { symbol: "DXY", dir: dollarUp ? "up" : "down" },
        { symbol: "EUR/USD", dir: dollarUp ? "down" : "up" },
        { symbol: "GBP/USD", dir: dollarUp ? "down" : "up" },
        { symbol: "USD/JPY", dir: dollarUp ? "up" : "down" }
      ];
      const liar = 1 + Math.floor(Math.random() * 3); // never DXY — it IS the tide
      tiles[liar].dir = tiles[liar].dir === "up" ? "down" : "up";
      tiles[liar].liar = true;
      return {
        answer: tiles[liar].symbol,
        prompt: `The dollar is ${dollarUp ? "strong" : "weak"} — which pair is out of line?`,
        explain: `${tiles[liar].symbol} was fighting the dollar tide — SMT divergence flags it as the engineered move.`,
        board: `<div class="matrix-grid">${tiles.map((tile) => `
          <button class="matrix-tile ${tile.dir}" type="button" data-sig-answer="${tile.symbol}">
            <b>${tile.symbol}</b>
            <span class="matrix-arrow">${tile.dir === "up" ? "▲" : "▼"}</span>
            <small>${tile.dir === "up" ? "pushing highs" : "pushing lows"}</small>
          </button>`).join("")}</div>`,
        controls: ""
      };
    }
  });
}

/* GAP JUDGE (stocks) — go or fade the morning gap */
function startGapJudge(stage) {
  startDecisionRounds(stage, {
    gameId: "gapjudge",
    boardClass: "swipe-deck",
    rounds: 8,
    seconds: 9,
    hint: "Premarket card: does this gap RUN or FADE?",
    winSub: "That's a professional morning scan.",
    loseSub: "Fuel first: catalyst + volume + float. No fuel, no go.",
    lesson: "Gap-and-go needs fresh catalyst, heavy relative volume, and tight float. Missing fuel = fade back to yesterday's close.",
    makeRound: () => {
      const go = Math.random() > 0.5;
      const gapPct = go ? 4 + Math.round(Math.random() * 14) : Math.random() > 0.5 ? 3 + Math.round(Math.random() * 30) : 2 + Math.round(Math.random() * 6);
      const rvol = go ? 4 + Math.round(Math.random() * 8) : Math.random() > 0.5 ? 1 : 2;
      const float_ = go ? 3 + Math.round(Math.random() * 25) : 80 + Math.round(Math.random() * 400);
      const catalyst = go ? ["Earnings beat + raised guidance", "FDA approval", "Major contract win"][Math.floor(Math.random() * 3)]
        : ["No news", "Week-old press release", "Reddit mention"][Math.floor(Math.random() * 3)];
      return {
        answer: go ? "go" : "fade",
        prompt: "Gap & Go — or fade to yesterday's close?",
        explain: go
          ? `Fresh catalyst + RVOL ${rvol} + ${float_}M float = fuel. This profile continues.`
          : `${rvol < 2 ? `RVOL ${rvol} means nobody came` : "Stale catalyst"} — no fuel, gravity wins.`,
        board: `<div class="swipe-stack">
          <div class="judge-card swipe-ghost g2"></div>
          <div class="judge-card swipe-ghost g1"></div>
          <div class="judge-card swipe-top">
            <div class="swipe-ticker">$${["NRGX","BLZE","QMED","VLTA","SNAP2","KRDX"][Math.floor(Math.random()*6)]}</div>
            <div class="judge-row"><span>Gap</span><b class="pos">+${gapPct}%</b></div>
            <div class="judge-row"><span>Rel. volume</span><b class="${rvol >= 3 ? "pos" : "neg"}">${rvol}x</b></div>
            <div class="judge-row"><span>Float</span><b>${float_}M</b></div>
            <div class="judge-row"><span>Catalyst</span><b>${catalyst}</b></div>
            <div class="swipe-hints"><span>← FADE</span><span>GO →</span></div>
          </div>
        </div>`,
        controls: `
          <button class="arcade-call long wide" type="button" data-sig-answer="go"><i data-lucide="rocket"></i> GAP &amp; GO</button>
          <button class="arcade-call short wide" type="button" data-sig-answer="fade"><i data-lucide="arrow-down-right"></i> FADE IT</button>`
      };
    }
  });
}

/* GREEK GAUNTLET (options) — will the position make money? */
function startGreekGauntlet(stage) {
  startDecisionRounds(stage, {
    gameId: "greekgauntlet",
    boardClass: "greek-desk",
    rounds: 8,
    seconds: 12,
    hint: "Delta pays, theta bills, vega swings. Net the greeks: up or down?",
    winSub: "You can price an option in your head. Rare air.",
    loseSub: "Run the three lines every time: Δ×move, vega×IV, theta×days.",
    lesson: "P&L = delta gains ± vega swings − theta rent. If you can't net those three in your head, the market nets them for you.",
    makeRound: () => {
      const delta = [0.3, 0.45, 0.6][Math.floor(Math.random() * 3)];
      const move = (Math.random() * 3 - 1).toFixed(1); // -1.0 .. +2.0 %-ish points
      const stockPts = Number(move) * 2; // dollar move on a $200 stock scaled
      const ivChange = Math.round(Math.random() * 16 - 8);
      const days = 1 + Math.floor(Math.random() * 2);
      const vega = 0.09;
      const theta = -0.11;
      const pnl = delta * stockPts + vega * ivChange + theta * days;
      const deltaPnl = delta * stockPts;
      const vegaPnl = vega * ivChange;
      const thetaPnl = theta * days;
      const maxAbs = Math.max(Math.abs(deltaPnl), Math.abs(vegaPnl), Math.abs(thetaPnl), 0.01);
      const bar = (label, value) => `<div class="greek-bar-row"><span>${label}</span><div class="greek-bar"><i class="${value >= 0 ? "pos" : "neg"}" style="width:${Math.round(Math.abs(value) / maxAbs * 100)}%"></i></div><b class="${value >= 0 ? "pos" : "neg"}">${value >= 0 ? "+" : ""}${value.toFixed(2)}</b></div>`;
      return {
        answer: pnl >= 0 ? "up" : "down",
        prompt: "One day on the desk — does this long call finish green?",
        explain: `Net P&L: ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} — the bars below show which greek did the damage.`,
        revealHtml: `<div class="greek-breakdown">${bar("Δ delta", deltaPnl)}${bar("ν vega", vegaPnl)}${bar("θ theta", thetaPnl)}<div class="greek-net ${pnl >= 0 ? "pos" : "neg"}">NET ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}</div></div>`,
        board: `<div class="judge-card">
          <div class="judge-row"><span>Position</span><b>Long call · ${delta}Δ</b></div>
          <div class="judge-row"><span>Stock move</span><b class="${stockPts >= 0 ? "pos" : "neg"}">${stockPts >= 0 ? "+" : ""}${stockPts.toFixed(1)} pts</b></div>
          <div class="judge-row"><span>IV change</span><b class="${ivChange >= 0 ? "pos" : "neg"}">${ivChange >= 0 ? "+" : ""}${ivChange} pts</b></div>
          <div class="judge-row"><span>Time passing</span><b>${days} day${days > 1 ? "s" : ""} (θ −0.11/day)</b></div>
        </div>`,
        controls: `
          <button class="arcade-call long wide" type="button" data-sig-answer="up"><i data-lucide="trending-up"></i> FINISHES GREEN</button>
          <button class="arcade-call short wide" type="button" data-sig-answer="down"><i data-lucide="trending-down"></i> FINISHES RED</button>`
      };
    }
  });
}

/* FUNDING FLIP (crypto) — read the positioning, call the squeeze */
function startFundingFlip(stage) {
  startDecisionRounds(stage, {
    gameId: "fundingflip",
    boardClass: "pressure-rig",
    rounds: 8,
    seconds: 10,
    hint: "Funding + open interest + location = who's about to get squeezed?",
    winSub: "You read positioning like a liquidation engine.",
    loseSub: "Crowded side + leverage + a wall = the side that pays.",
    lesson: "Squeezes need three things: a crowded side (funding), leverage building (OI rising), and a level to trap them against.",
    makeRound: () => {
      const kind = ["long", "short", "none"][Math.floor(Math.random() * 3)];
      const funding = kind === "long" ? (0.04 + Math.random() * 0.08).toFixed(3)
        : kind === "short" ? (-0.04 - Math.random() * 0.08).toFixed(3)
        : Math.random() > 0.5
          ? (Math.random() * 0.06 - 0.03).toFixed(3) // crowded-ish funding, but OI is bleeding — no fuel
          : (Math.random() * 0.01 - 0.005).toFixed(3);
      const oi = kind === "none" ? -(2 + Math.round(Math.random() * 8)) : 6 + Math.round(Math.random() * 18);
      const location = kind === "long" ? "pressing into major resistance" : kind === "short" ? "grinding on major support" : "mid-range, no level nearby";
      return {
        answer: kind,
        prompt: "Who gets squeezed?",
        explain: kind === "long"
          ? "Longs crowded (positive funding), leverage building, trapped at resistance — cascade risk is DOWN."
          : kind === "short"
            ? "Shorts paying to stay in, OI rising on support — the pop UP takes them."
            : "OI is FALLING — positions are closing, not building. Whatever funding says, there's no fuel and no squeeze.",
        board: `<div class="pressure-board">
          <div class="pressure-gauge" style="--pressure:${Math.max(6, Math.min(94, Math.round(50 + Number(funding) * 550)))}">
            <div class="pressure-dial"></div>
            <i class="pressure-needle"></i>
            <span class="pressure-label-l">SHORTS<br>CROWDED</span>
            <span class="pressure-label-c">NEUTRAL</span>
            <span class="pressure-label-r">LONGS<br>CROWDED</span>
          </div>
          <div class="judge-card pressure-readout">
            <div class="judge-row"><span>Funding (8h)</span><b class="${Number(funding) > 0.01 ? "neg" : Number(funding) < -0.01 ? "pos" : ""}">${funding}%</b></div>
            <div class="judge-row"><span>Open interest</span><b class="${oi > 0 ? "pos" : "neg"}">${oi > 0 ? "+" : ""}${oi}% (24h)</b></div>
            <div class="judge-row"><span>Price location</span><b>${location}</b></div>
          </div>
        </div>`,
        controls: `
          <button class="arcade-call short wide" type="button" data-sig-answer="long">LONG SQUEEZE ↓</button>
          <button class="arcade-btn ghost wide" type="button" data-sig-answer="none">NO SQUEEZE</button>
          <button class="arcade-call long wide" type="button" data-sig-answer="short">SHORT SQUEEZE ↑</button>`
      };
    }
  });
}

/* ---------- game registry ---------- */

const arcadeGames = [
  { id: "candlerush", tier: 0, title: "Candle Rush", tagline: "Call the candle. Ride the streak. Cash out.", icon: "flame", color: "green", start: startCandleRush },
  { id: "zonesniper", tier: 1, title: "Zone Sniper", tagline: "Predict where the wick lands. Precision pays.", icon: "crosshair", color: "cyan", start: startZoneSniper },
  { id: "stophunt", tier: 2, title: "Stop Hunt", tagline: "Multiplier climbs to the pool. Escape the sweep.", icon: "waves", color: "gold", start: startStopHunt },
  { id: "gaphunter", tier: 3, title: "Gap Hunter", tagline: "Spot the real FVG before the clock dies.", icon: "scan-line", color: "purple", start: startGapHunter },
  { id: "traportrade", tier: 4, title: "Trap or Trade", tagline: "7 seconds. Take the setup or dodge the trap.", icon: "swords", color: "red", start: startTrapOrTrade },
  { id: "riskmines", tier: 5, title: "Risk Mines", tagline: "Flip good habits. Avoid the account-killers.", icon: "bomb", color: "orange", start: startRiskMines },
  { id: "proprun", tier: 6, title: "Prop Run", tagline: "Pass the evaluation. Get funded.", icon: "trophy", color: "blue", start: startPropRun },
  { id: "flowreader", tier: 7, special: "orderflow", trackOnly: "futures", title: "Flow Reader", tagline: "Read the footprint: absorption or initiative?", icon: "activity", color: "gold", start: startFlowReader },
  { id: "pairmatrix", tier: 2, trackOnly: "forex", title: "Pair Matrix", tagline: "Four charts, one liar. Spot the divergence.", icon: "git-compare", color: "cyan", start: startPairMatrix },
  { id: "gapjudge", tier: 2, trackOnly: "stocks", title: "Gap Judge", tagline: "Premarket card: gap & go, or fade it?", icon: "sunrise", color: "orange", start: startGapJudge },
  { id: "greekgauntlet", tier: 2, trackOnly: "options", title: "Greek Gauntlet", tagline: "Net the greeks in your head. Green or red?", icon: "sigma", color: "purple", start: startGreekGauntlet },
  { id: "fundingflip", tier: 2, trackOnly: "crypto", title: "Funding Flip", tagline: "Read the positioning. Call the squeeze.", icon: "refresh-ccw", color: "gold", start: startFundingFlip }
];

function arcadeVisibleGames() {
  const track = typeof currentTrackId === "function" ? currentTrackId() : "futures";
  return arcadeGames.filter((game) => !game.trackOnly || game.trackOnly === track);
}

/* ---------- arcade hub ---------- */

function arcadeCardMarkup(game, compact = false) {
  const unlocked = arcadeGameUnlocked(game);
  const data = arcadeData();
  const best = data.best[game.id] || 0;
  const runs = data.runs[game.id] || 0;
  const boost = arcadeBoostedGameId() === game.id;
  const tier = academyTiers[game.tier];
  return `
    <button class="arcade-card ${game.color} ${unlocked ? "" : "locked"} ${compact ? "compact" : ""}" type="button" data-arcade-game="${game.id}">
      ${boost && unlocked ? `<span class="arcade-card-boost">2X XP THIS WEEK</span>` : ""}
      <span class="arcade-card-icon"><i data-lucide="${unlocked ? game.icon : "lock"}"></i></span>
      <span class="arcade-card-body">
        <strong>${arcadeGameMeta(game).title}</strong>
        <small>${unlocked ? arcadeGameMeta(game).tagline : arcadeUnlockHint(game)}</small>
      </span>
      <span class="arcade-card-meta">
        ${unlocked
          ? (runs ? `<b>BEST ${best}</b><i>${runs} runs</i>` : `<b class="new">NEW</b><i>${game.special === "orderflow" ? "Orderflow" : `Tier ${game.tier + 1}`}</i>`)
          : `<b class="locked-tag">LOCKED</b><i>${game.special === "orderflow" ? "Orderflow stage" : tier ? tier.title : ""}</i>`}
      </span>
    </button>
  `;
}

function bindArcadeCards(root) {
  root.querySelectorAll("[data-arcade-game]").forEach((button) => {
    button.addEventListener("click", () => openArcadeGame(button.dataset.arcadeGame));
  });
}

function renderArcade() {
  const root = document.getElementById("arcade-root");
  if (!root) return;
  const data = arcadeData();
  const boostGame = arcadeGames.find((game) => game.id === arcadeBoostedGameId());
  root.innerHTML = `
    <div class="arcade-head">
      <div>
        <p class="arcade-kicker">// THE ARCADE</p>
        <h2>Prove it under pressure.</h2>
        <p class="arcade-sub">One game per Academy tier${typeof currentTrack === "function" ? ` — training on your <b>${currentTrack().label}</b> track` : ""}. Multipliers, streaks, and cash-outs: every mechanic teaches a real trading instinct.</p>
      </div>
      <div class="arcade-head-stats">
        <div><strong>${data.totalXp.toLocaleString()}</strong><span>Arcade XP</span></div>
        <div><strong>${data.runsTotal.toLocaleString()}</strong><span>Runs</span></div>
        <div class="boost"><strong>${boostGame ? arcadeGameMeta(boostGame).title : "—"}</strong><span>2x XP this week · ${arcadeWeeklyResetLabel()}</span></div>
      </div>
    </div>
    ${typeof trackBarMarkup === "function" ? trackBarMarkup() : ""}
    ${sessionBriefMarkup(typeof currentTrackId === "function" ? currentTrackId() : "futures", { compact: true })}
    <div class="arcade-games-grid">
      ${arcadeVisibleGames().map((game) => arcadeCardMarkup(game)).join("")}
    </div>
  `;
  bindArcadeCards(root);
  if (typeof bindTrackControls === "function") bindTrackControls(root);
  if (typeof renderTrainer === "function") renderTrainer();
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- home surfaces ---------- */

function renderHomeArcadeRail() {
  const rail = document.getElementById("home-arcade-rail");
  if (!rail) return;
  rail.innerHTML = `
    <div class="home-block-head">
      <div>
        <p class="arcade-kicker">// THE ARCADE</p>
        <h2>Then put it on the line.</h2>
      </div>
      <button class="arcade-btn ghost nav-tab" data-page-target="arcade" data-view-target="arcade" type="button">All games</button>
    </div>
    <div class="arcade-rail">
      ${arcadeVisibleGames().map((game) => arcadeCardMarkup(game, true)).join("")}
    </div>
  `;
  bindArcadeCards(rail);
  rail.querySelectorAll(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.viewTarget || "arcade"));
  });
  if (window.lucide) window.lucide.createIcons();
  homeMotion();
}

/* ---------- landing motion ---------- */

let homeMotionBound = false;

function homeMotionCheck() {
  document.querySelectorAll(".reveal:not(.in-view), .reveal-stagger:not(.in-view)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    if (rect.top < window.innerHeight * 1.05 && rect.bottom > -40) el.classList.add("in-view");
  });
}

function homeMotion() {
  const singles = [...document.querySelectorAll(".home-block-head, .academy-continue.big, .invite-section, .social-proof-bar, .arcade-head")];
  const staggers = [...document.querySelectorAll(".academy-path, .arcade-rail, .info-grid, .arcade-games-grid")];
  singles.forEach((el) => el.classList.add("reveal"));
  staggers.forEach((el) => el.classList.add("reveal-stagger"));
  if (!homeMotionBound) {
    homeMotionBound = true;
    ["scroll", "resize"].forEach((evt) => window.addEventListener(evt, homeMotionCheck, { passive: true, capture: true }));
    setInterval(homeMotionCheck, 900);
  }
  requestAnimationFrame(homeMotionCheck);
}

function heroCountUp() {
  document.querySelectorAll(".hero-performance strong").forEach((el) => {
    const target = parseInt(el.textContent, 10);
    if (!isFinite(target) || target <= 0 || el.dataset.counted) return;
    el.dataset.counted = "1";
    let value = 0;
    const tick = () => {
      value += Math.max(1, Math.ceil(target / 26));
      if (value >= target) {
        el.textContent = String(target);
      } else {
        el.textContent = String(value);
        requestAnimationFrame(tick);
      }
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  });
}

/* ---------- init ---------- */

(() => {
  renderHomeArcadeRail();
  if (typeof renderHomeAcademyPath === "function") renderHomeAcademyPath();
  if (state.currentView === "arcade") renderArcade();
  homeMotion();
  heroCountUp();
})();
