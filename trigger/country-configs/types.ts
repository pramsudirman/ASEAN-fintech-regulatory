export interface CountrySource {
  url: string
  regulatorAcronym: string
  regulatorDbId: number
  productVertical: string
  productVerticalDbId: number
}

export interface CountryConfig {
  code: string
  name: string
  dbId: number
  sources: CountrySource[]
}
