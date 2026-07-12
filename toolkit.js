/* ReplayEdge Trader Toolkit — premium tools that justify Coach/Elite.
   Loads after app.js/academy.js/arcade.js. */

const TOOLKIT_TICK_PRESETS = [
  { symbol: "MES", value: 1.25 },
  { symbol: "MNQ", value: 0.5 },
  { symbol: "ES", value: 12.5 },
  { symbol: "NQ", value: 5 },
  { symbol: "CL", value: 10 },
  { symbol: "GC", value: 10 }
];

/* ---------- mistake journal data ---------- */

function journalData() {
  const p = progress();
  if (!Array.isArray(p.journal)) p.journal = [];
  return p.journal;
}

function journalRecord(entry) {
  const journal = journalData();
  journal.push({ id: `j_${Date.now()}_${Math.floor(Math.random() * 1e5)}`, ts: Date.now(), ...entry });
  if (journal.length > 50) journal.splice(0, journal.length - 50);
  saveProgress();
}

function journalResolve(id) {
  const p = progress();
  p.journal = journalData().filter((entry) => entry.id !== id);
  saveProgress();
  renderToolkit();
}

/* ---------- study plan (Elite) ---------- */

function studyPlanWeekKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return start.toDateString();
}

function generateStudyPlan() {
  const p = progress();
  // rank unlocked tiers by completion (weakest first)
  const ranked = academyTiers
    .map((tier, index) => ({ tier, index, stats: academyTierStats(tier), unlocked: academyTierUnlocked(index) }))
    .filter((item) => item.unlocked && item.stats.done < item.stats.total)
    .sort((a, b) => (a.stats.done / a.stats.total) - (b.stats.done / b.stats.total));
  const focus = ranked.length ? ranked : academyTiers.map((tier, index) => ({ tier, index, stats: academyTierStats(tier) }));
  const items = [];
  for (let day = 0; day < 7 && items.length < 14; day += 1) {
    const pick = focus[day % focus.length];
    const lesson = pick.tier.lessons.find((item) => !academyLessonPassed(item.id)) || pick.tier.lessons[0];
    const game = arcadeGames.find((item) => item.tier === pick.index) || arcadeGames[0];
    items.push({ day: day + 1, label: `Pass "${lesson.title}"`, action: "lesson", target: lesson.id, done: false });
    items.push({ day: day + 1, label: `Bank XP in 2 runs of ${game.title}`, action: "game", target: game.id, done: false });
  }
  p.studyPlan = { weekOf: studyPlanWeekKey(), items };
  saveProgress();
  return p.studyPlan;
}

function studyPlan() {
  const p = progress();
  if (!p.studyPlan || p.studyPlan.weekOf !== studyPlanWeekKey()) return generateStudyPlan();
  return p.studyPlan;
}


/* ---------- telemetry ---------- */

function telemetryRecord(type) {
  const p = progress();
  if (!Array.isArray(p.telemetry)) p.telemetry = [];
  p.telemetry.push({ type, ts: Date.now() });
  if (p.telemetry.length > 100) p.telemetry = p.telemetry.slice(-100);
  saveProgress();
}

/* ---------- weakness radar (Coach) ---------- */

