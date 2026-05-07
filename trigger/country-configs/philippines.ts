import type { CountryConfig } from './types'

export const PHILIPPINES: CountryConfig = {
  code: 'PH',
  name: 'Philippines',
  dbId: 5,
  sources: [
    {
      url: 'https://www.bsp.gov.ph/PaymentAndSettlement/payment_settlement.aspx',
      regulatorAcronym: 'BSP',
      regulatorDbId: 8,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.bsp.gov.ph/FinancialStability/Circular_Detail.aspx',
      regulatorAcronym: 'BSP',
      regulatorDbId: 8,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.bsp.gov.ph/regulations/issuances/Digital_Banks.aspx',
      regulatorAcronym: 'BSP',
      regulatorDbId: 8,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.bsp.gov.ph/regulations/issuances/VASPs.aspx',
      regulatorAcronym: 'BSP',
      regulatorDbId: 8,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.bsp.gov.ph/regulations/issuances/Remittance.aspx',
      regulatorAcronym: 'BSP',
      regulatorDbId: 8,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
    {
      url: 'https://www.sec.gov.ph/securities-regulation-code/',
      regulatorAcronym: 'SEC-PH',
      regulatorDbId: 9,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.sec.gov.ph/investment-company/',
      regulatorAcronym: 'SEC-PH',
      regulatorDbId: 9,
      productVertical: 'wealth-management',
      productVerticalDbId: 6,
    },
  ],
}
