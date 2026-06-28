import { useState, useEffect } from 'react'
import { Search, Plus, X, RefreshCw } from 'lucide-react'
import { getTransactions, createTransaction, updateTransaction, getClients, type Transaction, type Client } from '../../../lib/api'

const C = {
  card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' } as React.CSSProperties,
  th: { padding:'11px 14px', textAlign:'right' as const, fontSize:'0.7rem', fontWeight:600, color:'#64748B', borderBottom:'1px solid #E2E8F0', background:'#F1F5F9', whiteSpace:'nowrap' as const },
  td: { padding:'12px 14px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', verticalAlign:'middle' as const },
}

const typeMap: Record<string,{bg:string;color:string;label:string}> = {
  buy:      {bg:'rgba(0,217,126,0.1)',   color:'#00D97E',  label:'شراء'},
  sell:     {bg:'rgba(255,69,96,0.1)',   color:'#FF4560',  label:'بيع'},
  transfer: {bg:'rgba(59,130,246,0.1)', color:'#3B82F6',  label:'تحويل'},
  deposit:  {bg:'rgba(14,165,233,0.1)', color:'#0EA5E9',  label:'إيداع'},
  withdraw: {bg:'rgba(245,158,11,0.1)', color:'#F59E0B',  label:'سحب'},
}

