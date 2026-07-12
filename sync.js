/* ReplayEdge cross-device progress sync.
   Progress lives in localStorage for instant offline play, and is mirrored to
   the server keyed by the user's account (email when signed in, else a stable
   guest id). On sign-in we pull the account's saved progress and MERGE it with
   whatever is on this device so nothing is ever lost — then it follows the user
   to any browser or phone they log into. Storage backend: per-user JSON on the
   server's persistent disk. */

const progressSync = {
  reconciledUserId: null, // identity we've already pulled+merged for — pushes only allowed after this matches
  pushTimer: null,
  pulling: false,
  lastPushedJson: null
};

function progressSyncUserId() {
  try {
    return typeof currentUserIdentity === "function" ? currentUserIdentity().userId : null;
  } catch {
    return null;
  }
}

function progressSyncIsSignedIn() {
  const p = typeof progress === "function" ? progress() : {};
  return Boolean(p.signup?.email || p.inviteEmail || p.googleUser?.email);
}

/* ---------- merge: never lose XP, streaks, lessons, or unlocks ---------- */

function mergeProgress(local, server) {
  if (!server || typeof server !== "object") return local;
  if (!local || typeof local !== "object") return server;

  // start from whichever side is further along, so scalar preferences
  // (avatar, track, plan) come from the more-progressed profile
  const base = (Number(server.xp || 0) >= Number(local.xp || 0))
    ? { ...local, ...server }
    : { ...server, ...local };

  const maxNum = (a, b) => Math.max(Number(a || 0), Number(b || 0));
  base.xp = maxNum(local.xp, server.xp);
  base.streak = maxNum(local.streak, server.streak);
  base.topStreak = maxNum(local.topStreak, server.topStreak);
  base.streakFreezes = maxNum(local.streakFreezes, server.streakFreezes);
  base.lastCelebratedLevel = maxNum(local.lastCelebratedLevel, server.lastCelebratedLevel);
  base.friendQuestsCompleted = maxNum(local.friendQuestsCompleted, server.friendQuestsCompleted);

  // keep the freshest streak date so the chain isn't accidentally reset
  const dates = [local.lastStreakDate, server.lastStreakDate].filter(Boolean);
  if (dates.length) {
    base.lastStreakDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];
  }
  base.joinedAt = Math.min(Number(local.joinedAt || Date.now()), Number(server.joinedAt || Date.now()));

  // union of everything unlockable — earliest timestamp wins on collisions
  base.academy = { lessons: mergeStamped(local.academy?.lessons, server.academy?.lessons, "min") };
  base.achievements = mergeStamped(local.achievements, server.achievements, "min");
  base.badges = [...new Set([...(local.badges || []), ...(server.badges || [])])];

  // arcade: best-of every counter, and a de-duped run history
  const la = local.arcade || {}; const sa = server.arcade || {};
  base.arcade = {
    ...sa, ...la,
    totalXp: maxNum(la.totalXp, sa.totalXp),
    runsTotal: maxNum(la.runsTotal, sa.runsTotal),
    runs: mergeMaxMap(la.runs, sa.runs),
    best: mergeMaxMap(la.best, sa.best),
    history: mergeHistory(la.history, sa.history),
    briefAck: { ...(sa.briefAck || {}), ...(la.briefAck || {}) }
  };

  const ll = local.lifetime || {}; const sl = server.lifetime || {};
  base.lifetime = { wins: maxNum(ll.wins, sl.wins), busts: maxNum(ll.busts, sl.busts) };

  // subscription: an active real subscription always wins over a stale one
  base.subscriptionStatus = pickSubscription(local.subscriptionStatus, server.subscriptionStatus);

  return base;
}

function mergeStamped(a, b, mode) {
  const out = { ...(b || {}) };
  Object.entries(a || {}).forEach(([key, value]) => {
    if (!out[key]) { out[key] = value; return; }
    const ta = value?.passedAt || value; const tb = out[key]?.passedAt || out[key];
    if (typeof ta === "number" && typeof tb === "number") {
      const keep = mode === "min" ? Math.min(ta, tb) : Math.max(ta, tb);
      if (value?.passedAt !== undefined || out[key]?.passedAt !== undefined) {
        out[key] = { ...out[key], ...value, passedAt: keep };
      } else {
        out[key] = keep;
      }
    }
  });
  return out;
}

