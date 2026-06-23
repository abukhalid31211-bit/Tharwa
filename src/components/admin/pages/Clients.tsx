import { useState, useEffect } from 'react'
import { Search, Plus, Download, X, Eye, Edit, Trash2, Key, UserPlus, Shield, Copy, Check, RefreshCw } from 'lucide-react'
import { mockClients, mockClientAccounts, statusLabels } from '../adminData'
import { getLiveClients, setLiveClients } from '../../../lib/store'

const C = {
  card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' } as React.CSSProperties,
  th: { padding:'11px 14px', textAlign:'right' as const, fontSize:'0.7rem', fontWeight:600, color:'#64748B', borderBottom:'1px solid #E2E8F0', background:'#F1F5F9', whiteSpace:'nowrap' as const },
  td: { padding:'12px 14px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', verticalAlign:'middle' as const },
  input: { width:'100%', padding:'9px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:'0.82rem', outline:'none', fontFamily:"'Cairo',sans-serif", boxSizing:'border-box' as const },
  label: { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#475569', marginBottom:5 } as React.CSSProperties,
}

const statusMap: Record<string,{bg:string;color:string}> = {
  active:{bg:'rgba(0,217,126,0.1)',color:'#00D97E'},
  pending:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B'},
  frozen:{bg:'rgba(59,130,246,0.1)',color:'#3B82F6'},
  inactive:{bg:'rgba(255,69,96,0.1)',color:'#FF4560'},
  suspended:{bg:'rgba(255,69,96,0.1)',color:'#FF4560'},
}
const catMap: Record<string,{bg:string;color:string}> = {
  VIP:{bg:'rgba(14,165,233,0.15)',color:'#0EA5E9'},
  premium:{bg:'rgba(139,92,246,0.15)',color:'#8B5CF6'},
  standard:{bg:'rgba(107,132,168,0.15)',color:'#64748B'},
}

const accountStatusMap: Record<string,{bg:string;color:string;label:string}> = {
  active:{bg:'rgba(0,217,126,0.1)',color:'#00D97E',label:'نشط'},
  suspended:{bg:'rgba(255,69,96,0.1)',color:'#FF4560',label:'موقوف'},
  pending:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B',label:'معلق'},
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  return Array.from({length:10},()=>chars[Math.floor(Math.random()*chars.length)]).join('')
}

export default function Clients() {
  const [mainTab, setMainTab] = useState<'list'|'accounts'|'create_account'>('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [selected, setSelected] = useState<number[]>([])
  const [viewClient, setViewClient] = useState<typeof mockClients[0]|null>(null)
  const [editClient, setEditClient] = useState<typeof mockClients[0]|null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number|null>(null)
  const [clients, setClients] = useState(() => {
    const live = getLiveClients<typeof mockClients[0]>()
    return live.length > 0 ? live : [...mockClients]
  })
  const [accounts, setAccounts] = useState([...mockClientAccounts])
  const [kycAction, setKycAction] = useState<Record<number,string>>({})
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)
  const [accountSearch, setAccountSearch] = useState('')
  const [copiedId, setCopiedId] = useState<number|null>(null)
  const [showPass, setShowPass] = useState<Record<number,boolean>>({})
  const [resetPassId, setResetPassId] = useState<number|null>(null)

  const showToast = (msg:string, type:'ok'|'err'='ok') => {
    setToast({msg,type})
    setTimeout(()=>setToast(null),3000)
  }

  useEffect(() => {
    setLiveClients(clients)
  }, [clients])

  const handleKYC = (id:number, action:'accept'|'reject') => {
    setKycAction(p=>({...p,[id]:action}))
    setClients(prev=>{
      const next = prev.map(c=>c.id===id?{...c,status:action==='accept'?'active':'inactive'}:c)
      setLiveClients(next)
      return next
    })
    showToast(action==='accept'?'✅ تم قبول العميل بنجاح':'❌ تم رفض طلب العميل')
  }

  const handleDeleteClient = (id:number) => {
    setClients(prev=>{
      const next = prev.filter(c=>c.id!==id)
      setLiveClients(next)
      return next
    })
    setDeleteConfirmId(null)
    showToast('🗑️ تم حذف العميل بنجاح')
  }

  const handleToggleAccountStatus = (id:number) => {
    setAccounts(prev=>prev.map(a=>a.id===id?{...a,status:a.status==='active'?'suspended':'active'}:a))
    showToast('✅ تم تحديث حالة الحساب')
  }

  const handleResetPassword = (id:number) => {
    const newPass = generatePassword()
    setAccounts(prev=>prev.map(a=>a.id===id?{...a,password:newPass}:a))
    setResetPassId(id)
    setTimeout(()=>setResetPassId(null),3000)
    showToast('🔑 تم إعادة تعيين كلمة المرور')
  }

  // Create Account form state
  const [form, setForm] = useState({
    clientId: '',
    customClientName: '',
    email: '',
    password: generatePassword(),
    sendEmail: true,
    status: 'active',
    customStatus: '',
    note: '',
  })
  const [formSaved, setFormSaved] = useState(false)

  const filtered = clients.filter(c => {
    if (search && !c.name.includes(search) && !c.email.includes(search) && !c.city.includes(search)) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (catFilter !== 'all' && c.category !== catFilter) return false
    return true
  })

  const filteredAccounts = accounts.filter(a =>
    !accountSearch || a.name.includes(accountSearch) || a.email.includes(accountSearch)
  )

  const tabs = [
    {key:'all',label:'الكل',count:clients.length},
    {key:'active',label:'نشط',count:clients.filter(c=>c.status==='active').length},
    {key:'pending',label:'معلق',count:clients.filter(c=>c.status==='pending').length},
    {key:'frozen',label:'مجمد',count:clients.filter(c=>c.status==='frozen').length},
  ]

  const stats = [
    {label:'إجمالي العملاء',value:clients.length,icon:'👥',color:'#3B82F6'},
    {label:'عملاء نشطون',value:clients.filter(c=>c.status==='active').length,icon:'✅',color:'#00D97E'},
    {label:'حسابات مفعّلة',value:accounts.filter(a=>a.status==='active').length,icon:'🔑',color:'#0EA5E9'},
    {label:'إجمالي المحافظ',value:'$' + (clients.reduce((s,c)=>s+c.portfolio,0)/1000).toFixed(0) + 'K',icon:'💰',color:'#C9A84C'},
  ]

  const toggleSelect = (id:number) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])

  const copyToClipboard = (text:string, id:number) => {
    navigator.clipboard.writeText(text).then(()=>{
      setCopiedId(id)
      setTimeout(()=>setCopiedId(null),2000)
    })
  }

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date().toISOString().split('T')[0]
    const isCustom = form.clientId === 'custom'
    const clientName = isCustom ? form.customClientName : clients.find(c => c.id.toString() === form.clientId)?.name || ''
    const accountStatus = form.status === 'custom' ? (form.customStatus || 'active') : form.status

    let linkedClientId: number

    if (isCustom) {
      // إنشاء عميل جديد وإضافته للقائمة
      const newClientId = Date.now()
      const newClient = {
        id: newClientId,
        name: form.customClientName,
        email: form.email,
        phone: '',
        country: '🌍',
        city: '',
        advisor: 'أحمد المشرف',
        portfolio: 0,
        status: accountStatus as string,
        category: 'standard',
        joined: today,
        lastActive: 'اليوم',
      }
      const updatedClients = [...clients, newClient]
      setClients(updatedClients)
      setLiveClients(updatedClients)
      linkedClientId = newClientId
    } else {
      linkedClientId = parseInt(form.clientId)
    }

    // إنشاء حساب دخول جديد
    const portfolioNum = accounts.length + 1
    const newAccount = {
      id: Date.now() + 1,
      clientId: linkedClientId,
      name: clientName,
      email: form.email,
      password: form.password,
      phone: clients.find(c => c.id === linkedClientId)?.phone || '',
      status: accountStatus,
      portfolioCode: `PF-${String(portfolioNum).padStart(3, '0')}`,
      createdAt: today,
      createdBy: 'أحمد المشرف',
      lastLogin: '—',
    }
    setAccounts(prev => [...prev, newAccount])

    showToast(isCustom
      ? `✅ تم إنشاء العميل "${clientName}" وحساب الدخول بنجاح`
      : `✅ تم إنشاء حساب دخول لـ "${clientName}" بنجاح`
    )

    // إعادة تعيين النموذج
    setForm({ clientId: '', customClientName: '', email: '', password: generatePassword(), sendEmail: true, status: 'active', customStatus: '', note: '' })
    setFormSaved(true)
    setTimeout(() => { setFormSaved(false); setMainTab('accounts') }, 1800)
  }

  const mainTabs = [
    {key:'list',label:'📋 قائمة العملاء',count:clients.length},
    {key:'accounts',label:'🔑 حسابات الدخول',count:accounts.length},
    {key:'create_account',label:'➕ إنشاء حساب جديد'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>إدارة العملاء والحسابات</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>
            {mockClients.length} عميل مسجل — {mockClientAccounts.filter(a=>a.status==='active').length} حساب دخول نشط
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'transparent',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem'}}>
            <Download size={13}/> تصدير
          </button>
          <button
            onClick={()=>setMainTab('create_account')}
            style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <UserPlus size={14}/> إنشاء حساب عميل
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {stats.map((s,i) => (
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.3rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:10,padding:4,width:'fit-content'}}>
        {mainTabs.map(t=>(
          <button key={t.key} onClick={()=>setMainTab(t.key as any)}
            style={{padding:'8px 18px',background:mainTab===t.key?'#FFFFFF':'transparent',border:'none',borderRadius:7,
              color:mainTab===t.key?'#0EA5E9':'#64748B',fontSize:'0.8rem',fontWeight:mainTab===t.key?700:500,
              cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',gap:6,
              boxShadow:mainTab===t.key?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all 0.15s',whiteSpace:'nowrap'}}>
            {t.label}
            {(t as any).count !== undefined && (
              <span style={{background:mainTab===t.key?'rgba(14,165,233,0.15)':'#E2E8F0',color:mainTab===t.key?'#0EA5E9':'#64748B',borderRadius:8,padding:'1px 7px',fontSize:'0.62rem',fontWeight:700}}>
                {(t as any).count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========== TAB 1: CLIENT LIST ========== */}
      {mainTab === 'list' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* KYC Pending */}
          {clients.filter(c=>c.status==='pending').length > 0 && (
            <div style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:12,padding:'12px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span>⚠️</span>
                  <span style={{fontSize:'0.82rem',fontWeight:700,color:'#F59E0B'}}>طلبات KYC معلقة</span>
                  <span style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B',borderRadius:10,padding:'2px 8px',fontSize:'0.65rem',fontWeight:700}}>
                    {clients.filter(c=>c.status==='pending').length}
                  </span>
                </div>
                <button style={{fontSize:'0.72rem',color:'#F59E0B',background:'none',border:'1px solid rgba(245,158,11,0.3)',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>مراجعة الكل</button>
              </div>
              <div style={{display:'flex',gap:10}}>
                {clients.filter(c=>c.status==='pending').slice(0,3).map(c=>(
                  <div key={c.id} style={{flex:1,background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                    <div>
                      <div style={{fontSize:'0.78rem',fontWeight:600,color:'#1E293B'}}>{c.name}</div>
                      <div style={{fontSize:'0.65rem',color:'#64748B',marginTop:2}}>{c.country} {c.city} · {c.joined}</div>
                    </div>
                    {kycAction[c.id] ? (
                      <span style={{fontSize:'0.7rem',fontWeight:700,color:kycAction[c.id]==='accept'?'#00D97E':'#FF4560'}}>
                        {kycAction[c.id]==='accept'?'✅ مقبول':'❌ مرفوض'}
                      </span>
                    ) : (
                      <div style={{display:'flex',gap:5}}>
                        <button onClick={()=>handleKYC(c.id,'accept')} style={{padding:'4px 9px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:5,color:'#00D97E',fontSize:'0.65rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>قبول</button>
                        <button onClick={()=>handleKYC(c.id,'reject')} style={{padding:'4px 9px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:5,color:'#FF4560',fontSize:'0.65rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>رفض</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div style={C.card}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:8,padding:3}}>
                {tabs.map(t=>(
                  <button key={t.key} onClick={()=>setStatusFilter(t.key)}
                    style={{padding:'5px 12px',background:statusFilter===t.key?'#F8FAFC':'transparent',border:'none',borderRadius:6,
                      color:statusFilter===t.key?'#1E293B':'#64748B',fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",
                      display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap'}}>
                    {t.label}
                    <span style={{background:statusFilter===t.key?'rgba(14,165,233,0.2)':'#E2E8F0',color:statusFilter===t.key?'#0EA5E9':'#64748B',borderRadius:8,padding:'1px 6px',fontSize:'0.6rem'}}>{t.count}</span>
                  </button>
                ))}
              </div>
              <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'7px 12px'}}>
                <Search size={13} color="#64748B"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم، البريد، المدينة..."
                  style={{background:'none',border:'none',outline:'none',color:'#1E293B',fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",flex:1}}/>
              </div>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                style={{padding:'7px 10px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
                <option value="all">كل الفئات</option>
                <option value="VIP">VIP</option>
                <option value="premium">بريميوم</option>
                <option value="standard">عادي</option>
              </select>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                <thead>
                  <tr>
                    <th style={{...C.th,width:40}}><input type="checkbox" style={{cursor:'pointer'}}/></th>
                    {['العميل','التواصل','الدولة / المدينة','المستشار','المحفظة','الفئة','الحالة','آخر نشاط',''].map(h=>(
                      <th key={h} style={C.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c=>(
                    <tr key={c.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.1s',cursor:'pointer'}}>
                      <td style={C.td}><input type="checkbox" checked={selected.includes(c.id)} onChange={()=>toggleSelect(c.id)} style={{cursor:'pointer'}}/></td>
                      <td style={C.td}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#BAE6FD,#7DD3FC)',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,color:'#0EA5E9',flexShrink:0}}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{fontSize:'0.82rem',fontWeight:600,color:'#1E293B'}}>{c.name}</div>
                            <div style={{fontSize:'0.65rem',color:'#64748B'}}>ID: {c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={C.td}>
                        <div style={{fontSize:'0.72rem',color:'#64748B'}}>{c.email}</div>
                        <div style={{fontSize:'0.72rem',color:'#64748B',marginTop:2,fontFamily:'monospace'}}>{c.phone}</div>
                      </td>
                      <td style={C.td}><span style={{fontSize:'0.82rem'}}>{c.country}</span> <span style={{fontSize:'0.78rem',color:'#1E293B'}}>{c.city}</span></td>
                      <td style={C.td}><span style={{fontSize:'0.78rem',color:'#1E293B'}}>{c.advisor}</span></td>
                      <td style={C.td}><span style={{fontFamily:'monospace',fontWeight:700,color:'#0EA5E9',fontSize:'0.82rem'}}>${c.portfolio.toLocaleString()}</span></td>
                      <td style={C.td}>
                        <span style={{...catMap[c.category],borderRadius:20,padding:'3px 10px',fontSize:'0.68rem',fontWeight:700}}>{c.category.toUpperCase()}</span>
                      </td>
                      <td style={C.td}>
                        <span style={{...statusMap[c.status],borderRadius:20,padding:'3px 10px',fontSize:'0.68rem',fontWeight:600}}>{statusLabels[c.status]}</span>
                      </td>
                      <td style={{...C.td,fontSize:'0.72rem',color:'#64748B',whiteSpace:'nowrap'}}>{c.lastActive}</td>
                      <td style={C.td}>
                        <div style={{display:'flex',gap:5}}>
                          <button onClick={()=>setViewClient(c)} style={{width:28,height:28,background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#3B82F6'}} title="عرض"><Eye size={12}/></button>
                          <button onClick={()=>setEditClient(c)} style={{width:28,height:28,background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#0EA5E9'}} title="تعديل"><Edit size={12}/></button>
                          <button onClick={()=>{ setForm(f=>({...f,clientId:c.id.toString(),email:c.email.replace('@email.com','@tharwah.com')})); setMainTab('create_account') }}
                            style={{width:28,height:28,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A84C'}} title="إنشاء حساب دخول">
                            <Key size={12}/>
                          </button>
                          <button onClick={()=>setDeleteConfirmId(c.id)} style={{width:28,height:28,background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF4560'}} title="حذف"><Trash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:'12px 16px',borderTop:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:'0.72rem',color:'#64748B'}}>عرض {filtered.length} من {mockClients.length} عميل</span>
              <div style={{display:'flex',gap:4}}>
                {[1,2,3].map(p=>(
                  <button key={p} style={{width:28,height:28,background:p===1?'rgba(14,165,233,0.15)':'transparent',border:`1px solid ${p===1?'rgba(14,165,233,0.3)':'#E2E8F0'}`,borderRadius:6,color:p===1?'#0EA5E9':'#64748B',fontSize:'0.75rem',cursor:'pointer'}}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== TAB 2: LOGIN ACCOUNTS ========== */}
      {mainTab === 'accounts' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'rgba(14,165,233,0.06)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:12,padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}>
            <Shield size={16} color="#0EA5E9" />
            <span style={{fontSize:'0.82rem',color:'#0EA5E9',fontWeight:600}}>بيانات الدخول السرية — مرئية فقط للمشرفين ذوي الصلاحيات العليا</span>
          </div>

          <div style={C.card}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:12}}>
              <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'7px 12px'}}>
                <Search size={13} color="#64748B"/>
                <input value={accountSearch} onChange={e=>setAccountSearch(e.target.value)} placeholder="بحث بالاسم أو البريد الإلكتروني..."
                  style={{background:'none',border:'none',outline:'none',color:'#1E293B',fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",flex:1}}/>
              </div>
              <button onClick={()=>setMainTab('create_account')}
                style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFF',fontWeight:700,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",whiteSpace:'nowrap'}}>
                <Plus size={13}/> حساب جديد
              </button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                <thead>
                  <tr>
                    {['العميل','كود المحفظة','البريد الإلكتروني','كلمة المرور','الحالة','تاريخ الإنشاء','آخر دخول','أنشأه','إجراءات'].map(h=>(
                      <th key={h} style={C.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(a=>(
                    <tr key={a.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{transition:'background 0.1s'}}>
                      <td style={C.td}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',fontWeight:700,color:'#FFF',flexShrink:0}}>
                            {a.name.charAt(0)}
                          </div>
                          <span style={{fontSize:'0.82rem',fontWeight:600,color:'#1E293B'}}>{a.name}</span>
                        </div>
                      </td>
                      <td style={C.td}>
                        <span style={{fontFamily:'monospace',fontSize:'0.78rem',fontWeight:700,color:'#C9A84C',background:'rgba(201,168,76,0.1)',padding:'3px 8px',borderRadius:6}}>{a.portfolioCode}</span>
                      </td>
                      <td style={C.td}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{fontFamily:'monospace',fontSize:'0.78rem',color:'#1E293B'}}>{a.email}</span>
                          <button onClick={()=>copyToClipboard(a.email,a.id*10)}
                            style={{width:22,height:22,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:4,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B',padding:0}}>
                            {copiedId===a.id*10?<Check size={11} color="#00D97E"/>:<Copy size={11}/>}
                          </button>
                        </div>
                      </td>
                      <td style={C.td}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{fontFamily:'monospace',fontSize:'0.78rem',color:'#1E293B',letterSpacing:1}}>
                            {showPass[a.id] ? a.password : '••••••••••'}
                          </span>
                          <button onClick={()=>setShowPass(s=>({...s,[a.id]:!s[a.id]}))}
                            style={{width:22,height:22,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:4,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B',padding:0,fontSize:'0.6rem'}}>
                            {showPass[a.id]?'🙈':'👁'}
                          </button>
                          {showPass[a.id] && (
                            <button onClick={()=>copyToClipboard(a.password,a.id*100)}
                              style={{width:22,height:22,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:4,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748B',padding:0}}>
                              {copiedId===a.id*100?<Check size={11} color="#00D97E"/>:<Copy size={11}/>}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={C.td}>
                        <span style={{...accountStatusMap[a.status],borderRadius:20,padding:'3px 10px',fontSize:'0.68rem',fontWeight:600}}>
                          {accountStatusMap[a.status]?.label||a.status}
                        </span>
                      </td>
                      <td style={{...C.td,fontSize:'0.72rem',color:'#64748B',whiteSpace:'nowrap'}}>{a.createdAt}</td>
                      <td style={{...C.td,fontSize:'0.72rem',color:'#64748B',whiteSpace:'nowrap'}}>{a.lastLogin}</td>
                      <td style={{...C.td,fontSize:'0.72rem',color:'#64748B'}}>{a.createdBy}</td>
                      <td style={C.td}>
                        <div style={{display:'flex',gap:4}}>
                          <button title="تعديل" style={{width:26,height:26,background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:5,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#0EA5E9'}}><Edit size={11}/></button>
                          <button title="إعادة تعيين كلمة المرور" onClick={()=>handleResetPassword(a.id)}
                            style={{width:26,height:26,background:resetPassId===a.id?'rgba(0,217,126,0.15)':'rgba(245,158,11,0.1)',border:`1px solid ${resetPassId===a.id?'rgba(0,217,126,0.3)':'rgba(245,158,11,0.2)'}`,borderRadius:5,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:resetPassId===a.id?'#00D97E':'#F59E0B'}}>
                            {resetPassId===a.id?<Check size={11}/>:<RefreshCw size={11}/>}
                          </button>
                          <button title={a.status==='active'?'إيقاف الحساب':'تفعيل الحساب'} onClick={()=>handleToggleAccountStatus(a.id)}
                            style={{width:26,height:26,background:a.status==='active'?'rgba(255,69,96,0.1)':'rgba(0,217,126,0.1)',border:`1px solid ${a.status==='active'?'rgba(255,69,96,0.2)':'rgba(0,217,126,0.2)'}`,borderRadius:5,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:a.status==='active'?'#FF4560':'#00D97E'}}>
                            {a.status==='active'?<Trash2 size={11}/>:<Check size={11}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:'12px 16px',borderTop:'1px solid #E2E8F0'}}>
              <span style={{fontSize:'0.72rem',color:'#64748B'}}>{filteredAccounts.length} حساب</span>
            </div>
          </div>
        </div>
      )}

      {/* ========== TAB 3: CREATE ACCOUNT ========== */}
      {mainTab === 'create_account' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Disclaimer */}
          <div style={{background:'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(14,165,233,0.08))',border:'1px solid rgba(201,168,76,0.3)',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{fontSize:'1.3rem',flexShrink:0}}>⚠️</span>
            <div>
              <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B',marginBottom:4}}>إنشاء حساب بوابة العملاء</div>
              <div style={{fontSize:'0.78rem',color:'#475569',lineHeight:1.7}}>
                هذا الحساب سيتيح للعميل الوصول إلى <strong>بوابة العملاء</strong> ورؤية محفظته الاستثمارية. تأكد من صحة البيانات قبل الحفظ.
                كلمة المرور يجب إرسالها للعميل عبر قناة آمنة.
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {/* Form */}
            <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:24}}>
              <div style={{fontSize:'0.95rem',fontWeight:700,color:'#1E293B',marginBottom:20,display:'flex',alignItems:'center',gap:8}}>
                <UserPlus size={18} color="#0EA5E9" /> بيانات الحساب الجديد
              </div>
              <form onSubmit={handleSaveAccount} style={{display:'flex',flexDirection:'column',gap:18}}>
                <div>
                  <label style={C.label}>العميل المرتبط *</label>
                  <select
                    value={form.clientId}
                    onChange={e => {
                      const val = e.target.value
                      setForm(f => ({
                        ...f,
                        clientId: val,
                        customClientName: val !== 'custom' ? '' : f.customClientName,
                        email: val !== 'custom' && val !== ''
                          ? clients.find(c => c.id.toString() === val)?.email.replace('@email.com','@tharwah.com') || f.email
                          : f.email,
                      }))
                    }}
                    style={{...C.input,cursor:'pointer'}}
                    required={form.clientId !== 'custom'}
                  >
                    <option value="">-- اختر العميل --</option>
                    {clients.map(c=>(
                      <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                    ))}
                    <option value="custom">✏️ إنشاء عميل جديد / إدخال اسم مخصص</option>
                  </select>
                  {form.clientId === 'custom' && (
                    <div style={{marginTop:8}}>
                      <input
                        value={form.customClientName}
                        onChange={e=>setForm(f=>({...f,customClientName:e.target.value}))}
                        placeholder="اكتب اسم العميل الجديد..."
                        style={{...C.input,borderColor:'#C9A84C',background:'rgba(201,168,76,0.05)'}}
                        required
                        autoFocus
                      />
                      <div style={{fontSize:'0.68rem',color:'#C9A84C',marginTop:4}}>
                        ✏️ أدخل اسم العميل الجديد يدوياً
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label style={C.label}>البريد الإلكتروني لتسجيل الدخول *</label>
                  <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    placeholder="client@tharwah.com" style={C.input} required />
                  <div style={{fontSize:'0.68rem',color:'#64748B',marginTop:4}}>يُنصح باستخدام نطاق @tharwah.com</div>
                </div>
                <div>
                  <label style={C.label}>كلمة المرور *</label>
                  <div style={{display:'flex',gap:8}}>
                    <input type="text" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                      style={{...C.input,fontFamily:'monospace',flex:1}} required />
                    <button type="button" onClick={()=>setForm(f=>({...f,password:generatePassword()}))}
                      style={{padding:'9px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,cursor:'pointer',color:'#64748B',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <RefreshCw size={14}/>
                    </button>
                    <button type="button" onClick={()=>copyToClipboard(form.password,9999)}
                      style={{padding:'9px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,cursor:'pointer',color:'#64748B',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      {copiedId===9999?<Check size={14} color="#00D97E"/>:<Copy size={14}/>}
                    </button>
                  </div>
                  <div style={{fontSize:'0.68rem',color:'#64748B',marginTop:4}}>يُنصح بكلمة مرور قوية لا تقل عن 8 أحرف تشمل أرقام ورموز</div>
                </div>
                <div>
                  <label style={C.label}>حالة الحساب</label>
                  <select
                    value={form.status}
                    onChange={e => {
                      const val = e.target.value
                      setForm(f => ({...f, status: val, customStatus: val !== 'custom' ? '' : f.customStatus}))
                    }}
                    style={{...C.input,cursor:'pointer'}}
                  >
                    <option value="active">نشط — يستطيع الدخول فوراً</option>
                    <option value="pending">معلق — بانتظار التفعيل</option>
                    <option value="suspended">موقوف مؤقتاً</option>
                    <option value="custom">✏️ حالة مخصصة</option>
                  </select>
                  {form.status === 'custom' && (
                    <div style={{marginTop:8}}>
                      <input
                        value={form.customStatus}
                        onChange={e=>setForm(f=>({...f,customStatus:e.target.value}))}
                        placeholder="اكتب الحالة المخصصة..."
                        style={{...C.input,borderColor:'#8B5CF6',background:'rgba(139,92,246,0.05)'}}
                        autoFocus
                      />
                      <div style={{fontSize:'0.68rem',color:'#8B5CF6',marginTop:4}}>✏️ أدخل الحالة يدوياً</div>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{...C.label,display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                    <input type="checkbox" checked={form.sendEmail} onChange={e=>setForm(f=>({...f,sendEmail:e.target.checked}))}
                      style={{width:16,height:16,cursor:'pointer'}}/>
                    <span>إرسال بيانات الدخول للعميل عبر البريد الإلكتروني</span>
                  </label>
                </div>
                <div>
                  <label style={C.label}>ملاحظة للسجل</label>
                  <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
                    placeholder="ملاحظات اختيارية تُحفظ في سجل النشاط..."
                    rows={3}
                    style={{...C.input,resize:'vertical',lineHeight:1.7}}/>
                </div>
                <div style={{display:'flex',gap:10,marginTop:4}}>
                  <button type="submit"
                    style={{flex:1,padding:'11px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFF',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                    {formSaved ? <><Check size={16}/> تم الحفظ!</> : <><Key size={15}/> إنشاء الحساب</>}
                  </button>
                  <button type="button" onClick={()=>setMainTab('list')}
                    style={{padding:'11px 20px',background:'transparent',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                    إلغاء
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Card */}
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>معاينة كارت الحساب</div>
                <div style={{background:'linear-gradient(135deg,#1E293B,#0F172A)',borderRadius:12,padding:20,color:'#FFF',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(201,168,76,0.15)'}}/>
                  <div style={{position:'absolute',bottom:-30,left:-30,width:120,height:120,borderRadius:'50%',background:'rgba(14,165,233,0.1)'}}/>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                    <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#C9A84C,#F5D485)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',fontWeight:800,color:'#1E293B'}}>ر</div>
                    <div>
                      <div style={{fontSize:'0.75rem',fontWeight:800,letterSpacing:'1px',opacity:0.9}}>الثروة كابيتال</div>
                      <div style={{fontSize:'0.6rem',opacity:0.6}}>بوابة العملاء</div>
                    </div>
                  </div>
                  <div style={{fontSize:'0.75rem',opacity:0.6,marginBottom:4}}>الاسم</div>
                  <div style={{fontSize:'1rem',fontWeight:700,marginBottom:12}}>
                    {form.clientId === 'custom'
                      ? (form.customClientName || 'عميل جديد...')
                      : form.clientId
                        ? clients.find(c=>c.id.toString()===form.clientId)?.name||'—'
                        : 'اختر العميل'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div>
                      <div style={{fontSize:'0.65rem',opacity:0.6,marginBottom:3}}>البريد الإلكتروني</div>
                      <div style={{fontSize:'0.72rem',fontFamily:'monospace'}}>{form.email||'—'}</div>
                    </div>
                    <div>
                      <div style={{fontSize:'0.65rem',opacity:0.6,marginBottom:3}}>كلمة المرور</div>
                      <div style={{fontSize:'0.72rem',fontFamily:'monospace'}}>{'•'.repeat(Math.min(form.password.length,10))}</div>
                    </div>
                  </div>
                  <div style={{marginTop:14,padding:'8px 12px',background:'rgba(255,255,255,0.08)',borderRadius:8,fontSize:'0.68rem',opacity:0.8}}>
                    🔗 رابط الدخول: tharwahcapital.com/login
                  </div>
                </div>
              </div>

              <div style={{background:'rgba(0,217,126,0.06)',border:'1px solid rgba(0,217,126,0.2)',borderRadius:12,padding:16}}>
                <div style={{fontSize:'0.8rem',fontWeight:700,color:'#00D97E',marginBottom:8}}>✅ بعد إنشاء الحساب:</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {[
                    'سيتمكن العميل من الدخول عبر صفحة /login',
                    'سيرى أيقونة ملفه الشخصي في شريط الموقع',
                    'سيصل إلى لوحة محفظته عبر /dashboard',
                    'ستُرسل له بيانات الدخول إذا اخترت الإرسال',
                  ].map((item,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:'0.75rem',color:'#475569'}}>
                      <span style={{color:'#00D97E',flexShrink:0,marginTop:2}}>•</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewClient && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setViewClient(null)}>
          <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:16,width:560,maxHeight:'80vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:'0.9rem',fontWeight:700,color:'#1E293B'}}>ملف العميل</div>
              <button onClick={()=>setViewClient(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24}}>
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',fontWeight:800,color:'#FFFFFF'}}>{viewClient.name.charAt(0)}</div>
                <div>
                  <div style={{fontSize:'1.1rem',fontWeight:800,color:'#1E293B'}}>{viewClient.name}</div>
                  <div style={{display:'flex',gap:8,marginTop:4}}>
                    <span style={{...catMap[viewClient.category],borderRadius:20,padding:'2px 10px',fontSize:'0.68rem',fontWeight:700}}>{viewClient.category.toUpperCase()}</span>
                    <span style={{...statusMap[viewClient.status],borderRadius:20,padding:'2px 10px',fontSize:'0.68rem',fontWeight:600}}>{statusLabels[viewClient.status]}</span>
                  </div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {[
                  {label:'البريد الإلكتروني',value:viewClient.email},
                  {label:'الهاتف',value:viewClient.phone},
                  {label:'الدولة',value:viewClient.country + ' ' + viewClient.city},
                  {label:'المستشار',value:viewClient.advisor},
                  {label:'قيمة المحفظة',value:'$'+viewClient.portfolio.toLocaleString()},
                  {label:'تاريخ الانضمام',value:viewClient.joined},
                  {label:'آخر نشاط',value:viewClient.lastActive},
                  {label:'معرف العميل',value:'#'+viewClient.id},
                ].map(f=>(
                  <div key={f.label} style={{background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:'0.65rem',color:'#64748B',fontWeight:600,marginBottom:4}}>{f.label}</div>
                    <div style={{fontSize:'0.82rem',color:'#1E293B',fontFamily:f.label.includes('معرف')||f.label.includes('المحفظة')||f.label.includes('الهاتف')?'monospace':'inherit'}}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8,marginTop:16}}>
                <button onClick={()=>{ setEditClient(viewClient); setViewClient(null) }}
                  style={{flex:1,padding:'10px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFF',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>تعديل البيانات</button>
                <button onClick={()=>{ setForm(f=>({...f,clientId:viewClient.id.toString(),email:viewClient.email.replace('@email.com','@tharwah.com')})); setViewClient(null); setMainTab('create_account') }}
                  style={{flex:1,padding:'10px',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:8,color:'#C9A84C',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>
                  🔑 إنشاء حساب
                </button>
                <button onClick={()=>{ showToast('📄 تم تجهيز التقرير بنجاح'); setViewClient(null) }}
                  style={{flex:1,padding:'10px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:8,color:'#00D97E',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>📊 تقرير</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId !== null && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#FFFFFF',borderRadius:16,padding:28,width:360,textAlign:'center',boxShadow:'0 25px 50px rgba(0,0,0,0.2)'}}>
            <div style={{fontSize:'2rem',marginBottom:12}}>🗑️</div>
            <div style={{fontSize:'1rem',fontWeight:800,color:'#1E293B',marginBottom:8}}>تأكيد الحذف</div>
            <div style={{fontSize:'0.82rem',color:'#64748B',marginBottom:22}}>
              هل أنت متأكد من حذف العميل؟ لا يمكن التراجع عن هذا الإجراء.
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setDeleteConfirmId(null)}
                style={{flex:1,padding:'10px',border:'1px solid #E2E8F0',borderRadius:9,background:'#F8FAFC',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:600,fontSize:'0.83rem',color:'#64748B'}}>
                إلغاء
              </button>
              <button onClick={()=>handleDeleteClient(deleteConfirmId)}
                style={{flex:1,padding:'10px',border:'none',borderRadius:9,background:'linear-gradient(135deg,#EF4444,#DC2626)',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:'0.83rem',color:'#FFF'}}>
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Client Modal ── */}
      {editClient !== null && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:'#FFFFFF',borderRadius:16,padding:28,width:'100%',maxWidth:540,boxShadow:'0 25px 50px rgba(0,0,0,0.2)',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div style={{fontWeight:800,fontSize:'1rem',color:'#1E293B'}}>تعديل بيانات العميل</div>
              <button onClick={()=>setEditClient(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#94A3B8'}}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[
                {k:'name',l:'الاسم الكامل'},
                {k:'email',l:'البريد الإلكتروني'},
                {k:'phone',l:'رقم الهاتف'},
                {k:'city',l:'المدينة'},
                {k:'advisor',l:'المستشار'},
              ].map(f=>(
                <div key={f.k}>
                  <label style={{display:'block',fontSize:'0.72rem',fontWeight:700,color:'#475569',marginBottom:5}}>{f.l}</label>
                  <input value={(editClient as any)[f.k]} onChange={e=>setEditClient((prev:any)=>({...prev,[f.k]:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',outline:'none',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box'}}/>
                </div>
              ))}
              <div>
                <label style={{display:'block',fontSize:'0.72rem',fontWeight:700,color:'#475569',marginBottom:5}}>الحالة</label>
                <select value={editClient.status} onChange={e=>setEditClient((prev:any)=>({...prev,status:e.target.value}))}
                  style={{width:'100%',padding:'9px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
                  <option value="active">نشط</option>
                  <option value="pending">معلق</option>
                  <option value="frozen">مجمد</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:20}}>
              <button onClick={()=>setEditClient(null)}
                style={{flex:1,padding:'10px',border:'1px solid #E2E8F0',borderRadius:9,background:'#F8FAFC',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:600,fontSize:'0.83rem',color:'#64748B'}}>
                إلغاء
              </button>
              <button onClick={()=>{
                setClients(prev=>prev.map(c=>c.id===editClient.id?{...editClient}:c))
                setEditClient(null)
                showToast('✅ تم حفظ التعديلات بنجاح')
              }}
                style={{flex:1,padding:'10px',border:'none',borderRadius:9,background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:'0.83rem',color:'#FFF'}}>
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{position:'fixed',bottom:28,right:28,zIndex:300,padding:'12px 20px',borderRadius:12,
          background: toast.type==='ok' ? '#1E293B' : '#EF4444',
          color:'#FFF',fontWeight:700,fontSize:'0.83rem',boxShadow:'0 8px 30px rgba(0,0,0,0.2)',
          fontFamily:"'Cairo',sans-serif",animation:'slideUp .3s ease'}}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