function weaknessDetect() {
  const p = progress();
  const telemetry = Array.isArray(p.telemetry) ? p.telemetry : [];
  const weekAgo = Date.now() - 7 * 86400000;
  const recent = telemetry.filter((entry) => entry.ts >= weekAgo);
  const count = (type) => recent.filter((entry) => entry.type === type).length;
  const history = (arcadeData().history || []);
  const wins = history.filter((entry) => entry.xp > 0).length;
  const winRate = history.length >= 8 ? Math.round((wins / history.length) * 100) : null;
  const bustRate = history.length >= 8 ? Math.round(((history.length - wins) / history.length) * 100) : null;

  // overtrading: 6+ runs inside any 30-minute window in the last 24h
  const dayRuns = history.filter((entry) => entry.ts >= Date.now() - 86400000).map((entry) => entry.ts).sort((a, b) => a - b);
  let overtrading = false;
  for (let i = 0; i + 5 < dayRuns.length; i += 1) {
    if (dayRuns[i + 5] - dayRuns[i] <= 30 * 60000) { overtrading = true; break; }
  }

  const findings = [];
  if (overtrading) findings.push({ key: "overtrading", icon: "repeat", title: "Overtrading", evidence: "6+ runs inside a 30-minute window in the last day — quantity is replacing quality.", drillLabel: "Drill: patience reps in Trap or Trade", game: "traportrade", lesson: "overtrading" });
  if (count("hesitation") >= 2) findings.push({ key: "hesitation", icon: "timer-off", title: "Late Entries", evidence: `${count("hesitation")} valid setups timed out this week — you see it, then freeze.`, drillLabel: "Drill: 7-second decisions", game: "traportrade", lesson: "trade-management" });
  if (count("chase") >= 3) findings.push({ key: "chase", icon: "zap", title: "Chasing Traps", evidence: `${count("chase")} trap setups taken this week — entering on excitement, not confluence.`, drillLabel: "Drill: skip training", game: "traportrade", lesson: "breakout" });
  if (count("greed") >= 2) findings.push({ key: "greed", icon: "hand-coins", title: "Cash-Out Discipline", evidence: `${count("greed")} pots lost at 4+ streaks — banking beats squeezing.`, drillLabel: "Drill: cash-out reps in Candle Rush", game: "candlerush", lesson: "trade-management" });
  if (count("tilt") >= 2) findings.push({ key: "tilt", icon: "flame", title: "Tilt Behavior", evidence: `${count("tilt")} account-killers flipped this week — the mines found your tilt pattern.`, drillLabel: "Drill: Risk Mines + revenge lesson", game: "riskmines", lesson: "revenge-trading" });
  if (count("oversize") >= 2) findings.push({ key: "oversize", icon: "scale", title: "Oversizing Weak Setups", evidence: `${count("oversize")} max-risk entries on C-grade setups — size should follow confluence.`, drillLabel: "Drill: Prop Run sizing", game: "proprun", lesson: "risk-systems" });
  if (winRate !== null && winRate < 45) findings.push({ key: "winrate", icon: "target", title: "Low Win Rate", evidence: `${winRate}% win rate over your last ${history.length} runs — read quality needs reps at lower speed.`, drillLabel: "Drill: precision in Zone Sniper", game: "zonesniper", lesson: "support-resistance" });
  if (bustRate !== null && bustRate > 45 && !findings.some((f) => f.key === "greed")) findings.push({ key: "bustrate", icon: "shield-off", title: "Risk-to-Reward Leak", evidence: `${bustRate}% of runs end in a bust — you're giving back full pots instead of banking partials.`, drillLabel: "Drill: banked exits", game: "riskmines", lesson: "risk-before-reward" });

  return { findings, sampled: history.length, winRate };
}

function toolkitWeaknessCard() {
  const radar = weaknessDetect();
  const rows = radar.findings.length ? radar.findings.map((finding) => `
    <div class="wk-row">
      <span class="wk-icon"><i data-lucide="${finding.icon}"></i></span>
      <span class="wk-body"><strong>${finding.title}</strong><small>${finding.evidence}</small></span>
      <button class="arcade-btn primary cp-mini" type="button" data-wk-game="${finding.game}" data-wk-lesson="${finding.lesson}">Drill</button>
    </div>
  `).join("") : `<p class="tk-empty">${radar.sampled < 8 ? `Radar is calibrating — ${radar.sampled}/8 runs sampled. Play more arcade runs to surface your patterns.` : "No leaks detected this week. The radar keeps watching every run, timeout, and bust."}</p>`;
  return `
    <article class="panel tk-card">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="radar"></i></span>
        <h3>Weakness Radar</h3>
        <span class="tk-plan-tag on">Active${radar.winRate !== null ? ` · ${radar.winRate}% WR` : ""}</span>
      </div>
      <p class="tk-copy">Detects overtrading, late entries, chasing, tilt, and sizing leaks from your actual play — then hands you the targeted drill.</p>
      <div class="wk-list">${rows}</div>
    </article>
  `;
}

/* ---------- AI trade review (Elite) ---------- */

