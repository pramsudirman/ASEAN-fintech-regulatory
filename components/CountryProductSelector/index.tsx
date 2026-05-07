'use client'

import { cn } from '@/lib/utils'

// ── Static data ────────────────────────────────────────────────────────────

export const COUNTRIES = [
  { code: 'SG', name: 'Singapore',   flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia',    flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia',   flag: '🇮🇩' },
  { code: 'TH', name: 'Thailand',    flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam',     flag: '🇻🇳' },
]

export const PRODUCTS = [
  { slug: 'digital-payments',  name: 'Digital Payments', icon: '💳' },
  { slug: 'bnpl',              name: 'BNPL',             icon: '🛒' },
  { slug: 'digital-lending',   name: 'Digital Lending',  icon: '🏦' },
  { slug: 'digital-banking',   name: 'Digital Banking',  icon: '🏛️' },
  { slug: 'remittance',        name: 'Remittance',       icon: '💸' },
  { slug: 'wealth-management', name: 'Wealth Mgmt',      icon: '📈' },
  { slug: 'crypto',            name: 'Crypto',           icon: '₿' },
  { slug: 'insurtech',         name: 'Insurtech',        icon: '🛡️' },
  { slug: 'open-banking',      name: 'Open Banking',     icon: '🔗' },
  { slug: 'regtech',           name: 'RegTech',          icon: '🔍' },
]

// ── Card ───────────────────────────────────────────────────────────────────

interface SelectCardProps {
  icon: string
  label: string
  sublabel?: string
  selected: boolean
  onToggle: () => void
}

function SelectCard({ icon, label, sublabel, selected, onToggle }: SelectCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-sm transition-colors',
        selected
          ? 'border-gray-900 bg-gray-50 font-medium'
          : 'border-gray-200 hover:border-gray-400 bg-white'
      )}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-xs font-medium leading-tight text-center">{label}</span>
      {sublabel && (
        <span className="text-[10px] text-gray-400 leading-tight">{sublabel}</span>
      )}
    </button>
  )
}

// ── Country Selector ───────────────────────────────────────────────────────

interface CountrySelectorProps {
  selected: string[]
  onChange: (codes: string[]) => void
}

export function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const toggle = (code: string) => {
    onChange(
      selected.includes(code)
        ? selected.filter(c => c !== code)
        : [...selected, code]
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Countries
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onChange(COUNTRIES.map(c => c.code))}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Select all
          </button>
          <button
            onClick={() => onChange([])}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {COUNTRIES.map(c => (
          <SelectCard
            key={c.code}
            icon={c.flag}
            label={c.code}
            sublabel={c.name}
            selected={selected.includes(c.code)}
            onToggle={() => toggle(c.code)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Product Selector ───────────────────────────────────────────────────────

interface ProductSelectorProps {
  selected: string[]
  onChange: (slugs: string[]) => void
}

export function ProductSelector({ selected, onChange }: ProductSelectorProps) {
  const toggle = (slug: string) => {
    onChange(
      selected.includes(slug)
        ? selected.filter(s => s !== slug)
        : [...selected, slug]
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Products
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onChange(PRODUCTS.map(p => p.slug))}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Select all
          </button>
          <button
            onClick={() => onChange([])}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {PRODUCTS.map(p => (
          <SelectCard
            key={p.slug}
            icon={p.icon}
            label={p.name}
            selected={selected.includes(p.slug)}
            onToggle={() => toggle(p.slug)}
          />
        ))}
      </div>
    </div>
  )
}
