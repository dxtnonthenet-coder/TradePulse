const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = __dirname;
// DATA_DIR points at a Render Persistent Disk in production so nothing is wiped
// on deploy/restart; falls back to the local ./data folder in development.
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const progressDir = path.join(dataDir, "progress");
const signupsPath = path.join(dataDir, "signups.json");
const signupsCsvPath = path.join(dataDir, "signups.csv");
const subscriptionsPath = path.join(dataDir, "subscriptions.json");
const referralsPath = path.join(dataDir, "referrals.json");
const feedbackPath = path.join(dataDir, "feedback.json");
const analyticsPath = path.join(dataDir, "analytics.json");
const attemptsPath = path.join(dataDir, "attempts.json");
const scenarioStatsPath = path.join(dataDir, "scenario-stats.json");
const friendsPath = path.join(dataDir, "friends.json");
const lobbiesPath = path.join(dataDir, "lobbies.json");
const envPath = path.join(root, ".env");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

const publicFiles = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "academy.js",
  "tracks.js",
  "arcade.js",
  "profile.js",
  "toolkit.js",
  "compete.js",
  "achievements.js",
  "streak.js",
  "mastery.js",
  "trainer.js",
  "dashboard.js",
  "admin.js",
  "elite.js",
  "sync.js",
  "favicon.svg",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
  "refund.html",
  "manifest.json",
  "service-worker.js",
  "assets/modes/replay-mode.jpg",
  "assets/modes/daily-challenge.jpg",
  "assets/modes/ranked-battle.jpg",
  "assets/modes/trade-mode.jpg"
]);

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  });
}

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(progressDir)) fs.mkdirSync(progressDir, { recursive: true });
  if (!fs.existsSync(signupsPath)) fs.writeFileSync(signupsPath, "[]");
  if (!fs.existsSync(subscriptionsPath)) fs.writeFileSync(subscriptionsPath, "[]");
  if (!fs.existsSync(referralsPath)) fs.writeFileSync(referralsPath, "[]");
  if (!fs.existsSync(feedbackPath)) fs.writeFileSync(feedbackPath, "[]");
  if (!fs.existsSync(analyticsPath)) fs.writeFileSync(analyticsPath, "[]");
  if (!fs.existsSync(attemptsPath)) fs.writeFileSync(attemptsPath, "[]");
  if (!fs.existsSync(scenarioStatsPath)) fs.writeFileSync(scenarioStatsPath, "{}");
  if (!fs.existsSync(friendsPath)) fs.writeFileSync(friendsPath, "{}");
  if (!fs.existsSync(lobbiesPath)) fs.writeFileSync(lobbiesPath, "{}");
  if (!fs.existsSync(signupsCsvPath)) {
    fs.writeFileSync(signupsCsvPath, "createdAt,type,name,email,plan,source,details\n");
  }
}