function aiReviewAnalyze(input) {
  const { direction, entry, stop, target, exit, flags } = input;
  const long = direction === "long";
  const risk = long ? entry - stop : stop - entry;
  const reward = long ? target - entry : entry - target;
  const result = long ? exit - entry : entry - exit;
  const rr = risk > 0 ? reward / risk : 0;
  const entryIssues = [];
  const riskIssues = [];
  let grade = 100;

  if (flags.chased) { entryIssues.push("You entered after the move was already extended — chasing pays the early money, not you. The entry belonged at the origin of the move, not its third act."); grade -= 20; }
  if (!flags.confirmed) { entryIssues.push("No confirmation was logged. Entering at a level without a sweep or structure shift is a prediction, not a trade — wait for the market to show its hand."); grade -= 15; }
  if (flags.news) { entryIssues.push("Entering around a red-folder event turns structure into a coin flip — one candle can invalidate everything you analyzed."); grade -= 15; }
  if (!entryIssues.length) entryIssues.push("Entry location and timing look structurally sound — no chase, confirmation present, clean calendar.");

  if (risk <= 0) { riskIssues.push("Your stop is on the wrong side of entry — as placed, this trade had undefined risk."); grade -= 30; }
  else if (rr < 1.5) { riskIssues.push(`Risk-to-reward was 1:${rr.toFixed(1)} — below the 1:1.5 floor. At this ratio you need an unrealistic win rate just to break even.`); grade -= 20; }
  else riskIssues.push(`Risk-to-reward of 1:${rr.toFixed(1)} clears the bar.`);
  if (!flags.sized) { riskIssues.push("Size wasn't derived from the stop — that means risk per trade was accidental, not chosen."); grade -= 15; }
  if (flags.afterLosses) { riskIssues.push("Taken after 2+ consecutive losses — statistically your most dangerous state. The circuit-breaker rule exists for exactly this trade."); grade -= 15; }

  const better = [];
  if (flags.chased) better.push(`wait for the retrace into the origin zone (near ${stop.toFixed(2)}–${entry.toFixed(2)}) instead of market-buying the extension`);
  if (!flags.confirmed) better.push("demand the sweep-and-shift sequence before committing");
  if (rr > 0 && rr < 1.5 && risk > 0) better.push(`either tighten the stop behind structure or extend the target toward the next liquidity pool to reach 1:2 (≈ ${(long ? entry + risk * 2 : entry - risk * 2).toFixed(2)})`);
  if (flags.afterLosses) better.push("after two losses: 15-minute break, journal, then re-qualify the setup from scratch");
  if (!better.length) better.push("this trade was structurally sound — review the management: did you take partials at 1R and honor the plan?");

  const letter = grade >= 85 ? "A" : grade >= 70 ? "B" : grade >= 55 ? "C" : grade >= 40 ? "D" : "F";
  return { entryIssues, riskIssues, better, rr: risk > 0 ? rr : 0, result, grade: letter };
}

function toolkitAiReviewCard() {
  const p = progress();
  const reviews = Array.isArray(p.aiReviews) ? p.aiReviews : [];
  return `
    <article class="panel tk-card tk-wide">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="scan-search"></i></span>
        <h3>AI Trade Review</h3>
        <span class="tk-plan-tag on">Elite · instant analysis</span>
      </div>
      <p class="tk-copy">Log a real trade and get an instant breakdown: entry mistake, risk flaw, and the better alternative — graded like a desk review.</p>
      <div class="ai-form">
        <div class="ai-form-grid">
          <label>Direction
            <select id="ai-direction"><option value="long">Long</option><option value="short">Short</option></select>
          </label>
          <label>Entry <input id="ai-entry" type="number" step="0.01" placeholder="100.00" /></label>
          <label>Stop <input id="ai-stop" type="number" step="0.01" placeholder="99.00" /></label>
          <label>Target <input id="ai-target" type="number" step="0.01" placeholder="102.00" /></label>
          <label>Exit <input id="ai-exit" type="number" step="0.01" placeholder="101.20" /></label>
        </div>
        <div class="ai-flags">
          <label><input type="checkbox" id="ai-chased" /> Entered after 3+ candles in my direction</label>
          <label><input type="checkbox" id="ai-confirmed" checked /> Waited for sweep / confirmation</label>
          <label><input type="checkbox" id="ai-news" /> Red-folder news within 30 min</label>
          <label><input type="checkbox" id="ai-sized" checked /> Sized position from the stop</label>
          <label><input type="checkbox" id="ai-afterlosses" /> Taken after 2+ straight losses</label>
        </div>
        <button class="arcade-btn primary" type="button" id="ai-run">Review my trade</button>
      </div>
      <div id="ai-output">${reviews.length ? `<small class="cp-lobby-meta">Last review grade: <b>${reviews[0].grade}</b></small>` : ""}</div>
    </article>
  `;
}

