import { useState } from 'react'
import { Eye, EyeOff, Shield, Lock, Mail, AlertTriangle } from 'lucide-react'
import { adminLogin } from '../../lib/api'
import { saveAdminSession } from '../../lib/auth'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'

interface Props {
  onLogin: (role: 'super' | 'sub') => void
}

export default function AdminLogin({ onLogin }: Props) {
  const { settings } = useSiteSettings()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    setError('')
    setLoading(true)
    try {
      const { token, user } = await adminLogin(email.trim(), password)
      saveAdminSession(token, user)
      onLogin(user.role as 'super' | 'sub')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'بيانات الدخول غير صحيحة'
      setError(msg)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 5) {
        setLocked(true)
        setError('تم قفل الحساب بسبب محاولات متعددة. حاول مجدداً بعد 30 دقيقة.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', fontFamily: "'Cairo', sans-serif", direction: 'rtl',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24,
        padding: '48px 40px', width: 440, position: 'relative',
        boxShadow: '0 4px 32px rgba(14,165,233,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        animation: shake ? 'adminShake 0.5s ease' : undefined, zIndex: 10,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #C9A84C, #E8C96A, #C9A84C, transparent)', borderRadius: '24px 24px 0 0' }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.05))', border: '2px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🔰</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>لوحة تحكم المشرفين</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Admin Control Panel — {settings.site_name_ar}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>📧 البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@company.com" required
                style={{ width: '100%', padding: '12px 44px 12px 14px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, color: '#1E293B', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0EA5E9'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>🔒 كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '12px 44px 12px 44px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, color: '#1E293B', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0EA5E9'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#FF4560', fontSize: '0.82rem' }}>
              <AlertTriangle size={14} />{error}
            </div>
          )}

          <button type="submit" disabled={loading || locked}
            style={{ width: '100%', padding: 16, background: loading || locked ? 'rgba(14,165,233,0.3)' : 'linear-gradient(135deg, #0EA5E9, #38BDF8)', color: '#FFFFFF', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 800, fontFamily: "'Cairo', sans-serif", cursor: loading || locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {loading ? '⏳ جاري التحقق...' : '🔐 دخول للوحة التحكم'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'rgba(255,180,0,0.8)' }}>
          <Shield size={14} />هذه منطقة محظورة — الوصول غير المصرح به مُراقب
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
          نسيت كلمة المرور؟ تواصل مع المشرف الرئيسي
        </div>
      </div>

      <style>{`
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
