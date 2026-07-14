/* ReplayEdge Elite Command Center — overrides the legacy renderEliteDashboard.
   The private desk Elite traders open before anything else: live watchlist,
   discipline scoring, a daily game plan, and a weekly performance report —
   all computed from the user's real activity. */

const eliteState = { timer: null, quotes: {}, loading: false };

/* ---------- data: watchlist ---------- */

function eliteWatchlist() {
  const p = progress();
  if (!Array.isArray(p.eliteWatchlist) || !p.eliteWatchlist.length) {
    const seed = [p.dashboard?.symbol, "ES=F", "BTC-USD", "EURUSD=X"].filter(Boolean);
    p.eliteWatchlist = [...new Set(seed)].slice(0, 5);
    saveProgress();
  }
  return p.eliteWatchlist;
}

function eliteWatchAdd(raw) {
  const clean = String(raw || "").trim().toUpperCase();
  if (!clean || !/^[A-Z0-9.^=-]{1,15}$/.test(clean)) {
    showToast("That doesn't look like a valid symbol.", "warning");
    return;
  }
  const list = eliteWatchlist();
  if (list.includes(clean)) return;
  if (list.length >= 5) {
    showToast("Watchlist is full — remove one first (5 max).", "info");
    return;
  }
  list.push(clean);
  saveProgress();
  eliteRefreshQuotes(true);
}

function eliteWatchRemove(symbol) {
  const p = progress();
  p.eliteWatchlist = eliteWatchlist().filter((item) => item !== symbol);
  delete eliteState.quotes[symbol];
  saveProgress();
  renderEliteDashboard();
}

async function eliteFetchQuote(symbol) {
  try {
    const response = await fetch(`/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=1d&interval=15m`);
    const json = await response.json();
    if (!json.ok || !json.bars?.length) throw new Error(json.error || "no data");
    const bars = json.bars.filter((bar) => bar.c > 0);
    const last = json.meta?.last || bars[bars.length - 1]?.c;
    const base = json.meta?.prevClose || bars[0]?.c;
    return {
      symbol, last,
      change: base > 0 && last > 0 ? ((last - base) / base) * 100 : null,
      closes: bars.map((bar) => bar.c).slice(-40),
      source: json.source, error: null
    };
  } catch (error) {
    return { symbol, last: null, change: null, closes: [], error: error.message };
  }
}

async function eliteRefreshQuotes(rerender = false) {
  if (eliteState.loading) return;
  eliteState.loading = true;
  const results = await Promise.all(eliteWatchlist().map((symbol) => eliteFetchQuote(symbol)));
  results.forEach((quote) => { eliteState.quotes[quote.symbol] = quote; });
  eliteState.loading = false;
  eliteCheckAlerts();
  if (rerender || state.currentView === "elite") renderEliteWatchRows();
}

/* ---------- price alerts (Elite) ---------- */

function eliteAlerts() {
  const p = progress();
  if (!Array.isArray(p.priceAlerts)) p.priceAlerts = [];
  return p.priceAlerts;
}

function eliteCheckAlerts() {
  if (typeof hasAccess === "function" && !hasAccess("priceAlerts")) return;
  const alerts = eliteAlerts();
  if (!alerts.length) return;
  const fired = [];
  alerts.forEach((alert) => {
    const quote = eliteState.quotes[alert.symbol];
    if (!quote || !quote.last) return;
    if ((alert.dir === "above" && quote.last >= alert.price) || (alert.dir === "below" && quote.last <= alert.price)) fired.push(alert);
  });
  if (!fired.length) return;
  const p = progress();
  p.priceAlerts = alerts.filter((alert) => !fired.includes(alert));
  saveProgress();
  fired.forEach((alert) => {
    const display = typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(alert.symbol) : alert.symbol;
    const message = `🔔 ${display} crossed ${alert.dir} ${alert.price}`;
    showToast(message, "success");
    if (typeof arcadeSound === "function") arcadeSound("cashout");
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification("ReplayEdge price alert", { body: message }); } catch { /* ignore */ }
    }
  });
  if (state.currentView === "elite") renderEliteDashboard();
}

function eliteAlertAdd(symbol, dir, price) {
  if (!symbol || !Number.isFinite(price) || price <= 0) { showToast("Pick a symbol and a valid price.", "info"); return; }
  const alerts = eliteAlerts();
  if (alerts.length >= 10) { showToast("Alert list is full (10). Remove one first.", "warning"); return; }
  alerts.push({ id: `al_${Date.now()}`, symbol, dir, price });
  saveProgress();
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  renderEliteDashboard();
  showToast(`Alert set — ${dir} ${price} on ${typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(symbol) : symbol}.`, "success");
}

function eliteEnsureTimer() {
  if (eliteState.timer) return;
  eliteState.timer = setInterval(() => {
    if (typeof state !== "undefined" && state.currentView !== "elite") {
      clearInterval(eliteState.timer);
      eliteState.timer = null;
      return;
    }
    eliteRefreshQuotes();
  }, 60000);
}

/* ---------- data: performance & discipline ---------- */

function eliteHistory() {
  return Array.isArray(arcadeData().history) ? arcadeData().history : [];
}

function eliteXpByDay(days = 7, offsetDays = 0) {
  const p = progress();
  const buckets = new Array(days).fill(0);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const end = now.getTime() + 86400000 - offsetDays * 86400000;
  const start = end - days * 86400000;
  eliteHistory().forEach((run) => {
    if (run.ts >= start && run.ts < end) buckets[Math.floor((run.ts - start) / 86400000)] += Math.max(0, run.xp);
  });
  Object.values(p.academy?.lessons || {}).forEach((lesson) => {
    if (lesson.passedAt >= start && lesson.passedAt < end) {
      buckets[Math.floor((lesson.passedAt - start) / 86400000)] += lesson.xpEarned || 0;
    }
  });
  return buckets;
}

