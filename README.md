# Japan Health Access Platform MVP

This branch contains the consumer-facing **Japan Health** MVP for international patients in Japan. AMECA is a downstream fulfillment/coordination partner, not the public brand.

## Differentiation
- actual access intelligence, not only "English available"
- doctor vs reception English
- interpreter-enabled specialist access
- resident vs visitor pathways
- referral / self-pay / coordinator rules
- transparent International Access Score
- cost visibility: medical / interpreter / coordinator
- source + last-verified fields
- qualified lead handoff to AMECA or another partner

## Partner handoff
`POST /api/lead` forwards qualified leads to `AMECA_LEAD_WEBHOOK_URL`, falling back to `GENERAL_PARTNER_WEBHOOK_URL`.

## Important
All current provider records are illustrative UX examples. Do not publish them as factual provider claims. Real records must be grounded in official sources and include a verification date.

## Autonomous branch
This is the `japan-health` branch. The default `main` branch remains the separate FDA Readiness AI project. Do not merge the two products accidentally.
