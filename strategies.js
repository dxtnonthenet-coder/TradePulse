/* ReplayEdge — Strategy Library
   For traders who don't have a strategy yet. Nine battle-tested playbooks
   organized by trader type, each with an annotated A+ WIN example and an
   honest LOSS example drawn on canvas — because every strategy loses, and
   knowing HOW yours loses is what keeps the account alive.
   Browsing is free; full setups: 2 free, rest with any plan. */

const STRAT_TYPES = [
  { id: "scalper", label: "Scalper", tag: "seconds–minutes" },
  { id: "day", label: "Day Trader", tag: "minutes–hours" },
  { id: "swing", label: "Swing", tag: "days–weeks" }
];

const STRATEGY_LIB = [
  {
    id: "orb", free: true, type: "scalper", emoji: "🚪", name: "Opening Range Breakout",
    tf: "1–5 min", markets: "Futures · Stocks", difficulty: "Beginner",
    idea: "The first 15–30 minutes of a session set the battlefield: the opening range. When price finally breaks out of it with conviction, the trapped side has to cover — and you ride that fuel.",
    rules: {
      entry: "Mark the session's first-15-minute high and low. Enter on a full candle CLOSE outside the range (not just a poke).",
      stop: "Just inside the opposite side of the range midpoint — if price re-enters deep, the breakout failed.",
      target: "1.5–2× the height of the opening range, or the prior session's high/low.",
      skip: "Skip if the range is huge (news day) or if a red-folder event lands within 30 minutes."
    },
    stats: { wr: "45–55%", rr: "1 : 1.8", freq: "1–2 / session" },
    win: {
      way: [[0, 100], [6, 100.4], [10, 99.7], [15, 100.1], [17, 100.9], [24, 101.8], [31, 101.4], [38, 102.6], [45, 102.9]],
      zone: [99.6, 100.5], entry: [17, 100.7], stop: 99.9, target: 102.4, exit: 38,
      caption: "Range respected for 15 bars → clean close above → retest holds → target in two pushes."
    },
    loss: {
      way: [[0, 100], [6, 100.4], [10, 99.7], [15, 100.1], [17, 100.8], [21, 100.9], [26, 99.9], [32, 99.6], [45, 99.4]],
      zone: [99.6, 100.5], entry: [17, 100.7], stop: 99.9, target: 102.4, exit: 27,
      lesson: "The break had no follow-through — one push, then straight back into the range. That re-entry IS the exit signal. A pro loses 1R here and shrugs; an amateur 'gives it room' and donates 3R."
    }
  },
  {
    id: "vwapscalp", free: false, type: "scalper", emoji: "🧲", name: "VWAP Bounce",
    tf: "1–5 min", markets: "Futures · Stocks", difficulty: "Beginner",
    idea: "VWAP is where the day's average dollar was paid — institutions defend it. In a trending session, the first orderly pullback to VWAP is the highest-quality entry of the day.",
    rules: {
      entry: "Uptrend above VWAP → wait for a pullback that TOUCHES VWAP and prints a rejection candle (long lower wick).",
      stop: "A few ticks below the rejection wick — if VWAP truly fails, you're out instantly.",
      target: "The high of the day, then trail. First test usually bounces; third test usually breaks.",
      skip: "Skip in chop (price weaving both sides of VWAP) — the magnet only works in trend."
    },
    stats: { wr: "55–62%", rr: "1 : 1.5", freq: "2–4 / session" },
    win: {
      way: [[0, 100], [8, 101.4], [14, 102.2], [20, 101.1], [23, 100.4], [26, 100.9], [34, 101.9], [45, 102.7]],
      hline: { p: 100.3, label: "VWAP" }, entry: [26, 100.6], stop: 100, target: 102.2, exit: 41,
      caption: "Trend up → pullback kisses VWAP → wick rejection → back to highs. Textbook."
    },
    loss: {
      way: [[0, 100], [8, 101.4], [14, 102.2], [20, 101], [24, 100.3], [28, 99.9], [34, 99.3], [45, 98.9]],
      hline: { p: 100.3, label: "VWAP" }, entry: [24, 100.5], stop: 99.9, target: 102, exit: 29,
      lesson: "No rejection wick — price sliced through VWAP like it wasn't there. That's the trend CHANGING, not pulling back. Entering without the confirmation candle turned a plan into a hope."
    }
  },
  {
    id: "sweep", free: false, type: "scalper", emoji: "🎣", name: "Liquidity Sweep Reversal",
    tf: "1–15 min", markets: "Futures · Forex · Crypto", difficulty: "Advanced",
    idea: "Stops cluster below obvious lows. Smart money pushes price through them, fills its size on the panic, then reverses. Your job: don't be the stop — be the entry after the sweep.",
    rules: {
      entry: "Obvious equal lows → price WICKS below them and closes back above within 1–2 candles → enter on the reclaim.",
      stop: "Below the sweep wick's low. If it goes back down there, it wasn't a sweep — it was a breakdown.",
      target: "The opposite side of the range (the liquidity above old highs).",
      skip: "Skip if price CLOSES below the lows on full-bodied candles — that's real selling, not a sweep."
    },
    stats: { wr: "40–50%", rr: "1 : 2.5", freq: "1–3 / day" },
    win: {
      way: [[0, 100.8], [8, 100.2], [14, 100.9], [20, 100.1], [23, 99.3], [25, 100.3], [33, 101.4], [45, 102.2]],
      zone: [99.9, 100.2], entry: [25, 100.3], stop: 99.1, target: 101.9, exit: 42,
      caption: "Equal lows swept in one wick → instant reclaim → runs to the range top. The panic was the fuel."
    },
    loss: {
      way: [[0, 100.8], [8, 100.2], [14, 100.9], [20, 100.1], [24, 99.3], [28, 99.5], [33, 98.7], [45, 98.2]],
      zone: [99.9, 100.2], entry: [26, 99.6], stop: 99.1, target: 101.5, exit: 33,
      lesson: "The 'reclaim' was weak — price never got back above the old lows before rolling over. Real sweeps reverse violently. If you have to squint to see the reclaim, it isn't one."
    }
  },
  {
    id: "breakretest", free: true, type: "day", emoji: "🧱", name: "Break & Retest",
    tf: "5–15 min", markets: "All markets", difficulty: "Beginner",
    idea: "The most reliable pattern in trading: resistance, once broken, becomes support. You skip the risky breakout candle and buy the polite return visit instead.",
    rules: {
      entry: "Level breaks with a strong close → WAIT. Enter only when price returns to the level and holds it (rejection candle).",
      stop: "Below the retest low — if the old ceiling can't act as a floor, the break failed.",
      target: "Measured move: the height of the pattern before the break, projected from the level.",
      skip: "Skip if the retest comes 20+ bars later or on huge momentum — the level goes stale."
    },
    stats: { wr: "50–58%", rr: "1 : 2", freq: "2–5 / week per market" },
    win: {
      way: [[0, 100], [8, 101.2], [14, 101.9], [16, 102.6], [20, 102.2], [24, 102.05], [28, 102.8], [38, 104], [45, 104.4]],
      hline: { p: 102, label: "BROKEN LEVEL" }, entry: [24, 102.15], stop: 101.4, target: 103.9, exit: 38,
      caption: "Clean break of 102 → pullback lands exactly on the old ceiling → holds → measured move pays."
    },
    loss: {
      way: [[0, 100], [8, 101.2], [14, 101.9], [16, 102.6], [20, 102.1], [25, 101.8], [30, 101.2], [38, 100.6], [45, 100.3]],
      hline: { p: 102, label: "BROKEN LEVEL" }, entry: [22, 102.1], stop: 101.4, target: 103.9, exit: 30,
      lesson: "The retest sliced straight through the level — no rejection, no hold. One close back below the line told you everything. Losing 1R on a failed retest is the COST of the 2R winners; skipping the stop is how accounts die."
    }
  },
  {
    id: "emapull", free: false, type: "day", emoji: "🌊", name: "Trend Pullback (20-EMA)",
    tf: "5–15 min", markets: "Futures · Stocks · Crypto", difficulty: "Beginner",
    idea: "Strong trends breathe: push, pull back to the 20-EMA, push again. You're not predicting anything — you're joining an established trend at its cheapest moment.",
    rules: {
      entry: "Price making higher highs above a rising 20-EMA → enter on the first touch of the EMA with a turn candle.",
      stop: "Below the pullback swing low. A real pullback holds above the prior one.",
      target: "The most recent high, then trail behind the EMA for the runner.",
      skip: "Skip the 3rd+ pullback of the same trend — trends die on the extension everyone finally trusts."
    },
    stats: { wr: "52–60%", rr: "1 : 1.8", freq: "3–6 / week per market" },
    win: {
      way: [[0, 100], [7, 101.3], [12, 100.9], [18, 102.3], [24, 103.1], [28, 102.4], [31, 102.9], [39, 104.3], [45, 104.9]],
      entry: [29, 102.6], stop: 101.9, target: 104.2, exit: 40,
      caption: "Two clean legs up → orderly dip into the rising EMA → turn candle → third leg pays."
    },
    loss: {
      way: [[0, 100], [7, 101.3], [12, 100.9], [18, 102.3], [24, 103.1], [29, 102.3], [34, 101.6], [40, 101], [45, 100.7]],
      entry: [29, 102.5], stop: 101.8, target: 104, exit: 35,
      lesson: "The pullback never turned — it accelerated. Third lower close in a row through the EMA means the trend is over, not resting. The stop saved you from riding a full reversal."
    }
  },
  {
    id: "fvg", free: false, type: "day", emoji: "🕳", name: "Fair Value Gap Fill",
    tf: "5–15 min", markets: "Futures · Forex", difficulty: "Advanced",
    idea: "When price explodes, it leaves a gap of untraded prices behind — a fair value gap. Price loves to return, fill part of that inefficiency, and THEN continue. You buy the discount inside the gap.",
    rules: {
      entry: "Strong impulse leaves a 3-candle gap → limit order at the gap's midpoint on the retrace.",
      stop: "Below the FULL gap — if the entire inefficiency fills and keeps going, the impulse is dead.",
      target: "The high that started the retrace, then the next liquidity pool above.",
      skip: "Skip gaps left by news candles and gaps against the higher-timeframe trend."
    },
    stats: { wr: "48–56%", rr: "1 : 2", freq: "2–4 / week per market" },
    win: {
      way: [[0, 100], [10, 100.4], [14, 100.7], [17, 102.8], [22, 102.4], [27, 101.8], [31, 102.5], [39, 103.9], [45, 104.6]],
      zone: [101.2, 102.3], entry: [27, 101.85], stop: 101, target: 103.6, exit: 40,
      caption: "Impulse leaves the gap → retrace fills half of it → buyers defend → continuation through the highs."
    },
    loss: {
      way: [[0, 100], [10, 100.4], [14, 100.7], [17, 102.8], [23, 102.2], [28, 101.5], [33, 100.8], [40, 100.2], [45, 100]],
      zone: [101.2, 102.3], entry: [28, 101.6], stop: 100.9, target: 103.4, exit: 34,
      lesson: "The gap filled COMPLETELY and price kept bleeding — the impulse had no real buyers behind it. When the whole inefficiency fills, the story changed. Take the 1R and wait for the next impulse."
    }
  },
  {
    id: "rangeswing", free: false, type: "swing", emoji: "🏓", name: "Range Rotation",
    tf: "4H – Daily", markets: "All markets", difficulty: "Beginner",
    idea: "Markets trend maybe 30% of the time — the rest is a box. Instead of getting chopped up, trade the box: buy the floor, sell the ceiling, repeat until it breaks.",
    rules: {
      entry: "Two clean touches each of support and resistance define the range → buy the 3rd touch of support with a rejection.",
      stop: "One range-height × 0.25 below support. Ranges end violently — be gone before that.",
      target: "The middle of the range for half, the ceiling for the rest.",
      skip: "Skip after the range has rotated 4+ times, and skip ranges tighter than 2× your spread/commission."
    },
    stats: { wr: "55–65%", rr: "1 : 1.5", freq: "1–3 / month per market" },
    win: {
      way: [[0, 102], [6, 100.4], [12, 103.6], [19, 100.5], [26, 103.5], [31, 100.5], [37, 102.4], [45, 103.4]],
      zone: [100.2, 100.7], entry: [31, 100.6], stop: 99.5, target: 103.2, exit: 44,
      caption: "Floor defended three times → third touch bought with the wick → rotation back to the ceiling."
    },
    loss: {
      way: [[0, 102], [6, 100.4], [12, 103.6], [19, 100.5], [26, 103.4], [32, 100.4], [37, 99.6], [42, 98.8], [45, 98.5]],
      zone: [100.2, 100.7], entry: [31, 100.6], stop: 99.5, target: 103.2, exit: 38,
      lesson: "The third touch didn't bounce — it hesitated, then broke. Ranges end exactly like this, which is why the stop lives CLOSE below the floor. One clean 1R loss versus riding a breakdown to the basement."
    }
  },
  {
    id: "basebreak", free: false, type: "swing", emoji: "🧨", name: "Base Breakout & Hold",
    tf: "Daily", markets: "Stocks · Crypto", difficulty: "Intermediate",
    idea: "Long, boring, tight bases are springs being compressed. When price finally breaks out on volume and HOLDS the level for days, the move that follows tends to be the year's best trend.",
    rules: {
      entry: "4+ weeks of tight sideways base → daily close above base high → enter on the first hold day (no re-entry into base).",
      stop: "Back inside the middle of the base. A real breakout should never see that price again.",
      target: "Base height projected upward; trail the rest — these runs go further than feels reasonable.",
      skip: "Skip breakouts on shrinking volume and breakouts into major macro events."
    },
    stats: { wr: "40–48%", rr: "1 : 3+", freq: "1–2 / month" },
    win: {
      way: [[0, 100], [8, 100.5], [16, 99.8], [24, 100.4], [28, 101.3], [32, 101.1], [37, 102.6], [42, 103.8], [45, 104.5]],
      zone: [99.6, 100.7], entry: [30, 101.2], stop: 100.1, target: 103.6, exit: 42,
      caption: "Six weeks of compression → break → three quiet hold days above the base → then the spring releases."
    },
    loss: {
      way: [[0, 100], [8, 100.5], [16, 99.8], [24, 100.4], [28, 101.2], [33, 100.4], [38, 99.9], [43, 99.4], [45, 99.2]],
      zone: [99.6, 100.7], entry: [30, 101.1], stop: 100.1, target: 103.5, exit: 34,
      lesson: "It broke out and fell straight back into the base — the classic fakeout. That first close back inside is non-negotiable: out. Winners never look back; the ones that do usually keep falling."
    }
  },
  {
    id: "goldencross", free: false, type: "swing", emoji: "✨", name: "Golden Cross Trend Ride",
    tf: "Daily – Weekly", markets: "Stocks · Crypto · Indices", difficulty: "Beginner",
    idea: "When the 50-day average crosses above the 200-day, a downtrend has mathematically ended. It's late by design — you sacrifice the bottom to trade only confirmed, durable trends.",
    rules: {
      entry: "50MA crosses above 200MA → enter on the first pullback toward the 50MA after the cross.",
      stop: "Below the most recent swing low under the 50MA.",
      target: "None fixed — trail under the 50MA and let the trend decide. These trades last months.",
      skip: "Skip crosses inside a huge sideways mess (whipsaw city) — you want a clear prior downtrend that's turning."
    },
    stats: { wr: "45–55%", rr: "1 : 3+", freq: "a few / year" },
    win: {
      way: [[0, 102], [7, 100.3], [13, 99.5], [19, 100.2], [24, 101], [28, 100.5], [33, 101.8], [40, 103.6], [45, 104.8]],
      entry: [28, 100.7], stop: 99.7, target: 104, exit: 43,
      caption: "Downtrend flattens → cross confirms → first dip after the cross is the entry → months of trend follow."
    },
    loss: {
      way: [[0, 102], [7, 100.3], [13, 99.5], [19, 100.2], [24, 101], [29, 100.2], [34, 99.8], [40, 99.4], [45, 99.2]],
      entry: [28, 100.6], stop: 99.7, target: 103.8, exit: 36,
      lesson: "A whipsaw: the cross happened inside chop, not after a real trend change. Price rolled straight back under both averages. This strategy's losses are small and boring — its whole edge lives in the rare monster winners."
    }
  }
];

