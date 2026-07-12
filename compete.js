/* ReplayEdge Friends — the social layer.
   Follow traders, see their profiles and statistics, run weekly Friend Quests,
   grow shared streaks, and send cheers. Deliberately non-competitive. */

const FRIEND_QUEST_GOAL = 30; // combined lessons + runs for the week

const socialUi = { tab: "following" };

/* ---------- data ---------- */

function competeData() {
  const p = progress();
  if (!p.compete || typeof p.compete !== "object") p.compete = {};
  if (!Array.isArray(p.compete.following)) p.compete.following = [];
  if (!Array.isArray(p.compete.followers)) p.compete.followers = [];
  // legacy migration: old mutual friends list
  if (Array.isArray(p.compete.friends) && p.compete.friends.length) {
    p.compete.following = [...p.compete.friends];
    p.compete.followers = [...p.compete.friends];
    delete p.compete.friends;
  }
  if (!p.compete.streaks || typeof p.compete.streaks !== "object") p.compete.streaks = {};
  return p.compete;
}

function competeMutuals() {
  const compete = competeData();
  const followerCodes = new Set(compete.followers.map((person) => person.code));
  return compete.following.filter((person) => followerCodes.has(person.code));
}

function competeName() {
  const p = progress();
  return p.signup?.name || `Guest-${referralUserId().slice(-4).toUpperCase()}`;
}

function weekOfKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return start.toDateString();
}

function weeklyActivityData() {
  const p = progress();
  if (!p.weeklyActivity || p.weeklyActivity.weekOf !== weekOfKey()) {
    p.weeklyActivity = { weekOf: weekOfKey(), count: 0 };
  }
  return p.weeklyActivity;
}

function friendQuestBump() {
  weeklyActivityData().count += 1;
  const quest = activeFriendQuest();
  if (quest) checkFriendQuest(quest);
  saveProgress();
  competeHeartbeat();
  if (state.currentView === "compete") renderCompete();
}

function activeDayToday() {
  const daily = progress().daily;
  return Boolean(daily && daily.day === new Date().toDateString() && ((daily.lessons || 0) + (daily.runs || 0)) > 0);
}

/* ---------- server sync ---------- */

let competeHeartbeatTimer = null;

function competeHeartbeat() {
  clearTimeout(competeHeartbeatTimer);
  competeHeartbeatTimer = setTimeout(() => competeRegister(), 2500);
}

function competeMyStats() {
  const p = progress();
  const arcade = arcadeData();
  const wins = p.lifetime?.wins || 0;
  return {
    xp: p.xp || 0,
    level: levelFromXp(p.xp || 0),
    streak: p.streak || 0,
    lessons: Object.keys(p.academy?.lessons || {}).length,
    runs: arcade.runsTotal || 0,
    winRate: arcade.runsTotal ? Math.round((wins / arcade.runsTotal) * 100) : 0,
    achievements: Object.keys(p.achievements || {}).length
  };
}

async function competeRegister() {
  if (location.protocol === "file:") return;
  try {
    const avatar = typeof userAvatarUrl === "function" ? userAvatarUrl() : null;
    const response = await fetch("/api/friends/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: referralUserId(),
        name: competeName(),
        track: typeof currentTrackId === "function" ? currentTrackId() : "futures",
        weeklyXp: 0,
        weeklyActivity: weeklyActivityData().count,
        lastActiveDay: activeDayToday() ? new Date().toDateString() : (progress().lastActiveDaySent || ""),
        stats: competeMyStats(),
        avatar: avatar && avatar.length < 40000 ? avatar : undefined
      })
    });
    const data = await response.json();
    if (data.ok) {
      const compete = competeData();
      compete.code = data.code;
      compete.following = data.following || [];
      compete.followers = data.followers || [];
      compete.cheers = data.cheers || [];
      if (activeDayToday()) progress().lastActiveDaySent = new Date().toDateString();
      updateFriendStreaks();
      saveProgress();
      if (state.currentView === "compete") renderCompete();
    }
  } catch { /* offline is fine */ }
}

