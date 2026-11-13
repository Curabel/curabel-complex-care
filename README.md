# Curabel — homepage design preview

A new Next.js App Router project, built with TypeScript, Tailwind CSS 4 and Lucide icons. Homepage only, held for design review before developing the remaining pages. No deployment has been performed.

## Local preview

Requires Node.js 20.9+ (Node.js 24 LTS recommended) and npm.

```powershell
cd D:\CURABEL
npm install
npm run dev
```

Open **http://127.0.0.1:3000** in your browser. The server binds to the local machine. Stop it with Ctrl+C. If port 3000 is occupied, use the alternate URL printed by Next.js.

For a production preview, stop the development server first:

```powershell
npm run build
npm start
```

## Structure

- `src/app/page.tsx`: homepage sections and composition.
- `src/app/globals.css`: Tailwind entry, design tokens, component styling, responsive layouts and reduced-motion rules.
- `src/app/layout.tsx`: page metadata, language, locally served fonts and enquiry context.
- `src/components/`: shared header, text wordmark, footer and accessible enquiry/policy dialogs.
- `src/lib/content.ts`: navigation, eight service descriptions and care journey copy.
- `public/images/`: optimised local photographs. Licensing and source records: `docs/PHOTOGRAPHY.md`.
- `tests/`: browser interaction, responsiveness and accessibility checks.
- `docs/`: design research, review screenshots and launch requirements.

## Design

Official Curabel deep blue, sky blue and white; locally hosted Manrope throughout. Fonts are bundled locally through Fontsource; no Google Fonts request is made at runtime. Colour tokens are in `globals.css` (`:root` and `@theme`) for adapting to the official logo.

The shared `Wordmark` component renders the supplied original JPG through Next.js Image in the navbar, mobile menu and footer. The complete artwork is preserved without cropping, filters or recolouring. The dark blue footer places it on a white surface. Caroline McKnight’s portrait is intentionally a labelled neutral placeholder. The two stock photographs are illustrative, with no implication that the subjects are Curabel patients or staff.

Navigation links to the relevant homepage sections while the full pages await approval. Careers opens a careers enquiry preview; no vacancies or benefits are claimed. Privacy and accessibility buttons open clearly marked drafts.

## Enquiry form integration

**The enquiry form does not send, persist or log any input.** It performs native browser validation and confirms only that the details have been checked. It is deliberately labelled as a preview and does not show a submission-success message. No backend, email address or recipient has been invented.

Before enabling live submission, replace the local `onSubmit` handler in `src/components/enquiry-provider.tsx` with a POST to a secure server-side endpoint (for example `src/app/api/enquiries/route.ts`). Configure verified recipients and email/CRM credentials in server-only environment variables. Validate all fields on the server, rate-limit requests, add abuse controls, apply the approved privacy/retention policy and return explicit errors. Display success only after the backend confirms acceptance. Do not use `NEXT_PUBLIC_` for secrets. Keep general enquiries free of patient health data and provide a separately approved secure route for clinical referrals.

## Verification

```powershell
npm run typecheck
npm run lint
npm run build
```

With `npm run dev` running in a second terminal, and Google Chrome installed:

```powershell
npm run test:e2e
```

Playwright uses installed Google Chrome (`channel: "chrome"`), without downloading a browser. Checks cover images, all eight service disclosures, validated preview enquiries, referral selection, legal drafts, navigation and overflow at 320, 390, 768 and 1024 pixels, reduced motion, skip navigation and automated accessibility scans. Desktop screenshots are captured at 1440px.

Search engine indexing is intentionally disabled for this design preview. Confirm the production domain, metadata, approved legal copy and operational status before changing that setting and launching. See `docs/REVIEW.md`.
