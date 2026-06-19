import { mockLogs } from '../adminData'

const sessions = [
  { device: '💻', name: 'Chrome — Windows 11', ip: '197.48.12.55', location: 'الرياض، SA', time: 'الآن', current: true },
  { device: '📱', name: 'Safari — iPhone 15', ip: '197.48.12.60', location: 'الرياض، SA', time: 'منذ 2 ساعة', current: false },
  { device: '💻', name: 'Firefox — macOS', ip: '197.48.12.72', location: 'جدة، SA', time: 'أمس 18:30', current: false },
]

export default function Security() {
  const summaryCards = [
    { label: 'محاولات فاشلة اليوم', value: '3', icon: '🔴', type: 'alert' },
    { label: 'جلسات نشطة الآن', value: '8', icon: '🟢', type: 'safe' },
    { label: 'IPs مشبوهة', value: '1', icon: '⚠️', type: 'warning' },
    { label: 'حالة النظام', value: '🟢 آمن', icon: '🛡️', type: 'safe' },
  ]

  const colorMap = { alert: { bg: 'rgba(255,69,96,0.06)', border: 'rgba(255,69,96,0.2)', color: '#FF4560' }, warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', color: '#F59E0B' }, safe: { bg: '#0C1A2E', border: '#1A2E4A', color: '#00D97E' } }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>السجلات والأمان</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>مراقبة النشاط والأمان</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem' }}>
          📥 تصدير السجلات
        </button>
      </div>

      {/* Security Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summaryCards.map((c, i) => {
          const cm = colorMap[c.type as keyof typeof colorMap]
          return (
            <div key={i} style={{ background: cm.bg, border: `1px solid ${cm.border}`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.type === 'alert' ? '#FF4560' : c.type === 'warning' ? '#F59E0B' : '#00D97E', fontFamily: 'monospace' }}>
                {typeof c.value === 'string' && c.value.includes('🟢') ? c.value : c.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Suspicious IP Alert */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,69,96,0.06)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 10, marginBottom: 24 }}>
        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.875rem', color: '#FF4560', fontWeight: 600 }}>IP مشبوه: 45.227.115.8</div>
          <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginTop: 2 }}>3 محاولات دخول فاشلة — آخرها 09:15 ص</div>
        </div>
        <button style={{ padding: '7px 16px', background: 'rgba(255,69,96,0.15)', border: '1px solid rgba(255,69,96,0.3)', borderRadius: 8, color: '#FF4560', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
          حظر IP
        </button>
        <button style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          تجاهل
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1A2E4A', marginBottom: 20 }}>
        {['سجل الدخول', 'سجل الأحداث', 'الجلسات النشطة', 'IPs المحظورة'].map((t, i) => (
          <button key={t} style={{ padding: '10px 18px', background: 'none', border: 'none', color: i === 0 ? '#C9A84C' : '#6B84A8', fontWeight: i === 0 ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem', borderBottom: i === 0 ? '2px solid #C9A84C' : '2px solid transparent' }}>{t}</button>
        ))}
      </div>

      {/* Logs Table */}
      <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['الوقت', 'المستخدم', 'الحدث', 'IP', 'الحالة'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', borderBottom: '1px solid #1A2E4A', background: '#060E1A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockLogs.map(log => (
              <tr key={log.id} style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', fontFamily: 'monospace', fontSize: '0.78rem', color: '#6B84A8' }}>{log.time}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', fontSize: '0.875rem', color: '#E2E8F4', fontWeight: 500 }}>{log.user}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', fontSize: '0.82rem', color: '#6B84A8' }}>{log.event}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', fontFamily: 'monospace', fontSize: '0.78rem', color: log.ip.startsWith('45') ? '#FF4560' : '#6B84A8' }}>{log.ip}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 600, color: log.status === 'success' ? '#00D97E' : '#FF4560' }}>
                    {log.status === 'success' ? '✅ نجح' : '❌ فشل'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Sessions */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>الجلسات النشطة</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 10 }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.device}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E2E8F4' }}>{s.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B84A8', fontFamily: 'monospace', marginTop: 2 }}>{s.ip} — {s.location} — {s.time}</div>
              </div>
              {s.current ? (
                <span style={{ padding: '4px 10px', background: 'rgba(0,217,126,0.1)', border: '1px solid rgba(0,217,126,0.2)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, color: '#00D97E' }}>الجلسة الحالية</span>
              ) : (
                <button style={{ padding: '6px 14px', background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 8, color: '#FF4560', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إنهاء الجلسة</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