/* ---------- seeded chart renderer ---------- */

function stratRng(seedStr) {
  let s = 0;
  for (let i = 0; i < seedStr.length; i += 1) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function stratSeries(spec, seedStr) {
  const N = 46;
  const rng = stratRng(seedStr);
  const points = new Array(N);
  const way = spec.way;
  for (let i = 0; i < N; i += 1) {
    let a = way[0], b = way[way.length - 1];
    for (let w = 0; w < way.length - 1; w += 1) {
      if (i >= way[w][0] && i <= way[w + 1][0]) { a = way[w]; b = way[w + 1]; break; }
    }
    const t = b[0] === a[0] ? 0 : (i - a[0]) / (b[0] - a[0]);
    points[i] = a[1] + (b[1] - a[1]) * t + (rng() - 0.5) * 0.22;
  }
  const bars = [];
  for (let i = 0; i < N; i += 1) {
    const o = i === 0 ? points[0] : bars[i - 1].c;
    const c = points[i];
    bars.push({ o, c, h: Math.max(o, c) + rng() * 0.18, l: Math.min(o, c) - rng() * 0.18 });
  }
  return bars;
}

function stratDraw(canvas, spec, mode, seedStr, opts = {}) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const padR = 86, padT = 18, padB = 14;
  ctx.clearRect(0, 0, W, H);
  const bars = stratSeries(spec, seedStr + mode);
  const visible = opts.visible == null ? bars.length : opts.visible;
  const levels = [spec.stop, spec.target, spec.hline?.p, ...(spec.zone || [])].filter((v) => v !== undefined);
  const lo = Math.min(...bars.map((b) => b.l), ...levels) - 0.15;
  const hi = Math.max(...bars.map((b) => b.h), ...levels) + 0.15;
  const bw = (W - padR) / bars.length;
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);

  // zone
  if (spec.zone) {
    ctx.fillStyle = "rgba(88,199,255,0.10)";
    ctx.fillRect(0, y(spec.zone[1]), W - padR, y(spec.zone[0]) - y(spec.zone[1]));
    ctx.strokeStyle = "rgba(88,199,255,0.35)";
    ctx.setLineDash([4, 5]); ctx.lineWidth = 1;
    ctx.strokeRect(0.5, y(spec.zone[1]), W - padR - 1, y(spec.zone[0]) - y(spec.zone[1]));
    ctx.setLineDash([]);
  }
  // hline (VWAP / level)
  if (spec.hline) {
    ctx.strokeStyle = "rgba(246,195,78,0.7)"; ctx.setLineDash([7, 5]); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, y(spec.hline.p)); ctx.lineTo(W - padR, y(spec.hline.p)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#f6c34e"; ctx.font = "700 11px Arial";
    ctx.fillText(spec.hline.label, 6, y(spec.hline.p) - 5);
  }
  // candles
  bars.forEach((bar, i) => {
    if (i >= visible) return;
    const x = i * bw + bw / 2;
    const up = bar.c >= bar.o;
    ctx.strokeStyle = up ? "#4dffab" : "#ff5f57";
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x, y(bar.h)); ctx.lineTo(x, y(bar.l)); ctx.stroke();
    ctx.fillStyle = up ? "#4dffab" : "#ff5f57";
    ctx.fillRect(x - bw * 0.28, y(Math.max(bar.o, bar.c)), bw * 0.56, Math.max(1.6, Math.abs(y(bar.o) - y(bar.c))));
  });
  // stop + target lines with right-side labels
  const line = (price, color, label) => {
    ctx.strokeStyle = color; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, y(price)); ctx.lineTo(W - padR, y(price)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = color; ctx.font = "800 11px Arial"; ctx.textAlign = "left";
    ctx.fillText(label, W - padR + 6, y(price) + 4);
  };
  const showEntry = !opts.hideMarkers && (visible >= bars.length || visible > spec.entry[0]);
  const showExit = !opts.hideMarkers && (visible >= bars.length || visible > spec.exit);
  if (showEntry) {
    line(spec.target, "#4dffab", "TARGET");
    line(spec.stop, "#ff5f57", "STOP");
    // entry marker
    const ex = spec.entry[0] * bw + bw / 2;
    ctx.fillStyle = "#f6c34e";
    ctx.beginPath();
    ctx.moveTo(ex, y(spec.entry[1]) + 16); ctx.lineTo(ex - 7, y(spec.entry[1]) + 27); ctx.lineTo(ex + 7, y(spec.entry[1]) + 27);
    ctx.closePath(); ctx.fill();
    ctx.font = "800 11px Arial"; ctx.textAlign = "center";
    ctx.fillText("ENTRY", ex, y(spec.entry[1]) + 40);
  }
  if (showExit) {
    // exit marker
    const xx = spec.exit * bw + bw / 2;
    const exitPrice = mode === "win" ? spec.target : spec.stop;
    ctx.fillStyle = mode === "win" ? "#4dffab" : "#ff5f57";
    ctx.beginPath(); ctx.arc(xx, y(exitPrice), 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#06120c"; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(mode === "win" ? "TARGET HIT" : "STOPPED −1R", xx, y(exitPrice) - 10);
  }
  ctx.textAlign = "left";
}