function eliteDiscipline() {
  const p = progress();
  const weekAgo = Date.now() - 7 * 86400000;
  const telemetry = (Array.isArray(p.telemetry) ? p.telemetry : []).filter((entry) => entry.ts >= weekAgo);
  const runs = eliteHistory().filter((run) => run.ts >= weekAgo).length;
  const counts = {};
  telemetry.forEach((entry) => { counts[entry.type] = (counts[entry.type] || 0) + 1; });
  const leaks = telemetry.length;
  if (runs < 5) return { score: null, grade: "—", counts, runs, note: `Calibrating — ${runs}/5 runs this week. Play to get scored.` };
  let score = 92 - Math.min(50, Math.round((leaks / Math.max(1, runs)) * 55));
  score += Math.min(6, Math.floor((p.streak || 0) / 7));
  score = Math.max(20, Math.min(99, score));
  const grade = score >= 90 ? "A+" : score >= 82 ? "A" : score >= 72 ? "B" : score >= 58 ? "C" : "D";
  const note = leaks === 0
    ? "Zero behavioral leaks logged this week. This is what professional looks like."
    : `${leaks} leak${leaks === 1 ? "" : "s"} across ${runs} runs — every one is a repriced mistake you didn't pay real money for.`;
  return { score, grade, counts, runs, note };
}

function eliteWinTrend() {
  const history = eliteHistory();
  const rate = (slice) => slice.length ? Math.round((slice.filter((run) => run.xp > 0).length / slice.length) * 100) : null;
  const current = rate(history.slice(-20));
  const previous = rate(history.slice(-40, -20));
  return { current, previous, delta: current !== null && previous !== null ? current - previous : null, sampled: Math.min(20, history.length) };
}

/* ---------- ELITE LAB: risk lab pro ---------- */

function eliteWinRateOverall() {
  const history = eliteHistory();
  if (history.length < 8) return null;
  return (history.filter((run) => run.xp > 0).length / history.length) * 100;
}

function eliteMcScenario(wr, rr, riskPct, trades = 100, sims = 300) {
  const finals = [], dds = [];
  let ruined = 0;
  for (let s = 0; s < sims; s += 1) {
    let bal = 100, peak = 100, dd = 0;
    for (let t = 0; t < trades; t += 1) {
      bal *= Math.random() < wr ? (1 + riskPct * rr) : (1 - riskPct);
      peak = Math.max(peak, bal);
      dd = Math.max(dd, (peak - bal) / peak);
    }
    if (bal <= 50) ruined += 1;
    finals.push(bal); dds.push(dd);
  }
  finals.sort((a, b) => a - b); dds.sort((a, b) => a - b);
  return {
    median: finals[Math.floor(sims / 2)] - 100,
    dd: dds[Math.floor(sims / 2)] * 100,
    ruin: (ruined / sims) * 100
  };
}

function eliteRiskLabRows() {
  const wrPct = eliteWinRateOverall();
  const wr = (wrPct === null ? 52 : Math.max(25, Math.min(85, wrPct))) / 100;
  const rr = 1.5;
  const rows = [0.005, 0.01, 0.02, 0.03].map((risk) => ({ risk, ...eliteMcScenario(wr, rr, risk) }));
  // recommended: best median growth among scenarios with ruin < 5%
  const safe = rows.filter((row) => row.ruin < 5);
  const pick = (safe.length ? safe : rows).reduce((best, row) => (row.median > best.median ? row : best));
  // Kelly fraction for reference: f = wr - (1-wr)/rr
  const kelly = Math.max(0, wr - (1 - wr) / rr) * 100;
  return { rows, pick, wrUsed: Math.round(wr * 100), sampled: wrPct !== null, kelly };
}

/* ---------- ELITE LAB: tilt guard ---------- */

function eliteTiltGuard() {
  const history = [...eliteHistory()].sort((a, b) => a.ts - b.ts);
  const dayAgo = Date.now() - 86400000;
  const weekAgo = Date.now() - 7 * 86400000;
  const week = history.filter((run) => run.ts >= weekAgo);
  const signals = [];
  let score = 0;

  // loss clusters: 3+ consecutive busts in the last 7d
  let cluster = 0, maxCluster = 0;
  week.forEach((run) => {
    cluster = run.xp === 0 ? cluster + 1 : 0;
    maxCluster = Math.max(maxCluster, cluster);
  });
  if (maxCluster >= 3) { score += 30; signals.push(`A ${maxCluster}-loss streak without a break — the classic revenge-trading launchpad.`); }

  // instant re-entry after a bust (<2 min) in the last 24h
  const day = history.filter((run) => run.ts >= dayAgo);
  let rapidAfterLoss = 0;
  for (let i = 1; i < day.length; i += 1) {
    if (day[i - 1].xp === 0 && day[i].ts - day[i - 1].ts < 2 * 60000) rapidAfterLoss += 1;
  }
  if (rapidAfterLoss >= 2) { score += 30; signals.push(`${rapidAfterLoss} instant re-entries within 2 minutes of a bust today — that's emotion clicking, not analysis.`); }

  // late-night grinding (midnight–5am) this week
  const nightRuns = week.filter((run) => { const h = new Date(run.ts).getHours(); return h >= 0 && h < 5; }).length;
  if (nightRuns >= 4) { score += 20; signals.push(`${nightRuns} runs between midnight and 5am this week — fatigue is a position-size multiplier for mistakes.`); }

  // tilt telemetry from the games themselves
  const p = progress();
  const tiltEvents = (Array.isArray(p.telemetry) ? p.telemetry : []).filter((entry) => entry.type === "tilt" && entry.ts >= weekAgo).length;
  if (tiltEvents >= 2) { score += 20; signals.push(`The games flagged ${tiltEvents} tilt patterns this week (revenge flips after losses).`); }

  score = Math.min(100, score);
  const status = score >= 60 ? "TILTED" : score >= 30 ? "WARM" : "COOL";
  return { score, status, signals, sampled: week.length };
}