async function competeFollow(code, silent = false) {
  try {
    const response = await fetch("/api/friends/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: referralUserId(), code })
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || "Could not follow");
    const compete = competeData();
    if (!compete.following.some((person) => person.code === data.friend.code)) compete.following.push(data.friend);
    saveProgress();
    if (!silent) showToast(`Following ${data.friend.name}${data.friend.followsYou ? " — you're mutuals! Friend Quests unlocked." : ""}`, "success");
    if (typeof checkAchievements === "function") checkAchievements();
    renderCompete();
    if (typeof renderProfile === "function" && state.currentView === "profile") renderProfile();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function competeUnfollow(code, name) {
  try {
    const response = await fetch("/api/friends/unfollow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: referralUserId(), code })
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || "Could not unfollow");
    const compete = competeData();
    compete.following = compete.following.filter((person) => person.code !== code);
    saveProgress();
    showToast(`Unfollowed ${name}.`, "info");
    renderCompete();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function competeSearch(query) {
  const results = document.getElementById("fr-search-results");
  if (!results) return;
  if (!query || query.length < 2) {
    results.innerHTML = "";
    return;
  }
  try {
    const response = await fetch(`/api/friends/search?name=${encodeURIComponent(query)}`);
    const data = await response.json();
    const compete = competeData();
    const followingCodes = new Set(compete.following.map((person) => person.code));
    results.innerHTML = (data.matches || []).length
      ? data.matches.filter((match) => match.code !== compete.code).map((match) => `
          <div class="cp-friend">
            ${typeof avatarHtml === "function" ? avatarHtml(match.name, "av-small", match.avatar) : ""}
            <span class="cp-friend-name">${match.name}<small>${(TRACKS[match.track] || {}).label || match.track} trader · Lv ${match.stats?.level || 1}</small></span>
            ${followingCodes.has(match.code)
              ? `<span class="cp-offtrack">Following</span>`
              : `<button class="arcade-btn primary cp-mini" type="button" data-fr-follow="${match.code}">Follow</button>`}
          </div>
        `).join("")
      : `<p class="tk-empty">No traders found named "${query}". Ask them for their friend code instead.</p>`;
    results.querySelectorAll("[data-fr-follow]").forEach((button) => {
      button.addEventListener("click", () => competeFollow(button.dataset.frFollow));
    });
  } catch {
    results.innerHTML = `<p class="tk-empty">Search unavailable right now.</p>`;
  }
}

async function competeSendCheer(toCode, kind, friendName) {
  try {
    await fetch("/api/friends/cheer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCode, from: competeName(), kind })
    });
    showToast(`Cheer sent to ${friendName}! 🎉`, "success");
    if (typeof arcadeSound === "function") arcadeSound("win");
    if (typeof dailyBump === "function") dailyBump("cheer");
  } catch {
    showToast("Could not send the cheer.", "error");
  }
}

/* ---------- friend quest (weekly co-op, mutuals) ---------- */

function activeFriendQuest() {
  const p = progress();
  if (p.friendQuest && p.friendQuest.weekOf !== weekOfKey()) p.friendQuest = null;
  return p.friendQuest || null;
}

function startFriendQuest(friendCode, friendName) {
  progress().friendQuest = { friendCode, friendName, weekOf: weekOfKey(), startMine: weeklyActivityData().count, startTheirs: null, completed: false };
  saveProgress();
  showToast(`Friend Quest started with ${friendName}: ${FRIEND_QUEST_GOAL} lessons & runs together this week!`, "success");
  renderCompete();
}

function friendQuestProgress(quest) {
  const mine = Math.max(0, weeklyActivityData().count - (quest.startMine || 0));
  const friend = competeData().following.find((person) => person.code === quest.friendCode);
  const theirsRaw = friend ? (friend.weeklyActivity || 0) : 0;
  if (quest.startTheirs === null && friend) {
    quest.startTheirs = theirsRaw;
    saveProgress();
  }
  const theirs = Math.max(0, theirsRaw - (quest.startTheirs || 0));
  return { mine, theirs, total: Math.min(FRIEND_QUEST_GOAL, mine + theirs) };
}

function checkFriendQuest(quest) {
  if (quest.completed) return;
  const { total } = friendQuestProgress(quest);
  if (total >= FRIEND_QUEST_GOAL) {
    quest.completed = true;
    const p = progress();
    p.friendQuestsCompleted = (p.friendQuestsCompleted || 0) + 1;
    p.xp += 150;
    saveProgress();
    updateProgressUi();
    setTimeout(() => {
      showToast(`🎯 Friend Quest complete with ${quest.friendName}! +150 XP`, "success");
      if (typeof arcadeSound === "function") arcadeSound("bigwin");
      if (typeof confettiBurst === "function") confettiBurst();
      if (typeof checkAchievements === "function") checkAchievements();
    }, 500);
  }
}

/* ---------- friend streaks (mutuals) ---------- */

function updateFriendStreaks() {
  const compete = competeData();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  competeMutuals().forEach((friend) => {
    const entry = compete.streaks[friend.code] || { streak: 0, lastDay: "" };
    if (entry.lastDay === today) return;
    const bothToday = activeDayToday() && friend.lastActiveDay === today;
    if (bothToday) {
      entry.streak = entry.lastDay === yesterday ? entry.streak + 1 : 1;
      entry.lastDay = today;
      if (entry.streak > 1) setTimeout(() => showToast(`🔥 ${entry.streak}-day Friend Streak with ${friend.name}!`, "success"), 900);
    } else if (entry.lastDay && entry.lastDay !== yesterday) {
      entry.streak = 0;
    }
    compete.streaks[friend.code] = entry;
  });
}

/* ---------- friend profile modal ---------- */

function openFriendProfile(code) {
  const compete = competeData();
  const person = [...compete.following, ...compete.followers].find((item) => item.code === code);
  if (!person) return;
  const isFollowing = compete.following.some((item) => item.code === code);
  const isMutual = isFollowing && compete.followers.some((item) => item.code === code);
  const myStreak = compete.streaks[code]?.streak || 0;
  const stats = person.stats || {};
  const track = TRACKS[person.track] || { label: "Futures", icon: "candlestick-chart" };
  document.getElementById("friend-profile-modal")?.remove();
  const modal = document.createElement("div");
  modal.id = "friend-profile-modal";
  modal.className = "academy-modal";
  modal.innerHTML = `
    <div class="academy-modal-card fr-profile-card" role="dialog" aria-modal="true">
      <button class="academy-modal-close" id="fr-profile-close" type="button" aria-label="Close"><i data-lucide="x"></i></button>
      <div class="fr-profile-head">
        ${typeof avatarHtml === "function" ? avatarHtml(person.name, "av-profile", person.avatar) : ""}
        <div>
          <h2>${person.name}</h2>
          <div class="pf-badges-row">
            <span class="pf-track-badge"><i data-lucide="${track.icon}"></i> ${track.label} Trader</span>
            ${isMutual ? `<span class="cp-offtrack">🤝 Mutuals</span>` : person.followsYou || compete.followers.some((f) => f.code === code) ? `<span class="cp-offtrack">Follows you</span>` : ""}
          </div>
          <p class="pf-joined">${person.lastActiveDay === new Date().toDateString() ? "🟢 Active today" : "⚪ Resting"}${myStreak ? ` · 🔥 ${myStreak}d streak with you` : ""}</p>
        </div>
      </div>
      <div class="pf-stats-grid fr-profile-stats">
        <div class="pf-stat panel"><span class="pf-stat-icon">⚡</span><div><strong>${(stats.xp || 0).toLocaleString()}</strong><small>Total XP · Lv ${stats.level || 1}</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🔥</span><div><strong>${stats.streak || 0}</strong><small>Day streak</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🎓</span><div><strong>${stats.lessons || 0}</strong><small>Lessons passed</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🕹</span><div><strong>${stats.runs || 0}</strong><small>Arcade runs</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🎯</span><div><strong>${stats.winRate || 0}%</strong><small>Win rate</small></div></div>
        <div class="pf-stat panel"><span class="pf-stat-icon">🏆</span><div><strong>${stats.achievements || 0}</strong><small>Achievements</small></div></div>
      </div>
      <div class="cp-row-actions fr-profile-actions">
        ${isFollowing
          ? `<button class="arcade-btn ghost" type="button" id="fr-profile-unfollow">Unfollow</button>`
          : `<button class="arcade-btn primary" type="button" id="fr-profile-follow">Follow${compete.followers.some((f) => f.code === code) ? " back" : ""}</button>`}
        <button class="arcade-btn primary" type="button" id="fr-profile-cheer">👏 Send a cheer</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.remove(); });
  modal.querySelector("#fr-profile-close")?.addEventListener("click", () => modal.remove());
  modal.querySelector("#fr-profile-follow")?.addEventListener("click", () => { competeFollow(code); modal.remove(); });
  modal.querySelector("#fr-profile-unfollow")?.addEventListener("click", () => { competeUnfollow(code, person.name); modal.remove(); });
  modal.querySelector("#fr-profile-cheer")?.addEventListener("click", () => { competeSendCheer(code, "progress", person.name); modal.remove(); });
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- rendering ---------- */

function socialPersonRow(person, listType) {
  const compete = competeData();
  const isFollowing = compete.following.some((item) => item.code === person.code);
  const streak = compete.streaks[person.code]?.streak || 0;
  const activeToday = person.lastActiveDay === new Date().toDateString();
  const stats = person.stats || {};
  return `
    <div class="cp-friend fr-clickable" data-fr-view="${person.code}" role="button" tabindex="0">
      ${typeof avatarHtml === "function" ? avatarHtml(person.name, "av-small", person.avatar) : ""}
      <span class="cp-friend-name">${person.name}
        <small>${(TRACKS[person.track] || {}).label || "Futures"} · Lv ${stats.level || 1} · ${activeToday ? "🟢 today" : "⚪"}${streak ? ` · 🔥${streak}d` : ""}</small>
      </span>
      <span class="fr-actions">
        ${listType === "following"
          ? `<button class="arcade-btn ghost cp-mini" type="button" data-fr-unfollow="${person.code}" data-fr-name="${person.name}">Following ✓</button>`
          : isFollowing
            ? `<span class="cp-offtrack">🤝 Mutuals</span>`
            : `<button class="arcade-btn primary cp-mini" type="button" data-fr-follow="${person.code}">Follow back</button>`}
      </span>
    </div>
  `;
}

function renderCompete() {
  const root = document.getElementById("compete-root");
  if (!root) return;
  const compete = competeData();
  const quest = activeFriendQuest();
  const cheers = (compete.cheers || []).slice(-5).reverse();
  const mutuals = competeMutuals();
  const list = socialUi.tab === "following" ? compete.following : compete.followers;

  const emptyState = `
    <div class="fr-empty">
      <div class="fr-empty-faces">🧑‍💻👩‍💼🧔👩‍🦱🧑‍🎓</div>
      <p>Trading is better with a desk.<br>Learning is more fun — and more effective — when you connect with others.</p>
    </div>
  `;

  const questMarkup = quest ? (() => {
    const { mine, theirs, total } = friendQuestProgress(quest);
    const percent = Math.round((total / FRIEND_QUEST_GOAL) * 100);
    return `
      <div class="fr-quest ${quest.completed ? "done" : ""}">
        <div class="fr-quest-head">
          <strong>${quest.completed ? "🎯 Quest complete!" : `Weekly quest with ${quest.friendName}`}</strong>
          <b>${total}/${FRIEND_QUEST_GOAL}</b>
        </div>
        <div class="dq-bar big"><i style="width:${Math.min(100, percent)}%"></i></div>
        <small>You: ${mine} · ${quest.friendName}: ${theirs} — lessons and runs both count. ${quest.completed ? "+150 XP banked. New quest next week!" : "Finish together for +150 XP each."}</small>
      </div>
    `;
  })() : `
    <p class="tk-copy">Team up with a mutual: <b>${FRIEND_QUEST_GOAL} lessons & runs combined</b> this week = <b>+150 XP</b> for you both.</p>
    ${mutuals.length
      ? mutuals.slice(0, 4).map((friend) => `<button class="pf-friend-action" type="button" data-fr-quest="${friend.code}" data-fr-name="${friend.name}"><i data-lucide="target"></i> Start quest with ${friend.name}</button>`).join("")
      : `<p class="tk-empty">Quests unlock with mutuals — follow someone who follows you back.</p>`}
  `;

  root.innerHTML = `
    <div class="cp-head">
      <div>
        <p class="arcade-kicker">// FRIENDS</p>
        <h2>Learn faster, together.</h2>
        <p class="arcade-sub">Follow traders, share quests and streaks, and cheer each other on. Traders with a desk finish far more of their Academy — no racing required.</p>
      </div>
    </div>

    <div class="cp-grid">
      <article class="panel cp-panel fr-social-card">
        <div class="fr-tabs">
          <button class="fr-tab ${socialUi.tab === "following" ? "active" : ""}" type="button" data-fr-tab="following">FOLLOWING <b>${compete.following.length}</b></button>
          <button class="fr-tab ${socialUi.tab === "followers" ? "active" : ""}" type="button" data-fr-tab="followers">FOLLOWERS <b>${compete.followers.length}</b></button>
        </div>
        <div class="cp-friends">
          ${list.length ? list.map((person) => socialPersonRow(person, socialUi.tab)).join("") : emptyState}
        </div>
      </article>

      <article class="panel cp-panel">
        <div class="panel-title">Add friends</div>
        <button class="fr-add-row" type="button" id="fr-find-toggle">
          <span class="fr-add-icon">🔍</span>
          <span class="fr-add-label"><strong>Find friends</strong><small>Search traders by username</small></span>
          <i data-lucide="chevron-right"></i>
        </button>
        <div class="fr-find-panel hidden" id="fr-find-panel">
          <div class="cp-add-row"><input id="fr-search-input" placeholder="Search by username…" maxlength="30" /></div>
          <div id="fr-search-results"></div>
          <div class="cp-add-row" style="margin-top:8px">
            <input id="cp-add-input" placeholder="Or enter a friend code: TR-A1B2C3" maxlength="12" />
            <button class="arcade-btn primary cp-mini" type="button" id="cp-add-btn">Follow</button>
          </div>
        </div>
        <button class="fr-add-row" type="button" id="fr-invite">
          <span class="fr-add-icon">✉️</span>
          <span class="fr-add-label"><strong>Invite friends</strong><small>Share your invite link</small></span>
          <i data-lucide="chevron-right"></i>
        </button>
        <div class="cp-code-row" style="margin-top:12px">
          <span>Your code</span>
          <b id="cp-my-code">${compete.code || "connect…"}</b>
          <button class="arcade-btn ghost cp-mini" type="button" id="cp-copy-code">Copy</button>
        </div>
      </article>

      <article class="panel cp-panel">
        <div class="panel-title">Friend Quest</div>
        ${questMarkup}
      </article>

      <article class="panel cp-panel">
        <div class="panel-title">Cheers For You</div>
        ${cheers.length ? cheers.map((cheer) => `
          <div class="cp-log-row won">👏 <b>${cheer.from}</b> cheered your ${cheer.kind === "streak" ? "streak" : "progress"} · ${typeof timeAgo === "function" ? timeAgo(cheer.at) : ""}</div>
        `).join("") : `<p class="tk-empty">When friends cheer your milestones, they land here. Send the first one from a friend's profile!</p>`}
      </article>
    </div>
  `;

  root.querySelectorAll("[data-fr-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      socialUi.tab = button.dataset.frTab;
      renderCompete();
    });
  });
  root.querySelectorAll("[data-fr-view]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openFriendProfile(row.dataset.frView);
    });
  });
  root.querySelectorAll("[data-fr-unfollow]").forEach((button) => {
    button.addEventListener("click", () => competeUnfollow(button.dataset.frUnfollow, button.dataset.frName));
  });
  root.querySelectorAll("[data-fr-follow]").forEach((button) => {
    button.addEventListener("click", () => competeFollow(button.dataset.frFollow));
  });
  root.querySelector("#fr-find-toggle")?.addEventListener("click", () => {
    root.querySelector("#fr-find-panel")?.classList.toggle("hidden");
    root.querySelector("#fr-search-input")?.focus();
  });
  root.querySelector("#fr-invite")?.addEventListener("click", () => {
    const link = typeof referralLink === "function" ? referralLink() : location.origin;
    navigator.clipboard?.writeText(`Join me on ReplayEdge — the day trader's one-stop shop. ${link}`);
    showToast("Invite link copied — send it to a trading buddy.", "success");
  });
  root.querySelector("#cp-copy-code")?.addEventListener("click", () => {
    navigator.clipboard?.writeText(compete.code || "");
    showToast("Friend code copied.", "success");
  });
  root.querySelector("#cp-add-btn")?.addEventListener("click", () => {
    const value = root.querySelector("#cp-add-input")?.value.trim().toUpperCase();
    if (value) competeFollow(value);
  });
  let searchTimer = null;
  root.querySelector("#fr-search-input")?.addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    const value = event.target.value.trim();
    searchTimer = setTimeout(() => competeSearch(value), 350);
  });
  root.querySelectorAll("[data-fr-quest]").forEach((button) => {
    button.addEventListener("click", () => startFriendQuest(button.dataset.frQuest, button.dataset.frName));
  });
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- init ---------- */

(() => {
  competeRegister();
  const quest = activeFriendQuest();
  if (quest) checkFriendQuest(quest);
  if (typeof state !== "undefined" && state.currentView === "compete") renderCompete();
})();
