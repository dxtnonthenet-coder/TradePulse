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
  if (rerender || state.currentView === "elite") renderEliteWatchRows();
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
          <div>📡 <b>Live Watchlist</b><span>Up to 5 real instruments with live quotes & sparklines</span></div>
          <div>🛡 <b>Discipline Score</b><span>A weekly A–F grade computed from your actual behavior</span></div>
          <div>🗺 <b>Today's Game Plan</b><span>Your lesson, drill, and challenges — auto-built every morning</span></div>
          <div>📈 <b>Weekly Report</b><span>XP by day, win-rate trend, and your weakest game called out</span></div>
          <div>🧠 <b>AI Trade Review</b><span>Grade real trade ideas before you ever risk a dollar</span></div>
          <div>📚 <b>Study Plan</b><span>A fresh weekly curriculum aimed at your weakest tiers</span></div>
        </div>
        <button class="primary-button" type="button" id="elite-unlock-cta">Unlock Elite — $69.99/mo</button>
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
