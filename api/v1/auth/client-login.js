import { supabase } from '../../_lib/supabase.js'
import { signToken } from '../../_lib/auth.js'
import { handleCors } from '../../_lib/cors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
  }

  const { data: client, error } = await supabase
    .from('clients')
    .select('id, name, email, password_hash, portfolio_code, status, kyc_status, initial, category')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error || !client) {
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
  }

  if (client.status === 'suspended' || client.status === 'inactive') {
    return res.status(403).json({ error: 'الحساب موقوف. تواصل بنا للمساعدة.' })
  }

  if (client.status === 'pending' || client.kyc_status === 'pending') {
    return res.status(403).json({ error: 'حسابك قيد المراجعة. سنتواصل معك قريباً.' })
  }

  const valid = await bcrypt.compare(password, client.password_hash)
  if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

  const token = signToken({
    id: client.id,
    email: client.email,
    name: client.name,
    role: 'client',
    portfolioCode: client.portfolio_code,
  })

  return res.json({
    token,
    user: {
      id: client.id,
      name: client.name,
      email: client.email,
      portfolioCode: client.portfolio_code,
      initial: client.initial,
      category: client.category,
    },
  })
}
