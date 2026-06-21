export const KEYS = {
  lang: 'tharwah_lang',
  privacyPolicy: 'tharwah_privacy_policy',
  clientsOverride: 'tharwah_live_clients',
  transactionsOverride: 'tharwah_live_transactions',
  portfoliosOverride: 'tharwah_live_portfolios',
  clientAuth: 'tharwah_client_auth',
  adminAnnouncements: 'tharwah_admin_announcements',
}

export function getLang(): 'ar' | 'en' {
  return (localStorage.getItem(KEYS.lang) as 'ar' | 'en') || 'ar'
}
export function setLang(lang: 'ar' | 'en') {
  localStorage.setItem(KEYS.lang, lang)
}

export function getPrivacyPolicy(): string {
  return localStorage.getItem(KEYS.privacyPolicy) || ''
}
export function setPrivacyPolicy(text: string) {
  localStorage.setItem(KEYS.privacyPolicy, text)
}

export function getLiveClients<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.clientsOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLiveClients<T>(clients: T[]) {
  localStorage.setItem(KEYS.clientsOverride, JSON.stringify(clients))
}

export function getLiveTransactions<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.transactionsOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLiveTransactions<T>(txs: T[]) {
  localStorage.setItem(KEYS.transactionsOverride, JSON.stringify(txs))
}

export function getLivePortfolios<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.portfoliosOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLivePortfolios<T>(portfolios: T[]) {
  localStorage.setItem(KEYS.portfoliosOverride, JSON.stringify(portfolios))
}

export function getAnnouncements(): { id: number; text: string; date: string; clientId?: number }[] {
  try {
    const raw = localStorage.getItem(KEYS.adminAnnouncements)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function addAnnouncement(text: string, clientId?: number) {
  const current = getAnnouncements()
  const entry = { id: Date.now(), text, date: new Date().toLocaleDateString('ar-SA'), clientId }
  localStorage.setItem(KEYS.adminAnnouncements, JSON.stringify([entry, ...current].slice(0, 50)))
}