/* ---------- views ---------- */

const stratState = { filter: "all", open: null };

function stratUnlocked(strategy) {
  return strategy.free || (typeof hasAccess === "function" && hasAccess("strategies"));
}

function renderStrategies() {
  const root = document.getElementById("strategies-root");
  if (!root) return;
  if (stratState.open) { stratRenderDetail(root, stratState.open); return; }

  const shown = STRATEGY_LIB.filter((s) => stratState.filter === "all" || s.type === stratState.filter);
  root.innerHTML = `
    <div class="st-head">
      <div>
        <p class="arcade-kicker">// STRATEGY LIBRARY</p>
        <h2>No strategy? Pick one. <span class="ds-green">Learn to spot it live.</span></h2>
        <p class="arcade-sub">Nine proven playbooks by trader type. Each one shows you the annotated A+ winner, the honest loss, and then drops you into the <b>Setup Hunter</b> — a live chart that plays out and makes you call it: real setup, or trap? Spot the winners, dodge the false signals.</p>
      </div>
    </div>
    <div class="st-filters">
      <button class="st-filter ${stratState.filter === "all" ? "active" : ""}" type="button" data-st-filter="all">All</button>
      ${STRAT_TYPES.map((type) => `<button class="st-filter ${stratState.filter === type.id ? "active" : ""}" type="button" data-st-filter="${type.id}">${type.label} <small>${type.tag}</small></button>`).join("")}
    </div>
    <div class="st-grid">
      ${shown.map((s) => {
        const locked = !stratUnlocked(s);
        return `
        <button class="st-card ${locked ? "locked" : ""}" type="button" data-st-open="${s.id}">
          <div class="st-card-top"><span class="st-emoji">${s.emoji}</span><span class="st-type ${s.type}">${STRAT_TYPES.find((t) => t.id === s.type).label}</span>${s.free ? `<span class="st-free">FREE</span>` : locked ? `<span class="st-lockchip">🔒</span>` : ""}</div>
          <h3>${s.name}</h3>
          <p>${s.idea.slice(0, 92)}…</p>
          <div class="st-chips"><span>${s.tf}</span><span>WR ${s.stats.wr}</span><span>${s.stats.rr}</span><span>${s.difficulty}</span></div>
          <em>${locked ? "Unlock with any plan →" : "Learn it + hunt setups live →"}</em>
        </button>`;
      }).join("")}
    </div>
    <p class="fp-foot">Educational playbooks with illustrative charts — not signals, recommendations, or financial advice.</p>
  `;
  root.querySelectorAll("[data-st-filter]").forEach((button) => {
    button.addEventListener("click", () => { stratState.filter = button.dataset.stFilter; renderStrategies(); });
  });
  root.querySelectorAll("[data-st-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const strategy = STRATEGY_LIB.find((s) => s.id === button.dataset.stOpen);
      if (!stratUnlocked(strategy)) { openUpgradeModal("strategies"); return; }
      stratState.open = strategy.id;
      renderStrategies();
      window.scrollTo(0, 0);
    });
  });
}

