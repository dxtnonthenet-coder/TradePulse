# TradePulse Beginner Setup

This folder contains the whole starter app.

You only need this folder:

```text
TradePulse
```

Inside it are:

```text
index.html   the website layout
styles.css   the design/style
app.js       the game logic
server.js    the local preview server
package.json app command file
README.md    these instructions
data/        saved signups will appear here after people submit forms
```

## Baby Step 1: Open Terminal

Open the Terminal app on your Mac.

## Baby Step 2: Go To The App Folder

Copy and paste this:

```bash
cd /Users/dxtnonthenet/Documents/TA/TradePulse
```

Press Enter.

## Baby Step 3: Start The App

Copy and paste this:

```bash
/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js
```

Press Enter.

You should see something like:

```text
TradePulse running at http://localhost:4173
```

## Baby Step 4: Open The Website

Open Chrome.

Copy and paste this into the address bar:

```text
http://localhost:4173
```

Press Enter.

Now your app is running.

## Baby Step 5: Test The Game

Do this:

1. Scroll to Replay Mode.
2. Click the timeframe buttons: `1m`, `5m`, `15m`, `1h`, `4h`.
3. Pick an answer.
4. Watch the future candles reveal.
5. Look at your XP and streak.
6. Click Next.

## Baby Step 6: Add A Scenario Without Editing Code

Copy and paste this:

```bash
/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tradepulse.js add
```

Press Enter.

The terminal will ask you questions.

Answer them one by one.

When it says done, refresh Chrome.

## Baby Step 7: See Your Scenario List

Copy and paste this:

```bash
/Users/dxtnonthenet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tradepulse.js list
```

Press Enter.

## Baby Step 8: Legal-Safe Positioning

Use this wording:

```text
Educational market replay simulator.
Pattern recognition practice.
Historical training scenarios.
Not financial advice.
No trade alerts.
No personalized recommendations.
```

Avoid this wording:

```text
Buy here.
Sell here.
Take this trade.
Guaranteed setup.
Trading signals.
```

## Baby Step 9: Your Next Real Milestone

Create your first 100 real scenarios.

Each scenario needs:

```text
Market
Date
Time
Context
1m chart
5m chart
15m chart
1h chart
Question
4 answers
Correct answer
Explanation
Tags
Difficulty
```

Start with screenshots first.

Do not worry about live market data yet.

## Baby Step 10: When You Are Ready For The Real App

After this prototype feels right, the real app should become:

```text
Next.js website
Supabase database
Supabase login
Real scenario database
Stripe payments
Vercel hosting
```

But do not start there yet.

First, make this version feel fun.

## See Saved Signups

After someone submits a signup, trial form, or plan button, the app saves it here:

```text
/Users/dxtnonthenet/Documents/TA/TradePulse/data/signups.csv
```

And also here:

```text
/Users/dxtnonthenet/Documents/TA/TradePulse/data/signups.json
```

Important: this file storage works when you open the app from:

```text
http://localhost:4173
```

If you open the app as a plain file, the signup is only saved in that browser.

## Supabase Setup

1. Go to Supabase.
2. Create a new project.
3. Open the SQL editor.
4. Copy everything from:

```text
/Users/dxtnonthenet/Documents/TA/TradePulse/supabase-schema.sql
```

5. Paste it into Supabase SQL editor.
6. Click Run.
7. Go to Project Settings.
8. Copy:

```text
Project URL
Service role key
```

9. Copy this file:

```text
.env.example
```

10. Rename the copy to:

```text
.env
```

11. Paste your Supabase values into `.env`.

## Stripe Setup

1. Go to Stripe.
2. Create 3 subscription products:

```text
Player - $19.99/month
Coach - $50/month
Elite - $100/month
```

3. Copy each recurring price ID.

They look like:

```text
price_123...
```

4. Paste those price IDs into `.env`.

5. Copy your Stripe secret key.

It looks like:

```text
sk_test_...
```

6. Paste it into `.env`.

7. Restart the server.

Now plan buttons will open Stripe Checkout.
