import { query } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { verifyToken } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError, AuthenticationError } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method === 'GET') {
    try {
      const rows = await query('SELECT key, value, type, label FROM site_settings ORDER BY key')
      const settings = {}
      for (const row of rows) settings[row.key] = row.value
      logger.debug('Settings retrieved', { count: rows.length })
      return sendSuccess(res, { settings, rows })
    } catch (e) {
      return sendError(res, e, { endpoint: 'settings-get' })
    }
  }

  if (req.method === 'POST') {
    const decoded = verifyToken(req)
    if (!decoded) {
      logger.warn('Unauthorized settings update attempt')
      return sendError(res, new AuthenticationError('غير مصرح'))
    }

    const { settings } = req.body || {}
    if (!settings || typeof settings !== 'object') {
      return sendError(res, new ValidationError('settings object مطلوب'))
    }
    try {
      for (const [key, value] of Object.entries(settings)) {
        await query(
          `INSERT INTO site_settings (key, value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [key, String(value)]
        )
      }
      logger.info('Settings updated', { count: Object.keys(settings).length })
      return sendSuccess(res, { success: true, updated: Object.keys(settings).length })
    } catch (e) {
      return sendError(res, e, { endpoint: 'settings-post' })
    }
  }

  return sendError(res, new ValidationError('Method not allowed'))
}
