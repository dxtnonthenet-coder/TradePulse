/* ReplayEdge — Growth & depth pack (loads last; wraps existing renderers)
   1. Certificates      — shareable diploma when a track's academy is done (free = viral)
   2. Economic Calendar — 2026 major US releases, injected into the Traders Dashboard
   3. Squads            — team weekly XP goal on top of the Friends system
   4. Paper Portfolio   — persistent simulated portfolio at real delayed prices (Dashboard)
   5. Prop Scaling Plan — the career ladder card in Prop Firm accounts */

/* ============ shared save lightbox ============ */

function xSaveLightbox(dataUrl, filename, title) {
  let lb = document.getElementById("x-savebox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "x-savebox";
    lb.className = "ds-modal hidden";
    lb.innerHTML = `
      <div class="ds-backdrop"></div>
      <section class="ds-card x-save-card" role="dialog" aria-modal="true">
        <button class="modal-close" type="button" aria-label="Close">×</button>
        <h3 id="x-save-title"></h3>
        <div class="x-save-frame"><img id="x-save-img" alt="Generated image" /></div>
        <p class="ds-note"><b>Desktop:</b> right-click → Save image. <b>Phone:</b> press &amp; hold → Save.</p>
        <a class="primary-button" id="x-save-dl" download>Download</a>
      </section>`;
    document.body.appendChild(lb);
    lb.querySelector(".modal-close").addEventListener("click", () => lb.classList.add("hidden"));
    lb.querySelector(".ds-backdrop").addEventListener("click", () => lb.classList.add("hidden"));
  }
  lb.querySelector("#x-save-title").textContent = title;
  lb.querySelector("#x-save-img").src = dataUrl;
  const dl = lb.querySelector("#x-save-dl");
  dl.href = dataUrl; dl.download = filename;
  lb.classList.remove("hidden");
  try {
    const a = document.createElement("a");
    a.href = dataUrl; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  } catch { /* manual save remains */ }
}

/* ============ 1. CERTIFICATES ============ */

function certTrackComplete(trackId) {
  const track = typeof TRACKS === "object" ? TRACKS[trackId] : null;
  if (!track) return false;
  const lessons = (track.tiers || []).flatMap((tier) => tier.lessons);
  return lessons.length > 0 && lessons.every((lesson) => academyLessonPassed(lesson.id));
}

function certEarned() {
  return Object.keys(typeof TRACKS === "object" ? TRACKS : {}).filter(certTrackComplete);
}

