import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  // GET — public, no auth needed (frontend reads site settings)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value, type, label')
      .order('key')

    if (error) return res.status(500).json({ error: error.message })

    // Convert to a simple key:value map for easy frontend consumption
    const map = {}
    for (const row of data || []) {
      map[row.key] = row.value
    }
    return res.json({ settings: map, rows: data })
  }

  // POST — admin only, updates one or many settings
  // Expects: { settings: { key: value, ... } }
  if (req.method === 'POST') {
    const { settings } = req.body || {}
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'settings object required' })
    }

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' })

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true, updated: upserts.length })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
