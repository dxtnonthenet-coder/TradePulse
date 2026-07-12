/* ReplayEdge Achievements — universal achievements + rotating daily quests.
   The dopamine ledger: every action feeds a bar somewhere. */

const ACHIEVEMENTS = [
  { id: "first-steps", icon: "🎓", title: "First Steps", desc: "Pass your first Academy lesson", target: 1, value: () => achievementLessonCount() },
  { id: "scholar", icon: "📚", title: "Scholar", desc: "Pass 10 lessons", target: 10, value: () => achievementLessonCount() },
  { id: "professor", icon: "🧠", title: "Professor", desc: "Pass 50 lessons", target: 50, value: () => achievementLessonCount() },
  { id: "polyglot", icon: "🌐", title: "Market Polyglot", desc: "Pass a lesson in 3 different markets", target: 3, value: () => achievementTracksTouched() },
  { id: "world-trader", icon: "🌍", title: "World Trader", desc: "Pass a lesson in all 5 markets", target: 5, value: () => achievementTracksTouched() },
  { id: "tier-graduate", icon: "🏅", title: "Tier Graduate", desc: "Complete every lesson in a tier", target: 1, value: () => achievementTiersCompleted() },
  { id: "track-graduate", icon: "🎖", title: "Academy Graduate", desc: "Complete a full market track", target: 1, value: () => achievementTracksCompleted() },
  { id: "flow-initiate", icon: "🌊", title: "Flow Initiate", desc: "Pass your first Orderflow lesson", target: 1, value: () => ORDERFLOW_TIERS.flatMap((t) => t.lessons).filter((l) => academyLessonPassed(l.id)).length },
  { id: "tape-reader", icon: "📼", title: "Tape Reader", desc: "Complete the entire Orderflow stage", target: 10, value: () => ORDERFLOW_TIERS.flatMap((t) => t.lessons).filter((l) => academyLessonPassed(l.id)).length },
  { id: "first-run", icon: "🕹", title: "Insert Coin", desc: "Play your first Arcade run", target: 1, value: () => arcadeData().runsTotal || 0 },
  { id: "grinder", icon: "⚙️", title: "The Grind", desc: "Play 50 Arcade runs", target: 50, value: () => arcadeData().runsTotal || 0 },
  { id: "arcade-legend", icon: "👾", title: "Arcade Legend", desc: "Play 200 Arcade runs", target: 200, value: () => arcadeData().runsTotal || 0 },
  { id: "banker", icon: "🏦", title: "The Banker", desc: "Bank 25 winning runs", target: 25, value: () => (progress().lifetime?.wins || 0) },
  { id: "high-roller", icon: "💰", title: "High Roller", desc: "Bank 150+ XP in a single run", target: 1, value: () => Math.max(0, ...Object.values(arcadeData().best || {})) >= 150 ? 1 : 0 },
  { id: "streak-3", icon: "🔥", title: "Warming Up", desc: "Reach a 3-day streak", target: 3, value: () => Math.max(progress().streak || 0, progress().topStreak || 0) },
  { id: "streak-7", icon: "🔥", title: "On Fire", desc: "Reach a 7-day streak", target: 7, value: () => Math.max(progress().streak || 0, progress().topStreak || 0) },
  { id: "streak-30", icon: "☄️", title: "Unstoppable", desc: "Reach a 30-day streak", target: 30, value: () => Math.max(progress().streak || 0, progress().topStreak || 0) },
  { id: "funded", icon: "🏆", title: "Funded", desc: "Pass the Prop Run evaluation", target: 1, value: () => (progress().badges || []).includes("prop_run_funded") ? 1 : 0 },
  { id: "perfect-discipline", icon: "🛡", title: "Perfect Discipline", desc: "Clear Risk Mines without a single account-killer", target: 1, value: () => (progress().badges || []).includes("mines_perfect") ? 1 : 0 },
  { id: "social", icon: "🤝", title: "Trading Buddy", desc: "Follow your first trader", target: 1, value: () => (progress().compete?.following || []).length },
  { id: "squad", icon: "👥", title: "The Desk", desc: "Follow 3 traders", target: 3, value: () => (progress().compete?.following || []).length },
  { id: "quest-partner", icon: "🎯", title: "Quest Partner", desc: "Complete a Friend Quest", target: 1, value: () => progress().friendQuestsCompleted || 0 },
  { id: "level-10", icon: "⚡", title: "Double Digits", desc: "Reach Level 10", target: 10, value: () => levelFromXp(progress().xp) },
  { id: "level-25", icon: "💎", title: "Veteran", desc: "Reach Level 25", target: 25, value: () => levelFromXp(progress().xp) },
  { id: "xp-10k", icon: "🚀", title: "Ten Thousand Club", desc: "Earn 10,000 lifetime XP", target: 10000, value: () => progress().xp || 0 },
  { id: "specialist", icon: "🔬", title: "Specialist", desc: "Complete a Stage 2 specialization", target: 1, value: () => typeof masteryTracksSpecComplete === "function" ? masteryTracksSpecComplete() : 0 },
  { id: "mastery-3", icon: "🥋", title: "Rising Master", desc: "Reach Mastery III — Specialist", target: 3, value: () => typeof masteryRankIndex === "function" ? masteryRankIndex() : 0 },
  { id: "gauntlet-champ", icon: "👑", title: "Gauntlet Champion", desc: "Conquer all five rounds of The Gauntlet", target: 1, value: () => (progress().badges || []).includes("gauntlet_champion") ? 1 : 0 }
];

