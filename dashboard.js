/* ReplayEdge Traders Dashboard — the real thing.
   Live market data (server-proxied, cached), rule-based session context,
   and a professional read of pulse, flow, and drivers for whatever the
   user actually trades. Subscription-gated. Educational context — never advice. */

/* ---------- market registry ---------- */

const TDASH_MARKETS = {
  futures: {
    label: "Futures",
    placeholder: "ES=F, NQ=F, GC=F…",
    presets: [
      { sym: "ES=F", label: "S&P 500 E-mini" },
      { sym: "NQ=F", label: "Nasdaq E-mini" },
      { sym: "YM=F", label: "Dow E-mini" },
      { sym: "RTY=F", label: "Russell E-mini" },
      { sym: "GC=F", label: "Gold" },
      { sym: "CL=F", label: "Crude Oil" },
      { sym: "NG=F", label: "Nat Gas" },
      { sym: "ZB=F", label: "30Y Bond" }
    ],
    drivers: [
      ["DX-Y.NYB", "US Dollar Index"],
      ["^VIX", "Volatility (VIX)"],
      ["^TNX", "10Y Yield"]
    ]
  },
  forex: {
    label: "Forex",
    placeholder: "EURUSD, GBPJPY…",
    presets: [
      { sym: "EURUSD=X", label: "EUR/USD" },
      { sym: "GBPUSD=X", label: "GBP/USD" },
      { sym: "USDJPY=X", label: "USD/JPY" },
      { sym: "AUDUSD=X", label: "AUD/USD" },
      { sym: "USDCAD=X", label: "USD/CAD" },
      { sym: "EURGBP=X", label: "EUR/GBP" },
      { sym: "GBPJPY=X", label: "GBP/JPY" },
      { sym: "XAUUSD=X", label: "Gold Spot" }
    ],
    drivers: [
      ["DX-Y.NYB", "US Dollar Index"],
      ["^TNX", "10Y Yield"],
      ["GC=F", "Gold"]
    ]
  },
  stocks: {
    label: "Stocks",
    placeholder: "AAPL, NVDA, SPY…",
    presets: [
      { sym: "SPY", label: "S&P 500 ETF" },
      { sym: "QQQ", label: "Nasdaq ETF" },
      { sym: "AAPL", label: "Apple" },
      { sym: "NVDA", label: "Nvidia" },
      { sym: "TSLA", label: "Tesla" },
      { sym: "MSFT", label: "Microsoft" },
      { sym: "AMZN", label: "Amazon" },
      { sym: "META", label: "Meta" }
    ],
    drivers: [
      ["^GSPC", "S&P 500"],
      ["^VIX", "Volatility (VIX)"],
      ["^TNX", "10Y Yield"]
    ]
  },
  options: {
    label: "Options",
    placeholder: "Underlying: SPY, AAPL…",
    presets: [
      { sym: "SPY", label: "S&P 500 ETF" },
      { sym: "QQQ", label: "Nasdaq ETF" },
      { sym: "AAPL", label: "Apple" },
      { sym: "NVDA", label: "Nvidia" },
      { sym: "TSLA", label: "Tesla" },
      { sym: "IWM", label: "Russell ETF" }
    ],
    drivers: [
      ["^VIX", "Volatility (VIX)"],
      ["^GSPC", "S&P 500"],
      ["^TNX", "10Y Yield"]
    ]
  },
  crypto: {
    label: "Crypto",
    placeholder: "BTC, ETH, SOL…",
    presets: [
      { sym: "BTC-USD", label: "Bitcoin" },
      { sym: "ETH-USD", label: "Ethereum" },
      { sym: "SOL-USD", label: "Solana" },
      { sym: "XRP-USD", label: "XRP" },
      { sym: "DOGE-USD", label: "Dogecoin" },
      { sym: "ADA-USD", label: "Cardano" }
    ],
    drivers: [
      ["BTC-USD", "Bitcoin"],
      ["^GSPC", "S&P 500"],
      ["DX-Y.NYB", "US Dollar Index"]
    ]
  }
};

/* ---------- state & config ---------- */

const tdashState = {
  timer: null,
  loading: false,
  data: null, // { bars, meta, analysis, drivers, news, fetchedAt }
  error: null
};

function tdashConfig() {
  const p = progress();
  if (!p.dashboard || typeof p.dashboard !== "object") return null;
  if (!p.dashboard.symbol || !TDASH_MARKETS[p.dashboard.market]) return null;
  return p.dashboard;
}

function tdashSaveConfig(market, symbol, label) {
  progress().dashboard = { market, symbol, label };
  saveProgress();
}

