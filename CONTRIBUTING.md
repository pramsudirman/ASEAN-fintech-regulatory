# Contributing to RegCompass ASEAN

## Adding a new country

1. Create `trigger/country-configs/<country_code>.ts` — copy `singapore.ts` as template
2. Define a `CountryConfig` with regulator source URLs per product vertical
3. Add seed rows to `db/seed/initial_data.sql` — country row, regulator rows
4. Add to `ALL_COUNTRY_CONFIGS` in `trigger/country-configs/index.ts`
5. Add country card to `COUNTRIES` array in `components/CountryProductSelector/index.tsx`
6. Open PR — CI runs typecheck + lint + build automatically

## Adding a new product vertical

1. Add row to `product_verticals` in `db/seed/initial_data.sql`
2. Add source URL to relevant country configs in `trigger/country-configs/`
3. Add product card to `PRODUCTS` array in `components/CountryProductSelector/index.tsx`

## Data accuracy disputes

Open an issue with label `[data-dispute]`. Include:
- Country + product vertical
- Disputed requirement (title or ID)
- Correct source URL + citation

## Regulatory source changes

Open an issue with label `[source-update]`. Include:
- Country + regulator acronym
- Old URL + new URL

## Local dev

```bash
# Copy env template
cp .env.example .env.local
# Fill in your API keys

npm install
npm run dev
```

Free-tier API keys:
- **Supabase:** supabase.com (free tier)
- **NVIDIA NIM:** build.nvidia.com (free tier — 40 RPM on 8B, 5 RPM on 70B)
- **Firecrawl:** firecrawl.dev (free tier — 500 credits/month)
- **Trigger.dev:** trigger.dev (free OSS tier)

## Community governance

- Quarterly legal accuracy audit results published in repo wiki
- Data accuracy disclaimer on all outputs — RegCompass is a research tool, not legal advice
