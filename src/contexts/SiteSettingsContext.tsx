import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSettings } from '../lib/api'

interface SiteSettings {
  site_name_ar:       string
  site_name_en:       string
  platform_name:      string
  company_email:      string
  company_phone:      string
  company_whatsapp:   string
  company_address_ar: string
  company_address_en: string
  company_location:   string
  footer_text_ar:     string
  footer_text_en:     string
  maintenance_mode:   string
  min_investment:     string
  mgmt_fee_pct:       string
  [key: string]:      string
}

const DEFAULTS: SiteSettings = {
  site_name_ar:       'ثروة كابيتال',
  site_name_en:       'Tharwah Capital',
  platform_name:      'Golden Horizon Investments',
  company_email:      'info@tharwahcapital.com',
  company_phone:      '+966 11 234 5678',
  company_whatsapp:   '+966501234567',
  company_address_ar: 'طريق الملك فهد، حي العليا، الرياض 12211',
  company_address_en: 'King Fahd Road, Al Olaya, Riyadh 12211',
  company_location:   'الرياض، المملكة العربية السعودية',
  footer_text_ar:     'جميع الحقوق محفوظة لثروة كابيتال',
  footer_text_en:     'All rights reserved Tharwah Capital',
  maintenance_mode:   'false',
  min_investment:     '10000',
  mgmt_fee_pct:       '1.5',
}

interface SiteSettingsCtx {
  settings: SiteSettings
  loading:  boolean
  reload:   () => void
}

const Ctx = createContext<SiteSettingsCtx>({
  settings: DEFAULTS,
  loading:  true,
  reload:   () => {},
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading,  setLoading]  = useState(true)

  const load = async () => {
    try {
      const { settings: remote } = await getSettings()
      setSettings({ ...DEFAULTS, ...remote })
    } catch {
      // Fall back to defaults silently — API may not be set up yet
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <Ctx.Provider value={{ settings, loading, reload: load }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSiteSettings() {
  return useContext(Ctx)
}
