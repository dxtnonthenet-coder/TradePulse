/* ============================================================
   ReplayEdge — Feature Tour
   Animated multi-slide walkthrough of every feature (free +
   paid). Fires once, right after the user picks their market
   in onboarding (or closes that screen). Replay: ?tour=1
   ============================================================ */

const TOUR_SEEN_KEY = "tradePulseTourSeen";

const TOUR_SLIDES = [
  {
    id: "academy",
    kicker: "LEARN",
    title: "The Academy",
    plan: { label: "TIER 1 FREE", cls: "free" },
    body: "190+ bite-size lessons take you from “what’s a candlestick?” to reading markets like a pro. Every lesson pays out XP, badges, and practice dollars.",
    visual: `
      <div class="tv-path">
        <span class="tv-path-line"></span>
        <span class="tv-node done d1">✓</span>
        <span class="tv-node done d2">✓</span>
        <span class="tv-node done d3">✓</span>
        <span class="tv-node current">▶</span>
        <span class="tv-node locked">★</span>
        <b class="tv-float-chip">+40 XP</b>
      </div>`
  },
  {
    id: "arcade",
    kicker: "PRACTICE",
    title: "The Arcade",
    plan: { label: "5 FREE PLAYS / DAY", cls: "free" },
    body: "Trading games built on real historical price action — call the next move, dodge the traps, beat the clock. Wins sharpen your instincts and pay practice dollars.",
    visual: `
      <div class="tv-chart">
        <i class="tv-candle up c1"></i><i class="tv-candle dn c2"></i><i class="tv-candle up c3"></i>
        <i class="tv-candle up c4"></i><i class="tv-candle dn c5"></i><i class="tv-candle up c6"></i>
        <i class="tv-candle up c7"></i>
        <div class="tv-chart-btns">
          <span class="tv-btn long">LONG ▲</span>
          <span class="tv-btn short">SHORT ▼</span>
        </div>
        <b class="tv-float-chip win">+$15</b>
      </div>`
  },
  {
    id: "propfirm",
    kicker: "GO PRO",
    title: "Prop Firm Training Grounds",
    plan: { label: "INCLUDED WITH ANY PLAN", cls: "gold" },
    body: "Spend your earned dollars on a simulated prop account and trade a live-feeling market — real rules, real pressure, zero risk. Pass the eval, get funded, collect payouts, unlock exclusive badges.",
    visual: `
      <div class="tv-prop">
        <div class="tv-prop-head"><span>25K EVALUATION</span><strong class="tv-prop-bal">$26,340</strong></div>
        <svg viewBox="0 0 220 64" class="tv-equity" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,54 25,48 45,52 70,40 95,44 120,30 150,34 180,18 220,10"
            fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <b class="tv-stamp">FUNDED ✓</b>
      </div>`
  },
  {
    id: "compete",
    kicker: "COMPETE",
    title: "Friends & Leaderboards",
    plan: { label: "FREE", cls: "free" },
    body: "Add friends, peek at their stats, and battle for the top of the weekly XP and Biggest Gainers boards. Bragging rights included.",
    visual: `
      <div class="tv-board">
        <div class="tv-row r1"><span class="tv-rank gold">1</span><span class="tv-ava a1">M</span><span class="tv-name">MavTrades</span><span class="tv-score">2,840 XP</span><span class="tv-crown">👑</span></div>
        <div class="tv-row r2"><span class="tv-rank silver">2</span><span class="tv-ava a2">J</span><span class="tv-name">JLin_Fx</span><span class="tv-score">2,610 XP</span></div>
        <div class="tv-row r3"><span class="tv-rank bronze">3</span><span class="tv-ava a3">Y</span><span class="tv-name">You</span><span class="tv-score">2,595 XP</span></div>
      </div>`
  },
  {
    id: "streaks",
    kicker: "EARN",
    title: "Streaks, Quests & Rewards",
    plan: { label: "FREE", cls: "free" },
    body: "Show up daily to build a streak that multiplies your XP, and clear daily quests for bonus rewards. Miss a day, lose the flame.",
    visual: `
      <div class="tv-streak">
        <span class="tv-flame-rings"><i></i><i></i></span>
        <span class="tv-flame">🔥</span>
        <strong class="tv-streak-count">12 DAY STREAK</strong>
        <span class="tv-quest"><i class="tv-check">✓</i> Daily quest cleared <b>+$25</b></span>
      </div>`
  },
  {
    id: "dashboard",
    kicker: "LIVE MARKETS",
    title: "Traders Dashboard",
    plan: { label: "PLAYER PLAN", cls: "cyan" },
    body: "A real-time market radar — live charts, movers, and headlines across futures, forex, and crypto. Watch real markets move while you train.",
    visual: `
      <div class="tv-tiles">
        ${[["NQ", "+0.8%", "up", "0,26 14,20 26,23 40,14 54,17 70,8"],
           ["GC", "+1.2%", "up", "0,22 14,24 26,16 40,19 54,10 70,6"],
           ["BTC", "-0.4%", "dn", "0,10 14,14 26,12 40,20 54,17 70,24"],
           ["EURUSD", "+0.2%", "up", "0,18 14,16 26,20 40,15 54,16 70,11"]]
          .map(([sym, pct, dir, pts], i) => `
        <div class="tv-tile t${i + 1}">
          <span class="tv-tile-sym">${sym}</span>
          <svg viewBox="0 0 70 30" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="${dir === "up" ? "var(--green)" : "var(--red)"}" stroke-width="2"/></svg>
          <b class="tv-tile-pct ${dir}">${pct}</b>
        </div>`).join("")}
      </div>`
  },
  {
    id: "toolkit",
    kicker: "ANALYZE",
    title: "Trader Toolkit",
    plan: { label: "COACH PLAN", cls: "blue" },
    body: "Pro-grade analysis tools — Weakness Radar, AI trade review, mistake journal, and risk calculators. Find your leaks before they cost you.",
    visual: `
      <div class="tv-radar">
        <svg viewBox="0 0 120 110" aria-hidden="true">
          <polygon points="60,8 112,45 92,102 28,102 8,45" fill="none" stroke="var(--line)" stroke-width="1"/>
          <polygon points="60,30 90,50 80,84 40,84 30,50" fill="none" stroke="var(--line)" stroke-width="1" opacity="0.6"/>
          <polygon class="tv-radar-shape" points="60,20 98,48 78,92 38,88 22,50" fill="rgba(70,166,255,0.22)" stroke="var(--blue)" stroke-width="2"/>
        </svg>
        <div class="tv-radar-tags">
          <span>Weakness Radar</span><span>AI Trade Review</span><span>Mistake Journal</span>
        </div>
      </div>`
  },
  {
    id: "elite",
    kicker: "COMMAND",
    title: "Elite Command Center",
    plan: { label: "ELITE PLAN", cls: "purple" },
    body: "Your personal HQ — discipline grades, weekly reports, a live watchlist, and AI desk tools. Everything about your trading in one command view.",
    visual: `
      <div class="tv-elite">
        <div class="tv-kpi k1"><span>DISCIPLINE</span><strong class="tv-grade">A</strong></div>
        <div class="tv-kpi k2"><span>WIN RATE</span><strong>64%</strong><b class="up">▲ +6%</b></div>
        <div class="tv-kpi k3"><span>WEEKLY XP</span><strong>1,240</strong><b class="up">▲ 2.1x</b></div>
        <span class="tv-elite-crown">👑</span>
      </div>`
  }
];