function appendJsonRecord(filePath, entry) {
  ensureDataFiles();
  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const saved = {
    id: `rec_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...entry
  };
  rows.push(saved);
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
  return saved;
}

/* ---------- per-user progress store (cross-device saves) ---------- */

function progressUserIdOk(userId) {
  return typeof userId === "string" && userId.length >= 3 && userId.length <= 200;
}

function progressFilePath(userId) {
  // hash the identity so emails / guest ids can't escape the folder or collide
  const hash = crypto.createHash("sha1").update(String(userId).toLowerCase()).digest("hex");
  return path.join(progressDir, `${hash}.json`);
}

function readProgressRecord(userId) {
  ensureDataFiles();
  try {
    return JSON.parse(fs.readFileSync(progressFilePath(userId), "utf8"));
  } catch {
    return null;
  }
}

function writeProgressRecord(userId, record) {
  ensureDataFiles();
  fs.writeFileSync(progressFilePath(userId), JSON.stringify(record));
}

function readJsonFile(filePath, fallback) {
  ensureDataFiles();
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function readBody(req, raw = false) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let length = 0;
    req.on("data", (chunk) => {
      chunks.push(chunk);
      length += chunk.length;
      if (length > 1_000_000) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(raw ? buffer : buffer.toString("utf8"));
    });
    req.on("error", reject);
  });
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function renderStripeReturnPage({ eyebrow, title, message, action, href, tone }) {
  const isSuccess = tone === "success";
  const accent = isSuccess ? "#56d66d" : "#ffc94a";
  const accentSoft = isSuccess ? "rgba(86, 214, 109, 0.16)" : "rgba(255, 201, 74, 0.16)";
  const redirectDelay = isSuccess ? "2.6" : "3.4";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="${redirectDelay};url=${href}">
  <title>${title} | ReplayEdge</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #05080c;
      --panel: #111923;
      --panel-2: #172332;
      --line: rgba(255, 255, 255, 0.1);
      --text: #eef7f1;
      --muted: rgba(238, 247, 241, 0.68);
      --accent: ${accent};
      --accent-soft: ${accentSoft};
    }

    * { box-sizing: border-box; }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 20%, rgba(86, 214, 109, 0.12), transparent 34rem),
        linear-gradient(135deg, #05080c 0%, #0a1118 54%, #07120f 100%);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      opacity: 0.22;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(86, 214, 109, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(86, 214, 109, 0.12) 1px, transparent 1px);
      background-size: 52px 52px;
      mask-image: radial-gradient(circle at center, black, transparent 72%);
    }

    .return-card {
      position: relative;
      width: min(92vw, 560px);
      padding: 42px;
      border: 1px solid rgba(86, 214, 109, 0.22);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(23, 35, 50, 0.96), rgba(12, 18, 26, 0.96));
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
      text-align: center;
      isolation: isolate;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 30px;
      color: var(--text);
      font-weight: 900;
      letter-spacing: 0.02em;
      text-decoration: none;
      font-size: 22px;
    }

    .brand span { color: var(--accent); }

    .logo-wrap {
      position: relative;
      width: 76px;
      height: 76px;
      display: grid;
      place-items: center;
      margin: 0 auto 22px;
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(86, 214, 109, 0.22), rgba(86, 214, 109, 0.08));
      border: 1px solid rgba(86, 214, 109, 0.28);
    }

    .logo-wrap::before {
      content: "";
      position: absolute;
      inset: -9px;
      border-radius: 30px;
      border: 2px solid transparent;
      border-top-color: var(--accent);
      border-right-color: rgba(255, 255, 255, 0.14);
      animation: spin 1.05s linear infinite;
    }

    .logo-bars {
      display: flex;
      align-items: end;
      justify-content: center;
      gap: 7px;
      width: 44px;
      height: 44px;
    }

    .logo-bars i {
      display: block;
      width: 9px;
      border-radius: 999px 999px 3px 3px;
      background: linear-gradient(180deg, #83ffb0, var(--accent));
      box-shadow: 0 0 14px rgba(86, 214, 109, 0.35);
      animation: pulse 1.25s ease-in-out infinite;
    }

    .logo-bars i:nth-child(1) { height: 20px; animation-delay: 0s; }
    .logo-bars i:nth-child(2) { height: 32px; animation-delay: 0.12s; }
    .logo-bars i:nth-child(3) { height: 42px; animation-delay: 0.24s; }

    .eyebrow {
      margin: 0 0 12px;
      color: var(--accent);
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(34px, 7vw, 58px);
      line-height: 0.96;
      letter-spacing: -0.045em;
    }

    p {
      max-width: 430px;
      margin: 20px auto 0;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.55;
      font-weight: 700;
    }

    .loading-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 26px 0 0;
      color: rgba(238, 247, 241, 0.76);
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
      animation: blink 1s ease-in-out infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.14s; }
    .dot:nth-child(3) { animation-delay: 0.28s; }

    .actions {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 54px;
      padding: 0 24px;
      border-radius: 15px;
      background: linear-gradient(135deg, #74ffad, var(--accent));
      color: #06100b;
      font-size: 16px;
      font-weight: 950;
      text-decoration: none;
      box-shadow: 0 14px 34px rgba(86, 214, 109, 0.16);
    }

    .fineprint {
      margin-top: 18px;
      color: rgba(238, 247, 241, 0.45);
      font-size: 12px;
      font-weight: 800;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scaleY(0.9); opacity: 0.82; }
      50% { transform: scaleY(1.04); opacity: 1; }
    }

    @keyframes blink {
      0%, 100% { transform: translateY(0); opacity: 0.38; }
      50% { transform: translateY(-3px); opacity: 1; }
    }

    @media (max-width: 560px) {
      .return-card {
        padding: 30px 22px;
        border-radius: 22px;
      }

      p { font-size: 16px; }
      .brand { font-size: 19px; }
    }
  </style>
</head>
<body>
  <main class="return-card" aria-live="polite">
    <a class="brand" href="/#home" aria-label="Back to ReplayEdge">
      REPLAY<span>EDGE</span>
    </a>
    <div class="logo-wrap" aria-hidden="true">
      <div class="logo-bars"><i></i><i></i><i></i></div>
    </div>
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="loading-line">
      <span>Redirecting</span>
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    </div>
    <div class="actions">
      <a class="button" href="${href}">${action}</a>
    </div>
    <div class="fineprint">Secure checkout handled by Stripe.</div>
  </main>
</body>
</html>`;
}

function saveSignup(entry) {
  ensureDataFiles();
  const signups = JSON.parse(fs.readFileSync(signupsPath, "utf8"));
  const saved = {
    id: `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...entry
  };
  signups.push(saved);
  fs.writeFileSync(signupsPath, JSON.stringify(signups, null, 2));
  fs.appendFileSync(
    signupsCsvPath,
    [
      saved.createdAt,
      saved.type,
      saved.name,
      saved.email,
      saved.plan,
      saved.source,
      JSON.stringify(saved.details || {})
    ].map(csvCell).join(",") + "\n"
  );
  sendToSupabase(saved);
  return saved;
}

function safeString(value, max = 200) {
  return String(value || "").trim().slice(0, max);
}

function readAttempts() {
  ensureDataFiles();
  try {
    return JSON.parse(fs.readFileSync(attemptsPath, "utf8"));
  } catch {
    return [];
  }
}

function writeAttempts(rows) {
  ensureDataFiles();
  fs.writeFileSync(attemptsPath, JSON.stringify(rows, null, 2));
}

function readScenarioStats() {
  ensureDataFiles();
  try {
    return JSON.parse(fs.readFileSync(scenarioStatsPath, "utf8"));
  } catch {
    return {};
  }
}

function writeScenarioStats(stats) {
  ensureDataFiles();
  fs.writeFileSync(scenarioStatsPath, JSON.stringify(stats, null, 2));
}

function scenarioKey(id) {
  return safeString(id, 160) || "unknown";
}

function updateScenarioStats(attempt) {
  const stats = readScenarioStats();
  const key = scenarioKey(attempt.scenarioId);
  const existing = stats[key] || {
    scenarioId: key,
    totalAttempts: 0,
    correctAttempts: 0,
    answers: {},
    modes: {},
    updatedAt: null
  };
  existing.totalAttempts += 1;
  if (attempt.correct) existing.correctAttempts += 1;
  const answer = safeString(attempt.answer, 160) || "Unknown";
  existing.answers[answer] = (existing.answers[answer] || 0) + 1;
  const mode = safeString(attempt.mode, 80) || "replay";
  existing.modes[mode] = (existing.modes[mode] || 0) + 1;
  existing.updatedAt = new Date().toISOString();
  stats[key] = existing;
  writeScenarioStats(stats);
  return existing;
}

function distributionFromCounts(answers, totalAttempts) {
  const entries = Object.entries(answers || {});
  if (!entries.length || !totalAttempts) return [];
  return entries
    .map(([answer, count]) => ({
      answer,
      count,
      percent: Math.max(1, Math.round((count / totalAttempts) * 100))
    }))
    .sort((a, b) => b.count - a.count);
}

function communityStatsForScenario(scenarioId) {
  const stats = readScenarioStats()[scenarioKey(scenarioId)] || null;
  if (!stats) {
    return {
      scenarioId: scenarioKey(scenarioId),
      totalAttempts: 0,
      correctAttempts: 0,
      correctRate: null,
      distribution: []
    };
  }
  return {
    scenarioId: stats.scenarioId,
    totalAttempts: stats.totalAttempts,
    correctAttempts: stats.correctAttempts,
    correctRate: stats.totalAttempts ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100) : null,
    distribution: distributionFromCounts(stats.answers, stats.totalAttempts)
  };
}

function leaderboardFromAttempts() {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const users = new Map();
  readAttempts().forEach((attempt) => {
    const created = Date.parse(attempt.createdAt || 0);
    if (!created || created < since) return;
    const key = safeString(attempt.userId || attempt.email || attempt.userName || "guest", 180).toLowerCase();
    if (!users.has(key)) {
      users.set(key, {
        userId: key,
        userName: safeString(attempt.userName || attempt.email?.split("@")[0] || "Guest", 80),
        email: safeString(attempt.email, 160),
        xp: 0,
        total: 0,
        correct: 0,
        lastPlayedAt: attempt.createdAt
      });
    }
    const row = users.get(key);
    row.xp += Math.max(0, Number(attempt.xpEarned || attempt.earned || 0));
    row.total += 1;
    if (attempt.correct) row.correct += 1;
    if (Date.parse(attempt.createdAt) > Date.parse(row.lastPlayedAt || 0)) row.lastPlayedAt = attempt.createdAt;
  });
  return Array.from(users.values())
    .map((row) => ({
      ...row,
      accuracy: row.total ? Math.round((row.correct / row.total) * 100) : 0,
      xp: row.xp || row.correct * 120 + (row.total - row.correct) * 25
    }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 50);
}

async function sendAttemptToSupabase(saved) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/attempts?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        id: saved.id,
        created_at: saved.createdAt,
        user_id: saved.userId || null,
        user_name: saved.userName || null,
        email: saved.email || null,
        scenario_id: saved.scenarioId || null,
        mode: saved.mode || null,
        market: saved.market || null,
        pattern: saved.pattern || null,
        answer: saved.answer || null,
        correct: Boolean(saved.correct),
        correct_answer: saved.correctAnswer || null,
        confidence: saved.confidence || null,
        xp_earned: Number(saved.xpEarned || 0),
        time_to_answer: Number(saved.timeToAnswer || 0),
        difficulty: saved.difficulty || null,
        session: saved.session || null,
        source: saved.source || "ReplayEdge app",
        metadata: saved.metadata || {}
      })
    });
  } catch (error) {
    console.warn("Supabase attempt save failed. Local attempt save still worked.", error.message);
  }
}

function saveAttemptRecord(entry) {
  const rows = readAttempts();
  const saved = {
    id: safeString(entry.id, 120) || `att_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: entry.createdAt || new Date().toISOString(),
    userId: safeString(entry.userId, 180),
    userName: safeString(entry.userName, 80) || "Guest",
    email: safeString(entry.email, 160).toLowerCase(),
    scenarioId: scenarioKey(entry.scenarioId),
    mode: safeString(entry.mode, 80),
    market: safeString(entry.market, 40),
    pattern: safeString(entry.pattern, 120),
    answer: safeString(entry.answer, 180),
    correct: Boolean(entry.correct),
    correctAnswer: safeString(entry.correctAnswer, 180),
    confidence: safeString(entry.confidence, 40),
    xpEarned: Math.max(0, Math.round(Number(entry.xpEarned || entry.earned || 0))),
    timeToAnswer: Math.max(0, Number(entry.timeToAnswer || 0)),
    difficulty: safeString(entry.difficulty, 40),
    session: safeString(entry.session, 120),
    source: "ReplayEdge app",
    metadata: entry.metadata && typeof entry.metadata === "object" ? entry.metadata : {}
  };
  rows.push(saved);
  writeAttempts(rows.slice(-25000));
  const stats = updateScenarioStats(saved);
  sendAttemptToSupabase(saved);
  return { saved, stats: communityStatsForScenario(stats.scenarioId) };
}

async function sendToSupabase(saved) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/signups`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        lead_id: saved.id,
        created_at: saved.createdAt,
        type: saved.type || null,
        name: saved.name || null,
        email: saved.email || null,
        plan: saved.plan || null,
        source: saved.source || null,
        details: saved.details || {}
      })
    });
  } catch (error) {
    console.warn("Supabase save failed. Local file save still worked.", error.message);
  }
}

function stripePriceForPlan(plan, billingPeriod = "monthly") {
  const annual = billingPeriod === "annual";
  const prices = annual ? {
    Player: process.env.STRIPE_PRICE_PLAYER_ANNUAL,
    Coach: process.env.STRIPE_PRICE_COACH_ANNUAL,
    Elite: process.env.STRIPE_PRICE_ELITE_ANNUAL
  } : {
    Player: process.env.STRIPE_PRICE_PLAYER,
    Coach: process.env.STRIPE_PRICE_COACH,
    Elite: process.env.STRIPE_PRICE_ELITE
  };
  return prices[plan];
}

function publicSiteUrl(req) {
  const configured = process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${req.headers.host || "localhost:4173"}`;
}