function stratRenderDetail(root, id) {
  const s = STRATEGY_LIB.find((item) => item.id === id);
  if (!s || !stratUnlocked(s)) { stratState.open = null; renderStrategies(); return; }
  const trapTell = (s.loss.lesson.split(". ")[0] || s.loss.lesson).replace(/\.$/, "") + ".";
  root.innerHTML = `
    <button class="arcade-btn ghost st-back" type="button" id="st-back">← All strategies</button>
    <div class="st-detail-head">
      <span class="st-emoji big">${s.emoji}</span>
      <div>
        <h2>${s.name}</h2>
        <div class="st-chips"><span class="st-type ${s.type}">${STRAT_TYPES.find((t) => t.id === s.type).label}</span><span>${s.tf}</span><span>${s.markets}</span><span>${s.difficulty}</span></div>
      </div>
    </div>
    <p class="st-idea">${s.idea}</p>

    <div class="st-hunt-banner">
      <div class="st-hunt-copy">
        <span class="st-hunt-eyebrow">🎯 THE MAIN EVENT</span>
        <b>Hunt live ${s.name} setups</b>
        <p>A chart plays out in real time. When a setup forms, you make the call — is it the <b>real thing</b> to take, or a <b>trap</b> to skip? Real setups pay in R; false signals cost you, just like the market. Graded live.</p>
      </div>
      <button class="primary-button st-hunt-go" type="button" id="st-hunt">▶ Start Setup Hunter</button>
    </div>

    <div class="st-rules">
      <div><b>📍 ENTRY</b><p>${s.rules.entry}</p></div>
      <div><b>🛑 STOP</b><p>${s.rules.stop}</p></div>
      <div><b>🎯 TARGET</b><p>${s.rules.target}</p></div>
      <div><b>⏭ SKIP IF</b><p>${s.rules.skip}</p></div>
    </div>
    <div class="st-expect">
      <div><span>TYPICAL WIN RATE</span><b>${s.stats.wr}</b></div>
      <div><span>REWARD : RISK</span><b>${s.stats.rr}</b></div>
      <div><span>FREQUENCY</span><b>${s.stats.freq}</b></div>
    </div>
    <div class="st-example win">
      <div class="st-example-head"><b>✅ THE A+ SETUP</b><button class="st-play" type="button" id="st-play-win">▶ Watch it form live</button></div>
      <canvas id="st-win" width="720" height="270"></canvas>
      <p class="st-caption">${s.win.caption}</p>
    </div>
    <div class="st-example loss">
      <div class="st-example-head"><b>❌ WHEN IT LOSES</b><button class="st-play" type="button" id="st-play-loss">▶ Watch the trap</button></div>
      <canvas id="st-loss" width="720" height="270"></canvas>
      <p class="st-caption lesson">${s.loss.lesson}</p>
    </div>

    <div class="st-tell">
      <div class="st-tell-col real"><span>✅ THE TELL THAT CONFIRMS IT</span><p>${s.win.caption}</p></div>
      <div class="st-tell-col trap"><span>⚠️ THE TRAP THAT FAKES IT</span><p>${trapTell}</p></div>
    </div>

    <div class="st-ctas">
      <button class="primary-button" type="button" id="st-hunt2">🎯 Practice in the Setup Hunter</button>
      <button class="arcade-btn ghost" type="button" id="st-journal">📓 Add to my Playbook</button>
    </div>
    <p class="fp-foot">Charts are illustrative recreations of the pattern — not real quotes, signals, or advice.</p>
  `;
  stratDraw(root.querySelector("#st-win"), s.win, "win", s.id);
  stratDraw(root.querySelector("#st-loss"), s.loss, "loss", s.id);
  root.querySelector("#st-back").addEventListener("click", () => { stratState.open = null; renderStrategies(); });
  root.querySelector("#st-play-win").addEventListener("click", (e) => stratAnimate(root.querySelector("#st-win"), s.win, "win", s.id, e.currentTarget));
  root.querySelector("#st-play-loss").addEventListener("click", (e) => stratAnimate(root.querySelector("#st-loss"), s.loss, "loss", s.id, e.currentTarget));
  root.querySelector("#st-hunt").addEventListener("click", () => stratLaunchHunter(s));
  root.querySelector("#st-hunt2").addEventListener("click", () => stratLaunchHunter(s));
  root.querySelector("#st-journal").addEventListener("click", () => {
    if (typeof hasAccess === "function" && !hasAccess("playbook")) { openUpgradeModal("playbook"); return; }
    const setups = typeof toolkitPlaybook === "function" ? toolkitPlaybook() : null;
    if (!setups) return;
    if (setups.some((setup) => setup.name === s.name)) { showToast("Already in your playbook.", "info"); return; }
    if (setups.length >= 12) { showToast("Playbook is full (12) — remove one first.", "warning"); return; }
    setups.push({ id: `pb_${Date.now()}`, name: s.name, market: "", trigger: s.rules.entry.slice(0, 90), invalid: s.rules.stop.slice(0, 90), targetR: 2 });
    saveProgress();
    showToast(`"${s.name}" added to your Trading Playbook. 📖`, "success");
  });
}

