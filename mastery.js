/* ReplayEdge Mastery — the endgame that never ends.
   Ten mastery ranks gated by demonstrated skill AND time (streaks can't be
   rushed), spanning years of play. At Mastery V, The Gauntlet unlocks:
   a five-game marathon with one life and a 24-hour cooldown on failure. */

/* ---------- helpers ---------- */

function masteryTracksAcademyComplete() {
  return Object.values(TRACKS).filter((track) => trackBaseComplete(track)).length;
}

function masteryTracksSpecComplete() {
  return Object.values(TRACKS).filter((track) =>
    track.advanced && track.advanced.every((tier) => tier.lessons.every((lesson) => academyLessonPassed(lesson.id)))
  ).length;
}

/* ---------- rank ladder ---------- */

const MASTERY_RANKS = [
  { numeral: "I", name: "Initiate", reqs: [
    { label: "Complete 1 full Academy", target: 1, value: () => masteryTracksAcademyComplete() },
    { label: "7-day best streak", target: 7, value: () => progress().topStreak || 0 },
    { label: "100 arcade runs", target: 100, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "II", name: "Operator", reqs: [
    { label: "Complete 1 Stage 2 specialization", target: 1, value: () => masteryTracksSpecComplete() },
    { label: "14-day best streak", target: 14, value: () => progress().topStreak || 0 },
    { label: "250 arcade runs", target: 250, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "III", name: "Specialist", reqs: [
    { label: "Complete 2 full Academies", target: 2, value: () => masteryTracksAcademyComplete() },
    { label: "21-day best streak", target: 21, value: () => progress().topStreak || 0 },
    { label: "500 arcade runs", target: 500, value: () => arcadeData().runsTotal || 0 },
    { label: "18 achievements", target: 18, value: () => Object.keys(progress().achievements || {}).length }
  ]},
  { numeral: "IV", name: "Tactician", reqs: [
    { label: "Complete 2 specializations", target: 2, value: () => masteryTracksSpecComplete() },
    { label: "30-day best streak", target: 30, value: () => progress().topStreak || 0 },
    { label: "900 arcade runs", target: 900, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "V", name: "Veteran", reqs: [
    { label: "Complete 3 full Academies", target: 3, value: () => masteryTracksAcademyComplete() },
    { label: "45-day best streak", target: 45, value: () => progress().topStreak || 0 },
    { label: "1,500 arcade runs", target: 1500, value: () => arcadeData().runsTotal || 0 },
    { label: "55% lifetime win rate", target: 55, value: () => { const a = arcadeData(); return a.runsTotal >= 100 ? Math.round(((progress().lifetime?.wins || 0) / a.runsTotal) * 100) : 0; } }
  ]},
  { numeral: "VI", name: "Strategist", reqs: [
    { label: "Complete 3 specializations", target: 3, value: () => masteryTracksSpecComplete() },
    { label: "60-day best streak", target: 60, value: () => progress().topStreak || 0 },
    { label: "2,200 arcade runs", target: 2200, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "VII", name: "Desk Head", reqs: [
    { label: "Complete 4 full Academies", target: 4, value: () => masteryTracksAcademyComplete() },
    { label: "90-day best streak", target: 90, value: () => progress().topStreak || 0 },
    { label: "3,000 arcade runs", target: 3000, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "VIII", name: "Institution", reqs: [
    { label: "Complete 4 specializations", target: 4, value: () => masteryTracksSpecComplete() },
    { label: "120-day best streak", target: 120, value: () => progress().topStreak || 0 },
    { label: "4,000 arcade runs", target: 4000, value: () => arcadeData().runsTotal || 0 },
    { label: "25,000 lifetime XP", target: 25000, value: () => progress().xp || 0 }
  ]},
  { numeral: "IX", name: "Market Sage", reqs: [
    { label: "Complete all 5 Academies", target: 5, value: () => masteryTracksAcademyComplete() },
    { label: "180-day best streak", target: 180, value: () => progress().topStreak || 0 },
    { label: "5,000 arcade runs", target: 5000, value: () => arcadeData().runsTotal || 0 }
  ]},
  { numeral: "X", name: "Master of Markets", reqs: [
    { label: "Complete all 5 specializations", target: 5, value: () => masteryTracksSpecComplete() },
    { label: "365-day best streak", target: 365, value: () => progress().topStreak || 0 },
    { label: "6,500 arcade runs", target: 6500, value: () => arcadeData().runsTotal || 0 },
    { label: "50,000 lifetime XP", target: 50000, value: () => progress().xp || 0 },
    { label: "Conquer The Gauntlet", target: 1, value: () => (progress().badges || []).includes("gauntlet_champion") ? 1 : 0 }
  ]}
];

function masteryRankIndex() {
  let achieved = 0;
  for (const rank of MASTERY_RANKS) {
    const met = rank.reqs.every((req) => {
      try { return req.value() >= req.target; } catch { return false; }
    });
    if (met) achieved += 1;
    else break;
  }
  return achieved; // 0 = none, 1 = rank I achieved, ...
}

function masteryCurrentRank() {
  const index = masteryRankIndex();
  return index > 0 ? MASTERY_RANKS[index - 1] : null;
}

/* ---------- The Gauntlet ---------- */

const GAUNTLET_ROUNDS = [
  { game: "candlerush", target: 40, label: "Bank 40+ XP in Candle Rush" },
  { game: "zonesniper", target: 45, label: "Score 45+ in Zone Sniper" },
  { game: "stophunt", target: 55, label: "Escape Stop Hunt with 55+ XP" },
  { game: "gaphunter", target: 70, label: "Hunt 70+ XP in Gap Hunter" },
  { game: "traportrade", target: 80, label: "Read 80+ XP in Trap or Trade" }
];

const GAUNTLET_COOLDOWN_MS = 24 * 3600000;

function gauntletData() {
  const p = progress();
  if (!p.gauntlet || typeof p.gauntlet !== "object") p.gauntlet = {};
  return p.gauntlet;
}

function gauntletUnlocked() {
  return masteryRankIndex() >= 5;
}

function gauntletCooldownLeft() {
  const failedAt = gauntletData().failedAt || 0;
  const left = failedAt + GAUNTLET_COOLDOWN_MS - Date.now();
  return left > 0 ? left : 0;
}

function gauntletStart() {
  if (!gauntletUnlocked()) {
    showToast("The Gauntlet unlocks at Mastery V — Veteran.", "info");
    return;
  }
  if (gauntletCooldownLeft() > 0) {
    const hours = Math.ceil(gauntletCooldownLeft() / 3600000);
    showToast(`The Gauntlet is sealed for ${hours}h after your last fall.`, "info");
    return;
  }
  const gauntlet = gauntletData();
  gauntlet.active = { stage: 0, scores: [] };
  saveProgress();
  showToast("⚔️ THE GAUNTLET BEGINS — five games, one life. Round 1: Candle Rush (40+ XP).", "info");
  if (typeof arcadeSound === "function") arcadeSound("bigwin");
  setTimeout(() => openArcadeGame(GAUNTLET_ROUNDS[0].game), 900);
}

function gauntletRecordRun(gameId, xp) {
  const gauntlet = gauntletData();
  const run = gauntlet.active;
  if (!run) return;
  const round = GAUNTLET_ROUNDS[run.stage];
  if (!round || round.game !== gameId) return;

  if (xp >= round.target) {
    run.scores.push(xp);
    run.stage += 1;
    if (run.stage >= GAUNTLET_ROUNDS.length) {
      // CHAMPION
      const total = run.scores.reduce((sum, score) => sum + score, 0);
      gauntlet.active = null;
      gauntlet.bestClear = Math.max(gauntlet.bestClear || 0, total);
      gauntlet.clears = (gauntlet.clears || 0) + 1;
      const p = progress();
      p.xp += 2500;
      saveProgress();
      updateProgressUi();
      if (typeof awardBadgeOnce === "function") awardBadgeOnce("gauntlet_champion", "Gauntlet Champion", "You conquered all five rounds of The Gauntlet.");
      setTimeout(() => {
        showToast(`👑 THE GAUNTLET FALLS — ${total} total XP across five games. +2500 XP`, "success");
        if (typeof confettiBurst === "function") { confettiBurst(40); setTimeout(() => confettiBurst(40), 600); }
        if (typeof arcadeSound === "function") arcadeSound("bigwin");
        if (typeof checkAchievements === "function") checkAchievements();
      }, 800);
    } else {
      saveProgress();
      const next = GAUNTLET_ROUNDS[run.stage];
      setTimeout(() => {
        showToast(`⚔️ Round ${run.stage} cleared with ${xp} XP! Round ${run.stage + 1}: ${next.label}`, "success");
        setTimeout(() => openArcadeGame(next.game), 1400);
      }, 900);
    }
  } else {
    gauntlet.active = null;
    gauntlet.failedAt = Date.now();
    saveProgress();
    setTimeout(() => {
      showToast(`💀 The Gauntlet claims another — ${xp}/${round.target} XP in round ${run.stage + 1}. Sealed for 24 hours.`, "error");
      if (typeof arcadeSound === "function") arcadeSound("crash");
    }, 900);
  }
  if (state.currentView === "academy" && typeof renderAcademy === "function") setTimeout(renderAcademy, 2000);
}

/* ---------- academy section ---------- */

function masterySectionMarkup() {
  const rankIndex = masteryRankIndex();
  const current = masteryCurrentRank();
  const next = MASTERY_RANKS[rankIndex] || null;
  const gauntlet = gauntletData();
  const cooldown = gauntletCooldownLeft();

  const ladder = MASTERY_RANKS.map((rank, index) => `
    <span class="mastery-node ${index < rankIndex ? "done" : index === rankIndex ? "next" : ""}" title="${rank.name}">
      <b>${rank.numeral}</b>
    </span>${index < MASTERY_RANKS.length - 1 ? '<i class="mastery-link"></i>' : ""}
  `).join("");

  const nextReqs = next ? next.reqs.map((req) => {
    let value = 0;
    try { value = Math.min(req.target, req.value()); } catch {}
    const met = value >= req.target;
    const percent = Math.round((value / req.target) * 100);
    return `
      <div class="mastery-req ${met ? "met" : ""}">
        <span>${met ? "✓" : "○"} ${req.label}</span>
        <div class="dq-bar"><i style="width:${percent}%"></i></div>
        <b>${value >= 1000 ? value.toLocaleString() : value}/${req.target >= 1000 ? req.target.toLocaleString() : req.target}</b>
      </div>
    `;
  }).join("") : `<p class="tk-empty">Every rank conquered. You are the ceiling now.</p>`;

  return `
    <div class="mastery-stage">
      <div class="orderflow-head">
        <div>
          <p class="arcade-kicker">// THE LONG GAME</p>
          <h2>Mastery ${current ? `· ${current.numeral} ${current.name}` : ""}</h2>
          <p class="arcade-sub">Ten ranks earned through streaks, volume, and every market — built to take years, because real traders are. ${next ? `Next: <b>${next.numeral} ${next.name}</b>.` : ""}</p>
        </div>
      </div>
      <div class="mastery-ladder">${ladder}</div>
      <div class="mastery-panel panel">
        <div class="panel-title">${next ? `Road to ${next.name}` : "Summit reached"}</div>
        <div class="mastery-reqs">${nextReqs}</div>
      </div>
      <div class="gauntlet-panel panel ${gauntletUnlocked() ? "" : "locked"}">
        <div class="gauntlet-copy">
          <div class="panel-title">⚔️ The Gauntlet — the ultimate challenge</div>
          <p class="tk-copy">Five games. Rising score gates. One life. Fall once and it seals for 24 hours. ${gauntlet.clears ? `Conquered <b>${gauntlet.clears}×</b> · best clear <b>${gauntlet.bestClear}</b> XP.` : "Nobody said the summit was safe."}</p>
          <div class="gauntlet-rounds">
            ${GAUNTLET_ROUNDS.map((round, index) => `<span class="gauntlet-round">${index + 1}. ${round.label}</span>`).join("")}
          </div>
        </div>
        ${gauntletUnlocked()
          ? (cooldown > 0
              ? `<button class="arcade-btn ghost" type="button" disabled>Sealed · ${Math.ceil(cooldown / 3600000)}h</button>`
              : gauntlet.active
                ? `<button class="arcade-btn primary" type="button" data-gauntlet-resume>Resume · Round ${gauntlet.active.stage + 1}</button>`
                : `<button class="arcade-btn primary" type="button" data-gauntlet-start>Enter The Gauntlet</button>`)
          : `<div class="orderflow-lock"><i data-lucide="lock"></i><span>Unlocks at Mastery V · Veteran</span></div>`}
      </div>
    </div>
  `;
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-gauntlet-start]")) gauntletStart();
  if (event.target.closest("[data-gauntlet-resume]")) {
    const run = gauntletData().active;
    if (run) openArcadeGame(GAUNTLET_ROUNDS[run.stage].game);
  }
});
