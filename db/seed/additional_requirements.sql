-- RegCompass ASEAN — Additional Requirements
-- Fills coverage gaps across all 6 countries × 10 product verticals
-- Run in Supabase SQL Editor after initial_data.sql
--
-- Country IDs:  1=SG  2=MY  3=ID  4=TH  5=PH  6=VN
-- Regulator IDs: 1=MAS 2=BNM 3=SC(MY) 4=OJK 5=BI 6=BOT 7=SEC(TH) 8=BSP 9=SEC-PH 10=SBV
-- Product IDs:  1=digital-payments 2=bnpl 3=digital-lending 4=digital-banking
--               5=remittance 6=wealth-management 7=crypto 8=insurtech 9=open-banking 10=regtech

INSERT INTO regulatory_requirements (
  country_id, product_vertical_id, regulator_id,
  risk_level, risk_reason,
  title, summary, citation, source_url,
  last_verified_at
) VALUES

-- ─────────────────────────────────────────────────────────────────────────────
-- SINGAPORE (country_id=1, regulator_id=1 MAS)
-- ─────────────────────────────────────────────────────────────────────────────

  -- SG: Digital Payments
  (1, 1, 1,
   'MODERATE', 'Major Payment Institution (MPI) license required; S$5M base capital; 6–12 month timeline',
   'Singapore Digital Payments: MAS MPI License Required',
   'E-wallets, QR payment schemes, and account-to-account payment services require a Major Payment Institution (MPI) license under the Payment Services Act 2019. Minimum base capital of S$5M and annual reporting obligations apply. MAS sandbox is available for novel payment models.',
   'Payment Services Act 2019; MAS Notice PSN01',
   'https://www.mas.gov.sg/regulation/payments',
   NOW()),

  -- SG: BNPL
  (1, 2, 1,
   'LOW', 'MAS BNPL Code of Conduct is industry-led and largely voluntary; borrowing caps apply',
   'Singapore BNPL: Industry Code of Conduct (MAS-Endorsed)',
   'MAS endorsed an industry Code of Conduct for BNPL providers in 2022. Key obligations include S$2,000 aggregate BNPL borrowing cap per consumer across all providers, mandatory hardship provisions, and credit bureau reporting for delinquent accounts. No dedicated licensing law as of 2026.',
   'MAS BNPL Code of Conduct (2022)',
   'https://www.mas.gov.sg/regulation/buy-now-pay-later',
   NOW()),

  -- SG: Digital Banking
  (1, 4, 1,
   'MODERATE', 'MAS issued 4 Digital Full Bank / Digital Wholesale Bank licenses in 2022; next round TBD',
   'Singapore Digital Banking: MAS Digital Bank License (Next Round TBD)',
   'MAS awarded 2 Digital Full Bank (DFB) and 2 Digital Wholesale Bank (DWB) licenses in 2022. No new licensing round has been announced as of 2026. New entrants must seek partnership with an existing licensed bank or wait for the next round.',
   'MAS Digital Bank Framework (2020)',
   'https://www.mas.gov.sg/regulation/banking',
   NOW()),

  -- SG: Remittance
  (1, 5, 1,
   'MODERATE', 'MPI cross-border money transfer service license required; AML/CFT programme mandatory',
   'Singapore Remittance: MAS MPI License for Cross-Border Transfers',
   'Cross-border money transfer services require a Major Payment Institution (MPI) license under the Payment Services Act. Operators must implement MAS-prescribed AML/CFT programmes and file suspicious transaction reports. S$5M base capital applies.',
   'Payment Services Act 2019; MAS Notice PSN02',
   'https://www.mas.gov.sg/regulation/payments',
   NOW()),

  -- SG: Wealth Management
  (1, 6, 1,
   'MODERATE', 'MAS Capital Markets Services (CMS) license required for fund management and advisory',
   'Singapore Wealth Management: MAS CMS License',
   'Robo-advisory, discretionary fund management, and investment advisory services require a Capital Markets Services (CMS) license from MAS. Licensed Fund Management Companies (LFMCs) must meet minimum base capital of S$250,000 (Registered) or S$1M (Licensed). Annual MAS returns required.',
   'Securities and Futures Act 2001; MAS CMS Regulations',
   'https://www.mas.gov.sg/regulation/capital-markets',
   NOW()),

  -- SG: Insurtech
  (1, 8, 1,
   'MODERATE', 'MAS Insurance Intermediary or Direct Insurer license required; FAIR Dealing mandatory',
   'Singapore Insurtech: MAS Insurance License or Intermediary Registration',
   'Insurance distribution platforms must be registered as Financial Advisers (FA) or Licensed Insurance Brokers under MAS. Direct underwriting requires a full MAS insurance license. FAIR Dealing obligations apply including product disclosure and suitability assessment.',
   'Insurance Act 1966; Financial Advisers Act 2001',
   'https://www.mas.gov.sg/regulation/insurance',
   NOW()),

  -- SG: Open Banking
  (1, 9, 1,
   'LOW', 'MAS API Playbook is voluntary; no mandatory open banking regulation as of 2026',
   'Singapore Open Banking: MAS Finance-as-a-Service API Playbook (Voluntary)',
   'MAS published the Finance-as-a-Service API Playbook encouraging financial institutions to publish open APIs. Participation is voluntary — there is no Singapore equivalent of PSD2 mandating data sharing. MAS MyInfo provides a government-backed personal data consent framework.',
   'MAS Finance-as-a-Service API Playbook (2016, updated 2020)',
   'https://www.mas.gov.sg/development/fintech/api-playbook',
   NOW()),

  -- SG: RegTech
  (1, 10, 1,
   'LOW', 'No specific RegTech licensing; AML/KYC tool providers subject to data protection and MAS IT outsourcing guidelines',
   'Singapore RegTech: MAS Technology Risk Management and PDPA Compliance',
   'RegTech providers (KYC, AML screening, compliance monitoring tools) are not separately licensed in Singapore. However, deployments must comply with MAS Technology Risk Management (TRM) Guidelines and the Personal Data Protection Act (PDPA). Cloud-based RegTech must meet MAS cloud outsourcing requirements.',
   'MAS TRM Guidelines (2021); PDPA 2012',
   'https://www.mas.gov.sg/regulation/technology-risk',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- MALAYSIA (country_id=2, regulators: 2=BNM, 3=SC)
-- ─────────────────────────────────────────────────────────────────────────────

  -- MY: Digital Payments
  (2, 1, 2,
   'MODERATE', 'BNM e-money license required; RM5M minimum capital; foreign entity must establish local company',
   'Malaysia Digital Payments: BNM E-Money License',
   'E-wallet and digital payment services require a BNM e-money license under the Financial Services Act 2013. Minimum paid-up capital of RM5 million applies. Foreign operators must establish a Malaysian-incorporated entity. BNM data residency requirements mandate local storage of payment transaction data.',
   'Financial Services Act 2013; BNM E-Money Policy Document',
   'https://www.bnm.gov.my/regulation',
   NOW()),

  -- MY: BNPL
  (2, 2, 2,
   'MODERATE', 'BNM BNPL Policy Document (2023) sets credit limit caps and mandatory credit bureau checks',
   'Malaysia BNPL: BNM Policy Document — Credit Cap and Reporting',
   'BNM issued a Policy Document on BNPL in 2023 requiring mandatory Central Credit Reference Information System (CCRIS) checks for purchases above RM1,000. Monthly repayment obligations capped at 20% of net income. Providers must be registered with BNM.',
   'BNM Policy Document on Buy Now Pay Later (2023)',
   'https://www.bnm.gov.my/regulation',
   NOW()),

  -- MY: Digital Lending
  (2, 3, 3,
   'MODERATE', 'SC Malaysia P2P operator registration required; RM5M minimum operational capital',
   'Malaysia P2P Lending: SC P2P Operator Registration',
   'P2P lending platforms must be registered with the Securities Commission Malaysia (SC) as a Recognized Market Operator (RMO). Minimum operational capital of RM5 million. Individual investor limits apply (RM50,000 per platform per year for retail investors).',
   'SC Guidelines on Recognized Markets (2019, updated 2022)',
   'https://www.sc.com.my/regulation/guidelines/recognized-markets',
   NOW()),

  -- MY: Remittance
  (2, 5, 2,
   'MODERATE', 'BNM Money Services Business (MSB) Class B or C license required for remittance',
   'Malaysia Remittance: BNM Money Services Business License',
   'Cross-border remittance operators must hold a Money Services Business (MSB) license from BNM. Class B covers single currency; Class C covers multiple currencies. Foreign operators must incorporate locally. Annual AML/CFT audit and AMLATFPUAA compliance required.',
   'Money Services Business Act 2011; BNM MSB Licensing Framework',
   'https://www.bnm.gov.my/regulation/money-services',
   NOW()),

  -- MY: Wealth Management
  (2, 6, 3,
   'MODERATE', 'SC Capital Markets Services (CMS) license required; RM2M minimum paid-up capital',
   'Malaysia Wealth Management: SC Capital Markets Services License',
   'Robo-advisory and investment management services require a Capital Markets Services (CMS) license from the Securities Commission Malaysia. Minimum paid-up capital of RM2 million. SC registered Digital Investment Management (DIM) framework available for robo-advisors.',
   'Capital Markets and Services Act 2007; SC Digital Investment Management Framework',
   'https://www.sc.com.my/regulation',
   NOW()),

  -- MY: Crypto
  (2, 7, 3,
   'MODERATE', 'SC Digital Asset Exchange (DAX) license required; RM5M minimum operational funds',
   'Malaysia Crypto: SC Digital Asset Exchange License',
   'Cryptocurrency exchanges must be registered as Digital Asset Exchanges (DAX) with the Securities Commission Malaysia. Minimum operational funds of RM5 million required. Only SC-approved digital assets may be listed. AML/CFT compliance, cold storage requirements, and annual SC audit apply.',
   'Capital Markets and Services Act 2007; SC Digital Assets Guidelines (2020)',
   'https://www.sc.com.my/regulation/digital-assets',
   NOW()),

  -- MY: Insurtech
  (2, 8, 2,
   'MODERATE', 'BNM insurance license required; microinsurance framework available for limited products',
   'Malaysia Insurtech: BNM Insurance License and Microinsurance Framework',
   'Insurance underwriting and distribution in Malaysia requires a BNM license under the Financial Services Act 2013. BNM has a microinsurance framework permitting non-insurer digital platforms to distribute microinsurance products with a registered insurer partner. Bancassurance and direct sales require separate approvals.',
   'Financial Services Act 2013; BNM Policy Document on Microinsurance (2021)',
   'https://www.bnm.gov.my/regulation',
   NOW()),

  -- MY: Open Banking
  (2, 9, 2,
   'MODERATE', 'BNM Open Banking Framework mandates API standards for licensed banks; third-party providers need BNM approval',
   'Malaysia Open Banking: BNM Open Banking Framework',
   'BNM issued an Open Banking Framework in 2022 requiring Malaysian licensed banks to publish standardised open APIs by 2025. Third-party providers (TPPs) must be registered with BNM to access bank data. Data privacy obligations under PDPA apply to all TPP integrations.',
   'BNM Open Banking Framework (2022)',
   'https://www.bnm.gov.my/financial-sector-blueprint',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- INDONESIA (country_id=3, regulators: 4=OJK, 5=BI)
-- ─────────────────────────────────────────────────────────────────────────────

  -- ID: Digital Payments
  (3, 1, 5,
   'MODERATE', 'BI electronic money license required; BI QRIS mandatory for QR payments; data localization applies',
   'Indonesia Digital Payments: BI E-Money License + QRIS Mandate',
   'E-money and digital wallet services require a Bank Indonesia (BI) Principal or Affiliated license under PBI 23/6/PBI/2021. All QR payment services must use the BI-mandated QRIS standard. Critical payment data must be stored locally in Indonesia.',
   'PBI No. 23/6/PBI/2021 (E-Money); BI QRIS Regulation',
   'https://www.bi.go.id/regulation',
   NOW()),

  -- ID: BNPL
  (3, 2, 4,
   'MODERATE', 'OJK POJK 10/2022 governs BNPL; mandatory OJK registration and credit bureau integration',
   'Indonesia BNPL: OJK Registration Required (POJK 10/2022)',
   'BNPL services in Indonesia are governed by OJK Regulation POJK 10/2022. Providers must register with OJK and integrate with the national credit bureau (SLIK/iDEB). Maximum tenor of 12 months and debt collection restrictions apply. Foreign entities must establish a local PT company.',
   'OJK Regulation POJK No. 10/POJK.05/2022',
   'https://www.ojk.go.id/regulation',
   NOW()),

  -- ID: Crypto
  (3, 7, 4,
   'HIGH', 'Bappebti Pedagang Aset Kripto (PAK) license required; local PT entity mandatory; supervision transferring to OJK under P2SK Law',
   'Indonesia Crypto: Bappebti PAK License + Local PT Entity Required',
   'Cryptocurrency is classified as a commodity in Indonesia, regulated by Bappebti (Commodity Futures Trading Agency). All crypto exchanges must hold a Pedagang Aset Kripto (PAK) license. A local Indonesian PT (Perseroan Terbatas) company is mandatory — no foreign branch or representative office permitted. Under Law No. 4 of 2023 (P2SK), crypto supervision is transferring from Bappebti to OJK.',
   'Bappebti Regulation No. 8 of 2021; Law No. 4 of 2023 (P2SK)',
   'https://www.bappebti.go.id',
   NOW()),

  -- ID: Remittance
  (3, 5, 4,
   'MODERATE', 'OJK KUPVA license required; foreign exchange activities require BI approval; data localization mandatory',
   'Indonesia Remittance: OJK KUPVA License + BI FX Approval',
   'Cross-border remittance services require a KUPVA (Kegiatan Usaha Penukaran Valuta Asing) license from OJK. Foreign exchange activities exceeding USD 100,000 require separate BI approval. Transaction data must be stored locally in Indonesia.',
   'OJK Regulation on KUPVA; BI Foreign Exchange Regulation',
   'https://www.ojk.go.id',
   NOW()),

  -- ID: Wealth Management
  (3, 6, 4,
   'MODERATE', 'OJK investment manager license required; 99% local ownership cap for foreign investment managers',
   'Indonesia Wealth Management: OJK Investment Manager License',
   'Investment management and robo-advisory services require an OJK Investment Manager (Manajer Investasi) license. Foreign investment management companies may hold up to 99% ownership via direct investment (PT PMA) but must register with OJK and BKPM. Minimum capital and personnel requirements apply.',
   'OJK Regulation POJK No. 23/POJK.04/2016',
   'https://www.ojk.go.id',
   NOW()),

  -- ID: Insurtech
  (3, 8, 4,
   'MODERATE', 'OJK insurance license required; 80% maximum foreign ownership cap for insurance companies',
   'Indonesia Insurtech: OJK Insurance License (80% FDI Cap)',
   'Insurance underwriting in Indonesia requires an OJK license. Foreign direct investment in insurance companies is capped at 80% of paid-up capital. Insurtech platforms acting as intermediaries (agents/brokers) require separate OJK broker licensing. Premium data and policyholder data must be stored locally.',
   'Law No. 40 of 2014 on Insurance; OJK Regulation POJK 67/2016',
   'https://www.ojk.go.id',
   NOW()),

  -- ID: Open Banking
  (3, 9, 5,
   'MODERATE', 'BI Open API Payment Standard mandatory for licensed payment service providers since 2023',
   'Indonesia Open Banking: BI Open API Payment Standard',
   'Bank Indonesia mandated the Open API Payment Standard (SNAP — Standar Nasional Open API Pembayaran) for all licensed payment service providers, effective 2023. Licensed banks and e-money providers must expose standardised APIs. Third-party integrators must enter into cooperation agreements with licensed institutions.',
   'BI Regulation PBI No. 22/23/PBI/2020 (SNAP)',
   'https://www.bi.go.id/snap',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- THAILAND (country_id=4, regulators: 6=BOT, 7=SEC)
-- ─────────────────────────────────────────────────────────────────────────────

  -- TH: Digital Payments
  (4, 1, 6,
   'MODERATE', 'BOT Payment Service Provider (PSP) Type 1 or 2 license required; PromptPay integration mandatory for qualifying services',
   'Thailand Digital Payments: BOT Payment Service Provider License',
   'Digital payment and e-wallet services require a Payment Service Provider license from the Bank of Thailand under the Payment Systems Act 2017. Type 1 covers e-money; Type 2 covers payment facilitators. Integration with PromptPay (national payment infrastructure) is mandatory for services above certain thresholds.',
   'Payment Systems Act 2017; BOT Notification on PSP',
   'https://www.bot.or.th/regulation/payment',
   NOW()),

  -- TH: BNPL
  (4, 2, 6,
   'MODERATE', 'BOT Nano-Finance and Personal Loan regulations apply; interest rate ceiling 28% p.a.',
   'Thailand BNPL: BOT Personal Loan Regulations — Interest Rate Ceiling',
   'BNPL services in Thailand fall under BOT personal loan regulations. A 28% per annum interest rate ceiling applies. Providers offering BNPL above THB 200,000 require a commercial bank or finance company license. Smaller BNPL products may qualify under the Nano-Finance framework.',
   'BOT Notification on Personal Loan (2018); Nano-Finance Regulation',
   'https://www.bot.or.th/regulation',
   NOW()),

  -- TH: Digital Lending
  (4, 3, 6,
   'MODERATE', 'BOT Nano-Finance license or finance company license required depending on loan size',
   'Thailand Digital Lending: BOT Nano-Finance or Finance Company License',
   'Digital lending in Thailand requires either a Nano-Finance license (loans up to THB 100,000, for low-income borrowers) or a Finance Company license from the Bank of Thailand. P2P lending has no dedicated regulatory framework — SEC has issued guidance but dedicated P2P rules are pending.',
   'BOT Notification on Nano-Finance; Financial Institutions Businesses Act 2008',
   'https://www.bot.or.th/regulation',
   NOW()),

  -- TH: Digital Banking
  (4, 4, 6,
   'HIGH', 'BOT Virtual Bank pilot underway — only 3 licenses expected; applications closed May 2024',
   'Thailand Digital Banking: BOT Virtual Bank License (Limited — Pilot Phase)',
   'BOT launched a Virtual Bank licensing framework in 2023 under the Financial Institutions Businesses Act, with only 3 licenses planned for the pilot phase. The application window closed in May 2024. New applicants must wait for the next licensing round. Minimum capital of THB 5 billion (~$140M USD) required.',
   'BOT Virtual Bank Licensing Framework (2023)',
   'https://www.bot.or.th/regulation/virtual-bank',
   NOW()),

  -- TH: Remittance
  (4, 5, 6,
   'MODERATE', 'BOT money transfer agent license required; foreign exchange transactions above THB 50M require BOT approval',
   'Thailand Remittance: BOT Money Transfer Agent License',
   'Cross-border money transfer services require a BOT-licensed Money Transfer Agent (MTA) authorization. Foreign exchange transactions exceeding THB 50 million require BOT approval. Service providers must file daily transaction reports with the BOT exchange control authority.',
   'Exchange Control Act 1942; BOT Notification on Money Transfer',
   'https://www.bot.or.th/regulation',
   NOW()),

  -- TH: Wealth Management
  (4, 6, 7,
   'MODERATE', 'SEC Investment Advisor or Fund Manager license required; robo-advisory under SEC guidance since 2019',
   'Thailand Wealth Management: SEC Investment Advisor License',
   'Investment advisory and fund management services require a license from the Thai SEC. Robo-advisory services have been permitted under SEC guidance since 2019 with specific disclosure requirements. Foreign asset management firms may establish as a Foreign Company Representative but must obtain SEC license for local operations.',
   'Securities and Exchange Act 1992; SEC Notification on Investment Advisor',
   'https://www.sec.or.th/regulation',
   NOW()),

  -- TH: Insurtech
  (4, 8, 6,
   'MODERATE', 'OIC insurance license required; online insurance distribution requires additional OIC approval',
   'Thailand Insurtech: OIC Insurance License for Distribution',
   'Insurance underwriting and distribution in Thailand is regulated by the Office of Insurance Commission (OIC). Online/digital insurance distribution requires additional OIC approval. Insurtech platforms acting as brokers need an OIC brokerage license. Foreign ownership in life insurance limited to 49%.',
   'Life Insurance Act 1992; Non-Life Insurance Act 1992; OIC Digital Insurance Regulations',
   'https://www.oic.or.th',
   NOW()),

  -- TH: Open Banking
  (4, 9, 6,
   'LOW', 'BOT open banking framework in development; no mandatory API standard published as of 2026',
   'Thailand Open Banking: BOT Framework in Development (No Mandate Yet)',
   'The Bank of Thailand is developing an open banking framework under its Financial Sector Master Plan. As of 2026, no mandatory open API standard has been published. PromptPay and NDID (National Digital ID) provide foundational infrastructure but third-party data access is not yet mandated.',
   'BOT Financial Sector Master Plan Phase III (2023–2027)',
   'https://www.bot.or.th/financial-sector-plan',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- PHILIPPINES (country_id=5, regulators: 8=BSP, 9=SEC-PH)
-- ─────────────────────────────────────────────────────────────────────────────

  -- PH: Digital Payments
  (5, 1, 8,
   'MODERATE', 'BSP Electronic Money Issuer (EMI) license required; InstaPay/PESONet participation mandatory above thresholds',
   'Philippines Digital Payments: BSP EMI License + InstaPay Integration',
   'E-wallet and digital payment services require a BSP Electronic Money Issuer (EMI) license under BSP Circular 649. Licensed EMIs must participate in InstaPay (real-time) and PESONet (batch) payment rails for qualifying services. Minimum capital of PHP 100 million applies to bank-based EMIs.',
   'BSP Circular 649 (2009); BSP Circular 1127 (2022)',
   'https://www.bsp.gov.ph/regulation/payments',
   NOW()),

  -- PH: BNPL
  (5, 2, 8,
   'MODERATE', 'BSP and SEC BNPL guidelines apply; mandatory disclosure, credit risk scoring, and collection practice rules',
   'Philippines BNPL: BSP and SEC Disclosure Requirements',
   'BNPL services are regulated jointly by the BSP (for licensed EMIs/banks) and SEC (for lending companies). Mandatory disclosure of effective interest rates, mandatory credit risk assessment, and BSP Circular 1133 consumer protection standards apply. Online lending app operators must register with the SEC.',
   'BSP Circular 1133 (2022); SEC Memorandum Circular on Lending Companies',
   'https://www.bsp.gov.ph',
   NOW()),

  -- PH: Digital Lending
  (5, 3, 9,
   'MODERATE', 'SEC Lending Company Registration required; RA 9474 applies; online lending apps need NPC registration',
   'Philippines Digital Lending: SEC Registration + NPC Data Privacy',
   'Online lending platforms must register with the SEC as a Lending Company under Republic Act 9474. Additional NPC (National Privacy Commission) registration required for all app-based lenders. Maximum effective interest rate of 6% per month applies to consumer loans. BSP-licensed banks and EMIs may offer lending without separate SEC registration.',
   'Republic Act 9474 (Lending Company Regulation Act); BSP Circular 1133',
   'https://www.sec.gov.ph',
   NOW()),

  -- PH: Digital Banking
  (5, 4, 8,
   'MODERATE', 'BSP Digital Bank license required; PHP 1 billion minimum capital; only 6 licenses issued as of 2024',
   'Philippines Digital Banking: BSP Digital Bank License (6 Issued)',
   'BSP issued a dedicated Digital Bank license framework in 2021 via BSP Circular 1105. Only 6 digital bank licenses have been issued as of 2024. New applications are accepted on a rolling basis subject to BSP quota. Minimum capital of PHP 1 billion and 100% digital service delivery required.',
   'BSP Circular 1105 (2021) on Digital Banks',
   'https://www.bsp.gov.ph/regulation/banks',
   NOW()),

  -- PH: Remittance
  (5, 5, 8,
   'MODERATE', 'BSP Virtual Remittance Service Provider (VRSP) or MVTS license required',
   'Philippines Remittance: BSP VRSP / MVTS License',
   'Cross-border remittance services require a BSP Money Value Transfer Service (MVTS) or Virtual Remittance Service Provider (VRSP) license. Operators must participate in the BSP regulatory sandbox for novel models. KYC/AML under the AMLA and transaction monitoring reports required.',
   'BSP Circular 942 (MVTS); Anti-Money Laundering Act (AMLA)',
   'https://www.bsp.gov.ph/regulation/remittance',
   NOW()),

  -- PH: Wealth Management
  (5, 6, 9,
   'MODERATE', 'SEC Investment Company or Investment Adviser registration required; RA 2629 applies',
   'Philippines Wealth Management: SEC Investment Company Registration',
   'Investment advisory, fund management, and robo-advisory services require SEC registration under the Investment Company Act (RA 2629) and the Securities Regulation Code. Online investment platforms must disclose risk ratings and product documentation. BSP-supervised trusts have separate framework.',
   'Investment Company Act (RA 2629); Securities Regulation Code (RA 8799)',
   'https://www.sec.gov.ph',
   NOW()),

  -- PH: Insurtech
  (5, 8, 8,
   'MODERATE', 'IC insurance license required; online distribution needs IC approval; foreign ownership limited to 40%',
   'Philippines Insurtech: Insurance Commission License (40% FDI Cap)',
   'Insurance underwriting and distribution require an Insurance Commission (IC) license. Online insurance distribution platforms must obtain IC approval. Foreign equity ownership in insurance companies is limited to 40% under the Insurance Code. IC Circular Letter 2022-52 issued guidelines for digital insurance products.',
   'Insurance Code (RA 10607); IC Circular Letter 2022-52',
   'https://www.insurance.gov.ph',
   NOW()),

  -- PH: Open Banking
  (5, 9, 8,
   'MODERATE', 'BSP Open Finance Framework (2021) mandates data portability; accreditation required for data recipients',
   'Philippines Open Banking: BSP Open Finance Framework — Data Portability Mandate',
   'BSP Circular 1122 (2021) established an Open Finance Framework requiring BSP-supervised financial institutions to enable customer-consented data sharing via standardised APIs. Third-party data recipients must be accredited by BSP. Full implementation expected by 2025–2026.',
   'BSP Circular 1122 (2021) on Open Finance',
   'https://www.bsp.gov.ph/regulation/open-finance',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- VIETNAM (country_id=6, regulator: 10=SBV)
-- ─────────────────────────────────────────────────────────────────────────────

  -- VN: Digital Payments
  (6, 1, 10,
   'HIGH', 'SBV intermediary payment license required; 49% foreign ownership cap; Vietnam data localization mandatory',
   'Vietnam Digital Payments: SBV License + 49% Foreign Ownership Cap',
   'Payment intermediary services (e-wallets, payment gateways) require an SBV license under Decree 101/2012. Foreign entities are limited to 49% ownership in licensed payment intermediary companies. Customer transaction data must be stored on servers located within Vietnam. Obtaining a license typically takes 18–24 months.',
   'Decree 101/2012/ND-CP on Non-Cash Payment; Cybersecurity Law 2018',
   'https://www.sbv.gov.vn',
   NOW()),

  -- VN: BNPL
  (6, 2, 10,
   'MODERATE', 'SBV consumer credit regulations apply; no dedicated BNPL law; credit institution partnership required for foreign operators',
   'Vietnam BNPL: SBV Consumer Credit Rules — Credit Institution Partnership Required',
   'Vietnam has no dedicated BNPL regulation as of 2026. BNPL services fall under SBV consumer credit rules requiring that loan disbursement be conducted through a licensed credit institution. Foreign BNPL platforms typically operate through a local banking partner or must establish a locally-licensed finance company.',
   'SBV Circular 43/2016/TT-NHNN on Consumer Credit',
   'https://www.sbv.gov.vn',
   NOW()),

  -- VN: Digital Banking
  (6, 4, 10,
   'HIGH', 'No digital bank licensing framework exists in Vietnam; only traditional bank licenses issued by SBV with high capital requirements',
   'Vietnam Digital Banking: No Digital Bank License Framework Exists',
   'Vietnam has no dedicated digital banking license. New bank licenses require SBV approval with a minimum charter capital of VND 3 trillion (~$120M USD). Foreign bank licenses are limited; a branch may be established but cannot take retail deposits. Digital-only operations through a subsidiary require a full banking license.',
   'Law on Credit Institutions 2010 (amended 2017)',
   'https://www.sbv.gov.vn',
   NOW()),

  -- VN: Remittance
  (6, 5, 10,
   'HIGH', 'Strict SBV FX controls; outbound remittance highly restricted; inbound allowed with documentation; no independent remittance license for foreign firms',
   'Vietnam Remittance: Strict SBV FX Controls — Outbound Severely Restricted',
   'Vietnam maintains strict foreign exchange controls under Ordinance 28/2005. Outbound remittance by individuals is limited to approved purposes and requires documentation. Foreign remittance companies must operate through an SBV-licensed bank partner. Independent cross-border money transfer licenses for foreign entities are not available.',
   'Ordinance 28/2005 on Foreign Exchange; SBV Circular 15/2011',
   'https://www.sbv.gov.vn',
   NOW()),

  -- VN: Wealth Management
  (6, 6, 10,
   'MODERATE', 'SSC securities business license required; foreign ownership in securities companies capped at 100% via approved M&A route',
   'Vietnam Wealth Management: SSC Securities Business License',
   'Investment advisory and fund management services in Vietnam require a license from the State Securities Commission (SSC). Foreign investors may own 100% of a securities company via approved routes since 2021. Fund management companies must be established as joint-stock companies with minimum charter capital of VND 25 billion.',
   'Securities Law 2019; Decree 155/2020/ND-CP',
   'https://www.ssc.gov.vn',
   NOW()),

  -- VN: Insurtech
  (6, 8, 10,
   'MODERATE', 'MOF insurance enterprise license required; foreign ownership permitted up to 100% in non-life; data localization applies',
   'Vietnam Insurtech: MOF Insurance License — Foreign Ownership Permitted',
   'Insurance enterprises in Vietnam require a license from the Ministry of Finance (MOF). Foreign investors may hold up to 100% in non-life insurance but face restrictions in life insurance. Digital distribution channels and insurtech platforms must comply with the Insurance Business Law 2022 and MOF circulars on e-insurance.',
   'Insurance Business Law 2022 (effective 2023)',
   'https://mof.gov.vn',
   NOW()),

  -- VN: Open Banking
  (6, 9, 10,
   'MODERATE', 'SBV Open Banking Circular (03/2020) mandates banks to provide API access; no third-party provider framework yet',
   'Vietnam Open Banking: SBV API Framework — No Third-Party Access Standard Yet',
   'SBV Circular 09/2020 requires licensed banks to develop and publish open APIs for internal use and partner integrations. However, Vietnam lacks a standardised third-party provider (TPP) framework comparable to PSD2. Third-party integrations are governed by bilateral agreements between the bank and the fintech.',
   'SBV Circular 09/2020/TT-NHNN on Open API',
   'https://www.sbv.gov.vn',
   NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- REGTECH (product_vertical_id=10) — all 6 countries
-- Covers obligations on KYC/AML tool providers, data protection, IT outsourcing
-- ─────────────────────────────────────────────────────────────────────────────

  -- SG: RegTech
  (1, 10, 1,
   'LOW', 'No RegTech-specific license; MAS TRM Guidelines + PDPA apply to all data-processing tools',
   'Singapore RegTech: MAS TRM Guidelines and PDPA Compliance',
   'RegTech providers (KYC, AML screening, transaction monitoring) are not separately licensed in Singapore. Deployments must comply with MAS Technology Risk Management (TRM) Guidelines 2021 and the Personal Data Protection Act (PDPA) 2012. Cloud-based RegTech sold to MAS-regulated institutions must satisfy MAS cloud outsourcing requirements including annual third-party audits.',
   'MAS TRM Guidelines (2021); PDPA 2012; MAS Outsourcing Guidelines',
   'https://www.mas.gov.sg/regulation/technology-risk',
   NOW()),

  -- MY: RegTech
  (2, 10, 2,
   'LOW', 'No RegTech license required; PDPA Malaysia + BNM outsourcing policy apply',
   'Malaysia RegTech: PDPA and BNM Outsourcing Policy',
   'RegTech vendors selling to Malaysian financial institutions must comply with the Personal Data Protection Act 2010 (PDPA) and BNM Risk Management in Technology (RMiT) Policy Document. Cloud services provided to BNM-licensed institutions require BNM notification and annual third-party audits. AML screening tools must align with the Anti-Money Laundering Act (AMLATFPUAA).',
   'PDPA 2010; BNM RMiT Policy Document (2020); AMLATFPUAA 2001',
   'https://www.bnm.gov.my/regulation/technology',
   NOW()),

  -- ID: RegTech
  (3, 10, 4,
   'MODERATE', 'OJK POJK 11/2022 on IT governance applies; personal data processing requires local storage under PDP Law 2022',
   'Indonesia RegTech: OJK IT Governance + PDP Law Data Localization',
   'RegTech providers servicing OJK-supervised institutions must comply with POJK 11/2022 on Information Technology Governance. Indonesia''s Personal Data Protection Law (UU PDP, effective 2024) requires personal data of Indonesian citizens to be processed and stored locally. Cross-border data transfer requires OJK and BSSN notification.',
   'POJK No. 11/POJK.03/2022; UU PDP No. 27 of 2022; Cybersecurity Law (UU ITE)',
   'https://www.ojk.go.id/regulation',
   NOW()),

  -- TH: RegTech
  (4, 10, 6,
   'LOW', 'PDPA Thailand (effective 2022) applies to all personal data processing; BOT IT outsourcing notification required',
   'Thailand RegTech: PDPA and BOT IT Outsourcing Requirements',
   'Thailand''s Personal Data Protection Act (PDPA), effective June 2022, applies to all RegTech tools processing personal data of Thai individuals. Data processors must implement security standards and sign Data Processing Agreements with financial institution clients. BOT-supervised entities must notify BOT before outsourcing critical IT functions to third-party RegTech vendors.',
   'PDPA 2019 (effective 2022); BOT Notification on IT Outsourcing',
   'https://www.pdpc.or.th',
   NOW()),

  -- PH: RegTech
  (5, 10, 8,
   'LOW', 'NPC registration required for personal data processors; BSP Circular 982 on IT risk management applies',
   'Philippines RegTech: NPC Registration + BSP IT Risk Management',
   'RegTech providers processing personal data of Philippine residents must register with the National Privacy Commission (NPC) under the Data Privacy Act 2012 (RA 10173). BSP Circular 982 on Technology Risk Management applies to all IT vendors of BSP-supervised institutions. KYC/AML tools must align with AMLC (Anti-Money Laundering Council) regulations.',
   'Data Privacy Act 2012 (RA 10173); BSP Circular 982; AMLA',
   'https://www.privacy.gov.ph',
   NOW()),

  -- VN: RegTech
  (6, 10, 10,
   'MODERATE', 'Cybersecurity Law mandates local data storage; personal data of Vietnamese users cannot be transferred abroad without MISA approval',
   'Vietnam RegTech: Cybersecurity Law — Local Data Storage Mandatory',
   'Vietnam''s Cybersecurity Law (2018) and Decree 13/2023 on Personal Data Protection require that personal data of Vietnamese users be stored on servers located within Vietnam. RegTech tools processing financial data must comply with SBV Circular 09/2020 on IT security. Cross-border transfer of personal data requires approval from the Ministry of Information and Communications (MIC).',
   'Cybersecurity Law 2018; Decree 13/2023/ND-CP on Personal Data; SBV Circular 09/2020',
   'https://www.sbv.gov.vn',
   NOW())

ON CONFLICT (country_id, product_vertical_id, regulator_id) DO NOTHING;
