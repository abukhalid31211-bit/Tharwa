import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  try {
    // Count admins
    const { count: adminCount, error: adminErr } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })

    // Count clients
    const { count: clientCount, error: clientErr } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    // Count settings
    const { count: settingsCount, error: settingsErr } = await supabase
      .from('site_settings')
      .select('*', { count: 'exact', head: true })

    // Check specific admin email exists
    const { data: adminRow, error: emailErr } = await supabase
      .from('admins')
      .select('email, role, status, password_hash')
      .eq('email', 'akramhaig120@gmail.com')
      .maybeSingle()

    res.json({
      tables: {
        admins:        { count: adminCount,   error: adminErr?.message   || null },
        clients:       { count: clientCount,  error: clientErr?.message  || null },
        site_settings: { count: settingsCount,error: settingsErr?.message || null },
      },
      targetAdmin: adminRow ? {
        found:       true,
        email:       adminRow.email,
        role:        adminRow.role,
        status:      adminRow.status,
        hashPrefix:  adminRow.password_hash?.substring(0, 7) || 'empty',
      } : {
        found: false,
        error: emailErr?.message || 'no row returned',
      },
      env: {
        hasSupabaseUrl:    !!process.env.SUPABASE_URL,
        hasServiceKey:     !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
        hasJwtSecret:      !!(process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET),
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
