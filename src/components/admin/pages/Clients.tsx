import { useState } from 'react'
import { Search, Plus, Download, Filter, X, ChevronDown, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { mockClients, statusLabels } from '../adminData'

const C = {
  card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' } as React.CSSProperties,
  th: { padding:'11px 14px', textAlign:'right' as const, fontSize:'0.7rem', fontWeight:600, color:'#64748B', borderBottom:'1px solid #E2E8F0', background:'#F1F5F9', whiteSpace:'nowrap' as const, cursor:'pointer' },
  td: { padding:'12px 14px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', verticalAlign:'middle' as const },
}

const statusMap: Record<string,{bg:string;color:string}> = {
  active:{bg:'rgba(0,217,126,0.1)',color:'#00D97E'},
  pending:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B'},
  frozen:{bg:'rgba(59,130,246,0.1)',color:'#3B82F6'},
  inactive:{bg:'rgba(255,69,96,0.1)',color:'#FF4560'},
}

const catMap: Record<string,{bg:string;color:string}> = {
  VIP:{bg:'rgba(14,165,233,0.15)',color:'#0EA5E9'},
  premium:{bg:'rgba(139,92,246,0.15)',color:'#8B5CF6'},
  standard:{bg:'rgba(107,132,168,0.15)',color:'#64748B'},
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [selected, setSelected] = useState<number[]>([])
  const [viewClient, setViewClient] = useState<typeof mockClients[0]|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [sort, setSort] = useState<{field:string;dir:'asc'|'desc'}>({field:'name',dir:'asc'})

  const filtered = mockClients.filter(c => {
    if (search && !c.name.includes(search) && !c.email.includes(search) && !c.city.includes(search)) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (catFilter !== 'all' && c.category !== catFilter) return false
    return true
  })

  const tabs = [
    {key:'all',label:'الكل',count:mockClients.length},
    {key:'active',label:'نشط',count:mockClients.filter(c=>c.status==='active').length},
    {key:'pending',label:'معلق',count:mockClients.filter(c=>c.status==='pending').length},
    {key:'frozen',label:'مجمد',count:mockClients.filter(c=>c.status==='frozen').length},
  ]

  const stats = [
    {label:'إجمالي العملاء',value:mockClients.length,icon:'👥',color:'#3B82F6'},
    {label:'عملاء نشطون',value:mockClients.filter(c=>c.status==='active').length,icon:'✅',color:'#00D97E'},
    {label:'VIP',value:mockClients.filter(c=>c.category==='VIP').length,icon:'👑',color:'#0EA5E9'},
    {label:'إجمالي المحافظ',value:'$' + (mockClients.reduce((s,c)=>s+c.portfolio,0)/1000).toFixed(0) + 'K',icon:'💰',color:'#0EA5E9'},
  ]

  const toggleSelect = (id:number) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>إدارة العملاء</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{mockClients.length} عميل مسجل — {mockClients.filter(c=>c.status==='active').length} نشط</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'transparent',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem'}}>
            <Download size={13}/> تصدير
          </button>
          <button onClick={()=>setShowAdd(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> إضافة عميل
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

      {/* KYC Pending Section */}
      <div style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:12,padding:'12px 16px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span>⚠️</span>
            <span style={{fontSize:'0.82rem',fontWeight:700,color:'#F59E0B'}}>طلبات KYC معلقة</span>
            <span style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B',borderRadius:10,padding:'2px 8px',fontSize:'0.65rem',fontWeight:700}}>3</span>
          </div>
          <button style={{fontSize:'0.72rem',color:'#F59E0B',background:'none',border:'1px solid rgba(245,158,11,0.3)',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>مراجعة الكل</button>
        </div>
        <div style={{display:'flex',gap:10}}>
          {mockClients.filter(c=>c.status==='pending').slice(0,3).map(c => (
            <div key={c.id} style={{flex:1,background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
              <div>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#1E293B'}}>{c.name}</div>
                <div style={{fontSize:'0.65rem',color:'#64748B',marginTop:2}}>{c.country} {c.city} · {c.joined}</div>
              </div>
              <div style={{display:'flex',gap:5}}>
                <button style={{padding:'4px 9px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:5,color:'#00D97E',fontSize:'0.65rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>قبول</button>
                <button style={{padding:'4px 9px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:5,color:'#FF4560',fontSize:'0.65rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>رفض</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={C.card}>
        {/* Toolbar */}
        <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          {/* Tabs */}
          <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:8,padding:3}}>
            {tabs.map(t => (
              <button key={t.key} onClick={()=>setStatusFilter(t.key)} style={{padding:'5px 12px',background: statusFilter===t.key ? '#F8FAFC' : 'transparent',border:'none',borderRadius:6,color: statusFilter===t.key ? '#1E293B' : '#64748B',fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap'}}>
                {t.label}
                <span style={{background: statusFilter===t.key ? 'rgba(14,165,233,0.2)' : '#E2E8F0',color: statusFilter===t.key ? '#0EA5E9' : '#64748B',borderRadius:8,padding:'1px 6px',fontSize:'0.6rem'}}>{t.count}</span>
              </button>
            ))}
          </div>

          <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'7px 12px'}}>
            <Search size={13} color="#64748B"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم، البريد، المدينة..." style={{background:'none',border:'none',outline:'none',color:'#1E293B',fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",flex:1}}/>
          </div>

          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:'7px 10px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <option value="all">كل الفئات</option>
            <option value="VIP">VIP</option>
            <option value="premium">بريميوم</option>
            <option value="standard">عادي</option>
          </select>

          {selected.length > 0 && (
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <span style={{fontSize:'0.72rem',color:'#64748B'}}>{selected.length} محدد</span>
              <button style={{padding:'5px 10px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:6,color:'#FF4560',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>حذف</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
            <thead>
              <tr>
                <th style={{...C.th,width:40}}><input type="checkbox" style={{cursor:'pointer'}}/></th>
                {['العميل','التواصل','الدولة / المدينة','المستشار','المحفظة','الفئة','الحالة','آخر نشاط',''].map(h => (
                  <th key={h} style={C.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  style={{transition:'background 0.1s',cursor:'pointer'}}>
                  <td style={C.td}><input type="checkbox" checked={selected.includes(c.id)} onChange={()=>toggleSelect(c.id)} style={{cursor:'pointer'}}/></td>
                  <td style={C.td}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#E2E8F0,#0A1628)',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,color:'#0EA5E9',flexShrink:0}}>
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
                      <button onClick={()=>setViewClient(c)} style={{width:28,height:28,background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#3B82F6'}}><Eye size={12}/></button>
                      <button style={{width:28,height:28,background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#0EA5E9'}}><Edit size={12}/></button>
                      <button style={{width:28,height:28,background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF4560'}}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{padding:'12px 16px',borderTop:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'0.72rem',color:'#64748B'}}>عرض {filtered.length} من {mockClients.length} عميل</span>
          <div style={{display:'flex',gap:4}}>
            {[1,2,3].map(p => (
              <button key={p} style={{width:28,height:28,background: p===1 ? 'rgba(14,165,233,0.15)' : 'transparent',border:`1px solid ${p===1 ? 'rgba(14,165,233,0.3)' : '#E2E8F0'}`,borderRadius:6,color: p===1 ? '#0EA5E9' : '#64748B',fontSize:'0.75rem',cursor:'pointer'}}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewClient && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,14,26,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setViewClient(null)}>
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
                ].map(f => (
                  <div key={f.label} style={{background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:'0.65rem',color:'#64748B',fontWeight:600,marginBottom:4}}>{f.label}</div>
                    <div style={{fontSize:'0.82rem',color:'#1E293B',fontFamily: f.label.includes('معرف')||f.label.includes('المحفظة')||f.label.includes('الهاتف') ? 'monospace' : 'inherit'}}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8,marginTop:16}}>
                <button style={{flex:1,padding:'10px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>تعديل البيانات</button>
                <button style={{flex:1,padding:'10px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:8,color:'#3B82F6',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>📧 مراسلة</button>
                <button style={{flex:1,padding:'10px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:8,color:'#00D97E',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>📊 تقرير</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
