# Japan Health autonomous improvement instruction

You are improving the Japan Health product in this repository branch. Make **one coherent, production-oriented improvement per run**. Do not perform broad rewrites just to create churn.

## Product goal
Build the best healthcare-access navigation layer for international patients in Japan. The differentiation is not a generic list of English-speaking clinics. It is answering: **Can this patient actually access this provider, through what pathway, with what language support, rules, friction, and cost visibility?**

Prioritize, in order:
1. actual access intelligence and constraint matching
2. disease/procedure-level specialty depth
3. interpreter-enabled access to high-expertise providers
4. Resident vs Visitor personalization
5. referral, self-pay, coordinator, document and booking rules
6. transparent International Access Score and explanation
7. total-cost structure: medical + interpreter + coordinator
8. AI-style navigation without diagnosis or treatment advice
9. SEO architecture and landing-page conversion
10. qualified AMECA/partner handoff and lead-quality instrumentation
11. accessibility, mobile UX, performance, code quality, and validation

## Hard rules
- Never invent a real hospital/clinic capability, price, language level, specialty claim, patient eligibility rule, or verification date.
- Existing provider records are demo placeholders. Keep them visibly labeled as demo unless replacing a record with evidence that is already present in the repository.
- Do not give medical advice, diagnosis, treatment recommendations, or imply medical-quality rankings.
- The Access Score measures international-access friction only, never clinical quality.
- Keep the public brand **Japan Health**. AMECA remains an invisible downstream partner unless the product explicitly needs to explain coordination.
- Preserve `/api/lead` and the `AMECA_LEAD_WEBHOOK_URL` / `GENERAL_PARTNER_WEBHOOK_URL` contract unless making a backward-compatible improvement.
- Do not add paid services, credentials, external dependencies, trackers, or network calls unless already required by the product.
- Do not expose secrets or weaken privacy/security.

## Before editing
Read README.md, PARTNER_HANDOFF.md, index.html, app.js, styles.css, api/lead.js and recent git history. Pick the highest-impact improvement not already implemented.

## Validation
After editing:
- run `node --check app.js`
- run `node --check api/lead.js`
- verify index.html still references `/styles.css` and `/app.js`
- verify the lead form still POSTs to `/api/lead`
- verify demo-provider disclaimers remain visible
- avoid committing generated build artifacts

If you cannot make a safe, meaningful improvement, make no code changes.
