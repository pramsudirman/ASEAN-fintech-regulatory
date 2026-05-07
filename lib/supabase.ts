import { createClient } from '@supabase/supabase-js'

// Browser/server client — uses anon key, subject to RLS
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-only admin client — uses service role key, bypasses RLS
// Only import in API routes / Trigger.dev tasks, never in client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// ── Types ──────────────────────────────────────────────────────────────────

export type RiskLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN'
export type ChangeType = 'ADDED' | 'UPDATED' | 'RISK_CHANGED' | 'REMOVED'
export type ScanStatus = 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface Country {
  id: number
  code: string
  name: string
  flag_emoji: string | null
}

export interface Regulator {
  id: number
  country_id: number
  name: string
  acronym: string
  website_url: string
}

export interface ProductVertical {
  id: number
  slug: string
  name: string
  description: string | null
  icon: string | null
}

export interface RegulatoryRequirement {
  id: string
  country_id: number
  product_vertical_id: number
  regulator_id: number
  risk_level: RiskLevel
  risk_reason: string | null
  title: string
  summary: string
  citation: string | null
  source_url: string | null
  effective_date: string | null
  compliance_deadline: string | null
  last_verified_at: string
  last_changed_at: string | null
  is_stale: boolean
  created_at: string
  updated_at: string
  // Joined fields
  countries?: Pick<Country, 'code' | 'name' | 'flag_emoji'>
  regulators?: Pick<Regulator, 'name' | 'acronym' | 'website_url'>
  product_verticals?: Pick<ProductVertical, 'slug' | 'name' | 'icon'>
}

export interface Changelog {
  id: string
  requirement_id: string
  change_type: ChangeType
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  change_summary: string | null
  detected_at: string
  source_url: string | null
}
