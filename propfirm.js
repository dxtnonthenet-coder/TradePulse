/* ReplayEdge — Prop Firm Training Grounds.
   A full prop-firm career simulator: buy evaluation accounts with simulated dollars,
   trade a live simulated market under real prop rules (daily loss limit,
   trailing drawdown, profit target), get funded, collect payouts, and spend
   winnings in the Prize Shop on profile cosmetics.
   All money here is SIMULATED — it can never be deposited, withdrawn, or
   exchanged for anything real. */

/* ================= CONFIG ================= */

const PF_TIERS = {
  t25: {
    id: "t25", label: "25K Evaluation", size: 25000, cost: 100,
    target: 1500, dailyLoss: 500, trailing: 1000, maxContracts: 2,
    payoutShare: 0.8, minPayout: 300, blurb: "The starter desk. Tight rules, fast passes."
  },
  t50: {
    id: "t50", label: "50K Evaluation", size: 50000, cost: 500,
    target: 3000, dailyLoss: 1000, trailing: 2000, maxContracts: 5,
    payoutShare: 0.85, minPayout: 500, blurb: "Room to size up. The classic prop account."
  },
  t150: {
    id: "t150", label: "150K Evaluation", size: 150000, cost: 1000,
    target: 9000, dailyLoss: 3000, trailing: 4500, maxContracts: 10,
    payoutShare: 0.9, minPayout: 1000, blurb: "The big desk. Big targets, big payouts."
  }
};

const PF_INSTRUMENTS = {
  ES: { id: "ES", label: "S&P 500", sub: "E-mini · ES", start: 6320, tick: 0.25, tickValue: 12.5, decimals: 2, vol: 1.6 },
  NQ: { id: "NQ", label: "Nasdaq", sub: "E-mini · NQ", start: 23140, tick: 0.25, tickValue: 5, decimals: 2, vol: 6.5 },
  CL: { id: "CL", label: "Crude Oil", sub: "Futures · CL", start: 74.6, tick: 0.01, tickValue: 10, decimals: 2, vol: 1.4 },
  GC: { id: "GC", label: "Gold", sub: "Futures · GC", start: 3352, tick: 0.1, tickValue: 10, decimals: 1, vol: 1.5 },
  EURUSD: { id: "EURUSD", label: "EUR/USD", sub: "Forex · 6E", start: 1.1424, tick: 0.0001, tickValue: 12.5, decimals: 4, vol: 1.2 },
  BTC: { id: "BTC", label: "Bitcoin", sub: "Perp · BTC", start: 63850, tick: 1, tickValue: 5, decimals: 0, vol: 6 }
};

const PF_SHOP = [
  { id: "frame-bronze", kind: "frame", icon: "🥉", name: "Bronze Ring", desc: "A clean bronze ring around your avatar.", cost: 500 },
  { id: "frame-emerald", kind: "frame", icon: "💚", name: "Emerald Ring", desc: "Deep green glow — the color of profit.", cost: 1500 },
  { id: "frame-blood", kind: "frame", icon: "🩸", name: "Blood Ring", desc: "For traders who survived the drawdown.", cost: 1500 },
  { id: "frame-silver", kind: "frame", icon: "🥈", name: "Silver Ring", desc: "Polished silver with a soft pulse.", cost: 2500 },
  { id: "frame-gold", kind: "frame", icon: "🥇", name: "Gold Ring", desc: "Reserved for funded traders.", cost: 4000, requires: { evalsPassed: 1 }, reqLabel: "Pass 1 evaluation" },
  { id: "frame-aurora", kind: "frame", icon: "🌌", name: "Aurora Ring", desc: "Animated aurora — the rarest flex.", cost: 8000, requires: { payoutsCollected: 1 }, reqLabel: "Collect 1 payout" },
  { id: "title-desk", kind: "title", icon: "📈", name: "DESK VETERAN", desc: "Title badge on your profile.", cost: 750, requires: { trades: 50 }, reqLabel: "Close 50 trades" },
  { id: "title-funded", kind: "title", icon: "🎖", name: "FUNDED TRADER", desc: "The badge that says you passed.", cost: 1000, requires: { evalsPassed: 1 }, reqLabel: "Pass 1 evaluation" },
  { id: "title-paidout", kind: "title", icon: "💰", name: "PAID OUT", desc: "You didn't just pass — you collected.", cost: 2500, requires: { payoutsCollected: 1 }, reqLabel: "Collect 1 payout" },
  { id: "title-shark", kind: "title", icon: "🦈", name: "PROP SHARK", desc: "Three evaluations conquered.", cost: 10000, requires: { evalsPassed: 3 }, reqLabel: "Pass 3 evaluations" },
  { id: "chart-neon", kind: "chart", icon: "🟣", name: "Neon Candles", desc: "Violet & cyan candles on your desk.", cost: 1200 },
  { id: "chart-ice", kind: "chart", icon: "🧊", name: "Ice Candles", desc: "Cool blue & white desk theme.", cost: 1200 },
  { id: "chart-goldrush", kind: "chart", icon: "✨", name: "Gold Rush", desc: "Gold & ember candles. Pure luxury.", cost: 2000, requires: { evalsPassed: 1 }, reqLabel: "Pass 1 evaluation" }
];

const PF_CHART_THEMES = {
  default: { up: "#22c55e", down: "#ef4444", upSoft: "rgba(34,197,94,0.16)", downSoft: "rgba(239,68,68,0.16)" },
  "chart-neon": { up: "#a78bfa", down: "#22d3ee", upSoft: "rgba(167,139,250,0.16)", downSoft: "rgba(34,211,238,0.16)" },
  "chart-ice": { up: "#7dd3fc", down: "#f1f5f9", upSoft: "rgba(125,211,252,0.16)", downSoft: "rgba(241,245,249,0.12)" },
  "chart-goldrush": { up: "#f6c34e", down: "#fb7185", upSoft: "rgba(246,195,78,0.16)", downSoft: "rgba(251,113,133,0.16)" }
};

/* ================= DATA ================= */

function propfirmData() {
  const p = progress();
  if (!p.propfirm || typeof p.propfirm !== "object") {
    p.propfirm = { cash: 1000, welcomed: false, accounts: [], activeAccountId: null, cosmetics: {}, stats: {}, lastBailout: 0 };
  }
  const pf = p.propfirm;
  if (typeof pf.cash !== "number" || !isFinite(pf.cash)) pf.cash = 1000;
  if (!Array.isArray(pf.accounts)) pf.accounts = [];
  if (!pf.cosmetics || typeof pf.cosmetics !== "object") pf.cosmetics = {};
  if (!Array.isArray(pf.cosmetics.owned)) pf.cosmetics.owned = [];
  if (!pf.stats || typeof pf.stats !== "object") pf.stats = {};
  ["accountsBought", "accountsFailed", "evalsPassed", "payoutsCollected", "payoutTotal", "trades", "wins", "biggestWin"].forEach((key) => {
    if (typeof pf.stats[key] !== "number") pf.stats[key] = 0;
  });
  if (!pf.pnlDays || typeof pf.pnlDays !== "object") pf.pnlDays = {};
  return pf;
}