let tourIndex = 0;
let tourOnDone = null;

function tourRoot() {
  let root = document.getElementById("feature-tour");
  if (root) return root;
  root = document.createElement("div");
  root.id = "feature-tour";
  root.className = "feature-tour hidden";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="tour-backdrop"></div>
    <section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <header class="tour-head">
        <span class="tour-brand">✦ WELCOME TO REPLAYEDGE</span>
        <span class="tour-step" id="tour-step">1 / ${TOUR_SLIDES.length}</span>
        <button class="tour-skip" id="tour-skip" type="button">Skip tour ×</button>
      </header>
      <div class="tour-visual" id="tour-visual" aria-hidden="true"></div>
      <article class="tour-body">
        <div class="tour-kicker-row">
          <p class="tour-kicker" id="tour-kicker"></p>
          <span class="tour-plan" id="tour-plan"></span>
        </div>
        <h3 id="tour-title"></h3>
        <p class="tour-text" id="tour-text"></p>
      </article>
      <footer class="tour-controls">
        <button class="ghost-button tour-back" id="tour-back" type="button">Back</button>
        <div class="tour-dots" id="tour-dots"></div>
        <button class="primary-button tour-next" id="tour-next" type="button">Next</button>
      </footer>
    </section>`;
  document.body.appendChild(root);

  root.querySelector("#tour-skip").addEventListener("click", endFeatureTour);
  root.querySelector("#tour-back").addEventListener("click", () => tourGo(tourIndex - 1));
  root.querySelector("#tour-next").addEventListener("click", () => {
    if (tourIndex >= TOUR_SLIDES.length - 1) endFeatureTour();
    else tourGo(tourIndex + 1);
  });
  root.querySelector("#tour-dots").addEventListener("click", (event) => {
    const dot = event.target.closest("[data-tour-dot]");
    if (dot) tourGo(Number(dot.dataset.tourDot));
  });
  root.querySelector(".tour-backdrop").addEventListener("click", endFeatureTour);
  return root;
}

function tourGo(index) {
  tourIndex = Math.max(0, Math.min(TOUR_SLIDES.length - 1, index));
  const slide = TOUR_SLIDES[tourIndex];
  const root = tourRoot();
  const visual = root.querySelector("#tour-visual");
  const body = root.querySelector(".tour-body");

  visual.innerHTML = slide.visual;
  visual.dataset.scene = slide.id;
  root.querySelector("#tour-kicker").textContent = `// ${slide.kicker}`;
  root.querySelector("#tour-title").textContent = slide.title;
  root.querySelector("#tour-text").textContent = slide.body;
  const plan = root.querySelector("#tour-plan");
  plan.textContent = slide.plan.label;
  plan.className = `tour-plan ${slide.plan.cls}`;
  root.querySelector("#tour-step").textContent = `${tourIndex + 1} / ${TOUR_SLIDES.length}`;
  root.querySelector("#tour-dots").innerHTML = TOUR_SLIDES.map((s, i) =>
    `<button class="tour-dot ${i === tourIndex ? "active" : ""}" data-tour-dot="${i}" type="button" aria-label="Go to ${s.title}"></button>`
  ).join("");
  root.querySelector("#tour-back").style.visibility = tourIndex === 0 ? "hidden" : "visible";
  const next = root.querySelector("#tour-next");
  next.textContent = tourIndex === TOUR_SLIDES.length - 1 ? "Start training 🚀" : "Next";

  // restart the slide-in animation
  body.classList.remove("tour-slide-in");
  void body.offsetWidth;
  body.classList.add("tour-slide-in");
}