function aiReviewSubmit() {
  const value = (id) => Number(document.getElementById(id)?.value || 0);
  const checked = (id) => Boolean(document.getElementById(id)?.checked);
  const input = {
    direction: document.getElementById("ai-direction")?.value || "long",
    entry: value("ai-entry"), stop: value("ai-stop"), target: value("ai-target"), exit: value("ai-exit"),
    flags: { chased: checked("ai-chased"), confirmed: checked("ai-confirmed"), news: checked("ai-news"), sized: checked("ai-sized"), afterLosses: checked("ai-afterlosses") }
  };
  if (!input.entry || !input.stop || !input.target) {
    showToast("Fill entry, stop, and target to run the review.", "info");
    return;
  }
  const review = aiReviewAnalyze(input);
  const p = progress();
  p.aiReviews = [{ grade: review.grade, ts: Date.now() }, ...(p.aiReviews || [])].slice(0, 5);
  saveProgress();
  const out = document.getElementById("ai-output");
  if (out) {
    out.innerHTML = `
      <div class="ai-result">
        <div class="ai-grade grade-${review.grade}">${review.grade}</div>
        <div class="ai-sections">
          <div class="ai-section"><b><i data-lucide="log-in"></i> Entry</b>${review.entryIssues.map((issue) => `<p>${issue}</p>`).join("")}</div>
          <div class="ai-section"><b><i data-lucide="shield-alert"></i> Risk</b>${review.riskIssues.map((issue) => `<p>${issue}</p>`).join("")}</div>
          <div class="ai-section better"><b><i data-lucide="lightbulb"></i> Better alternative</b><p>${review.better.map((text, index) => `${index + 1}. ${text.charAt(0).toUpperCase() + text.slice(1)}`).join(" ")}</p></div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
  if (typeof arcadeSound === "function") arcadeSound(review.grade === "A" ? "cashout" : "win");
}

/* ---------- rendering ---------- */

function toolkitLockedCard(feature, title, icon, copy) {
  const plan = requiredPlanForFeature(feature);
  return `
    <article class="panel tk-card tk-locked">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="${icon}"></i></span>
        <h3>${title}</h3>
        <span class="tk-plan-tag">${plan}</span>
      </div>
      <p class="tk-copy">${copy}</p>
      <div class="tk-lock-overlay">
        <i data-lucide="lock"></i>
        <button class="arcade-btn primary" type="button" data-tk-upgrade="${feature}">Unlock with ${plan}</button>
      </div>
    </article>
  `;
}

function toolkitRiskCard() {
  return `
    <article class="panel tk-card">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="calculator"></i></span>
        <h3>Risk Calculator</h3>
        <span class="tk-plan-tag on">Active</span>
      </div>
      <p class="tk-copy">Size every position from the stop — the way professionals do.</p>
      <div class="tk-risk-grid">
        <label>Account <input id="tk-account" type="number" value="10000" min="100" /></label>
        <label>Risk % <input id="tk-riskpct" type="number" value="1" min="0.1" step="0.1" /></label>
        <label>Stop (ticks) <input id="tk-stop" type="number" value="20" min="1" /></label>
        <label>Tick value $
          <select id="tk-tick">
            ${TOOLKIT_TICK_PRESETS.map((preset) => `<option value="${preset.value}">${preset.symbol} — $${preset.value}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="tk-risk-result" id="tk-risk-result"></div>
    </article>
  `;
}

function toolkitRiskCompute() {
  const account = Number(document.getElementById("tk-account")?.value || 0);
  const riskPct = Number(document.getElementById("tk-riskpct")?.value || 0);
  const stopTicks = Number(document.getElementById("tk-stop")?.value || 0);
  const tickValue = Number(document.getElementById("tk-tick")?.value || 0);
  const result = document.getElementById("tk-risk-result");
  if (!result) return;
  const dollarRisk = account * (riskPct / 100);
  const perContract = stopTicks * tickValue;
  const contracts = perContract > 0 ? Math.floor(dollarRisk / perContract) : 0;
  result.innerHTML = `
    <div><span>$ Risk</span><strong>$${dollarRisk.toFixed(0)}</strong></div>
    <div><span>Per contract</span><strong>$${perContract.toFixed(2)}</strong></div>
    <div class="tk-risk-final ${contracts > 0 ? "" : "warn"}"><span>Contracts</span><strong>${contracts}</strong></div>
    ${contracts === 0 && perContract > 0 ? `<small>Stop too wide for this risk — reduce size expectations or tighten the setup.</small>` : ""}
  `;
}

function toolkitJournalCard() {
  const entries = [...journalData()].reverse();
  const rows = entries.length ? entries.map((entry) => {
    if (entry.type === "quiz") {
      const found = typeof findAcademyLesson === "function" ? findAcademyLesson(entry.lessonId) : null;
      const title = found ? found.lesson.title : entry.lessonId;
      return `
        <div class="tk-journal-row">
          <span class="tk-journal-type quiz">QUIZ</span>
          <span class="tk-journal-label">Failed: ${title}</span>
          <button class="arcade-btn ghost" type="button" data-tk-lesson="${entry.lessonId}">Retake</button>
          <button class="tk-resolve" type="button" data-tk-resolve="${entry.id}" title="Mark resolved">✓</button>
        </div>`;
    }
    const game = arcadeGames.find((item) => item.id === entry.gameId);
    return `
      <div class="tk-journal-row">
        <span class="tk-journal-type bust">BUST</span>
        <span class="tk-journal-label">Busted in ${game ? game.title : entry.gameId}</span>
        <button class="arcade-btn ghost" type="button" data-tk-game="${entry.gameId}">Rematch</button>
        <button class="tk-resolve" type="button" data-tk-resolve="${entry.id}" title="Mark resolved">✓</button>
      </div>`;
  }).join("") : `<p class="tk-empty">Clean slate. Failed quizzes and arcade busts collect here automatically so you can re-drill them.</p>`;
  return `
    <article class="panel tk-card">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="notebook-pen"></i></span>
        <h3>Mistake Journal</h3>
        <span class="tk-plan-tag on">Active</span>
      </div>
      <p class="tk-copy">80% of losses come from one repeated mistake. Find yours here.</p>
      <div class="tk-journal">${rows}</div>
    </article>
  `;
}

function toolkitAnalyticsCard() {
  const data = arcadeData();
  const history = Array.isArray(data.history) ? data.history.slice(-20) : [];
  const avg = data.runsTotal ? Math.round((data.totalXp || 0) / data.runsTotal) : 0;
  const maxXp = Math.max(1, ...history.map((entry) => entry.xp));
  const bars = history.length
    ? history.map((entry) => `<i style="height:${Math.max(6, Math.round((entry.xp / maxXp) * 100))}%" class="${entry.xp === 0 ? "bust" : ""}" title="${entry.xp} XP"></i>`).join("")
    : "";
  const perGame = arcadeGames.map((game) => {
    const runs = data.runs?.[game.id] || 0;
    if (!runs) return "";
    const gameXp = (data.history || []).filter((entry) => entry.gameId === game.id).reduce((sum, entry) => sum + entry.xp, 0);
    return `
      <div class="tk-analytics-row">
        <span>${game.title}</span>
        <b>${runs} runs</b>
        <b>best ${data.best?.[game.id] || 0}</b>
        <b>${gameXp} XP</b>
      </div>`;
  }).join("");
  return `
    <article class="panel tk-card">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="bar-chart-3"></i></span>
        <h3>Performance Analytics</h3>
        <span class="tk-plan-tag on">Active</span>
      </div>
      <p class="tk-copy">Your last ${history.length || 0} runs — busts show as red gaps. Consistency beats spikes.</p>
      ${history.length ? `<div class="tk-spark">${bars}</div>` : `<p class="tk-empty">Play arcade runs to build your performance graph.</p>`}
      <div class="tk-analytics-stats">
        <div><span>Total runs</span><strong>${data.runsTotal || 0}</strong></div>
        <div><span>Avg XP / run</span><strong>${avg}</strong></div>
        <div><span>Arcade XP</span><strong>${(data.totalXp || 0).toLocaleString()}</strong></div>
      </div>
      ${perGame ? `<div class="tk-analytics-table">${perGame}</div>` : ""}
    </article>
  `;
}

function toolkitStudyPlanCard() {
  const plan = studyPlan();
  const done = plan.items.filter((item) => item.done).length;
  const days = [...new Set(plan.items.map((item) => item.day))];
  return `
    <article class="panel tk-card tk-wide">
      <div class="tk-card-head">
        <span class="tk-card-icon"><i data-lucide="map"></i></span>
        <h3>Personal Study Plan</h3>
        <span class="tk-plan-tag on">Elite · ${done}/${plan.items.length} done</span>
        <button class="arcade-btn ghost tk-regen" type="button" id="tk-regen">Regenerate</button>
      </div>
      <p class="tk-copy">Generated from your weakest tiers this week. Check items off as you clear them.</p>
      <div class="tk-plan-grid">
        ${days.map((day) => `
          <div class="tk-plan-day">
            <b>Day ${day}</b>
            ${plan.items.filter((item) => item.day === day).map((item) => {
              const index = plan.items.indexOf(item);
              return `
                <label class="tk-plan-item ${item.done ? "done" : ""}">
                  <input type="checkbox" data-tk-plan="${index}" ${item.done ? "checked" : ""} />
                  <span>${item.label}</span>
                </label>`;
            }).join("")}
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderToolkit() {
  const root = document.getElementById("toolkit-root");
  if (!root) return;
  const boost = typeof arcadePlanBoost === "function" ? arcadePlanBoost() : 1;
  root.innerHTML = `
    <div class="tk-head">
      <div>
        <p class="arcade-kicker">// TRADER TOOLKIT</p>
        <h2>Tools that pay for themselves.</h2>
        <p class="arcade-sub">Professional-grade utilities wired directly into your Academy and Arcade data.</p>
      </div>
      <div class="tk-boost-pill ${boost > 1 ? "on" : ""}">
        <strong>${boost > 1 ? `+${Math.round((boost - 1) * 100)}%` : "+0%"}</strong>
        <span>XP boost on every run${boost > 1 ? "" : " — unlocks with Coach"}</span>
      </div>
    </div>
    <div class="tk-grid">
      ${hasAccess("riskCalculator") ? toolkitRiskCard() : toolkitLockedCard("riskCalculator", "Risk Calculator", "calculator", "Size every position from the stop with futures tick presets — the discipline tool most traders skip.")}
      ${hasAccess("mistakeJournal") ? toolkitJournalCard() : toolkitLockedCard("mistakeJournal", "Mistake Journal", "notebook-pen", "Failed quizzes and arcade busts collect themselves into a re-drill list. Fix the one mistake costing you most.")}
      ${hasAccess("analytics") ? toolkitAnalyticsCard() : toolkitLockedCard("analytics", "Performance Analytics", "bar-chart-3", "Run-by-run XP graph, per-game records, and consistency stats across your whole arcade history.")}
      ${hasAccess("weaknessRadar") ? toolkitWeaknessCard() : toolkitLockedCard("weaknessRadar", "Weakness Radar", "radar", "Detects overtrading, late entries, chasing, tilt, and sizing leaks from your play — then assigns the exact drill that fixes each one.")}
      ${hasAccess("aiReview") ? toolkitAiReviewCard() : toolkitLockedCard("aiReview", "AI Trade Review", "scan-search", "Log any real trade and get an instant desk-style breakdown: entry mistake, risk flaw, better alternative, letter grade.")}
      ${hasAccess("studyPlan") ? toolkitStudyPlanCard() : toolkitLockedCard("studyPlan", "Personal Study Plan", "map", "A 7-day plan generated weekly from your weakest tiers — lessons and run targets, checked off as you go.")}
    </div>
  `;

  root.querySelectorAll("[data-tk-upgrade]").forEach((button) => {
    button.addEventListener("click", () => openUpgradeModal(button.dataset.tkUpgrade));
  });
  root.querySelectorAll("[data-tk-lesson]").forEach((button) => {
    button.addEventListener("click", () => openAcademyLesson(button.dataset.tkLesson));
  });
  root.querySelectorAll("[data-tk-game]").forEach((button) => {
    button.addEventListener("click", () => openArcadeGame(button.dataset.tkGame));
  });
  root.querySelectorAll("[data-tk-resolve]").forEach((button) => {
    button.addEventListener("click", () => journalResolve(button.dataset.tkResolve));
  });
  root.querySelectorAll("[data-tk-plan]").forEach((input) => {
    input.addEventListener("change", () => {
      const p = progress();
      const item = p.studyPlan?.items?.[Number(input.dataset.tkPlan)];
      if (item) {
        item.done = input.checked;
        saveProgress();
        renderToolkit();
      }
    });
  });
  root.querySelectorAll("[data-wk-game]").forEach((button) => {
    button.addEventListener("click", () => {
      const lesson = button.dataset.wkLesson;
      if (lesson && typeof findAcademyLesson === "function" && findAcademyLesson(lesson)) openAcademyLesson(lesson);
      else openArcadeGame(button.dataset.wkGame);
    });
  });
  root.querySelector("#ai-run")?.addEventListener("click", aiReviewSubmit);
  root.querySelector("#tk-regen")?.addEventListener("click", () => {
    generateStudyPlan();
    renderToolkit();
    showToast("Study plan regenerated from your latest data.", "success");
  });
  ["tk-account", "tk-riskpct", "tk-stop", "tk-tick"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", toolkitRiskCompute);
  });
  toolkitRiskCompute();
  if (window.lucide) window.lucide.createIcons();
}