function titleCase(value) {
  return String(value || "—")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function googleAuthUrl(req) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  const redirectTo = `${publicSiteUrl(req)}/?auth=google`;
  const params = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    apikey: anonKey
  });
  return `${url.replace(/\/$/, "")}/auth/v1/authorize?${params.toString()}`;
}

function planForStripePrice(priceId) {
  const entries = [
    ["Player", process.env.STRIPE_PRICE_PLAYER],
    ["Player", process.env.STRIPE_PRICE_PLAYER_ANNUAL],
    ["Coach", process.env.STRIPE_PRICE_COACH],
    ["Coach", process.env.STRIPE_PRICE_COACH_ANNUAL],
    ["Elite", process.env.STRIPE_PRICE_ELITE],
    ["Elite", process.env.STRIPE_PRICE_ELITE_ANNUAL]
  ];
  return entries.find(([, id]) => id === priceId)?.[0] || null;
}

async function stripeRequest(pathname, params, method = "POST") {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe secret key missing.");

  const response = await fetch(`https://api.stripe.com/v1/${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: method === "GET" ? undefined : params
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Stripe request failed.");
  return data;
}

async function stripeGet(pathname) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe secret key missing.");

  const response = await fetch(`https://api.stripe.com/v1/${pathname}`, {
    headers: { Authorization: `Bearer ${secret}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Stripe request failed.");
  return data;
}

function readSubscriptions() {
  ensureDataFiles();
  return JSON.parse(fs.readFileSync(subscriptionsPath, "utf8"));
}

function readReferrals() {
  ensureDataFiles();
  return JSON.parse(fs.readFileSync(referralsPath, "utf8"));
}

function writeReferrals(referrals) {
  ensureDataFiles();
  fs.writeFileSync(referralsPath, JSON.stringify(referrals, null, 2));
}

function createReferralCode(seed) {
  const hash = crypto.createHash("sha1").update(String(seed || Date.now())).digest("hex");
  return `RE-${hash.slice(0, 6).toUpperCase()}`;
}

function referralStatsForUser(userId, referredBy = "") {
  const referrals = readReferrals();
  const owner = referrals.find((item) => item.type === "generated" && item.userId === userId);
  const code = owner?.code || null;
  const referralCount = code ? referrals.filter((item) => item.type !== "generated" && item.code === code).length : 0;
  return {
    code,
    stats: {
      referrals: referralCount,
      rewardStatus: referralCount > 0 ? "pending" : "none",
      joinedVia: Boolean(referredBy)
    }
  };
}

function writeSubscriptions(subscriptions) {
  ensureDataFiles();
  fs.writeFileSync(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
}

function saveSubscription(record) {
  const subscriptions = readSubscriptions();
  const email = String(record.email || "").toLowerCase();
  const index = subscriptions.findIndex((item) =>
    item.stripeSubscriptionId === record.stripeSubscriptionId ||
    (email && String(item.email || "").toLowerCase() === email)
  );
  const saved = {
    ...(index >= 0 ? subscriptions[index] : {}),
    ...record,
    email,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) subscriptions[index] = saved;
  else subscriptions.push({ id: `sub_${Date.now()}_${Math.random().toString(16).slice(2)}`, createdAt: new Date().toISOString(), ...saved });

  writeSubscriptions(subscriptions);
  sendSubscriptionToSupabase(saved);
  return saved;
}

async function handleAssistantChat(payload) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Anthropic API key missing.");
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const safeMessages = messages
    .filter((message) => ["user", "assistant"].includes(message.role) && typeof message.content === "string")
    .slice(-12)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 1200) }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 420,
      system: "You are the ReplayEdge Assistant. ReplayEdge is a futures trading education replay game with Free, Player, Coach, and Elite plans; game modes include Replay Mode, Daily Challenge, Ranked Battle, Trade Mode, Spot the Setup, Candle Survival, No-Trade Challenge, Chart Detective, Build the Thesis, and Review Queue. Explain XP, streaks, leaderboards, bookmarks, plans, and training features clearly and concisely. Do not provide financial advice, trade alerts, broker execution guidance, or personalized investment recommendations. If asked unrelated questions, politely redirect to ReplayEdge or trading education practice.",
      messages: safeMessages.length ? safeMessages : [{ role: "user", content: "Hello" }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Anthropic request failed.");
  return data.content?.map((part) => part.text || "").join("").trim() || "I can help with ReplayEdge plans, games, XP, streaks, and training features.";
}

async function handleGoogleAuthUser(payload) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const token = String(payload.access_token || "");
  if (!url || !anonKey) throw new Error("Google sign-in is not configured yet.");
  if (!token) throw new Error("Missing Google sign-in token.");

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`
    }
  });
  const user = await response.json();
  if (!response.ok) throw new Error(user.msg || user.error_description || "Could not verify Google sign-in.");
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Google Trader",
    avatar: user.user_metadata?.avatar_url || null
  };
}