function tourKeys(event) {
  if (event.key === "ArrowRight") tourGo(tourIndex + 1);
  else if (event.key === "ArrowLeft") tourGo(tourIndex - 1);
  else if (event.key === "Escape") endFeatureTour();
}

window.startFeatureTour = function startFeatureTour(onDone) {
  tourOnDone = typeof onDone === "function" ? onDone : null;
  localStorage.setItem(TOUR_SEEN_KEY, "true");
  const root = tourRoot();
  tourGo(0);
  root.classList.remove("hidden");
  root.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", tourKeys);
};

window.endFeatureTour = function endFeatureTour() {
  const root = document.getElementById("feature-tour");
  if (root) {
    root.classList.add("hidden");
    root.setAttribute("aria-hidden", "true");
  }
  document.removeEventListener("keydown", tourKeys);
  const done = tourOnDone;
  tourOnDone = null;
  if (done) done();
};

/* Show once — call this after onboarding closes. Runs the
   follow-up immediately if the tour was already seen. */
window.maybeStartFeatureTour = function maybeStartFeatureTour(onDone) {
  if (localStorage.getItem(TOUR_SEEN_KEY)) {
    if (typeof onDone === "function") onDone();
    return;
  }
  startFeatureTour(onDone);
};

/* Replay triggers: ?tour=1 or #tour */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("tour") === "1" || window.location.hash === "#tour") {
    setTimeout(() => startFeatureTour(), 500);
  }
})();
