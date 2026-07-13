/* ReplayEdge — The Daily Setup
   One shared chart puzzle per day, Wordle-style. Same seed for everyone,
   one attempt, a shareable result card. Free for all — it's the daily
   habit + viral loop. Injects its banner at the top of the Arcade hub. */

const DS_ROUNDS = 5;

/* ---------- seeded RNG (same chart for the whole world each day) ---------- */

function dsDayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dsSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dsRng(seed) {
  let s = seed >>> 0;
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- deterministic daily market ---------- */

function dsGenerateDay() {
  const rng = dsRng(dsSeed("replayedge-daily-" + dsDayKey()));
  const label = ["NQ", "ES", "CL", "GC", "BTC", "EURUSD"][Math.floor(rng() * 6)];
  let price = 100;
  let drift = (rng() - 0.5) * 0.15;
  const bars = [];
  for (let i = 0; i < 90; i += 1) {
    if (rng() < 0.12) drift = (rng() - 0.5) * 0.3;      // regime shifts
    const vol = 0.35 + rng() * 0.55;
    const open = price;
    let close = open + drift + (rng() - 0.5) * vol * 2;
    const high = Math.max(open, close) + rng() * vol * 0.6;
    const low = Math.min(open, close) - rng() * vol * 0.6;
    price = close;
    bars.push({ o: open, h: high, l: low, c: close });
  }
  // 5 decision points spread through the back half
  const points = [46, 55, 64, 73, 82];
  const rounds = points.map((at) => {
    const net = bars[at + 2].c - bars[at - 1].c;
    const range = bars[at - 1].c * 0.004;
    return { at, answer: net > range ? "up" : net < -range ? "down" : "flat" };
  });
  return { label, bars, rounds };
}

/* ---------- state ---------- */

function dsData() {
  const p = progress();
  if (!p.dailySetup || typeof p.dailySetup !== "object") p.dailySetup = { streak: 0 };
  return p.dailySetup;
}

function dsPlayedToday() {
  return dsData().date === dsDayKey();
}

const dsState = { day: null, round: 0, grid: [], open: false };

/* ---------- chart drawing ---------- */

function dsDrawChart(canvas, bars, upTo, highlightFrom) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const shown = bars.slice(Math.max(0, upTo - 34), upTo);
  const lo = Math.min(...shown.map((b) => b.l));
  const hi = Math.max(...shown.map((b) => b.h));
  const span = (hi - lo) || 1;
  const bw = W / 34;
  const y = (v) => H - 8 - ((v - lo) / span) * (H - 16);
  shown.forEach((bar, i) => {
    const x = i * bw + bw / 2;
    const globalIndex = Math.max(0, upTo - 34) + i;
    const up = bar.c >= bar.o;
    const revealed = highlightFrom !== undefined && globalIndex >= highlightFrom;
    ctx.strokeStyle = up ? "#4dffab" : "#ff5f57";
    ctx.globalAlpha = revealed ? 1 : highlightFrom !== undefined ? 0.45 : 1;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x, y(bar.h)); ctx.lineTo(x, y(bar.l)); ctx.stroke();
    ctx.fillStyle = up ? "#4dffab" : "#ff5f57";
    const top = y(Math.max(bar.o, bar.c));
    const height = Math.max(2, Math.abs(y(bar.o) - y(bar.c)));
    ctx.fillRect(x - bw * 0.32, top, bw * 0.64, height);
    if (revealed) {
      ctx.strokeStyle = "rgba(246,195,78,0.8)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - bw * 0.32 - 1.5, top - 1.5, bw * 0.64 + 3, height + 3);
    }
    ctx.globalAlpha = 1;
  });
}

/* ---------- gameplay ---------- */

function dsOpen() {
  if (dsPlayedToday()) { dsShowResult(); return; }
  dsState.day = dsGenerateDay();
  dsState.round = 0;
  dsState.grid = [];
  dsState.open = true;
  dsRenderModal();
}