function pfDayStamp(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function pfMoney(value, showPlus = false) {
  const sign = value < 0 ? "-" : showPlus && value > 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function pfActiveAccount() {
  const pf = propfirmData();
  return pf.accounts.find((account) => account.id === pf.activeAccountId && (account.state === "eval" || account.state === "funded")) || null;
}

function pfRollDay(account) {
  const today = new Date().toDateString();
  if (account.dayKey !== today) {
    account.dayKey = today;
    account.dayPnl = 0;
  }
}

/* ================= ECONOMY ================= */

function pfBuyAccount(tierId) {
  const pf = propfirmData();
  const tier = PF_TIERS[tierId];
  if (!tier) return;
  if (pf.cash < tier.cost) {
    showToast(`Not enough funds — the ${tier.label} costs ${pfMoney(tier.cost)}.`, "warning");
    return;
  }
  pf.cash -= tier.cost;
  const account = {
    id: `acct_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
    tier: tierId, state: "eval", profit: 0, peak: 0,
    dayKey: new Date().toDateString(), dayPnl: 0,
    trades: 0, wins: 0, payouts: 0, createdAt: Date.now()
  };
  pf.accounts.unshift(account);
  pf.activeAccountId = account.id;
  pf.stats.accountsBought += 1;
  saveProgress();
  if (typeof arcadeSound === "function") arcadeSound("cashout");
  showToast(`🏦 ${tier.label} activated. Hit ${pfMoney(tier.target, true)} without breaking the rules.`, "success");
  if (typeof checkAchievements === "function") checkAchievements();
  pfState.tab = "desk";
  renderPropfirm();
}

function pfFailAccount(account, reason) {
  account.state = "failed";
  account.failedReason = reason;
  account.failedAt = Date.now();
  const pf = propfirmData();
  pf.stats.accountsFailed += 1;
  if (pfSim.position) pfSim.position = null;
  saveProgress();
  if (typeof arcadeSound === "function") arcadeSound("crash");
  pfState.overlay = { type: "failed", reason };
  renderPropfirm();
}

function pfPassAccount(account) {
  account.state = "funded";
  account.profit = 0;
  account.peak = 0;
  account.dayPnl = 0;
  account.fundedAt = Date.now();
  const pf = propfirmData();
  pf.stats.evalsPassed += 1;
  progress().xp += 150;
  saveProgress();
  updateProgressUi();
  if (typeof arcadeSound === "function") arcadeSound("bigwin");
  if (typeof confettiBurst === "function") confettiBurst(40);
  pfState.overlay = { type: "funded" };
  if (typeof checkAchievements === "function") checkAchievements();
  renderPropfirm();
}

function pfRequestPayout() {
  const account = pfActiveAccount();
  if (!account || account.state !== "funded") return;
  const tier = PF_TIERS[account.tier];
  if (pfSim.position) {
    showToast("Close your open position before requesting a payout.", "info");
    return;
  }
  if (account.profit < tier.minPayout) {
    showToast(`Minimum payout is ${pfMoney(tier.minPayout)} — you're at ${pfMoney(account.profit)}.`, "info");
    return;
  }
  const amount = Math.round(account.profit * tier.payoutShare);
  const pf = propfirmData();
  pf.cash += amount;
  account.payouts += 1;
  account.profit = 0;
  account.peak = 0;
  pf.stats.payoutsCollected += 1;
  pf.stats.payoutTotal += amount;
  progress().xp += 100;
  saveProgress();
  updateProgressUi();
  if (typeof arcadeSound === "function") arcadeSound("bigwin");
  if (typeof confettiBurst === "function") confettiBurst(34);
  showToast(`💰 Payout approved: ${pfMoney(amount, true)} (${Math.round(tier.payoutShare * 100)}% trader split).`, "success");
  if (typeof checkAchievements === "function") checkAchievements();
  renderPropfirm();
}

/* ---------- training rewards: the comeback loop ----------
   Blown your stake? The Academy and Arcade pay dollars, so the road back
   always runs through practice. Capped daily so it stays a grind, not a farm. */

const PF_TRAINING_REWARDS = { lesson: 25, win: 15, run: 5 };
const PF_DAILY_EARN_CAP = 150;

function propfirmTrainingReward(kind) {
  const amount = PF_TRAINING_REWARDS[kind] || 0;
  if (!amount) return;
  const pf = propfirmData();
  const today = new Date().toDateString();
  if (!pf.dayEarn || pf.dayEarn.day !== today) pf.dayEarn = { day: today, amount: 0 };
  if (pf.dayEarn.amount >= PF_DAILY_EARN_CAP) return; // cap reached — resets at midnight
  const paid = Math.min(amount, PF_DAILY_EARN_CAP - pf.dayEarn.amount);
  pf.dayEarn.amount += paid;
  pf.cash += paid;
  saveProgress();
  const capped = pf.dayEarn.amount >= PF_DAILY_EARN_CAP;
  setTimeout(() => {
    showToast(`🏦 +$${paid} earned for the Training Grounds${capped ? " — daily training cap reached ($" + PF_DAILY_EARN_CAP + ")" : ""}.`, "success");
  }, 1000);
  const cashEl = document.getElementById("prop-cash");
  if (cashEl) cashEl.textContent = pfMoney(pf.cash);
}

function pfBailoutAvailable() {
  const pf = propfirmData();
  const broke = pf.cash < 100 && !pf.accounts.some((account) => account.state === "eval" || account.state === "funded");
  return broke && Date.now() - (pf.lastBailout || 0) > 20 * 3600000;
}

function pfClaimBailout() {
  if (!pfBailoutAvailable()) return;
  const pf = propfirmData();
  pf.cash += 100;
  pf.lastBailout = Date.now();
  saveProgress();
  showToast("🚑 Rescue Fund: +$100. Trade smarter this time.", "success");
  renderPropfirm();
}

/* ================= MARKET SIM ENGINE ================= */

const pfSim = {
  instId: "ES",
  price: 0, shown: 0, anchor: 0,
  vol: 1, mom: 0,
  candles: [], candle: null,
  candleMs: 2600, tickMs: 130, speed: 1,
  timer: null, raf: null, lastFrame: 0,
  position: null, // { dir: 1|-1, qty, entry }
  scaleLo: 0, scaleHi: 1, // smoothed y-scale
  running: false
};

function pfInstrument() {
  return PF_INSTRUMENTS[pfSim.instId] || PF_INSTRUMENTS.ES;
}

function pfSimSeed(instId) {
  const inst = PF_INSTRUMENTS[instId] || PF_INSTRUMENTS.ES;
  pfSim.instId = inst.id;
  // wander the session open a little so every session feels like a new day
  pfSim.price = inst.start * (1 + (Math.random() - 0.5) * 0.012);
  pfSim.price = Math.round(pfSim.price / inst.tick) * inst.tick;
  pfSim.shown = pfSim.price;
  pfSim.anchor = pfSim.price;
  pfSim.vol = inst.vol;
  pfSim.mom = 0;
  pfSim.candles = [];
  pfSim.candle = null;
  pfSim.position = null;
  pfSim.scaleLo = 0;
  pfSim.scaleHi = 0;
  // pre-fill history so the chart opens alive, not empty
  for (let i = 0; i < 78; i += 1) {
    for (let t = 0; t < 12; t += 1) pfSimTick(true);
    pfCloseCandle();
  }
}

function pfGauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function pfSimTick(warmup = false) {
  const inst = pfInstrument();
  // regime shocks: occasional momentum bursts create real-looking runs
  if (Math.random() < 0.018) pfSim.mom += (Math.random() - 0.5) * pfSim.vol * 2.4;
  // slow anchor drift = larger structure / trend
  pfSim.anchor += pfGauss() * inst.vol * inst.tick * 0.18;
  const meanRev = (pfSim.anchor - pfSim.price) * 0.004;
  const shock = pfGauss() * pfSim.vol * inst.tick * 0.55;
  const move = pfSim.mom * inst.tick * 0.12 + meanRev + shock;
  pfSim.price = Math.max(inst.tick * 40, pfSim.price + move);
  pfSim.price = Math.round(pfSim.price / inst.tick) * inst.tick;
  // volatility clustering
  pfSim.vol = Math.min(inst.vol * 3.2, Math.max(inst.vol * 0.45, pfSim.vol * 0.988 + Math.abs(pfGauss()) * inst.vol * 0.045));
  pfSim.mom *= 0.955;

  if (!pfSim.candle) {
    pfSim.candle = { o: pfSim.price, h: pfSim.price, l: pfSim.price, c: pfSim.price, born: Date.now() };
  }
  const candle = pfSim.candle;
  candle.c = pfSim.price;
  candle.h = Math.max(candle.h, pfSim.price);
  candle.l = Math.min(candle.l, pfSim.price);

  if (!warmup) pfCheckRules();
}

function pfCloseCandle() {
  if (!pfSim.candle) return;
  pfSim.candles.push(pfSim.candle);
  if (pfSim.candles.length > 110) pfSim.candles.shift();
  pfSim.candle = { o: pfSim.price, h: pfSim.price, l: pfSim.price, c: pfSim.price, born: Date.now() };
}

function pfSimStart() {
  if (pfSim.running) return;
  pfSim.running = true;
  let sinceCandle = 0;
  pfSim.timer = setInterval(() => {
    if (typeof state !== "undefined" && state.currentView !== "propfirm") { pfSimStop(); return; }
    if (pfState.tab !== "desk") return; // market idles quietly off-desk
    pfSimTick();
    sinceCandle += pfSim.tickMs * pfSim.speed;
    if (sinceCandle >= pfSim.candleMs) { sinceCandle = 0; pfCloseCandle(); }
    pfUpdateHud();
  }, Math.round(pfSim.tickMs / pfSim.speed));
  const frame = (now) => {
    if (!pfSim.running) return;
    pfDrawChart(now);
    pfSim.raf = requestAnimationFrame(frame);
  };
  pfSim.raf = requestAnimationFrame(frame);
}

function pfSimStop() {
  pfSim.running = false;
  clearInterval(pfSim.timer);
  if (pfSim.raf) cancelAnimationFrame(pfSim.raf);
  pfSim.timer = null;
  pfSim.raf = null;
}

function pfSetSpeed(speed) {
  pfSim.speed = speed;
  pfSimStop();
  pfSimStart();
}

/* ================= TRADING ================= */

function pfOpenPnl() {
  if (!pfSim.position) return 0;
  const inst = pfInstrument();
  const pos = pfSim.position;
  return ((pfSim.price - pos.entry) / inst.tick) * inst.tickValue * pos.qty * pos.dir;
}

function pfEquity(account) {
  return account.profit + pfOpenPnl();
}

function pfOpenTrade(dir) {
  const account = pfActiveAccount();
  if (!account || pfSim.position) return;
  const tier = PF_TIERS[account.tier];
  const qty = Math.min(pfState.qty || 1, tier.maxContracts);
  pfSim.position = { dir, qty, entry: pfSim.price, openedAt: Date.now() };
  if (typeof arcadeSound === "function") arcadeSound("flip");
  pfRenderTradePanel();
}

function pfCloseTrade(auto = false) {
  const account = pfActiveAccount();
  if (!account || !pfSim.position) return;
  const pnl = Math.round(pfOpenPnl());
  pfRollDay(account);
  account.profit += pnl;
  account.dayPnl += pnl;
  account.trades += 1;
  if (pnl > 0) account.wins += 1;
  account.peak = Math.max(account.peak || 0, account.profit);
  const pf = propfirmData();
  pf.stats.trades += 1;
  if (pnl > 0) pf.stats.wins += 1;
  pf.stats.biggestWin = Math.max(pf.stats.biggestWin || 0, pnl);
  // pnl calendar: desk-wide realized pnl per day (keep ~13 months)
  const stamp = pfDayStamp();
  pf.pnlDays[stamp] = (pf.pnlDays[stamp] || 0) + pnl;
  const keys = Object.keys(pf.pnlDays).sort();
  while (keys.length > 400) delete pf.pnlDays[keys.shift()];
  pfSim.position = null;
  saveProgress();
  if (!auto && typeof arcadeSound === "function") arcadeSound(pnl >= 0 ? "cashout" : "lose");
  if (typeof checkAchievements === "function") checkAchievements();

  // eval passes on realized profit while flat
  if (account.state === "eval" && account.profit >= PF_TIERS[account.tier].target) {
    pfPassAccount(account);
    return;
  }
  pfRenderTradePanel();
  pfRenderAccountPanel();
}

function pfCheckRules() {
  const account = pfActiveAccount();
  if (!account) return;
  const tier = PF_TIERS[account.tier];
  pfRollDay(account);
  const equity = pfEquity(account);
  const dayEquity = account.dayPnl + pfOpenPnl();

  // trailing drawdown: floor trails peak equity, locks at breakeven once earned
  const livePeak = Math.max(account.peak || 0, equity);
  account.peak = livePeak;
  const floor = Math.min(livePeak, tier.trailing) === tier.trailing ? 0 : livePeak - tier.trailing;
  const trailingFloor = livePeak >= tier.trailing ? 0 : livePeak - tier.trailing;

  if (dayEquity <= -tier.dailyLoss) {
    if (pfSim.position) pfCloseTrade(true);
    pfFailAccount(account, `Daily Loss Limit hit (${pfMoney(-tier.dailyLoss)})`);
    return;
  }
  if (equity <= trailingFloor - 0.01 && (account.peak > 0 || equity < 0)) {
    if (equity <= -tier.trailing || equity <= trailingFloor) {
      if (pfSim.position) pfCloseTrade(true);
      pfFailAccount(account, `Trailing Max Drawdown breached (${pfMoney(-tier.trailing)} from peak)`);
    }
  }
}

/* ================= VIEW STATE + RENDER ================= */

const pfState = { tab: "desk", qty: 1, overlay: null, rulesOpen: false };

function pfEquippedChartTheme() {
  const theme = propfirmData().cosmetics.chartTheme;
  return PF_CHART_THEMES[theme] || PF_CHART_THEMES.default;
}

function renderPropfirm() {
  const root = document.getElementById("propfirm-root");
  if (!root) return;

  if (typeof hasAccess === "function" && !hasAccess("propfirm")) {
    pfSimStop();
    root.innerHTML = `
      <div class="prop-locked-page">
        <p class="arcade-kicker gold-kicker">// PROP FIRM TRAINING GROUNDS</p>
        <h2>Earn the desk.</h2>
        <p class="prop-locked-sub">The full prop-firm career, simulated: get staked <b>$1,000</b>, buy evaluation accounts, trade a live market under real prop rules — and if you break them, you blow the account.</p>
        <div class="elite-locked-grid">
          <div>🏦 <b>Buy Evaluations</b><span>25K, 50K, and 150K accounts with real targets and loss limits</span></div>
          <div>📉 <b>Live Trading Desk</b><span>Smooth, realistic price action across 6 instruments</span></div>
          <div>🎖 <b>Get Funded</b><span>Pass the eval, keep the same discipline, earn payouts</span></div>
          <div>🏆 <b>Prize Shop</b><span>Spend winnings on avatar frames, badges, and desk themes</span></div>
        </div>
        <button class="primary-button" type="button" id="prop-unlock-cta">Unlock with any plan — from $24.99/mo</button>
        <small>Included in Player, Coach, and Elite. Simulated dollars only — no real money is ever traded.</small>
      </div>
    `;
    root.querySelector("#prop-unlock-cta")?.addEventListener("click", () => {
      if (typeof openUpgradeModal === "function") openUpgradeModal("propfirm");
    });
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const pf = propfirmData();
  if (!pf.welcomed) {
    pf.welcomed = true;
    saveProgress();
    setTimeout(() => showToast("🏦 Welcome to the Training Grounds — you've been staked $1,000. Buy an evaluation and earn the desk.", "success"), 600);
  }
  const account = pfActiveAccount();

  root.innerHTML = `
    <div class="prop-shell">
      <header class="prop-topbar">
        <div class="prop-brand">
          <p class="arcade-kicker">// PROP FIRM TRAINING GROUNDS</p>
          <h2>Earn the desk.</h2>
        </div>
        <div class="prop-wallet" title="Training Grounds dollars are simulated — not real, never withdrawable.">
          <small>BALANCE</small>
          <strong id="prop-cash">${pfMoney(pf.cash)}</strong>
        </div>
      </header>

      <nav class="prop-tabs">
        <button class="prop-tab ${pfState.tab === "desk" ? "active" : ""}" data-pf-tab="desk" type="button">📉 Trading Desk</button>
        <button class="prop-tab ${pfState.tab === "accounts" ? "active" : ""}" data-pf-tab="accounts" type="button">🏦 My Accounts</button>
        <button class="prop-tab ${pfState.tab === "calendar" ? "active" : ""}" data-pf-tab="calendar" type="button">📅 PnL Calendar</button>
        <button class="prop-tab ${pfState.tab === "shop" ? "active" : ""}" data-pf-tab="shop" type="button">🏆 Prize Shop</button>
      </nav>

      <div id="prop-tab-body"></div>
      <p class="prop-disclaimer">All dollars in the Training Grounds are simulated game currency with no monetary value — they cannot be purchased, withdrawn, or exchanged. The market shown is a randomized simulation for practice only.</p>
    </div>
    <div id="prop-overlay-slot"></div>
  `;

  root.querySelectorAll("[data-pf-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      pfState.tab = button.dataset.pfTab;
      pfState.overlay = null;
      renderPropfirm();
    });
  });

  const body = root.querySelector("#prop-tab-body");
  if (pfState.tab === "desk") pfRenderDesk(body, account);
  else if (pfState.tab === "accounts") pfRenderAccounts(body);
  else if (pfState.tab === "calendar") pfRenderCalendar(body);
  else pfRenderShop(body);

  pfRenderOverlay();
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- desk ---------- */

function pfRenderDesk(body, account) {
  const inst = pfInstrument();
  body.innerHTML = `
    <div class="prop-desk">
      <div class="prop-chart-col">
        <div class="prop-inst-row">
          ${Object.values(PF_INSTRUMENTS).map((item) => `
            <button class="prop-inst ${item.id === pfSim.instId ? "active" : ""}" data-pf-inst="${item.id}" type="button" ${pfSim.position ? "disabled" : ""}>
              <b>${item.label}</b><small>${item.sub}</small>
            </button>
          `).join("")}
          <div class="prop-speed">
            ${[1, 2, 3].map((speed) => `<button class="prop-speed-btn ${pfSim.speed === speed ? "active" : ""}" data-pf-speed="${speed}" type="button">${speed}x</button>`).join("")}
          </div>
        </div>
        <div class="prop-chart-wrap">
          <canvas id="prop-canvas"></canvas>
          <div class="prop-chart-badge"><i></i>LIVE SIM · ${inst.label}</div>
        </div>
        <div id="prop-trade-panel"></div>
      </div>
      <aside class="prop-side" id="prop-account-panel"></aside>
    </div>
  `;

  body.querySelectorAll("[data-pf-inst]").forEach((button) => {
    button.addEventListener("click", () => {
      if (pfSim.position) return;
      pfSimSeed(button.dataset.pfInst);
      renderPropfirm();
    });
  });
  body.querySelectorAll("[data-pf-speed]").forEach((button) => {
    button.addEventListener("click", () => { pfSetSpeed(Number(button.dataset.pfSpeed)); renderPropfirm(); });
  });

  pfRenderTradePanel();
  pfRenderAccountPanel();
  pfSizeCanvas();
  pfSimStart();
}

function pfRenderTradePanel() {
  const host = document.getElementById("prop-trade-panel");
  if (!host) return;
  const account = pfActiveAccount();
  const inst = pfInstrument();

  if (!account) {
    host.innerHTML = `
      <div class="prop-locked-panel">
        <p>📋 You need an active evaluation account to trade this desk.</p>
        <button class="primary-button" type="button" id="prop-goto-buy">Get an account →</button>
      </div>
    `;
    host.querySelector("#prop-goto-buy")?.addEventListener("click", () => { pfState.tab = "accounts"; renderPropfirm(); });
    return;
  }

  const tier = PF_TIERS[account.tier];
  if (!pfSim.position) {
    host.innerHTML = `
      <div class="prop-trade-panel">
        <div class="prop-qty">
          <small>CONTRACTS</small>
          <div class="prop-qty-ctrl">
            <button type="button" id="prop-qty-minus">−</button>
            <b id="prop-qty-val">${Math.min(pfState.qty, tier.maxContracts)}</b>
            <button type="button" id="prop-qty-plus">+</button>
          </div>
          <small class="prop-qty-max">max ${tier.maxContracts}</small>
        </div>
        <button class="prop-buy" type="button" id="prop-long">▲ BUY / LONG<small id="prop-buy-px"></small></button>
        <button class="prop-sell" type="button" id="prop-short">▼ SELL / SHORT<small id="prop-sell-px"></small></button>
      </div>
    `;
    pfState.qty = Math.min(pfState.qty, tier.maxContracts);
    host.querySelector("#prop-qty-minus").addEventListener("click", () => { pfState.qty = Math.max(1, pfState.qty - 1); pfRenderTradePanel(); });
    host.querySelector("#prop-qty-plus").addEventListener("click", () => { pfState.qty = Math.min(tier.maxContracts, pfState.qty + 1); pfRenderTradePanel(); });
    host.querySelector("#prop-long").addEventListener("click", () => pfOpenTrade(1));
    host.querySelector("#prop-short").addEventListener("click", () => pfOpenTrade(-1));
  } else {
    const pos = pfSim.position;
    host.innerHTML = `
      <div class="prop-trade-panel in-trade">
        <div class="prop-pos-chip ${pos.dir > 0 ? "long" : "short"}">
          <b>${pos.dir > 0 ? "LONG" : "SHORT"} ${pos.qty}</b>
          <small>${inst.label} @ ${pos.entry.toFixed(inst.decimals)}</small>
        </div>
        <div class="prop-live-pnl" id="prop-live-pnl">$0</div>
        <button class="prop-exit" type="button" id="prop-exit">CASH OUT / EXIT <span id="prop-exit-pnl">$0</span></button>
      </div>
    `;
    host.querySelector("#prop-exit").addEventListener("click", () => pfCloseTrade());
  }
}

function pfRenderAccountPanel() {
  const host = document.getElementById("prop-account-panel");
  if (!host) return;
  const account = pfActiveAccount();
  if (!account) {
    host.innerHTML = `
      <div class="prop-acct-card empty">
        <p class="tdash-card-kicker gold">NO ACTIVE ACCOUNT</p>
        <p class="prop-empty-copy">Buy an evaluation in <b>My Accounts</b>. Pass it, get funded, collect payouts.</p>
      </div>
    `;
    return;
  }
  const tier = PF_TIERS[account.tier];
  pfRollDay(account);
  const funded = account.state === "funded";
  const targetPct = Math.max(0, Math.min(100, (account.profit / tier.target) * 100));
  host.innerHTML = `
    <div class="prop-acct-card">
      <div class="prop-acct-head">
        <div><b>${tier.label}</b><small>$${tier.size.toLocaleString()} buying power</small></div>
        <span class="prop-state ${funded ? "funded" : "eval"}">${funded ? "★ FUNDED" : "EVALUATION"}</span>
      </div>
      <div class="prop-acct-nums">
        <div><small>${funded ? "PAYOUT BALANCE" : "PROFIT"}</small><b id="prop-acct-profit">${pfMoney(account.profit, true)}</b></div>
        <div><small>OPEN P&L</small><b id="prop-acct-open">$0</b></div>
        <div><small>TODAY</small><b id="prop-acct-day">${pfMoney(account.dayPnl, true)}</b></div>
      </div>
      ${funded ? `
        <button class="primary-button prop-payout-btn" type="button" id="prop-payout">💰 Request payout (min ${pfMoney(tier.minPayout)})</button>
        <small class="prop-payout-note">Trader split: ${Math.round(tier.payoutShare * 100)}% · resets balance after payout</small>
      ` : `
        <div class="prop-meter">
          <div class="prop-meter-head"><small>PROFIT TARGET</small><small>${pfMoney(account.profit, true)} / ${pfMoney(tier.target)}</small></div>
          <div class="prop-meter-track"><i id="prop-target-fill" class="good" style="width:${targetPct}%"></i></div>
        </div>
      `}
      <div class="prop-meter">
        <div class="prop-meter-head"><small>DAILY LOSS LIMIT</small><small id="prop-dll-label">${pfMoney(tier.dailyLoss - Math.max(0, -account.dayPnl))} left</small></div>
        <div class="prop-meter-track"><i id="prop-dll-fill" class="bad" style="width:${Math.min(100, Math.max(0, (-account.dayPnl / tier.dailyLoss) * 100))}%"></i></div>
      </div>
      <div class="prop-meter">
        <div class="prop-meter-head"><small>TRAILING DRAWDOWN</small><small id="prop-dd-label"></small></div>
        <div class="prop-meter-track"><i id="prop-dd-fill" class="bad" style="width:0%"></i></div>
      </div>
      <button class="prop-rules-toggle" type="button" id="prop-rules-toggle">House rules ${pfState.rulesOpen ? "▴" : "▾"}</button>
      <ul class="prop-rules ${pfState.rulesOpen ? "open" : ""}">
        <li>Hit <b>${pfMoney(tier.target, true)}</b> realized profit to pass the evaluation.</li>
        <li>Daily loss limit: <b>${pfMoney(tier.dailyLoss)}</b>. Breach it and the account fails instantly.</li>
        <li>Trailing max drawdown: <b>${pfMoney(tier.trailing)}</b> below your equity peak (locks at $0 once earned).</li>
        <li>Max position: <b>${tier.maxContracts} contracts</b>. One position at a time.</li>
        <li>Funded accounts keep the same loss rules. Payouts pay <b>${Math.round(tier.payoutShare * 100)}%</b> of balance.</li>
        <li>Leaving the desk pauses the market. Rules are enforced live on equity.</li>
      </ul>
    </div>
  `;
  host.querySelector("#prop-payout")?.addEventListener("click", pfRequestPayout);
  host.querySelector("#prop-rules-toggle")?.addEventListener("click", () => { pfState.rulesOpen = !pfState.rulesOpen; pfRenderAccountPanel(); });
  pfUpdateHud();
}

/* live number updates without re-rendering panels */
function pfUpdateHud() {
  const account = pfActiveAccount();
  const inst = pfInstrument();
  const buyPx = document.getElementById("prop-buy-px");
  const sellPx = document.getElementById("prop-sell-px");
  if (buyPx) buyPx.textContent = (pfSim.price + inst.tick).toFixed(inst.decimals);
  if (sellPx) sellPx.textContent = (pfSim.price - inst.tick).toFixed(inst.decimals);

  const open = pfOpenPnl();
  const livePnl = document.getElementById("prop-live-pnl");
  const exitPnl = document.getElementById("prop-exit-pnl");
  if (livePnl) {
    livePnl.textContent = pfMoney(Math.round(open), true);
    livePnl.className = `prop-live-pnl ${open >= 0 ? "up" : "down"}`;
  }
  if (exitPnl) {
    exitPnl.textContent = pfMoney(Math.round(open), true);
    exitPnl.className = open >= 0 ? "up" : "down";
  }
  if (!account) return;
  const tier = PF_TIERS[account.tier];
  const openEl = document.getElementById("prop-acct-open");
  if (openEl) { openEl.textContent = pfMoney(Math.round(open), true); openEl.style.color = open > 0 ? "#22c55e" : open < 0 ? "#ef4444" : ""; }
  const dayEl = document.getElementById("prop-acct-day");
  if (dayEl) dayEl.textContent = pfMoney(Math.round(account.dayPnl + open), true);
  const profitEl = document.getElementById("prop-acct-profit");
  if (profitEl) profitEl.textContent = pfMoney(Math.round(account.profit), true);
  const dllUsed = Math.max(0, -(account.dayPnl + Math.min(0, open)));
  const dllFill = document.getElementById("prop-dll-fill");
  if (dllFill) dllFill.style.width = `${Math.min(100, (dllUsed / tier.dailyLoss) * 100)}%`;
  const dllLabel = document.getElementById("prop-dll-label");
  if (dllLabel) dllLabel.textContent = `${pfMoney(Math.max(0, tier.dailyLoss - dllUsed))} left`;
  const equity = pfEquity(account);
  const peak = Math.max(account.peak || 0, equity);
  const floor = peak >= tier.trailing ? 0 : peak - tier.trailing;
  const room = equity - floor;
  const ddFill = document.getElementById("prop-dd-fill");
  if (ddFill) ddFill.style.width = `${Math.min(100, Math.max(0, (1 - room / tier.trailing) * 100))}%`;
  const ddLabel = document.getElementById("prop-dd-label");
  if (ddLabel) ddLabel.textContent = `${pfMoney(Math.max(0, Math.round(room)))} above the floor`;
}

/* ---------- chart ---------- */

function pfSizeCanvas() {
  const canvas = document.getElementById("prop-canvas");
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = wrap.clientWidth * dpr;
  canvas.height = 380 * dpr;
  canvas.style.height = "380px";
}

function pfDrawChart(now) {
  const canvas = document.getElementById("prop-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const inst = pfInstrument();
  const theme = pfEquippedChartTheme();

  // smooth shown price toward sim price — this is what kills the choppiness
  const dt = Math.min(64, now - (pfSim.lastFrame || now));
  pfSim.lastFrame = now;
  const ease = 1 - Math.exp(-dt / 90);
  pfSim.shown += (pfSim.price - pfSim.shown) * ease;

  const shown = [...pfSim.candles.slice(-72), pfSim.candle].filter(Boolean);
  if (!shown.length) return;

  let lo = Infinity, hi = -Infinity;
  shown.forEach((candle) => { lo = Math.min(lo, candle.l); hi = Math.max(hi, candle.h); });
  if (pfSim.position) { lo = Math.min(lo, pfSim.position.entry); hi = Math.max(hi, pfSim.position.entry); }
  const pad = (hi - lo) * 0.12 || inst.tick * 10;
  lo -= pad; hi += pad;
  // smooth the scale too, so rescaling glides instead of snapping
  if (!pfSim.scaleLo && !pfSim.scaleHi) { pfSim.scaleLo = lo; pfSim.scaleHi = hi; }
  pfSim.scaleLo += (lo - pfSim.scaleLo) * ease;
  pfSim.scaleHi += (hi - pfSim.scaleHi) * ease;
  const yFor = (price) => ((pfSim.scaleHi - price) / (pfSim.scaleHi - pfSim.scaleLo)) * (height - 26) + 6;

  const axisW = 62;
  const plotW = width - axisW;
  const slot = plotW / 74;
  const bodyW = Math.max(3, slot * 0.62);

  ctx.clearRect(0, 0, width, height);

  // grid
  ctx.strokeStyle = "rgba(148,163,184,0.07)";
  ctx.lineWidth = 1;
  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "left";
  for (let i = 0; i <= 5; i += 1) {
    const price = pfSim.scaleLo + ((pfSim.scaleHi - pfSim.scaleLo) / 5) * i;
    const y = yFor(price);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke();
    ctx.fillStyle = "rgba(170,186,205,0.5)";
    ctx.fillText(price.toFixed(inst.decimals), plotW + 8, y + 3);
  }

  // candles (last one uses the eased 'shown' close so it flows)
  shown.forEach((candle, index) => {
    const isLive = index === shown.length - 1;
    const close = isLive ? pfSim.shown : candle.c;
    const high = isLive ? Math.max(candle.h, pfSim.shown) : candle.h;
    const low = isLive ? Math.min(candle.l, pfSim.shown) : candle.l;
    const x = index * slot + slot / 2;
    const up = close >= candle.o;
    ctx.strokeStyle = up ? theme.up : theme.down;
    ctx.fillStyle = up ? theme.up : theme.down;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, yFor(high));
    ctx.lineTo(x, yFor(low));
    ctx.stroke();
    const top = yFor(Math.max(candle.o, close));
    const bodyH = Math.max(1.6, Math.abs(yFor(candle.o) - yFor(close)));
    ctx.fillRect(x - bodyW / 2, top, bodyW, bodyH);
  });

  // entry line
  if (pfSim.position) {
    const pos = pfSim.position;
    const y = yFor(pos.entry);
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = pos.dir > 0 ? theme.up : theme.down;
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = pos.dir > 0 ? theme.upSoft : theme.downSoft;
    ctx.fillRect(plotW - 84, y - 10, 84, 20);
    ctx.fillStyle = pos.dir > 0 ? theme.up : theme.down;
    ctx.textAlign = "left";
    ctx.fillText(`${pos.dir > 0 ? "LONG" : "SHORT"} ${pos.entry.toFixed(inst.decimals)}`, plotW - 80, y + 3);
  }

  // last price tag
  const lastY = yFor(pfSim.shown);
  const up = pfSim.shown >= (shown[shown.length - 1]?.o ?? pfSim.shown);
  ctx.strokeStyle = "rgba(226,232,240,0.22)";
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, lastY); ctx.lineTo(plotW, lastY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = up ? theme.up : theme.down;
  ctx.fillRect(plotW + 2, lastY - 9, axisW - 4, 18);
  ctx.fillStyle = "#0a0f14";
  ctx.font = "bold 10.5px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(pfSim.shown.toFixed(inst.decimals), plotW + 7, lastY + 3.5);
}

/* ---------- accounts tab ---------- */

function pfRenderAccounts(body) {
  const pf = propfirmData();
  const active = pf.accounts.filter((account) => account.state === "eval" || account.state === "funded");
  const dead = pf.accounts.filter((account) => account.state === "failed");
  body.innerHTML = `
    <div class="prop-buy-grid">
      ${Object.values(PF_TIERS).map((tier) => `
        <div class="prop-tier-card ${tier.id === "t50" ? "featured" : ""}">
          ${tier.id === "t50" ? `<span class="prop-tier-tag">MOST POPULAR</span>` : ""}
          <h3>$${(tier.size / 1000)}K Account</h3>
          <p class="prop-tier-blurb">${tier.blurb}</p>
          <ul>
            <li>🎯 Target: <b>${pfMoney(tier.target, true)}</b></li>
            <li>🛑 Daily loss: <b>${pfMoney(tier.dailyLoss)}</b></li>
            <li>📉 Trailing DD: <b>${pfMoney(tier.trailing)}</b></li>
            <li>📦 Max ${tier.maxContracts} contracts</li>
            <li>💰 ${Math.round(tier.payoutShare * 100)}% payout split</li>
          </ul>
          <button class="primary-button prop-buy-btn" data-pf-buy="${tier.id}" type="button" ${pf.cash < tier.cost ? "disabled" : ""}>
            Buy — ${pfMoney(tier.cost)}
          </button>
        </div>
      `).join("")}
    </div>
    <p class="prop-earn-note">💡 Training pays your stake: <b>+$25</b> per Academy lesson passed · <b>+$15</b> per winning Arcade run · <b>+$5</b> per run banked — up to <b>$${PF_DAILY_EARN_CAP}/day</b>.</p>
    ${pfBailoutAvailable() ? `<button class="prop-bailout" id="prop-bailout" type="button">🚑 Broke? Claim the $100 Rescue Fund (once a day)</button>` : ""}
    ${active.length ? `
      <h3 class="prop-list-head">Active accounts</h3>
      <div class="prop-acct-list">
        ${active.map((account) => {
          const tier = PF_TIERS[account.tier];
          const selected = account.id === pf.activeAccountId;
          return `
            <button class="prop-acct-row ${selected ? "selected" : ""}" data-pf-select="${account.id}" type="button">
              <span class="prop-state ${account.state === "funded" ? "funded" : "eval"}">${account.state === "funded" ? "★ FUNDED" : "EVAL"}</span>
              <b>${tier.label}</b>
              <small>${pfMoney(account.profit, true)} ${account.state === "eval" ? `/ ${pfMoney(tier.target)}` : "payout balance"}</small>
              <em>${selected ? "ON DESK" : "put on desk →"}</em>
            </button>
          `;
        }).join("")}
      </div>
    ` : ""}
    ${dead.length ? `
      <h3 class="prop-list-head dim">Blown accounts (${dead.length})</h3>
      <div class="prop-acct-list dim">
        ${dead.slice(0, 6).map((account) => `
          <div class="prop-acct-row dead">
            <span class="prop-state failed">✕ FAILED</span>
            <b>${PF_TIERS[account.tier].label}</b>
            <small>${account.failedReason || ""}</small>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
  body.querySelectorAll("[data-pf-buy]").forEach((button) => {
    button.addEventListener("click", () => pfBuyAccount(button.dataset.pfBuy));
  });
  body.querySelectorAll("[data-pf-select]").forEach((button) => {
    button.addEventListener("click", () => {
      pf.activeAccountId = button.dataset.pfSelect;
      saveProgress();
      pfState.tab = "desk";
      renderPropfirm();
    });
  });
  body.querySelector("#prop-bailout")?.addEventListener("click", pfClaimBailout);
}

/* ---------- pnl calendar ---------- */

function pfRenderCalendar(body) {
  const pf = propfirmData();
  const now = new Date();
  const view = new Date(now.getFullYear(), now.getMonth() - (pfState.calOffset || 0), 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const isCurrentMonth = pfState.calOffset === 0 || pfState.calOffset === undefined;

  let total = 0, greenDays = 0, redDays = 0, best = 0, worst = 0, bestDay = null, worstDay = null;
  const cells = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(`<div class="prop-cal-cell empty"></div>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const stamp = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const pnl = Math.round(pf.pnlDays[stamp] || 0);
    const isToday = isCurrentMonth && day === now.getDate();
    const isFuture = isCurrentMonth && day > now.getDate();
    if (pnl > 0) { greenDays += 1; total += pnl; if (pnl > best) { best = pnl; bestDay = stamp; } }
    else if (pnl < 0) { redDays += 1; total += pnl; if (pnl < worst) { worst = pnl; worstDay = stamp; } }
    const tone = pnl > 0 ? "green" : pnl < 0 ? "red" : "flat";
    cells.push(`
      <div class="prop-cal-cell ${tone} ${isToday ? "today" : ""} ${isFuture ? "future" : ""}">
        <small>${day}</small>
        ${pnl !== 0 ? `<b>${pfMoney(pnl, true)}</b>` : `<b class="dash">—</b>`}
      </div>
    `);
  }

  const monthLabel = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const tradedDays = greenDays + redDays;
  body.innerHTML = `
    <div class="prop-cal">
      <div class="prop-cal-head">
        <div class="prop-cal-nav">
          <button type="button" id="prop-cal-prev" aria-label="Previous month">◀</button>
          <h3>${monthLabel}</h3>
          <button type="button" id="prop-cal-next" ${isCurrentMonth ? "disabled" : ""} aria-label="Next month">▶</button>
        </div>
        <div class="prop-cal-summary">
          <div class="${total > 0 ? "up" : total < 0 ? "down" : ""}"><small>MONTH P&L</small><b>${pfMoney(total, true)}</b></div>
          <div class="up"><small>GREEN DAYS</small><b>${greenDays}</b></div>
          <div class="down"><small>RED DAYS</small><b>${redDays}</b></div>
          <div><small>WIN DAY RATE</small><b>${tradedDays ? Math.round((greenDays / tradedDays) * 100) : 0}%</b></div>
          <div class="up"><small>BEST DAY</small><b>${bestDay ? pfMoney(best, true) : "—"}</b></div>
          <div class="down"><small>WORST DAY</small><b>${worstDay ? pfMoney(worst, true) : "—"}</b></div>
        </div>
      </div>
      <div class="prop-cal-grid">
        ${["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((label) => `<div class="prop-cal-dow">${label}</div>`).join("")}
        ${cells.join("")}
      </div>
      <p class="prop-cal-note">Realized desk P&L per day, across all your accounts. Consistency is the real profit target — real prop firms read this exact calendar before they trust a trader.</p>
    </div>
  `;
  body.querySelector("#prop-cal-prev").addEventListener("click", () => { pfState.calOffset = (pfState.calOffset || 0) + 1; renderPropfirm(); });
  body.querySelector("#prop-cal-next").addEventListener("click", () => { pfState.calOffset = Math.max(0, (pfState.calOffset || 0) - 1); renderPropfirm(); });
}

/* ---------- prize shop ---------- */

function pfShopUnlocked(item) {
  if (!item.requires) return true;
  const stats = propfirmData().stats;
  return Object.entries(item.requires).every(([key, value]) => (stats[key] || 0) >= value);
}

function pfRenderShop(body) {
  const pf = propfirmData();
  const cosmetics = pf.cosmetics;
  const groups = [
    { kind: "frame", title: "Avatar Frames", sub: "Rings around your profile picture — visible to friends." },
    { kind: "title", title: "Title Badges", sub: "A flex under your name on your profile." },
    { kind: "chart", title: "Desk Themes", sub: "Re-skin the candles on your trading desk." }
  ];
  body.innerHTML = groups.map((group) => `
    <h3 class="prop-list-head">${group.title} <small>${group.sub}</small></h3>
    <div class="prop-shop-grid">
      ${PF_SHOP.filter((item) => item.kind === group.kind).map((item) => {
        const owned = cosmetics.owned.includes(item.id);
        const equipped = cosmetics.frame === item.id || cosmetics.title === item.id || cosmetics.chartTheme === item.id;
        const unlocked = pfShopUnlocked(item);
        return `
          <div class="prop-shop-card ${owned ? "owned" : ""} ${equipped ? "equipped" : ""}">
            <span class="prop-shop-icon ${item.kind === "frame" ? `prop-preview ${item.id}` : ""}">${item.icon}</span>
            <b>${item.name}</b>
            <small>${item.desc}</small>
            ${!unlocked ? `<span class="prop-shop-lock">🔒 ${item.reqLabel}</span>` : ""}
            <button class="prop-shop-btn ${owned ? "ghost" : ""}" data-pf-item="${item.id}" type="button" ${!owned && (!unlocked || pf.cash < item.cost) ? "disabled" : ""}>
              ${equipped ? "Equipped ✓" : owned ? "Equip" : `Buy — ${pfMoney(item.cost)}`}
            </button>
          </div>
        `;
      }).join("")}
    </div>
  `).join("");

  body.querySelectorAll("[data-pf-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = PF_SHOP.find((entry) => entry.id === button.dataset.pfItem);
      if (!item) return;
      const cos = propfirmData().cosmetics;
      if (!cos.owned.includes(item.id)) {
        if (!pfShopUnlocked(item) || propfirmData().cash < item.cost) return;
        propfirmData().cash -= item.cost;
        cos.owned.push(item.id);
        if (typeof arcadeSound === "function") arcadeSound("cashout");
        showToast(`🛍 ${item.name} purchased!`, "success");
      }
      // equip (toggle by slot)
      if (item.kind === "frame") cos.frame = cos.frame === item.id ? null : item.id;
      if (item.kind === "title") cos.title = cos.title === item.id ? null : item.id;
      if (item.kind === "chart") cos.chartTheme = cos.chartTheme === item.id ? null : item.id;
      saveProgress();
      if (typeof updateTopbarAvatar === "function") updateTopbarAvatar();
      if (typeof competeRegister === "function") competeRegister();
      renderPropfirm();
    });
  });
}

