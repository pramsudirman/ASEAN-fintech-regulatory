import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')    // optional: 'SG'
  const days = parseInt(searchParams.get('days') ?? '30', 10)
  const limit = parseInt(searchParams.get('limit') ?? '50', 10)

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  let query = supabaseAdmin
    .from('changelogs')
    .select(`
      id, change_type, old_value, new_value, change_summary,
      detected_at, source_url,
      regulatory_requirements:requirement_id (
        id, title, risk_level,
        countries:country_id (code, name, flag_emoji),
        product_verticals:product_vertical_id (slug, name)
      )
    `)
    .gte('detected_at', since)
    .order('detected_at', { ascending: false })
    .limit(limit)

  // Filter by country code if provided
  if (country) {
    const { data: countryRow } = await supabaseAdmin
      .from('countries')
      .select('id')
      .eq('code', country)
      .maybeSingle()

    if (countryRow) {
      // Filter via the joined requirement's country
      // Supabase doesn't support deep filter directly — post-filter
      const { data, error } = await query
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (data ?? []).filter((c: any) => {
        const req = c.regulatory_requirements
        if (!req) return false
        const countryData = Array.isArray(req.countries) ? req.countries[0] : req.countries
        return countryData?.code === country
      })

      return NextResponse.json({ changes: filtered, total: filtered.length })
    }
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ changes: data ?? [], total: data?.length ?? 0 })
}
