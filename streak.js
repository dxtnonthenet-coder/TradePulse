/* ReplayEdge Streak — the daily habit engine.
   A day counts when the user completes ≥1 lesson or arcade run (their local time).
   Reuses the existing progress fields: streak, topStreak, streakFreezes.
   Triggered from dailyBump() in achievements.js; boot check runs on load. */

const STREAK_MILESTONES = {
  3: { xp: 25 },
  7: { xp: 75, freeze: true },
  14: { xp: 150 },
  30: { xp: 300, freeze: true },
  50: { xp: 500 },
  100: { xp: 1000, freeze: true }
};

const STREAK_MESSAGES = [
  "Consistency beats intensity.",
  "Don't break the chain.",
  "Same time tomorrow.",
  "This is how traders are actually built.",
  "Momentum compounds — just like risk.",
  "Show up. The edge follows."
];

/* ---------- day math (user local time) ---------- */

function streakDayKey(offsetDays = 0) {
  return new Date(Date.now() - offsetDays * 86400000).toDateString();
}

function streakDaysBetween(fromKey, toKey) {
  const from = new Date(fromKey).setHours(0, 0, 0, 0);
  const to = new Date(toKey).setHours(0, 0, 0, 0);
  return Math.round((to - from) / 86400000);
}

/* ---------- state ---------- */

function streakSecuredToday() {
  return progress().lastStreakDate === streakDayKey();
}

function streakStatus() {
  const p = progress();
  return {
    streak: Number(p.streak || 0),
    secured: streakSecuredToday(),
    lost: Number(p.lostStreakValue || 0)
  };
}

/* ---------- streak XP multiplier: the longer the chain, the richer every win ---------- */

const STREAK_XP_TIERS = [
  { days: 100, mult: 1.3 },
  { days: 50, mult: 1.25 },
  { days: 30, mult: 1.2 },
  { days: 14, mult: 1.15 },
  { days: 7, mult: 1.1 },
  { days: 3, mult: 1.05 }
];

function streakXpMultiplier() {
  const streak = Number(progress().streak || 0);
  const tier = STREAK_XP_TIERS.find((item) => streak >= item.days);
  return tier ? tier.mult : 1;
}

function streakBoostLabel() {
  const mult = streakXpMultiplier();
  if (mult <= 1) return "";
  return `🔥 STREAK +${Math.round((mult - 1) * 100)}%`;
}

function streakNextBoostHint() {
  const streak = Number(progress().streak || 0);
  const next = [...STREAK_XP_TIERS].reverse().find((item) => streak < item.days);
  if (!next) return "";
  return `${next.days - streak} more day${next.days - streak === 1 ? "" : "s"} to +${Math.round((next.mult - 1) * 100)}% XP on everything`;
}

/* ---------- boot check: freezes cover missed days, otherwise reset ---------- */

function streakBootCheck() {
  const p = progress();
  if (!p.lastStreakDate || !p.streak) return;
  const today = streakDayKey();
  const missedDays = streakDaysBetween(p.lastStreakDate, today) - 1;
  if (missedDays <= 0) return; // active yesterday or today — intact

  const freezes = Number(p.streakFreezes || 0);
  if (missedDays <= freezes) {
    p.streakFreezes = freezes - missedDays;
    p.lastStreakDate = streakDayKey(1); // freeze bridges up to yesterday
    saveProgress();
    setTimeout(() => {
      showToast(`🧊 Streak Freeze used — your ${p.streak}-day streak survived. Complete a lesson today to keep it going.`, "success");
    }, 1400);
  } else {
    p.lostStreakValue = p.streak;
    p.streak = 0;
    p.lastStreakDate = null;
    saveProgress();
    if (typeof updateProgressUi === "function") updateProgressUi();
  }
}

/* ---------- record activity (called from dailyBump on lessons + runs) ---------- */

function streakRecordActivity() {
  const p = progress();
  const today = streakDayKey();
  if (p.lastStreakDate === today) return; // already counted — no double-counting

  if (p.lastStreakDate === streakDayKey(1)) {
    p.streak = Number(p.streak || 0) + 1;
  } else {
    p.streak = 1; // fresh start (boot check already resolved freeze gaps)
  }
  p.lastStreakDate = today;
  p.topStreak = Math.max(Number(p.topStreak || 0), p.streak);
  p.lostStreakValue = 0;
  p.streakDays = [...(p.streakDays || []), today].slice(-60);

  const milestone = STREAK_MILESTONES[p.streak];
  let bonusLine = "";
  if (milestone) {
    p.xp += milestone.xp;
    bonusLine = `Milestone! +${milestone.xp} XP`;
    if (milestone.freeze && Number(p.streakFreezes || 0) < 3) {
      p.streakFreezes = Number(p.streakFreezes || 0) + 1;
      bonusLine += " · 🧊 +1 Streak Freeze";
    }
  }
  const boostLabel = streakBoostLabel();
  if (boostLabel) {
    bonusLine += `${bonusLine ? " · " : ""}${boostLabel} XP on every lesson & game`;
  } else {
    const hint = streakNextBoostHint();
    if (hint) bonusLine += `${bonusLine ? " · " : ""}${hint}`;
  }

  saveProgress();
  if (typeof updateProgressUi === "function") updateProgressUi();
  streakCelebrate(p.streak, bonusLine, Boolean(milestone));
  if (typeof checkAchievements === "function") checkAchievements();
  if (typeof renderNotificationSlot === "function") renderNotificationSlot();
}

/* ---------- celebration pop ---------- */

function streakCelebrate(count, bonusLine = "", isMilestone = false) {
  document.getElementById("streak-pop")?.remove();
  const pop = document.createElement("div");
  pop.id = "streak-pop";
  pop.className = "streak-pop";
  pop.innerHTML = `
    <div class="streak-pop-card">
      <span class="streak-pop-flame">🔥</span>
      <strong>${count === 1 ? "Day 1 — streak started!" : `+1 Day Streak · ${count}`}</strong>
      ${bonusLine ? `<b class="streak-pop-bonus">${bonusLine}</b>` : ""}
      <small>${STREAK_MESSAGES[count % STREAK_MESSAGES.length]}</small>
      <div class="streak-week">${streakWeekMarkup()}</div>
    </div>
  `;
  document.body.appendChild(pop);
  pop.addEventListener("click", () => pop.remove());
  requestAnimationFrame(() => pop.classList.add("show"));
  if (typeof arcadeSound === "function") arcadeSound(isMilestone ? "bigwin" : "cashout");
  if (isMilestone && typeof confettiBurst === "function") confettiBurst();
  setTimeout(() => {
    pop.classList.remove("show");
    setTimeout(() => pop.remove(), 450);
  }, 3400);
}

/* ---------- mini week heatmap (Sun–Sat) ---------- */

function streakWeekMarkup() {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const done = new Set(progress().streakDays || []);
  const now = new Date();
  const dow = now.getDay();
  return labels.map((label, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - dow + i);
    const key = date.toDateString();
    const state = done.has(key) ? "done" : i > dow ? "future" : i === dow ? "pending" : "miss";
    return `<span class="wk-day ${state}"><i>${state === "done" ? "🔥" : ""}</i><b>${label}</b></span>`;
  }).join("");
}

/* ---------- init ---------- */

(() => {
  streakBootCheck();
  if (typeof updateProgressUi === "function") updateProgressUi();
  if (typeof renderNotificationSlot === "function") renderNotificationSlot();
})();
