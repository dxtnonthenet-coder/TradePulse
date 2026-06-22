const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

function parseEnv() {
  if (!fs.existsSync(envPath)) return {};
  return fs.readFileSync(envPath, "utf8").split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return env;
    const index = trimmed.indexOf("=");
    env[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
    return env;
  }, {});
}

function masked(value) {
  if (!value) return "MISSING";
  if (value.includes("your_") || value.includes("here")) return "PLACEHOLDER";
  if (value.length <= 12) return "SET";
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

const env = parseEnv();
const checks = [
  ["PUBLIC_SITE_URL", (v) => v && v.startsWith("http")],
  ["SUPABASE_URL", (v) => v && v.startsWith("https://") && v.includes("supabase")],
  ["SUPABASE_SERVICE_ROLE_KEY", (v) => v && v.length > 30 && !v.includes("anon")],
  ["STRIPE_SECRET_KEY", (v) => v && v.startsWith("sk_test_")],
  ["STRIPE_WEBHOOK_SECRET", (v) => v && v.startsWith("whsec_")],
  ["STRIPE_PRICE_PLAYER", (v) => v && v.startsWith("price_")],
  ["STRIPE_PRICE_COACH", (v) => v && v.startsWith("price_")],
  ["STRIPE_PRICE_ELITE", (v) => v && v.startsWith("price_")]
];

console.log("\nTradePulse setup check\n");

if (!fs.existsSync(envPath)) {
  console.log("Missing .env file.");
  console.log("Run this next:");
  console.log("/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node setup-keys.js\n");
  process.exit(1);
}

let ok = true;
checks.forEach(([key, isValid]) => {
  const value = env[key];
  const valid = Boolean(isValid(value));
  if (!valid) ok = false;
  console.log(`${valid ? "OK     " : "FIX ME "} ${key}: ${masked(value)}`);
});

if (ok) {
  console.log("\nAll keys look formatted correctly.");
  console.log("Now restart the server with:");
  console.log("cd /Users/dxtnonthenet/Documents/TA/TradePulse");
  console.log("/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js\n");
} else {
  console.log("\nSome values are missing or wrong.");
  console.log("Run setup again and paste the correct values:");
  console.log("/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node setup-keys.js\n");
}
