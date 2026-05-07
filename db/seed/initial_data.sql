-- RegCompass ASEAN — Seed Data
-- Countries, Regulators, Product Verticals

-- ── Countries (ASEAN-6) ────────────────────────────────────────────────────

INSERT INTO countries (id, code, name, flag_emoji) VALUES
  (1, 'SG', 'Singapore',   '🇸🇬'),
  (2, 'MY', 'Malaysia',    '🇲🇾'),
  (3, 'ID', 'Indonesia',   '🇮🇩'),
  (4, 'TH', 'Thailand',    '🇹🇭'),
  (5, 'PH', 'Philippines', '🇵🇭'),
  (6, 'VN', 'Vietnam',     '🇻🇳')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence after explicit IDs
SELECT setval('countries_id_seq', 6);

-- ── Regulators ─────────────────────────────────────────────────────────────

INSERT INTO regulators (id, country_id, name, acronym, website_url) VALUES
  -- Singapore
  (1,  1, 'Monetary Authority of Singapore',          'MAS',  'https://www.mas.gov.sg'),
  -- Malaysia
  (2,  2, 'Bank Negara Malaysia',                     'BNM',  'https://www.bnm.gov.my'),
  (3,  2, 'Securities Commission Malaysia',           'SC',   'https://www.sc.com.my'),
  -- Indonesia
  (4,  3, 'Otoritas Jasa Keuangan',                   'OJK',  'https://www.ojk.go.id'),
  (5,  3, 'Bank Indonesia',                           'BI',   'https://www.bi.go.id'),
  -- Thailand
  (6,  4, 'Bank of Thailand',                         'BOT',  'https://www.bot.or.th'),
  (7,  4, 'Securities and Exchange Commission Thailand', 'SEC', 'https://www.sec.or.th'),
  -- Philippines
  (8,  5, 'Bangko Sentral ng Pilipinas',              'BSP',  'https://www.bsp.gov.ph'),
  (9,  5, 'Securities and Exchange Commission Philippines', 'SEC-PH', 'https://www.sec.gov.ph'),
  -- Vietnam
  (10, 6, 'State Bank of Vietnam',                   'SBV',  'https://www.sbv.gov.vn')
ON CONFLICT (id) DO NOTHING;

SELECT setval('regulators_id_seq', 10);

-- ── Product Verticals (10) ─────────────────────────────────────────────────

INSERT INTO product_verticals (id, slug, name, description, icon) VALUES
  (1,  'digital-payments',    'Digital Payments',          'E-wallets, QR payments, account-to-account',         '💳'),
  (2,  'bnpl',                'BNPL',                      'Buy Now Pay Later / deferred payment credit',         '🛒'),
  (3,  'digital-lending',     'Digital Lending',           'Consumer & SME credit, P2P lending',                 '🏦'),
  (4,  'digital-banking',     'Digital Banking',           'Licensed deposit-taking, neobanks',                  '🏛️'),
  (5,  'remittance',          'Remittance',                'Cross-border transfers, FX, MSB requirements',        '💸'),
  (6,  'wealth-management',   'Wealth Management',         'Robo-advisory, CIS, discretionary & advisory',       '📈'),
  (7,  'crypto',              'Crypto / Digital Assets',   'Exchange, custody, stablecoin issuance',             '₿'),
  (8,  'insurtech',           'Insurtech',                 'Insurance distribution & underwriting',               '🛡️'),
  (9,  'open-banking',        'Open Banking',              'Data sharing, third-party access, API banking',       '🔗'),
  (10, 'regtech',             'RegTech',                   'KYC/AML tools, data processing, compliance software', '🔍')
ON CONFLICT (id) DO NOTHING;

SELECT setval('product_verticals_id_seq', 10);

-- ── Bootstrap requirements (known High Risk blockers from research) ─────────
-- These are manually curated seed entries; daily scan will upsert/update them.

