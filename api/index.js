import health from './v1/health.js'
  import adminLogin from './v1/auth/admin-login.js'
  import clientLogin from './v1/auth/client-login.js'
  import clients from './v1/clients.js'
  import transactions from './v1/transactions.js'
  import portfolios from './v1/portfolios.js'
  import settings from './v1/settings.js'
  import messages from './v1/messages.js'
  import subAdmins from './v1/sub-admins.js'
  import notifications from './v1/notifications.js'
  import overview from './v1/overview.js'
  import clientProfile from './v1/client/profile.js'
  import clientPortfolio from './v1/client/portfolio.js'
  import clientTransactions from './v1/client/transactions.js'

  const routes = {
    '/api/v1/health':              health,
    '/api/v1/auth/admin-login':    adminLogin,
    '/api/v1/auth/client-login':   clientLogin,
    '/api/v1/clients':             clients,
    '/api/v1/transactions':        transactions,
    '/api/v1/portfolios':          portfolios,
    '/api/v1/settings':            settings,
    '/api/v1/messages':            messages,
    '/api/v1/sub-admins':          subAdmins,
    '/api/v1/notifications':       notifications,
    '/api/v1/overview':            overview,
    '/api/v1/client/profile':      clientProfile,
    '/api/v1/client/portfolio':    clientPortfolio,
    '/api/v1/client/transactions': clientTransactions,
  }

  export default async function handler(req, res) {
    const path = (req.url || '').split('?')[0].replace(/\/$/, '')
    const routeHandler = routes[path]
    if (routeHandler) return routeHandler(req, res)
    return res.status(404).json({ error: 'Route not found' })
  }
  