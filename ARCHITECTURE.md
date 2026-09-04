# Product Architecture

## 1. Frontend
Vanilla HTML/CSS/JS
- Product profile
- Readiness score
- FDA classification hits
- 510(k) candidates
- PMA signals
- Evidence gap
- Export / expert review CTA

## 2. Serverless FDA layer
`api/fda-search.js`
- Searches openFDA Classification
- Infers Product Code
- Pulls 510(k) records
- Pulls PMA records
- Normalizes results

## 3. Analysis layer
`api/analyze.js`
- Deterministic fallback score engine
- Optional OpenAI analysis if `OPENAI_API_KEY` exists
- AI is intentionally not the source of truth; FDA records are.

## 4. Moat path
The UI is not the moat.
Potential moat:
- Normalized Japanese-company → FDA product mapping
- Curated predicate relevance scoring
- Parsed 510(k) summaries
- Evidence requirement benchmarks by product code
- Historical Q-Sub / expert annotations
- Cost / timeline outcomes
- Human regulatory-review network

## 5. Monetization
Free: Readiness snapshot
Paid 1: Predicate Deep Dive
Paid 2: US Entry Dossier
Paid 3: Expert regulatory review
Paid 4: Ongoing portfolio monitoring