/* ---------- helpers ---------- */

function achievementLessonCount() {
  const p = progress();
  return Object.keys(p.academy?.lessons || {}).length;
}

function achievementTracksTouched() {
  const lessons = progress().academy?.lessons || {};
  const prefixes = new Set();
  Object.keys(lessons).forEach((id) => {
    if (id.startsWith("fx-")) prefixes.add("fx");
    else if (id.startsWith("st-")) prefixes.add("st");
    else if (id.startsWith("op-")) prefixes.add("op");
    else if (id.startsWith("cr-")) prefixes.add("cr");
    else if (!id.startsWith("of-")) prefixes.add("fut");
  });
  return prefixes.size;
}

function achievementTiersCompleted() {
  return Object.values(TRACKS).flatMap((track) => track.tiers)
    .filter((tier) => tier.lessons.every((lesson) => academyLessonPassed(lesson.id))).length;
}

function achievementTracksCompleted() {
  return Object.values(TRACKS)
    .filter((track) => track.tiers.every((tier) => tier.lessons.every((lesson) => academyLessonPassed(lesson.id)))).length;
}

function achievementsUnlocked() {
  const p = progress();
  if (!p.achievements || typeof p.achievements !== "object") p.achievements = {};
  return p.achievements;
}

/* ---------- unlock engine ---------- */

function checkAchievements() {
  const unlocked = achievementsUnlocked();
  let newUnlock = false;
  ACHIEVEMENTS.forEach((achievement) => {
    if (unlocked[achievement.id]) return;
    let value = 0;
    try { value = achievement.value(); } catch { return; }
    if (value >= achievement.target) {
      unlocked[achievement.id] = Date.now();
      progress().xp += 50;
      newUnlock = true;
      setTimeout(() => {
        showToast(`🏆 Achievement unlocked: ${achievement.title} (+50 XP)`, "success");
        if (typeof arcadeSound === "function") arcadeSound("bigwin");
        confettiBurst();
      }, 350);
    }
  });
  if (newUnlock) {
    saveProgress();
    updateProgressUi();
    if (state.currentView === "achievements") renderAchievements();
  }
}

/* ---------- confetti ---------- */

