/* ReplayEdge — Chart Replay Trainer (Player+)
   The signature feature: a real historical chart, revealed bar by bar.
   Trade it blind — long, short, flat — and get graded in R multiples.
   Uses the existing /api/market/chart proxy; falls back to a seeded
   synthetic series so the desk always works. */

const REPLAY_PRESETS = [
  { sym: "NQ=F", label: "Nasdaq futures", ticker: "NQ", name: "Nasdaq 100", cat: "futures" },
  { sym: "ES=F", label: "S&P futures", ticker: "ES", name: "S&P 500", cat: "futures" },
  { sym: "BTC-USD", label: "Bitcoin", ticker: "BTC", name: "Bitcoin", cat: "crypto" },
  { sym: "EURUSD=X", label: "Euro / USD", ticker: "EUR", name: "Euro / USD", cat: "forex" },
  { sym: "AAPL", label: "Apple", ticker: "AAPL", name: "Apple", cat: "stocks" },
  { sym: "TSLA", label: "Tesla", ticker: "TSLA", name: "Tesla", cat: "stocks" }
];

const replayState = {
  bars: [], index: 0, symbol: "", blind: true,
  position: null, trades: [], auto: null, running: false
};

function replayData() {
  const p = progress();
  if (!p.replay || typeof p.replay !== "object") p.replay = { sessions: 0, totalR: 0, bestR: 0, trades: 0, wins: 0 };
  return p.replay;
}

/* ---------- data ---------- */

