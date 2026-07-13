/* ============================================================
   ReplayEdge — Email + password authentication (client)
   Owns the auth modal: register / login toggle, password reveal,
   live strength checklist, "remember me", and session restore.
   Real hashing + sessions live on the server (see server.js).
   Google sign-in stays in app.js; this module just stores the
   token it returns so the two share one "signed in" notion.
   ============================================================ */

const AUTH_STORE_KEY = "tradePulseAuth";

/* ---------- token storage (remember me) ---------- */
// remember on  -> localStorage (survives browser restart)
// remember off -> sessionStorage (cleared when the tab closes)

function authRead() {
  for (const store of [localStorage, sessionStorage]) {
    try {
      const raw = store.getItem(AUTH_STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.token && data.email) return { ...data, persistent: store === localStorage };
      }
    } catch { /* ignore */ }
  }
  return null;
}

function authWrite(token, email, remember) {
  const payload = JSON.stringify({ token, email: String(email || "").toLowerCase(), savedAt: Date.now() });
  try {
    // always clear both first so a login can flip persistence cleanly
    localStorage.removeItem(AUTH_STORE_KEY);
    sessionStorage.removeItem(AUTH_STORE_KEY);
    (remember ? localStorage : sessionStorage).setItem(AUTH_STORE_KEY, payload);
  } catch { /* storage may be blocked; session still works in-memory */ }
}

function authClearStore() {
  try { localStorage.removeItem(AUTH_STORE_KEY); } catch { /* ignore */ }
  try { sessionStorage.removeItem(AUTH_STORE_KEY); } catch { /* ignore */ }
}

function authToken() {
  return authRead()?.token || null;
}

/* ---------- password rules (mirror of server) ---------- */

function authPasswordRules(pw) {
  pw = String(pw || "");
  return {
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw)
  };
}

function authPasswordValid(pw) {
  const r = authPasswordRules(pw);
  return r.len && r.upper && r.lower && r.number;
}

/* ---------- modal element cache ---------- */

const authEls = {};
function authCache() {
  if (authEls.form) return authEls;
  authEls.modal = document.getElementById("signup-modal");
  authEls.form = document.getElementById("signup-form");
  authEls.eyebrow = document.getElementById("auth-eyebrow");
  authEls.title = document.getElementById("auth-title");
  authEls.subcopy = document.getElementById("auth-subcopy");
  authEls.tabRegister = document.getElementById("auth-tab-register");
  authEls.tabLogin = document.getElementById("auth-tab-login");
  authEls.name = document.getElementById("signup-name");
  authEls.email = document.getElementById("signup-email");
  authEls.password = document.getElementById("signup-password");
  authEls.password2 = document.getElementById("signup-password2");
  authEls.checklist = document.getElementById("auth-checklist");
  authEls.experience = document.getElementById("signup-experience");
  authEls.market = document.getElementById("signup-market");
  authEls.remember = document.getElementById("auth-remember");
  authEls.error = document.getElementById("auth-error");
  authEls.submit = document.getElementById("auth-submit");
  return authEls;
}

let authMode = "register";
let authBusy = false;

/* ---------- mode switching ---------- */

function authSetMode(mode) {
  authMode = mode === "login" ? "login" : "register";
  const els = authCache();
  if (!els.form) return;
  els.form.dataset.authMode = authMode;
  const isLogin = authMode === "login";

  els.form.querySelectorAll("[data-auth-only='register']").forEach((node) => {
    node.classList.toggle("hidden", isLogin);
  });
  els.tabRegister?.classList.toggle("active", !isLogin);
  els.tabLogin?.classList.toggle("active", isLogin);
  els.tabRegister?.setAttribute("aria-selected", String(!isLogin));
  els.tabLogin?.setAttribute("aria-selected", String(isLogin));

  els.eyebrow.textContent = isLogin ? "Welcome back" : "Create your account";
  els.title.textContent = isLogin ? "Log in to ReplayEdge" : "Create your account";
  els.subcopy.textContent = isLogin
    ? "Log in to load your account, subscription, and saved progress on any device."
    : "Save your progress, keep your streak, and unlock Tier 1 of every Academy plus 5 daily Arcade plays.";
  els.submit.textContent = isLogin ? "Log in" : "Create account";
  if (els.password) els.password.setAttribute("autocomplete", isLogin ? "current-password" : "new-password");
  authHideError();
  authUpdateChecklist();
}