async function sendSubscriptionToSupabase(saved) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !saved.email) return;

  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/subscriptions?email=eq.${encodeURIComponent(saved.email)}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        email: saved.email,
        name: saved.name || null,
        plan: saved.plan || null,
        status: saved.status || null,
        stripe_customer_id: saved.stripeCustomerId || null,
        stripe_subscription_id: saved.stripeSubscriptionId || null,
        current_period_end: saved.currentPeriodEnd ? new Date(saved.currentPeriodEnd * 1000).toISOString() : null,
        trial_end: saved.trialEnd ? new Date(saved.trialEnd * 1000).toISOString() : null,
        cancel_at_period_end: Boolean(saved.cancelAtPeriodEnd),
        updated_at: saved.updatedAt
      })
    });

    await fetch(`${url.replace(/\/$/, "")}/rest/v1/subscriptions?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        email: saved.email,
        name: saved.name || null,
        plan: saved.plan || null,
        status: saved.status || null,
        stripe_customer_id: saved.stripeCustomerId || null,
        stripe_subscription_id: saved.stripeSubscriptionId || null,
        current_period_end: saved.currentPeriodEnd ? new Date(saved.currentPeriodEnd * 1000).toISOString() : null,
        trial_end: saved.trialEnd ? new Date(saved.trialEnd * 1000).toISOString() : null,
        cancel_at_period_end: Boolean(saved.cancelAtPeriodEnd),
        updated_at: saved.updatedAt
      })
    });
  } catch (error) {
    console.warn("Supabase subscription save failed. Local save still worked.", error.message);
  }
}

function subscriptionForEmail(email) {
  const normalized = String(email || "").toLowerCase();
  if (!normalized) return null;
  return readSubscriptions().find((item) => String(item.email || "").toLowerCase() === normalized) || null;
}

function publicSubscription(record) {
  if (!record) return { active: false, plan: null, status: "none" };
  const activeStatuses = new Set(["active", "trialing"]);
  return {
    active: activeStatuses.has(record.status),
    plan: record.plan || null,
    status: record.status || "unknown",
    currentPeriodEnd: record.currentPeriodEnd || null,
    trialEnd: record.trialEnd || null,
    cancelAtPeriodEnd: Boolean(record.cancelAtPeriodEnd)
  };
}

async function createCheckoutSession(payload) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const billingPeriod = payload.billingPeriod === "annual" ? "annual" : "monthly";
  const price = stripePriceForPlan(payload.plan, billingPeriod);
  if (!secret || !price) {
    return {
      configured: false,
      message: billingPeriod === "annual"
        ? "Annual billing is not configured yet. Add annual Stripe price IDs or choose monthly."
        : "Stripe is not configured yet. Add STRIPE_SECRET_KEY and price IDs to .env."
    };
  }

  const host = process.env.PUBLIC_SITE_URL || `http://localhost:${port}`;
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", price);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${host}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${host}/cancel.html`);
  params.set("payment_method_collection", "always");
  params.set("billing_address_collection", "auto");
  params.set("customer_creation", "if_required");
  params.set("allow_promotion_codes", "true");
  params.set("metadata[plan]", payload.plan);
  params.set("metadata[billingPeriod]", billingPeriod);
  params.set("metadata[email]", payload.email || "");
  params.set("metadata[name]", payload.name || "");
  params.set("metadata[source]", "replayedge_prototype");
  params.set("subscription_data[metadata][plan]", payload.plan);
  params.set("subscription_data[metadata][billingPeriod]", billingPeriod);
  params.set("subscription_data[metadata][email]", payload.email || "");
  params.set("subscription_data[metadata][name]", payload.name || "");
  if (payload.email) params.set("customer_email", payload.email);
  if (payload.trial) params.set("subscription_data[trial_period_days]", "3");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Stripe Checkout failed.");
  }

  return { configured: true, url: data.url, id: data.id };
}

function verifyStripeWebhook(rawBody, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  if (!signature) throw new Error("Missing Stripe signature.");

  const timestamp = signature.match(/t=([^,]+)/)?.[1];
  const signatures = signature.match(/v1=([^,]+)/g)?.map((part) => part.slice(3)) || [];
  if (!timestamp || !signatures.length) throw new Error("Invalid Stripe signature header.");

  const signedPayload = `${timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const valid = signatures.some((value) => {
    const left = Buffer.from(value, "hex");
    const right = Buffer.from(expected, "hex");
    return left.length === right.length && crypto.timingSafeEqual(left, right);
  });

  if (!valid) throw new Error("Invalid Stripe webhook signature.");
}

async function subscriptionRecordFromStripe(subscriptionId, fallback = {}) {
  const subscription = await stripeGet(`subscriptions/${subscriptionId}`);
  const customer = subscription.customer ? await stripeGet(`customers/${subscription.customer}`) : {};
  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const email = fallback.email || subscription.metadata?.email || customer.email || "";
  const name = fallback.name || subscription.metadata?.name || customer.name || "";
  return {
    email,
    name,
    plan: fallback.plan || subscription.metadata?.plan || planForStripePrice(priceId),
    status: subscription.status,
    stripeCustomerId: subscription.customer || fallback.stripeCustomerId || null,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: subscription.current_period_end || null,
    trialEnd: subscription.trial_end || null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false
  };
}

async function handleStripeEvent(event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.mode !== "subscription" || !session.subscription) return;
    const record = await subscriptionRecordFromStripe(session.subscription, {
      email: session.customer_details?.email || session.metadata?.email || "",
      name: session.customer_details?.name || session.metadata?.name || "",
      plan: session.metadata?.plan || null,
      stripeCustomerId: session.customer || null
    });
    saveSubscription(record);
    return;
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const priceId = subscription.items?.data?.[0]?.price?.id || null;
    const customer = subscription.customer ? await stripeGet(`customers/${subscription.customer}`) : {};
    saveSubscription({
      email: subscription.metadata?.email || customer.email || "",
      name: subscription.metadata?.name || customer.name || "",
      plan: subscription.metadata?.plan || planForStripePrice(priceId),
      status: subscription.status,
      stripeCustomerId: subscription.customer || null,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: subscription.current_period_end || null,
      trialEnd: subscription.trial_end || null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false
    });
  }
}

async function createPortalSession(payload) {
  const email = String(payload.email || "").toLowerCase();
  const subscription = subscriptionForEmail(email);
  if (!subscription?.stripeCustomerId) {
    return { configured: true, ok: false, message: "No paid Stripe customer found for this email yet." };
  }

  const host = process.env.PUBLIC_SITE_URL || `http://localhost:${port}`;
  const params = new URLSearchParams();
  params.set("customer", subscription.stripeCustomerId);
  params.set("return_url", `${host}/`);
  const session = await stripeRequest("billing_portal/sessions", params);
  return { configured: true, ok: true, url: session.url };
}

