import { queryOne, query } from '../../_lib/db.js'
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
    logger.info('Admin login attempt', { email })

    // Check admins table
    let admin = await queryOne(
      'SELECT id, name, email, password_hash, role, status FROM admins WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (!admin) {
      // Check sub_admins
      const sub = await queryOne(
        'SELECT id, name, email, password_hash, status FROM sub_admins WHERE email = $1',
        [email.toLowerCase().trim()]
      )
      if (!sub) {
        logger.warn('Failed login - user not found', { email })
        return sendError(res, new ValidationError('بيانات الدخول غير صحيحة'))
      }
      if (sub.status !== 'active') {
        logger.warn('Failed login - account inactive', { email, account_type: 'sub_admin' })
        return sendError(res, new ValidationError('الحساب موقوف'))
      }
      const valid = await bcrypt.compare(password, sub.password_hash)
      if (!valid) {
        logger.warn('Failed login - invalid password', { email, account_type: 'sub_admin' })
        return sendError(res, new ValidationError('بيانات الدخول غير صحيحة'))
      }
      const token = signToken({ id: sub.id, email: sub.email, name: sub.name, role: 'sub' })
      logger.info('Successful login', { email, account_type: 'sub_admin' })
      return sendSuccess(res, { token, admin: { id: sub.id, name: sub.name, email: sub.email, role: 'sub' } })
    }

    if (admin.status !== 'active') {
      logger.warn('Failed login - account inactive', { email, account_type: 'admin' })
      return sendError(res, new ValidationError('الحساب موقوف'))
    }
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      logger.warn('Failed login - invalid password', { email, account_type: 'admin' })
      return sendError(res, new ValidationError('بيانات الدخول غير صحيحة'))
    }

    try {
      await query(
        `INSERT INTO audit_logs (actor_id, actor_type, actor_email, action, details)
         VALUES ($1, 'admin', $2, 'admin_login', $3)`,
        [admin.id, admin.email, JSON.stringify({ ip: req.headers['x-forwarded-for'] || 'unknown' })]
      )
    } catch (auditErr) {
      logger.error('Failed to log audit trail', auditErr, { adminId: admin.id })
      // Don't fail the login if audit logging fails
    }

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role })
    logger.info('Successful login', { email, account_type: 'admin' })
    return sendSuccess(res, { token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (e) {
    return sendError(res, e, { endpoint: 'admin-login' })
  }
}
