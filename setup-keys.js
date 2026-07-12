const fs = require("fs");
const path = require("path");
const readline = require("readline");

const envPath = path.join(__dirname, ".env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log("\nReplayEdge Key Setup");
  console.log("Paste each value when asked. Press Enter after each one.\n");

  const publicSiteUrl = await ask("PUBLIC_SITE_URL, use http://localhost:4173 for now: ");
  const supabaseUrl = await ask("SUPABASE_URL: ");
  const supabaseServiceRoleKey = await ask("SUPABASE_SERVICE_ROLE_KEY: ");
  const stripeSecretKey = await ask("STRIPE_SECRET_KEY: ");
  const stripeWebhookSecret = await ask("STRIPE_WEBHOOK_SECRET: ");
  const stripePricePlayer = await ask("STRIPE_PRICE_PLAYER: ");
  const stripePriceCoach = await ask("STRIPE_PRICE_COACH: ");
  const stripePriceElite = await ask("STRIPE_PRICE_ELITE: ");
  const stripePricePlayerAnnual = await ask("STRIPE_PRICE_PLAYER_ANNUAL: ");
  const stripePriceCoachAnnual = await ask("STRIPE_PRICE_COACH_ANNUAL: ");
  const stripePriceEliteAnnual = await ask("STRIPE_PRICE_ELITE_ANNUAL: ");

  const env = `PUBLIC_SITE_URL=${publicSiteUrl || "http://localhost:4173"}

SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceRoleKey}

STRIPE_SECRET_KEY=${stripeSecretKey}
STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}
STRIPE_PRICE_PLAYER=${stripePricePlayer}
STRIPE_PRICE_COACH=${stripePriceCoach}
STRIPE_PRICE_ELITE=${stripePriceElite}
STRIPE_PRICE_PLAYER_ANNUAL=${stripePricePlayerAnnual}
STRIPE_PRICE_COACH_ANNUAL=${stripePriceCoachAnnual}
STRIPE_PRICE_ELITE_ANNUAL=${stripePriceEliteAnnual}
`;

  fs.writeFileSync(envPath, env);
  rl.close();

  console.log("\nDone. Your .env file was created.");
  console.log("Now restart the ReplayEdge server.");
}

main().catch((error) => {
  rl.close();
  console.error(error.message);
  process.exit(1);
});
