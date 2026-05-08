'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { DossierTable } from '@/components/DossierTable'
import { ExportButton } from '@/components/ExportButton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase-browser'
import type { RegulatoryRequirement } from '@/lib/supabase'

interface DossierResponse {
  generatedAt: string
  highRiskCount: number
  moderateRiskCount: number
  lowRiskCount: number
  requirements: RegulatoryRequirement[]
}

function DossierContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const countries = searchParams.get('countries')?.split(',').filter(Boolean) ?? []
  const products  = searchParams.get('products')?.split(',').filter(Boolean)  ?? []

  const [data, setData]         = useState<DossierResponse | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [hasUpdates, setHasUpdates] = useState(false)

  const countriesKey = countries.join(',')
  const productsKey  = products.join(',')

  const fetchDossier = useCallback(async () => {
    setLoading(true)
    setError(null)
    setHasUpdates(false)

    try {
      const params = new URLSearchParams({ countries: countriesKey, products: productsKey })
      const res = await fetch(`/api/dossier?${params}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed (${res.status})`)
      }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [countriesKey, productsKey])

  useEffect(() => {
    if (!countries.length || !products.length) {
      router.replace('/')
      return
    }
    fetchDossier()
  }, [fetchDossier]) // eslint-disable-line react-hooks/exhaustive-deps

  // Supabase Realtime — watch changelogs for any updates
  useEffect(() => {
    const channel = supabase
      .channel('requirement-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'changelogs' },
        () => setHasUpdates(true)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const subtitle = [
    countries.join(' · '),
    products.map(p => p.replace(/-/g, ' ')).join(' · '),
  ].filter(Boolean).join('  ·  ')

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Nav */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      {/* Realtime update banner */}
      {hasUpdates && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-700">New regulatory updates detected.</p>
          <Button variant="outline" size="sm" onClick={fetchDossier}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh dossier
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            Regulatory Dossier
          </h1>
          <p className="text-sm text-gray-400 capitalize">{subtitle}</p>
          {data && (
            <p className="text-xs text-gray-400 mt-0.5">
              Generated{' '}
              {new Date(data.generatedAt).toLocaleDateString('en-SG', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}
        </div>
        {data && <ExportButton countries={countries} products={products} />}
      </div>

      {/* Summary stats */}
      {data && !loading && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-red-600">{data.highRiskCount}</p>
            <p className="text-xs text-red-400 mt-0.5">High Risk</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-amber-600">{data.moderateRiskCount}</p>
            <p className="text-xs text-amber-400 mt-0.5">Moderate</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-emerald-600">{data.lowRiskCount}</p>
            <p className="text-xs text-emerald-400 mt-0.5">Low Risk</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchDossier}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data && data.requirements.length === 0 && (
        <div className="rounded-lg border border-gray-200 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No regulatory data found for your selection.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Data is populated by the daily scan. Try again after the first scan runs.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && data && data.requirements.length > 0 && (
        <DossierTable requirements={data.requirements} />
      )}

      {/* Footer disclaimer */}
      <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6">
        RegCompass ASEAN — Not Legal Advice. Data sourced from official regulator
        websites via automated scan. Verify with qualified legal counsel before
        making operational or investment decisions. Last scan: daily at 06:00 UTC.
      </p>
    </main>
  )
}

export default function DossierPage() {
  return (
    <Suspense>
      <DossierContent />
    </Suspense>
  )
}
