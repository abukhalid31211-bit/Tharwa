export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    ok: true,
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwt: !!process.env.JWT_SECRET,
      nodeVersion: process.version,
    }
  })
}