/* ---------- ELITE LAB: session DNA ---------- */

function eliteSessionDna() {
  const history = eliteHistory();
  const windows = [
    { key: "morning", label: "Morning", range: "5a–11a", test: (h) => h >= 5 && h < 11 },
    { key: "midday", label: "Midday", range: "11a–4p", test: (h) => h >= 11 && h < 16 },
    { key: "evening", label: "Evening", range: "4p–10p", test: (h) => h >= 16 && h < 22 },
    { key: "night", label: "Late night", range: "10p–5a", test: (h) => h >= 22 || h < 5 }
  ].map((win) => {
    const runs = history.filter((run) => win.test(new Date(run.ts).getHours()));
    const wins = runs.filter((run) => run.xp > 0).length;
    return { ...win, runs: runs.length, winRate: runs.length >= 4 ? Math.round((wins / runs.length) * 100) : null };
  });
  const rated = windows.filter((win) => win.winRate !== null);
  const best = rated.length ? rated.reduce((a, b) => (b.winRate > a.winRate ? b : a)) : null;
  const worst = rated.length > 1 ? rated.reduce((a, b) => (b.winRate < a.winRate ? b : a)) : null;
  return { windows, best, worst, sampled: history.length };
}

/* ---------- ELITE LAB: monthly report card ---------- */

function eliteMonthStats(offsetMonths = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offsetMonths, 1).getTime();
  const end = new Date(now.getFullYear(), now.getMonth() - offsetMonths + 1, 1).getTime();
  const p = progress();
  const runs = eliteHistory().filter((run) => run.ts >= start && run.ts < end);
  const lessons = Object.values(p.academy?.lessons || {}).filter((lesson) => lesson.passedAt >= start && lesson.passedAt < end);
  const activeDays = new Set([...runs.map((r) => new Date(r.ts).getDate()), ...lessons.map((l) => new Date(l.passedAt).getDate())]).size;
  const xp = runs.reduce((sum, run) => sum + Math.max(0, run.xp), 0) + lessons.reduce((sum, lesson) => sum + (lesson.xpEarned || 0), 0);
  const wins = runs.filter((run) => run.xp > 0).length;
  const leaks = (Array.isArray(p.telemetry) ? p.telemetry : []).filter((entry) => entry.ts >= start && entry.ts < end).length;
  return { runs: runs.length, lessons: lessons.length, activeDays, xp, winRate: runs.length >= 6 ? (wins / runs.length) * 100 : null, leaks };
}

function eliteGradeLetter(pct) {
  return pct >= 90 ? "A" : pct >= 75 ? "B" : pct >= 55 ? "C" : pct >= 35 ? "D" : "F";
}

function eliteReportCard() {
  const now = new Date();
  const daysElapsed = Math.max(1, now.getDate());
  const month = eliteMonthStats(0);
  const prior = eliteMonthStats(1);
  const rows = [
    { label: "Consistency", detail: `${month.activeDays}/${daysElapsed} days active`, pct: Math.min(100, (month.activeDays / daysElapsed) * 118) },
    { label: "Volume", detail: `${month.runs} runs · ${month.lessons} lessons`, pct: Math.min(100, ((month.runs + month.lessons * 2) / (daysElapsed * 2.4)) * 100) },
    { label: "Accuracy", detail: month.winRate === null ? "needs 6+ runs" : `${Math.round(month.winRate)}% win rate`, pct: month.winRate === null ? null : Math.min(100, month.winRate * 1.45) },
    { label: "Discipline", detail: `${month.leaks} leak${month.leaks === 1 ? "" : "s"} logged`, pct: month.runs < 4 ? null : Math.max(0, 100 - (month.leaks / Math.max(1, month.runs)) * 130) },
    { label: "Growth", detail: prior.xp > 0 ? `${month.xp.toLocaleString()} vs ${prior.xp.toLocaleString()} XP` : `${month.xp.toLocaleString()} XP this month`, pct: prior.xp > 0 ? Math.min(100, (month.xp / prior.xp) * 68) : (month.xp > 0 ? 70 : null) }
  ].map((row) => ({ ...row, grade: row.pct === null ? "—" : eliteGradeLetter(row.pct) }));
  const graded = rows.filter((row) => row.pct !== null);
  const gpa = graded.length ? graded.reduce((sum, row) => sum + row.pct, 0) / graded.length : null;
  return { rows, gpa, overall: gpa === null ? "—" : eliteGradeLetter(gpa), monthLabel: now.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
}

/* ---------- ELITE LAB: goal engine ---------- */

function eliteGoalWeekKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return start.toDateString();
}

function eliteGoals() {
  const p = progress();
  if (!p.eliteGoals || p.eliteGoals.weekOf !== eliteGoalWeekKey()) {
    const lastWeekXp = eliteXpByDay(7, 7).reduce((sum, value) => sum + value, 0);
    p.eliteGoals = {
      weekOf: eliteGoalWeekKey(),
      xp: Math.max(500, Math.round((lastWeekXp * 1.1) / 50) * 50),
      lessons: 5,
      runs: 15
    };
    saveProgress();
  }
  return p.eliteGoals;
}

