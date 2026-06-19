import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { mockTeam, roleLabels } from '../adminData'

const roleBadge: Record<string, { bg: string; color: string }> = {
  SUPER_ADMIN: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C' },
  ADMIN: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  ADVISOR: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  CONTENT_MANAGER: { bg: 'rgba(0,217,126,0.1)', color: '#00D97E' },
}

export default function Team() {
  const [showModal, setShowModal] = useState(false)
  const [viewMember, setViewMember] = useState<typeof mockTeam[0] | null>(null)

  const overview = [
    { icon: '👑', label: 'Super Admin', count: 1, color: '#C9A84C' },
    { icon: '🔵', label: 'مشرفون', count: 2, color: '#3B82F6' },
    { icon: '🟡', label: 'مستشارون', count: 2, color: '#F59E0B' },
    { icon: '🟢', label: 'محررو محتوى', count: 1, color: '#00D97E' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>إدارة الفريق</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>إجمالي {mockTeam.length} أعضاء في الفريق</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          <Plus size={16} /> إضافة عضو جديد
        </button>
      </div>

      {/* Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {overview.map((o, i) => (
          <div key={i} style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${o.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{o.icon}</div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginBottom: 4 }}>{o.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: o.color, fontFamily: 'monospace', lineHeight: 1 }}>{o.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Table */}
      <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['العضو', 'الدور', 'عدد العملاء', 'آخر نشاط', 'الحالة', ''].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', borderBottom: '1px solid #1A2E4A', background: '#060E1A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTeam.map(m => {
              const rb = roleBadge[m.role]
              return (
                <tr key={m.id} style={{ transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#C9A84C', border: '2px solid rgba(201,168,76,0.25)' }}>{m.name.charAt(0)}</div>
                        <div style={{ width: 9, height: 9, background: '#00D97E', border: '2px solid #0C1A2E', borderRadius: '50%', position: 'absolute', bottom: 0, left: 0 }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E2E8F4' }}>{m.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6B84A8' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                    <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, background: rb.bg, color: rb.color }}>{roleLabels[m.role]}</span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', color: '#E2E8F4', fontFamily: 'monospace' }}>{m.clients > 0 ? m.clients : '─'}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)', color: '#6B84A8', fontSize: '0.82rem' }}>{m.lastActive}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,217,126,0.1)', color: '#00D97E' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D97E' }} /> نشط
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewMember(m)} style={{ padding: '5px 12px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 6, color: '#C9A84C', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>عرض</button>
                      <button style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 6, color: '#6B84A8', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>تعديل</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Member Detail Modal */}
      {viewMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setViewMember(null)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 600, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>{viewMember.name}</span>
              <button onClick={() => setViewMember(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 0 }}>
              <div style={{ padding: 24, borderLeft: '1px solid #1A2E4A', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#C9A84C', border: '2px solid rgba(201,168,76,0.3)', marginBottom: 16 }}>{viewMember.name.charAt(0)}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 6, textAlign: 'center' }}>{viewMember.name}</div>
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, background: roleBadge[viewMember.role]?.bg, color: roleBadge[viewMember.role]?.color, marginBottom: 16 }}>{roleLabels[viewMember.role]}</span>
                <div style={{ fontSize: '0.75rem', color: '#6B84A8', textAlign: 'center', marginBottom: 8 }}>{viewMember.email}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B84A8' }}>منذ: {viewMember.joined}</div>
                <button style={{ marginTop: 16, width: '100%', padding: '8px', background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 8, color: '#FF4560', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إعادة تعيين كلمة المرور</button>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[['العملاء', viewMember.clients || '─'], ['آخر نشاط', viewMember.lastActive], ['الحالة', '🟢 نشط']].map(([k, v]) => (
                    <div key={k} style={{ background: '#060E1A', borderRadius: 10, border: '1px solid #1A2E4A', padding: 14, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#6B84A8', marginBottom: 6 }}>{k}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#C9A84C', fontFamily: 'monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#060E1A', borderRadius: 10, border: '1px solid #1A2E4A', padding: 16 }}>
                  <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginBottom: 12 }}>الصلاحيات</div>
                  {['عرض العملاء', 'تعديل المحافظ', 'إضافة العمليات', 'إدارة المحتوى', 'عرض التقارير'].map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.82rem', color: '#E2E8F4' }}>
                      <span style={{ color: '#00D97E' }}>✓</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>إضافة عضو جديد</span>
              <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['الاسم الكامل *', 'text', 'محمد أحمد'], ['البريد الإلكتروني *', 'email', 'name@company.com'], ['كلمة المرور المؤقتة *', 'password', '']].map(([label, type, placeholder]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>{label}</label>
                  <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>الدور *</label>
                <select style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", outline: 'none' }}>
                  {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إلغاء</button>
              <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>✅ إضافة العضو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
