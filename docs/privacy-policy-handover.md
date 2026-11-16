# Privacy policy — internal developer checklist

Updated 16 November 2026. Non-production branch and Vercel preview deployment authorised. Production publication remains pending Caroline and Joel’s approval. Do not merge into main or deploy to production without explicit approval.

## Current implementation

- All 14 sections, legal-basis table and existing modal behaviour retained.
- Visitor-facing draft banner, information box and legal placeholders removed.
- Proposed privacy contact: enquiries@curabelcomplexcare.co.uk; telephone 0333 880 5696. Both are clickable. Client approval of their designated privacy role remains pending.
- Proposed retention remains 12 months, described as planned rather than implemented.
- Vercel Web Analytics is planned, not installed or active. No analytics integration was added.
- Resend server integration is implemented locally and disabled unless ENQUIRIES_ENABLED=true with valid server credentials and a verified sender. Live delivery is not tested; see ENQUIRY-EMAIL-SETUP.md. Policy describes enabled submissions conditionally.
- Client supplied ICO registration number C2052625 on 16 November 2026; included in Section 1. International safeguard claims remain omitted.
- The original client text remains archived in privacy-policy-client-draft.md for provenance; it is not the current rendered policy.
- Form fields, London footer address and unrelated website sections are unchanged.

## Publication gates

- [ ] Caroline and Joel approve the revised policy and the proposed privacy email and telephone.
- [x] Record client-supplied ICO registration number C2052625 in Section 1. This records receipt from the client, not independent register verification; no other pending confirmations are approved.
- [ ] Verify company number 17500743 and the supplied Birmingham registered office against official records.
- [ ] Approve and implement the proposed 12-month retention schedule, including email enquiries; confirm current mailbox retention and processor log retention. Do not present the proposed period as operational until confirmed.
- [ ] Confirm hosting processing locations, account-specific terms and applicable international transfer safeguards. No claim that a particular safeguard is in force appears in the current copy.
- [ ] Recheck cookie and tracking behaviour before publication. Previous source and browser checks found no analytics integration, cookies or browser storage during the tested visit; provider-side logging was not independently verified.
- [ ] Before enabling Vercel Web Analytics, review its actual configuration, data collection, retention and disclosure requirements, update the policy, obtain approval and test the deployed behaviour.
- [ ] Before enabling form delivery, separately authorise and implement the backend, verify delivery, update provider and processing disclosures, and test retention/error handling. Resend integration exists locally but credentials, verified sender and real delivery testing remain outstanding. The form has no Organisation field.
- [ ] Obtain final client or qualified data protection review, then explicit deployment approval.

## Git and deployment

Branch main; remote https://github.com/outliersynapse/Curabel.git. Existing production site https://curabel-website.vercel.app/ remains unchanged. Policy/modal work is intended for the codex/privacy-policy-preview branch and the existing Vercel project’s preview environment. No production, DNS or Vercel project configuration changes are authorised.
