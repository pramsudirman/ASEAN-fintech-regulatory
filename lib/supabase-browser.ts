'use client'

import { createClient } from '@supabase/supabase-js'

// Browser client — NEXT_PUBLIC_ vars only, safe to import in client components
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
