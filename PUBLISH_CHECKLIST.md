# ReplayEdge Publish Checklist

## Before Publishing

- Confirm `.env` is not uploaded publicly.
- Confirm `data/signups.csv` and `data/signups.json` are not uploaded publicly.
- Use Supabase for signup storage in production.
- Use Stripe test mode until the full customer path is verified.
- Replace test Stripe keys with live keys only when ready to charge real money.
- Update `PUBLIC_SITE_URL` to your real domain before live launch.
- Review Privacy Policy, Terms, and Education Disclaimer with an attorney.

## Required Environment Variables

```text
PUBLIC_SITE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PLAYER
STRIPE_PRICE_COACH
STRIPE_PRICE_ELITE
```

## Test Before Public Beta

- Trial form saves to Supabase.
- Free signup saves to Supabase.
- Player checkout opens.
- Coach checkout opens.
- Elite checkout opens.
- Stripe test subscription appears.
- Success page works.
- Cancel page works.
- Paywall appears after free plays.
- Legal links open.

## Safer Beta Launch

Launch with Stripe test mode or a waitlist first. Switch to live payments only after multiple full test checkouts work.
