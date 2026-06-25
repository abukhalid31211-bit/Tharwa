import { createClient } from '@supabase/supabase-js'
import logger from './logger.js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  const error = new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  logger.error('Supabase configuration failed', error)
  throw error
}

let supabase
try {
  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  logger.info('Supabase client initialized')
} catch (err) {
  logger.error('Failed to initialize Supabase client', err)
  throw err
}

export { supabase }