/* ---------- animated "watch it form" (still chart, played live) ---------- */

function stratAnimate(canvas, spec, mode, seedStr, btn) {
  if (!canvas) return;
  if (canvas._stratTimer) { clearTimeout(canvas._stratTimer); canvas._stratTimer = null; }
  const total = 46;
  let visible = Math.max(6, spec.entry[0] - 12);
  if (btn) { btn.dataset.label = btn.dataset.label || btn.textContent; btn.textContent = "● Playing…"; btn.disabled = true; }
  const step = () => {
    stratDraw(canvas, spec, mode, seedStr, { visible });
    if (visible >= total) {
      canvas._stratTimer = null;
      if (btn) { btn.textContent = "↻ Replay it"; btn.disabled = false; }
      return;
    }
    // slow down through the decisive bars around entry/exit so the eye catches them
    const near = Math.abs(visible - spec.entry[0]) < 3 || Math.abs(visible - spec.exit) < 3;
    visible += 1;
    canvas._stratTimer = setTimeout(step, near ? 150 : 62);
  };
  step();
}

/* ============================================================
   SETUP HUNTER — a live chart that plays out and makes the user
   call each opportunity: real setup (take it) or false signal
   (skip it). Renders into the Chart Replay view.
   ============================================================ */

const stratHunter = {
  active: null, rounds: [], i: 0, phase: "play", vis: 0, timer: null, taken: null,
  score: { r: 0, correct: 0, spotted: 0, avoided: 0 }
};

