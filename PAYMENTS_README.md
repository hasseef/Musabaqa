# Musabaqa — HyperPay Integration (Serverless)
This patch adds:
- `assets/js/config.payments.js` — client config (choose provider/routes)
- `netlify/functions/pay-hyperpay.js` — Netlify Function to create HyperPay checkouts (test)
- `workers/pay-hyperpay.js` — Cloudflare Worker alternative
- `assets/js/views/wallet.patch.js` — usage snippet to replace the pending buttons logic with provider-aware call

## Netlify (recommended quick start)
1) Deploy the site on Netlify.
2) In Netlify **Environment Variables**, add:
   - `HYPERPAY_ENTITY_ID` = `<your test entity id>`
   - `HYPERPAY_BEARER`    = `<your test bearer token>`
3) Ensure functions directory is detected: `netlify/functions/`
4) Update client config if needed: `assets/js/config.payments.js`
5) In Wallet view button handlers, call `startProviderPayment(invoiceId, method, amount, title)`.

## Cloudflare Workers
- Deploy `workers/pay-hyperpay.js` as a Worker and set `HYPERPAY_ENTITY_ID`, `HYPERPAY_BEARER` secrets.
- Update `PAYMENTS.endpoint.create` to your Worker route.

## Notes
- This uses HyperPay **test** endpoint `https://test.oppwa.com`. Replace with live once approved.
- For webhooks/status callbacks, create another function to verify payment result, and update invoices accordingly.
- Until webhooks are wired, use the Wallet UI to manually mark invoice as paid for testing.
