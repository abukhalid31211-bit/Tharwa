import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError, AuthorizationError } from '../_lib/errors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return
  if (decoded.role !== 'super') {
    logger.warn('Unauthorized access to sub-admins endpoint', { adminId: decoded.id, role: decoded.role })
    return sendError(res, new AuthorizationError('صلاحيات المدير الرئيسي مطلوبة'))
  }

  try {
    if (req.method === 'GET') {
      const subs = await query(
        'SELECT id, name, email, status, created_at FROM sub_admins ORDER BY created_at DESC', []
      )
      logger.info('Sub-admins listed', { count: subs.length })
      return sendSuccess(res, { subAdmins: subs })
    }

    if (req.method === 'POST') {
      const { name, email, password } = req.body || {}
      if (!name || !email || !password) {
        return sendError(res, new ValidationError('جميع الحقول مطلوبة: name, email, password'))
      }
      if (password.length < 6) {
        return sendError(res, new ValidationError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'))
      }
      const existing = await queryOne('SELECT id FROM sub_admins WHERE email = $1', [email.toLowerCase()])
      if (existing) {
        logger.warn('Duplicate email for sub-admin', { email })
        return sendError(res, new ValidationError('البريد الإلكتروني مستخدم'))
      }
      const hash = await bcrypt.hash(password, 10)
      const sub = await queryOne(
        `INSERT INTO sub_admins (name, email, password_hash)
         VALUES ($1, $2, $3) RETURNING id, name, email, status, created_at`,
        [name.trim(), email.toLowerCase().trim(), hash]
      )
      logger.info('Sub-admin created', { subAdminId: sub.id, email })
      return sendSuccess(res, { subAdmin: sub }, 201)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return sendError(res, new ValidationError('معرف المدير المساعد مطلوب'))
      }
      await query('DELETE FROM sub_admins WHERE id = $1', [id])
      logger.info('Sub-admin deleted', { subAdminId: id })
      return sendSuccess(res, { success: true })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'sub-admins' })
  }
}
