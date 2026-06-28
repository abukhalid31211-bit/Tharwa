const BASE = '/api/v1'

function getAdminToken(): string | null {
  return localStorage.getItem('admin_token')
}

function getClientToken(): string | null {
  return localStorage.getItem('client_token')
}

function authHeaders(useClientToken = false): Record<string, string> {
  const token = useClientToken ? getClientToken() : (getAdminToken() || getClientToken())
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options: RequestInit = {}, useClientToken = false): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(useClientToken),
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
  request<{ token: string; client: ClientUser }>('/auth/client-login', {
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
export const getClients = (params?: { search?: string; status?: string; limit?: number }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ clients: Client[]; total: number }>(`/clients${q}`)
}

export const getClient = (id: string) =>
  request<{ client: Client }>(`/clients?id=${id}`)

export const createClient = (data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>('/clients', { method: 'POST', body: JSON.stringify(data) })

export const updateClient = (id: string, data: Partial<Client> & { password?: string }) =>
  request<{ client: Client }>('/clients', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteClient = (id: string) =>
  request<{ success: boolean }>(`/clients?id=${id}`, { method: 'DELETE' })

// ─── Transactions ─────────────────────────────────────────────────────────────
export const getTransactions = (params?: { status?: string; type?: string; client_id?: string }) => {
  const q = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
  return request<{ transactions: Transaction[] }>(`/transactions${q ? '?' + q : ''}`)
}

export const createTransaction = (data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>('/transactions', { method: 'POST', body: JSON.stringify(data) })

export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  request<{ transaction: Transaction }>('/transactions', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deleteTransaction = (id: string) =>
  request<{ success: boolean }>(`/transactions?id=${id}`, { method: 'DELETE' })

// ─── Portfolios ───────────────────────────────────────────────────────────────
export const getPortfolios = (client_id?: string) => {
  const q = client_id ? `?client_id=${client_id}` : ''
  return request<{ portfolios: Portfolio[] }>(`/portfolios${q}`)
}

export const getPortfolio = (id: string) =>
  request<{ portfolio: Portfolio }>(`/portfolios?id=${id}`)

export const createPortfolio = (data: Partial<Portfolio> & { portfolio_data?: Record<string, unknown> }) =>
  request<{ portfolio: Portfolio }>('/portfolios', { method: 'POST', body: JSON.stringify(data) })

export const updatePortfolio = (id: string, data: Partial<Portfolio> & { portfolio_data?: Record<string, unknown> }) =>
  request<{ portfolio: Portfolio }>('/portfolios', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const deletePortfolio = (id: string) =>
  request<{ success: boolean }>(`/portfolios?id=${id}`, { method: 'DELETE' })

// ─── Client Portal ─────────────────────────────────────────────────────────────
export const getMyProfile = () =>
  request<{ client: ClientProfile }>('/client/profile', {}, true)

export const getMyPortfolio = () =>
  request<{ portfolio: Portfolio | null }>('/client/portfolio', {}, true)

export const getMyTransactions = (limit = 20) =>
  request<{ transactions: ClientTransaction[] }>(`/client/transactions?limit=${limit}`, {}, true)

// ─── Messages ─────────────────────────────────────────────────────────────────
export const submitContactMessage = (data: ContactMessageInput) =>
  request<{ success: boolean; id: number }>('/messages', { method: 'POST', body: JSON.stringify(data) })

export const getMessages = (status?: string) => {
  const q = status && status !== 'all' ? `?status=${status}` : ''
  return request<{ messages: ContactMessage[] }>(`/messages${q}`)
}

export const updateMessageStatus = (id: number, status: string) =>
  request<{ message: ContactMessage }>('/messages', { method: 'PATCH', body: JSON.stringify({ id, status }) })

export const deleteMessage = (id: number) =>
  request<{ success: boolean }>(`/messages?id=${id}`, { method: 'DELETE' })

// ─── Sub-Admins ───────────────────────────────────────────────────────────────
export const getSubAdmins = () =>
  request<{ subAdmins: SubAdmin[] }>('/sub-admins')

export const createSubAdmin = (data: { name: string; email: string; password: string; permissions?: string[] }) =>
  request<{ subAdmin: SubAdmin }>('/sub-admins', { method: 'POST', body: JSON.stringify(data) })

export const deleteSubAdmin = (id: string) =>
  request<{ success: boolean }>(`/sub-admins?id=${id}`, { method: 'DELETE' })

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () =>
  request<{ notifications: Notification[]; unread: number }>('/notifications')

export const markNotificationRead = (id: string) =>
  request<{ notification: Notification }>('/notifications', { method: 'PATCH', body: JSON.stringify({ id }) })

// ─── Overview / Dashboard KPIs ────────────────────────────────────────────────
export const getOverview = () =>
  request<{ kpis: OverviewKPIs; recentTransactions: Transaction[]; recentMessages: ContactMessage[] }>('/overview')

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser  { id: string; name: string; email: string; role: 'super' | 'sub'; permissions?: string[] }
export interface ClientUser { id: string; name: string; email: string; account_number?: string; status?: string; membership_level?: string; portfolio_code?: string }

export interface SettingRow { key: string; value: string; type: string; label: string }

export interface Client {
  id: string; name: string; email: string; phone?: string
  account_number?: string; status: string
  risk_profile?: string; notes?: string
  membership_level?: string; portfolio_code?: string; initial_investment?: string
  join_date?: string; created_at: string; updated_at?: string
  avatar_url?: string
}

export interface Transaction {
  id: string; client_id?: string; type: string; amount?: number; currency?: string
  reference?: string; status: string; notes?: string; created_at: string
  clients?: { name: string }
}

export interface ClientTransaction {
  id: string; type: string; amount?: number; currency?: string
  reference?: string; notes?: string; status: string; created_at: string
}

export interface Portfolio {
  id: string; client_id: string; name: string; type?: string
  initial_value?: number; current_value?: number
  currency?: string; notes?: string; created_at: string; updated_at?: string
  portfolio_data?: Record<string, unknown>
  clients?: { name: string; email: string; membership_level?: string }
}

export interface ClientProfile {
  id: string; name: string; email: string; phone?: string
  status?: string; account_number?: string; join_date?: string
  risk_profile?: string; membership_level?: string; portfolio_code?: string
  initial_investment?: string; avatar_url?: string
}

export interface ContactMessage {
  id: number; name: string; email: string; phone?: string; service?: string
  message: string; source: string; status: 'new' | 'read' | 'replied'; created_at: string
}

export interface ContactMessageInput {
  name: string; email: string; phone?: string; service?: string; message: string; source?: string
}

export interface SubAdmin {
  id: string; name: string; email: string; status: string; permissions?: string[]; created_at: string
}

export interface OverviewKPIs {
  totalClients: number; pendingClients: number; todayTransactions: number
  pendingTransactions: number; newMessages: number
}

export const updateSubAdmin = (id: string, data: { name?: string; email?: string; password?: string; permissions?: string[] }) =>
  request<{ subAdmin: SubAdmin }>('\/sub-admins', { method: 'PATCH', body: JSON.stringify({ id, ...data }) })

export const verifyAdminSession = () =>
  request<{ valid: boolean; user: { id: string; role: string } }>('\/auth\/verify')