/* ---------- overlays (fail / funded) ---------- */

function pfRenderOverlay() {
  const slot = document.getElementById("prop-overlay-slot");
  if (!slot) return;
  if (!pfState.overlay) { slot.innerHTML = ""; return; }
  const overlay = pfState.overlay;
  slot.innerHTML = `
    <div class="prop-overlay">
      <div class="prop-overlay-card ${overlay.type}">
        ${overlay.type === "failed" ? `
          <span class="prop-overlay-icon">💥</span>
          <h3>ACCOUNT FAILED</h3>
          <p>${overlay.reason}. That's the rule that kills real prop accounts every day — now it cost you simulated dollars instead of rent.</p>
          <p class="prop-comeback-note">Broke? Training pays: <b>+$25</b> per Academy lesson · <b>+$15</b> per winning Arcade run (up to $${PF_DAILY_EARN_CAP}/day).</p>
          <button class="primary-button" type="button" data-pf-overlay="accounts">Buy another account</button>
        ` : `
          <span class="prop-overlay-icon">🎉</span>
          <h3>YOU'RE FUNDED</h3>
          <p>Evaluation passed. Same rules apply — but from here, your profits become payouts. +150 XP.</p>
          <button class="primary-button" type="button" data-pf-overlay="desk">Trade the funded account</button>
        `}
      </div>
    </div>
  `;
  slot.querySelector("[data-pf-overlay]")?.addEventListener("click", (event) => {
    pfState.overlay = null;
    pfState.tab = event.target.dataset.pfOverlay;
    renderPropfirm();
  });
}