function tdashNormalizeSymbol(market, raw) {
  const clean = String(raw || "").trim().toUpperCase();
  if (!clean) return null;
  const registry = TDASH_MARKETS[market];
  const preset = registry.presets.find((item) => item.sym === clean || item.label.toUpperCase() === clean);
  if (preset) return preset.sym;
  if (market === "forex" && /^[A-Z]{6}$/.test(clean)) return `${clean}=X`;
  if (market === "crypto" && /^[A-Z]{2,6}$/.test(clean) && !clean.includes("-")) return `${clean}-USD`;
  if (/^[A-Z0-9.^=-]{1,15}$/.test(clean)) return clean;
  return null;
}

function tdashDisplaySymbol(symbol) {
  return String(symbol || "").replace(/=X$/, "").replace(/=F$/, "").replace(/-USD$/, "");
}

/* ---------- data layer ---------- */

async function tdashFetchChart(symbol, range = "1d", interval = "5m") {
  const response = await fetch(`/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=${range}&interval=${interval}`);
  const json = await response.json();
  if (!json.ok || !json.bars?.length) throw new Error(json.error || "No market data for that symbol");
  return json; // { bars, meta:{last, prevClose}, source, label, proxyNote }
}

async function tdashLoadSymbol(symbol) {
  let data = await tdashFetchChart(symbol, "1d", "5m");
  let timeframe = data.label || "intraday";
  if (data.source === "Yahoo Finance" && data.bars.length < 12) {
    data = await tdashFetchChart(symbol, "5d", "15m");
    timeframe = "15m · 5 days";
  }
  return { meta: data.meta || {}, bars: data.bars, timeframe, source: data.source, proxyNote: data.proxyNote || null };
}

async function tdashLoadDriver(symbol, label) {
  try {
    const data = await tdashFetchChart(symbol, "1d", "15m");
    const bars = data.bars.filter((bar) => bar.c > 0);
    const last = data.meta?.last || bars[bars.length - 1]?.c;
    const base = data.meta?.prevClose || bars[0]?.c;
    const change = base > 0 && last > 0 ? ((last - base) / base) * 100 : null;
    return { symbol, label, last, change };
  } catch {
    return { symbol, label, last: null, change: null };
  }
}

function tdashNewsQuery(config) {
  const marketWord = { futures: "futures", forex: "forex", stocks: "stock", options: "stock options", crypto: "crypto" }[config.market] || "market";
  return `${config.label || tdashDisplaySymbol(config.symbol)} ${marketWord}`;
}

async function tdashLoadNews(config) {
  try {
    const response = await fetch(`/api/market/news?symbol=${encodeURIComponent(config.symbol)}&q=${encodeURIComponent(tdashNewsQuery(config))}`);
    const json = await response.json();
    return json.ok ? (json.news || []).filter((item) => item.title && item.link).slice(0, 5) : [];
  } catch {
    return [];
  }
}

/* ---------- the brain: turn bars into a professional read ---------- */