INSERT INTO regulatory_requirements (
  country_id, product_vertical_id, regulator_id,
  risk_level, risk_reason,
  title, summary, citation, source_url,
  last_verified_at
) VALUES
  -- Vietnam P2P Lending — HIGH (100% ownership blocker)
  (6, 3, 10,
   'HIGH', 'Foreign entities cannot hold majority ownership — operational blocker for non-VN companies',
   'Vietnam P2P Lending: 100% Vietnamese Ownership Required',
   'Decree 94/2025/ND-CP mandates that P2P lending platforms operating in Vietnam must be 100% Vietnamese-owned. Foreign entities are completely barred from direct operation. Vietnam-based IT systems are also required.',
   'Decree 94/2025/ND-CP',
   'https://www.sbv.gov.vn',
   NOW()),

  -- Vietnam Crypto — HIGH (no framework)
  (6, 7, 10,
   'HIGH', 'No licensing framework exists — crypto exchange operations are currently illegal in Vietnam',
   'Vietnam Crypto: No Legal Framework — Operations Illegal',
   'Vietnam has no established licensing framework for cryptocurrency exchanges or digital asset custody. Operating a crypto platform in Vietnam carries significant legal risk including criminal liability.',
   NULL,
   'https://www.sbv.gov.vn',
   NOW()),

  -- Indonesia Digital Banking — HIGH (capital requirement)
  (3, 4, 4,
   'HIGH', 'IDR 10 trillion (~$620M USD) minimum paid-up capital for full digital bank license',
   'Indonesia Digital Bank: IDR 10T Capital Requirement',
   'OJK requires a minimum paid-up capital of IDR 10 trillion for a full digital banking license (BUKU IV). This is an effective blocker for most fintech startups and foreign entrants.',
   'OJK Regulation POJK No. 12/POJK.03/2021',
   'https://www.ojk.go.id',
   NOW()),

  -- Singapore Crypto — MODERATE (MPI license)
  (1, 7, 1,
   'MODERATE', 'MAS MPI (DPT services) license required; S$1M capital; 12–18 month approval queue',
   'Singapore Crypto: MAS MPI License (DPT Services)',
   'Digital Payment Token (DPT) services require a Major Payment Institution (MPI) license under the Payment Services Act. Minimum S$1M base capital required. The current applicant queue is 12–18 months. A regulatory sandbox is available.',
   'Payment Services Act 2019 (MAS PS Act)',
   'https://www.mas.gov.sg/regulation/digital-assets',
   NOW()),

  -- Singapore Digital Lending — MODERATE (MLA license)
  (1, 3, 1,
   'MODERATE', 'Moneylenders Act license required; mandatory credit bureau reporting',
   'Singapore Digital Lending: Moneylenders Act License',
   'Digital lenders in Singapore must hold a Moneylenders Act (MLA) license issued by the Registry of Moneylenders. Mandatory participation in the Credit Bureau Singapore (CBS) for all loan disbursements.',
   'Moneylenders Act (Cap. 188)',
   'https://www.mas.gov.sg/regulation/money-lenders',
   NOW()),

  -- Indonesia P2P Lending — MODERATE (capital)
  (3, 3, 4,
   'MODERATE', 'IDR 25 billion minimum equity; OJK registration with 6–12 month review timeline',
   'Indonesia P2P Lending: IDR 25B Capital + OJK Registration',
   'P2P lending platforms must register with OJK and maintain minimum equity of IDR 25 billion (~$1.6M USD). OJK Regulation 3/2024 tightened requirements including mandatory escrow arrangements and data localization.',
   'OJK Regulation No. 3/POJK.05/2024',
   'https://www.ojk.go.id',
   NOW()),

  -- Philippines Digital Assets — MODERATE (BSP + SEC dual reg)
  (5, 7, 8,
   'MODERATE', 'Dual registration with BSP (VASP license) and SEC Philippines required',
   'Philippines Crypto: BSP + SEC Dual Registration Required',
   'Virtual Asset Service Providers (VASPs) must register with both the Bangko Sentral ng Pilipinas (BSP) for VASP licensing and the Securities and Exchange Commission (SEC-PH) for securities-related crypto activities. Dual compliance increases cost and timeline.',
   'BSP Circular 1108 (2021); SEC Memorandum Circular No. 8 (2021)',
   'https://www.bsp.gov.ph',
   NOW()),

  -- Thailand Crypto — MODERATE (investor suitability)
  (4, 7, 7,
   'MODERATE', 'Mandatory investor suitability assessment; retail investor restrictions on certain tokens',
   'Thailand Crypto: SEC Investor Suitability Mandatory',
   'Thailand SEC requires all retail investors to pass a suitability assessment before trading digital assets. Certain token categories are restricted to professional investors only. Exchanges must obtain a Digital Asset Business license from the SEC.',
   'Emergency Decree on Digital Asset Businesses B.E. 2561 (2018)',
   'https://www.sec.or.th',
   NOW()),

  -- Malaysia Digital Banking — MODERATE (limited licenses)
  (2, 4, 2,
   'MODERATE', 'BNM issued only 5 digital bank licenses in 2022; next licensing round date TBD',
   'Malaysia Digital Banking: BNM License (5 Issued, Next Round TBD)',
   'Bank Negara Malaysia (BNM) issued 5 digital banking licenses under the Licensing Framework for Digital Banks (2022). A new licensing round has not been announced as of 2026. New entrants must wait for next round or pursue partnership/acquisition routes.',
   'BNM Licensing Framework for Digital Banks (2020)',
   'https://www.bnm.gov.my',
   NOW())

ON CONFLICT (country_id, product_vertical_id, regulator_id) DO NOTHING;