/* ================= COSMETICS ON PROFILES ================= */

function pfFrameClass() {
  return propfirmData().cosmetics.frame || "";
}

function pfTitleItem() {
  const id = propfirmData().cosmetics.title;
  return PF_SHOP.find((item) => item.id === id) || null;
}

function pfDecorateProfile() {
  const frame = pfFrameClass();
  const avatar = document.querySelector("#profile-root .av-profile");
  if (avatar && frame) avatar.classList.add("prop-frame", frame);
  const title = pfTitleItem();
  const badgeRow = document.querySelector("#profile-root .pf-badges-row");
  if (badgeRow && title && !badgeRow.querySelector(".prop-title-chip")) {
    badgeRow.insertAdjacentHTML("beforeend", `<span class="prop-title-chip">${title.icon} ${title.name}</span>`);
  }
  // Prop Firm Record — the stats every trader wants to flex
  const anchor = document.querySelector("#profile-root .pf-stats-grid");
  if (anchor && !document.getElementById("prop-record")) {
    const pf = propfirmData();
    const stats = pf.stats;
    const deskWinRate = stats.trades ? Math.round((stats.wins / stats.trades) * 100) : 0;
    anchor.insertAdjacentHTML("afterend", `
      <h3 class="pf-section-title" id="prop-record">🏦 Prop Firm Record</h3>
      <div class="pf-stats-grid prop-record-grid">
        <div class="pf-stat panel"><span class="pf-stat-icon">💵</span><div><strong>${pfMoney(pf.cash)}</strong><small>Net worth</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🎖</span><div><strong>${stats.evalsPassed}</strong><small>Evaluations passed</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">💰</span><div><strong>${pfMoney(stats.payoutTotal)}</strong><small>Total paid out · ${stats.payoutsCollected} payout${stats.payoutsCollected === 1 ? "" : "s"}</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🚀</span><div><strong>${stats.biggestWin > 0 ? pfMoney(stats.biggestWin, true) : "—"}</strong><small>Biggest single trade</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🎯</span><div><strong>${deskWinRate}%</strong><small>Desk win rate · ${stats.trades.toLocaleString()} trades</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">💥</span><div><strong>${stats.accountsFailed}</strong><small>Accounts blown</small></div></div>
      </div>
    `);
  }
}

