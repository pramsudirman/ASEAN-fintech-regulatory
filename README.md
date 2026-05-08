# Regulatory Compass ASEAN

> *A regulatory intelligence dossier tool for fintech PMs — because asking legal should not take three weeks and cost the same as a business-class ticket to Singapore.*

---

## Why This Exists

I'll be honest with you, which is more than most GitHub READMEs offer.

I built this because NVIDIA released a suite of AI models — proper, capable ones — and made them free to use. Free. I am, as a matter of personal identity, deeply responsive to the word "free." I once sat through a forty-minute timeshare presentation in Phuket because the brochure said "complimentary breakfast." So when NVIDIA offered free access to embedding models, inference APIs, and a retrieval stack, I responded the way I respond to most things that don't cost money: immediately and without sufficient planning.

The actual problem, though, is real. If you're a Product Manager at a fintech company and you want to expand into two or three ASEAN markets, your Tuesday morning looks like this: you open a browser, search "Vietnam P2P lending regulation," get a PDF from 2019, realize it's been superseded, find the new one, discover it's in Vietnamese, locate an English summary from a law firm that helpfully notes the document "should not be relied upon as legal advice," and then sit quietly at your desk wondering if you've already made a career-limiting move by putting "Indonesia digital banking expansion" on the Q3 roadmap.

This takes, on average, two to four weeks. Per market. With legal involved.

Regulatory Compass ASEAN makes that thirty minutes. You pick your countries, pick your product types, and the tool generates a structured dossier — every requirement, tagged by risk level, sourced, cited, and honest about when it was last verified. You get a PDF. You bring it to the board meeting. You look competent. I ask for nothing in return except that you read the disclaimer.

---

## What It Does

Select up to **6 ASEAN countries** and **10 fintech product verticals**. Get a regulatory dossier in under 30 seconds.

Each requirement is tagged:

- 🔴 **High Risk** — Operational blocker. You cannot legally operate without satisfying this. Vietnam requiring 100% local ownership for P2P lending is High Risk. The kind of thing you want to know *before* the roadmap goes to the CEO.
- 🟡 **Moderate Risk** — Material compliance burden. Expensive, slow, annoying, but survivable.
- 🟢 **Low / Informational** — Disclosure requirements and best practices. The regulatory equivalent of "please recycle."

**Countries covered (v1):** Singapore · Malaysia · Indonesia · Thailand · Philippines · Vietnam

**Product verticals:** Digital Payments · BNPL · Digital Lending · Digital Banking · Remittance · Wealth Management · Crypto / Digital Assets · Insurtech · Open Banking · RegTech

---

## The Stack (or: What Free Looks Like in Production)

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js 15 + Tailwind | Fast to build, fast to ship |
| Database | Supabase (Postgres) | Realtime, free tier, good DX |
| Background jobs | Trigger.dev v4 | Scheduled scans without managing infrastructure |
| Web scraping | Firecrawl | Turns regulator websites into readable text |
| AI extraction | NVIDIA NIM — `meta/llama-3.1-70b-instruct` | Pulls structured requirements from raw text |
| AI embeddings | NVIDIA NIM — `nv-embedqa-e5-v5` | Semantic search across requirements |
| PDF export | `@react-pdf/renderer` | Dossiers you can actually send to a CPO |
| Deploy | Vercel | Because I'm not managing servers |

The NVIDIA models are the centerpiece. `llama-3.1-70b-instruct` reads raw regulatory text and extracts structured requirements — title, summary, risk level, citation, compliance deadline. `nv-embedqa-e5-v5` is an asymmetric embedding model, which means it needs `input_type: 'passage'` when storing documents and `input_type: 'query'` when searching. I learned this the hard way, at runtime, in production. I've since moved on.

A daily scan runs via Trigger.dev: it hits official regulator websites (MAS, OJK, BNM, BOT, BSP, SBV), scrapes new content, extracts requirements, embeds them, and flags changes. The frontend subscribes via Supabase Realtime and shows a banner when new updates arrive.

---

## Running Locally

**Prerequisites:** Node.js 18+, a Supabase project, a Trigger.dev account, NVIDIA API key (free at [build.nvidia.com](https://build.nvidia.com)), Firecrawl API key.

```bash
git clone https://github.com/pramsudirman/ASEAN-fintech-regulatory.git
cd ASEAN-fintech-regulatory
npm install
cp .env.example .env.local
# fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Required environment variables** (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
NVIDIA_API_KEY
FIRECRAWL_API_KEY
TRIGGER_SECRET_KEY
```

**Database setup:** Run the migration files in `db/migrations/` in order, then seed with `db/seed/` via the Supabase SQL Editor.

---

## Seeding the Database

The daily Trigger.dev scan populates requirements automatically, but for local development (or if you don't want to wait for the scan), run the seed files directly in Supabase SQL Editor:

1. `db/seed/initial_requirements.sql` — core requirements
2. `db/seed/additional_requirements.sql` — full 6-country × 10-product coverage

55 requirements covering every country-product combination in v1.

---

## What This Is Not

A legal opinion. A compliance guarantee. A substitute for actual lawyers, who went to school for this and deserve to be paid. Every dossier output includes a disclaimer. Every page of the exported PDF includes a disclaimer. I have put a disclaimer in the footer of the disclaimer. If you use this tool to make a final go/no-go call without speaking to qualified legal counsel, that is a choice you've made as an adult, and I wish you well.

The data is sourced from official regulator websites and updated daily. It is last-verified-at dated at the requirement level. Requirements not updated in 90+ days display a staleness warning because integrity is more important than looking confident.

---

## Roadmap

**v2 (when NVIDIA releases something else for free):**
- APAC expansion: Australia, Hong Kong, Japan, South Korea, Taiwan, India
- Remaining ASEAN: Myanmar, Cambodia, Laos, Brunei (limited frameworks — best-effort data)
- Real-time regulatory change alerts
- Saved dossiers with change tracking
- Shareable read-only dossier links

---

## License

MIT. Use it, fork it, deploy it. If you build something useful on top of it, I would genuinely like to hear about it.

---

*Regulatory Compass ASEAN — Not Legal Advice. Built out of curiosity, NVIDIA's generosity, and a suspicion that there had to be a better way than reading 2019 PDFs at 11pm.*
