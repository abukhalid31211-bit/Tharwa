import { useState } from 'react'
import { Plus, Eye, Edit, Trash2, Bold, Italic, Underline, Link, Image, List } from 'lucide-react'
import { mockArticles } from '../adminData'

export default function Content() {
  const [tab, setTab] = useState('articles')
  const [showEditor, setShowEditor] = useState(false)
  const [editorTitle, setEditorTitle] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockArticles.filter(a => statusFilter === 'all' || a.status === statusFilter)

  const statusBadge = (status: string) => ({
    published: { bg: 'rgba(0,217,126,0.1)', color: '#00D97E', label: '🟢 منشور' },
    draft: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: '🟡 مسودة' },
  }[status] || { bg: '', color: '', label: status })

  if (showEditor) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setShowEditor(false)} style={{ width: 36, height: 36, background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', color: '#6B84A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>←</button>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#E2E8F4' }}>محرر المقالات</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>مسودة</button>
            <button style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>🌐 نشر</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          {/* Editor */}
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 12, borderBottom: '1px solid #1A2E4A', background: '#060E1A' }}>
              {[
                [<Bold key="b" size={14} />, 'عريض'], [<Italic key="i" size={14} />, 'مائل'], [<Underline key="u" size={14} />, 'تسطير'],
                ['H1', 'رأس 1'], ['H2', 'رأس 2'], [<List key="l" size={14} />, 'قائمة'],
                [<Link key="lk" size={14} />, 'رابط'], [<Image key="im" size={14} />, 'صورة'],
              ].map(([icon, title], i) => (
                <button key={i} title={title as string} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: 'transparent', color: '#6B84A8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: typeof icon === 'string' ? '0.75rem' : undefined, fontWeight: 700, transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#111E33', e.currentTarget.style.color = '#E2E8F4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#6B84A8')}>
                  {icon}
                </button>
              ))}
            </div>

            {/* Title */}
            <input value={editorTitle} onChange={e => setEditorTitle(e.target.value)} placeholder="عنوان المقال..."
              style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', borderBottom: '1px solid #1A2E4A', outline: 'none', fontSize: '1.4rem', fontWeight: 700, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", direction: 'rtl', boxSizing: 'border-box' }} />
            <input placeholder="الوصف التعريفي (Meta Description)..."
              style={{ width: '100%', padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: '1px solid #1A2E4A', outline: 'none', fontSize: '0.875rem', color: '#6B84A8', fontFamily: "'Cairo', sans-serif", direction: 'rtl', boxSizing: 'border-box' }} />

            {/* Content Area */}
            <div contentEditable suppressContentEditableWarning
              style={{ padding: 24, minHeight: 400, direction: 'rtl', fontFamily: "'Cairo', sans-serif", fontSize: '0.95rem', lineHeight: 1.8, color: '#E2E8F4', outline: 'none' }}
              data-placeholder="ابدأ الكتابة هنا...">
            </div>
          </div>

          {/* Settings Panel */}
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 84 }}>
            {[
              { title: 'التصنيف', content: (
                <select style={{ width: '100%', padding: '8px 12px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", outline: 'none' }}>
                  {['تحليل', 'أسهم', 'رقمي', 'معادن', 'نفط', 'أخبار'].map(c => <option key={c}>{c}</option>)}
                </select>
              )},
              { title: 'الكلمات المفتاحية', content: (
                <div style={{ background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: 8, minHeight: 42, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {['أسهم', 'استثمار'].map(tag => (
                    <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6, padding: '3px 8px', fontSize: '0.75rem', color: '#C9A84C' }}>
                      {tag} <span style={{ cursor: 'pointer', opacity: 0.6 }}>×</span>
                    </span>
                  ))}
                  <input placeholder="أضف كلمة..." style={{ background: 'none', border: 'none', outline: 'none', color: '#E2E8F4', fontSize: '0.8rem', minWidth: 80, fontFamily: "'Cairo', sans-serif" }} />
                </div>
              )},
              { title: 'الصورة الرئيسية', content: (
                <div style={{ border: '2px dashed #1A2E4A', borderRadius: 10, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2E4A'}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🖼️</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B84A8' }}>اسحب أو انقر للرفع</div>
                </div>
              )},
              { title: 'الكاتب', content: (
                <select style={{ width: '100%', padding: '8px 12px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", outline: 'none' }}>
                  {['أحمد المشرف', 'خالد محمد', 'نورة السالم'].map(a => <option key={a}>{a}</option>)}
                </select>
              )},
              { title: 'إحصائيات', content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['عدد الكلمات', '0 كلمة'], ['وقت القراءة', '0 دقيقة']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#6B84A8' }}>{k}</span>
                      <span style={{ color: '#E2E8F4', fontFamily: 'monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )},
            ].map(sec => (
              <div key={sec.title} style={{ padding: 16, borderBottom: '1px solid #1A2E4A' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B84A8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>{sec.title}</div>
                {sec.content}
              </div>
            ))}
            <div style={{ padding: 16 }}>
              <button style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", marginBottom: 8 }}>🌐 نشر المقال</button>
              <button style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem' }}>حفظ كمسودة</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>إدارة المحتوى</h1>
        <button onClick={() => setShowEditor(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          <Plus size={16} /> مقال جديد
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1A2E4A', marginBottom: 20 }}>
        {['الأخبار والمقالات', 'صفحات الموقع', 'الخدمات', 'الأسئلة الشائعة'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 20px', background: 'none', border: 'none', color: tab === t ? '#C9A84C' : '#6B84A8', fontWeight: tab === t ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem', borderBottom: tab === t ? '2px solid #C9A84C' : '2px solid transparent' }}>{t}</button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'الكل'], ['published', 'منشور'], ['draft', 'مسودة']].map(([key, label]) => (
          <button key={key} onClick={() => setStatusFilter(key)} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", borderColor: statusFilter === key ? '#C9A84C' : '#1A2E4A', background: statusFilter === key ? 'rgba(201,168,76,0.1)' : 'transparent', color: statusFilter === key ? '#C9A84C' : '#6B84A8', fontWeight: statusFilter === key ? 600 : 400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(a => {
          const badge = statusBadge(a.status)
          return (
            <div key={a.id} style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2A3E5A'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2E4A'}>
              {/* Thumbnail */}
              <div style={{ width: 80, height: 60, background: 'rgba(201,168,76,0.08)', borderRadius: 8, border: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>📰</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '2px 8px', borderRadius: 4 }}>🔖 {a.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6B84A8' }}>📅 {a.date}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6B84A8' }}>👁 {a.views.toLocaleString()}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6B84A8' }}>💬 {a.comments}</span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 8 }}>{a.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700, background: badge.bg, color: badge.color }}>{badge.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B84A8' }}>✍️ {a.author}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setShowEditor(true)} style={{ width: 34, height: 34, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E4A'; e.currentTarget.style.color = '#6B84A8' }}>
                  <Edit size={14} />
                </button>
                <button style={{ width: 34, height: 34, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8' }}>
                  <Eye size={14} />
                </button>
                <button style={{ width: 34, height: 34, background: 'rgba(255,69,96,0.06)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4560' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
