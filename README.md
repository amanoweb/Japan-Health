# Japan Health — English-first medical information publication

This repository was rebuilt on 15 October 2026 from the prior Tokyo clinic-navigation prototype. It is a **new, static, crawlable publication** focused on explaining healthcare access in Japan. The previous lead-forwarding API and symptom-based matching interface are intentionally removed.

## Product
- Source-attributed English articles about visiting a clinic, resident insurance, medical-stay visas, specialist appointments, and treatment navigation.
- Agency directory seeded from the Japanese Ministry of Foreign Affairs' named medical-stay guarantor lists; languages reflect the government listings, **not verified service acceptance**.
- Clinic directory designed to remain empty until verified clinic information exists. No fabricated clinics or sponsors.
- Clean, responsive pages with Article structured data, robots rules, social metadata, conditional canonical URLs and a multilingual-ready /en/ route hierarchy.
- Sponsor-first ordering supported in the data model; sponsored placement is **not activated** until a real paid arrangement is approved and disclosed.
- Zero patient intake, no stored health records, no automatic referral transfers.

## Run locally
Node 20+ required. No npm dependencies.

\`\`\`sh
npm run build
npm test
\`\`\`

Open \`dist/en/index.html\` via a static HTTP server (for example \`python3 -m http.server 8080 -d dist\`).

## Deployment
Vercel configuration builds with \`npm run build\` and publishes \`dist/\`.
Set \`SITE_URL=https://your-verified-domain.example\` to generate an absolute canonical URL and sitemap locally. Vercel's \`VERCEL_PROJECT_PRODUCTION_URL\` is used automatically when available. **Do not set a guessed domain.**

There is no backend, database requirement or paid AI API for the launch site. The research MVP in \`research/\` is deliberately separate from publication.

## Editing content
- \`src/content.mjs\`: article copy, claim scope, references and source-check date.
- \`src/agencies.mjs\`: agency listing information and sponsored flag.
- \`public/styles.css\`: appearance.
- \`scripts/build.mjs\`: static routes and SEO markup.

New languages should use distinct URLs (for example \`/zh-cn/\`) and only be added to \`hreflang\` when **real translated, reviewed pages** exist. Keep /en/ URLs permanent.

## Editorial safeguards
See \`docs/EDITORIAL.md\`. Source-check dates must reflect a real check. The public pages are educational and may not replace medical, legal or insurance advice. Institution-specific information must be directly attributed.

## Analytics and commercialization
Outbound partner links are wired to a \`gtag\` event if GA4 is later configured, but **analytics is not active today**. Do not claim bookings from clicks. Paid placement, billing, lead-sharing, email collection, and automated medical content publishing require separate review and implementation.
