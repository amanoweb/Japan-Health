# Research ingestion prototype (not a publisher)

The lightweight research script gathers permitted source metadata and short publicly accessible text excerpts for **editor review**. It does not automatically draft, certify or publish medical claims.

\`\`\`sh
python3 research/ingest.py --source jnto --out research/outputs/jnto.json
python3 research/ingest.py --pubmed "medical tourism Japan" --out research/outputs/pubmed.json
\`\`\`

The source registry is \`research/sources.json\`. Prefer official APIs and original publishers; respect permitted use, terms, rate limits and copyright. For laws, integrate the official e-Gov API with a separate version/effective-date check rather than assuming today's HTML reflects every historical state.

Next steps: PostgreSQL/pgvector source versions; BGE-M3 English–Japanese candidate retrieval; claim-context tuples and human verified evidence status; downstream update queue. Those are **not** implemented yet.
