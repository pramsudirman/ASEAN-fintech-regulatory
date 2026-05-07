import type { CountryConfig } from './types'

export const MALAYSIA: CountryConfig = {
  code: 'MY',
  name: 'Malaysia',
  dbId: 2,
  sources: [
    {
      url: 'https://www.bnm.gov.my/financial-sector-regulation',
      regulatorAcronym: 'BNM',
      regulatorDbId: 2,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.bnm.gov.my/digital-bank',
      regulatorAcronym: 'BNM',
      regulatorDbId: 2,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.bnm.gov.my/money-services-business',
      regulatorAcronym: 'BNM',
      regulatorDbId: 2,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
    {
      url: 'https://www.bnm.gov.my/consumer-credit',
      regulatorAcronym: 'BNM',
      regulatorDbId: 2,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.sc.com.my/development/digital-markets',
      regulatorAcronym: 'SC',
      regulatorDbId: 3,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.sc.com.my/regulation/guidelines',
      regulatorAcronym: 'SC',
      regulatorDbId: 3,
      productVertical: 'wealth-management',
      productVerticalDbId: 6,
    },
  ],
}