async function replayFetchBars(symbol) {
  try {
    const response = await fetch(`/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=1y&interval=1d`);
    const json = await response.json();
    const bars = (json.bars || []).filter((bar) => bar.c > 0 && bar.l > 0);
    if (!json.ok || bars.length < 90) throw new Error("thin data");
    // random contiguous window of ~130 bars so replays differ every time
    const size = Math.min(130, bars.length);
    const start = Math.floor(Math.random() * Math.max(1, bars.length - size));
    return bars.slice(start, start + size);
  } catch {
    // seeded synthetic fallback — the desk must always work
    const rng = (() => { let s = Date.now() >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
    let price = 100, drift = 0;
    return [...Array(130)].map(() => {
      if (rng() < 0.1) drift = (rng() - 0.5) * 0.4;
      const vol = 0.4 + rng() * 0.7;
      const o = price;
      const c = o + drift + (rng() - 0.5) * vol * 2;
      price = c;
      return { o, h: Math.max(o, c) + rng() * vol * 0.5, l: Math.min(o, c) - rng() * vol * 0.5, c };
    });
  }
}

function replayAtr(index, period = 14) {
  const from = Math.max(1, index - period);
  let sum = 0, n = 0;
  for (let i = from; i < index; i += 1) {
    const bar = replayState.bars[i], prev = replayState.bars[i - 1];
    sum += Math.max(bar.h - bar.l, Math.abs(bar.h - prev.c), Math.abs(bar.l - prev.c));
    n += 1;
  }
  return n ? sum / n : 1;
}

/* ---------- render ---------- */

function renderReplay() {
  const root = document.getElementById("replay-root");
  if (!root) return;

  if (!hasAccess("replay")) {
    root.innerHTML = `
      <div class="elite-locked">
        <p class="arcade-kicker">// CHART REPLAY TRAINER</p>
        <h2>Trade the past. Keep the lesson.</h2>
        <p class="elite-locked-sub">Real historical charts revealed one candle at a time — you trade them blind:</p>
        <div class="elite-locked-grid">
          <div>⏪ <b>Real market history</b><span>Futures, crypto, forex, and stocks — a fresh random window every session</span></div>
          <div>🕶 <b>Blind mode</b><span>No symbol, no dates — just price action and your read</span></div>
          <div>📏 <b>Graded in R</b><span>Every trade scored against a volatility stop, like a real desk</span></div>
          <div>♾ <b>Unlimited sessions</b><span>A decade of screen time in weeks — without risking a dollar</span></div>
        </div>
        <button class="primary-button" type="button" id="replay-unlock-cta">Unlock with any plan — from $3.99/mo</button>
        <small>Included in Player, Coach, and Elite.</small>
      </div>`;
    root.querySelector("#replay-unlock-cta")?.addEventListener("click", () => openUpgradeModal("replay"));
    return;
  }

  if (replayState.running) { replayRenderDesk(root); return; }

  const stats = replayData();
  const catLabel = { futures: "FUTURES", crypto: "CRYPTO", forex: "FOREX", stocks: "STOCKS" };
  root.innerHTML = `
    <div class="rp-landing">
      <div class="rp-hero">
        <div class="rp-hero-copy">
          <p class="arcade-kicker">// CHART REPLAY TRAINER</p>
          <h2>Trade the past.<br><span class="ds-green">Keep the lesson.</span></h2>
          <p class="rp-hero-lead">A real historical chart, revealed one candle at a time. You won't know the symbol or the dates — just the raw tape. Long it, short it, or sit out. Every trade graded in R, like a real desk.</p>
          <div class="rp-steps">
            <div class="rp-step"><span>1</span><b>Pick a market</b><small>A random slice of real history loads — symbol hidden.</small></div>
            <div class="rp-step"><span>2</span><b>Read the tape</b><small>Reveal it candle by candle. Enter long, short, or stay flat.</small></div>
            <div class="rp-step"><span>3</span><b>Get graded</b><small>Every trade scored in R against a volatility stop.</small></div>
          </div>
        </div>
        <div class="rp-hero-visual" aria-hidden="true">
          <div class="rp-terminal">
            <div class="rp-terminal-bar">
              <span class="rp-dot"></span><span class="rp-dot"></span><span class="rp-dot"></span>
              <span class="rp-terminal-sym">🕶 SYMBOL HIDDEN</span>
            </div>
            <canvas id="rp-hero-chart" width="440" height="220"></canvas>
            <div class="rp-terminal-foot"><span>REVEALING…</span><b class="ds-green">graded in R</b></div>
          </div>
        </div>
      </div>

      ${stats.sessions ? `
      <div class="rp-career">
        <div><span>SESSIONS</span><b>${stats.sessions}</b></div>
        <div><span>CAREER R</span><b class="${stats.totalR >= 0 ? "up" : "down"}">${stats.totalR >= 0 ? "+" : ""}${stats.totalR.toFixed(1)}R</b></div>
        <div><span>WIN RATE</span><b>${stats.trades ? Math.round((stats.wins / stats.trades) * 100) : 0}%</b></div>
        <div><span>BEST SESSION</span><b>+${stats.bestR.toFixed(1)}R</b></div>
      </div>` : ""}

      <div class="rp-choose">
        <div class="rp-choose-head">
          <h3>Choose your market</h3>
          <p>Six liquid instruments across futures, crypto, forex, and stocks — or leave it to chance.</p>
        </div>
        <div class="rp-market-grid">
          ${REPLAY_PRESETS.map((preset) => `
            <button class="rp-market ${preset.cat}" type="button" data-rp-sym="${preset.sym}">
              <span class="rp-market-cat">${catLabel[preset.cat] || preset.cat.toUpperCase()}</span>
              <b class="rp-market-ticker">${preset.ticker}</b>
              <span class="rp-market-name">${preset.name}</span>
              <span class="rp-market-go">Trade the tape →</span>
            </button>`).join("")}
          <button class="rp-market surprise" type="button" data-rp-sym="__random">
            <span class="rp-market-cat">🎲 RANDOM</span>
            <b class="rp-market-ticker">?</b>
            <span class="rp-market-name">Surprise me</span>
            <span class="rp-market-go">Blind pick →</span>
          </button>
        </div>
      </div>
      <p class="fp-foot">Real historical price data, anonymized for training. Educational simulation only — not a signal, quote, or financial advice.</p>
    </div>`;
  replayDrawHeroChart();
  root.querySelectorAll("[data-rp-sym]").forEach((button) => {
    button.addEventListener("click", () => replayStart(button.dataset.rpSym));
  });
}

/* decorative hero chart: candles that fade into "hidden" on the right */
function replayDrawHeroChart() {
  const canvas = document.getElementById("rp-hero-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  let seed = 20260713;
  const rng = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const n = 30;
  let price = H * 0.62;
  const bars = [];
  for (let i = 0; i < n; i += 1) {
    const drift = (rng() - 0.46) * 9;
    const o = price;
    const c = Math.max(24, Math.min(H - 24, price + drift));
    price = c;
    bars.push({ o, c, h: Math.min(o, c) - rng() * 8, l: Math.max(o, c) + rng() * 8 });
  }
  const bw = W / n;
  const reveal = Math.floor(n * 0.62);
  bars.forEach((bar, i) => {
    const x = i * bw + bw / 2;
    const up = bar.c <= bar.o; // canvas y inverted
    const alpha = i < reveal ? 1 : Math.max(0.06, 1 - (i - reveal) / (n - reveal) * 1.3);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = up ? "#4dffab" : "#ff5f57";
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(x, bar.h); ctx.lineTo(x, bar.l); ctx.stroke();
    ctx.fillStyle = up ? "#4dffab" : "#ff5f57";
    ctx.fillRect(x - bw * 0.3, Math.min(bar.o, bar.c), bw * 0.6, Math.max(2, Math.abs(bar.o - bar.c)));
    ctx.globalAlpha = 1;
  });
  // reveal seam
  const seamX = reveal * bw;
  ctx.strokeStyle = "rgba(246,195,78,0.55)";
  ctx.setLineDash([5, 5]); ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(seamX, 8); ctx.lineTo(seamX, H - 8); ctx.stroke();
  ctx.setLineDash([]);
}

async function replayStart(symbol) {
  const pick = symbol === "__random"
    ? REPLAY_PRESETS[Math.floor(Math.random() * REPLAY_PRESETS.length)].sym
    : symbol;
  const root = document.getElementById("replay-root");
  if (root) root.innerHTML = `<div class="rp-setup"><p class="arcade-kicker">// CHART REPLAY TRAINER</p><h2>Loading the tape…</h2><p class="arcade-sub">Pulling a random slice of real market history.</p></div>`;
  replayState.bars = await replayFetchBars(pick);
  replayState.symbol = pick;
  replayState.index = 40;
  replayState.position = null;
  replayState.trades = [];
  replayState.running = true;
  if (root) replayRenderDesk(root);
}

function replayRenderDesk(root) {
  const sessionR = replayState.trades.reduce((sum, trade) => sum + trade.r, 0);
  const openR = replayOpenR();
  root.innerHTML = `
    <div class="rp-desk">
      <div class="rp-desk-top">
        <div>
          <p class="arcade-kicker">// REPLAY · <span class="rp-blind-tag">🕶 SYMBOL HIDDEN</span></p>
          <h2>Bar ${replayState.index}<small>/${replayState.bars.length}</small></h2>
        </div>
        <div class="rp-desk-stats">
          <div><span>SESSION</span><b class="${sessionR >= 0 ? "up" : "down"}">${sessionR >= 0 ? "+" : ""}${sessionR.toFixed(1)}R</b></div>
          <div><span>OPEN</span><b class="${openR === null ? "" : openR >= 0 ? "up" : "down"}">${openR === null ? "—" : `${openR >= 0 ? "+" : ""}${openR.toFixed(1)}R`}</b></div>
          <div><span>TRADES</span><b>${replayState.trades.length}</b></div>
        </div>
      </div>
      <canvas id="rp-canvas" width="920" height="360"></canvas>
      <div class="rp-controls">
        <button class="ds-btn up ${replayState.position?.dir === 1 ? "held" : ""}" type="button" id="rp-long">LONG ▲</button>
        <button class="ds-btn down ${replayState.position?.dir === -1 ? "held" : ""}" type="button" id="rp-short">SHORT ▼</button>
        <button class="ds-btn flat" type="button" id="rp-flat" ${replayState.position ? "" : "disabled"}>CLOSE</button>
        <span class="rp-spacer"></span>
        <button class="arcade-btn primary" type="button" id="rp-next">NEXT BAR ›</button>
        <button class="arcade-btn ghost" type="button" id="rp-auto">${replayState.auto ? "❚❚ PAUSE" : "▶ AUTO"}</button>
        <button class="arcade-btn ghost" type="button" id="rp-end">END</button>
      </div>
      <small class="ds-note">Stops are 1× ATR(14) — every trade is graded like a desk would grade it. Space bar = next candle.</small>
    </div>`;
  replayDrawChart();
  root.querySelector("#rp-long").addEventListener("click", () => replayEnter(1));
  root.querySelector("#rp-short").addEventListener("click", () => replayEnter(-1));
  root.querySelector("#rp-flat").addEventListener("click", () => { replayClose(); replayRefresh(); });
  root.querySelector("#rp-next").addEventListener("click", replayStep);
  root.querySelector("#rp-auto").addEventListener("click", replayToggleAuto);
  root.querySelector("#rp-end").addEventListener("click", replayEnd);
}

function replayDrawChart() {
  const canvas = document.getElementById("rp-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const count = 60;
  const shown = replayState.bars.slice(Math.max(0, replayState.index - count), replayState.index);
  const lo = Math.min(...shown.map((b) => b.l));
  const hi = Math.max(...shown.map((b) => b.h));
  const span = (hi - lo) || 1;
  const bw = W / count;
  const y = (v) => H - 10 - ((v - lo) / span) * (H - 20);
  shown.forEach((bar, i) => {
    const x = i * bw + bw / 2;
    const up = bar.c >= bar.o;
    ctx.strokeStyle = up ? "#4dffab" : "#ff5f57";
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(x, y(bar.h)); ctx.lineTo(x, y(bar.l)); ctx.stroke();
    ctx.fillStyle = up ? "#4dffab" : "#ff5f57";
    ctx.fillRect(x - bw * 0.3, y(Math.max(bar.o, bar.c)), bw * 0.6, Math.max(2, Math.abs(y(bar.o) - y(bar.c))));
  });
  if (replayState.position) {
    const py = y(replayState.position.entry);
    ctx.strokeStyle = "rgba(246,195,78,0.85)";
    ctx.setLineDash([7, 6]); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f6c34e"; ctx.font = "700 13px Arial";
    ctx.fillText(`${replayState.position.dir === 1 ? "LONG" : "SHORT"} @ ${replayState.position.entry.toFixed(2)}`, 10, py - 7);
  }
}

/* ---------- actions ---------- */

function replayPrice() {
  return replayState.bars[replayState.index - 1].c;
}

function replayOpenR() {
  const pos = replayState.position;
  if (!pos) return null;
  return ((replayPrice() - pos.entry) / pos.atr) * pos.dir;
}

function replayEnter(dir) {
  if (replayState.position?.dir === dir) return;
  if (replayState.position) replayClose();
  replayState.position = { dir, entry: replayPrice(), atr: Math.max(replayAtr(replayState.index), replayPrice() * 0.001) };
  if (typeof arcadeSound === "function") arcadeSound("flip");
  replayRefresh();
}

function replayClose() {
  const r = replayOpenR();
  if (r === null) return;
  replayState.trades.push({ r });
  if (typeof arcadeSound === "function") arcadeSound(r > 0 ? "win" : "flip");
  replayState.position = null;
}

function replayStep() {
  if (replayState.index >= replayState.bars.length) { replayEnd(); return; }
  replayState.index += 1;
  replayRefresh();
}

function replayRefresh() {
  const root = document.getElementById("replay-root");
  if (root && replayState.running) replayRenderDesk(root);
}

function replayToggleAuto() {
  if (replayState.auto) {
    clearInterval(replayState.auto);
    replayState.auto = null;
  } else {
    replayState.auto = setInterval(() => {
      if (state.currentView !== "replay" || !replayState.running) { clearInterval(replayState.auto); replayState.auto = null; return; }
      replayStep();
    }, 650);
  }
  replayRefresh();
}

function replayEnd() {
  if (replayState.position) replayClose();
  if (replayState.auto) { clearInterval(replayState.auto); replayState.auto = null; }
  replayState.running = false;

  const sessionR = replayState.trades.reduce((sum, trade) => sum + trade.r, 0);
  const wins = replayState.trades.filter((trade) => trade.r > 0).length;
  const stats = replayData();
  stats.sessions += 1;
  stats.totalR = Math.round((stats.totalR + sessionR) * 10) / 10;
  stats.trades += replayState.trades.length;
  stats.wins += wins;
  stats.bestR = Math.max(stats.bestR, Math.round(sessionR * 10) / 10);
  const p = progress();
  const xp = Math.max(10, Math.round(20 + Math.max(0, sessionR) * 12));
  p.xp += xp;
  if (typeof dailyBump === "function") dailyBump("runs");
  saveProgress();
  if (typeof updateProgressUi === "function") updateProgressUi();

  const grade = sessionR >= 3 ? "A" : sessionR >= 1.5 ? "B" : sessionR >= 0 ? "C" : sessionR >= -2 ? "D" : "F";
  const root = document.getElementById("replay-root");
  if (!root) return;
  root.innerHTML = `
    <div class="rp-setup">
      <p class="arcade-kicker">// SESSION COMPLETE</p>
      <div class="rp-summary">
        <div class="ai-grade grade-${grade}">${grade}</div>
        <div>
          <h2>${sessionR >= 0 ? "+" : ""}${sessionR.toFixed(1)}R ${sessionR >= 1.5 ? "— that's a professional tape read." : sessionR >= 0 ? "— green is green." : "— tuition paid in sim dollars, not real ones."}</h2>
          <p class="arcade-sub">The tape was <b>${replayState.blind ? (typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(replayState.symbol) : replayState.symbol) : replayState.symbol}</b> · ${replayState.trades.length} trade${replayState.trades.length === 1 ? "" : "s"} · ${replayState.trades.length ? Math.round((wins / replayState.trades.length) * 100) : 0}% wins · +${xp} XP</p>
        </div>
      </div>
      <div class="rp-presets">
        <button class="rp-preset surprise" type="button" id="rp-again">🎲 New session</button>
        <button class="rp-preset" type="button" id="rp-home">Back to setup</button>
      </div>
    </div>`;
  root.querySelector("#rp-again")?.addEventListener("click", () => replayStart("__random"));
  root.querySelector("#rp-home")?.addEventListener("click", renderReplay);
}

/* ---------- keyboard ---------- */

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && replayState.running && typeof state !== "undefined" && state.currentView === "replay") {
    event.preventDefault();
    replayStep();
  }
});
