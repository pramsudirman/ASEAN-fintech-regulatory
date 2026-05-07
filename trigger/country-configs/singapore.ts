import type { CountryConfig } from './types'

export const SINGAPORE: CountryConfig = {
  code: 'SG',
  name: 'Singapore',
  dbId: 1,
  sources: [
    {
      url: 'https://www.mas.gov.sg/regulation/payments',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/digital-assets',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/money-lenders',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/banking',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/remittances',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/collective-investment-schemes',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'wealth-management',
      productVerticalDbId: 6,
    },
    {
      url: 'https://www.mas.gov.sg/regulation/insurance',
      regulatorAcronym: 'MAS',
      regulatorDbId: 1,
      productVertical: 'insurtech',
      productVerticalDbId: 8,
    },
  ],
}
