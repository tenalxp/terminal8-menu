import { supabase } from './supabase'

export async function fetchLogoUrl() {
  if (!supabase) return null
  const { data, error } = await supabase.from('app_settings').select('logo_url').eq('id', 1).single()
  if (error) return null
  return data?.logo_url ?? null
}
