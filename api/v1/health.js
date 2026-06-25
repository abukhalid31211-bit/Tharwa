import { query } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  try {
    // Check database connectivity
    const dbHealthStart = Date.now()
    await query('SELECT 1', [])
    const dbHealthTime = Date.now() - dbHealthStart

    // Check required environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]

    const missingVars = requiredEnvVars.filter((v) => !process.env[v])

    const health = {
      status: missingVars.length === 0 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: 'up',
          responseTime: `${dbHealthTime}ms`,
        },
        environment: {
          status: missingVars.length === 0 ? 'configured' : 'misconfigured',
          missingVariables: missingVars,
        },
      },
    }

    if (missingVars.length > 0) {
      logger.warn('Health check: missing environment variables', { missing: missingVars })
    } else {
      logger.info('Health check passed')
    }

    return sendSuccess(res, health)
  } catch (e) {
    logger.error('Health check failed', e)
    return sendError(res, {
      ...e,
      statusCode: 503,
      code: 'SERVICE_UNAVAILABLE',
    })
  }
}
