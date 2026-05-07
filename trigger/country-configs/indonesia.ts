import type { CountryConfig } from './types'

export const INDONESIA: CountryConfig = {
  code: 'ID',
  name: 'Indonesia',
  dbId: 3,
  sources: [
    {
      url: 'https://www.ojk.go.id/id/kanal/iknb/regulasi/fintech/Pages/Regulasi.aspx',
      regulatorAcronym: 'OJK',
      regulatorDbId: 4,
      productVertical: 'digital-lending',
      productVerticalDbId: 3,
    },
    {
      url: 'https://www.ojk.go.id/id/kanal/perbankan/regulasi/Pages/Regulasi.aspx',
      regulatorAcronym: 'OJK',
      regulatorDbId: 4,
      productVertical: 'digital-banking',
      productVerticalDbId: 4,
    },
    {
      url: 'https://www.ojk.go.id/id/kanal/pasar-modal/regulasi/Pages/Regulasi.aspx',
      regulatorAcronym: 'OJK',
      regulatorDbId: 4,
      productVertical: 'crypto',
      productVerticalDbId: 7,
    },
    {
      url: 'https://www.ojk.go.id/id/kanal/iknb/regulasi/asuransi/Pages/Regulasi.aspx',
      regulatorAcronym: 'OJK',
      regulatorDbId: 4,
      productVertical: 'insurtech',
      productVerticalDbId: 8,
    },
    {
      url: 'https://www.bi.go.id/id/sistem-pembayaran/regulasi/Pages/default.aspx',
      regulatorAcronym: 'BI',
      regulatorDbId: 5,
      productVertical: 'digital-payments',
      productVerticalDbId: 1,
    },
    {
      url: 'https://www.bi.go.id/id/sistem-pembayaran/regulasi/Pages/default.aspx',
      regulatorAcronym: 'BI',
      regulatorDbId: 5,
      productVertical: 'remittance',
      productVerticalDbId: 5,
    },
  ],
}
