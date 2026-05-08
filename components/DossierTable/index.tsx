'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { RiskBadge } from '@/components/RiskBadge'
import { StalenessWarning } from '@/components/StalenessWarning'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import type { RegulatoryRequirement, RiskLevel } from '@/lib/supabase'

function resolveJoined<T>(val: T | T[] | undefined): T | undefined {
  return Array.isArray(val) ? val[0] : val
}

// ── Detail sheet ───────────────────────────────────────────────────────────

function RequirementDetail({ req }: { req: RegulatoryRequirement }) {
  const country   = resolveJoined(req.countries)
  const product   = resolveJoined(req.product_verticals)
  const regulator = resolveJoined(req.regulators)

  const deadlineDaysLeft = req.compliance_deadline
    ? Math.ceil(
        (new Date(req.compliance_deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div className="space-y-5 text-sm">
      <SheetHeader>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span className="font-mono uppercase">{regulator?.acronym}</span>
          <span>·</span>
          <span>{country?.flag_emoji} {country?.name}</span>
          <span>·</span>
          <span>{product?.name}</span>
        </div>
        <div className="flex items-start gap-2">
          <RiskBadge level={req.risk_level as RiskLevel} />
          <SheetTitle className="text-sm font-semibold leading-snug">{req.title}</SheetTitle>
        </div>
      </SheetHeader>

      {req.risk_reason && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Why this blocks you
          </p>
          <p className="text-sm text-gray-700">{req.risk_reason}</p>
        </div>
      )}

      <Separator />

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Summary
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{req.summary}</p>
      </div>

      {req.citation && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              Citation
            </p>
            <p className="font-mono text-xs text-gray-600">{req.citation}</p>
          </div>
        </>
      )}

      {req.source_url && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              Source
            </p>
            <a
              href={req.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-700 underline underline-offset-2 hover:text-gray-900"
            >
              {regulator?.website_url ?? req.source_url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </>
      )}

      {req.compliance_deadline && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              Compliance deadline
            </p>
            <p className={`text-sm font-medium ${deadlineDaysLeft !== null && deadlineDaysLeft < 90 ? 'text-red-600' : 'text-gray-700'}`}>
              {new Date(req.compliance_deadline).toLocaleDateString('en-SG', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
              {deadlineDaysLeft !== null && (
                <span className="ml-2 font-normal text-xs">
                  {deadlineDaysLeft > 0
                    ? `in ${deadlineDaysLeft} days`
                    : `${Math.abs(deadlineDaysLeft)} days ago`}
                </span>
              )}
            </p>
          </div>
        </>
      )}

      <Separator />

      <p className="text-xs text-gray-400">
        Last verified:{' '}
        {new Date(req.last_verified_at).toLocaleDateString('en-SG', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
        {req.is_stale && (
          <span className="ml-2 text-amber-500">⚠ Data may be stale — verify with regulator</span>
        )}
      </p>
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────────────

function DossierRow({
  req,
  onSelect,
}: {
  req: RegulatoryRequirement
  onSelect: (r: RegulatoryRequirement) => void
}) {
  const country = resolveJoined(req.countries)
  const product = resolveJoined(req.product_verticals)

  return (
    <tr
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSelect(req)}
    >
      <td className="py-4 pr-4 w-20 whitespace-nowrap text-sm">
        {country?.flag_emoji} {country?.code}
      </td>
      <td className="py-4 pr-4 w-32 text-sm text-gray-600">
        {product?.name}
      </td>
      <td className="py-4 pr-6 w-28">
        <RiskBadge level={req.risk_level as RiskLevel} />
      </td>
      <td className="py-4 pr-4">
        <p className="text-sm font-medium text-gray-800">{req.title}</p>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{req.summary}</p>
        {req.citation && (
          <p className="mt-0.5 font-mono text-xs text-gray-400">{req.citation}</p>
        )}
      </td>
      <td className="py-4 pl-4 w-28 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
          {req.is_stale && <StalenessWarning lastVerifiedAt={req.last_verified_at} />}
          {new Date(req.last_verified_at).toLocaleDateString('en-SG', {
            day: 'numeric', month: 'short', year: '2-digit',
          })}
        </div>
      </td>
    </tr>
  )
}

// ── Main table ─────────────────────────────────────────────────────────────

interface DossierTableProps {
  requirements: RegulatoryRequirement[]
}

const RISK_SECTIONS: Array<{
  level: RiskLevel
  label: string
  textClass: string
  borderClass: string
}> = [
  { level: 'HIGH',     label: 'HIGH RISK — Operational Blockers',  textClass: 'text-red-600',     borderClass: 'border-red-200'     },
  { level: 'MODERATE', label: 'MODERATE RISK — Compliance Burden', textClass: 'text-amber-600',   borderClass: 'border-amber-200'   },
  { level: 'LOW',      label: 'LOW / INFORMATIONAL',               textClass: 'text-emerald-600', borderClass: 'border-emerald-200' },
  { level: 'UNKNOWN',  label: 'UNKNOWN — Seek Legal Counsel',      textClass: 'text-gray-500',    borderClass: 'border-gray-200'    },
]

export function DossierTable({ requirements }: DossierTableProps) {
  const [selected, setSelected] = useState<RegulatoryRequirement | null>(null)

  const grouped = Object.fromEntries(
    RISK_SECTIONS.map(s => [s.level, requirements.filter(r => r.risk_level === s.level)])
  ) as Record<RiskLevel, RegulatoryRequirement[]>

  return (
    <>
      <div className="space-y-8">
        {RISK_SECTIONS.map(({ level, label, textClass, borderClass }) => {
          const reqs = grouped[level]
          if (!reqs.length) return null

          return (
            <div key={level}>
              <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${borderClass}`}>
                <span className={`text-xs font-medium uppercase tracking-widest ${textClass}`}>
                  {label}
                </span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full bg-current/10 ${textClass}`}>
                  {reqs.length}
                </span>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-gray-50">
                  {reqs.map(req => (
                    <DossierRow key={req.id} req={req} onSelect={setSelected} />
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent>
          {selected && <RequirementDetail req={selected} />}
        </SheetContent>
      </Sheet>
    </>
  )
}
