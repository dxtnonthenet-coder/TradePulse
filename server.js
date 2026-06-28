const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataDir = path.join(root, "data");
const signupsPath = path.join(dataDir, "signups.json");
const signupsCsvPath = path.join(dataDir, "signups.csv");
const subscriptionsPath = path.join(dataDir, "subscriptions.json");
const referralsPath = path.join(dataDir, "referrals.json");
const feedbackPath = path.join(dataDir, "feedback.json");
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
  "privacy.html",
  "terms.html",
  "disclaimer.html",
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
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(signupsPath)) fs.writeFileSync(signupsPath, "[]");
  if (!fs.existsSync(subscriptionsPath)) fs.writeFileSync(subscriptionsPath, "[]");
  if (!fs.existsSync(referralsPath)) fs.writeFileSync(referralsPath, "[]");
  if (!fs.existsSync(feedbackPath)) fs.writeFileSync(feedbackPath, "[]");
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
    ["Coach", process.env.STRIPE_PRICE_COACH],
    ["Elite", process.env.STRIPE_PRICE_ELITE]
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
      system: "You are the TradePulse Assistant. TradePulse is a futures trading education replay game with Free, Player, Coach, and Elite plans; game modes include Replay Mode, Daily Challenge, Ranked Battle, Trade Mode, Spot the Setup, Candle Survival, No-Trade Challenge, Chart Detective, Build the Thesis, and Review Queue. Explain XP, streaks, leaderboards, bookmarks, plans, and training features clearly and concisely. Do not provide financial advice, trade alerts, broker execution guidance, or personalized investment recommendations. If asked unrelated questions, politely redirect to TradePulse or trading education practice.",
      messages: safeMessages.length ? safeMessages : [{ role: "user", content: "Hello" }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Anthropic request failed.");
  return data.content?.map((part) => part.text || "").join("").trim() || "I can help with TradePulse plans, games, XP, streaks, and training features.";
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
  params.set("allow_promotion_codes", "true");
  params.set("metadata[plan]", payload.plan);
  params.set("metadata[billingPeriod]", billingPeriod);
  params.set("metadata[email]", payload.email || "");
  params.set("metadata[name]", payload.name || "");
  params.set("metadata[source]", "tradepulse_prototype");
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
          source: "TradePulse profile",
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

  if (req.method === "POST" && parsedUrl.pathname === "/api/referral") {
    readBody(req)
      .then((body) => {
        const data = JSON.parse(body || "{}");
        const saved = appendJsonRecord(referralsPath, {
          code: String(data.code || "").slice(0, 80),
          email: String(data.email || "").slice(0, 160),
          name: String(data.name || "").slice(0, 120),
          status: "captured",
          source: "TradePulse app"
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
          source: "TradePulse beta"
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
    res.end(`<!doctype html><title>TradePulse Success</title><body style="background:#030608;color:#eef7f1;font-family:system-ui;padding:48px"><h1>Checkout complete.</h1><p>Stripe is confirming your access. Return to TradePulse and your subscription status will refresh automatically.</p><a style="color:#56d66d" href="/">Back to TradePulse</a></body>`);
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/cancel.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!doctype html><title>TradePulse Cancelled</title><body style="background:#030608;color:#eef7f1;font-family:system-ui;padding:48px"><h1>Checkout cancelled.</h1><p>No payment was completed.</p><a style="color:#56d66d" href="/">Back to TradePulse</a></body>`);
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

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain" });
    res.end(data);
  });
});

const port = Number(process.env.PORT || 4173);
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`TradePulse is already running at http://localhost:${port}`);
    console.log("Open that link in Chrome. You do not need to start it twice.");
    process.exit(0);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`TradePulse running at http://localhost:${port}`);
});
