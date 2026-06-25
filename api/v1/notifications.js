import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { limit = 20 } = req.query
      const notifications = await query(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1', [Number(limit)]
      )
      const [{ count }] = await query('SELECT COUNT(*) FROM notifications WHERE is_read = false', [])
      logger.info('Notifications retrieved', { count: notifications.length, unreadCount: Number(count) })
      return sendSuccess(res, { notifications, unreadCount: Number(count) })
    }

    if (req.method === 'PATCH') {
      const { id, all } = req.body || {}
      if (all) {
        await query('UPDATE notifications SET is_read = true', [])
        logger.info('All notifications marked as read')
        return sendSuccess(res, { success: true, marked: 'all' })
      }
      if (!id) {
        return sendError(res, new ValidationError('معرف الإشعار مطلوب'))
      }
      const n = await queryOne(
        'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *', [id]
      )
      logger.info('Notification marked as read', { notificationId: id })
      return sendSuccess(res, { notification: n })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'notifications' })
  }
}