function tdashAnalyze(bars, meta) {
  const closes = bars.map((bar) => bar.c);
  const last = meta.last ?? closes[closes.length - 1];
  const changeBasis = meta.prevClose ? "the prior close" : "the session start";
  const prevClose = meta.prevClose || closes.find((value) => value > 0) || closes[0];
  const changePct = prevClose ? ((last - prevClose) / prevClose) * 100 : 0;
  const high = Math.max(...bars.map((bar) => bar.h));
  const low = Math.min(...bars.map((bar) => bar.l));

  const mean = closes.reduce((sum, value) => sum + value, 0) / closes.length;
  const aboveMean = last >= mean;

  const momWindow = Math.min(12, closes.length - 1);
  const momPct = momWindow > 0 ? ((last - closes[closes.length - 1 - momWindow]) / closes[closes.length - 1 - momWindow]) * 100 : 0;

  const ranges = bars.map((bar) => (bar.h - bar.l) / bar.c * 100);
  const sessionAtr = ranges.reduce((sum, value) => sum + value, 0) / ranges.length;
  const recentRanges = ranges.slice(-12);
  const recentAtr = recentRanges.reduce((sum, value) => sum + value, 0) / recentRanges.length;
  const pulseRatio = sessionAtr > 0 ? recentAtr / sessionAtr : 1;

  const volumes = bars.map((bar) => bar.v);
  const hasVolume = volumes.some((value) => value > 0);
  let flowRatio = 1;
  if (hasVolume) {
    const sessionVol = volumes.reduce((sum, value) => sum + value, 0) / volumes.length;
    const recentVol = volumes.slice(-12).reduce((sum, value) => sum + value, 0) / Math.min(12, volumes.length);
    flowRatio = sessionVol > 0 ? recentVol / sessionVol : 1;
  } else {
    flowRatio = pulseRatio; // forex proxy: activity read through range expansion
  }

  // bias score −100…100
  let score = 0;
  score += Math.max(-2, Math.min(2, changePct)) * 22;
  score += aboveMean ? 18 : -18;
  score += Math.max(-1.2, Math.min(1.2, momPct)) * 25;
  const rangeSpan = high - low;
  if (rangeSpan > 0) {
    const positionInRange = ((last - low) / rangeSpan) * 2 - 1; // −1 at low, +1 at high
    score += positionInRange * 12;
  }
  score = Math.max(-100, Math.min(100, score));

  const bias = score > 22 ? "Bullish" : score < -22 ? "Bearish" : "Neutral";
  const confidence = Math.min(92, Math.round(52 + Math.abs(score) * 0.42));

  const pulse = pulseRatio < 0.72 ? "quiet" : pulseRatio > 1.35 ? "wild" : "tradable";
  const flow = flowRatio < 0.7 ? "thin" : flowRatio > 1.5 ? "crowded" : "healthy";
  const bearing = Math.abs(momPct) < Math.max(0.05, sessionAtr * 0.35) ? "flatline" : momPct > 0 ? "climbing" : "sliding";

  let edge = 50 + Math.abs(score) * 0.32;
  edge += pulse === "tradable" ? 10 : -9;
  edge += flow === "healthy" ? 9 : -7;
  edge = Math.max(8, Math.min(94, Math.round(edge)));
  const edgeVerdict = edge >= 70
    ? { tag: "ALIGNED / CLEAR", text: "Direction, participation, and volatility agree. Conditions reward prepared setups — execute your plan, not your excitement." }
    : edge >= 45
      ? { tag: "MIXED / LOW CLARITY", text: "Some signals agree, others don't. Reduced clarity means reduced size — preserve capital until conditions align." }
      : { tag: "HOSTILE / STAND DOWN", text: "Signals conflict and conditions are poor. The professional trade right now is patience." };

  return {
    last, prevClose, changeBasis, changePct, high, low, mean, aboveMean, momPct,
    sessionAtr, pulseRatio, flowRatio, hasVolume,
    score, bias, confidence, pulse, flow, bearing,
    edge, edgeVerdict
  };
}

function tdashPrice(value, reference) {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  const magnitude = Math.abs(reference ?? value);
  const digits = magnitude >= 1000 ? 1 : magnitude >= 50 ? 2 : magnitude >= 1 ? 4 : 6;
  return value.toLocaleString(undefined, { minimumFractionDigits: Math.min(digits, 2), maximumFractionDigits: digits });
}

