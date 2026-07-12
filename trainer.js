/* ReplayEdge Trainer — personalized training engine + assistant brain.
   Reads telemetry, quiz failures, and per-game records to prescribe what
   THIS user should work on today. Also powers the support assistant. */

/* ---------- per-game performance ---------- */

function trainerGameStats() {
  const history = arcadeData().history || [];
  const byGame = {};
  history.forEach((entry) => {
    const stat = byGame[entry.gameId] || { plays: 0, wins: 0 };
    stat.plays += 1;
    if (entry.xp > 0) stat.wins += 1;
    byGame[entry.gameId] = stat;
  });
  Object.values(byGame).forEach((stat) => { stat.winRate = Math.round((stat.wins / stat.plays) * 100); });
  return byGame;
}

/* ---------- recommendation engine (different for everybody) ---------- */

function trainerRecommendations() {
  const recs = [];
  const seen = new Set();
  const push = (rec) => {
    const key = rec.gameId || rec.lessonId;
    if (!key || seen.has(key) || recs.length >= 3) return;
    seen.add(key);
    recs.push(rec);
  };

  // 1. behavioral leaks from the Weakness Radar detectors
  if (typeof weaknessDetect === "function") {
    try {
      weaknessDetect().findings.slice(0, 2).forEach((finding) => {
        const game = arcadeGames.find((item) => item.id === finding.game);
        if (game && arcadeGameUnlocked(game)) {
          push({ gameId: game.id, icon: finding.icon, title: `Fix: ${finding.title}`, reason: finding.evidence });
        }
      });
    } catch { /* radar optional */ }
  }

  // 2. recent quiz failures → retake those lessons
  const journal = (progress().journal || []).filter((entry) => entry.type === "quiz").slice(-3).reverse();
  journal.forEach((entry) => {
    const found = typeof findAcademyLesson === "function" ? findAcademyLesson(entry.lessonId) : null;
    if (found && !academyLessonPassed(entry.lessonId)) {
      push({ lessonId: entry.lessonId, icon: "book-x", title: `Rematch: ${found.lesson.title}`, reason: "You missed this quiz — beat it while it's fresh. The retry brings new questions." });
    }
  });

  // 3. weakest game by win rate (3+ plays, under 45%)
  const stats = trainerGameStats();
  const weakest = Object.entries(stats)
    .filter(([id, stat]) => stat.plays >= 3 && stat.winRate < 45 && arcadeGames.some((game) => game.id === id && arcadeGameUnlocked(game)))
    .sort((a, b) => a[1].winRate - b[1].winRate)[0];
  if (weakest) {
    const game = arcadeGames.find((item) => item.id === weakest[0]);
    push({ gameId: game.id, icon: "target", title: `Sharpen: ${arcadeGameMeta(game).title}`, reason: `${weakest[1].winRate}% win rate over ${weakest[1].plays} runs — this read needs reps.` });
  }

  // 4. variety: least-played unlocked game
  const unlockedGames = (typeof arcadeVisibleGames === "function" ? arcadeVisibleGames() : arcadeGames).filter((game) => arcadeGameUnlocked(game));
  const leastPlayed = [...unlockedGames].sort((a, b) => (arcadeData().runs?.[a.id] || 0) - (arcadeData().runs?.[b.id] || 0))[0];
  if (leastPlayed) {
    push({ gameId: leastPlayed.id, icon: "shuffle", title: `Fresh reps: ${arcadeGameMeta(leastPlayed).title}`, reason: (arcadeData().runs?.[leastPlayed.id] || 0) === 0 ? "You haven't touched this one — new mechanics build new instincts." : "Your least-trained instinct this week. Variety keeps the edge sharp." });
  }

  // 5. fallback: continue the academy
  const next = typeof academyNextLesson === "function" ? academyNextLesson() : null;
  if (next) {
    push({ lessonId: next.lesson.id, icon: "graduation-cap", title: `Learn: ${next.lesson.title}`, reason: `Next up on your ${typeof currentTrack === "function" ? currentTrack().label : ""} track — +${next.lesson.xp} XP.` });
  }

  return recs.slice(0, 3);
}

/* ---------- trainer bonus (drill completion) ---------- */

function trainerData() {
  const p = progress();
  const today = new Date().toDateString();
  if (!p.trainer || p.trainer.day !== today) p.trainer = { day: today, completed: [] };
  return p.trainer;
}