function certGenerate(trackId) {
  const track = TRACKS[trackId];
  const name = progress().signup?.name || "ReplayEdge Trader";
  const c = document.createElement("canvas");
  c.width = 1600; c.height = 1131;
  const ctx = c.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 1600, 1131);
  bg.addColorStop(0, "#0c1a12"); bg.addColorStop(0.5, "#0b0e13"); bg.addColorStop(1, "#08130d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1600, 1131);
  ctx.strokeStyle = "rgba(246,195,78,0.65)"; ctx.lineWidth = 5;
  ctx.strokeRect(46, 46, 1508, 1039);
  ctx.strokeStyle = "rgba(139,255,182,0.3)"; ctx.lineWidth = 1.5;
  ctx.strokeRect(64, 64, 1472, 1003);

  ctx.textAlign = "center";
  ctx.fillStyle = "#eaf6ee"; ctx.font = "900 54px 'Arial Black',Arial";
  const brand = "REPLAYEDGE";
  ctx.fillText(brand, 800, 108 + 60);
  ctx.fillStyle = "#5f7c6e"; ctx.font = "700 24px Arial";
  ctx.fillText("T H E   D A Y   T R A D E R ' S   O N E - S T O P   S H O P", 800, 212);
  ctx.fillStyle = "#f6c34e"; ctx.font = "700 30px Arial";
  ctx.fillText("CERTIFICATE OF COMPLETION", 800, 320);
  ctx.fillStyle = "#8ba69a"; ctx.font = "600 26px Arial";
  ctx.fillText("This certifies that", 800, 400);
  ctx.fillStyle = "#eaf6ee"; ctx.font = "900 88px 'Arial Black',Arial";
  ctx.fillText(name.slice(0, 24), 800, 512);
  ctx.strokeStyle = "rgba(70,245,155,0.5)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(430, 545); ctx.lineTo(1170, 545); ctx.stroke();
  ctx.fillStyle = "#8ba69a"; ctx.font = "600 27px Arial";
  ctx.fillText("has completed every lesson and passed every quiz of the", 800, 620);
  ctx.fillStyle = "#46f59b"; ctx.font = "900 62px 'Arial Black',Arial";
  ctx.fillText(`${track.label.toUpperCase()} ACADEMY`, 800, 712);
  const lessons = (track.tiers || []).flatMap((tier) => tier.lessons).length;
  ctx.fillStyle = "#8ba69a"; ctx.font = "600 26px Arial";
  ctx.fillText(`${lessons} lessons · ${(track.tiers || []).length} tiers · foundations through smart money`, 800, 776);
  ctx.fillStyle = "#5f7c6e"; ctx.font = "600 24px Arial";
  ctx.fillText(new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), 800, 900);
  ctx.fillStyle = "#8ba69a"; ctx.font = "italic 700 30px Georgia, serif";
  ctx.fillText("ReplayEdge Academy", 800, 980);
  ctx.strokeStyle = "rgba(141,166,158,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(620, 940); ctx.lineTo(980, 940); ctx.stroke();
  ctx.fillStyle = "#5f7c6e"; ctx.font = "600 20px Arial";
  ctx.fillText("Educational achievement — simulated training only · playreplayedge.com", 800, 1046);

  xSaveLightbox(c.toDataURL("image/png"), `replayedge-certificate-${trackId}.png`, `${track.label} Academy Certificate`);
}

// academy summary hook: claim button when the current track is complete
(() => {
  const original = typeof renderAcademy === "function" ? renderAcademy : null;
  if (!original) return;
  window.renderAcademy = function () {
    original();
    const trackId = typeof currentTrackId === "function" ? currentTrackId() : "futures";
    if (!certTrackComplete(trackId)) return;
    const summary = document.querySelector("#academy-root .academy-summary-progress");
    if (!summary || summary.querySelector(".cert-claim")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cert-claim";
    button.innerHTML = `🎓 Claim your ${TRACKS[trackId].label} certificate`;
    button.addEventListener("click", () => certGenerate(trackId));
    summary.appendChild(button);
  };
})();

// profile hook: certificates shelf
(() => {
  const original = typeof renderProfile === "function" ? renderProfile : null;
  if (!original) return;
  window.renderProfile = function () {
    original();
    const earned = certEarned();
    if (!earned.length) return;
    const host = document.getElementById("profile-root") || document.querySelector(".profile-section");
    if (!host || host.querySelector(".cert-shelf")) return;
    const shelf = document.createElement("div");
    shelf.className = "panel cert-shelf";
    shelf.innerHTML = `
      <div class="panel-title">🎓 Certificates</div>
      <div class="cert-shelf-row">
        ${earned.map((trackId) => `
          <button class="cert-badge" type="button" data-cert="${trackId}">
            <b>${TRACKS[trackId].label}</b><span>Academy Diploma</span><em>View & share →</em>
          </button>`).join("")}
      </div>`;
    host.appendChild(shelf);
    shelf.querySelectorAll("[data-cert]").forEach((button) => {
      button.addEventListener("click", () => certGenerate(button.dataset.cert));
    });
  };
})();

/* ============ 2. ECONOMIC CALENDAR (2026 majors) ============ */

const ECON_2026 = (() => {
  const events = [];
  const add = (m, d, name, impact) => events.push({ date: new Date(2026, m - 1, d), name, impact });
  // FOMC rate decisions (2nd day, statement 2pm ET) — published Fed schedule
  [[1, 28], [3, 18], [4, 29], [6, 17], [7, 29], [9, 16], [10, 28], [12, 9]].forEach(([m, d]) => add(m, d, "FOMC Rate Decision", "red"));
  // CPI releases — published BLS schedule
  [[1, 13], [2, 11], [3, 11], [4, 10], [5, 12], [6, 10], [7, 14], [8, 12], [9, 11], [10, 13], [11, 10], [12, 10]].forEach(([m, d]) => add(m, d, "CPI Inflation", "red"));
  // NFP — first Friday of each month
  for (let m = 0; m < 12; m += 1) {
    const first = new Date(2026, m, 1);
    const friday = 1 + ((5 - first.getDay() + 7) % 7);
    events.push({ date: new Date(2026, m, friday), name: "Nonfarm Payrolls (NFP)", impact: "red" });
  }
  // GDP advance estimates + quarterly PCE-adjacent
  [[1, 29], [4, 29], [7, 30], [10, 29]].forEach(([m, d]) => add(m, d, "GDP (Advance)", "orange"));
  [[1, 30], [2, 27], [3, 27], [4, 30], [5, 29], [6, 26], [7, 31], [8, 28], [9, 25], [10, 30], [11, 25], [12, 23]].forEach(([m, d]) => add(m, d, "Core PCE (Fed's gauge)", "orange"));
  return events.sort((a, b) => a.date - b.date);
})();

function econUpcoming(days = 10) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const end = now.getTime() + days * 86400000;
  return ECON_2026.filter((event) => event.date.getTime() >= now.getTime() && event.date.getTime() < end);
}