function dsEnsureModal() {
  let modal = document.getElementById("ds-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "ds-modal";
  modal.className = "ds-modal hidden";
  modal.innerHTML = `
    <div class="ds-backdrop"></div>
    <section class="ds-card" role="dialog" aria-modal="true" aria-label="The Daily Setup">
      <button class="modal-close" id="ds-close" type="button" aria-label="Close">×</button>
      <div id="ds-body"></div>
    </section>`;
  document.body.appendChild(modal);
  modal.querySelector("#ds-close").addEventListener("click", dsClose);
  modal.querySelector(".ds-backdrop").addEventListener("click", dsClose);
  return modal;
}

function dsClose() {
  document.getElementById("ds-modal")?.classList.add("hidden");
  dsState.open = false;
  if (typeof renderArcade === "function" && state.currentView === "arcade") renderArcade();
}

function dsRenderModal() {
  const modal = dsEnsureModal();
  modal.classList.remove("hidden");
  const body = modal.querySelector("#ds-body");
  const round = dsState.day.rounds[dsState.round];
  body.innerHTML = `
    <p class="arcade-kicker">// THE DAILY SETUP · ${dsDayKey()}</p>
    <h2>Mystery chart. <span class="ds-green">Call the move.</span></h2>
    <p class="ds-sub">Round <b>${dsState.round + 1}/${DS_ROUNDS}</b> — where do the <b>next 3 candles</b> close?</p>
    <div class="ds-grid-dots">${[...Array(DS_ROUNDS)].map((_, i) =>
      `<i class="${i < dsState.grid.length ? (dsState.grid[i] ? "hit" : "miss") : i === dsState.round ? "live" : ""}"></i>`).join("")}</div>
    <canvas id="ds-canvas" width="620" height="240"></canvas>
    <div class="ds-btns">
      <button class="ds-btn up" type="button" data-ds-call="up">UP ▲</button>
      <button class="ds-btn flat" type="button" data-ds-call="flat">FLAT —</button>
      <button class="ds-btn down" type="button" data-ds-call="down">DOWN ▼</button>
    </div>
    <small class="ds-note">Everyone in the world gets this exact chart today. One attempt.</small>`;
  dsDrawChart(body.querySelector("#ds-canvas"), dsState.day.bars, round.at);
  body.querySelectorAll("[data-ds-call]").forEach((button) => {
    button.addEventListener("click", () => dsCall(button.dataset.dsCall));
  });
}

function dsCall(call) {
  const round = dsState.day.rounds[dsState.round];
  const hit = call === round.answer;
  dsState.grid.push(hit);
  if (typeof arcadeSound === "function") arcadeSound(hit ? "win" : "flip");

  // reveal the 3 outcome candles
  const modal = document.getElementById("ds-modal");
  const body = modal.querySelector("#ds-body");
  dsDrawChart(body.querySelector("#ds-canvas"), dsState.day.bars, round.at + 3, round.at);
  body.querySelectorAll("[data-ds-call]").forEach((button) => {
    button.disabled = true;
    button.classList.toggle("correct", button.dataset.dsCall === round.answer);
    button.classList.toggle("wrong", button.dataset.dsCall === call && !hit);
  });

  setTimeout(() => {
    dsState.round += 1;
    if (dsState.round >= DS_ROUNDS) dsFinish();
    else dsRenderModal();
  }, 1400);
}

function dsFinish() {
  const data = dsData();
  const score = dsState.grid.filter(Boolean).length;
  const yesterday = new Date(Date.now() - 86400000);
  const ykey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  data.streak = data.date === ykey ? (data.streak || 0) + 1 : 1;
  data.date = dsDayKey();
  data.score = score;
  data.grid = [...dsState.grid];
  data.plays = (data.plays || 0) + 1;
  data.best = Math.max(data.best || 0, score);

  const p = progress();
  p.xp += score * 15;
  if (score >= 3 && typeof propfirmTrainingReward === "function") propfirmTrainingReward("win");
  if (typeof dailyBump === "function") dailyBump("runs");
  saveProgress();
  if (typeof updateProgressUi === "function") updateProgressUi();
  if (score >= 4 && typeof confettiBurst === "function") confettiBurst();
  dsShowResult();
}

function dsShowResult() {
  const data = dsData();
  const modal = dsEnsureModal();
  modal.classList.remove("hidden");
  const body = modal.querySelector("#ds-body");
  const grid = data.grid || [];
  body.innerHTML = `
    <p class="arcade-kicker">// THE DAILY SETUP · ${data.date}</p>
    <h2>${data.score >= 4 ? "Sniper. 🎯" : data.score === 3 ? "Solid read." : data.score === 2 ? "Choppy day." : "The market humbled you."}</h2>
    <div class="ds-score-row">
      <div class="ds-score-big">${data.score}<small>/${DS_ROUNDS}</small></div>
      <div class="ds-grid-dots big">${grid.map((hit) => `<i class="${hit ? "hit" : "miss"}"></i>`).join("")}</div>
    </div>
    <div class="ds-result-stats">
      <div><span>DAILY STREAK</span><b>🔥 ${data.streak || 1}</b></div>
      <div><span>BEST SCORE</span><b>${data.best || data.score}/${DS_ROUNDS}</b></div>
      <div><span>REWARD</span><b>+${(data.score || 0) * 15} XP</b></div>
    </div>
    <button class="primary-button ds-share" type="button" id="ds-share">📤 Share my result</button>
    <div id="ds-share-out"></div>
    <small class="ds-note">New setup at midnight. Bring your streak back tomorrow.</small>`;
  body.querySelector("#ds-share")?.addEventListener("click", dsShareCard);
}

/* ---------- share card (the viral loop) ---------- */

function dsShareCard() {
  const data = dsData();
  const c = document.createElement("canvas");
  c.width = 1080; c.height = 1080;
  const ctx = c.getContext("2d");

  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
  bgGrad.addColorStop(0, "#0c1a12"); bgGrad.addColorStop(0.55, "#0b0e13"); bgGrad.addColorStop(1, "#07110c");
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, 1080, 1080);
  ctx.strokeStyle = "rgba(139,255,182,0.06)"; ctx.lineWidth = 1;
  for (let i = 0; i <= 1080; i += 54) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1080); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1080, i); ctx.stroke();
  }

  const black = "900 Arial Black, Arial";
  ctx.fillStyle = "#eaf6ee"; ctx.font = "900 44px 'Arial Black',Arial"; ctx.textAlign = "left";
  ctx.fillText("REPLAY", 70, 108);
  const rw = ctx.measureText("REPLAY").width;
  ctx.fillStyle = "#46f59b"; ctx.fillText("EDGE", 70 + rw, 108);
  ctx.fillStyle = "#5f7c6e"; ctx.font = "700 26px Arial"; ctx.textAlign = "right";
  ctx.fillText("THE DAILY SETUP", 1010, 104);

  ctx.textAlign = "center";
  ctx.fillStyle = "#8ba69a"; ctx.font = "700 34px Arial";
  ctx.fillText(data.date, 540, 250);
  ctx.fillStyle = "#eaf6ee"; ctx.font = "900 210px 'Arial Black',Arial";
  ctx.fillText(`${data.score}/${DS_ROUNDS}`, 540, 480);

  const grid = data.grid || [];
  const cell = 96, gap = 22;
  const total = grid.length * cell + (grid.length - 1) * gap;
  grid.forEach((hit, i) => {
    const x = 540 - total / 2 + i * (cell + gap);
    ctx.fillStyle = hit ? "#46f59b" : "#ff5f57";
    ctx.beginPath();
    ctx.roundRect(x, 560, cell, cell, 20);
    ctx.fill();
    ctx.fillStyle = "#06120c"; ctx.font = "900 54px Arial";
    ctx.fillText(hit ? "✓" : "✕", x + cell / 2, 560 + cell / 2 + 20);
  });

  ctx.fillStyle = "#f6c34e"; ctx.font = "900 52px 'Arial Black',Arial";
  ctx.fillText(`🔥 ${data.streak || 1}-DAY STREAK`, 540, 790);
  ctx.fillStyle = "#8ba69a"; ctx.font = "600 30px Arial";
  ctx.fillText("Same chart. One shot. Every day.", 540, 856);

  const pill = ctx.createLinearGradient(240, 0, 840, 0);
  pill.addColorStop(0, "#8bffb6"); pill.addColorStop(1, "#18cfa7");
  ctx.fillStyle = pill;
  ctx.beginPath(); ctx.roundRect(240, 920, 600, 92, 46); ctx.fill();
  ctx.fillStyle = "#06120c"; ctx.font = "900 40px 'Arial Black',Arial";
  ctx.fillText("▶ playreplayedge.com", 540, 980);

  c.toBlob(async (blob) => {
    const filename = `daily-setup-${data.date}.png`;
    const file = new File([blob], filename, { type: "image/png" });
    // native share sheet on mobile
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "The Daily Setup", text: `I scored ${data.score}/${DS_ROUNDS} on today's Daily Setup 🔥 playreplayedge.com` });
        return;
      } catch { /* fall through to download */ }
    }
    const url = URL.createObjectURL(blob);
    const out = document.getElementById("ds-share-out");
    if (out) {
      out.innerHTML = `
        <div class="ds-share-preview">
          <img src="${url}" alt="Daily Setup result card" />
          <small><b>Desktop:</b> right-click → Save image. <b>Phone:</b> press &amp; hold → Save.</small>
        </div>`;
    }
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }, "image/png");
}

/* ---------- arcade hub banner injection ---------- */

(() => {
  const original = typeof renderArcade === "function" ? renderArcade : null;
  if (!original) return;
  window.renderArcade = function () {
    original();
    const root = document.getElementById("arcade-root");
    if (!root || document.getElementById("ds-banner")) return;
    const played = dsPlayedToday();
    const data = dsData();
    const banner = document.createElement("button");
    banner.id = "ds-banner";
    banner.type = "button";
    banner.className = "ds-banner" + (played ? " played" : "");
    banner.innerHTML = played
      ? `<span class="ds-banner-tag">📆 THE DAILY SETUP</span>
         <b>Today: ${data.score}/${DS_ROUNDS} ${(data.grid || []).map((h) => h ? "🟩" : "🟥").join("")}</b>
         <em>🔥 ${data.streak || 1}-day streak · share your card →</em>`
      : `<span class="ds-banner-tag">📆 THE DAILY SETUP</span>
         <b>Today's mystery chart is live. One shot — same chart for everyone.</b>
         <em>Play now → +75 XP on a perfect read</em>`;
    banner.addEventListener("click", dsOpen);
    const head = root.querySelector(".arcade-head");
    head?.after(banner);
  };
  window.dsOpen = dsOpen;
})();