const statusMap: Record<string,{bg:string;color:string;label:string}> = {
  completed: {bg:'rgba(0,217,126,0.1)',  color:'#00D97E', label:'مكتمل'},
  pending:   {bg:'rgba(245,158,11,0.1)', color:'#F59E0B', label:'معلق'},
  rejected:  {bg:'rgba(255,69,96,0.1)',  color:'#FF4560', label:'مرفوض'},
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // form
  const [txType, setTxType] = useState<string>('buy')
  const [clientId, setClientId] = useState('')
  const [customClientName, setCustomClientName] = useState('')
  const [clientMode, setClientMode] = useState<'select'|'custom'>('select')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('SAR')
  const [notes, setNotes] = useState('')

  const showToast = (msg:string, type:'ok'|'err'='ok') => {
    setToast({msg, type})
    setTimeout(()=>setToast(null), 3500)
  }

  const load = async () => {
    setLoading(true)
    try {
      const [txRes, clRes] = await Promise.all([
        getTransactions(),
        getClients({ limit: 200 }),
      ])
      setTransactions(txRes.transactions || [])
      setClients(clRes.clients || [])
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'فشل التحميل', 'err')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = transactions.filter(tx => {
    const clientName = tx.clients?.name ?? ''
    if (search && !clientName.includes(search) && !tx.reference?.includes(search)) return false
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false
    return true
  })

  const handleApprove = async (id: string) => {
    try {
      await updateTransaction(id, { status: 'completed' })
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t))
      showToast('✅ تمت الموافقة على العملية')
    } catch { showToast('فشل التحديث', 'err') }
  }

  const handleReject = async (id: string) => {
    try {
      await updateTransaction(id, { status: 'rejected' })
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t))
      showToast('❌ تم رفض العملية')
    } catch { showToast('فشل التحديث', 'err') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const resolvedClientId = clientMode === 'select' ? clientId : ''
    if (!resolvedClientId && clientMode === 'select') { showToast('اختر العميل', 'err'); return }
    if (!amount) { showToast('أدخل المبلغ', 'err'); return }
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = { type: txType, amount: parseFloat(amount), currency, notes, status: 'pending' }
      if (clientMode === 'select') body.client_id = resolvedClientId
      else body.notes = `${customClientName}: ${notes}`
      const { transaction } = await createTransaction(body)
      setTransactions(prev => [transaction, ...prev])
      setShowModal(false)
      setAmount(''); setNotes(''); setClientId(''); setCustomClientName('')
      showToast('✅ تم إضافة العملية بنجاح')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'فشل الإضافة', 'err')
    } finally {
      setSubmitting(false)
    }
  }

  const pendingTx = transactions.filter(t => t.status === 'pending')

  const summaryCards = [
    {label:'إجمالي العمليات', value:transactions.length.toString(), icon:'📋', color:'#3B82F6'},
    {label:'معلقة',           value:pendingTx.length.toString(),    icon:'⏳', color:'#F59E0B'},
    {label:'مكتملة',          value:transactions.filter(t=>t.status==='completed').length.toString(), icon:'✅', color:'#00D97E'},
    {label:'مرفوضة',          value:transactions.filter(t=>t.status==='rejected').length.toString(),  icon:'❌', color:'#FF4560'},
    {label:'شراء',            value:transactions.filter(t=>t.type==='buy').length.toString(),    icon:'📈', color:'#00D97E'},
    {label:'بيع',             value:transactions.filter(t=>t.type==='sell').length.toString(),   icon:'📉', color:'#FF4560'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {toast && (
        <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',zIndex:9999,padding:'12px 24px',borderRadius:10,background:toast.type==='ok'?'#00D97E':'#FF4560',color:'#fff',fontWeight:700,fontSize:'0.85rem',boxShadow:'0 4px 20px rgba(0,0,0,0.15)'}}>
          {toast.msg}
        </div>
      )}

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>العمليات والصفقات</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{transactions.length} عملية مسجلة</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={load} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem'}}>
            <RefreshCw size={13}/> تحديث
          </button>
          <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> إضافة عملية
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:14}}>
        {summaryCards.map((c,i) => (
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{c.label}</span>
              <span style={{fontSize:'1rem'}}>{c.icon}</span>
            </div>
            <div style={{fontSize:'1.4rem',fontWeight:800,color:c.color,fontFamily:'monospace',lineHeight:1,marginBottom:2}}>{c.value}</div>
          </div>
        ))}
      </div>

      {pendingTx.length > 0 && (
        <div style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:12,padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <span>⏳</span>
            <span style={{fontSize:'0.85rem',fontWeight:700,color:'#F59E0B'}}>عمليات تنتظر الموافقة</span>
            <span style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B',borderRadius:10,padding:'2px 8px',fontSize:'0.65rem',fontWeight:700}}>{pendingTx.length}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {pendingTx.slice(0,5).map(tx => (
              <div key={tx.id} style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
                  <span style={{...(typeMap[tx.type]||typeMap.buy),borderRadius:20,padding:'3px 10px',fontSize:'0.7rem',fontWeight:700}}>{typeMap[tx.type]?.label ?? tx.type}</span>
                  <span style={{fontSize:'0.82rem',color:'#1E293B',fontWeight:600}}>{tx.clients?.name ?? '—'}</span>
                  <span style={{fontSize:'0.82rem',color:'#0EA5E9',fontFamily:'monospace',fontWeight:700}}>{tx.currency} {tx.amount?.toLocaleString()}</span>
                  {tx.reference && <span style={{fontSize:'0.72rem',color:'#94A3B8'}}>{tx.reference}</span>}
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>handleApprove(tx.id)} style={{padding:'5px 12px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:6,color:'#00D97E',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✓ موافقة</button>
                  <button onClick={()=>handleReject(tx.id)} style={{padding:'5px 12px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:6,color:'#FF4560',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✕ رفض</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={C.card}>
        <div style={{padding:'12px 14px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:8,padding:3}}>
            {[{k:'all',l:'الكل'},{k:'buy',l:'شراء'},{k:'sell',l:'بيع'},{k:'transfer',l:'تحويل'},{k:'deposit',l:'إيداع'},{k:'withdraw',l:'سحب'}].map(t => (
              <button key={t.k} onClick={()=>setTypeFilter(t.k)} style={{padding:'5px 10px',background:typeFilter===t.k?'#F8FAFC':'transparent',border:'none',borderRadius:6,color:typeFilter===t.k?'#1E293B':'#64748B',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:8,padding:3}}>
            {[{k:'all',l:'كل الحالات'},{k:'completed',l:'مكتمل'},{k:'pending',l:'معلق'},{k:'rejected',l:'مرفوض'}].map(t => (
              <button key={t.k} onClick={()=>setStatusFilter(t.k)} style={{padding:'5px 10px',background:statusFilter===t.k?'#F8FAFC':'transparent',border:'none',borderRadius:6,color:statusFilter===t.k?'#1E293B':'#64748B',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
            ))}
          </div>
          <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,padding:'7px 12px'}}>
            <Search size={13} color="#64748B"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالعميل أو المرجع..." style={{background:'none',border:'none',outline:'none',color:'#1E293B',fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",flex:1}}/>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          {loading ? (
            <div style={{padding:40,textAlign:'center',color:'#64748B'}}>⏳ جارٍ التحميل...</div>
          ) : (
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr>{['#','النوع','العميل','المبلغ','العملة','المرجع','الحالة','التاريخ','إجراء'].map(h=>(
                <th key={h} style={C.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{padding:40,textAlign:'center',color:'#94A3B8'}}>لا توجد عمليات</td></tr>
              ) : filtered.map(tx => (
                <tr key={tx.id}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{...C.td,fontFamily:'monospace',color:'#94A3B8',fontSize:'0.72rem'}}>{tx.reference ?? tx.id.slice(0,8)}</td>
                  <td style={C.td}><span style={{...(typeMap[tx.type]||typeMap.buy),borderRadius:20,padding:'3px 9px',fontSize:'0.68rem',fontWeight:700}}>{typeMap[tx.type]?.label ?? tx.type}</span></td>
                  <td style={C.td}>{tx.clients?.name ?? '—'}</td>
                  <td style={{...C.td,fontFamily:'monospace',fontWeight:700,color:'#0EA5E9'}}>{tx.amount?.toLocaleString() ?? '—'}</td>
                  <td style={C.td}>{tx.currency ?? '—'}</td>
                  <td style={{...C.td,fontFamily:'monospace',fontSize:'0.72rem',color:'#64748B'}}>{tx.reference ?? '—'}</td>
                  <td style={C.td}><span style={{...(statusMap[tx.status]||statusMap.pending),borderRadius:20,padding:'3px 9px',fontSize:'0.68rem',fontWeight:600}}>{statusMap[tx.status]?.label ?? tx.status}</span></td>
                  <td style={{...C.td,fontSize:'0.7rem',color:'#64748B',whiteSpace:'nowrap'}}>{new Date(tx.created_at).toLocaleDateString('ar-SA')}</td>
                  <td style={C.td}>
                    {tx.status === 'pending' ? (
                      <div style={{display:'flex',gap:4}}>
                        <button onClick={()=>handleApprove(tx.id)} style={{padding:'3px 8px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:5,color:'#00D97E',fontSize:'0.62rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✓</button>
                        <button onClick={()=>handleReject(tx.id)} style={{padding:'3px 8px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:5,color:'#FF4560',fontSize:'0.62rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✕</button>
                      </div>
                    ) : (
                      <span style={{fontSize:'0.65rem',color:'#94A3B8'}}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <div style={{padding:'10px 14px',borderTop:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'0.7rem',color:'#64748B'}}>إجمالي {filtered.length} عملية</span>
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowModal(false)}>
          <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:16,width:520,padding:0,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#fff',zIndex:1}}>
              <span style={{fontWeight:700,fontSize:'0.9rem',color:'#1E293B'}}>إضافة عملية جديدة</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',display:'flex'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'flex',gap:8}}>
                {(['buy','sell','transfer','deposit','withdraw']).map(t => (
                  <button key={t} type="button" onClick={()=>setTxType(t)} style={{flex:1,padding:'8px 4px',background:txType===t?(typeMap[t]?.bg||'rgba(14,165,233,0.1)'):'#F1F5F9',border:`1px solid ${txType===t?(typeMap[t]?.color+'55'||'rgba(14,165,233,0.3)'):'#E2E8F0'}`,borderRadius:8,color:txType===t?(typeMap[t]?.color||'#0EA5E9'):'#64748B',fontWeight:txType===t?700:400,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.72rem'}}>
                    {typeMap[t]?.label ?? t}
                  </button>
                ))}
              </div>

              <div>
                <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>العميل</div>
                <select value={clientMode==='custom'?'__custom__':clientId} onChange={e=>{
                  if(e.target.value==='__custom__'){setClientMode('custom');setClientId('')}
                  else{setClientMode('select');setClientId(e.target.value);setCustomClientName('')}
                }} style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none',cursor:'pointer'}}>
                  <option value="">-- اختر العميل --</option>
                  {clients.map(c=><option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                  <option value="__custom__">✏️ إدخال اسم مخصص</option>
                </select>
                {clientMode==='custom' && (
                  <input value={customClientName} onChange={e=>setCustomClientName(e.target.value)} placeholder="اكتب اسم العميل..."
                    style={{marginTop:8,width:'100%',padding:'10px 12px',background:'rgba(201,168,76,0.05)',border:'1px solid #C9A84C',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}} autoFocus/>
                )}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>المبلغ</div>
                  <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="10000" min="0" step="0.01"
                    style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}}/>
                </div>
                <div>
                  <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>العملة</div>
                  <select value={currency} onChange={e=>setCurrency(e.target.value)}
                    style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none',cursor:'pointer'}}>
                    {['SAR','USD','AED','EUR','GBP','KWD'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>ملاحظات</div>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="ملاحظات اختيارية..."
                  style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none',resize:'vertical'}}/>
              </div>

              <button type="submit" disabled={submitting} style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:submitting?'not-allowed':'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem',opacity:submitting?0.7:1}}>
                {submitting ? '⏳ جارٍ الإضافة...' : '✓ تأكيد العملية'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