loadEnv();

/* ---------- live market data proxy ----------
   Primary source: Yahoo Finance. When Yahoo throttles (it does), we fall back
   per asset class: Cboe delayed (stocks + index proxies), Coinbase (crypto),
   Kraken + frankfurter.dev (forex), NASDAQ (stocks). Everything is normalized
   to { bars:[{t,o,h,l,c,v}], meta:{last, prevClose}, source, label }. */

const marketCache = new Map();
const MARKET_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function marketCachePut(key, data) {
  marketCache.set(key, { at: Date.now(), data });
  if (marketCache.size > 300) {
    [...marketCache.entries()]
      .sort((a, b) => a[1].at - b[1].at)
      .slice(0, 100)
      .forEach(([k]) => marketCache.delete(k));
  }
}

async function marketFetchRaw(url, asText = false) {
  const response = await fetch(url, {
    headers: { "User-Agent": MARKET_UA, Accept: asText ? "*/*" : "application/json" },
    signal: AbortSignal.timeout(9000)
  });
  if (!response.ok) throw new Error(`Upstream ${response.status}`);
  return asText ? response.text() : response.json();
}

function marketSymbolOk(symbol) {
  return /^[A-Za-z0-9.^=-]{1,15}$/.test(symbol);
}

/* ----- providers ----- */