function tdashEscape(text) {
  return String(text || "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function tdashTimeAgo(ts) {
  if (!ts) return "";
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/* ---------- AI-style commentary (rule-composed from the live numbers) ---------- */

function tdashCommentary(config, analysis, drivers, news) {
  const name = tdashDisplaySymbol(config.symbol);
  const lines = [];
  const dir = analysis.changePct >= 0 ? "up" : "down";
  lines.push(`${name} is ${dir} ${Math.abs(analysis.changePct).toFixed(2)}% against ${analysis.changeBasis}, trading ${analysis.aboveMean ? "above" : "below"} its session mean.`);

  if (analysis.bearing === "climbing") lines.push(`Short-term momentum is positive — buyers have controlled the last stretch of bars.`);
  else if (analysis.bearing === "sliding") lines.push(`Short-term momentum is negative — sellers pressed the most recent bars.`);
  else lines.push(`Momentum has flattened out — neither side is pressing right now.`);

  const strongDriver = drivers.filter((driver) => driver.change !== null).sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
  if (strongDriver && Math.abs(strongDriver.change) >= 0.15) {
    lines.push(`${strongDriver.label} is ${strongDriver.change >= 0 ? "up" : "down"} ${Math.abs(strongDriver.change).toFixed(2)}% — the loudest cross-market input on the desk right now.`);
  }

  if (analysis.pulse === "wild") lines.push(`Volatility is expanded versus the session norm: expect fast fills and violent wicks.`);
  else if (analysis.pulse === "quiet") lines.push(`Volatility is compressed: moves are small, and breakouts are less trustworthy.`);

  if (news.length) lines.push(`${news.length} recent headline${news.length === 1 ? "" : "s"} on the wire — check the feed before assuming a clean technical tape.`);

  return lines.join(" ");
}

function tdashDeepDive(config, analysis, drivers, news, timeframe) {
  const name = tdashDisplaySymbol(config.symbol);
  const range = analysis.high - analysis.low;
  const midpoint = analysis.low + range / 2;
  const scenarios = [];
  if (analysis.bias === "Bullish") {
    scenarios.push(`<b>If ${name} holds above ${tdashPrice(analysis.mean, analysis.last)}</b> (session mean), the path of least resistance stays toward the ${tdashPrice(analysis.high, analysis.last)} session high.`);
    scenarios.push(`<b>If it loses ${tdashPrice(analysis.mean, analysis.last)}</b>, the bullish read is invalidated — momentum longs get trapped and ${tdashPrice(analysis.low, analysis.last)} comes back into play.`);
  } else if (analysis.bias === "Bearish") {
    scenarios.push(`<b>If ${name} stays below ${tdashPrice(analysis.mean, analysis.last)}</b> (session mean), sellers keep control and the ${tdashPrice(analysis.low, analysis.last)} session low is the magnet.`);
    scenarios.push(`<b>If it reclaims ${tdashPrice(analysis.mean, analysis.last)}</b>, shorts are offside — squeezes toward ${tdashPrice(analysis.high, analysis.last)} get disorderly.`);
  } else {
    scenarios.push(`<b>Balanced tape:</b> price is rotating around ${tdashPrice(midpoint, analysis.last)}. Range strategies beat breakout chasing until either ${tdashPrice(analysis.high, analysis.last)} or ${tdashPrice(analysis.low, analysis.last)} actually breaks.`);
    scenarios.push(`<b>Watch for the failed break:</b> in balance, the first breakout often traps — the higher-quality trade is frequently the reversion.`);
  }
  return `
    <div class="tdash-dd">
      <div class="tdash-dd-grid">
        <div><small>LAST</small><strong>${tdashPrice(analysis.last)}</strong></div>
        <div><small>PREV CLOSE</small><strong>${tdashPrice(analysis.prevClose, analysis.last)}</strong></div>
        <div><small>SESSION HIGH</small><strong>${tdashPrice(analysis.high, analysis.last)}</strong></div>
        <div><small>SESSION LOW</small><strong>${tdashPrice(analysis.low, analysis.last)}</strong></div>
        <div><small>SESSION MEAN</small><strong>${tdashPrice(analysis.mean, analysis.last)}</strong></div>
        <div><small>AVG BAR RANGE</small><strong>${analysis.sessionAtr.toFixed(2)}%</strong></div>
      </div>
      <h4>Cross-market drivers</h4>
      <div class="tdash-dd-drivers">
        ${drivers.map((driver) => `
          <div class="tdash-dd-driver">
            <span>${tdashEscape(driver.label)}</span>
            <b class="${driver.change === null ? "" : driver.change >= 0 ? "up" : "down"}">${driver.change === null ? "—" : `${driver.change >= 0 ? "+" : ""}${driver.change.toFixed(2)}%`}</b>
          </div>
        `).join("")}
      </div>
      <h4>Scenario map</h4>
      ${scenarios.map((scenario) => `<p class="tdash-dd-scenario">${scenario}</p>`).join("")}
      ${news.length ? `
        <h4>On the wire</h4>
        ${news.map((item) => `
          <a class="tdash-dd-news" href="${tdashEscape(item.link)}" target="_blank" rel="noopener noreferrer">
            <span>${tdashEscape(item.title)}</span>
            <small>${tdashEscape(item.publisher || "")} · ${tdashTimeAgo(item.publishedAt)}</small>
          </a>
        `).join("")}
      ` : ""}
      <p class="tdash-dd-note">Data timeframe: ${timeframe}. Levels are descriptive session statistics, not recommendations. This is market context for education — not financial advice.</p>
    </div>
  `;
}

/* ---------- canvas candle chart ---------- */

function tdashDrawChart(canvas, bars, analysis) {
  const wrap = canvas.parentElement;
  if (!wrap) return;
  const dpr = window.devicePixelRatio || 1;
  const width = wrap.clientWidth || 600;
  const height = 300;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const padding = { top: 16, right: 64, bottom: 40, left: 10 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const volH = 26;

  const shown = bars.slice(-96);
  let min = Math.min(...shown.map((bar) => bar.l));
  let max = Math.max(...shown.map((bar) => bar.h));
  if (analysis.prevClose) {
    min = Math.min(min, analysis.prevClose);
    max = Math.max(max, analysis.prevClose);
  }
  const span = (max - min) || 1;
  min -= span * 0.04;
  max += span * 0.04;

  const yFor = (price) => padding.top + (1 - (price - min) / (max - min)) * (plotH - volH - 8);
  const xFor = (index) => padding.left + (index + 0.5) * (plotW / shown.length);
  const candleW = Math.max(2, Math.min(9, (plotW / shown.length) * 0.62));

  ctx.clearRect(0, 0, width, height);

  // grid
  ctx.strokeStyle = "rgba(148, 178, 190, 0.08)";
  ctx.lineWidth = 1;
  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "left";
  for (let i = 0; i <= 4; i += 1) {
    const price = min + ((max - min) / 4) * i;
    const y = yFor(price);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right + 6, y);
    ctx.stroke();
    ctx.fillStyle = "rgba(170, 196, 205, 0.55)";
    ctx.fillText(tdashPrice(price, analysis.last), width - padding.right + 10, y + 3);
  }

  // volume
  const maxVol = Math.max(...shown.map((bar) => bar.v), 1);
  shown.forEach((bar, index) => {
    if (!bar.v) return;
    const x = xFor(index);
    const vh = (bar.v / maxVol) * volH;
    ctx.fillStyle = bar.c >= bar.o ? "rgba(77, 255, 171, 0.16)" : "rgba(255, 95, 110, 0.16)";
    ctx.fillRect(x - candleW / 2, height - padding.bottom - vh, candleW, vh);
  });

  // previous close line
  if (analysis.prevClose) {
    const y = yFor(analysis.prevClose);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(226, 232, 240, 0.28)";
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right + 6, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // candles
  shown.forEach((bar, index) => {
    const x = xFor(index);
    const up = bar.c >= bar.o;
    ctx.strokeStyle = up ? "#3ddc97" : "#ff5f6e";
    ctx.fillStyle = up ? "#3ddc97" : "#ff5f6e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, yFor(bar.h));
    ctx.lineTo(x, yFor(bar.l));
    ctx.stroke();
    const top = yFor(Math.max(bar.o, bar.c));
    const bodyH = Math.max(1.4, Math.abs(yFor(bar.o) - yFor(bar.c)));
    ctx.fillRect(x - candleW / 2, top, candleW, bodyH);
  });

  // last price tag
  const lastY = yFor(analysis.last);
  ctx.fillStyle = analysis.changePct >= 0 ? "#3ddc97" : "#ff5f6e";
  ctx.fillRect(width - padding.right + 6, lastY - 9, padding.right - 10, 18);
  ctx.fillStyle = "#06100d";
  ctx.font = "bold 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(tdashPrice(analysis.last), width - padding.right + 10, lastY + 3);

  // time axis: first/last bar stamps
  ctx.fillStyle = "rgba(170, 196, 205, 0.5)";
  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  const fmt = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  ctx.fillText(fmt(shown[0].t), padding.left, height - 8);
  ctx.textAlign = "right";
  ctx.fillText(fmt(shown[shown.length - 1].t), padding.left + plotW, height - 8);
  ctx.textAlign = "left";
}

/* ---------- refresh loop ---------- */

async function tdashRefresh(showSpinner = false) {
  const config = tdashConfig();
  if (!config || tdashState.loading) return;
  tdashState.loading = true;
  if (showSpinner) tdashRenderBody();
  try {
    const registry = TDASH_MARKETS[config.market];
    const [main, news, ...drivers] = await Promise.all([
      tdashLoadSymbol(config.symbol),
      tdashLoadNews(config),
      ...registry.drivers
        .filter(([symbol]) => symbol !== config.symbol)
        .map(([symbol, label]) => tdashLoadDriver(symbol, label))
    ]);
    tdashState.data = {
      bars: main.bars,
      meta: main.meta,
      timeframe: main.timeframe,
      source: main.source,
      proxyNote: main.proxyNote,
      analysis: tdashAnalyze(main.bars, main.meta),
      drivers,
      news,
      fetchedAt: Date.now()
    };
    tdashState.error = null;
  } catch (error) {
    tdashState.error = error.message || "Could not load market data";
    if (!tdashState.data) tdashState.data = null;
  }
  tdashState.loading = false;
  tdashRenderBody();
}

function tdashEnsureTimer() {
  if (tdashState.timer) return;
  tdashState.timer = setInterval(() => {
    if (typeof state !== "undefined" && state.currentView !== "dashboard") {
      clearInterval(tdashState.timer);
      tdashState.timer = null;
      return;
    }
    tdashRefresh(false);
  }, 60000);
}

/* ---------- render: locked / setup / live ---------- */

function renderTradersDashboard() {
  const root = document.getElementById("dashboard-root");
  if (!root) return;

  if (typeof hasAccess === "function" && !hasAccess("tradersDashboard")) {
    root.innerHTML = `
      <div class="tdash-locked">
        <div class="tdash-locked-fake" aria-hidden="true">
          <div class="tlf-row"><span class="tlf-pill"></span><span class="tlf-pill wide"></span></div>
          <div class="tlf-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="tlf-row"><span class="tlf-tile"></span><span class="tlf-tile"></span><span class="tlf-tile"></span></div>
        </div>
        <div class="tdash-locked-copy">
          <p class="arcade-kicker">// TRADERS DASHBOARD · LIVE</p>
          <h2>Your practice, meet the real market.</h2>
          <p>Live price action, news, cross-market drivers, an AI session read, and pulse & flow monitors — for the exact instrument you trade. This is the tool you open <b>before</b> the session, every session.</p>
          <ul>
            <li>📡 Real live market data for futures, forex, stocks, options & crypto</li>
            <li>🧠 AI analysis with one-tap deep dive</li>
            <li>📰 Headlines that can move your market, on one screen</li>
            <li>⚡ Trade Pulse & Market Flow — know when the tape is worth trading</li>
          </ul>
          <button class="primary-button" type="button" id="tdash-unlock">Unlock with any plan — from $24.99/mo</button>
          <small>Included in Player, Coach, and Elite.</small>
        </div>
      </div>
    `;
    root.querySelector("#tdash-unlock")?.addEventListener("click", () => {
      if (typeof openUpgradeModal === "function") openUpgradeModal("tradersDashboard");
    });
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const config = tdashConfig();
  if (!config) {
    tdashRenderSetup(root);
    return;
  }

  root.innerHTML = `<div id="tdash-live"></div>`;
  tdashRenderBody();
  if (!tdashState.data || Date.now() - tdashState.data.fetchedAt > 55000) {
    tdashRefresh(true);
  }
  tdashEnsureTimer();
}

function tdashRenderSetup(root, presetMarket) {
  const market = presetMarket || (typeof currentTrackId === "function" ? currentTrackId() : "futures");
  const registry = TDASH_MARKETS[market] || TDASH_MARKETS.futures;
  root.innerHTML = `
    <div class="tdash-setup">
      <p class="arcade-kicker">// TRADERS DASHBOARD · LIVE</p>
      <h2>What do you trade?</h2>
      <p class="arcade-sub">Pick your market and instrument. The dashboard tunes its data feeds, drivers, and news to exactly what you trade — change it any time.</p>
      <div class="tdash-market-row">
        ${Object.entries(TDASH_MARKETS).map(([id, item]) => `
          <button class="tdash-market-chip ${id === market ? "active" : ""}" type="button" data-tdash-market="${id}">${item.label}</button>
        `).join("")}
      </div>
      <div class="tdash-sym-row">
        <input id="tdash-sym-input" type="text" placeholder="${registry.placeholder}" autocomplete="off" spellcheck="false" />
        <button class="primary-button" type="button" id="tdash-launch">Launch Dashboard</button>
      </div>
      <div class="tdash-preset-row">
        ${registry.presets.map((preset) => `<button class="tdash-preset" type="button" data-tdash-sym="${preset.sym}">${preset.label}<small>${tdashDisplaySymbol(preset.sym)}</small></button>`).join("")}
      </div>
      ${market === "options" ? `<p class="tdash-foot-note">Options flow is read through the underlying plus the volatility complex (VIX).</p>` : ""}
    </div>
  `;
  root.querySelectorAll("[data-tdash-market]").forEach((button) => {
    button.addEventListener("click", () => tdashRenderSetup(root, button.dataset.tdashMarket));
  });
  const launch = (rawSymbol) => {
    const symbol = tdashNormalizeSymbol(market, rawSymbol);
    if (!symbol) {
      showToast("That doesn't look like a valid symbol — try a preset below.", "warning");
      return;
    }
    const preset = registry.presets.find((item) => item.sym === symbol);
    tdashSaveConfig(market, symbol, preset ? preset.label : tdashDisplaySymbol(symbol));
    tdashState.data = null;
    renderTradersDashboard();
  };
  root.querySelectorAll("[data-tdash-sym]").forEach((button) => {
    button.addEventListener("click", () => launch(button.dataset.tdashSym));
  });
  const input = root.querySelector("#tdash-sym-input");
  root.querySelector("#tdash-launch")?.addEventListener("click", () => launch(input.value));
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") launch(input.value);
  });
  input?.focus();
}

function tdashRenderBody() {
  const host = document.getElementById("tdash-live");
  if (!host) return;
  const config = tdashConfig();
  if (!config) return;
  const data = tdashState.data;

  if (!data && tdashState.loading) {
    host.innerHTML = `
      <div class="tdash-loading">
        <div class="tdash-spinner"></div>
        <p>Connecting to live ${TDASH_MARKETS[config.market].label} data…</p>
      </div>
    `;
    return;
  }

  if (!data && tdashState.error) {
    host.innerHTML = `
      <div class="tdash-error">
        <h3>Feed unavailable</h3>
        <p>${tdashEscape(tdashState.error)}</p>
        <div class="tdash-error-actions">
          <button class="arcade-btn ghost" type="button" id="tdash-reconf">Change instrument</button>
          <button class="arcade-btn primary" type="button" id="tdash-retry">Retry</button>
        </div>
      </div>
    `;
    host.querySelector("#tdash-retry")?.addEventListener("click", () => tdashRefresh(true));
    host.querySelector("#tdash-reconf")?.addEventListener("click", () => {
      progress().dashboard = null;
      saveProgress();
      renderTradersDashboard();
    });
    return;
  }

  if (!data) return;
  const { analysis, drivers, news, timeframe } = data;
  const name = tdashDisplaySymbol(config.symbol);
  const up = analysis.changePct >= 0;

  host.innerHTML = `
    <div class="tdash-head">
      <div class="tdash-head-id">
        <p class="arcade-kicker">// TRADERS DASHBOARD · <span class="tdash-live-dot"><i></i>LIVE</span></p>
        <div class="tdash-title-row">
          <h2>${tdashEscape(name)}</h2>
          <span class="tdash-change ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${up ? "+" : ""}${analysis.changePct.toFixed(2)}%</span>
          <span class="tdash-bias ${analysis.bias.toLowerCase()}">● ${analysis.bias}</span>
        </div>
        <small class="tdash-sub">${tdashEscape(config.label || name)} · ${TDASH_MARKETS[config.market].label} · ${timeframe} · ${tdashEscape(data.source || "live feed")} · updated ${tdashTimeAgo(data.fetchedAt)}</small>
        ${data.proxyNote ? `<small class="tdash-proxy-note">ⓘ ${tdashEscape(data.proxyNote)}</small>` : ""}
      </div>
      <div class="tdash-head-actions">
        <button class="arcade-btn ghost" type="button" id="tdash-change">⚙ Instrument</button>
        <button class="arcade-btn ghost" type="button" id="tdash-refresh" ${tdashState.loading ? "disabled" : ""}>${tdashState.loading ? "Updating…" : "⟳ Refresh"}</button>
      </div>
    </div>

    <div class="tdash-confidence">
      <small>CONFIDENCE</small>
      <div class="tdash-conf-bar"><i style="width:${analysis.confidence}%"></i></div>
      <b>${analysis.confidence}%</b>
    </div>

    <div class="tdash-grid">
      <div class="tdash-main">
        <div class="tdash-card tdash-chart-card">
          <canvas id="tdash-canvas"></canvas>
          <div class="tdash-chart-stats">
            <div><small>HIGH</small><b>${tdashPrice(analysis.high, analysis.last)}</b></div>
            <div><small>LOW</small><b>${tdashPrice(analysis.low, analysis.last)}</b></div>
            <div><small>MEAN</small><b>${tdashPrice(analysis.mean, analysis.last)}</b></div>
            <div><small>PREV CLOSE</small><b>${tdashPrice(analysis.prevClose, analysis.last)}</b></div>
          </div>
        </div>
        <div class="tdash-card tdash-ai">
          <p class="tdash-card-kicker">✦ AI ANALYSIS</p>
          <p class="tdash-ai-text">${tdashCommentary(config, analysis, drivers, news)}</p>
          <div class="tdash-ai-actions">
            <button class="arcade-btn primary" type="button" id="tdash-deepdive">Deep Dive ↗</button>
          </div>
        </div>
      </div>

      <div class="tdash-side">
        <div class="tdash-card tdash-edge">
          <div class="tdash-edge-ring" style="--edge:${analysis.edge}">
            <b>${analysis.edge}</b>
            <small>${analysis.edgeVerdict.tag}</small>
          </div>
          <div class="tdash-edge-copy">
            <p class="tdash-card-kicker gold">EDGE FACTOR</p>
            <p>${analysis.edgeVerdict.text}</p>
          </div>
        </div>
        <div class="tdash-card">
          <p class="tdash-card-kicker">⚡ KEY DRIVERS</p>
          <div class="tdash-drivers">
            ${drivers.map((driver) => `
              <div class="tdash-driver">
                <span>${tdashEscape(driver.label)}</span>
                <b class="${driver.change === null ? "" : driver.change >= 0 ? "up" : "down"}">${driver.change === null ? "—" : `${driver.change >= 0 ? "+" : ""}${driver.change.toFixed(2)}%`}</b>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="tdash-card">
          <p class="tdash-card-kicker">📰 ON THE WIRE</p>
          ${news.length ? news.map((item) => `
            <a class="tdash-news" href="${tdashEscape(item.link)}" target="_blank" rel="noopener noreferrer">
              <span>${tdashEscape(item.title)}</span>
              <small>${tdashEscape(item.publisher || "")} · ${tdashTimeAgo(item.publishedAt)}</small>
            </a>
          `).join("") : `<p class="tdash-empty">No fresh headlines for ${tdashEscape(name)} right now.</p>`}
        </div>
      </div>
    </div>

    <div class="tdash-tiles">
      <div class="tdash-tile flow-${analysis.flow}">
        <small>FLOW</small>
        <span class="tdash-tile-icon">〰</span>
        <b>${analysis.flow.toUpperCase()}</b>
        <div class="tdash-tile-meter">
          <i class="${analysis.flow === "thin" ? "on" : ""}"></i><i class="${analysis.flow === "healthy" ? "on good" : ""}"></i><i class="${analysis.flow === "crowded" ? "on bad" : ""}"></i>
        </div>
        <em>Thin · Healthy · Crowded${analysis.hasVolume ? "" : " (range-based est.)"}</em>
      </div>
      <div class="tdash-tile bearing-${analysis.bearing}">
        <small>BEARING</small>
        <b class="tdash-bearing-word">${analysis.bearing.toUpperCase()}</b>
        <div class="tdash-tile-bar"><i></i></div>
        <em>${analysis.bearing === "flatline" ? "No directional press" : analysis.bearing === "climbing" ? "Buyers pressing" : "Sellers pressing"}</em>
      </div>
      <div class="tdash-tile pulse-${analysis.pulse}">
        <small>PULSE</small>
        <span class="tdash-tile-icon">⌁</span>
        <b>${analysis.pulse.toUpperCase()}</b>
        <div class="tdash-tile-meter">
          <i class="${analysis.pulse === "quiet" ? "on" : ""}"></i><i class="${analysis.pulse === "tradable" ? "on good" : ""}"></i><i class="${analysis.pulse === "wild" ? "on bad" : ""}"></i>
        </div>
        <em>Quiet · Tradable · Wild</em>
      </div>
    </div>

    ${tdashState.error ? `<p class="tdash-stale-note">⚠ Last update failed (${tdashEscape(tdashState.error)}) — showing data from ${tdashTimeAgo(data.fetchedAt)}.</p>` : ""}
    <p class="tdash-disclaimer">Data source: ${tdashEscape(data.source || "public market feeds")} — quotes may be delayed. Everything on this screen is descriptive market context for education — not trade signals, not financial advice.</p>
  `;

  const canvas = host.querySelector("#tdash-canvas");
  if (canvas) tdashDrawChart(canvas, data.bars, analysis);

  host.querySelector("#tdash-refresh")?.addEventListener("click", () => tdashRefresh(true));
  host.querySelector("#tdash-change")?.addEventListener("click", () => {
    progress().dashboard = null;
    saveProgress();
    tdashState.data = null;
    renderTradersDashboard();
  });
  host.querySelector("#tdash-deepdive")?.addEventListener("click", () => {
    tdashOpenModal(`${name} · Deep Dive`, tdashDeepDive(config, analysis, drivers, news, timeframe));
  });
}

/* ---------- deep dive modal ---------- */

function tdashOpenModal(title, bodyHtml) {
  document.getElementById("tdash-modal")?.remove();
  const modal = document.createElement("div");
  modal.id = "tdash-modal";
  modal.className = "tdash-modal";
  modal.innerHTML = `
    <div class="tdash-modal-card">
      <header>
        <h3>${tdashEscape(title)}</h3>
        <button type="button" id="tdash-modal-close" aria-label="Close">✕</button>
      </header>
      <div class="tdash-modal-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(modal);
  const close = () => modal.remove();
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  modal.querySelector("#tdash-modal-close").addEventListener("click", close);
}

/* ---------- keep the chart crisp on resize ---------- */

window.addEventListener("resize", () => {
  if (typeof state === "undefined" || state.currentView !== "dashboard") return;
  const canvas = document.getElementById("tdash-canvas");
  if (canvas && tdashState.data) tdashDrawChart(canvas, tdashState.data.bars, tdashState.data.analysis);
});

/* ---------- init ---------- */

(() => {
  if (typeof state !== "undefined" && state.currentView === "dashboard") renderTradersDashboard();
})();
