import type { CountryConfig } from './types'

export const VIETNAM: CountryConfig = {
  code: 'VN',
  name: 'Vietnam',
  dbId: 6,
  sources: [
    {
      url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/fm/pss',
      regulatorAcronym: 'SBV',
      regulatorDbId: 10,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/fm/pss',
      regulatorAcronym: 'SBV',
      regulatorDbId: 10,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/fm/pss',
      regulatorAcronym: 'SBV',
      regulatorDbId: 10,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/fm/mb',
      regulatorAcronym: 'SBV',
      regulatorDbId: 10,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/fm/pss',
      regulatorAcronym: 'SBV',
      regulatorDbId: 10,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
  ],
}
