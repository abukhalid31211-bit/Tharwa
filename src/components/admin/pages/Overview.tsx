import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { chartAUM, chartPortfolioAlloc, mockClients, mockTransactions } from '../adminData'

const s = {
  card: { background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, padding: 20 } as React.CSSProperties,
  label: { fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', letterSpacing: '0.5px' } as React.CSSProperties,
  value: { fontSize: '1.75rem', fontWeight: 800, color: '#E2E8F4', fontFamily: 'monospace', lineHeight: 1 } as React.CSSProperties,
  green: { color: '#00D97E' } as React.CSSProperties,
  gold: { color: '#C9A84C' } as React.CSSProperties,
  muted: { color: '#6B84A8' } as React.CSSProperties,
}

const kpis = [
  { label: 'إجمالي العملاء', value: '5,234', change: '+12 هذا الشهر', icon: '👥', positive: true },
  { label: 'الأصول المُدارة', value: '$2.4B', change: '▲ +3.2%', icon: '💰', positive: true },
  { label: 'متوسط العائد', value: '+18.3%', change: 'هذا الشهر', icon: '📈', positive: true },
  { label: 'رسائل غير مقروءة', value: '24', change: 'رسالة معلقة', icon: '💬', positive: false },
  { label: 'طلبات معلقة', value: '8', change: 'طلب جديد', icon: '📋', positive: false },
  { label: 'حالة النظام', value: '🟢', change: 'يعمل بشكل طبيعي', icon: '⚡', positive: true },
]

const activity = [
  { icon: '👤', text: 'تسجيل عميل جديد — محمد السالم', time: '10:45 ص' },
  { icon: '💸', text: 'صفقة شراء أرامكو — محمد الأحمد', time: '10:32 ص' },
  { icon: '💬', text: 'رسالة جديدة من خالد التميمي', time: '10:15 ص' },
  { icon: '📊', text: 'تقرير شهري أُرسل لـ 45 عميل', time: '09:50 ص' },
  { icon: '🔐', text: 'تسجيل دخول مشرف — خالد محمد', time: '09:30 ص' },
]

const alerts = [
  { color: '#FF4560', text: '3 طلبات تسجيل جديدة معلقة', action: 'مراجعة' },
  { color: '#F59E0B', text: 'تقرير منتهي الصلاحية — سارة العمري', action: 'تجديد' },
  { color: '#3B82F6', text: 'رسالة لم تُقرأ منذ 24 ساعة', action: 'رد' },
]

const quickActions = [
  { icon: '➕', label: 'إضافة عميل جديد' }, { icon: '💸', label: 'إضافة صفقة' },
  { icon: '📊', label: 'إنشاء تقرير' }, { icon: '📰', label: 'نشر خبر جديد' },
]

export default function Overview() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 4 }}>{greeting}، أحمد 👋</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8' }}>
            {now.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;|&nbsp; 🟢 النظام يعمل بشكل طبيعي
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...s.card, cursor: 'default', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={s.label}>{k.label}</span>
              <span style={{ fontSize: '1.2rem' }}>{k.icon}</span>
            </div>
            <div style={{ ...s.value, marginBottom: 6 }}>{k.value}</div>
            <div style={{ fontSize: '0.75rem', color: k.positive ? '#00D97E' : '#F59E0B', fontWeight: 600 }}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* AUM Chart */}
        <div style={{ ...s.card }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4' }}>نمو الأصول المُدارة (AUM)</div>
              <div style={{ fontSize: '0.8rem', color: '#6B84A8', marginTop: 2 }}>الإجمالي: $2.4B ▲ +$186M</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartAUM}>
              <defs>
                <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#6B84A8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B84A8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} formatter={(v: number) => [`$${v}M`, 'AUM']} />
              <Area type="monotone" dataKey="aum" stroke="#C9A84C" strokeWidth={2.5} fill="url(#aumGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Distribution */}
        <div style={{ ...s.card }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>توزيع المحافظ</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={chartPortfolioAlloc} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {chartPortfolioAlloc.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {chartPortfolioAlloc.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <span style={{ color: '#6B84A8' }}>{item.name}</span>
                </div>
                <span style={{ color: '#E2E8F4', fontWeight: 600 }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Latest Clients */}
        <div style={{ ...s.card }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>أحدث العملاء</div>
          {mockClients.slice(0, 5).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#C9A84C' }}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F4' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B84A8' }}>{c.country} {c.city}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#C9A84C', fontWeight: 600, fontFamily: 'monospace' }}>
                ${c.portfolio.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div style={{ ...s.card }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>النشاط الأخير</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 15, top: 0, bottom: 0, width: 1, background: '#1A2E4A' }} />
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111E33', border: '2px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, position: 'relative', zIndex: 2 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: '#E2E8F4' }}>{a.text}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B84A8', fontFamily: 'monospace', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ ...s.card }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>⚠️ تنبيهات تحتاج انتباهاً</div>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < alerts.length - 1 ? '1px solid rgba(26,46,74,0.5)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.85rem', color: '#E2E8F4' }}>{a.text}</div>
              <button style={{ padding: '4px 12px', background: 'transparent', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 6, color: '#C9A84C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap' }}>
                {a.action}
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...s.card }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>إجراءات سريعة</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map((qa, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 10, color: '#E2E8F4', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", textAlign: 'right', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E4A'; e.currentTarget.style.color = '#E2E8F4' }}>
                <span style={{ width: 32, height: 32, background: 'rgba(201,168,76,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{qa.icon}</span>
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