function confettiBurst(count = 26) {
  const colors = ["#4dffab", "#7c5cff", "#f6c34e", "#58c7ff", "#ff5f6e"];
  const holder = document.createElement("div");
  holder.className = "confetti-holder";
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${8 + Math.random() * 84}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.25}s`;
    piece.style.animationDuration = `${1 + Math.random() * 0.9}s`;
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    piece.style.setProperty("--spin", `${Math.round(Math.random() * 720)}deg`);
    holder.appendChild(piece);
  }
  document.body.appendChild(holder);
  setTimeout(() => holder.remove(), 2400);
}

/* ---------- daily quests ---------- */

const DAILY_QUEST_POOL = [
  { id: "q-lessons", icon: "graduation-cap", label: "Pass 2 Academy lessons", metric: "lessons", target: 2, xp: 75 },
  { id: "q-lesson1", icon: "book-open", label: "Pass 1 Academy lesson", metric: "lessons", target: 1, xp: 50 },
  { id: "q-runs", icon: "gamepad-2", label: "Play 3 Arcade runs", metric: "runs", target: 3, xp: 75 },
  { id: "q-run1", icon: "joystick", label: "Play 1 Arcade run", metric: "runs", target: 1, xp: 40 },
  { id: "q-wins", icon: "trophy", label: "Bank 2 winning runs", metric: "wins", target: 2, xp: 90 },
  { id: "q-win1", icon: "piggy-bank", label: "Bank 1 winning run", metric: "wins", target: 1, xp: 50 },
  { id: "q-xp", icon: "zap", label: "Earn 80 XP today", metric: "xp", target: 80, xp: 60 },
  { id: "q-mixed", icon: "flame", label: "1 lesson + 1 run in one session", metric: "mixed", target: 2, xp: 80 },
  { id: "q-trainer", icon: "dumbbell", label: "Complete a Trainer drill", metric: "trainer", target: 1, xp: 70 },
  { id: "q-cheer", icon: "hand-heart", label: "Send a friend a cheer 👏", metric: "cheer", target: 1, xp: 50 }
];

function dailyKey() {
  return new Date().toDateString();
}

function dailyData() {
  const p = progress();
  if (!p.daily || p.daily.day !== dailyKey()) {
    p.daily = { day: dailyKey(), lessons: 0, runs: 0, wins: 0, xp: 0, claimed: [] };
  }
  return p.daily;
}

function todaysQuests() {
  const seed = Math.floor(Date.now() / 86400000);
  const pool = [...DAILY_QUEST_POOL];
  const picked = [];
  let cursor = seed;
  while (picked.length < 3 && pool.length) {
    cursor = (cursor * 9301 + 49297) % 233280;
    picked.push(pool.splice(cursor % pool.length, 1)[0]);
  }
  return picked;
}

function questProgressValue(quest, daily) {
  if (quest.metric === "mixed") return Math.min(1, daily.lessons) + Math.min(1, daily.runs);
  return daily[quest.metric] || 0;
}

function dailyBump(metric, amount = 1) {
  const daily = dailyData();
  daily[metric] = (daily[metric] || 0) + amount;
  if ((metric === "lessons" || metric === "runs") && typeof friendQuestBump === "function") friendQuestBump();
  if ((metric === "lessons" || metric === "runs") && typeof streakRecordActivity === "function") streakRecordActivity();
  if (metric === "runs") daily.xp = daily.xp; // xp bumped separately
  // auto-claim completed quests
  todaysQuests().forEach((quest) => {
    if (daily.claimed.includes(quest.id)) return;
    if (questProgressValue(quest, daily) >= quest.target) {
      daily.claimed.push(quest.id);
      progress().xp += quest.xp;
      setTimeout(() => {
        showToast(`✅ Daily challenge complete: ${quest.label} (+${quest.xp} XP)`, "success");
        if (typeof arcadeSound === "function") arcadeSound("cashout");
      }, 700);
    }
  });
  if (!daily.sweep && daily.claimed.length >= 3) {
    daily.sweep = true;
    progress().xp += 50;
    setTimeout(() => {
      showToast("🎉 DAILY SWEEP — all three challenges cleared! +50 bonus XP", "success");
      if (typeof confettiBurst === "function") confettiBurst();
      if (typeof arcadeSound === "function") arcadeSound("bigwin");
    }, 1400);
  }
  saveProgress();
  updateProgressUi();
  renderDailyQuests();
}

function renderDailyQuests() {
  const root = document.getElementById("home-quests");
  if (!root) return;
  const daily = dailyData();
  const quests = todaysQuests();
  const doneCount = quests.filter((quest) => daily.claimed.includes(quest.id)).length;
  root.innerHTML = `
    <div class="home-block-head">
      <div>
        <p class="arcade-kicker">// DAILY CHALLENGES</p>
        <h2>Today's wins.</h2>
      </div>
      <span class="dq-counter">${doneCount}/${quests.length} done · sweep all 3 for +50 bonus · resets at midnight</span>
    </div>
    <div class="dq-grid">
      ${quests.map((quest) => {
        const value = Math.min(quest.target, questProgressValue(quest, daily));
        const done = daily.claimed.includes(quest.id);
        const percent = Math.round((value / quest.target) * 100);
        return `
          <div class="dq-card ${done ? "done" : ""}">
            <span class="dq-icon"><i data-lucide="${done ? "check" : quest.icon}"></i></span>
            <div class="dq-body">
              <strong>${quest.label}</strong>
              <div class="dq-bar"><i style="width:${percent}%"></i></div>
              <small>${done ? `Claimed +${quest.xp} XP` : `${value}/${quest.target} · +${quest.xp} XP`}</small>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- achievements view ---------- */

function renderAchievements() {
  const root = document.getElementById("achievements-root");
  if (!root) return;
  const unlocked = achievementsUnlocked();
  const unlockedCount = Object.keys(unlocked).length;
  const cards = ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = Boolean(unlocked[achievement.id]);
    let value = 0;
    try { value = Math.min(achievement.target, achievement.value()); } catch { value = 0; }
    const percent = Math.round((value / achievement.target) * 100);
    return `
      <article class="ach-card ${isUnlocked ? "unlocked" : ""}">
        <span class="ach-icon">${achievement.icon}</span>
        <div class="ach-body">
          <strong>${achievement.title}</strong>
          <small>${achievement.desc}</small>
          <div class="ach-bar"><i style="width:${isUnlocked ? 100 : percent}%"></i></div>
          <b>${isUnlocked ? "UNLOCKED · +50 XP" : `${achievement.target >= 1000 ? value.toLocaleString() : value}/${achievement.target >= 1000 ? achievement.target.toLocaleString() : achievement.target}`}</b>
        </div>
      </article>
    `;
  }).join("");

  root.innerHTML = `
    <div class="home-block-head">
      <div>
        <p class="arcade-kicker">// ACHIEVEMENTS</p>
        <h2>The long game.</h2>
        <p class="arcade-sub">Daily challenges reset every midnight — the trophies below are forever. ${unlockedCount}/${ACHIEVEMENTS.length} unlocked, +50 XP each.</p>
      </div>
    </div>
    <div id="ach-daily-slot"></div>
    <div class="ach-grid">${cards}</div>
  `;
  // show daily quests here too
  const slot = root.querySelector("#ach-daily-slot");
  if (slot) {
    slot.id = "home-quests";
    renderDailyQuests();
    slot.id = "ach-daily-slot";
  }
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- init ---------- */

(() => {
  dailyData();
  renderDailyQuests();
  checkAchievements();
  if (typeof state !== "undefined" && state.currentView === "achievements") renderAchievements();
})();
