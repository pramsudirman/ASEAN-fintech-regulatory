import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country') ?? ''
  const days    = Math.min(parseInt(searchParams.get('days')  ?? '30',  10), 365)
  const limit   = Math.min(parseInt(searchParams.get('limit') ?? '50',  10), 200)

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // Resolve country filter upfront — return empty if code is invalid
  let countryId: number | null = null
  if (country) {
    const { data } = await supabaseAdmin
      .from('countries')
      .select('id')
      .eq('code', country.toUpperCase())
      .maybeSingle()

    if (!data) {
      return NextResponse.json({ changes: [], total: 0 })
    }
    countryId = data.id
  }

  const query = supabaseAdmin
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

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Post-filter by country_id if specified (Supabase doesn't support deep WHERE on joined tables)
  const changes = countryId
    ? (data ?? []).filter(c => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const req = c.regulatory_requirements as any
        if (!req) return false
        const countryData = Array.isArray(req.countries) ? req.countries[0] : req.countries
        return countryData?.code === country.toUpperCase()
      })
    : (data ?? [])

  return NextResponse.json({ changes, total: changes.length })
}
