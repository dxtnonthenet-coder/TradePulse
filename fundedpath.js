/* ReplayEdge — The Funded Path (Prop Firm tab)
   Answers the only question that matters to a prop trader:
   "Given these eval rules and how I ACTUALLY trade — can I pass,
   how long will it take, and what are my daily numbers?"
   Runs the user's real edge (journal → replay → arcade fallback)
   through a Monte Carlo of the eval, with and without Guardian
   discipline, then adds the Prop Matcher and a payout plan. */

const fpState = { tier: "t50", risk: null, tpd: 4, results: null };

/* ---------- the user's real edge ---------- */

function fpUserEdge() {
  // 1st choice: their trade journal (real R multiples)
  const log = Array.isArray(progress().tradeLog) ? progress().tradeLog : [];
  if (log.length >= 10) {
    const wins = log.filter((trade) => trade.r > 0);
    const losses = log.filter((trade) => trade.r <= 0);
    return {
      source: `your Trade Journal (${log.length} logged trades)`,
      wr: wins.length / log.length,
      winR: wins.length ? wins.reduce((sum, trade) => sum + trade.r, 0) / wins.length : 1.5,
      lossR: losses.length ? Math.max(0.2, -losses.reduce((sum, trade) => sum + trade.r, 0) / losses.length) : 1
    };
  }
  // 2nd: chart replay career
  const replay = progress().replay;
  if (replay && replay.trades >= 10) {
    return { source: `your Chart Replay record (${replay.trades} trades)`, wr: replay.wins / replay.trades, winR: 1.5, lossR: 1 };
  }
  // 3rd: arcade history
  const history = (typeof arcadeData === "function" ? arcadeData().history : []) || [];
  if (history.length >= 8) {
    return { source: `your Arcade record (${history.length} runs)`, wr: history.filter((run) => run.xp > 0).length / history.length, winR: 1.5, lossR: 1 };
  }
  return { source: "a 50% baseline — log 10 journal trades for a personalized read", wr: 0.5, winR: 1.5, lossR: 1 };
}

/* ---------- monte carlo vs the actual eval rules ---------- */

function fpSimulate(tier, cfg, guardian) {
  const sims = 400, maxDays = 60;
  let passed = 0, failDaily = 0, failTrail = 0;
  const passDays = [];
  for (let s = 0; s < sims; s += 1) {
    let profit = 0, peak = 0, alive = true, done = false;
    for (let day = 1; day <= maxDays && alive && !done; day += 1) {
      let dayPnl = 0;
      for (let t = 0; t < cfg.tpd; t += 1) {
        const outcome = Math.random() < cfg.wr ? cfg.risk * cfg.winR : -cfg.risk * cfg.lossR;
        dayPnl += outcome;
        profit += outcome;
        peak = Math.max(peak, profit);
        const floor = peak >= tier.trailing ? 0 : peak - tier.trailing;
        if (dayPnl <= -tier.dailyLoss) { alive = false; failDaily += 1; break; }
        if (profit <= floor - 0.01 && (peak > 0 || profit < 0) && profit <= floor) { alive = false; failTrail += 1; break; }
        if (profit >= tier.target) { done = true; passDays.push(day); break; }
        // guardian discipline: stop the day at half the daily limit
        if (guardian && dayPnl <= -tier.dailyLoss * 0.5) break;
      }
    }
    if (done) passed += 1;
  }
  passDays.sort((a, b) => a - b);
  return {
    passProb: (passed / sims) * 100,
    medianDays: passDays.length ? passDays[Math.floor(passDays.length / 2)] : null,
    failDaily: (failDaily / sims) * 100,
    failTrail: (failTrail / sims) * 100
  };
}

/* ---------- prop matcher ---------- */