function trainerNotifyRun(gameId) {
  const data = trainerData();
  if (data.completed.includes(gameId)) return;
  const recommended = trainerRecommendations().some((rec) => rec.gameId === gameId);
  if (!recommended) return;
  data.completed.push(gameId);
  progress().xp += 15;
  saveProgress();
  updateProgressUi();
  if (typeof dailyBump === "function") dailyBump("trainer");
  setTimeout(() => showToast("🏋️ Trainer drill complete — +15 bonus XP", "success"), 1100);
}

/* ---------- arcade trainer panel ---------- */

function renderTrainer() {
  const root = document.getElementById("arcade-trainer");
  if (!root) return;
  const recs = trainerRecommendations();
  const done = trainerData().completed;
  if (!recs.length) { root.innerHTML = ""; return; }
  root.innerHTML = `
    <div class="trainer-panel panel">
      <div class="trainer-head">
        <span class="trainer-avatar">🏋️</span>
        <div>
          <p class="arcade-kicker">// YOUR TRAINER</p>
          <h3>Today's prescription — built from <i>your</i> data.</h3>
        </div>
        <span class="trainer-bonus">+15 XP per drill</span>
      </div>
      <div class="trainer-recs">
        ${recs.map((rec) => {
          const completed = rec.gameId && done.includes(rec.gameId);
          return `
            <div class="trainer-rec ${completed ? "done" : ""}">
              <span class="trainer-rec-icon"><i data-lucide="${completed ? "check" : rec.icon}"></i></span>
              <div class="trainer-rec-body">
                <strong>${rec.title}</strong>
                <small>${rec.reason}</small>
              </div>
              ${completed
                ? `<span class="trainer-done-tag">DONE</span>`
                : rec.gameId
                  ? `<button class="arcade-btn primary cp-mini" type="button" data-trainer-game="${rec.gameId}">Drill</button>`
                  : `<button class="arcade-btn primary cp-mini" type="button" data-trainer-lesson="${rec.lessonId}">Study</button>`}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
  root.querySelectorAll("[data-trainer-game]").forEach((button) => {
    button.addEventListener("click", () => openArcadeGame(button.dataset.trainerGame));
  });
  root.querySelectorAll("[data-trainer-lesson]").forEach((button) => {
    button.addEventListener("click", () => openAcademyLesson(button.dataset.trainerLesson));
  });
  if (window.lucide) window.lucide.createIcons();
}

/* ============================================================
   ASSISTANT BRAIN — rule-based, personalized, always available
============================================================ */

const ASSISTANT_QUICK_REPLIES = [
  "What should I train today?",
  "How do streaks work?",
  "How do I unlock Orderflow?",
  "Switch my market",
  "Plans & pricing",
  "How do friends work?"
];

