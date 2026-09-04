# AMECA / Partner Handoff

The consumer-facing site remains **Japan Health**.

Qualified leads are forwarded server-to-server from `/api/lead.js`.

## Environment variables

```text
AMECA_LEAD_WEBHOOK_URL=
GENERAL_PARTNER_WEBHOOK_URL=
```

If `AMECA_LEAD_WEBHOOK_URL` is configured, leads route there first. If not, the generic partner webhook is used.

## Commercial boundary
Japan Health owns acquisition, SEO/social traffic, discovery, comparison, qualification, and the first-party lead.

AMECA owns case intake after handoff, hospital communication, quote/booking coordination, medical-travel operations, and interpretation coordination when needed.

This keeps the platform partner-neutral while allowing AMECA to be the first downstream fulfillment partner.