function mergeMaxMap(a, b) {
  const out = { ...(b || {}) };
  Object.entries(a || {}).forEach(([key, value]) => { out[key] = Math.max(Number(value || 0), Number(out[key] || 0)); });
  return out;
}

function mergeHistory(a, b) {
  const seen = new Set();
  return [...(a || []), ...(b || [])]
    .filter((entry) => entry && typeof entry.ts === "number")
    .sort((x, y) => x.ts - y.ts)
    .filter((entry) => { if (seen.has(entry.ts)) return false; seen.add(entry.ts); return true; })
    .slice(-40);
}

function pickSubscription(a, b) {
  if (a?.active && !b?.active) return a;
  if (b?.active && !a?.active) return b;
  if (a?.active && b?.active) return Number(a.currentPeriodEnd || 0) >= Number(b.currentPeriodEnd || 0) ? a : b;
  return a || b || null;
}

/* ---------- pull: adopt the account's saved progress on this device ---------- */

async function progressSyncPull(userId) {
  if (progressSync.pulling) return;
  progressSync.pulling = true;
  try {
    const response = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
    const json = await response.json();
    if (json.ok && json.progress) {
      const merged = mergeProgress(progress(), json.progress);
      state.progress = merged;
      localStorage.setItem("tradePulseProgress", JSON.stringify(merged));
      if (typeof streakBootCheck === "function") { try { streakBootCheck(); } catch { /* optional */ } }
      if (typeof updateProgressUi === "function") updateProgressUi();
      if (typeof navigateTo === "function" && typeof state !== "undefined") navigateTo(state.currentView, { scroll: false });
    }
    // reconciled: from here pushes for this identity are safe
    progressSync.reconciledUserId = userId;
    progressSync.lastPushedJson = null;
    progressSyncPushNow(userId); // converge both sides (seeds the server if it had nothing)
  } catch {
    // offline or server down — localStorage still works; stay UN-reconciled so we
    // never blind-push empty/partial data over a good server copy. Retry next tick.
  } finally {
    progressSync.pulling = false;
  }
}

// pull+merge before we ever push for a newly-seen signed-in identity
function progressSyncEnsureReconciled() {
  if (!progressSyncIsSignedIn()) return false;
  const id = progressSyncUserId();
  if (!id) return false;
  if (id === progressSync.reconciledUserId) return true;
  if (!progressSync.pulling) progressSyncPull(id);
  return false;
}

/* ---------- push: mirror local progress up (debounced) ---------- */

async function progressSyncPushNow(userId) {
  const id = userId || progressSync.userId;
  if (!id) return;
  const body = JSON.stringify({ userId: id, progress: progress() });
  if (body === progressSync.lastPushedJson) return;
  try {
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
    if (response.ok) progressSync.lastPushedJson = body;
  } catch {
    // will retry on the next save
  }
}

function progressSyncSchedulePush() {
  // only sync signed-in accounts by default; guests stay local until they sign up.
  // (guest ids are per-browser, so pushing them adds cost without cross-device value)
  if (!progressSyncIsSignedIn()) return;
  const id = progressSyncUserId();
  if (!id) return;
  // CRITICAL: never push until we've pulled+merged the server copy for this identity,
  // otherwise a fresh sign-in would overwrite the account's real progress with an
  // empty local blob. Trigger reconciliation instead; the merge then converges.
  if (id !== progressSync.reconciledUserId) { progressSyncEnsureReconciled(); return; }
  clearTimeout(progressSync.pushTimer);
  progressSync.pushTimer = setTimeout(() => progressSyncPushNow(id), 1500);
}

/* ---------- init ---------- */

(() => {
  // flush a pending save if the user closes the tab mid-debounce — but only once
  // we've reconciled, so we never beacon empty progress over a good server copy
  window.addEventListener("beforeunload", () => {
    const id = progressSyncUserId();
    if (!id || id !== progressSync.reconciledUserId) return;
    try {
      navigator.sendBeacon("/api/progress", new Blob([JSON.stringify({ userId: id, progress: progress() })], { type: "application/json" }));
    } catch { /* best effort */ }
  });

  const boot = () => {
    progressSyncEnsureReconciled();
    setInterval(progressSyncEnsureReconciled, 3000);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