function econNextRed() {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return ECON_2026.find((event) => event.impact === "red" && event.date.getTime() >= now.getTime()) || null;
}

function econPanelMarkup() {
  const upcoming = econUpcoming(10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return `
    <section class="panel x-panel" id="x-econ">
      <div class="panel-title">🗓 Red Folder Radar <small>next 10 days</small></div>
      ${upcoming.length ? `
      <div class="x-econ-rows">
        ${upcoming.map((event) => {
          const days = Math.round((event.date.getTime() - today.getTime()) / 86400000);
          return `
            <div class="x-econ-row">
              <span class="x-econ-dot ${event.impact}"></span>
              <b>${event.name}</b>
              <small>${event.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</small>
              <em>${days === 0 ? "TODAY" : days === 1 ? "tomorrow" : `in ${days}d`}</em>
            </div>`;
        }).join("")}
      </div>` : `<p class="tk-empty">Quiet stretch — no major US releases in the next 10 days.</p>`}
      <small class="x-panel-foot">Major US releases (FOMC · CPI · NFP · GDP · PCE). Times approximate — always verify before a live session.</small>
    </section>`;
}

/* ============ 4. PAPER PORTFOLIO ============ */

function portfolioData() {
  const p = progress();
  if (!p.paperPortfolio || typeof p.paperPortfolio !== "object") {
    p.paperPortfolio = { cash: 100000, positions: [], realized: 0 };
  }
  return p.paperPortfolio;
}

async function portfolioQuote(symbol) {
  try {
    const response = await fetch(`/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=1d&interval=15m`);
    const json = await response.json();
    const bars = (json.bars || []).filter((bar) => bar.c > 0);
    return json.meta?.last || bars[bars.length - 1]?.c || null;
  } catch { return null; }
}

function portfolioPanelMarkup() {
  const pf = portfolioData();
  return `
    <section class="panel x-panel" id="x-portfolio">
      <div class="panel-title">📁 Paper Portfolio <small>persistent · real delayed prices</small></div>
      <div class="x-port-top">
        <div><span>CASH</span><b>$${pf.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div>
        <div><span>REALIZED P&L</span><b class="${pf.realized >= 0 ? "up" : "down"}">${pf.realized >= 0 ? "+" : "-"}$${Math.abs(pf.realized).toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div>
        <div><span>POSITIONS</span><b>${pf.positions.length}</b></div>
      </div>
      <div class="x-port-rows" id="x-port-rows">${pf.positions.length ? "" : `<p class="tk-empty">No holdings yet. Buy a first position below — it lives here for weeks, at real prices, with zero real risk.</p>`}</div>
      <div class="x-port-form">
        <input id="x-port-sym" type="text" placeholder="Symbol (AAPL, BTC-USD, ES=F…)" spellcheck="false" autocomplete="off" />
        <input id="x-port-qty" type="number" min="0.01" step="0.01" placeholder="Qty" />
        <button class="arcade-btn primary cp-mini" type="button" id="x-port-buy">Buy</button>
        <button class="arcade-btn ghost cp-mini" type="button" id="x-port-sell">Sell</button>
      </div>
      <small class="x-panel-foot">Fills at the latest delayed price. Educational only — not brokerage or advice.</small>
    </section>`;
}

async function portfolioRenderRows() {
  const host = document.getElementById("x-port-rows");
  const pf = portfolioData();
  if (!host || !pf.positions.length) return;
  host.innerHTML = pf.positions.map((pos) => `
    <div class="x-port-row" data-port-row="${pos.sym}">
      <b>${typeof tdashDisplaySymbol === "function" ? tdashDisplaySymbol(pos.sym) : pos.sym}</b>
      <span>${pos.qty} @ $${pos.avg.toFixed(2)}</span>
      <em data-port-live="${pos.sym}">…</em>
    </div>`).join("");
  const quotes = await Promise.all(pf.positions.map((pos) => portfolioQuote(pos.sym)));
  pf.positions.forEach((pos, i) => {
    const cell = host.querySelector(`[data-port-live="${pos.sym}"]`);
    if (!cell) return;
    const last = quotes[i];
    if (!last) { cell.textContent = "feed unavailable"; return; }
    const pnl = (last - pos.avg) * pos.qty;
    cell.innerHTML = `$${last.toFixed(2)} · <b class="${pnl >= 0 ? "up" : "down"}">${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}</b>`;
  });
}

async function portfolioTrade(side) {
  const symInput = document.getElementById("x-port-sym");
  const qtyInput = document.getElementById("x-port-qty");
  const sym = (symInput?.value || "").trim().toUpperCase();
  const qty = Number(qtyInput?.value || 0);
  if (!/^[A-Z0-9.^=-]{1,15}$/.test(sym) || !(qty > 0)) { showToast("Enter a symbol and a positive quantity.", "info"); return; }
  showToast("Getting the latest price…", "info");
  const last = await portfolioQuote(sym);
  if (!last) { showToast("No price feed for that symbol right now.", "warning"); return; }
  const pf = portfolioData();
  const cost = last * qty;
  const pos = pf.positions.find((item) => item.sym === sym);
  if (side === "buy") {
    if (cost > pf.cash) { showToast(`Not enough paper cash — that costs $${cost.toFixed(0)}.`, "warning"); return; }
    pf.cash -= cost;
    if (pos) { pos.avg = (pos.avg * pos.qty + cost) / (pos.qty + qty); pos.qty += qty; }
    else pf.positions.push({ sym, qty, avg: last });
    showToast(`Bought ${qty} ${sym} @ $${last.toFixed(2)}`, "success");
  } else {
    if (!pos || pos.qty < qty) { showToast("You don't hold that much to sell.", "warning"); return; }
    pf.cash += cost;
    pf.realized += (last - pos.avg) * qty;
    pos.qty = Math.round((pos.qty - qty) * 10000) / 10000;
    if (pos.qty <= 0) pf.positions = pf.positions.filter((item) => item !== pos);
    showToast(`Sold ${qty} ${sym} @ $${last.toFixed(2)}`, "success");
  }
  if (pf.positions.length > 20) pf.positions = pf.positions.slice(0, 20);
  saveProgress();
  xInjectDashboardPanels(true);
}

/* dashboard injection: calendar + portfolio live OUTSIDE #tdash-live so refreshes don't wipe them */
function xInjectDashboardPanels(force) {
  const root = document.getElementById("dashboard-root");
  if (!root || typeof hasAccess !== "function" || !hasAccess("tradersDashboard")) return;
  if (!root.querySelector("#tdash-live")) return; // setup screen — wait for launch
  if (force) { root.querySelector("#x-econ")?.remove(); root.querySelector("#x-portfolio")?.remove(); }
  if (root.querySelector("#x-econ")) return;
  const wrap = document.createElement("div");
  wrap.className = "x-dash-grid";
  wrap.innerHTML = econPanelMarkup() + portfolioPanelMarkup();
  root.appendChild(wrap);
  wrap.querySelector("#x-port-buy")?.addEventListener("click", () => portfolioTrade("buy"));
  wrap.querySelector("#x-port-sell")?.addEventListener("click", () => portfolioTrade("sell"));
  portfolioRenderRows();
}

(() => {
  const original = typeof renderTradersDashboard === "function" ? renderTradersDashboard : null;
  if (!original) return;
  window.renderTradersDashboard = function () {
    original();
    setTimeout(() => xInjectDashboardPanels(true), 60);
  };
})();

/* ============ 3. SQUADS ============ */

function squadData() {
  const p = progress();
  if (!p.squad || typeof p.squad !== "object") p.squad = { name: "", codes: [], goal: 2000 };
  return p.squad;
}

function squadCardMarkup() {
  const squad = squadData();
  const compete = typeof competeData === "function" ? competeData() : { following: [] };
  const following = Array.isArray(compete.following) ? compete.following : [];
  if (!squad.codes.length) {
    return `
      <div class="panel x-squad" id="x-squad">
        <div class="panel-title">🛡 Your Squad <small>team weekly XP goal</small></div>
        ${following.length ? `
          <p class="tk-copy">Pick up to 4 traders you follow. Your combined weekly XP chases one shared goal — nobody wants to be the one who didn't show up.</p>
          <div class="x-squad-picks">
            ${following.slice(0, 8).map((friend) => `
              <label class="x-squad-pick"><input type="checkbox" data-squad-pick="${friend.code}" /> ${friend.name || friend.code}</label>`).join("")}
          </div>
          <div class="x-squad-form">
            <input id="x-squad-name" type="text" maxlength="20" placeholder="Squad name (e.g. Liquidity Hunters)" />
            <button class="arcade-btn primary cp-mini" type="button" id="x-squad-create">Form squad</button>
          </div>` : `
          <p class="tk-empty">Follow a few traders first — then form a squad and grind a shared weekly XP goal together.</p>`}
      </div>`;
  }
  const members = squad.codes.map((code) => following.find((friend) => friend.code === code)).filter(Boolean);
  const teamXp = members.reduce((sum, member) => sum + Number(member.weeklyXp || 0), 0) +
    (typeof eliteXpByDay === "function" ? eliteXpByDay(7).reduce((sum, value) => sum + value, 0) : 0);
  const pct = Math.min(100, Math.round((teamXp / Math.max(1, squad.goal)) * 100));
  return `
    <div class="panel x-squad" id="x-squad">
      <div class="panel-title">🛡 ${squad.name || "Your Squad"} <small>${members.length + 1} traders</small>
        <button class="tk-resolve x-squad-disband" type="button" id="x-squad-disband" title="Disband">✕</button>
      </div>
      <div class="x-squad-bar"><i style="width:${pct}%" class="${pct >= 100 ? "hit" : ""}"></i></div>
      <div class="x-squad-meta">
        <b>${teamXp.toLocaleString()} / <input type="number" id="x-squad-goal" value="${squad.goal}" min="100" step="100" /> XP</b>
        <span>${pct >= 100 ? "🏆 Goal crushed — raise it!" : `${pct}% — every lesson and run counts`}</span>
      </div>
      <div class="x-squad-members">
        <span class="x-squad-chip you">You</span>
        ${members.map((member) => `<span class="x-squad-chip">${member.name || member.code} · ${Number(member.weeklyXp || 0).toLocaleString()}</span>`).join("")}
      </div>
    </div>`;
}

function xBindSquad(root) {
  root.querySelector("#x-squad-create")?.addEventListener("click", () => {
    const picks = [...root.querySelectorAll("[data-squad-pick]:checked")].map((input) => input.dataset.squadPick).slice(0, 4);
    if (!picks.length) { showToast("Pick at least one squadmate.", "info"); return; }
    const squad = squadData();
    squad.codes = picks;
    squad.name = (root.querySelector("#x-squad-name")?.value || "").trim() || "The Squad";
    saveProgress();
    renderCompete();
    showToast(`🛡 ${squad.name} formed. Go get that XP.`, "success");
  });
  root.querySelector("#x-squad-disband")?.addEventListener("click", () => {
    progress().squad = { name: "", codes: [], goal: 2000 };
    saveProgress();
    renderCompete();
  });
  root.querySelector("#x-squad-goal")?.addEventListener("change", (event) => {
    squadData().goal = Math.max(100, Number(event.target.value) || 2000);
    saveProgress();
    renderCompete();
  });
}

(() => {
  const original = typeof renderCompete === "function" ? renderCompete : null;
  if (!original) return;
  window.renderCompete = function () {
    original();
    const root = document.getElementById("compete-root");
    if (!root || root.querySelector("#x-squad")) return;
    const holder = document.createElement("div");
    holder.innerHTML = squadCardMarkup();
    root.prepend(holder.firstElementChild);
    xBindSquad(root);
  };
})();

/* ============ 5. PROP FIRM SCALING PLAN ============ */

(() => {
  const original = typeof renderPropfirm === "function" ? renderPropfirm : null;
  if (!original) return;
  window.renderPropfirm = function () {
    original();
    const grid = document.querySelector("#propfirm-root .prop-buy-grid");
    if (!grid || document.getElementById("x-scaling")) return;
    const pf = typeof propfirmData === "function" ? propfirmData() : { stats: {} };
    const payouts = Number(pf.stats?.payoutsCollected || 0);
    const stage = payouts >= 6 ? 3 : payouts >= 3 ? 2 : payouts >= 1 ? 1 : 0;
    const stages = [
      { label: "PROVE IT", detail: "Pass your first eval and collect a payout", target: "1 payout" },
      { label: "STACK", detail: "Run multiple accounts at once — pros diversify", target: "3 payouts" },
      { label: "SCALE", detail: "Graduate to the $150K desk", target: "6 payouts" },
      { label: "APEX", detail: "Top of the Biggest Gainers board", target: "∞" }
    ];
    const card = document.createElement("div");
    card.id = "x-scaling";
    card.className = "panel x-scaling";
    card.innerHTML = `
      <div class="panel-title">🪜 Your Scaling Plan <small>${payouts} payout${payouts === 1 ? "" : "s"} collected — you can run several accounts at once</small></div>
      <div class="x-scale-track">
        ${stages.map((item, i) => `
          <div class="x-scale-stage ${i < stage ? "done" : i === stage ? "live" : ""}">
            <b>${i < stage ? "✓" : i + 1}</b>
            <strong>${item.label}</strong>
            <span>${item.detail}</span>
            <em>${item.target}</em>
          </div>`).join(`<i class="x-scale-link"></i>`)}
      </div>`;
    grid.after(card);
  };
})();
