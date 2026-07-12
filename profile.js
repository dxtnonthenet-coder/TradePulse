/* ReplayEdge Profile — Duolingo-inspired trader identity page.
   Banner + avatar (uploadable), track badge, statistics, achievements
   showcase, friends, and the referral system. Overrides legacy renderProfile. */

/* ---------- avatar system ---------- */

function userAvatarUrl() {
  return progress().avatar || null;
}

function avatarHtml(name, cls = "", url = null) {
  return `<span class="av ${cls}" style="--hue:${leaderboardHue(name)}">${url ? `<img src="${url}" alt="" />` : leaderboardInitials(name)}</span>`;
}

function updateTopbarAvatar() {
  const btn = document.getElementById("topbar-avatar");
  if (!btn) return;
  const name = progress().signup?.name || "Guest Trader";
  btn.innerHTML = avatarHtml(name, "av-topbar", userAvatarUrl());
}

function handleAvatarUpload(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Choose an image file.", "info");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 144;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / img.width, size / img.height);
      ctx.drawImage(img, (size - img.width * scale) / 2, (size - img.height * scale) / 2, img.width * scale, img.height * scale);
      progress().avatar = canvas.toDataURL("image/jpeg", 0.85);
      saveProgress();
      renderProfile();
      updateTopbarAvatar();
      showToast("Profile picture updated.", "success");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- profile ---------- */

function profileJoinedLabel() {
  const p = progress();
  if (!p.joinedAt) {
    p.joinedAt = Date.now();
    saveProgress();
  }
  return new Date(p.joinedAt).toLocaleDateString([], { month: "long", year: "numeric" });
}

function renderProfile() {
  const root = document.getElementById("profile-root");
  if (!root) return;
  const p = progress();
  const plan = getUserPlan();
  const signedUp = typeof hasSignup === "function" && hasSignup();
  const name = p.signup?.name || "Guest Trader";
  const level = levelProgress(p.xp);
  const levelPercent = Math.min(100, Math.round((level.currentXp / level.neededXp) * 100));
  const rank = rankFromXp(p.xp);
  const overall = academyOverallStats();
  const arcade = arcadeData();
  const streak = Math.max(p.streak || 0, p.topStreak || 0);
  const track = typeof currentTrack === "function" ? currentTrack() : { label: "Futures", icon: "candlestick-chart" };
  const following = p.compete?.following || [];
  const followers = p.compete?.followers || [];
  const wins = p.lifetime?.wins || 0;
  const winRate = arcade.runsTotal ? Math.round((wins / arcade.runsTotal) * 100) : 0;
  const unlockedMap = typeof achievementsUnlocked === "function" ? achievementsUnlocked() : {};
  const achievementList = typeof ACHIEVEMENTS !== "undefined" ? ACHIEVEMENTS : [];
  const unlockedCount = Object.keys(unlockedMap).length;

  const showcase = [...achievementList]
    .sort((a, b) => {
      const aU = unlockedMap[a.id] ? 1 : 0;
      const bU = unlockedMap[b.id] ? 1 : 0;
      if (aU !== bU) return bU - aU;
      let aP = 0;
      let bP = 0;
      try { aP = Math.min(1, (a.value() || 0) / a.target); } catch {}
      try { bP = Math.min(1, (b.value() || 0) / b.target); } catch {}
      return bP - aP;
    })
    .slice(0, 4);

  // park the static referral + subscription cards back in their hidden home
  // before wiping, so re-renders never destroy them (they carry live bindings)
  const bottomGrid = document.querySelector(".profile-bottom-grid");
  const referralCard = document.getElementById("profile-referral-card");
  const subCard = document.querySelector(".profile-sub-card");
  if (bottomGrid) {
    if (referralCard) bottomGrid.appendChild(referralCard);
    if (subCard) bottomGrid.appendChild(subCard);
  }

  root.innerHTML = `
    <div class="pf-banner panel">
      <div class="pf-cover"></div>
      <div class="pf-banner-row">
        <button class="pf-avatar-wrap" id="pf-avatar-btn" type="button" title="Change profile picture">
          ${avatarHtml(name, "av-profile", userAvatarUrl())}
          <span class="pf-avatar-edit"><i data-lucide="camera"></i></span>
        </button>
        <div class="pf-identity">
          <h2>${name}</h2>
          <p class="pf-joined">Joined ${profileJoinedLabel()} · <b>${following.length}</b> Following · <b>${followers.length}</b> Followers</p>
          <div class="pf-badges-row">
            <span class="pf-track-badge"><i data-lucide="${track.icon}"></i> ${track.label} Trader</span>
            <span class="plan-tier-badge plan-${plan}">${planDisplayName(plan)}</span>
            <span class="pf-rank-chip">${rank} · Lv ${level.level}</span>
          </div>
        </div>
        ${signedUp ? "" : `<div class="pf-actions"><button class="primary-button" id="pf-signup" type="button">Create Free Profile</button></div>`}
      </div>
      <div class="pf-level-bar" title="${level.currentXp}/${level.neededXp} XP to Level ${level.level + 1}"><i style="width:${levelPercent}%"></i></div>
      ${typeof streakWeekMarkup === "function" ? `
        <div class="pf-week-wrap">
          <span class="pf-week-label">🔥 ${p.streak || 0} day streak${typeof streakSecuredToday === "function" && streakSecuredToday() ? " · secured today" : (p.streak || 0) > 0 ? " · at risk today" : ""}</span>
          <div class="streak-week">${streakWeekMarkup()}</div>
        </div>` : ""}
      <input type="file" id="pf-avatar-input" accept="image/*" hidden />
    </div>

    <h3 class="pf-section-title">Statistics</h3>
    <div class="pf-stats-grid">
      <div class="pf-stat panel"><span class="pf-stat-icon">🔥</span><div><strong>${p.streak || 0}</strong><small>Day streak · best ${streak}</small></div></div>
      <div class="pf-stat panel"><span class="pf-stat-icon">⚡</span><div><strong>${p.xp.toLocaleString()}</strong><small>Total XP</small></div></div>
      <div class="pf-stat panel"><span class="pf-stat-icon">🎓</span><div><strong>${overall.done}/${overall.total}</strong><small>Lessons (${track.label})</small></div></div>
      <div class="pf-stat panel"><span class="pf-stat-icon">🕹</span><div><strong>${(arcade.runsTotal || 0).toLocaleString()}</strong><small>Arcade runs</small></div></div>
      <div class="pf-stat panel"><span class="pf-stat-icon">🎯</span><div><strong>${winRate}%</strong><small>Win rate</small></div></div>
      <div class="pf-stat panel"><span class="pf-stat-icon">🏆</span><div><strong>${unlockedCount}</strong><small>Achievements</small></div></div>
    </div>

    <div class="pf-grid-2">
      <article class="panel pf-cell pf-ach-panel">
        <div class="pf-cell-head">
          <div class="panel-title">Achievements</div>
          <button class="pf-viewall nav-tab" data-view-target="achievements" type="button">VIEW ALL</button>
        </div>
        <div class="pf-ach-list">
          ${showcase.map((achievement) => {
            const isUnlocked = Boolean(unlockedMap[achievement.id]);
            let value = 0;
            try { value = Math.min(achievement.target, achievement.value()); } catch { value = 0; }
            const percent = isUnlocked ? 100 : Math.round((value / achievement.target) * 100);
            return `
              <div class="pf-ach ${isUnlocked ? "unlocked" : ""}">
                <span class="pf-ach-icon">${achievement.icon}</span>
                <div class="pf-ach-body">
                  <div class="pf-ach-top"><strong>${achievement.title}</strong><b>${isUnlocked ? "✓" : `${value}/${achievement.target}`}</b></div>
                  <div class="dq-bar"><i style="width:${percent}%"></i></div>
                  <small>${achievement.desc}</small>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </article>
      <div class="pf-cell" id="pf-referral-slot"></div>
    </div>

    <div class="pf-grid-2">
      <article class="panel pf-cell pf-friends-card">
        <div class="pf-cell-head">
          <div class="panel-title">Friends</div>
          <button class="pf-viewall nav-tab" data-view-target="compete" type="button">VIEW ALL</button>
        </div>
        ${following.length ? following.slice(0, 5).map((friend) => `
          <div class="pf-friend fr-clickable" data-pf-friend="${friend.code}" role="button" tabindex="0">
            ${avatarHtml(friend.name, "av-small", friend.avatar)}
            <span>${friend.name}<small>${(typeof TRACKS !== "undefined" && TRACKS[friend.track] ? TRACKS[friend.track].label : "Futures")} trader · Lv ${friend.stats?.level || 1}</small></span>
          </div>
        `).join("") : `<p class="tk-empty">Learning is better together — traders with friends finish far more courses.</p>`}
        <div class="pf-friend-actions">
          <button class="pf-friend-action nav-tab" data-view-target="compete" type="button"><i data-lucide="search"></i> Find friends</button>
          <button class="pf-friend-action" id="pf-invite" type="button"><i data-lucide="mail-plus"></i> Invite friends</button>
        </div>
      </article>
      <div class="pf-cell" id="pf-subscription-slot"></div>
    </div>
  `;

  // dock the live referral + subscription cards into the consolidated grid
  if (referralCard) root.querySelector("#pf-referral-slot")?.appendChild(referralCard);
  if (subCard) root.querySelector("#pf-subscription-slot")?.appendChild(subCard);
  if (bottomGrid) bottomGrid.classList.add("hidden");

  root.querySelector("#pf-signup")?.addEventListener("click", () => openSignup());
  root.querySelectorAll(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.viewTarget || "home"));
  });
  root.querySelectorAll("[data-pf-friend]").forEach((row) => {
    row.addEventListener("click", () => {
      if (typeof openFriendProfile === "function") openFriendProfile(row.dataset.pfFriend);
    });
  });
  root.querySelector("#pf-invite")?.addEventListener("click", () => {
    const link = typeof referralLink === "function" ? referralLink() : location.origin;
    navigator.clipboard?.writeText(`Join me on ReplayEdge — the day trader's one-stop shop. ${link}`);
    showToast("Invite link copied — send it to a friend.", "success");
  });
  const avatarInput = root.querySelector("#pf-avatar-input");
  root.querySelector("#pf-avatar-btn")?.addEventListener("click", () => avatarInput?.click());
  avatarInput?.addEventListener("change", (event) => handleAvatarUpload(event.target.files?.[0]));

  // subscription card (static panel below)
  const subTitle = document.getElementById("profile-subscription");
  const subCopy = document.getElementById("profile-subscription-copy");
  if (subTitle) subTitle.textContent = planDisplayName(plan);
  if (subCopy) {
    subCopy.textContent = plan === "free"
      ? "Upgrade to unlock the Trader Toolkit, XP boosts, and coach-level analytics."
      : `Your ${planDisplayName(plan)} plan is active. Manage it anytime through Stripe.`;
  }
  document.getElementById("manage-billing")?.classList.toggle("hidden", !p.subscriptionStatus?.active);
  if (typeof updatePlanSurfaces === "function") updatePlanSurfaces();
  if (typeof updateLogoutButtons === "function") updateLogoutButtons();
  updateTopbarAvatar();
  loadReferralStats();
  if (window.lucide) window.lucide.createIcons();
}

/* ---------- init ---------- */

(() => {
  updateTopbarAvatar();
  if (typeof state !== "undefined" && state.currentView === "profile") renderProfile();
})();
