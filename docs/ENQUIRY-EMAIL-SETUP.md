# Enquiry email setup

The server route `/api/enquiry` sends to the fixed recipient enquiries@curabelcomplexcare.co.uk using the Resend HTTPS API. It includes an HTML table, plain text, a subject with enquiry type/name, and the visitor's address as Reply-To. User values are escaped in HTML. Server validation, request size limits, same-origin checks, a honeypot, provider timeout and idempotency keys are included. No enquiry data or secrets are logged by the route; no separate database is used. Provider acceptance is not proof of inbox delivery.

## Credentials

Revoke the API key shared in chat and create a replacement sending key in Resend. Do not paste it into chat or commit it. Verify a sender domain in Resend and apply the DNS records Resend supplies. The sender must use that verified domain; the visitor's address is only Reply-To.

## Local setup

Copy `.env.example` to `.env.local` in D:\CURABEL. Fill these server-only values:

- `RESEND_API_KEY`: replacement key.
- `RESEND_FROM_EMAIL`: verified sender, e.g. `Curabel Website <website@curabelcomplexcare.co.uk>` only once that domain is verified.
- `ENQUIRIES_ENABLED`: `true` to allow sends; `false` to disable immediately on the next deployment/restart.

Restart `npm run dev` after changing environment variables. `.env.local` is ignored by Git. Commit only `.env.example` with blank credentials. Never use a NEXT_PUBLIC_ prefix for these variables.

## Vercel

In the EXISTING curabel-website project, open Settings → Environment Variables. Add the same three variables to Production, and separately to Preview only if you want previews to send real enquiries. Keep Preview disabled otherwise. Do not put secrets in GitHub files, vercel.json, browser code or deployment logs. Redeploy the appropriate environment after setting variables; they do not change existing deployments.

Before production enablement, test with a synthetic enquiry containing no patient information. Confirm Resend shows delivery, confirm receipt in the enquiries inbox and test Reply-To, invalid fields, errors and retries. Check spam folders. Configure Vercel Firewall rate limiting for POST /api/enquiry before public launch; the honeypot and origin checks alone do not prevent automated abuse. No persistent rate-limit service is introduced here.

The code is prepared locally; no live delivery, DNS changes, credential storage, Git push or deployment has been performed. The supplied key is not used. Verified sender and replacement credentials remain required. International transfer/retention confirmations in the privacy handover still require client review. The policy now describes Resend conditionally when sending is enabled; review before publication.

Resend API reference: https://resend.com/docs/api-reference/emails/send-email
