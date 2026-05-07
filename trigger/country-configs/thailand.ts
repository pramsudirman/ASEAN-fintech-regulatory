import type { CountryConfig } from './types'

export const THAILAND: CountryConfig = {
  code: 'TH',
  name: 'Thailand',
  dbId: 4,
  sources: [
    {
      url: 'https://www.bot.or.th/en/financial-institutions/payment-systems/regulations.html',
      regulatorAcronym: 'BOT',
      regulatorDbId: 6,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.bot.or.th/en/financial-institutions/e-payment/nano-finance.html',
      regulatorAcronym: 'BOT',
      regulatorDbId: 6,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.bot.or.th/en/financial-institutions/commercial-banking/virtual-bank.html',
      regulatorAcronym: 'BOT',
      regulatorDbId: 6,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.bot.or.th/en/financial-institutions/e-payment/cross-border.html',
      regulatorAcronym: 'BOT',
      regulatorDbId: 6,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
    {
      url: 'https://www.sec.or.th/EN/pages/regulatory_framework_digital_asset.aspx',
      regulatorAcronym: 'SEC',
      regulatorDbId: 7,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.sec.or.th/EN/pages/regulatory_framework_asset_mgt.aspx',
      regulatorAcronym: 'SEC',
      regulatorDbId: 7,
      productVertical: 'wealth-management',
      productVerticalDbId: 6,
    },
  ],
}