function authOpen(mode) {
  const els = authCache();
  if (!els.modal) return;
  const remembered = authRead();
  if (remembered?.email && els.email && !els.email.value) els.email.value = remembered.email;
  authSetMode(mode || "register");
  els.modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
  setTimeout(() => (authMode === "login" ? els.email : els.name || els.email)?.focus(), 60);
}

/* ---------- validation UI ---------- */

function authHideError() {
  const els = authCache();
  els.error?.classList.add("hidden");
  if (els.error) els.error.textContent = "";
}

function authShowError(message) {
  const els = authCache();
  if (!els.error) return;
  els.error.textContent = message;
  els.error.classList.remove("hidden");
}

function authUpdateChecklist() {
  const els = authCache();
  if (!els.checklist || authMode === "login") return;
  const pw = els.password?.value || "";
  const pw2 = els.password2?.value || "";
  const rules = authPasswordRules(pw);
  const state = { ...rules, match: pw.length > 0 && pw === pw2 };
  els.checklist.querySelectorAll("li[data-rule]").forEach((li) => {
    li.classList.toggle("ok", Boolean(state[li.dataset.rule]));
  });
}

/* ---------- reveal ---------- */

function authBindReveal(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!button || !input) return;
  button.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.setAttribute("aria-pressed", String(show));
    button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    button.innerHTML = `<i data-lucide="${show ? "eye-off" : "eye"}"></i>`;
    if (window.lucide) window.lucide.createIcons();
    input.focus();
  });
}

/* ---------- submit ---------- */

async function authSubmit() {
  if (authBusy) return;
  const els = authCache();
  authHideError();

  const email = (els.email?.value || "").trim().toLowerCase();
  const password = els.password?.value || "";
  const remember = Boolean(els.remember?.checked);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    authShowError("Please enter a valid email address.");
    els.email?.focus();
    return;
  }

  if (authMode === "register") {
    if (!authPasswordValid(password)) {
      authShowError("Your password doesn't meet all the requirements below.");
      els.password?.focus();
      return;
    }
    if (password !== (els.password2?.value || "")) {
      authShowError("The two passwords don't match.");
      els.password2?.focus();
      return;
    }
  } else if (!password) {
    authShowError("Please enter your password.");
    els.password?.focus();
    return;
  }

  const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
  const body = authMode === "register"
    ? { email, password, name: (els.name?.value || "").trim() }
    : { email, password };

  authBusy = true;
  els.submit.disabled = true;
  els.submit.textContent = authMode === "register" ? "Creating account…" : "Logging in…";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Something went wrong. Please try again.");
    }
    authApplySuccess(result, remember, { experience: els.experience?.value, market: els.market?.value });
  } catch (error) {
    authShowError(error.message || "Network error. Please try again.");
  } finally {
    authBusy = false;
    els.submit.disabled = false;
    els.submit.textContent = authMode === "register" ? "Create account" : "Log in";
  }
}

/* ---------- apply a successful auth to the app ---------- */

