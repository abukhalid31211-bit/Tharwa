const BASE = '/api/v1'

function getToken(): string | null {
  return localStorage.getItem('admin_token') || localStorage.getItem('client_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  request<{ token: string; user: AdminUser }>('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const clientLogin = (email: string, password: string) =>
  request<{ token: string; user: ClientUser }>('/auth/client-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

// ─── Site Settings ────────────────────────────────────────────────────────────
export const getSettings = () =>
  request<{ settings: Record<string, string>; rows: SettingRow[] }>('/settings')

export const saveSettings = (settings: Record<string, string>) =>
  request<{ success: boolean }>('/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  })

// ─── Clients ──────────────────────────────────────────────────────────────────
export const getClients = () =>
  request<{ clients: Client[] }>('/clients')

export const getClient = (id: string) =>
  request<{ client: Client }>(`/clients?id=${id}`)

export const createClient = (data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>('/clients', { method: 'POST', body: JSON.stringify(data) })

export const updateClient = (id: string, data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>(`/clients?id=${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteClient = (id: string) =>
  request<{ success: boolean }>(`/clients?id=${id}`, { method: 'DELETE' })

// ─── Transactions ─────────────────────────────────────────────────────────────
export const getTransactions = (params?: { status?: string; type?: string; client_id?: string }) => {
  const q = new URLSearchParams(params as Record<string, string>).toString()
  return request<{ transactions: Transaction[] }>(`/transactions${q ? '?' + q : ''}`)
}

export const createTransaction = (data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>('/transactions', { method: 'POST', body: JSON.stringify(data) })

export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>(`/transactions?id=${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteTransaction = (id: string) =>
  request<{ success: boolean }>(`/transactions?id=${id}`, { method: 'DELETE' })

// ─── Portfolios ───────────────────────────────────────────────────────────────
export const getPortfolios = (client_id?: string) => {
  const q = client_id ? `?client_id=${client_id}` : ''
  return request<{ portfolios: Portfolio[] }>(`/portfolios${q}`)
}

export const createPortfolio = (data: Partial<Portfolio>) =>
  request<{ portfolio: Portfolio }>('/portfolios', { method: 'POST', body: JSON.stringify(data) })

export const updatePortfolio = (id: string, data: Partial<Portfolio>) =>
  request<{ portfolio: Portfolio }>(`/portfolios?id=${id}`, { method: 'PATCH', body: JSON.stringify(data) })

// ─── Messages ─────────────────────────────────────────────────────────────────
export const submitContactMessage = (data: ContactMessageInput) =>
  request<{ success: boolean; id: number }>('/messages', { method: 'POST', body: JSON.stringify(data) })

export const getMessages = (status?: string) => {
  const q = status && status !== 'all' ? `?status=${status}` : ''
  return request<{ messages: ContactMessage[] }>(`/messages${q}`)
}

export const updateMessageStatus = (id: number, status: string) =>
  request<{ message: ContactMessage }>(`/messages?id=${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })

export const deleteMessage = (id: number) =>
  request<{ success: boolean }>(`/messages?id=${id}`, { method: 'DELETE' })

// ─── Sub-Admins ───────────────────────────────────────────────────────────────
export const getSubAdmins = () =>
  request<{ subAdmins: SubAdmin[] }>('/sub-admins')

export const createSubAdmin = (data: { name: string; email: string; password: string }) =>
  request<{ subAdmin: SubAdmin }>('/sub-admins', { method: 'POST', body: JSON.stringify(data) })

export const deleteSubAdmin = (id: string) =>
  request<{ success: boolean }>(`/sub-admins?id=${id}`, { method: 'DELETE' })

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () =>
  request<{ notifications: Notification[]; unread: number }>('/notifications')

export const markNotificationRead = (id: string) =>
  request<{ notification: Notification }>(`/notifications?id=${id}`, { method: 'PATCH' })

// ─── Overview / Dashboard KPIs ────────────────────────────────────────────────
export const getOverview = () =>
  request<{ kpis: OverviewKPIs; recentTransactions: Transaction[]; recentMessages: ContactMessage[] }>('/overview')

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser  { id: string; name: string; email: string; role: 'super' | 'sub' }
export interface ClientUser { id: string; name: string; email: string; portfolioCode: string; initial: string; category: string }

export interface SettingRow { key: string; value: string; type: string; label: string }

export interface Client {
  id: string; name: string; email: string; phone?: string; nationality?: string
  id_number?: string; category: string; status: string; portfolio_code: string
  risk_profile?: string; investment_goal?: string; kyc_status: string
  notes?: string; initial?: string; created_at: string; updated_at: string
}

export interface Transaction {
  id: string; client_id?: string; portfolio_id?: string; client_name?: string
  type: string; asset: string; quantity?: number; price?: number; total?: number
  status: string; notes?: string; created_at: string
  clients?: { name: string; email: string; portfolio_code: string }
}

export interface Portfolio {
  id: string; client_id: string; name: string; type?: string
  total_value: number; initial_investment: number; profit_loss: number; profit_loss_pct: number
  currency: string; status: string; assets: unknown[]; notes?: string; created_at: string
}

export interface ContactMessage {
  id: number; name: string; email: string; phone?: string; service?: string
  message: string; source: string; status: 'new' | 'read' | 'replied'; created_at: string
}

export interface ContactMessageInput {
  name: string; email: string; phone?: string; service?: string; message: string; source?: string
}

export interface SubAdmin {
  id: string; name: string; email: string; status: string; created_at: string
}

export interface OverviewKPIs {
  totalClients: number; pendingClients: number; todayTransactions: number
  pendingTransactions: number; newMessages: number
}
