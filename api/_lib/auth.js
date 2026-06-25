import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production'
const JWT_EXPIRES  = '8h'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function extractToken(req) {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

export function requireAdmin(req, res) {
  const token = extractToken(req)
  if (!token) {
    res.status(401).json({ error: 'Unauthorized — missing token' })
    return null
  }
  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized — invalid or expired token' })
    return null
  }
  return payload
}
