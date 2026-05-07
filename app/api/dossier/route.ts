import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

const RISK_ORDER: Record<string, number> = {
  HIGH: 0,
  MODERATE: 1,
  LOW: 2,
  UNKNOWN: 3,
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const countries = searchParams.get('countries')?.split(',').filter(Boolean) ?? []
  const products = searchParams.get('products')?.split(',').filter(Boolean) ?? []

  if (!countries.length || !products.length) {
    return NextResponse.json(
      { error: 'countries and products query params required' },
      { status: 400 }
    )
  }

  // Resolve country IDs from codes
  const { data: countryRows, error: countryErr } = await supabaseAdmin
    .from('countries')
    .select('id, code, name, flag_emoji')
    .in('code', countries)

  if (countryErr || !countryRows?.length) {
    return NextResponse.json({ error: 'Invalid country codes' }, { status: 400 })
  }

  const countryIds = countryRows.map(c => c.id)

  // Resolve product vertical IDs from slugs
  const { data: productRows, error: productErr } = await supabaseAdmin
    .from('product_verticals')
    .select('id, slug, name, icon')
    .in('slug', products)

  if (productErr || !productRows?.length) {
    return NextResponse.json({ error: 'Invalid product slugs' }, { status: 400 })
  }

  const productIds = productRows.map(p => p.id)

  const { data, error } = await supabaseAdmin
    .from('regulatory_requirements')
    .select(`
      id, risk_level, risk_reason, title, summary,
      citation, source_url, compliance_deadline,
      last_verified_at, last_changed_at, is_stale,
      effective_date,
      countries:country_id (code, name, flag_emoji),
      regulators:regulator_id (name, acronym, website_url),
      product_verticals:product_vertical_id (slug, name, icon)
    `)
    .in('country_id', countryIds)
    .in('product_vertical_id', productIds)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sorted = (data ?? []).sort(
    (a, b) => RISK_ORDER[a.risk_level] - RISK_ORDER[b.risk_level]
  )

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    highRiskCount: sorted.filter(r => r.risk_level === 'HIGH').length,
    moderateRiskCount: sorted.filter(r => r.risk_level === 'MODERATE').length,
    lowRiskCount: sorted.filter(r => r.risk_level === 'LOW').length,
    requirements: sorted,
  })
}
