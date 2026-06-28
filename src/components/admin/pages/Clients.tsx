import { useState, useEffect } from 'react'
import { Search, Plus, Trash2, Eye, EyeOff, RefreshCw, X, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { getClients, createClient, updateClient, deleteClient, type Client } from '../../../lib/api'

const MEMBERSHIP_LEVELS = ['عادي', 'Silver', 'Gold', 'Platinum', 'VIP', 'VIP+', 'Private', 'Elite']

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  active:   { background: 'rgba(0,217,126,0.1)',  color: '#00D97E', border: '1px solid rgba(0,217,126,0.3)'  },
  pending:  { background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' },
  inactive: { background: 'rgba(255,69,96,0.1)',  color: '#FF4560', border: '1px solid rgba(255,69,96,0.3)'  },
}
const STATUS_LABELS: Record<string, string> = { active: 'نشط', pending: 'قيد المراجعة', inactive: 'موقوف' }

const MEMBERSHIP_COLORS: Record<string, string> = {
  'عادي': '#64748B', Silver: '#94A3B8', Gold: '#F59E0B', Platinum: '#6366F1',
  VIP: '#0EA5E9', 'VIP+': '#3B82F6', Private: '#8B5CF6', Elite: '#FF4560',
}

function generatePassword(len = 12) {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$'
  let p = ''
  for (let i = 0; i < len; i++) p += chars[Math.floor(Math.random() * chars.length)]
  return p
}

interface FormData {
  name: string; email: string; phone: string; password: string; confirmPassword: string
  status: string; membership_level: string; risk_profile: string; notes: string
  portfolio_code: string; initial_investment: string
}
const INIT_FORM: FormData = {
  name: '', email: '', phone: '', password: '', confirmPassword: '',
  status: 'active', membership_level: 'عادي', risk_profile: 'متوسط',
  notes: '', portfolio_code: '', initial_investment: '',
}

const fldSt: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.83rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none', color: '#1E293B' }

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [memberFilter, setMemberFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table'|'grid'>('table')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string|null>(null)
  const [form, setForm] = useState<FormData>(INIT_FORM)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [viewClient, setViewClient] = useState<Client|null>(null)
  const [createdCredentials, setCreatedCredentials] = useState<{email:string;password:string}|null>(null)
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)
  const [formErr, setFormErr] = useState('')
  const [copiedField, setCopiedField] = useState<string|null>(null)

  const showToast = (msg: string, type: 'ok'|'err' = 'ok') => { setToast({msg, type}); setTimeout(()=>setToast(null), 3500) }

  const load = async () => {
    setLoading(true)
    try { const { clients: d } = await getClients({ limit: 500 }); setClients(d) }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : 'فشل التحميل', 'err') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedField(field); setTimeout(()=>setCopiedField(null), 2000) })
  }

  const filtered = clients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase()) && !(c.account_number||'').includes(search)) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (memberFilter !== 'all' && c.membership_level !== memberFilter) return false
    return true
  })

  const openCreate = () => {
    setEditingId(null)
    const pass = generatePassword()
    setForm({...INIT_FORM, password: pass, confirmPassword: pass})
    setFormErr(''); setShowPass(true); setShowModal(true)
  }
  const openEdit = (c: Client) => {
    setEditingId(c.id)
    setForm({ name:c.name, email:c.email, phone:c.phone||'', password:'', confirmPassword:'', status:c.status, membership_level:c.membership_level||'عادي', risk_profile:c.risk_profile||'متوسط', notes:c.notes||'', portfolio_code:c.portfolio_code||'', initial_investment:c.initial_investment||'' })
    setFormErr(''); setShowPass(false); setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormErr('')
    if (!form.name.trim()) { setFormErr('الاسم مطلوب'); return }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setFormErr('البريد الإلكتروني غير صحيح'); return }
    if (!editingId && !form.password) { setFormErr('كلمة المرور مطلوبة للعميل الجديد'); return }
    if (form.password && form.password !== form.confirmPassword) { setFormErr('كلمتا المرور غير متطابقتين'); return }
    if (form.password && form.password.length < 6) { setFormErr('كلمة المرور 6 أحرف على الأقل'); return }
    setSubmitting(true)
    try {
      const payload: Record<string,unknown> = { name:form.name.trim(), email:form.email.trim().toLowerCase(), phone:form.phone.trim(), status:form.status, membership_level:form.membership_level, risk_profile:form.risk_profile, notes:form.notes.trim(), portfolio_code:form.portfolio_code.trim(), initial_investment:form.initial_investment.trim() }
      if (form.password) payload.password = form.password
      if (editingId) {
        const { client } = await updateClient(editingId, payload)
        setClients(prev => prev.map(c => c.id===editingId ? client : c))
        setShowModal(false); showToast(`✅ تم تحديث بيانات ${client.name}`)
      } else {
        const { client } = await createClient(payload)
        setClients(prev => [client, ...prev])
        setShowModal(false)
        setCreatedCredentials({email:form.email.trim().toLowerCase(), password:form.password})
        showToast(`✅ تم إنشاء حساب ${client.name}`)
      }
    } catch (err: unknown) { setFormErr(err instanceof Error ? err.message : 'حدث خطأ') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteClient(id); setClients(prev=>prev.filter(c=>c.id!==id)); setDeleteId(null); showToast('🗑️ تم الحذف') }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : 'فشل الحذف', 'err') }
  }

  const stats = [
    {label:'إجمالي العملاء', value:clients.length, icon:'👥', color:'#3B82F6'},
    {label:'نشطون', value:clients.filter(c=>c.status==='active').length, icon:'✅', color:'#00D97E'},
    {label:'قيد المراجعة', value:clients.filter(c=>c.status==='pending').length, icon:'⏳', color:'#F59E0B'},
    {label:'موقوفون', value:clients.filter(c=>c.status==='inactive').length, icon:'❌', color:'#FF4560'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,fontFamily:"'Cairo',sans-serif",direction:'rtl'}}>
      {toast && (
        <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',zIndex:9999,padding:'12px 24px',borderRadius:10,background:toast.type==='ok'?'#00D97E':'#FF4560',color:'#fff',fontWeight:700,fontSize:'0.85rem',boxShadow:'0 4px 20px rgba(0,0,0,0.15)',pointerEvents:'none'}}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>إدارة العملاء</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{clients.length} عميل مسجّل</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={load} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem'}}><RefreshCw size={13}/> تحديث</button>
          {(['table','grid'] as const).map(m=>(
            <button key={m} onClick={()=>setViewMode(m)} style={{padding:'7px 14px',background:viewMode===m?'rgba(14,165,233,0.1)':'transparent',border:`1px solid ${viewMode===m?'rgba(14,165,233,0.3)':'#E2E8F0'}`,borderRadius:8,color:viewMode===m?'#0EA5E9':'#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
              {m==='table'?'☰ جدول':'⊞ بطاقات'}
            </button>
          ))}
          <button onClick={openCreate} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#fff',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> إضافة عميل
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${s.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.5rem',fontWeight:800,color:s.color,fontFamily:'monospace',lineHeight:1.2}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'8px 12px'}}>
          <Search size={13} color="#64748B"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد أو رقم الحساب..." style={{background:'none',border:'none',outline:'none',fontSize:'0.8rem',fontFamily:"'Cairo',sans-serif",flex:1,color:'#1E293B'}}/>
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:'8px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",color:'#475569',cursor:'pointer'}}>
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="pending">قيد المراجعة</option>
          <option value="inactive">موقوف</option>
        </select>
        <select value={memberFilter} onChange={e=>setMemberFilter(e.target.value)} style={{padding:'8px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",color:'#475569',cursor:'pointer'}}>
          <option value="all">كل المستويات</option>
          {MEMBERSHIP_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      {viewMode==='table' && (
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            {loading ? <div style={{padding:40,textAlign:'center',color:'#64748B'}}>⏳ جارٍ التحميل...</div> : (
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                <thead>
                  <tr>{['الرقم','العميل','البريد','الهاتف','المستوى','الحالة','تاريخ الانضمام','إجراءات'].map(h=>(
                    <th key={h} style={{padding:'11px 14px',textAlign:'right',fontSize:'0.7rem',fontWeight:600,color:'#64748B',borderBottom:'1px solid #E2E8F0',background:'#F1F5F9',whiteSpace:'nowrap'}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.length===0 ? (
                    <tr><td colSpan={8} style={{padding:40,textAlign:'center',color:'#94A3B8'}}>لا يوجد عملاء مطابقون</td></tr>
                  ) : filtered.map(c=>(
                    <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'12px 14px',fontSize:'0.72rem',color:'#94A3B8',fontFamily:'monospace',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>{c.account_number||c.id.slice(0,8)}</td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'0.85rem',flexShrink:0}}>{c.name.charAt(0)}</div>
                          <div>
                            <div style={{fontSize:'0.84rem',fontWeight:700,color:'#1E293B'}}>{c.name}</div>
                            {c.portfolio_code && <div style={{fontSize:'0.65rem',color:'#94A3B8',fontFamily:'monospace'}}>{c.portfolio_code}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#475569',borderBottom:'1px solid rgba(203,213,225,0.5)',fontFamily:'monospace'}}>{c.email}</td>
                      <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#475569',borderBottom:'1px solid rgba(203,213,225,0.5)',fontFamily:'monospace'}}>{c.phone||'—'}</td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                        <span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.68rem',fontWeight:700,background:`${MEMBERSHIP_COLORS[c.membership_level||'عادي']}18`,color:MEMBERSHIP_COLORS[c.membership_level||'عادي'],border:`1px solid ${MEMBERSHIP_COLORS[c.membership_level||'عادي']}33`}}>
                          {c.membership_level||'عادي'}
                        </span>
                      </td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                        <span style={{...(STATUS_STYLES[c.status]||STATUS_STYLES.pending),padding:'3px 10px',borderRadius:20,fontSize:'0.68rem',fontWeight:700}}>
                          ● {STATUS_LABELS[c.status]||c.status}
                        </span>
                      </td>
                      <td style={{padding:'12px 14px',fontSize:'0.72rem',color:'#64748B',borderBottom:'1px solid rgba(203,213,225,0.5)',whiteSpace:'nowrap'}}>
                        {c.join_date ? new Date(c.join_date).toLocaleDateString('ar-SA') : new Date(c.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                        <div style={{display:'flex',gap:5}}>
                          <button onClick={()=>setViewClient(c)} style={{padding:'5px 10px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:6,color:'#0EA5E9',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center'}}><Eye size={11}/></button>
                          <button onClick={()=>openEdit(c)} style={{padding:'5px 10px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>تعديل</button>
                          {deleteId===c.id ? (
                            <>
                              <button onClick={()=>handleDelete(c.id)} style={{padding:'5px 10px',background:'rgba(255,69,96,0.15)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:6,color:'#FF4560',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:700}}>تأكيد</button>
                              <button onClick={()=>setDeleteId(null)} style={{padding:'5px 10px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:6,color:'#475569',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>إلغاء</button>
                            </>
                          ) : (
                            <button onClick={()=>setDeleteId(c.id)} style={{padding:'5px 10px',background:'rgba(255,69,96,0.08)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,color:'#FF4560',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center'}}><Trash2 size={11}/></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div style={{padding:'10px 14px',borderTop:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'0.7rem',color:'#64748B'}}>يُعرض {filtered.length} من {clients.length} عميل</span>
          </div>
        </div>
      )}

      {/* Grid */}
      {viewMode==='grid' && !loading && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {filtered.map(c=>(
            <div key={c.id} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'1rem',flexShrink:0}}>{c.name.charAt(0)}</div>
                  <div>
                    <div style={{fontSize:'0.88rem',fontWeight:700,color:'#1E293B'}}>{c.name}</div>
                    <div style={{fontSize:'0.68rem',color:'#94A3B8'}}>{c.email}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:5}}>
                  <button onClick={()=>openEdit(c)} style={{padding:6,background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:6,color:'#0EA5E9',cursor:'pointer',display:'flex'}}><Eye size={12}/></button>
                  <button onClick={()=>setDeleteId(c.id)} style={{padding:6,background:'rgba(255,69,96,0.08)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,color:'#FF4560',cursor:'pointer',display:'flex'}}><Trash2 size={12}/></button>
                </div>
              </div>
              <div style={{padding:'10px 16px 14px',borderTop:'1px solid #F1F5F9'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{...(STATUS_STYLES[c.status]||STATUS_STYLES.pending),padding:'2px 8px',borderRadius:12,fontSize:'0.65rem',fontWeight:700}}>● {STATUS_LABELS[c.status]||c.status}</span>
                  <span style={{padding:'2px 8px',borderRadius:12,fontSize:'0.65rem',fontWeight:700,background:`${MEMBERSHIP_COLORS[c.membership_level||'عادي']}18`,color:MEMBERSHIP_COLORS[c.membership_level||'عادي']}}>{c.membership_level||'عادي'}</span>
                </div>
                {c.account_number && <div style={{fontSize:'0.68rem',color:'#94A3B8',fontFamily:'monospace'}}>رقم الحساب: {c.account_number}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewClient && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setViewClient(null)}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:520,maxWidth:'92vw',maxHeight:'85vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 style={{fontSize:'1.05rem',fontWeight:800,color:'#1E293B',margin:0}}>تفاصيل العميل</h2>
              <button onClick={()=>setViewClient(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B'}}><X size={18}/></button>
            </div>
            <div style={{display:'grid',gap:10}}>
              {[
                {l:'الاسم الكامل',v:viewClient.name}, {l:'البريد الإلكتروني',v:viewClient.email},
                {l:'رقم الهاتف',v:viewClient.phone||'—'}, {l:'رقم الحساب',v:viewClient.account_number||'—'},
                {l:'كود المحفظة',v:viewClient.portfolio_code||'—'}, {l:'الاستثمار الأولي',v:viewClient.initial_investment||'—'},
                {l:'مستوى العضوية',v:viewClient.membership_level||'عادي'}, {l:'مستوى المخاطر',v:viewClient.risk_profile||'—'},
                {l:'الحالة',v:STATUS_LABELS[viewClient.status]||viewClient.status},
                {l:'تاريخ الانضمام',v:viewClient.join_date?new Date(viewClient.join_date).toLocaleDateString('ar-SA'):'—'},
              ].map(row=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:'#F8FAFC',borderRadius:8}}>
                  <span style={{fontSize:'0.78rem',color:'#64748B',fontWeight:600}}>{row.l}</span>
                  <span style={{fontSize:'0.82rem',color:'#1E293B',fontWeight:700}}>{row.v}</span>
                </div>
              ))}
              {viewClient.notes && (
                <div style={{padding:'10px 12px',background:'#F8FAFC',borderRadius:8}}>
                  <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:4}}>ملاحظات</div>
                  <div style={{fontSize:'0.82rem',color:'#1E293B',lineHeight:1.7}}>{viewClient.notes}</div>
                </div>
              )}
            </div>
            <button onClick={()=>{setViewClient(null);openEdit(viewClient)}} style={{marginTop:16,width:'100%',padding:10,background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:8,color:'#0EA5E9',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
              ✏️ تعديل البيانات
            </button>
          </div>
        </div>
      )}

      {/* Created Credentials */}
      {createdCredentials && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',borderRadius:16,padding:32,width:460,maxWidth:'92vw',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{fontSize:'2.5rem',marginBottom:8}}>🎉</div>
              <h2 style={{fontSize:'1.1rem',fontWeight:800,color:'#1E293B',margin:'0 0 4px'}}>تم إنشاء حساب العميل</h2>
              <p style={{fontSize:'0.8rem',color:'#64748B',margin:0}}>احتفظ ببيانات الدخول قبل إغلاق النافذة</p>
            </div>
            <div style={{background:'#F0FDF4',border:'1px solid rgba(0,217,126,0.3)',borderRadius:12,padding:20,display:'flex',flexDirection:'column',gap:14,marginBottom:20}}>
              {[{label:'البريد الإلكتروني',value:createdCredentials.email,field:'email'},{label:'كلمة المرور',value:createdCredentials.password,field:'pass'}].map(row=>(
                <div key={row.field}>
                  <div style={{fontSize:'0.7rem',color:'#64748B',fontWeight:600,marginBottom:4}}>{row.label}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 12px'}}>
                    <span style={{flex:1,fontFamily:'monospace',fontSize:'0.88rem',color:'#1E293B',wordBreak:'break-all'}}>{row.value}</span>
                    <button onClick={()=>copyToClipboard(row.value, row.field)} style={{flexShrink:0,padding:'4px 8px',background:copiedField===row.field?'rgba(0,217,126,0.1)':'rgba(14,165,233,0.1)',border:`1px solid ${copiedField===row.field?'rgba(0,217,126,0.3)':'rgba(14,165,233,0.2)'}`,borderRadius:6,cursor:'pointer',color:copiedField===row.field?'#00D97E':'#0EA5E9',display:'flex',alignItems:'center',gap:4,fontSize:'0.7rem',fontFamily:"'Cairo',sans-serif"}}>
                      {copiedField===row.field?<><CheckCircle size={12}/>تم</>:<><Copy size={12}/>نسخ</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>setCreatedCredentials(null)} style={{width:'100%',padding:12,background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:10,color:'#fff',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.88rem'}}>
              فهمت — إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowModal(false)}>
          <div style={{background:'#fff',borderRadius:16,padding:0,width:580,maxWidth:'94vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#fff',zIndex:1}}>
              <span style={{fontWeight:800,fontSize:'0.95rem',color:'#1E293B'}}>{editingId?'تعديل بيانات العميل':'إضافة عميل جديد'}</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',display:'flex'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  {l:'الاسم الكامل *',k:'name',t:'text',ph:'محمد أحمد العمري'},
                  {l:'البريد الإلكتروني *',k:'email',t:'email',ph:'client@example.com',disabled:!!editingId},
                  {l:'رقم الهاتف',k:'phone',t:'text',ph:'+966501234567'},
                  {l:'كود المحفظة',k:'portfolio_code',t:'text',ph:'PF-001'},
                  {l:'الاستثمار الأولي',k:'initial_investment',t:'text',ph:'100,000 SAR'},
                ].map(f=>(
                  <div key={f.k}>
                    <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>{f.l}</label>
                    <input type={f.t} value={(form as Record<string,string>)[f.k]} onChange={e=>setForm(fm=>({...fm,[f.k]:e.target.value}))} placeholder={f.ph} disabled={f.disabled} style={{...fldSt,opacity:f.disabled?0.6:1}}/>
                  </div>
                ))}
                <div>
                  <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>مستوى العضوية</label>
                  <select value={form.membership_level} onChange={e=>setForm(f=>({...f,membership_level:e.target.value}))} style={{...fldSt,cursor:'pointer'}}>
                    {MEMBERSHIP_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>الحالة</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{...fldSt,cursor:'pointer'}}>
                    <option value="active">نشط</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="inactive">موقوف</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>مستوى المخاطر</label>
                  <select value={form.risk_profile} onChange={e=>setForm(f=>({...f,risk_profile:e.target.value}))} style={{...fldSt,cursor:'pointer'}}>
                    {['منخفض','منخفض–متوسط','متوسط','متوسط–مرتفع','مرتفع'].map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>ملاحظات</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} placeholder="ملاحظات داخلية..." style={{...fldSt,resize:'vertical',lineHeight:1.7}}/>
              </div>

              {/* Password */}
              <div style={{background:'#F0F9FF',border:'1px solid rgba(14,165,233,0.2)',borderRadius:10,padding:16}}>
                <div style={{fontSize:'0.78rem',fontWeight:700,color:'#0EA5E9',marginBottom:10}}>{editingId?'🔑 تغيير كلمة المرور (اتركها فارغة لعدم التغيير)':'🔑 بيانات دخول العميل'}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>كلمة المرور{!editingId&&' *'}</label>
                    <div style={{position:'relative'}}>
                      <input type={showPass?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" style={fldSt}/>
                      <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94A3B8'}}>
                        {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,color:'#475569',marginBottom:5}}>تأكيد كلمة المرور</label>
                    <div style={{position:'relative'}}>
                      <input type={showConfirmPass?'text':'password'} value={form.confirmPassword} onChange={e=>setForm(f=>({...f,confirmPassword:e.target.value}))} placeholder="••••••••" style={fldSt}/>
                      <button type="button" onClick={()=>setShowConfirmPass(!showConfirmPass)} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94A3B8'}}>
                        {showConfirmPass?<EyeOff size={14}/>:<Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={()=>{const p=generatePassword();setForm(f=>({...f,password:p,confirmPassword:p}));setShowPass(true)}} style={{marginTop:10,padding:'6px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:8,color:'#0EA5E9',fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
                  🔀 توليد كلمة مرور عشوائية
                </button>
              </div>

              {formErr && (
                <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,69,96,0.08)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:8,padding:'10px 12px',color:'#FF4560',fontSize:'0.82rem'}}>
                  <AlertTriangle size={14}/>{formErr}
                </div>
              )}

              <div style={{display:'flex',gap:10}}>
                <button type="submit" disabled={submitting} style={{flex:1,padding:12,background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#fff',fontWeight:800,cursor:submitting?'not-allowed':'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.88rem',opacity:submitting?0.7:1}}>
                  {submitting?'⏳ جارٍ الحفظ...':editingId?'💾 حفظ التعديلات':'✅ إنشاء العميل'}
                </button>
                <button type="button" onClick={()=>setShowModal(false)} style={{flex:1,padding:12,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#475569',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.88rem'}}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