function fpMatcher(edge) {
  const history = (typeof arcadeData === "function" ? arcadeData().history : []) || [];
  const weekRuns = history.filter((run) => run.ts >= Date.now() - 7 * 86400000).length;
  const paceHigh = weekRuns >= 20;
  let style, why, tier;
  if (edge.wr >= 0.55 && edge.winR <= 1.6) {
    style = "Precision Scalper";
    why = `High win rate (${Math.round(edge.wr * 100)}%) with modest winners — you grind small edges fast. Tight daily limits don't scare you; you rarely take big single losses.`;
    tier = "t25";
  } else if (edge.winR >= 2) {
    style = "Swing Hunter";
    why = `Your winners run (${edge.winR.toFixed(1)}R average) but the win rate is lower — you need ROOM. Small accounts with tight trailing drawdown choke this style before it can pay.`;
    tier = "t150";
  } else {
    style = "Balanced Day Trader";
    why = `Solid mix — ${Math.round(edge.wr * 100)}% win rate with ${edge.winR.toFixed(1)}R winners. The middle-size desk gives you enough buffer without over-paying for room you don't need.`;
    tier = "t50";
  }
  if (paceHigh && style === "Swing Hunter") why += " (Heads up: you trade a LOT for a swing profile — watch overtrading.)";
  return { style, why, tier };
}

/* ---------- render ---------- */

