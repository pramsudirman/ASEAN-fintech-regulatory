import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// Server-only admin client — never import in 'use client' components
// Placeholder fallbacks prevent build-time errors when env vars are absent;
// real values are always present at runtime on Vercel/Trigger.dev.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY ?? 'placeholder-key',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { realtime: { transport: ws as any } }
)
