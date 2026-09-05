# Japan Health Access Platform MVP

This repository is the canonical source for the consumer-facing **Japan Health** MVP for international patients in Japan. AMECA is a downstream fulfillment/coordination partner, not the public brand.

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

## Data policy
Provider records may include demo, government-directory, and provider-level verified entries. Demo records must remain visibly labeled. Government-directory listings must not be treated as proof of physician English, reception English, insurance eligibility, visitor eligibility, interpreter support, prices, or current acceptance. Provider-level claims must be grounded in official sources and include verification metadata. Unknown fields stay unknown.

## Canonical branch
`main` is the production/source-of-truth branch for Japan Health. The former FDA Readiness AI main branch was removed from production and preserved only in the temporary safety branch `archive/fda-old-main` during repository cleanup. `backup/japan-health-pre-cleanup` preserves the Japan Health state immediately before the cleanup.
