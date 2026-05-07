'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RiskBadge } from '@/components/RiskBadge'
import { COUNTRIES } from '@/components/CountryProductSelector'
import type { RiskLevel } from '@/lib/supabase'

interface ChangelogEntry {
  id: string
  change_type: string
  change_summary: string | null
  detected_at: string
  source_url: string | null
  regulatory_requirements: {
    id: string
    title: string
    risk_level: string
    countries: { code: string; name: string; flag_emoji: string } | { code: string; name: string; flag_emoji: string }[]
    product_verticals: { slug: string; name: string } | { slug: string; name: string }[]
  } | null
}

const CHANGE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  ADDED:        { label: 'Added',        color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  UPDATED:      { label: 'Updated',      color: 'text-blue-600 bg-blue-50 border-blue-200' },
  RISK_CHANGED: { label: 'Risk Changed', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  REMOVED:      { label: 'Removed',      color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function ChangelogPage() {
  const [changes, setChanges] = useState<ChangelogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCountry, setFilterCountry] = useState('')
  const [days, setDays] = useState(30)

  const fetchChanges = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ days: String(days) })
      if (filterCountry) params.set('country', filterCountry)
      const res = await fetch(`/api/changelog?${params}`)
      const data = await res.json()
      setChanges(data.changes ?? [])
    } catch {
      setChanges([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChanges() }, [filterCountry, days]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Regulatory Changelog
        </h1>
        <p className="text-sm text-gray-400">
          Regulatory changes detected by the daily scan across ASEAN-6.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8">
        <select
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All countries</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>

        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last 12 months</option>
        </select>
      </div>

      {/* Timeline */}
      {loading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && changes.length === 0 && (
        <div className="rounded-lg border border-gray-200 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No changes in this period.</p>
        </div>
      )}

      {!loading && changes.length > 0 && (
        <div className="space-y-4">
          {changes.map(change => {
            const req = change.regulatory_requirements
            const country = req
              ? Array.isArray(req.countries) ? req.countries[0] : req.countries
              : null
            const product = req
              ? Array.isArray(req.product_verticals) ? req.product_verticals[0] : req.product_verticals
              : null
            const typeInfo = CHANGE_TYPE_LABELS[change.change_type] ?? { label: change.change_type, color: 'text-gray-600 bg-gray-50 border-gray-200' }

            return (
              <div
                key={change.id}
                className="rounded-lg border border-gray-200 px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      {country && (
                        <span className="text-xs text-gray-500">
                          {country.flag_emoji} {country.code}
                        </span>
                      )}
                      {product && (
                        <span className="text-xs text-gray-400">{product.name}</span>
                      )}
                      {req && (
                        <RiskBadge level={req.risk_level as RiskLevel} />
                      )}
                    </div>
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {req?.title ?? '—'}
                    </p>
                    {change.change_summary && (
                      <p className="text-xs text-gray-500 mt-0.5">{change.change_summary}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(change.detected_at).toLocaleDateString('en-SG', {
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-10 text-xs text-gray-400 border-t border-gray-100 pt-6">
        Changes detected by automated scan of official regulator websites.
        Not legal advice.
      </p>
    </main>
  )
}
