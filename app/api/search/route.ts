import { nim, NIM_MODELS } from '@/lib/nim'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? ''
  const limit = parseInt(new URL(req.url).searchParams.get('limit') ?? '10', 10)

  if (!q) {
    return NextResponse.json({ error: 'q param required' }, { status: 400 })
  }

  // Embed query using same model as stored vectors
  let queryEmbedding: number[]
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embRes = await nim.embeddings.create({
      model: NIM_MODELS.embedding,
      input: q,
      input_type: 'query',
    } as any)
    queryEmbedding = embRes.data[0].embedding
  } catch (err) {
    return NextResponse.json(
      { error: 'Embedding generation failed', detail: String(err) },
      { status: 500 }
    )
  }

  const { data, error } = await supabaseAdmin.rpc('search_requirements', {
    query_embedding: queryEmbedding,
    match_count: Math.min(limit, 20),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ query: q, results: data ?? [] })
}