function eliteGoalProgress() {
  const goals = eliteGoals();
  const weekAgo = Date.now() - 7 * 86400000;
  const p = progress();
  const xp = eliteXpByDay(7).reduce((sum, value) => sum + value, 0);
  const lessons = Object.values(p.academy?.lessons || {}).filter((lesson) => lesson.passedAt >= weekAgo).length;
  const runs = eliteHistory().filter((run) => run.ts >= weekAgo).length;
  return [
    { key: "xp", label: "XP banked", value: xp, target: goals.xp },
    { key: "lessons", label: "Lessons passed", value: lessons, target: goals.lessons },
    { key: "runs", label: "Arcade runs", value: runs, target: goals.runs }
  ];
}

/* ---------- ELITE LAB: AI desk debrief ---------- */

function eliteDebrief() {
  const discipline = eliteDiscipline();
  const tilt = eliteTiltGuard();
  const dna = eliteSessionDna();
  const report = eliteReportCard();
  const trend = eliteWinTrend();
  const goals = eliteGoalProgress();
  const journal = typeof tradeLogStats === "function" ? tradeLogStats() : null;
  const week = eliteXpByDay(7).reduce((sum, value) => sum + value, 0);
  const goalsHit = goals.filter((goal) => goal.value >= goal.target).length;

  const lines = [];
  lines.push(`You banked <b>${week.toLocaleString()} XP</b> this week with a discipline grade of <b>${discipline.grade}</b>${trend.current !== null ? ` and a ${trend.current}% win rate over your last ${trend.sampled} runs${trend.delta !== null ? ` (${trend.delta >= 0 ? "up" : "down"} ${Math.abs(trend.delta)} pts)` : ""}` : ""}.`);
  if (tilt.status === "TILTED") lines.push(`<b class="down">Priority one: your tilt score is ${tilt.score}.</b> ${tilt.signals[0] || ""} Nothing else on this desk matters until that's under control.`);
  else if (tilt.status === "WARM") lines.push(`Tilt Guard reads <b>WARM (${tilt.score})</b> — ${tilt.signals[0] || "watch your re-entries after losses"}. Catch it now, before it prices itself in.`);
  else lines.push(`Tilt Guard reads <b class="up">COOL</b> — your emotional control is an edge this week. Protect it.`);
  if (dna.best) lines.push(`Your Session DNA says you're sharpest in the <b>${dna.best.label.toLowerCase()}</b> (${dna.best.winRate}% WR)${dna.worst && dna.worst.key !== dna.best.key ? ` and weakest ${dna.worst.label.toLowerCase()} (${dna.worst.winRate}%)` : ""} — schedule accordingly.`);
  if (journal?.worstEmotion) lines.push(`The journal found your most expensive emotion: trades tagged <b>${journal.worstEmotion.name}</b> average <b class="down">${journal.worstEmotion.avg.toFixed(2)}R</b>. That's a named, fixable leak.`);
  else if (journal?.best) lines.push(`Journal says your money-maker is <b>${journal.best.name}</b> at <b class="up">+${journal.best.avg.toFixed(2)}R</b> average — size it with confidence, skip the rest.`);
  lines.push(`Month-to-date report card: <b>${report.overall}</b> overall. Goals: <b>${goalsHit}/${goals.length}</b> hit so far this week.`);

  const actions = [];
  if (tilt.status !== "COOL") actions.push("After any 2 losses in a row: 15-minute hard stop before the next click.");
  const weakRow = report.rows.filter((row) => row.pct !== null).sort((a, b) => a.pct - b.pct)[0];
  if (weakRow) actions.push(`Lowest report-card line is ${weakRow.label.toLowerCase()} (${weakRow.grade}) — make it this week's single focus.`);
  if (dna.best) actions.push(`Book your practice inside your ${dna.best.label.toLowerCase()} window — it's statistically your best brain.`);
  if (!actions.length) actions.push("Nothing is on fire. Raise your weekly goals 10% and keep compounding.");
  return { lines, actions: actions.slice(0, 3) };
}

/* ---------- render ---------- */