/* override chain: decorate after the existing renderers run */
if (typeof renderProfile === "function") {
  const pfBaseRenderProfile = renderProfile;
  window.renderProfile = function () {
    pfBaseRenderProfile();
    pfDecorateProfile();
  };
}

if (typeof updateTopbarAvatar === "function") {
  const pfBaseTopbarAvatar = updateTopbarAvatar;
  window.updateTopbarAvatar = function () {
    pfBaseTopbarAvatar();
    const frame = pfFrameClass();
    const avatar = document.querySelector("#topbar-avatar .av");
    if (avatar && frame) avatar.classList.add("prop-frame", frame);
  };
}

if (typeof competeMyStats === "function") {
  const pfBaseStats = competeMyStats;
  window.competeMyStats = function () {
    const stats = pfBaseStats();
    const cosmetics = propfirmData().cosmetics;
    const title = pfTitleItem();
    if (cosmetics.frame) stats.frame = cosmetics.frame;
    if (title) stats.title = `${title.icon} ${title.name}`;
    const record = propfirmData().stats;
    stats.evalsPassed = record.evalsPassed;
    stats.simCash = Math.round(propfirmData().cash);
    stats.payoutTotal = Math.round(record.payoutTotal || 0);
    stats.biggestWin = Math.round(record.biggestWin || 0);
    return stats;
  };
}