function authApplySuccess(result, remember, extra) {
  const els = authCache();
  const user = result.user || {};
  const email = String(user.email || "").toLowerCase();

  authWrite(result.token, email, remember);

  const p = (typeof progress === "function") ? progress() : {};
  p.signup = {
    ...(p.signup || {}),
    name: user.name || p.signup?.name || email.split("@")[0],
    email,
    provider: user.provider || "password"
  };
  if (extra?.experience) p.signup.experience = extra.experience;
  else if (!p.signup.experience) p.signup.experience = "Beginner";
  if (extra?.market) p.signup.market = extra.market;
  else if (!p.signup.market) p.signup.market = "NQ";
  if (user.avatar && !p.avatar) p.signup.avatar = user.avatar;

  // reflect the server's subscription immediately (real, verified value)
  if (result.subscription) {
    p.subscriptionStatus = result.subscription;
    if (result.subscription.active && result.subscription.plan) p.plan = result.subscription.plan;
  }

  if (typeof saveProgress === "function") saveProgress();

  // pull + merge this account's cross-device progress from the server
  if (typeof progressSyncEnsureReconciled === "function") progressSyncEnsureReconciled();
  if (typeof refreshSubscriptionStatus === "function") refreshSubscriptionStatus();
  if (typeof updateProgressUi === "function") updateProgressUi();
  if (typeof updateLogoutButtons === "function") updateLogoutButtons();
  if (typeof renderProfile === "function") renderProfile();
  if (typeof adminMaybeAutoUnlock === "function") adminMaybeAutoUnlock();

  if (typeof authOnSignedIn === "function") authOnSignedIn(authMode);

  if (typeof closeModals === "function") closeModals();
  else authCache().modal?.classList.add("hidden");

  if (typeof showToast === "function") {
    showToast(authMode === "register" ? "Account created — you're all set." : `Welcome back, ${p.signup.name}.`, "success");
  }
}

/* ---------- session restore (remember me) ---------- */

async function authRestoreSession() {
  const stored = authRead();
  if (!stored) return false;
  // if progress already knows this email, we're effectively signed in already
  try {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: stored.token, email: stored.email })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      authClearStore(); // expired/invalid — force a fresh login next time
      return false;
    }
    const p = (typeof progress === "function") ? progress() : {};
    const user = result.user || {};
    p.signup = {
      ...(p.signup || {}),
      name: user.name || p.signup?.name || stored.email.split("@")[0],
      email: String(user.email || stored.email).toLowerCase(),
      provider: user.provider || "password"
    };
    if (result.subscription) {
      p.subscriptionStatus = result.subscription;
      if (result.subscription.active && result.subscription.plan) p.plan = result.subscription.plan;
    }
    if (typeof saveProgress === "function") saveProgress();
    if (typeof progressSyncEnsureReconciled === "function") progressSyncEnsureReconciled();
    if (typeof updateProgressUi === "function") updateProgressUi();
    if (typeof updateLogoutButtons === "function") updateLogoutButtons();
    if (typeof adminMaybeAutoUnlock === "function") adminMaybeAutoUnlock();
    return true;
  } catch {
    // offline / server asleep — keep the stored token, try again next load
    return false;
  }
}

/* ---------- logout (called by app.js logoutUser) ---------- */

async function authLogout() {
  const stored = authRead();
  authClearStore();
  if (!stored) return;
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: stored.token, email: stored.email })
    });
  } catch { /* best effort */ }
}

/* ---------- boot ---------- */

(() => {
  const boot = () => {
    const els = authCache();
    if (!els.form) return;

    authBindReveal("auth-reveal-password", "signup-password");
    authBindReveal("auth-reveal-password2", "signup-password2");

    els.form.querySelectorAll("[data-auth-switch]").forEach((btn) => {
      btn.addEventListener("click", () => authSetMode(btn.dataset.authSwitch));
    });

    els.password?.addEventListener("input", authUpdateChecklist);
    els.password2?.addEventListener("input", authUpdateChecklist);
    [els.email, els.password, els.password2].forEach((input) => input?.addEventListener("input", authHideError));

    document.getElementById("topbar-login")?.addEventListener("click", () => authOpen("login"));

    authSetMode("register");
    authRestoreSession();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.authOpen = authOpen;
  window.authSetMode = authSetMode;
  window.authSubmit = authSubmit;
  window.authLogout = authLogout;
  window.authRestoreSession = authRestoreSession;
  window.authToken = authToken;
  // used by app.js after Google sign-in so both paths share one token store
  window.authRemember = (token, email, remember) => authWrite(token, email, remember);
})();
