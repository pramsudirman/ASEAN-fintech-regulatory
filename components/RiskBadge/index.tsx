import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/supabase'

const variants: Record<RiskLevel, string> = {
  HIGH:     'bg-red-50 text-red-600 border border-red-200',
  MODERATE: 'bg-amber-50 text-amber-600 border border-amber-200',
  LOW:      'bg-emerald-50 text-emerald-600 border border-emerald-200',
  UNKNOWN:  'bg-gray-50 text-gray-500 border border-gray-200',
}

const dots: Record<RiskLevel, string> = {
  HIGH: '●',
  MODERATE: '◐',
  LOW: '○',
  UNKNOWN: '·',
}

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variants[level],
        className
      )}
    >
      <span aria-hidden>{dots[level]}</span>
      {level}
    </span>
  )
}
