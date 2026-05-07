'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CountrySelector, ProductSelector } from '@/components/CountryProductSelector'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [countries, setCountries] = useState<string[]>([])
  const [products, setProducts]   = useState<string[]>([])

  const combos = countries.length * products.length
  const canGenerate = countries.length > 0 && products.length > 0

  const generate = () => {
    const params = new URLSearchParams({
      countries: countries.join(','),
      products:  products.join(','),
    })
    router.push(`/dossier?${params.toString()}`)
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Logo / brand */}
      <div className="mb-12">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight">RegCompass</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            ASEAN
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Select countries and products
        </h1>
        <p className="text-sm text-gray-500">
          Generate a regulatory dossier for your ASEAN market expansion.
        </p>
      </div>

      {/* Selectors */}
      <div className="space-y-8 mb-12">
        <CountrySelector selected={countries} onChange={setCountries} />
        <ProductSelector selected={products} onChange={setProducts} />
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full"
        disabled={!canGenerate}
        onClick={generate}
      >
        {canGenerate ? (
          <>
            Generate Dossier
            <span className="ml-1 text-xs font-normal opacity-70">
              {combos} combination{combos !== 1 ? 's' : ''}
            </span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </>
        ) : (
          'Select at least one country and one product'
        )}
      </Button>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-gray-400 text-center">
        Not legal advice. Always verify with qualified legal counsel before making
        operational decisions.
      </p>
    </main>
  )
}