function eliteXpChip(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

function renderEliteDashboard() {
  const root = document.getElementById("elite");
  if (!root) return;

  if (!hasElitePlan()) {
    root.innerHTML = `
      <div class="elite-locked">
        <p class="arcade-kicker gold-kicker">// ELITE COMMAND CENTER</p>
        <h2>The desk the top 1% open first.</h2>
        <p class="elite-locked-sub">One screen with everything an Elite trader runs their day from:</p>
        <div class="elite-locked-grid">
          <div>🧪 <b>Risk Lab Pro</b><span>Monte Carlo optimizer that finds YOUR ideal risk % from your real win rate</span></div>
          <div>🧯 <b>Tilt Guard</b><span>Detects revenge trading, loss chains, and fatigue grinding before they cost you</span></div>
          <div>🧬 <b>Session DNA</b><span>The hours your brain actually wins — scheduled from your data</span></div>
          <div>📋 <b>Monthly Report Card</b><span>A–F grades on consistency, accuracy, discipline, and growth</span></div>
          <div>🎯 <b>Goal Engine</b><span>Weekly targets that auto-set from your performance +10%</span></div>
          <div>📡 <b>Live Watchlist</b><span>Up to 5 real instruments with live quotes & sparklines</span></div>
          <div>🛡 <b>Discipline Score</b><span>A weekly A–F grade computed from your actual behavior</span></div>
          <div>📈 <b>Weekly Report</b><span>XP by day, win-rate trend, and your weakest game called out</span></div>
          <div>🧠 <b>AI Trade Review</b><span>Grade real trade ideas before you ever risk a dollar</span></div>
          <div>📚 <b>Study Plan</b><span>A fresh weekly curriculum aimed at your weakest tiers</span></div>
        </div>
        <button class="primary-button" type="button" id="elite-unlock-cta">Unlock Elite — $11.99/mo</button>
        <small>Also includes +50% XP on every run, streak freeze bank, and gold leaderboard identity.</small>
      </div>
    `;
    root.querySelector("#elite-unlock-cta")?.addEventListener("click", () => openUpgradeModal("eliteDashboard"));
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const p = progress();
  const discipline = eliteDiscipline();
  const trend = eliteWinTrend();
  const thisWeek = eliteXpByDay(7).reduce((sum, value) => sum + value, 0);
  const lastWeek = eliteXpByDay(7, 7).reduce((sum, value) => sum + value, 0);
  const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;
  const streakMult = typeof streakXpMultiplier === "function" ? streakXpMultiplier() : 1;

  root.innerHTML = `
    <div class="elite-desk">
      <header class="elite-head">
        <div>
          <p class="arcade-kicker gold-kicker">// ELITE COMMAND CENTER</p>
          <h2>The Desk.</h2>
          <p class="arcade-sub">${new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · everything below is computed from <b>your</b> play.</p>
        </div>
        <span class="elite-member-chip">★ ELITE</span>
      </header>

      <div class="elite-kpis">
        <div class="elite-kpi ${discipline.score === null ? "muted" : discipline.score >= 72 ? "good" : "warn"}">
          <small>DISCIPLINE</small>
          <b>${discipline.score === null ? "—" : discipline.grade}</b>
          <span>${discipline.score === null ? "calibrating" : `${discipline.score}/100 this week`}</span>
        </div>
        <div class="elite-kpi ${weekDelta === null ? "" : weekDelta >= 0 ? "good" : "warn"}">
          <small>XP THIS WEEK</small>
          <b>${eliteXpChip(thisWeek)}</b>
          <span>${weekDelta === null ? "first tracked week" : `${weekDelta >= 0 ? "▲" : "▼"} ${Math.abs(weekDelta)}% vs last week`}</span>
        </div>
        <div class="elite-kpi ${trend.delta === null ? "" : trend.delta >= 0 ? "good" : "warn"}">
          <small>WIN RATE</small>
          <b>${trend.current === null ? "—" : `${trend.current}%`}</b>
          <span>${trend.delta === null ? `last ${trend.sampled} runs` : `${trend.delta >= 0 ? "▲" : "▼"} ${Math.abs(trend.delta)} pts vs prior 20`}</span>
        </div>
        <div class="elite-kpi ${streakMult > 1 ? "good" : ""}">
          <small>STREAK</small>
          <b>🔥 ${p.streak || 0}</b>
          <span>${streakMult > 1 ? `+${Math.round((streakMult - 1) * 100)}% XP on everything` : "build 3 days for an XP bonus"}</span>
        </div>
      </div>

      <div class="elite-grid">
        <div class="elite-col-main">
          <section class="elite-card">
            <div class="elite-card-head">
              <p class="tdash-card-kicker gold">📡 LIVE WATCHLIST</p>
              <div class="elite-watch-add">
                <input id="elite-watch-input" type="text" placeholder="Add symbol (ES=F, BTC-USD…)" spellcheck="false" autocomplete="off" />
                <button class="arcade-btn ghost cp-mini" type="button" id="elite-watch-add">+ Add</button>
              </div>
            </div>
            <div id="elite-watch-rows" class="elite-watch-rows"></div>
            <div class="elite-alerts">
              <div class="elite-alerts-head"><b>🔔 Price alerts</b><small>${eliteAlerts().length}/10 · fires here + browser notification</small></div>
              ${eliteAlerts().map((alert) => `
                <div class="elite-alert-row">
                  <b>${typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(alert.symbol) : alert.symbol}</b>
                  <span>${alert.dir === "above" ? "≥" : "≤"} ${alert.price}</span>
                  <button class="tk-resolve" type="button" data-alert-x="${alert.id}" title="Remove">✕</button>
                </div>`).join("")}
              <div class="elite-alert-form">
                <select id="elite-alert-sym">${eliteWatchlist().map((symbol) => `<option value="${symbol}">${typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(symbol) : symbol}</option>`).join("")}</select>
                <select id="elite-alert-dir"><option value="above">crosses above</option><option value="below">crosses below</option></select>
                <input id="elite-alert-price" type="number" step="any" placeholder="Price" />
                <button class="arcade-btn ghost cp-mini" type="button" id="elite-alert-add">Set</button>
              </div>
            </div>
            <small class="elite-foot-note">Delayed public feeds · educational context, not advice. Full analysis lives in the <button class="elite-inline-link" type="button" data-elite-nav="dashboard">Traders Dashboard →</button></small>
          </section>

          <section class="elite-card">
            <p class="tdash-card-kicker gold">📈 WEEKLY PERFORMANCE REPORT</p>
            <div class="elite-week-bars">
              ${(() => {
                const buckets = eliteXpByDay(7);
                const max = Math.max(...buckets, 1);
                const labels = [...Array(7)].map((_, index) => new Date(Date.now() - (6 - index) * 86400000).toLocaleDateString(undefined, { weekday: "narrow" }));
                return buckets.map((value, index) => `
                  <div class="elite-week-bar">
                    <i style="height:${Math.max(4, Math.round((value / max) * 74))}px" class="${value > 0 ? "on" : ""}"></i>
                    <small>${labels[index]}</small>
                    <span>${value > 0 ? eliteXpChip(value) : ""}</span>
                  </div>
                `).join("");
              })()}
            </div>
            <p class="elite-report-verdict">${(() => {
              const stats = typeof trainerGameStats === "function" ? trainerGameStats() : {};
              const played = Object.entries(stats).filter(([, stat]) => stat.plays >= 3);
              const weakest = [...played].sort((a, b) => a[1].winRate - b[1].winRate)[0];
              const strongest = [...played].sort((a, b) => b[1].winRate - a[1].winRate)[0];
              const bits = [];
              bits.push(`You banked <b>${thisWeek.toLocaleString()} XP</b> this week${weekDelta !== null ? ` (${weekDelta >= 0 ? "+" : ""}${weekDelta}% vs last)` : ""}.`);
              if (strongest) bits.push(`Sharpest read: <b>${arcadeGames.some((g) => g.id === strongest[0]) ? arcadeGameMeta(arcadeGames.find((g) => g.id === strongest[0])).title : strongest[0]}</b> at ${strongest[1].winRate}%.`);
              if (weakest && weakest !== strongest) bits.push(`Biggest leak: <b>${arcadeGames.some((g) => g.id === weakest[0]) ? arcadeGameMeta(arcadeGames.find((g) => g.id === weakest[0])).title : weakest[0]}</b> at ${weakest[1].winRate}% — that's this week's money printer if you fix it.`);
              if (!played.length) bits.push("Play a few more runs and this report starts naming names.");
              return bits.join(" ");
            })()}</p>
          </section>

          <section class="elite-card">
            <p class="tdash-card-kicker gold">🛡 DISCIPLINE BREAKDOWN</p>
            <p class="elite-discipline-note">${discipline.note}</p>
            <div class="elite-leak-bars">
              ${["hesitation", "chase", "greed", "tilt", "oversize"].map((type) => {
                const count = discipline.counts[type] || 0;
                const label = { hesitation: "Late entries", chase: "Chasing", greed: "Greed holds", tilt: "Tilt", oversize: "Oversizing" }[type];
                return `
                  <div class="elite-leak">
                    <span>${label}</span>
                    <div class="elite-leak-track"><i class="${count === 0 ? "clean" : count >= 3 ? "bad" : "warn"}" style="width:${Math.min(100, count * 25)}%"></i></div>
                    <b>${count}</b>
                  </div>
                `;
              }).join("")}
            </div>
            <button class="arcade-btn ghost" type="button" data-elite-nav="arcade">Open the Trainer →</button>
          </section>
        </div>

        <div class="elite-col-side">
          <section class="elite-card">
            <p class="tdash-card-kicker gold">🗺 TODAY'S GAME PLAN</p>
            <div class="elite-plan">
              ${(() => {
                const items = [];
                const daily = typeof dailyData === "function" ? dailyData() : { claimed: [] };
                const next = typeof academyNextLesson === "function" ? academyNextLesson() : null;
                const recs = typeof trainerRecommendations === "function" ? trainerRecommendations() : [];
                const secured = typeof streakSecuredToday === "function" && streakSecuredToday();
                items.push({ done: daily.lessons > 0, label: next ? `Pass a lesson — next up: ${next.lesson.title}` : "Curriculum complete — review any tier", nav: "academy" });
                const trainerDone = (progress().trainer?.day === new Date().toDateString()) && (progress().trainer?.completed || []).length > 0;
                items.push({ done: trainerDone, label: recs[0] ? `Trainer drill: ${recs[0].title}` : "Run your prescribed drill", nav: "arcade" });
                items.push({ done: daily.claimed.length >= 3, label: `Daily challenges — ${daily.claimed.length}/3 cleared${daily.claimed.length >= 3 ? " · SWEPT" : ""}`, nav: "achievements" });
                items.push({ done: secured, label: secured ? "Streak secured — see you tomorrow" : "Secure today's streak (1 lesson or run)", nav: "academy" });
                return items.map((item) => `
                  <button class="elite-plan-item ${item.done ? "done" : ""}" type="button" data-elite-nav="${item.nav}">
                    <span class="elite-plan-check">${item.done ? "✓" : ""}</span>
                    <span>${item.label}</span>
                  </button>
                `).join("");
              })()}
            </div>
          </section>

          <section class="elite-card">
            <p class="tdash-card-kicker gold">🧠 AI DESK TOOLS</p>
            ${(() => {
              const reviews = Array.isArray(p.aiReviews) ? p.aiReviews : [];
              const plan = typeof studyPlan === "function" ? studyPlan() : null;
              return `
                <div class="elite-tool-row">
                  <div><b>AI Trade Review</b><small>${reviews.length ? `Last grade: <b class="elite-grade">${reviews[0].grade}</b> · ${new Date(reviews[0].ts).toLocaleDateString()}` : "No trades reviewed yet — grade your next idea before you take it."}</small></div>
                  <button class="arcade-btn primary cp-mini" type="button" data-elite-nav="toolkit">Review</button>
                </div>
                <div class="elite-tool-row">
                  <div><b>Study Plan</b><small>${plan?.items?.length ? `${plan.items.length} focus blocks generated for this week.` : "Generates weekly from your weakest tiers."}</small></div>
                  <button class="arcade-btn ghost cp-mini" type="button" data-elite-nav="toolkit">Open</button>
                </div>
              `;
            })()}
          </section>

          <section class="elite-card">
            <p class="tdash-card-kicker gold">🏆 PERSONAL RECORDS</p>
            <div class="elite-records">
              <div><small>TOP STREAK</small><b>${Math.max(p.topStreak || 0, p.streak || 0)}d</b></div>
              <div><small>BEST RUN</small><b>${Math.max(0, ...eliteHistory().map((run) => run.xp))} XP</b></div>
              <div><small>LEVEL</small><b>${levelFromXp(p.xp || 0)}</b></div>
              <div><small>MASTERY</small><b>${typeof masteryRankIndex === "function" && masteryRankIndex() > 0 ? MASTERY_RANKS[masteryRankIndex() - 1].numeral : "—"}</b></div>
              <div><small>RUNS</small><b>${(arcadeData().runsTotal || 0).toLocaleString()}</b></div>
              <div><small>TROPHIES</small><b>${Object.keys(p.achievements || {}).length}/${typeof ACHIEVEMENTS !== "undefined" ? ACHIEVEMENTS.length : 28}</b></div>
            </div>
          </section>
        </div>
      </div>

      <header class="elite-lab-head">
        <div>
          <p class="arcade-kicker gold-kicker">// THE ELITE LAB</p>
          <h2>Analysis nobody else gets.</h2>
          <p class="arcade-sub">Five systems that study <b>you</b> — your risk, your psychology, your hours, your month.</p>
        </div>
        <span class="elite-member-chip">⚡ LAB</span>
      </header>

      <div class="elite-lab-grid">
        ${(() => {
          const lab = eliteRiskLabRows();
          return `
          <section class="elite-card elab-wide">
            <p class="tdash-card-kicker gold">🧪 RISK LAB PRO</p>
            <p class="elite-discipline-note">${lab.sampled
              ? `Simulated with <b>your real ${lab.wrUsed}% win rate</b> at 1:1.5 over 100 trades × 300 futures per risk size.`
              : `Calibrating on a 52% baseline until you've logged 8+ runs — then it uses <b>your</b> real win rate.`}</p>
            <div class="elab-risk-table">
              <div class="elab-risk-row head"><span>Risk / trade</span><span>Median</span><span>Max DD</span><span>Ruin</span></div>
              ${lab.rows.map((row) => `
                <div class="elab-risk-row ${row === lab.pick ? "pick" : ""} ${row.ruin >= 5 ? "danger" : ""}">
                  <span>${(row.risk * 100).toFixed(1)}%${row === lab.pick ? " ★" : ""}</span>
                  <span class="${row.median >= 0 ? "up" : "down"}">${row.median >= 0 ? "+" : ""}${row.median.toFixed(0)}%</span>
                  <span>${row.dd.toFixed(0)}%</span>
                  <span class="${row.ruin >= 5 ? "down" : ""}">${row.ruin.toFixed(1)}%</span>
                </div>
              `).join("")}
            </div>
            <p class="elab-verdict">★ Optimal for your edge: <b>${(lab.pick.risk * 100).toFixed(1)}% risk per trade</b> — best growth with ruin under control. Theoretical Kelly is ${lab.kelly.toFixed(1)}%, but pros trade a fraction of Kelly for exactly the drawdowns you see above.</p>
          </section>`;
        })()}

        ${(() => {
          const tilt = eliteTiltGuard();
          return `
          <section class="elite-card">
            <p class="tdash-card-kicker gold">🧯 TILT GUARD</p>
            <div class="elab-tilt">
              <div class="elab-tilt-dial ${tilt.status.toLowerCase()}">
                <b>${tilt.score}</b>
                <span>${tilt.status}</span>
              </div>
              <div class="elab-tilt-body">
                ${tilt.signals.length
                  ? tilt.signals.map((signal) => `<p>⚠ ${signal}</p>`).join("")
                  : `<p>${tilt.sampled < 5 ? "Watching your sessions for revenge patterns, loss chains, and fatigue grinding." : "No tilt signals this week. Calm is a trading edge — protect it."}</p>`}
                ${tilt.status === "TILTED" ? `<p class="elab-tilt-order"><b>Desk order:</b> step away for 15 minutes. The market will still be there — your edge won't be if you keep clicking.</p>` : ""}
              </div>
            </div>
          </section>`;
        })()}

        ${(() => {
          const dna = eliteSessionDna();
          const maxRuns = Math.max(1, ...dna.windows.map((win) => win.runs));
          return `
          <section class="elite-card">
            <p class="tdash-card-kicker gold">🧬 SESSION DNA</p>
            <div class="elab-dna">
              ${dna.windows.map((win) => `
                <div class="elab-dna-row">
                  <span class="elab-dna-label">${win.label}<small>${win.range}</small></span>
                  <div class="elab-dna-track"><i style="width:${Math.round((win.runs / maxRuns) * 100)}%" class="${dna.best && win.key === dna.best.key ? "best" : ""}"></i></div>
                  <b>${win.winRate === null ? `${win.runs} runs` : `${win.winRate}%`}</b>
                </div>
              `).join("")}
            </div>
            <p class="elab-verdict">${dna.best
              ? `You're sharpest in the <b>${dna.best.label.toLowerCase()}</b> (${dna.best.winRate}% WR)${dna.worst && dna.worst.key !== dna.best.key ? ` and weakest ${dna.worst.label.toLowerCase()} (${dna.worst.winRate}%) — schedule your real sessions accordingly` : ""}.`
              : `Play 4+ runs in a time window and this tells you when your brain actually wins.`}</p>
          </section>`;
        })()}

        ${(() => {
          const report = eliteReportCard();
          return `
          <section class="elite-card">
            <p class="tdash-card-kicker gold">📋 REPORT CARD · ${report.monthLabel.toUpperCase()}</p>
            <div class="elab-report">
              ${report.rows.map((row) => `
                <div class="elab-report-row">
                  <span>${row.label}</span>
                  <small>${row.detail}</small>
                  <b class="elab-grade g-${row.grade.replace("—", "none")}">${row.grade}</b>
                </div>
              `).join("")}
            </div>
            <div class="elab-gpa">Overall <b class="elab-grade g-${report.overall.replace("—", "none")}">${report.overall}</b></div>
          </section>`;
        })()}

        ${(() => {
          const goals = eliteGoals();
          const rows = eliteGoalProgress();
          return `
          <section class="elite-card">
            <p class="tdash-card-kicker gold">🎯 GOAL ENGINE · THIS WEEK</p>
            <div class="elab-goals">
              ${rows.map((row) => {
                const pct = Math.min(100, Math.round((row.value / Math.max(1, row.target)) * 100));
                return `
                  <div class="elab-goal">
                    <div class="elab-goal-top"><span>${row.label}</span><b>${row.value.toLocaleString()} / <input type="number" class="elab-goal-input" data-elite-goal="${row.key}" value="${row.target}" min="1" /></b></div>
                    <div class="elab-goal-track"><i style="width:${pct}%" class="${pct >= 100 ? "hit" : ""}"></i></div>
                  </div>`;
              }).join("")}
            </div>
            <p class="elab-verdict">${rows.every((row) => row.value >= row.target)
              ? `All three goals hit. That's a professional week — raise the bar.`
              : `Targets auto-set from last week +10%. Edit the numbers to make them yours.`}</p>
          </section>`;
        })()}

        ${(() => {
          const memo = eliteDebrief();
          return `
          <section class="elite-card elab-wide elab-debrief">
            <p class="tdash-card-kicker gold">🧠 AI DESK DEBRIEF <span class="elab-debrief-tag">generated from your data</span></p>
            <div class="elab-memo">${memo.lines.map((line) => `<p>${line}</p>`).join("")}</div>
            <div class="elab-actions">
              <b>THIS WEEK'S ORDERS</b>
              ${memo.actions.map((action, i) => `<div class="elab-action"><span>${i + 1}</span>${action}</div>`).join("")}
            </div>
          </section>`;
        })()}
      </div>
    </div>
  `;

  renderEliteWatchRows();
  eliteRefreshQuotes(true);
  eliteEnsureTimer();

  root.querySelectorAll("[data-elite-nav]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.eliteNav));
  });
  const input = root.querySelector("#elite-watch-input");
  root.querySelector("#elite-watch-add")?.addEventListener("click", () => { eliteWatchAdd(input.value); input.value = ""; });
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { eliteWatchAdd(input.value); input.value = ""; }
  });
  root.querySelectorAll("[data-elite-goal]").forEach((goalInput) => {
    goalInput.addEventListener("change", () => {
      const goals = eliteGoals();
      const value = Math.max(1, Math.round(Number(goalInput.value) || 1));
      goals[goalInput.dataset.eliteGoal] = value;
      saveProgress();
      renderEliteDashboard();
    });
  });
  root.querySelector("#elite-alert-add")?.addEventListener("click", () => {
    eliteAlertAdd(
      root.querySelector("#elite-alert-sym")?.value,
      root.querySelector("#elite-alert-dir")?.value === "below" ? "below" : "above",
      Number(root.querySelector("#elite-alert-price")?.value)
    );
  });
  root.querySelectorAll("[data-alert-x]").forEach((button) => {
    button.addEventListener("click", () => {
      const p = progress();
      p.priceAlerts = eliteAlerts().filter((alert) => alert.id !== button.dataset.alertX);
      saveProgress();
      renderEliteDashboard();
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function renderEliteWatchRows() {
  const host = document.getElementById("elite-watch-rows");
  if (!host) return;
  host.innerHTML = eliteWatchlist().map((symbol) => {
    const quote = eliteState.quotes[symbol];
    const display = typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(symbol) : symbol;
    if (!quote) return `<div class="elite-watch-row loading"><b>${display}</b><span class="elite-watch-spark"></span><small>loading…</small><button type="button" class="elite-watch-x" data-watch-x="${symbol}">✕</button></div>`;
    if (quote.error) return `<div class="elite-watch-row error"><b>${display}</b><small>feed unavailable</small><button type="button" class="elite-watch-x" data-watch-x="${symbol}">✕</button></div>`;
    const up = (quote.change ?? 0) >= 0;
    return `
      <div class="elite-watch-row">
        <b>${display}</b>
        <canvas class="elite-watch-spark" data-spark="${symbol}" width="110" height="34"></canvas>
        <span class="elite-watch-price">${typeof tdashPrice === "function" ? tdashPrice(quote.last) : quote.last}</span>
        <span class="elite-watch-chg ${up ? "up" : "down"}">${quote.change === null ? "—" : `${up ? "+" : ""}${quote.change.toFixed(2)}%`}</span>
        <button type="button" class="elite-watch-x" data-watch-x="${symbol}">✕</button>
      </div>
    `;
  }).join("");

  host.querySelectorAll("[data-watch-x]").forEach((button) => {
    button.addEventListener("click", () => eliteWatchRemove(button.dataset.watchX));
  });
  host.querySelectorAll("[data-spark]").forEach((canvas) => {
    const quote = eliteState.quotes[canvas.dataset.spark];
    if (!quote || quote.closes.length < 2) return;
    const ctx = canvas.getContext("2d");
    const { closes } = quote;
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const span = (max - min) || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    closes.forEach((value, index) => {
      const x = (index / (closes.length - 1)) * canvas.width;
      const y = canvas.height - 3 - ((value - min) / span) * (canvas.height - 6);
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = (quote.change ?? 0) >= 0 ? "#3ddc97" : "#ff5f6e";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  });
}

/* ---------- init ---------- */

(() => {
  if (typeof state !== "undefined" && state.currentView === "elite") renderEliteDashboard();
})();