/* ================= BIGGEST GAINERS LEADERBOARD ================= */

const pfBoard = { mode: "xp", rows: null, fetchedAt: 0, fetching: false };

const PF_GAINER_BOTS = [
  { name: "DeskWarden", simCash: 14250, frame: "frame-gold", title: "💰 PAID OUT", evalsPassed: 4 },
  { name: "FundedFox", simCash: 9800, frame: "frame-aurora", title: "🦈 PROP SHARK", evalsPassed: 3 },
  { name: "PayoutPatel", simCash: 7350, frame: "frame-silver", title: "💰 PAID OUT", evalsPassed: 2 },
  { name: "RiskRachel", simCash: 5200, frame: "frame-emerald", title: "🎖 FUNDED TRADER", evalsPassed: 2 },
  { name: "TrailingTed", simCash: 4100, frame: null, title: "🎖 FUNDED TRADER", evalsPassed: 1 },
  { name: "DrawdownDan", simCash: 3050, frame: "frame-blood", title: null, evalsPassed: 1 },
  { name: "EvalEvan", simCash: 2400, frame: "frame-bronze", title: null, evalsPassed: 1 },
  { name: "ScalpSofia", simCash: 1800, frame: null, title: null, evalsPassed: 0 },
  { name: "MicroMike", simCash: 1350, frame: null, title: null, evalsPassed: 0 },
  { name: "PaperPete", simCash: 1050, frame: null, title: null, evalsPassed: 0 }
];

