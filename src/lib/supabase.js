import { createClient } from '@supabase/supabase-js'

let client = null
try {
  client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
} catch {
  // Falls through to `supabase === null` when env vars are missing/invalid
  // (e.g. .env not configured yet) so the UI can show a friendly error
  // instead of a blank crashed page.
}

export const supabase = client