function pfRenderPath(body) {
  const tier = PF_TIERS[fpState.tier];
  if (fpState.risk === null) fpState.risk = Math.round(tier.dailyLoss / 4);
  const edge = fpUserEdge();
  const cfg = { wr: edge.wr, winR: edge.winR, lossR: edge.lossR, risk: fpState.risk, tpd: fpState.tpd };
  const withGuardian = fpSimulate(tier, cfg, true);
  const without = fpSimulate(tier, cfg, false);
  fpState.results = { withGuardian, without };
  const match = fpMatcher(edge);
  const matchTier = PF_TIERS[match.tier];

  const days = withGuardian.medianDays;
  const dailyGoal = days ? Math.ceil(tier.target / days / 10) * 10 : Math.ceil(tier.target / 10 / 10) * 10;
  const hardStop = Math.round(tier.dailyLoss * 0.5);
  const payoutDays = days ? Math.ceil(tier.minPayout / Math.max(1, dailyGoal)) : null;
  const prob = Math.round(withGuardian.passProb);
  const verdict = prob >= 70
    ? `Strong. At your numbers this eval is very beatable — the only way you lose is breaking your own rules.`
    : prob >= 45
      ? `Winnable, but thin. Lower the risk slider or improve your win rate in Replay before paying for a real eval.`
      : `Honest read: your current edge fails this eval more often than it passes. Train first — every sim dollar you don't spend on failed evals is a payout later.`;

  body.innerHTML = `
    <div class="fp-wrap">
      <div class="fp-head">
        <div>
          <p class="arcade-kicker gold-kicker">// THE FUNDED PATH</p>
          <h3>Can you pass — and what's the plan?</h3>
          <p class="fp-sub">400 simulated evaluations using <b>${edge.source}</b>: ${Math.round(edge.wr * 100)}% win rate, +${edge.winR.toFixed(1)}R avg win, −${edge.lossR.toFixed(1)}R avg loss.</p>
        </div>
      </div>

      <div class="fp-controls">
        <div class="fp-tiers">
          ${Object.values(PF_TIERS).map((item) => `
            <button class="fp-tier ${item.id === fpState.tier ? "active" : ""}" type="button" data-fp-tier="${item.id}">
              $${item.size / 1000}K<small>${pfMoney(item.target, true)} target</small>
            </button>`).join("")}
        </div>
        <label class="fp-slider">
          <span>Risk per trade: <b>${pfMoney(fpState.risk)}</b></span>
          <input type="range" id="fp-risk" min="${Math.round(tier.dailyLoss / 10)}" max="${Math.round(tier.dailyLoss / 2)}" step="10" value="${fpState.risk}" />
        </label>
        <label class="fp-slider">
          <span>Trades per day: <b>${fpState.tpd}</b></span>
          <input type="range" id="fp-tpd" min="1" max="10" step="1" value="${fpState.tpd}" />
        </label>
      </div>

      <div class="fp-grid">
        <section class="fp-card fp-prob">
          <small>PASS PROBABILITY · WITH GUARDIAN DISCIPLINE</small>
          <div class="fp-prob-big ${prob >= 70 ? "good" : prob >= 45 ? "warn" : "bad"}">${prob}%</div>
          <div class="fp-compare">
            <div class="fp-compare-row">
              <span>🛡 With Guardian (stop at −${pfMoney(hardStop)}/day)</span>
              <div class="fp-bar"><i style="width:${Math.round(withGuardian.passProb)}%" class="good"></i></div>
              <b>${Math.round(withGuardian.passProb)}%</b>
            </div>
            <div class="fp-compare-row">
              <span>😤 Without discipline (full send)</span>
              <div class="fp-bar"><i style="width:${Math.round(without.passProb)}%" class="bad"></i></div>
              <b>${Math.round(without.passProb)}%</b>
            </div>
          </div>
          <p class="fp-note">${withGuardian.passProb - without.passProb >= 3
            ? `Following the daily stop-rule alone is worth <b>+${Math.round(withGuardian.passProb - without.passProb)} points</b> of pass rate. Discipline IS the edge.`
            : `At these settings the rules rarely bind — your edge does the work.`}</p>
          <p class="fp-verdict">${verdict}</p>
        </section>

        <section class="fp-card">
          <small>YOUR DAILY NUMBERS</small>
          <div class="fp-daily">
            <div><span>DAILY GOAL</span><b class="good">+${pfMoney(dailyGoal)}</b><em>hit it, stop, come back tomorrow</em></div>
            <div><span>HARD STOP</span><b class="bad">−${pfMoney(hardStop)}</b><em>down this much = done for the day</em></div>
            <div><span>MAX RISK / TRADE</span><b>${pfMoney(fpState.risk)}</b><em>never size above this</em></div>
          </div>
          <div class="fp-timeline">
            <div><span>MEDIAN TIME TO FUNDED</span><b>${days ? `${days} trading days` : "—"}</b></div>
            <div><span>WHEN EVALS FAIL, IT'S</span><b>${withGuardian.failDaily + withGuardian.failTrail > 0 ? `${Math.round((withGuardian.failDaily / Math.max(0.1, withGuardian.failDaily + withGuardian.failTrail)) * 100)}% daily limit` : "—"}</b></div>
            <div><span>FIRST PAYOUT (EST.)</span><b>${days && payoutDays ? `~${days + payoutDays} days total` : "—"}</b></div>
          </div>
          <p class="fp-note">Payout math: pass in ~${days || "—"} days, then bank ${pfMoney(tier.minPayout)} at your pace ≈ ${payoutDays || "—"} more days. Split: <b>${Math.round(tier.payoutShare * 100)}% yours</b>.</p>
        </section>

        <section class="fp-card fp-match">
          <small>🧭 PROP MATCHER · WHICH EVAL FITS YOU</small>
          <div class="fp-match-style"><b>${match.style}</b><span class="fp-match-tier">→ best fit: <b>$${matchTier.size / 1000}K desk</b></span></div>
          <p class="fp-note">${match.why}</p>
          <button class="arcade-btn primary cp-mini" type="button" id="fp-goto-buy">Start a $${matchTier.size / 1000}K eval — ${pfMoney(matchTier.cost)}</button>
        </section>
      </div>
      <p class="fp-foot">Simulation of the Training Grounds rules using your practice statistics — educational planning, not a guarantee or financial advice.</p>
    </div>
  `;

  body.querySelectorAll("[data-fp-tier]").forEach((button) => {
    button.addEventListener("click", () => {
      fpState.tier = button.dataset.fpTier;
      fpState.risk = Math.round(PF_TIERS[fpState.tier].dailyLoss / 4);
      pfRenderPath(body);
    });
  });
  body.querySelector("#fp-risk")?.addEventListener("change", (event) => {
    fpState.risk = Number(event.target.value);
    pfRenderPath(body);
  });
  body.querySelector("#fp-tpd")?.addEventListener("change", (event) => {
    fpState.tpd = Number(event.target.value);
    pfRenderPath(body);
  });
  body.querySelector("#fp-goto-buy")?.addEventListener("click", () => {
    pfState.tab = "accounts";
    renderPropfirm();
  });
}