async function yahooChartProvider(symbol, range, interval) {
  let lastError = null;
  for (const host of ["query1", "query2"]) {
    try {
      const data = await marketFetchRaw(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`);
      const result = data?.chart?.result?.[0];
      if (!result) throw new Error(data?.chart?.error?.description || "No data for symbol");
      const quote = result.indicators?.quote?.[0] || {};
      const bars = (result.timestamp || []).reduce((list, stamp, index) => {
        const close = quote.close?.[index];
        if (close === null || close === undefined) return list;
        list.push({
          t: stamp * 1000,
          o: quote.open?.[index] ?? close,
          h: quote.high?.[index] ?? close,
          l: quote.low?.[index] ?? close,
          c: close,
          v: quote.volume?.[index] || 0
        });
        return list;
      }, []);
      return {
        bars,
        meta: { last: result.meta?.regularMarketPrice ?? null, prevClose: result.meta?.chartPreviousClose ?? result.meta?.previousClose ?? null },
        source: "Yahoo Finance",
        label: interval === "1d" ? "daily" : `${interval} bars`
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Yahoo unavailable");
}

const CBOE_PROXIES = {
  "ES=F": ["_SPX", "S&P 500 index — delayed proxy for ES"],
  "NQ=F": ["_NDX", "Nasdaq 100 index — delayed proxy for NQ"],
  "RTY=F": ["_RUT", "Russell 2000 index — delayed proxy for RTY"],
  "YM=F": ["_DJX", "Dow index — delayed proxy for YM"],
  "GC=F": ["GLD", "Gold ETF (GLD) — delayed proxy for GC futures"],
  "SI=F": ["SLV", "Silver ETF (SLV) — delayed proxy for SI futures"],
  "CL=F": ["USO", "Oil ETF (USO) — delayed proxy for CL futures"],
  "NG=F": ["UNG", "Nat gas ETF (UNG) — delayed proxy for NG futures"],
  "ZB=F": ["TLT", "20+yr Treasury ETF (TLT) — delayed proxy for ZB futures"],
  "6E=F": ["FXE", "Euro ETF (FXE) — delayed proxy for 6E futures"],
  "XAUUSD=X": ["GLD", "Gold ETF (GLD) — delayed proxy for spot gold"],
  "^GSPC": ["_SPX", null],
  "^VIX": ["_VIX", null],
  "^NDX": ["_NDX", null],
  "^RUT": ["_RUT", null],
  "^TNX": ["_TNX", null]
};

async function cboeChartProvider(symbol) {
  const mapped = CBOE_PROXIES[symbol];
  const cboeSymbol = mapped ? mapped[0] : symbol.toUpperCase();
  if (!/^[A-Z_]{1,12}$/.test(cboeSymbol)) throw new Error("Not a Cboe symbol");
  const data = await marketFetchRaw(`https://cdn.cboe.com/api/global/delayed_quotes/charts/intraday/${cboeSymbol}.json`);
  const rows = data?.data || [];
  if (!rows.length) throw new Error("No Cboe data");
  const bars = rows.map((row) => ({
    t: Date.parse(row.datetime),
    o: row.price?.open,
    h: row.price?.high,
    l: row.price?.low,
    c: row.price?.close,
    v: row.volume?.stock_volume || 0
  })).filter((bar) => isFinite(bar.c) && bar.c > 0 && bar.l > 0); // Cboe pads dead minutes with zero bars
  return {
    bars,
    meta: { last: bars[bars.length - 1]?.c ?? null, prevClose: null },
    source: "Cboe (delayed)",
    label: "1m bars · today",
    proxyNote: mapped && mapped[1] ? mapped[1] : null
  };
}

async function coinbaseChartProvider(symbol) {
  const data = await marketFetchRaw(`https://api.exchange.coinbase.com/products/${encodeURIComponent(symbol)}/candles?granularity=300`);
  if (!Array.isArray(data) || !data.length) throw new Error("No Coinbase data");
  const bars = data.reverse().map(([time, low, high, open, close, volume]) => ({
    t: time * 1000, o: open, h: high, l: low, c: close, v: volume
  }));
  return {
    bars,
    meta: { last: bars[bars.length - 1]?.c ?? null, prevClose: null },
    source: "Coinbase",
    label: "5m bars · 24h"
  };
}

async function krakenChartProvider(symbol) {
  const pair = symbol.replace(/=X$/, "");
  const data = await marketFetchRaw(`https://api.kraken.com/0/public/OHLC?pair=${encodeURIComponent(pair)}&interval=15`);
  if (data?.error?.length) throw new Error(data.error[0]);
  const key = Object.keys(data?.result || {}).find((item) => item !== "last");
  const rows = key ? data.result[key] : [];
  if (!rows.length) throw new Error("No Kraken data");
  const bars = rows.slice(-120).map(([time, open, high, low, close, , volume]) => ({
    t: time * 1000, o: Number(open), h: Number(high), l: Number(low), c: Number(close), v: Number(volume)
  }));
  return {
    bars,
    meta: { last: bars[bars.length - 1]?.c ?? null, prevClose: null },
    source: "Kraken",
    label: "15m bars"
  };
}

async function frankfurterChartProvider(symbol) {
  const pair = symbol.replace(/=X$/, "");
  const base = pair.slice(0, 3);
  const quoteCur = pair.slice(3, 6);
  const start = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const end = new Date().toISOString().slice(0, 10);
  const data = await marketFetchRaw(`https://api.frankfurter.dev/v1/${start}..${end}?base=${base}&symbols=${quoteCur}`);
  const entries = Object.entries(data?.rates || {}).sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) throw new Error("No ECB data for that pair");
  let prev = null;
  const bars = entries.map(([date, rates]) => {
    const close = rates[quoteCur];
    const open = prev ?? close;
    prev = close;
    return { t: Date.parse(date), o: open, h: Math.max(open, close), l: Math.min(open, close), c: close, v: 0 };
  });
  return {
    bars,
    meta: { last: bars[bars.length - 1]?.c ?? null, prevClose: bars.length > 1 ? bars[bars.length - 2].c : null },
    source: "ECB reference rates",
    label: "daily · 30d"
  };
}

async function nasdaqChartProvider(symbol) {
  const data = await marketFetchRaw(`https://api.nasdaq.com/api/quote/${encodeURIComponent(symbol)}/chart?assetclass=stocks`);
  const points = data?.data?.chart || [];
  if (!points.length) throw new Error("No NASDAQ data");
  let prev = null;
  const bars = points.map((point) => {
    const close = Number(point?.z?.value ?? point?.y);
    const t = point?.z?.dateTime ? Date.parse(point.z.dateTime) : point?.x;
    const open = prev ?? close;
    prev = close;
    return { t, o: open, h: Math.max(open, close), l: Math.min(open, close), c: close, v: Number(point?.z?.volume || 0) };
  }).filter((bar) => isFinite(bar.c) && isFinite(bar.t));
  const prevClose = Number(String(data?.data?.previousClose || "").replace(/[$,]/g, "")) || null;
  return {
    bars,
    meta: { last: bars[bars.length - 1]?.c ?? null, prevClose },
    source: "NASDAQ (delayed)",
    label: "intraday · today"
  };
}

function marketFallbacksFor(symbol) {
  if (CBOE_PROXIES[symbol]) return [cboeChartProvider]; // mapped proxies win (incl. XAUUSD=X → GLD)
  if (/-USD$/.test(symbol)) return [coinbaseChartProvider];
  if (/=X$/.test(symbol)) return [krakenChartProvider, frankfurterChartProvider];
  if (symbol === "DX-Y.NYB") {
    return [async () => {
      const result = await cboeChartProvider("UUP");
      return { ...result, proxyNote: "Dollar ETF (UUP) — delayed proxy for DXY" };
    }];
  }
  if (/=F$/.test(symbol) || /^\^/.test(symbol)) return [];
  return [cboeChartProvider, nasdaqChartProvider];
}

async function loadMarketChart(symbol, range, interval) {
  const cacheKey = `chart:${symbol}:${range}:${interval}`;
  const cached = marketCache.get(cacheKey);
  if (cached && Date.now() - cached.at < 60_000) return cached.data;
  const errors = [];
  const providers = [
    (sym) => yahooChartProvider(sym, range, interval),
    ...marketFallbacksFor(symbol)
  ];
  for (const provider of providers) {
    try {
      const result = await provider(symbol);
      if (result?.bars?.length) {
        marketCachePut(cacheKey, result);
        return result;
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  if (cached) return cached.data; // stale beats nothing
  throw new Error(errors[errors.length - 1] || "No data source available for that symbol");
}

/* ----- news: Yahoo search first, Google News RSS as fallback ----- */

function decodeXmlEntities(text) {
  return String(text || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");
}

async function loadMarketNews(symbol, queryText) {
  const cacheKey = `news:${symbol}:${queryText}`;
  const cached = marketCache.get(cacheKey);
  if (cached && Date.now() - cached.at < 300_000) return cached.data;
  let news = [];
  try {
    const data = await marketFetchRaw(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&newsCount=10&quotesCount=0&listsCount=0`);
    news = (data?.news || []).map((item) => ({
      title: item.title,
      publisher: item.publisher,
      link: item.link,
      publishedAt: item.providerPublishTime ? item.providerPublishTime * 1000 : null
    }));
  } catch {
    // fall through to Google News RSS
  }
  if (!news.length) {
    const xml = await marketFetchRaw(`https://news.google.com/rss/search?q=${encodeURIComponent(queryText || symbol)}&hl=en-US&gl=US&ceid=US:en`, true);
    news = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10).map(([, item]) => {
      const title = decodeXmlEntities((item.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
      const link = decodeXmlEntities((item.match(/<link>([\s\S]*?)<\/link>/) || [])[1]);
      const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1];
      const publisher = decodeXmlEntities((item.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1]);
      return { title, publisher, link, publishedAt: pubDate ? Date.parse(pubDate) : null };
    }).filter((item) => item.title && item.link);
  }
  const result = news.filter((item) => item.title && item.link).slice(0, 8);
  marketCachePut(cacheKey, result);
  return result;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && parsedUrl.pathname === "/api/stripe-webhook") {
    readBody(req, true)
      .then(async (rawBody) => {
        verifyStripeWebhook(rawBody, req.headers["stripe-signature"]);
        const event = JSON.parse(rawBody.toString("utf8"));
        await handleStripeEvent(event);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: true }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && req.url === "/api/signups") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = saveSignup(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, saved }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/subscription-status") {
    const email = parsedUrl.searchParams.get("email");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(publicSubscription(subscriptionForEmail(email))));
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/auth-config") {
    const url = googleAuthUrl(req);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      googleConfigured: Boolean(url),
      googleUrl: url,
      message: url ? "Google sign-in ready." : "Add SUPABASE_URL and SUPABASE_ANON_KEY to enable Google sign-in."
    }));
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/auth-user") {
    readBody(req)
      .then((body) => handleGoogleAuthUser(JSON.parse(body || "{}")))
      .then((user) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, user }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/digest-signup") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = saveSignup({
          type: "weekly_digest",
          name: data.name || "",
          email: data.email || "",
          plan: "Coach",
          source: "ReplayEdge profile",
          details: { enabled: Boolean(data.enabled) }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, saved }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/friends/register") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const userId = String(data.userId || "").slice(0, 120);
        if (!userId) throw new Error("Missing userId");
        const users = readJsonFile(friendsPath, {});
        if (!users[userId]) {
          users[userId] = { code: `TR-${crypto.randomBytes(3).toString("hex").toUpperCase()}`, following: [], followers: [] };
        }
        const me = users[userId];
        // migrate legacy mutual friends → following + followers
        if (Array.isArray(me.friends)) {
          me.following = [...new Set([...(me.following || []), ...me.friends])];
          me.followers = [...new Set([...(me.followers || []), ...me.friends])];
          delete me.friends;
        }
        me.following = me.following || [];
        me.followers = me.followers || [];
        me.name = String(data.name || me.name || "Trader").slice(0, 40);
        me.track = String(data.track || me.track || "futures").slice(0, 20);
        me.weeklyXp = Math.max(0, Number(data.weeklyXp || 0));
        me.weeklyActivity = Math.max(0, Number(data.weeklyActivity || 0));
        if (data.lastActiveDay) me.lastActiveDay = String(data.lastActiveDay).slice(0, 40);
        if (data.stats && typeof data.stats === "object") {
          me.stats = {
            xp: Math.max(0, Number(data.stats.xp || 0)),
            level: Math.max(1, Number(data.stats.level || 1)),
            streak: Math.max(0, Number(data.stats.streak || 0)),
            lessons: Math.max(0, Number(data.stats.lessons || 0)),
            runs: Math.max(0, Number(data.stats.runs || 0)),
            winRate: Math.max(0, Math.min(100, Number(data.stats.winRate || 0))),
            achievements: Math.max(0, Number(data.stats.achievements || 0))
          };
        }
        if (typeof data.avatar === "string" && data.avatar.startsWith("data:image") && data.avatar.length < 40000) {
          me.avatar = data.avatar;
        }
        fs.writeFileSync(friendsPath, JSON.stringify(users, null, 2));
        const profileOf = (id) => {
          const user = users[id];
          if (!user) return null;
          return {
            code: user.code, name: user.name, track: user.track || "futures",
            weeklyXp: user.weeklyXp || 0, weeklyActivity: user.weeklyActivity || 0,
            lastActiveDay: user.lastActiveDay || "", avatar: user.avatar || null,
            stats: user.stats || {}
          };
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          ok: true,
          code: me.code,
          following: me.following.map(profileOf).filter(Boolean),
          followers: me.followers.map(profileOf).filter(Boolean),
          cheers: (me.cheers || []).slice(-10)
        }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && (parsedUrl.pathname === "/api/friends/follow" || parsedUrl.pathname === "/api/friends/add" || parsedUrl.pathname === "/api/friends/unfollow")) {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const userId = String(data.userId || "").slice(0, 120);
        const code = String(data.code || "").trim().toUpperCase().slice(0, 20);
        const users = readJsonFile(friendsPath, {});
        if (!users[userId]) throw new Error("Register first");
        const targetId = Object.keys(users).find((id) => users[id].code === code);
        if (!targetId) throw new Error("No trader found with that code");
        if (targetId === userId) throw new Error("That's your own code");
        const me = users[userId];
        const target = users[targetId];
        me.following = me.following || [];
        me.followers = me.followers || [];
        target.following = target.following || [];
        target.followers = target.followers || [];
        if (parsedUrl.pathname === "/api/friends/unfollow") {
          me.following = me.following.filter((id) => id !== targetId);
          target.followers = target.followers.filter((id) => id !== userId);
        } else {
          if (!me.following.includes(targetId)) me.following.push(targetId);
          if (!target.followers.includes(userId)) target.followers.push(userId);
        }
        fs.writeFileSync(friendsPath, JSON.stringify(users, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          ok: true,
          friend: {
            code: target.code, name: target.name, track: target.track || "futures",
            weeklyXp: target.weeklyXp || 0, weeklyActivity: target.weeklyActivity || 0,
            lastActiveDay: target.lastActiveDay || "", avatar: target.avatar || null,
            stats: target.stats || {},
            followsYou: (target.following || []).includes(userId)
          }
        }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/friends/search") {
    const query = String(parsedUrl.searchParams.get("name") || "").trim().toLowerCase().slice(0, 40);
    const users = readJsonFile(friendsPath, {});
    const matches = query.length >= 2
      ? Object.values(users)
          .filter((user) => String(user.name || "").toLowerCase().includes(query))
          .slice(0, 6)
          .map((user) => ({ name: user.name, code: user.code, track: user.track || "futures", avatar: user.avatar || null, stats: user.stats || {} }))
      : [];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, matches }));
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/friends/cheer") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const users = readJsonFile(friendsPath, {});
        const targetCode = String(data.toCode || "").trim().toUpperCase().slice(0, 20);
        const targetId = Object.keys(users).find((id) => users[id].code === targetCode);
        if (!targetId) throw new Error("Friend not found");
        users[targetId].cheers = (users[targetId].cheers || []).slice(-19);
        users[targetId].cheers.push({
          from: String(data.from || "A friend").slice(0, 40),
          kind: String(data.kind || "cheer").slice(0, 20),
          at: Date.now()
        });
        fs.writeFileSync(friendsPath, JSON.stringify(users, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/lobby/create") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const lobbies = readJsonFile(lobbiesPath, {});
        const code = `LB-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
        lobbies[code] = {
          game: String(data.game || "candlerush").slice(0, 30),
          track: String(data.track || "futures").slice(0, 20),
          host: String(data.name || "Trader").slice(0, 40),
          createdAt: new Date().toISOString(),
          scores: []
        };
        fs.writeFileSync(lobbiesPath, JSON.stringify(lobbies, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, code, lobby: lobbies[code] }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/lobby/score") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const lobbies = readJsonFile(lobbiesPath, {});
        const code = String(data.code || "").trim().toUpperCase().slice(0, 20);
        const lobby = lobbies[code];
        if (!lobby) throw new Error("Lobby not found");
        lobby.scores.push({ name: String(data.name || "Trader").slice(0, 40), score: Math.max(0, Number(data.score || 0)), at: new Date().toISOString() });
        lobby.scores = lobby.scores.slice(-50);
        fs.writeFileSync(lobbiesPath, JSON.stringify(lobbies, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, lobby: { code, ...lobby } }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/lobby/get") {
    const code = String(parsedUrl.searchParams.get("code") || "").trim().toUpperCase().slice(0, 20);
    const lobbies = readJsonFile(lobbiesPath, {});
    if (!lobbies[code]) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Lobby not found" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, lobby: { code, ...lobbies[code] } }));
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/referral/stats") {
    const userId = String(parsedUrl.searchParams.get("userId") || "").slice(0, 120);
    const referredBy = String(parsedUrl.searchParams.get("referredBy") || "").slice(0, 80);
    if (!userId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Missing userId" }));
      return;
    }
    const result = referralStatsForUser(userId, referredBy);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, ...result }));
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/referral/generate") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const userId = String(data.userId || "").slice(0, 120);
        if (!userId) throw new Error("Missing userId");
        const referrals = readReferrals();
        let owner = referrals.find((item) => item.type === "generated" && item.userId === userId);
        if (!owner) {
          let code = createReferralCode(`${userId}:${data.email || ""}`);
          while (referrals.some((item) => item.code === code)) {
            code = createReferralCode(`${userId}:${Date.now()}:${Math.random()}`);
          }
          owner = {
            id: `ref_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            type: "generated",
            createdAt: new Date().toISOString(),
            userId,
            code,
            email: String(data.email || "").slice(0, 160),
            name: String(data.name || "").slice(0, 120)
          };
          referrals.push(owner);
          writeReferrals(referrals);
        }
        const result = referralStatsForUser(userId, String(data.referredBy || "").slice(0, 80));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, ...result }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/referral") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = appendJsonRecord(referralsPath, {
          type: "captured",
          code: String(data.code || "").slice(0, 80),
          email: String(data.email || "").slice(0, 160),
          name: String(data.name || "").slice(0, 120),
          status: "captured",
          source: "ReplayEdge app"
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, saved }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/feedback") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = appendJsonRecord(feedbackPath, {
          email: String(data.email || "").slice(0, 160),
          page: String(data.page || "").slice(0, 80),
          rating: String(data.rating || "").slice(0, 24),
          message: String(data.message || "").slice(0, 3000),
          source: "ReplayEdge beta"
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, saved }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/analytics") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = appendJsonRecord(analyticsPath, {
          event: String(data.event || "unknown").slice(0, 80),
          page: String(data.page || "").slice(0, 80),
          plan: String(data.plan || "").slice(0, 40),
          mode: String(data.mode || "").slice(0, 60),
          details: data.details && typeof data.details === "object" ? data.details : {}
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, saved }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/attempts") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const result = saveAttemptRecord(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, ...result }));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/scenario-stats") {
    const scenarioId = parsedUrl.searchParams.get("scenarioId");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, ...communityStatsForScenario(scenarioId) }));
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/community-leaderboard") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, rows: leaderboardFromAttempts() }));
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/community-summary") {
    const attempts = readAttempts();
    const users = new Set(attempts.map((attempt) => attempt.userId || attempt.email || attempt.userName).filter(Boolean));
    const correct = attempts.filter((attempt) => attempt.correct).length;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      attempts: attempts.length,
      users: users.size,
      accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : null
    }));
    return;
  }


  if (parsedUrl.pathname === "/api/progress") {
    if (req.method === "GET") {
      const userId = parsedUrl.searchParams.get("userId");
      if (!progressUserIdOk(userId)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid userId" }));
        return;
      }
      const record = readProgressRecord(userId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, progress: record?.progress || null, updatedAt: record?.updatedAt || null }));
      return;
    }
    if (req.method === "POST") {
      readBody(req)
        .then((body) => {
          const payload = JSON.parse(body || "{}");
          if (!progressUserIdOk(payload.userId) || !payload.progress || typeof payload.progress !== "object") {
            throw new Error("Invalid progress payload");
          }
          const record = { userId: payload.userId, updatedAt: Date.now(), progress: payload.progress };
          writeProgressRecord(payload.userId, record);
          return record;
        })
        .then((record) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, updatedAt: record.updatedAt }));
        })
        .catch((error) => {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        });
      return;
    }
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/market/chart") {
    const symbol = (parsedUrl.searchParams.get("symbol") || "").trim();
    const range = parsedUrl.searchParams.get("range") || "1d";
    const interval = parsedUrl.searchParams.get("interval") || "5m";
    const okRanges = new Set(["1d", "5d", "1mo", "3mo", "6mo", "1y"]);
    const okIntervals = new Set(["1m", "2m", "5m", "15m", "30m", "60m", "1d"]);
    if (!marketSymbolOk(symbol) || !okRanges.has(range) || !okIntervals.has(interval)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Invalid symbol, range, or interval" }));
      return;
    }
    loadMarketChart(symbol, range, interval)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, ...data }));
      })
      .catch((error) => {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/api/market/news") {
    const symbol = (parsedUrl.searchParams.get("symbol") || "").trim().slice(0, 15);
    const query = (parsedUrl.searchParams.get("q") || "").trim().slice(0, 60);
    if (!marketSymbolOk(symbol) || (query && !/^[\w .,'^=&/-]+$/.test(query))) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Invalid query" }));
      return;
    }
    loadMarketNews(symbol, query)
      .then((news) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, news }));
      })
      .catch((error) => {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/chat") {
    readBody(req)
      .then((body) => handleAssistantChat(JSON.parse(body || "{}")))
      .then((message) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message }));
      })
      .catch((error) => {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/create-portal-session") {
    readBody(req)
      .then((body) => createPortalSession(JSON.parse(body || "{}")))
      .then((result) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ configured: true, ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/api/create-checkout-session") {
    readBody(req)
      .then((body) => createCheckoutSession(JSON.parse(body || "{}")))
      .then((result) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      })
      .catch((error) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ configured: true, ok: false, error: error.message }));
      });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/success.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderStripeReturnPage({
      eyebrow: "Checkout complete",
      title: "Access is being activated.",
      message: "Stripe is confirming your subscription. We will send you back to ReplayEdge in a moment.",
      action: "Continue to ReplayEdge",
      href: "/#profile",
      tone: "success"
    }));
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/cancel.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderStripeReturnPage({
      eyebrow: "No payment completed",
      title: "Checkout cancelled.",
      message: "No payment was completed. We will send you back to the plans page so you can keep reviewing your options.",
      action: "Back to plans",
      href: "/#plans",
      tone: "cancel"
    }));
    return;
  }

  const requested = decodeURIComponent(req.url.split("?")[0]);
  const publicName = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  const filePath = path.join(root, publicName);
  const isScenarioFile = publicName === "data/scenarios/index.json" ||
    /^data\/scenarios\/[a-z0-9-]+\.json$/i.test(publicName);

  if (!filePath.startsWith(root) || publicName.includes("..") || (!publicFiles.has(publicName) && !isScenarioFile)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "text/plain",
      "Cache-Control": "no-cache" // revalidate every load so UI updates ship instantly
    });
    res.end(data);
  });
});

const port = Number(process.env.PORT || 4173);
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`ReplayEdge is already running at http://localhost:${port}`);
    console.log("Open that link in Chrome. You do not need to start it twice.");
    process.exit(0);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`ReplayEdge running at http://localhost:${port}`);
});