async function pfFetchGainers() {
  if (pfBoard.fetching || Date.now() - pfBoard.fetchedAt < 60000) return;
  pfBoard.fetching = true;
  try {
    const response = await fetch("/api/propfirm/leaderboard");
    const json = await response.json();
    if (json.ok) {
      pfBoard.rows = json.rows || [];
      pfBoard.fetchedAt = Date.now();
      if (pfBoard.mode === "cash") pfRenderGainersBoard();
    }
  } catch { /* offline fine — bots carry the board */ }
  pfBoard.fetching = false;
}

function pfGainerRows() {
  const myCode = typeof competeData === "function" ? competeData().code : null;
  const server = (pfBoard.rows || []).filter((row) => row.code !== myCode);
  const you = {
    name: progress().signup?.name || "You",
    simCash: Math.round(propfirmData().cash),
    frame: propfirmData().cosmetics.frame || null,
    title: pfTitleItem() ? `${pfTitleItem().icon} ${pfTitleItem().name}` : null,
    evalsPassed: propfirmData().stats.evalsPassed,
    you: true
  };
  const merged = [...server, you];
  // pad with house bots so a young board still looks like a market floor
  PF_GAINER_BOTS.forEach((bot) => { if (merged.length < 12) merged.push({ ...bot }); });
  return merged.sort((a, b) => b.simCash - a.simCash).slice(0, 12);
}

function pfGainerAvatar(row, cls) {
  const frameCls = row.frame ? ` prop-frame ${row.frame}` : "";
  const img = row.you && typeof userAvatarUrl === "function" && userAvatarUrl() ? `<img src="${userAvatarUrl()}" alt="" />` : (typeof leaderboardInitials === "function" ? leaderboardInitials(row.name) : row.name[0]);
  return `<span class="${cls}${frameCls}" style="--hue:${typeof leaderboardHue === "function" ? leaderboardHue(row.name) : 150}">${img}</span>`;
}