function assistantBrain(rawText) {
  const text = String(rawText || "").toLowerCase();
  const p = progress();
  const track = typeof currentTrack === "function" ? currentTrack() : { label: "Futures" };
  const has = (...words) => words.some((word) => text.includes(word));

  if (has("train", "recommend", "what should i", "practice", "work on", "drill")) {
    const recs = trainerRecommendations();
    return recs.length
      ? `Based on your data, here's today's prescription:<br>${recs.map((rec, i) => `${i + 1}. <b>${rec.title}</b> — ${rec.reason}`).join("<br>")}<br>Open the <b>Arcade</b> and your Trainer panel has one-click drills (+15 XP each).`
      : "Start with your next Academy lesson — the Trainer gets smarter with every run and quiz you complete.";
  }
  if (has("streak", "fire", "🔥")) {
    const secured = typeof streakSecuredToday === "function" && streakSecuredToday();
    return `Streaks count a day when you complete <b>at least one lesson or arcade run</b> (your local time). You're on <b>${p.streak || 0} days</b>${secured ? " and today is already secured ✅" : (p.streak || 0) > 0 ? " — today is NOT secured yet, one lesson keeps it alive ⚠️" : ""}. Milestones at 3/7/14/30/50/100 pay bonus XP, and day 7 banks a 🧊 Streak Freeze that auto-covers one missed day.`;
  }
  if (has("orderflow", "stage 2", "specialization", "advanced stage")) {
    return `Stage 2 unlocks when you complete <b>every base lesson</b> in that market's Academy. For Futures that's Orderflow Trading (DOM, footprint, delta, volume profile) plus the Flow Reader game. Every market has its own Stage 2 — forex gets Institutional FX, stocks get Auction & Tape Mastery, options get The Greeks Desk, crypto gets On-Chain & Microstructure.`;
  }
  if (has("switch", "change market", "track", "forex", "crypto", "stocks", "options") && has("switch", "change", "market", "track")) {
    return `You're currently on the <b>${track.label}</b> track. Switch anytime with the market chips at the top of the <b>Academy</b> or <b>Arcade</b> — progress in every track is saved separately, so nothing is ever lost.`;
  }
  if (has("plan", "price", "pricing", "cost", "subscribe", "upgrade", "coach", "elite")) {
    return `Three plans: <b>Player $24.99/mo</b> (every market, every game, unlimited), <b>Coach $44.99/mo</b> (adds the Trader Toolkit — risk calculator, mistake journal, Weakness Radar — plus a permanent +25% XP boost), and <b>Elite $69.99/mo</b> (AI Trade Review, weekly Study Plan, +50% XP). Annual saves up to $141/year, and there's a 3-day free trial with everything unlocked. See <b>Plans</b> in the sidebar.`;
  }
  if (has("friend", "follow", "cheer", "quest", "social")) {
    const code = p.compete?.code || "shown on the Friends page";
    return `Head to <b>Friends</b> in the sidebar: follow traders by username search or friend code (yours is <b>${code}</b>). Mutual follows unlock <b>Friend Quests</b> (30 shared lessons+runs a week = +150 XP each) and <b>Friend Streaks</b>. You can view any friend's profile and stats, and send them a 👏 cheer.`;
  }
  if (has("gauntlet", "mastery", "ultimate", "endgame")) {
    return `The <b>Mastery ladder</b> (bottom of the Academy) has ten ranks earned over years — streaks, run volume, and completing every market. At Mastery V the <b>⚔️ Gauntlet</b> unlocks: five games, rising score gates, one life, 24-hour lockout if you fall. Conquer it for +2,500 XP and the Champion badge.`;
  }
  if (has("xp", "level", "rank", "points")) {
    return `You have <b>${(p.xp || 0).toLocaleString()} XP</b> (Level ${levelFromXp(p.xp || 0)}). Earn it from lessons, arcade runs, daily challenges, achievements (+50 each), friend quests, and streak milestones. Coach and Elite plans add permanent +25%/+50% boosts on every arcade run.`;
  }
  if (has("picture", "avatar", "photo", "profile pic")) {
    return `Open your <b>Profile</b> and click the camera icon on your avatar to upload a picture — it shows on leaderboards and to friends. No upload? You keep your generated default.`;
  }
  if (has("login", "log in", "sign in", "google", "account", "sign up")) {
    return `Use <b>Sign in with Google</b> on the home page, or create a free profile from the Profile tab. Logging out is in the bottom-left of the sidebar. Your progress saves automatically as you play.`;
  }
  if (has("cancel", "refund", "billing", "unsubscribe")) {
    return `Billing is handled securely through Stripe — manage or cancel anytime from <b>Profile → Subscription → Manage</b>. There's a 7-day money-back guarantee, no questions asked.`;
  }
  if (has("human", "support", "contact", "email", "help me", "bug", "problem")) {
    return `For anything I can't solve: email <b>support@replayedge.io</b> and a human will get back to you. Include your friend code (<b>${p.compete?.code || "on the Friends page"}</b>) so we can find your account fast.`;
  }
  if (has("hello", "hi", "hey", "yo", "sup")) {
    return `Hey${p.signup?.name ? ` ${p.signup.name}` : ""}! 👋 Ask me anything — training recommendations, streaks, plans, unlocks — or tap a quick question below.`;
  }
  return `I can help with most things on ReplayEdge — try asking about <b>what to train</b>, <b>streaks</b>, <b>unlocking Stage 2</b>, <b>switching markets</b>, <b>plans & pricing</b>, or <b>friends</b>. For anything else, email support@replayedge.io.`;
}

function renderAssistantChips() {
  const chips = document.getElementById("assistant-chips");
  if (!chips) return;
  chips.innerHTML = ASSISTANT_QUICK_REPLIES.map((label) =>
    `<button class="assistant-chip" type="button" data-assistant-ask="${label}">${label}</button>`
  ).join("");
  chips.querySelectorAll("[data-assistant-ask]").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof assistantAsk === "function") assistantAsk(button.dataset.assistantAsk);
    });
  });
}
