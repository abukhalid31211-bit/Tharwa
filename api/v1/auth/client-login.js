import { queryOne } from '../../_lib/db.js'
import { signToken } from '../../_lib/auth.js'
import { handleCors } from '../../_lib/cors.js'
import logger from '../../_lib/logger.js'
import { sendError, sendSuccess, ValidationError } from '../../_lib/errors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) {
    return sendError(res, new ValidationError('البريد الإلكتروني وكلمة المرور مطلوبان'))
  }

  try {
    logger.info('Client login attempt', { email })

    const client = await queryOne(
      `SELECT id, name, email, password_hash, status, phone, avatar_url,
              account_number, join_date, risk_profile
       FROM clients WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    if (!client) {
      logger.warn('Failed login - client not found', { email })
      return sendError(res, new ValidationError('بيانات الدخول غير صحيحة'))
    }
    if (client.status !== 'active') {
      logger.warn('Failed login - account inactive', { email, status: client.status })
      return sendError(res, new ValidationError('الحساب موقوف. تواصل مع المدير.'))
    }

    const valid = await bcrypt.compare(password, client.password_hash)
    if (!valid) {
      logger.warn('Failed login - invalid password', { email })
      return sendError(res, new ValidationError('بيانات الدخول غير صحيحة'))
    }

    const token = signToken({ id: client.id, email: client.email, name: client.name, role: 'client' })
    const { password_hash, ...safeClient } = client
    logger.info('Successful client login', { email })
    return sendSuccess(res, { token, client: safeClient })
  } catch (e) {
    return sendError(res, e, { endpoint: 'client-login' })
  }
}