function stratHunterBuild(s) {
  // 5 opportunities: real A+ setups and look-alike traps, shuffled and
  // seed-varied so every session reads differently.
  const kinds = ["real", "trap", "real", "trap", "real"];
  for (let i = kinds.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  const base = Date.now();
  return kinds.map((kind, idx) => {
    const spec = kind === "real" ? s.win : s.loss;
    const rMult = Math.round((Math.abs(spec.target - spec.entry[1]) / Math.max(0.05, Math.abs(spec.entry[1] - spec.stop))) * 10) / 10;
    return { kind, spec, mode: kind === "real" ? "win" : "loss", seedStr: `${s.id}-${idx}-${base}`, entry: spec.entry[0], exit: spec.exit, rMult };
  });
}

function stratLaunchHunter(s) {
  if (!stratUnlocked(s)) { openUpgradeModal("strategies"); return; }
  stratHunter.active = s;
  stratHunter.rounds = stratHunterBuild(s);
  stratHunter.i = 0;
  stratHunter.score = { r: 0, correct: 0, spotted: 0, avoided: 0 };
  if (typeof navigateTo === "function") navigateTo("replay");
  else stratHunterRender();
}

function stratHunterStop() {
  if (stratHunter.timer) { clearTimeout(stratHunter.timer); stratHunter.timer = null; }
}

function stratHunterExit() {
  stratHunterStop();
  stratHunter.active = null;
  if (stratState.open) { navigateTo("strategies"); return; }
  renderReplay();
}

function stratHunterAlive() {
  return stratHunter.active && (typeof state === "undefined" || state.currentView === "replay");
}

function stratHunterRender() {
  const root = document.getElementById("replay-root");
  if (!root) return;
  stratHunterStop();
  if (stratHunter.i >= stratHunter.rounds.length) { stratHunterScorecard(root); return; }
  const round = stratHunter.rounds[stratHunter.i];
  stratHunter.phase = "play";
  stratHunter.taken = null;
  stratHunter.vis = Math.max(6, round.entry - 16);
  stratHunterFrame();
  stratHunter.timer = setTimeout(stratHunterPlayStep, 420);
}

function stratHunterFrame() {
  const root = document.getElementById("replay-root");
  if (!root) return;
  const s = stratHunter.active;
  const sc = stratHunter.score;
  const done = stratHunter.i + (stratHunter.phase === "reveal" ? 1 : 0);
  root.innerHTML = `
    <div class="sth">
      <div class="sth-top">
        <div>
          <p class="arcade-kicker">// SETUP HUNTER · <span class="ds-green">${s.name}</span></p>
          <h2>Setup ${stratHunter.i + 1}<small>/${stratHunter.rounds.length}</small></h2>
        </div>
        <div class="sth-score">
          <div><span>SCORE</span><b class="${sc.r >= 0 ? "up" : "down"}">${sc.r >= 0 ? "+" : ""}${sc.r.toFixed(1)}R</b></div>
          <div><span>RIGHT CALLS</span><b>${sc.correct}<small>/${done}</small></b></div>
        </div>
      </div>
      <canvas id="sth-canvas" width="920" height="360"></canvas>
      <div class="sth-coach" id="sth-coach"></div>
      <div class="sth-action" id="sth-action"></div>
      <button class="arcade-btn ghost sth-exit" type="button" id="sth-exit">✕ Exit hunter</button>
    </div>`;
  root.querySelector("#sth-exit").addEventListener("click", stratHunterExit);
  stratHunterPaint();
  stratHunterPhaseUi();
}

function stratHunterPaint() {
  const canvas = document.getElementById("sth-canvas");
  if (!canvas) return;
  const round = stratHunter.rounds[stratHunter.i];
  stratDraw(canvas, round.spec, round.mode, round.seedStr, {
    visible: stratHunter.vis,
    hideMarkers: stratHunter.phase !== "reveal"
  });
}

function stratHunterPlayStep() {
  if (!stratHunterAlive()) { stratHunterStop(); return; }
  const round = stratHunter.rounds[stratHunter.i];
  if (stratHunter.vis >= round.entry) {
    // trigger bar is printing — freeze and make them call it
    stratHunter.vis = round.entry + 1;
    stratHunter.phase = "decide";
    stratHunterFrame();
    return;
  }
  stratHunter.vis += 1;
  stratHunterPaint();
  stratHunterPhaseUi();
  stratHunter.timer = setTimeout(stratHunterPlayStep, 300);
}

function stratHunterPhaseUi() {
  const coach = document.getElementById("sth-coach");
  const action = document.getElementById("sth-action");
  if (!coach || !action) return;
  const s = stratHunter.active;
  const round = stratHunter.rounds[stratHunter.i];
  if (stratHunter.phase === "play") {
    const forming = stratHunter.vis >= round.entry - 6;
    coach.className = "sth-coach" + (forming ? " warn" : "");
    coach.innerHTML = forming
      ? `⚑ <b>Something's forming.</b> Get ready — is this a real ${s.name} setup, or a trap?`
      : `🔍 Reading the tape… watching for a ${s.name} trigger.`;
    action.innerHTML = `<span class="sth-hint">Chart is playing live…</span>`;
  } else if (stratHunter.phase === "decide") {
    coach.className = "sth-coach decide";
    coach.innerHTML = `⚑ <b>Your call.</b> The trigger is: <i>${s.rules.entry}</i> — is it really there?`;
    action.innerHTML = `
      <button class="sth-btn take" type="button" id="sth-take">✅ TAKE IT</button>
      <button class="sth-btn skip" type="button" id="sth-skip">⏭ SKIP IT</button>`;
    action.querySelector("#sth-take").addEventListener("click", () => stratHunterDecide(true));
    action.querySelector("#sth-skip").addEventListener("click", () => stratHunterDecide(false));
  } else if (stratHunter.phase === "reveal") {
    const isReal = round.kind === "real";
    const take = stratHunter.taken;
    const correct = (isReal && take) || (!isReal && !take);
    let msg;
    if (isReal && take) msg = `✅ <b>Nailed it.</b> Real ${s.name} — it held the trigger and ran to target. <b class="up">+${round.rMult}R</b>. ${round.spec.caption}`;
    else if (isReal && !take) msg = `🟡 <b>That was the real one.</b> You skipped a clean <b class="up">+${round.rMult}R</b> A+ setup. Missing winners is how you stay flat. ${round.spec.caption}`;
    else if (!isReal && take) msg = `❌ <b>Trap.</b> It looked like the setup, but the trigger never truly confirmed — <b class="down">−1R</b>. ${round.spec.lesson}`;
    else msg = `✅ <b>Great skip.</b> That was a false signal — taking it costs <b class="down">−1R</b>. Skipping traps IS the edge. ${round.spec.lesson}`;
    coach.className = "sth-coach " + (correct ? "good" : "bad");
    coach.innerHTML = msg;
    const last = stratHunter.i >= stratHunter.rounds.length - 1;
    action.innerHTML = `<button class="sth-btn next" type="button" id="sth-next">${last ? "See results →" : "Next setup →"}</button>`;
    action.querySelector("#sth-next").addEventListener("click", () => { stratHunter.i += 1; stratHunterRender(); });
  }
}

function stratHunterDecide(take) {
  stratHunterStop();
  const round = stratHunter.rounds[stratHunter.i];
  const isReal = round.kind === "real";
  const correct = (isReal && take) || (!isReal && !take);
  const sc = stratHunter.score;
  if (correct) sc.correct += 1;
  if (isReal && take) { sc.r += round.rMult; sc.spotted += 1; }
  else if (!isReal && take) { sc.r -= 1; }
  else if (!isReal && !take) { sc.avoided += 1; }
  sc.r = Math.round(sc.r * 10) / 10;
  stratHunter.taken = take;
  stratHunter.phase = "reveal";
  if (typeof arcadeSound === "function") arcadeSound(correct ? "win" : "flip");
  stratHunterFrame();
  stratHunterRevealAnim();
}

function stratHunterRevealAnim() {
  if (!stratHunterAlive()) { stratHunterStop(); return; }
  const round = stratHunter.rounds[stratHunter.i];
  const end = Math.min(46, round.exit + 3);
  if (stratHunter.vis >= end) { stratHunterStop(); return; }
  stratHunter.vis += 1;
  stratHunterPaint();
  stratHunter.timer = setTimeout(stratHunterRevealAnim, 95);
}

function stratHunterScorecard(root) {
  const s = stratHunter.active;
  const sc = stratHunter.score;
  const total = stratHunter.rounds.length;
  const acc = Math.round((sc.correct / total) * 100);
  const grade = acc >= 90 ? "A" : acc >= 70 ? "B" : acc >= 50 ? "C" : acc >= 30 ? "D" : "F";
  const p = typeof progress === "function" ? progress() : null;
  const xp = Math.max(12, sc.correct * 9 + Math.max(0, Math.round(sc.r)) * 6);
  if (p) {
    p.xp = (p.xp || 0) + xp;
    if (typeof dailyBump === "function") dailyBump("runs");
    if (typeof saveProgress === "function") saveProgress();
    if (typeof updateProgressUi === "function") updateProgressUi();
  }
  const verdict = acc >= 70
    ? "That's a hunter's eye — you're taking winners and dodging traps."
    : acc >= 50
      ? "Getting there. The tells are starting to click — run it again."
      : "The traps got you. Study the tell vs the trap, then hunt again.";
  root.innerHTML = `
    <div class="sth sth-done">
      <p class="arcade-kicker">// HUNT COMPLETE · <span class="ds-green">${s.name}</span></p>
      <div class="sth-summary">
        <div class="ai-grade grade-${grade}">${grade}</div>
        <div>
          <h2>${acc}% correct · <span class="${sc.r >= 0 ? "up" : "down"}">${sc.r >= 0 ? "+" : ""}${sc.r.toFixed(1)}R</span></h2>
          <p class="arcade-sub">${verdict} · +${xp} XP</p>
        </div>
      </div>
      <div class="sth-stats">
        <div><span>A+ SETUPS TAKEN</span><b>${sc.spotted}</b></div>
        <div><span>TRAPS AVOIDED</span><b>${sc.avoided}</b></div>
        <div><span>RIGHT CALLS</span><b>${sc.correct}/${total}</b></div>
        <div><span>NET R</span><b class="${sc.r >= 0 ? "up" : "down"}">${sc.r >= 0 ? "+" : ""}${sc.r.toFixed(1)}</b></div>
      </div>
      <div class="sth-done-ctas">
        <button class="primary-button" type="button" id="sth-again">🎯 Hunt again</button>
        <button class="arcade-btn ghost" type="button" id="sth-strat">← Back to strategy</button>
        <button class="arcade-btn ghost" type="button" id="sth-free">Free Chart Replay →</button>
      </div>
    </div>`;
  root.querySelector("#sth-again").addEventListener("click", () => stratLaunchHunter(s));
  root.querySelector("#sth-strat").addEventListener("click", () => { stratHunter.active = null; stratState.open = s.id; navigateTo("strategies"); });
  root.querySelector("#sth-free").addEventListener("click", () => { stratHunter.active = null; renderReplay(); });
}

/* ---------- route the Setup Hunter through the Chart Replay view ---------- */

if (typeof renderReplay === "function") {
  const _stratReplayBase = renderReplay;
  renderReplay = function () {
    if (stratHunter.active) { stratHunterRender(); return; }
    return _stratReplayBase.apply(this, arguments);
  };
  window.renderReplay = renderReplay;
}
