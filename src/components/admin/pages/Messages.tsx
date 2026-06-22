import { useState, useEffect } from 'react'
import { Search, Send, Paperclip, Trash2, Eye, CheckCheck, Mail, Phone, Briefcase, Calendar, MessageSquare, Inbox, Filter } from 'lucide-react'
import { mockMessages } from '../adminData'
import { getContactMessages, updateContactMessageStatus, deleteContactMessage, ContactMessage } from '../../../lib/store'

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ContactMessage['status'] }) {
  const map = {
    new:     { label: 'جديدة',    bg: 'rgba(239,68,68,0.1)',    color: '#EF4444',  border: 'rgba(239,68,68,0.25)' },
    read:    { label: 'مقروءة',   bg: 'rgba(100,116,139,0.1)', color: '#64748B',  border: 'rgba(100,116,139,0.25)' },
    replied: { label: 'تم الرد', bg: 'rgba(0,217,126,0.1)',   color: '#00D97E',  border: 'rgba(0,217,126,0.25)' },
  }
  const s = map[status]
  return (
    <span style={{ padding:'2px 9px', borderRadius:20, fontSize:'0.65rem', fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.border}`, whiteSpace:'nowrap' }}>
      {s.label}
    </span>
  )
}

// ── Contact Messages Tab ────────────────────────────────────────────────────
function ContactMessagesTab() {
  const [msgs, setMsgs] = useState<ContactMessage[]>([])
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const reload = () => {
    const data = getContactMessages()
    setMsgs(data)
  }

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener('tharwah_contact_messages_changed', handler)
    return () => window.removeEventListener('tharwah_contact_messages_changed', handler)
  }, [])

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg)
    if (msg.status === 'new') {
      updateContactMessageStatus(msg.id, 'read')
      setMsgs(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m))
      setSelected({ ...msg, status: 'read' })
    }
  }

  const handleStatus = (id: number, status: ContactMessage['status']) => {
    updateContactMessageStatus(id, status)
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev)
  }

  const handleDelete = (id: number) => {
    deleteContactMessage(id)
    setMsgs(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    setConfirmDelete(null)
  }

  const filtered = msgs.filter(m => {
    const matchSearch = !search || m.name.includes(search) || m.email.includes(search) || m.message.includes(search)
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  const newCount = msgs.filter(m => m.status === 'new').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { label:'إجمالي الرسائل', value: msgs.length, color:'#3B82F6', icon:'📨' },
          { label:'جديدة', value: msgs.filter(m=>m.status==='new').length, color:'#EF4444', icon:'🔴' },
          { label:'مقروءة', value: msgs.filter(m=>m.status==='read').length, color:'#64748B', icon:'👁️' },
          { label:'تم الرد', value: msgs.filter(m=>m.status==='replied').length, color:'#00D97E', icon:'✅' },
        ].map(stat => (
          <div key={stat.label} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:'1.4rem' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize:'1.4rem', fontWeight:800, color:stat.color, lineHeight:1 }}>{stat.value}</div>
              <div style={{ fontSize:'0.68rem', color:'#64748B', marginTop:2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display:'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap:12, minHeight:500 }}>
        {/* List */}
        <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          {/* Toolbar */}
          <div style={{ padding:'12px 14px', borderBottom:'1px solid #E2E8F0', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 10px' }}>
              <Search size={13} color="#64748B"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم أو بريد أو رسالة..."
                style={{ background:'none', border:'none', outline:'none', color:'#1E293B', fontSize:'0.75rem', fontFamily:"'Cairo',sans-serif", flex:1, minWidth:0 }}/>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {(['all','new','read','replied'] as const).map(s => (
                <button key={s} onClick={()=>setFilterStatus(s)}
                  style={{ flex:1, padding:'5px 0', fontSize:'0.65rem', fontWeight:700, borderRadius:7, border:`1px solid ${filterStatus===s ? '#0EA5E9' : '#E2E8F0'}`, background: filterStatus===s ? 'rgba(14,165,233,0.1)' : 'transparent', color: filterStatus===s ? '#0EA5E9' : '#64748B', cursor:'pointer', fontFamily:"'Cairo',sans-serif", transition:'all 0.15s' }}>
                  {s==='all'?'الكل':s==='new'?'جديدة':s==='read'?'مقروءة':'مُرد'}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, gap:12, color:'#94A3B8' }}>
                <Inbox size={36} strokeWidth={1.5}/>
                <div style={{ fontSize:'0.82rem', fontWeight:600 }}>
                  {msgs.length === 0 ? 'لا توجد رسائل بعد' : 'لا توجد رسائل تطابق الفلتر'}
                </div>
                {msgs.length === 0 && <div style={{ fontSize:'0.72rem', textAlign:'center', maxWidth:200, lineHeight:1.6 }}>
                  ستظهر هنا الرسائل القادمة من صفحة "تواصل معنا"
                </div>}
              </div>
            ) : (
              filtered.map(msg => (
                <div key={msg.id} onClick={()=>handleSelect(msg)}
                  style={{ padding:'12px 14px', borderBottom:'1px solid rgba(203,213,225,0.5)', cursor:'pointer',
                    background: selected?.id===msg.id ? 'rgba(14,165,233,0.07)' : 'transparent',
                    borderRight: selected?.id===msg.id ? '3px solid #C9A84C' : '3px solid transparent',
                    transition:'all 0.15s', position:'relative' }}
                  onMouseEnter={e=>{ if(selected?.id!==msg.id) e.currentTarget.style.background='rgba(14,165,233,0.03)' }}
                  onMouseLeave={e=>{ if(selected?.id!==msg.id) e.currentTarget.style.background='transparent' }}>
                  {msg.status === 'new' && (
                    <span style={{ position:'absolute', top:14, left:14, width:7, height:7, borderRadius:'50%', background:'#EF4444' }}/>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, minWidth:0 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#BAE6FD,#7DD3FC)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.85rem', color:'#0EA5E9', flexShrink:0 }}>
                        {msg.name.charAt(0)}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:'0.78rem', fontWeight: msg.status==='new' ? 800 : 600, color:'#1E293B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.name}</div>
                        <div style={{ fontSize:'0.67rem', color:'#64748B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                      <StatusBadge status={msg.status}/>
                      <span style={{ fontSize:'0.6rem', color:'#94A3B8' }}>{msg.date.split('،')[0]}</span>
                    </div>
                  </div>
                  <div style={{ marginTop:7, fontSize:'0.72rem', color:'#64748B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:2 }}>
                    {msg.message}
                  </div>
                  {msg.service && (
                    <div style={{ marginTop:5, display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20 }}>
                      <Briefcase size={9} color="#C9A84C"/>
                      <span style={{ fontSize:'0.62rem', color:'#C9A84C', fontWeight:600 }}>{msg.service}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            {/* Header */}
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1rem', color:'#fff' }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'0.92rem', color:'#1E293B' }}>{selected.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
                    <StatusBadge status={selected.status}/>
                    <span style={{ fontSize:'0.65rem', color:'#94A3B8' }}>
                      {selected.source === 'support' ? '🎧 دعم' : '📝 تواصل'}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>setConfirmDelete(selected.id)}
                  style={{ padding:'6px 10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, color:'#EF4444', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:'0.72rem', fontFamily:"'Cairo',sans-serif" }}>
                  <Trash2 size={13}/> حذف
                </button>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #E2E8F0', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Mail size={13} color="#64748B"/>
                <div>
                  <div style={{ fontSize:'0.62rem', color:'#94A3B8', fontWeight:600 }}>البريد الإلكتروني</div>
                  <a href={`mailto:${selected.email}`} style={{ fontSize:'0.78rem', color:'#0EA5E9', textDecoration:'none', fontWeight:600 }}>{selected.email}</a>
                </div>
              </div>
              {selected.phone && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Phone size={13} color="#64748B"/>
                  <div>
                    <div style={{ fontSize:'0.62rem', color:'#94A3B8', fontWeight:600 }}>رقم الهاتف</div>
                    <a href={`tel:${selected.phone}`} style={{ fontSize:'0.78rem', color:'#1E293B', textDecoration:'none', fontWeight:600 }}>{selected.phone}</a>
                  </div>
                </div>
              )}
              {selected.service && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Briefcase size={13} color="#64748B"/>
                  <div>
                    <div style={{ fontSize:'0.62rem', color:'#94A3B8', fontWeight:600 }}>الخدمة المطلوبة</div>
                    <div style={{ fontSize:'0.78rem', color:'#1E293B', fontWeight:600 }}>{selected.service}</div>
                  </div>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Calendar size={13} color="#64748B"/>
                <div>
                  <div style={{ fontSize:'0.62rem', color:'#94A3B8', fontWeight:600 }}>تاريخ الإرسال</div>
                  <div style={{ fontSize:'0.78rem', color:'#1E293B', fontWeight:600 }}>{selected.date}</div>
                </div>
              </div>
            </div>

            {/* Message body */}
            <div style={{ flex:1, padding:'20px', overflowY:'auto' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94A3B8', marginBottom:10, textTransform:'uppercase', letterSpacing:'1px' }}>نص الرسالة</div>
              <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:'16px 18px', fontSize:'0.88rem', color:'#1E293B', lineHeight:1.8, minHeight:120 }}>
                {selected.message}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding:'14px 20px', borderTop:'1px solid #E2E8F0', display:'flex', gap:8, flexWrap:'wrap' }}>
              <div style={{ fontSize:'0.72rem', color:'#64748B', fontWeight:600, display:'flex', alignItems:'center', gap:6, flex:'0 0 auto' }}>
                تغيير الحالة:
              </div>
              {(['new','read','replied'] as const).map(s => (
                <button key={s} onClick={()=>handleStatus(selected.id, s)}
                  disabled={selected.status === s}
                  style={{ padding:'6px 14px', fontSize:'0.72rem', fontWeight:700, borderRadius:8, border:'1px solid', cursor: selected.status===s ? 'default' : 'pointer', fontFamily:"'Cairo',sans-serif", transition:'all 0.15s',
                    borderColor: selected.status===s ? '#E2E8F0' : s==='new' ? 'rgba(239,68,68,0.3)' : s==='read' ? 'rgba(100,116,139,0.3)' : 'rgba(0,217,126,0.3)',
                    background: selected.status===s ? '#F1F5F9' : s==='new' ? 'rgba(239,68,68,0.08)' : s==='read' ? 'rgba(100,116,139,0.08)' : 'rgba(0,217,126,0.08)',
                    color: selected.status===s ? '#94A3B8' : s==='new' ? '#EF4444' : s==='read' ? '#64748B' : '#00D97E',
                  }}>
                  {s==='new'?'🔴 جديدة':s==='read'?'👁️ مقروءة':'✅ تم الرد'}
                </button>
              ))}
              <a href={`mailto:${selected.email}`}
                style={{ padding:'6px 14px', fontSize:'0.72rem', fontWeight:700, borderRadius:8, border:'1px solid rgba(14,165,233,0.3)', background:'rgba(14,165,233,0.08)', color:'#0EA5E9', cursor:'pointer', fontFamily:"'Cairo',sans-serif", textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
                <Mail size={12}/> رد بالبريد
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete !== null && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={()=>setConfirmDelete(null)}>
          <div style={{ background:'#FFFFFF', borderRadius:14, padding:'28px 32px', minWidth:320, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:'1.8rem', textAlign:'center', marginBottom:12 }}>🗑️</div>
            <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#1E293B', textAlign:'center', marginBottom:8 }}>حذف الرسالة</div>
            <div style={{ fontSize:'0.78rem', color:'#64748B', textAlign:'center', marginBottom:24 }}>هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setConfirmDelete(null)}
                style={{ flex:1, padding:'10px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, color:'#64748B', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:600, fontSize:'0.82rem' }}>
                إلغاء
              </button>
              <button onClick={()=>handleDelete(confirmDelete)}
                style={{ flex:1, padding:'10px', background:'linear-gradient(135deg,#EF4444,#DC2626)', border:'none', borderRadius:8, color:'#FFFFFF', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:'0.82rem' }}>
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Chat Tab (existing) ─────────────────────────────────────────────────────
function ChatTab() {
  const [activeConv, setActiveConv] = useState(mockMessages[0])
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(mockMessages)
  const [search, setSearch] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [bulkMsg, setBulkMsg] = useState('')

  const sendMsg = () => {
    if (!input.trim()) return
    const updated = msgs.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, { id: c.messages.length+1, from:'admin', text:input, time:new Date().toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}) }], unread:0 }
        : c
    )
    setMsgs(updated)
    const curr = updated.find(c=>c.id===activeConv.id)!
    setActiveConv(curr)
    setInput('')
  }

  const filtered = msgs.filter(c => !search || c.client.includes(search) || c.preview.includes(search))
  const totalUnread = msgs.reduce((s,c)=>s+c.unread,0)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:'0.78rem', color:'#64748B', margin:0 }}>{msgs.length} محادثة — {totalUnread} غير مقروء</p>
        <button onClick={()=>setShowBulk(!showBulk)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background: showBulk ? 'rgba(14,165,233,0.15)' : 'transparent', border:`1px solid ${showBulk ? 'rgba(14,165,233,0.3)' : '#E2E8F0'}`, borderRadius:8, color: showBulk ? '#0EA5E9' : '#64748B', fontSize:'0.78rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>
          📢 رسالة جماعية
        </button>
      </div>

      {showBulk && (
        <div style={{ background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#0EA5E9', marginBottom:10 }}>📢 إرسال رسالة جماعية لكل العملاء</div>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea value={bulkMsg} onChange={e=>setBulkMsg(e.target.value)} placeholder="اكتب رسالتك هنا..." rows={2}
              style={{ flex:1, padding:'10px 12px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:'0.82rem', fontFamily:"'Cairo',sans-serif", resize:'none', outline:'none' }}/>
            <button style={{ padding:'10px 20px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, color:'#FFFFFF', fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontSize:'0.82rem', whiteSpace:'nowrap' }}>إرسال للكل</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:0, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden', height:520 }}>
        {/* Conversation List */}
        <div style={{ borderLeft:'1px solid #E2E8F0', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid #E2E8F0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 10px' }}>
              <Search size={13} color="#64748B"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{ background:'none', border:'none', outline:'none', color:'#1E293B', fontSize:'0.75rem', fontFamily:"'Cairo',sans-serif", flex:1, minWidth:0 }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filtered.map(c => (
              <div key={c.id} onClick={()=>setActiveConv(c)}
                style={{ padding:'12px 14px', borderBottom:'1px solid rgba(203,213,225,0.6)', cursor:'pointer', background: activeConv.id===c.id ? 'rgba(14,165,233,0.08)' : 'transparent', borderRight: activeConv.id===c.id ? '2px solid #C9A84C' : '2px solid transparent', transition:'all 0.15s' }}
                onMouseEnter={e=>{ if(activeConv.id!==c.id) e.currentTarget.style.background='rgba(14,165,233,0.03)' }}
                onMouseLeave={e=>{ if(activeConv.id!==c.id) e.currentTarget.style.background='transparent' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#BAE6FD,#7DD3FC)', border:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, color:'#0EA5E9' }}>
                      {c.client.charAt(0)}
                    </div>
                    {c.online && <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:'#00D97E', border:'2px solid #FFFFFF' }}/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E293B' }}>{c.client}</span>
                      <span style={{ fontSize:'0.62rem', color:'#94A3B8', flexShrink:0 }}>{c.time}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:2 }}>
                      <span style={{ fontSize:'0.7rem', color:'#64748B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{c.preview}</span>
                      {c.unread > 0 && <span style={{ background:'#FF4560', color:'white', borderRadius:10, padding:'1px 6px', fontSize:'0.6rem', fontWeight:700, flexShrink:0, marginRight:4 }}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, color:'#FFFFFF' }}>{activeConv.client.charAt(0)}</div>
                {activeConv.online && <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:'#00D97E', border:'2px solid #FFFFFF' }}/>}
              </div>
              <div>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#1E293B' }}>{activeConv.client}</div>
                <div style={{ fontSize:'0.65rem', color: activeConv.online ? '#00D97E' : '#64748B' }}>{activeConv.online ? '● متصل الآن' : 'غير متصل'}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button style={{ padding:'5px 10px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:7, color:'#3B82F6', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📊 محفظته</button>
              <button style={{ padding:'5px 10px', background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:7, color:'#0EA5E9', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>👤 ملفه</button>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
            {activeConv.messages.map(m => (
              <div key={m.id} style={{ display:'flex', justifyContent: m.from==='admin' ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius: m.from==='admin' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: m.from==='admin' ? 'linear-gradient(135deg,#0EA5E9,#38BDF8)' : '#FFFFFF', color: m.from==='admin' ? '#F1F5F9' : '#1E293B', fontSize:'0.82rem', lineHeight:1.5, border: m.from==='admin' ? 'none' : '1px solid #E2E8F0' }}>
                  {m.text}
                  <div style={{ fontSize:'0.6rem', color: m.from==='admin' ? 'rgba(255,255,255,0.75)' : '#94A3B8', marginTop:4, textAlign:'left' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:'12px 16px', borderTop:'1px solid #E2E8F0', display:'flex', gap:8, alignItems:'flex-end' }}>
            <button style={{ width:34, height:34, background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748B', flexShrink:0 }}>
              <Paperclip size={14}/>
            </button>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg() }}}
              placeholder="اكتب رسالتك..."
              style={{ flex:1, padding:'9px 14px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:'0.82rem', fontFamily:"'Cairo',sans-serif", outline:'none' }}
              onFocus={e=>e.target.style.borderColor='#0EA5E9'}
              onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
            <button onClick={sendMsg} style={{ width:34, height:34, background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
              <Send size={14} color="#FFFFFF"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Messages Component ─────────────────────────────────────────────────
export default function Messages() {
  const [tab, setTab] = useState<'contact' | 'chat'>('contact')
  const [contactCount, setContactCount] = useState(0)
  const [newCount, setNewCount] = useState(0)

  useEffect(() => {
    const update = () => {
      const msgs = getContactMessages()
      setContactCount(msgs.length)
      setNewCount(msgs.filter(m => m.status === 'new').length)
    }
    update()
    window.addEventListener('tharwah_contact_messages_changed', update)
    return () => window.removeEventListener('tharwah_contact_messages_changed', update)
  }, [])

  const chatUnread = mockMessages.reduce((s,c)=>s+c.unread, 0)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'#1E293B', margin:0 }}>إدارة الرسائل</h1>
          <p style={{ fontSize:'0.78rem', color:'#64748B', marginTop:3 }}>
            إدارة رسائل العملاء القادمة من صفحة التواصل والمراسلات المباشرة
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:12, padding:4, width:'fit-content', border:'1px solid #E2E8F0' }}>
        <button onClick={()=>setTab('contact')}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 20px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s',
            background: tab==='contact' ? '#FFFFFF' : 'transparent',
            color: tab==='contact' ? '#1E293B' : '#64748B',
            boxShadow: tab==='contact' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
          <Inbox size={15}/>
          رسائل التواصل
          {newCount > 0 && (
            <span style={{ background:'#EF4444', color:'white', borderRadius:10, padding:'1px 7px', fontSize:'0.62rem', fontWeight:800 }}>{newCount}</span>
          )}
        </button>
        <button onClick={()=>setTab('chat')}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 20px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s',
            background: tab==='chat' ? '#FFFFFF' : 'transparent',
            color: tab==='chat' ? '#1E293B' : '#64748B',
            boxShadow: tab==='chat' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
          <MessageSquare size={15}/>
          المراسلات المباشرة
          {chatUnread > 0 && (
            <span style={{ background:'#FF4560', color:'white', borderRadius:10, padding:'1px 7px', fontSize:'0.62rem', fontWeight:800 }}>{chatUnread}</span>
          )}
        </button>
      </div>

      {/* Content */}
      {tab === 'contact' ? <ContactMessagesTab /> : <ChatTab />}
    </div>
  )
}
