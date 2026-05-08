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
  const products  = searchParams.get('products')?.split(',').filter(Boolean)  ?? []

  if (!countries.length || !products.length) {
    return NextResponse.json(
      { error: 'countries and products query params required' },
      { status: 400 }
    )
  }

  const [{ data: countryRows, error: countryErr }, { data: productRows, error: productErr }] =
    await Promise.all([
      supabaseAdmin.from('countries').select('id, code, name, flag_emoji').in('code', countries),
      supabaseAdmin.from('product_verticals').select('id, slug, name, icon').in('slug', products),
    ])

  if (countryErr || !countryRows?.length) {
    return NextResponse.json({ error: 'Invalid country codes' }, { status: 400 })
  }
  if (productErr || !productRows?.length) {
    return NextResponse.json({ error: 'Invalid product slugs' }, { status: 400 })
  }

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
    .in('country_id', countryRows.map(c => c.id))
    .in('product_vertical_id', productRows.map(p => p.id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sorted = (data ?? []).sort(
    (a, b) => RISK_ORDER[a.risk_level] - RISK_ORDER[b.risk_level]
  )

  const counts = sorted.reduce(
    (acc, r) => {
      if (r.risk_level === 'HIGH') acc.high++
      else if (r.risk_level === 'MODERATE') acc.moderate++
      else if (r.risk_level === 'LOW') acc.low++
      return acc
    },
    { high: 0, moderate: 0, low: 0 }
  )

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    highRiskCount: counts.high,
    moderateRiskCount: counts.moderate,
    lowRiskCount: counts.low,
    requirements: sorted,
  })
}
