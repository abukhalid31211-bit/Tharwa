import { useState } from 'react'
import { Search, Plus, Download, ChevronDown, X, Check } from 'lucide-react'
import { mockClients, statusLabels } from '../adminData'

const s = {
  card: { background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  th: { padding: '14px 16px', textAlign: 'right' as const, fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', letterSpacing: '0.5px', borderBottom: '1px solid #1A2E4A', background: '#060E1A', cursor: 'pointer', whiteSpace: 'nowrap' as const },
  td: { padding: '14px 16px', fontSize: '0.875rem', color: '#E2E8F4', borderBottom: '1px solid rgba(26,46,74,0.5)', verticalAlign: 'middle' as const },
}

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(0,217,126,0.1)', color: '#00D97E' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  frozen: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  inactive: { bg: 'rgba(255,69,96,0.1)', color: '#FF4560' },
}

type ModalClient = typeof mockClients[0] | null

export default function Clients() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [viewClient, setViewClient] = useState<ModalClient>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  const filtered = mockClients.filter(c => {
    const matchSearch = c.name.includes(search) || c.email.includes(search)
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const tabs = [
    { key: 'all', label: 'الكل', count: mockClients.length },
    { key: 'active', label: 'نشط', count: mockClients.filter(c => c.status === 'active').length },
    { key: 'pending', label: 'معلق', count: mockClients.filter(c => c.status === 'pending').length },
    { key: 'frozen', label: 'مجمد', count: mockClients.filter(c => c.status === 'frozen').length },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>إدارة العملاء</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>إجمالي {mockClients.length} عميل مسجل</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          <Plus size={16} /> إضافة عميل جديد
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...s.card, marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A2E4A', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '8px 14px', flex: 1, minWidth: 200 }}>
            <Search size={15} color="#6B84A8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم / البريد / الهاتف"
              style={{ background: 'none', border: 'none', outline: 'none', color: '#E2E8F4', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", width: '100%' }} />
          </div>
          {['الجنسية', 'المستشار', 'الفئة'].map(f => (
            <button key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
              {f} <ChevronDown size={13} />
            </button>
          ))}
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
            <Download size={14} /> تصدير
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, padding: '0 20px', borderBottom: '1px solid #1A2E4A' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{ padding: '12px 16px', background: 'none', border: 'none', color: filter === t.key ? '#C9A84C' : '#6B84A8', fontSize: '0.85rem', fontWeight: filter === t.key ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", borderBottom: filter === t.key ? '2px solid #C9A84C' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
              {t.label}
              <span style={{ background: filter === t.key ? 'rgba(201,168,76,0.2)' : 'rgba(107,132,168,0.15)', color: filter === t.key ? '#C9A84C' : '#6B84A8', borderRadius: 10, padding: '2px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C9A84C' }}>تم تحديد {selected.length}</span>
            {['تغيير الحالة', 'تعيين مستشار', 'تصدير'].map(a => (
              <button key={a} style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{a}</button>
            ))}
            <button style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(255,69,96,0.3)', color: '#FF4560', background: 'rgba(255,69,96,0.06)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>حذف</button>
            <button onClick={() => setSelected([])} style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#6B84A8', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 40 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(c => c.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} style={{ accentColor: '#C9A84C' }} />
                </th>
                {['الاسم', 'الدولة', 'المستشار', 'قيمة المحفظة', 'الفئة', 'الحالة', 'آخر نشاط', ''].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={s.td}>
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={e => setSelected(e.target.checked ? [...selected, c.id] : selected.filter(i => i !== c.id))} style={{ accentColor: '#C9A84C' }} />
                  </td>
                  <td style={s.td} onClick={() => setViewClient(c)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#C9A84C', flexShrink: 0 }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#E2E8F4' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6B84A8' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>{c.country}</td>
                  <td style={s.td}>{c.advisor}</td>
                  <td style={s.td}><span style={{ fontFamily: 'monospace', color: '#C9A84C', fontWeight: 600 }}>${c.portfolio.toLocaleString()}</span></td>
                  <td style={s.td}>
                    <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700, background: c.category === 'VIP' ? 'rgba(201,168,76,0.15)' : 'rgba(107,132,168,0.1)', color: c.category === 'VIP' ? '#C9A84C' : '#6B84A8' }}>
                      {c.category === 'VIP' ? '🌟 VIP' : c.category === 'premium' ? '⭐ مميز' : 'عادي'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: statusColors[c.status]?.bg, color: statusColors[c.status]?.color }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {statusLabels[c.status]}
                    </span>
                  </td>
                  <td style={s.td}><span style={{ fontSize: '0.78rem', color: '#6B84A8' }}>{c.lastActive}</span></td>
                  <td style={{ ...s.td, position: 'relative' }}>
                    <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                      style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⋮</button>
                    {openMenu === c.id && (
                      <div style={{ position: 'absolute', left: 0, top: '100%', background: '#111E33', border: '1px solid #1A2E4A', borderRadius: 10, minWidth: 160, zIndex: 100, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                        {['عرض التفاصيل', 'تعديل', 'إرسال رسالة', 'إنشاء تقرير', 'تغيير الحالة'].map(a => (
                          <div key={a} onClick={() => { if (a === 'عرض التفاصيل') setViewClient(c); setOpenMenu(null) }}
                            style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#E2E8F4', cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            {a}
                          </div>
                        ))}
                        <div style={{ height: 1, background: '#1A2E4A', margin: '4px 0' }} />
                        <div style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#FF4560', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,69,96,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          تجميد الحساب
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 680, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>إضافة عميل جديد</span>
              <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {/* Steps */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', gap: 0 }}>
              {['البيانات الشخصية', 'الوثائق', 'المحفظة', 'المراجعة'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${i === 0 ? '#C9A84C' : '#1A2E4A'}`, background: i === 0 ? '#C9A84C' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: i === 0 ? '#060E1A' : '#6B84A8', flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: '0.75rem', color: i === 0 ? '#C9A84C' : '#6B84A8', fontWeight: i === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{step}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: '#1A2E4A', margin: '0 8px' }} />}
                </div>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { label: 'الاسم الكامل *', placeholder: 'محمد أحمد العمري', type: 'text' },
                  { label: 'الجنسية *', placeholder: 'اختر الجنسية', type: 'select' },
                  { label: 'البريد الإلكتروني *', placeholder: 'email@domain.com', type: 'email' },
                  { label: 'رقم الهاتف *', placeholder: '+966 5x xxx xxxx', type: 'tel' },
                  { label: 'المدينة *', placeholder: 'الرياض', type: 'text' },
                  { label: 'فئة العميل *', placeholder: 'اختر الفئة', type: 'select' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = '#1A2E4A'} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>ملاحظات</label>
                  <textarea rows={3} placeholder="أي ملاحظات إضافية..."
                    style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إلغاء</button>
              <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>التالي ←</button>
            </div>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {viewClient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setViewClient(null)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 760, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,168,76,0.2)', border: '2px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#C9A84C' }}>{viewClient.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>{viewClient.name}</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700, background: statusColors[viewClient.status]?.bg, color: statusColors[viewClient.status]?.color }}>
                    {statusLabels[viewClient.status]}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewClient(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>
              <div style={{ padding: 24, borderLeft: '1px solid #1A2E4A' }}>
                {[
                  { icon: '📧', val: viewClient.email }, { icon: '📞', val: viewClient.phone },
                  { icon: '📍', val: `${viewClient.country} ${viewClient.city}` }, { icon: '👤', val: viewClient.advisor },
                  { icon: '📅', val: viewClient.joined }, { icon: '⏰', val: viewClient.lastActive },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: '0.82rem', color: '#6B84A8' }}>
                    <span>{item.icon}</span><span>{item.val}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['💬 راسله', '📊 تقرير جديد', '🔒 تجميد'].map(a => (
                    <button key={a} style={{ padding: '8px 12px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#C9A84C', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{a}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1A2E4A', marginBottom: 20 }}>
                  {['المحفظة', 'العمليات', 'التقارير', 'الرسائل'].map(t => (
                    <button key={t} style={{ padding: '10px 16px', background: 'none', border: 'none', color: t === 'المحفظة' ? '#C9A84C' : '#6B84A8', fontWeight: t === 'المحفظة' ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", borderBottom: t === 'المحفظة' ? '2px solid #C9A84C' : '2px solid transparent', fontSize: '0.875rem' }}>{t}</button>
                  ))}
                </div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C9A84C', fontFamily: 'monospace' }}>${viewClient.portfolio.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', color: '#00D97E', marginTop: 4 }}>▲ +18.7% هذا الشهر</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {[{ name: 'أرامكو', type: 'أسهم', value: 12400, change: 2.1 }, { name: 'BTC', type: 'رقمي', value: 33620, change: 3.4 }, { name: 'ذهب', type: 'معادن', value: 11700, change: 0.9 }].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#060E1A', borderRadius: 10, border: '1px solid #1A2E4A' }}>
                      <span style={{ fontSize: '0.875rem', color: '#E2E8F4', fontWeight: 600 }}>{a.name}</span>
                      <span style={{ fontSize: '0.78rem', color: '#6B84A8' }}>{a.type}</span>
                      <span style={{ fontFamily: 'monospace', color: '#C9A84C', fontWeight: 600 }}>${a.value.toLocaleString()}</span>
                      <span style={{ fontSize: '0.78rem', color: '#00D97E' }}>▲+{a.change}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