function pfRenderGainersBoard() {
  const host = els.leaderboardFull || document.getElementById("leaderboard-full");
  if (!host) return;
  const rows = pfGainerRows();
  const top = [rows[1], rows[0], rows[2]].filter(Boolean);
  const rest = rows.slice(3);
  const maxCash = rows[0]?.simCash || 1;
  const youIndex = rows.findIndex((row) => row.you);

  const podium = top.map((row) => {
    const place = rows.indexOf(row) + 1;
    return `
      <div class="podium-slot place-${place} ${row.you ? "you" : ""}">
        ${place === 1 ? '<span class="podium-crown">👑</span>' : ""}
        ${pfGainerAvatar(row, "podium-avatar")}
        <strong class="podium-name">${row.name}</strong>
        <small class="podium-meta">${row.title ? row.title : `${row.evalsPassed || 0} evals passed`}</small>
        <b class="podium-xp cash">${pfMoney(row.simCash)}</b>
        <div class="podium-base"><span>${place}</span></div>
      </div>
    `;
  }).join("");

  const list = rest.map((row) => {
    const place = rows.indexOf(row) + 1;
    const width = Math.max(6, Math.round((row.simCash / maxCash) * 100));
    return `
      <div class="arena-row clickable ${row.you ? "you" : ""}" data-gainer-index="${rows.indexOf(row)}" role="button" tabindex="0">
        <b class="arena-place">${place}</b>
        ${pfGainerAvatar(row, "arena-avatar")}
        <span class="arena-name"><span class="arena-name-line">${row.name}${row.you ? '<i class="arena-you-tag">YOU</i>' : ""}</span><small>${row.title || `${row.evalsPassed || 0} evals passed`}</small></span>
        <span class="arena-bar"><i class="cash" style="width:${width}%"></i></span>
        <strong class="arena-xp cash">${pfMoney(row.simCash)}</strong>
      </div>
    `;
  }).join("");

  const youRow = youIndex >= 0 ? rows[youIndex] : null;
  const chase = youRow && youIndex > 2
    ? `<div class="arena-chase">You're <b>#${youIndex + 1}</b> with ${pfMoney(youRow.simCash)} — ${pfMoney(rows[youIndex - 1].simCash - youRow.simCash + 1)} behind ${rows[youIndex - 1].name}. Payouts close gaps fast.</div>`
    : youRow ? `<div class="arena-chase gold">You're on the money podium at <b>#${youIndex + 1}</b>. Defend the bag.</div>` : "";

  host.innerHTML = `
    <div class="arena-topbar">
      <span class="arena-live"><i></i> BIGGEST GAINERS · NET WORTH</span>
      <span class="arena-reset">Net worth from the <b>Prop Firm Training Grounds</b></span>
    </div>
    <div class="arena-podium">${podium}</div>
    ${chase}
    <div class="arena-list">${list}</div>
    <p class="arena-tap-hint">Tap any trader to see their record.</p>
  `;
  // podium + rows open the trader card
  host.querySelectorAll(".podium-slot").forEach((slot, index) => {
    const order = [rows[1], rows[0], rows[2]].filter(Boolean);
    slot.classList.add("clickable");
    slot.addEventListener("click", () => pfOpenTraderCard(order[index]));
  });
  host.querySelectorAll("[data-gainer-index]").forEach((rowEl) => {
    const open = () => pfOpenTraderCard(rows[Number(rowEl.dataset.gainerIndex)]);
    rowEl.addEventListener("click", open);
    rowEl.addEventListener("keydown", (event) => { if (event.key === "Enter") open(); });
  });
  pfFetchGainers();
}

/* ---------- trader card: click anyone, see their record ---------- */

function pfBotRecord(row) {
  // house traders get plausible records derived from their balance
  const seedScale = row.simCash / 1000;
  return {
    payoutTotal: Math.round(row.simCash * 0.72),
    biggestWin: Math.round(220 + seedScale * 55),
    level: Math.max(3, Math.round(seedScale * 2.4)),
    streak: Math.max(2, Math.round(seedScale * 1.1)),
    xp: Math.round(row.simCash * 2.6)
  };
}

function pfOpenTraderCard(row) {
  if (!row) return;
  if (row.you) { navigateTo("profile"); return; }
  const stats = row.code ? row : { ...row, ...pfBotRecord(row) };
  document.getElementById("prop-trader-card")?.remove();
  const modal = document.createElement("div");
  modal.id = "prop-trader-card";
  modal.className = "academy-modal";
  modal.innerHTML = `
    <div class="academy-modal-card fr-profile-card" role="dialog" aria-modal="true">
      <button class="academy-modal-close" id="prop-trader-close" type="button" aria-label="Close">✕</button>
      <div class="fr-profile-head">
        ${pfGainerAvatar(row, "av av-profile")}
        <div>
          <h2>${row.name}</h2>
          <div class="pf-badges-row">
            ${row.title ? `<span class="prop-title-chip">${row.title}</span>` : ""}
            <span class="prop-state funded">💵 ${pfMoney(row.simCash)}</span>
          </div>
          <p class="pf-joined">Prop Firm Training Grounds trader</p>
        </div>
      </div>
      <div class="pf-stats-grid fr-profile-stats">
        <div class="pf-stat panel"><span class="pf-stat-icon">💵</span><div><strong>${pfMoney(row.simCash)}</strong><small>Net worth</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🎖</span><div><strong>${row.evalsPassed || 0}</strong><small>Evaluations passed</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">💰</span><div><strong>${pfMoney(stats.payoutTotal || 0)}</strong><small>Total paid out</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🚀</span><div><strong>${stats.biggestWin ? pfMoney(stats.biggestWin, true) : "—"}</strong><small>Biggest single trade</small></div></div>
        ${stats.level ? `<div class="pf-stat panel"><span class="pf-stat-icon">⚡</span><div><strong>Lv ${stats.level}</strong><small>${(stats.xp || 0).toLocaleString()} XP</small></div></div>` : ""}
        ${stats.streak ? `<div class="pf-stat panel"><span class="pf-stat-icon">🔥</span><div><strong>${stats.streak}</strong><small>Day streak</small></div></div>` : ""}
      </div>
      ${row.code && typeof competeFollow === "function" ? `<button class="primary-button" type="button" id="prop-trader-follow">＋ Follow ${row.name}</button>` : ""}
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.remove(); });
  modal.querySelector("#prop-trader-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#prop-trader-follow")?.addEventListener("click", () => {
    competeFollow(row.code);
    modal.remove();
  });
}

function pfInjectBoardToggle() {
  const section = document.getElementById("leaderboard-view");
  if (!section) return;
  let toggle = section.querySelector("#arena-mode-toggle");
  if (!toggle) {
    toggle = document.createElement("div");
    toggle.id = "arena-mode-toggle";
    toggle.className = "arena-mode-toggle";
    section.querySelector(".section-heading")?.appendChild(toggle);
  }
  toggle.innerHTML = `
    <button class="arena-mode ${pfBoard.mode === "xp" ? "active" : ""}" data-board-mode="xp" type="button">⚡ Weekly XP Race</button>
    <button class="arena-mode ${pfBoard.mode === "cash" ? "active" : ""}" data-board-mode="cash" type="button">💰 Biggest Gainers</button>
  `;
  toggle.querySelectorAll("[data-board-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      pfBoard.mode = button.dataset.boardMode;
      renderLeaderboard();
    });
  });
  const heading = section.querySelector(".section-heading h2");
  const sub = section.querySelector(".section-heading p:not(.arcade-kicker)");
  if (heading) heading.textContent = pfBoard.mode === "cash" ? "Biggest Gainers" : "Weekly XP Race";
  if (sub) sub.textContent = pfBoard.mode === "cash"
    ? "Ranked by account net worth from the Prop Firm Training Grounds. Payouts build empires."
    : "Every lesson, every run, every streak counts. Top 3 take the podium when the week resets.";
}

if (typeof renderLeaderboard === "function") {
  const pfBaseRenderLeaderboard = renderLeaderboard;
  window.renderLeaderboard = function () {
    pfBaseRenderLeaderboard();
    pfInjectBoardToggle();
    if (pfBoard.mode === "cash") pfRenderGainersBoard();
  };
}

/* ================= ACHIEVEMENTS ================= */

if (typeof ACHIEVEMENTS !== "undefined" && Array.isArray(ACHIEVEMENTS)) {
  ACHIEVEMENTS.push(
    { id: "prop-rookie", icon: "🏦", title: "Skin in the Game", desc: "Buy your first prop firm account", target: 1, value: () => propfirmData().stats.accountsBought },
    { id: "prop-funded", icon: "💼", title: "Certified Funded", desc: "Pass a prop firm evaluation", target: 1, value: () => propfirmData().stats.evalsPassed },
    { id: "prop-payday", icon: "💰", title: "Payday", desc: "Collect a payout from a funded account", target: 1, value: () => propfirmData().stats.payoutsCollected }
  );
}

/* ================= INIT ================= */

window.addEventListener("resize", () => {
  if (typeof state !== "undefined" && state.currentView === "propfirm") pfSizeCanvas();
});

(() => {
  pfSimSeed("ES");
  if (typeof state !== "undefined" && state.currentView === "propfirm") renderPropfirm();
})();
