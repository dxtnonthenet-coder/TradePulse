/* ReplayEdge Admin / Dev unlock — LOCAL ONLY, single operator.
   Flips the local account to Elite, completes the entire curriculum across
   every market, awards all badges, and reveals every gated surface so the
   owner can walk the whole product. Nothing here touches the server or other
   users — it only mutates this browser's localStorage progress.

   Triggers (any of):
     • Owner email  — auto-unlocks when the owner signs in (matched by hash,
                      so the personal email never appears in the public source);
                      follows the account across devices.
     • URL param  ?admin=1        (auto-runs on load — survives hash routing)
     • URL hash   #admin-unlock   (auto-runs if it reaches boot)
     • Console:   adminUnlock()   /  adminReset()
     • Keyboard:  Ctrl/Cmd + Shift + A  toggles it
*/

/* Owner allowlist — cyrb53 hashes of authorized emails (lowercased/trimmed).
   Hashing keeps real addresses out of the public repo; this is a convenience
   auto-trigger, not a security boundary (admin mode is a local-only cosmetic
   unlock that grants no server privileges). */
const ADMIN_EMAIL_HASHES = new Set([
  "28gbcrrcw9q" // dxtnonthenet@gmail.com
]);

function adminHashEmail(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

function adminCurrentEmail() {
  const p = (typeof progress === "function") ? progress() : {};
  const raw = p.signup?.email || p.inviteEmail || p.googleUser?.email || "";
  return String(raw).trim().toLowerCase();
}

function adminEmailIsOwner() {
  const email = adminCurrentEmail();
  if (!email) return false;
  return ADMIN_EMAIL_HASHES.has(adminHashEmail(email));
}

/* Auto-unlock for the owner; no-op for everyone else and when already on.
   Safe to call repeatedly (idempotent). */
function adminMaybeAutoUnlock() {
  if (typeof progress !== "function") return false;
  if (progress().adminMode) { adminBadge(true); return true; }
  if (adminEmailIsOwner()) {
    adminUnlock();
    return true;
  }
  return false;
}

function adminAllLessonIds() {
  const ids = new Set();
  const eat = (tiers) => (tiers || []).forEach((tier) => (tier.lessons || []).forEach((lesson) => ids.add(lesson.id)));
  if (typeof TRACKS === "object" && TRACKS) {
    Object.values(TRACKS).forEach((track) => {
      eat(track.tiers);
      eat(track.advanced);
    });
  }
  if (typeof ORDERFLOW_TIERS !== "undefined") eat(ORDERFLOW_TIERS);
  if (typeof FUTURES_TIERS !== "undefined") eat(FUTURES_TIERS);
  return [...ids];
}

function adminUnlock() {
  const p = progress();

  // 1. plan + session — Elite unlocks Player/Coach/Elite tiers everywhere
  p.adminMode = true;
  p.plan = "elite";
  p.subscriptionStatus = { active: true, plan: "elite", source: "admin", since: Date.now() };
  p.anonymousAccess = true;
  if (!p.signup || !p.signup.email) {
    p.signup = { name: "Admin", email: "admin@replayedge.local", plan: "elite", createdAt: Date.now() };
  }
  if (!p.academyTrack) p.academyTrack = "futures"; // skip the onboarding market picker
  p.onboarded = true;

  // 2. complete every lesson in every track + advanced stages + orderflow
  const data = academyData();
  adminAllLessonIds().forEach((id) => {
    if (!data.lessons[id]?.passedAt) data.lessons[id] = { passedAt: Date.now(), xpEarned: 0, admin: true };
  });

  // 3. progression stats so ranks / mastery / level gates are satisfied
  p.xp = Math.max(Number(p.xp || 0), 250000);
  p.streak = Math.max(Number(p.streak || 0), 120);
  p.topStreak = Math.max(Number(p.topStreak || 0), 400);
  p.streakFreezes = 3;
  p.lastStreakDate = new Date().toDateString();
  p.lifetime = { wins: Math.max(p.lifetime?.wins || 0, 500), busts: p.lifetime?.busts || 0 };

  // 4. arcade volume for mastery/gauntlet volume gates
  if (!p.arcade || typeof p.arcade !== "object") p.arcade = {};
  p.arcade.runsTotal = Math.max(Number(p.arcade.runsTotal || 0), 7000);
  p.arcade.totalXp = Math.max(Number(p.arcade.totalXp || 0), 200000);

  // 5. every badge the app checks for
  p.badges = [...new Set([...(p.badges || []),
    "prop_run_funded", "mines_perfect", "gauntlet_champion"
  ])];

  // 6. flush any achievement whose condition is now met
  if (typeof ACHIEVEMENTS !== "undefined") {
    if (!p.achievements || typeof p.achievements !== "object") p.achievements = {};
    ACHIEVEMENTS.forEach((achievement) => {
      let value = 0;
      try { value = achievement.value(); } catch { value = 0; }
      if (value >= achievement.target && !p.achievements[achievement.id]) {
        p.achievements[achievement.id] = Date.now();
      }
    });
  }

  saveProgress();
  if (typeof checkAchievements === "function") checkAchievements(); // sweep any that award XP/toasts

  // suppress + dismiss the first-run onboarding market picker.
  // app.js schedules a 650ms timer to reveal it, so hide now AND after that fires.
  try { localStorage.setItem("tradePulseOnboardingSeen", "true"); } catch { /* ignore */ }
  const hideOnboarding = () => {
    const onboarding = document.getElementById("onboarding-modal");
    onboarding?.classList.add("hidden");
    onboarding?.setAttribute("aria-hidden", "true");
  };
  hideOnboarding();
  setTimeout(hideOnboarding, 750);

  adminRefreshEverything();
  adminBadge(true);
  if (typeof showToast === "function") showToast("🔓 Admin mode ON — Elite unlocked, full curriculum complete.", "success");
  return "Admin unlocked. Every plan tier, lesson, game, and premium feature is now visible. Run adminReset() to undo.";
}

function adminReset() {
  const p = progress();
  delete p.adminMode;
  p.plan = "free";
  p.subscriptionStatus = null;
  // strip admin-completed lessons (leave anything genuinely earned)
  const data = academyData();
  Object.keys(data.lessons).forEach((id) => {
    if (data.lessons[id]?.admin) delete data.lessons[id];
  });
  p.badges = (p.badges || []).filter((badge) => !["prop_run_funded", "mines_perfect", "gauntlet_champion"].includes(badge));
  saveProgress();
  adminRefreshEverything();
  adminBadge(false);
  if (typeof showToast === "function") showToast("Admin mode OFF — back to a normal free account.", "info");
  return "Admin reset. Reload if anything looks stale.";
}

function adminRefreshEverything() {
  if (typeof updateProgressUi === "function") updateProgressUi();
  if (typeof updateLogoutButtons === "function") updateLogoutButtons();
  if (typeof renderAcademy === "function") renderAcademy();
  if (typeof renderArcade === "function") renderArcade();
  if (typeof renderProfile === "function") renderProfile();
  if (typeof renderAchievements === "function") renderAchievements();
  if (typeof renderTradersDashboard === "function") renderTradersDashboard();
  if (window.lucide) window.lucide.createIcons();
}

function adminBadge(on) {
  let badge = document.getElementById("admin-badge");
  if (!on) { badge?.remove(); return; }
  if (!badge) {
    badge = document.createElement("button");
    badge.id = "admin-badge";
    badge.type = "button";
    badge.title = "Admin mode is on (local only). Click to turn off.";
    badge.addEventListener("click", adminReset);
    document.body.appendChild(badge);
  }
  badge.textContent = "● ADMIN";
}

/* ---------- triggers ---------- */

(() => {
  // capture the trigger intent immediately, before app.js's hash router can rewrite the URL
  const wantsUnlock = /[?&]admin=1\b/.test(location.search) || location.hash === "#admin-unlock";
  const boot = () => {
    if (progress().adminMode) adminBadge(true);
    if (wantsUnlock) {
      history.replaceState(null, "", location.pathname);
      adminUnlock();
    } else {
      // owner already signed in from a previous session / synced device
      adminMaybeAutoUnlock();
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === "A" || event.key === "a")) {
      event.preventDefault();
      if (progress().adminMode) adminReset(); else adminUnlock();
    }
  });
  window.adminUnlock = adminUnlock;
  window.adminReset = adminReset;
  window.adminMaybeAutoUnlock = adminMaybeAutoUnlock;
})();
