# AMECA / Partner Handoff

The consumer-facing site remains **Japan Health**. AMECA stays a downstream coordination partner rather than the public brand.

Qualified leads are forwarded server-to-server from `/api/lead.js`.

## Environment variables

```text
AMECA_LEAD_WEBHOOK_URL=
GENERAL_PARTNER_WEBHOOK_URL=
ALLOW_DEMO_LEADS=false
```

Routing order:
1. `AMECA_LEAD_WEBHOOK_URL`
2. `GENERAL_PARTNER_WEBHOOK_URL`
3. No configured webhook: fail closed with `503` so a production inquiry is never falsely reported as captured.

Set `ALLOW_DEMO_LEADS=true` only for explicit non-production testing. In that mode, the endpoint logs the demo payload and returns `demo: true`.

## Handoff contract

Every accepted lead receives a server-generated `requestId` and includes:
- name + normalized email
- Resident vs Visitor
- city and care need
- selected demo/provider context when present
- the active access constraints (language pathway, referral, coordinator, city, audience)
- `consentScope: coordination-inquiry`
- creation timestamp

The partner call has an 8-second timeout. A partner failure returns a retryable user-facing error instead of silently dropping the inquiry. Internal webhook errors are logged with the `requestId` without exposing partner configuration to the browser.

## Commercial boundary

Japan Health owns acquisition, SEO/social traffic, discovery, comparison, qualification, and the first-party lead.

AMECA owns case intake after handoff, hospital communication, quote/booking coordination, medical-travel operations, and interpretation coordination when needed.

This keeps the platform partner-neutral while allowing AMECA to be the first downstream fulfillment partner.
