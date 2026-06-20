import { useState } from 'react'
import { mockPortfolios, mockClients, mockClientAccounts, STOCKS_SA_LIST, STOCKS_GLOBAL_LIST, CRYPTO_LIST, FOREX_PAIRS_LIST, METALS_LIST, OIL_TYPES_LIST, BANKS_SA_LIST } from '../adminData'
import { Plus, Trash2, ChevronDown, ChevronUp, Check, Upload } from 'lucide-react'

const assetColors: Record<string,string> = { stocks:'#3B82F6', crypto:'#F59E0B', metals:'#9CA3AF', oil:'#EF4444' }

const C = {
  card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' } as React.CSSProperties,
  input: { width:'100%', padding:'9px 12px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:'0.82rem', outline:'none', fontFamily:"'Cairo',sans-serif", boxSizing:'border-box' as const },
  label: { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#475569', marginBottom:5 } as React.CSSProperties,
  section: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12 } as React.CSSProperties,
  sectionHeader: { padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', userSelect:'none' as const },
}

interface StockRow { code:string; name:string; qty:string; price:string; notes:string }
interface CryptoRow { symbol:string; qty:string; avgPrice:string }
interface ForexRow { pair:string; lots:string; direction:string; avgPrice:string }
interface MetalRow { metal:string; weight:string; unit:string; avgPrice:string }
interface OilRow { type:string; contracts:string; avgPrice:string }

function SectionCard({ title, icon, open, onToggle, children }: { title:string; icon:string; open:boolean; onToggle:()=>void; children:React.ReactNode }) {
  return (
    <div style={C.section}>
      <div style={C.sectionHeader} onClick={onToggle}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:'1.1rem'}}>{icon}</span>
          <span style={{fontSize:'0.88rem',fontWeight:700,color:'#1E293B'}}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color="#64748B"/> : <ChevronDown size={16} color="#64748B"/>}
      </div>
      {open && <div style={{padding:'0 18px 18px',borderTop:'1px solid #E2E8F0',paddingTop:16}}>{children}</div>}
    </div>
  )
}

function InvestmentTable<T extends Record<string,string>>({
  rows, onAdd, onRemove, onChange, columns
}: {
  rows:T[]; onAdd:()=>void; onRemove:(i:number)=>void; onChange:(i:number,k:keyof T,v:string)=>void;
  columns:{key:keyof T;label:string;type?:'select'|'text';options?:string[]}[]
}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {rows.length > 0 && (
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                {columns.map(c=>(
                  <th key={String(c.key)} style={{padding:'8px 10px',textAlign:'right',fontSize:'0.68rem',fontWeight:700,color:'#64748B',background:'#F1F5F9',borderBottom:'1px solid #E2E8F0',whiteSpace:'nowrap'}}>{c.label}</th>
                ))}
                <th style={{padding:'8px 10px',background:'#F1F5F9',borderBottom:'1px solid #E2E8F0',width:36}}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row,i)=>(
                <tr key={i} style={{borderBottom:'1px solid rgba(203,213,225,0.5)'}}>
                  {columns.map(col=>(
                    <td key={String(col.key)} style={{padding:'6px 8px'}}>
                      {col.type==='select' && col.options ? (
                        <select value={row[col.key]} onChange={e=>onChange(i,col.key,e.target.value)}
                          style={{...C.input,padding:'6px 8px',cursor:'pointer',minWidth:130}}>
                          <option value="">اختر</option>
                          {col.options.map(o=><option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type="text" value={row[col.key]} onChange={e=>onChange(i,col.key,e.target.value)}
                          style={{...C.input,padding:'6px 8px',minWidth:80}}/>
                      )}
                    </td>
                  ))}
                  <td style={{padding:'6px 8px'}}>
                    <button type="button" onClick={()=>onRemove(i)}
                      style={{width:28,height:28,background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF4560',padding:0}}>
                      <Trash2 size={12}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="button" onClick={onAdd}
        style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.06)',border:'1px dashed rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem',width:'fit-content'}}>
        <Plus size={13}/> إضافة سطر
      </button>
    </div>
  )
}

export default function Portfolios() {
  const [mainTab, setMainTab] = useState<'list'|'create'>('list')

  // Portfolio list state
  const [viewMode, setViewMode] = useState<'grid'|'table'>('grid')

  const totalAUM = mockPortfolios.reduce((s,p)=>s+p.total,0)
  const summaryCards = [
    {label:'إجمالي المحافظ',value:mockPortfolios.length.toString(),icon:'📁',color:'#3B82F6'},
    {label:'إجمالي AUM',value:'$' + (totalAUM/1000).toFixed(0)+'K',icon:'💰',color:'#0EA5E9'},
    {label:'متوسط العائد',value:'+19.4%',icon:'📈',color:'#00D97E'},
    {label:'أعلى أداء',value:[...mockPortfolios].sort((a,b)=>b.return-a.return)[0]?.clientName.split(' ')[0]||'',icon:'🏆',color:'#F59E0B'},
  ]

  // ===== Create Portfolio Form State =====
  const [openSections, setOpenSections] = useState({personal:true,financial:false,investments:false,banking:false,docs:false,notes:false})
  const [investTab, setInvestTab] = useState<'sa'|'gulf'|'global'|'crypto'|'forex'|'metals'|'oil'>('sa')
  const [saved, setSaved] = useState(false)

  const toggleSection = (k: keyof typeof openSections) =>
    setOpenSections(s=>({...s,[k]:!s[k]}))

  // Personal
  const [personal, setPersonal] = useState({
    clientId:'', portfolioCode:'', advisor:'', openDate:'', riskLevel:'متوسط',
    investmentGoal:'نمو رأس المال', investmentHorizon:'5 سنوات', currency:'USD',
    fullName:'', nationality:'سعودي', idType:'هوية وطنية', idNumber:'', idExpiry:'',
    phone:'', altPhone:'', email:'', address:'', city:'', country:'السعودية',
  })

  // Financial
  const [financial, setFinancial] = useState({
    initialCapital:'', monthlyAddition:'', annualIncome:'', netWorth:'',
    otherInvestments:'', monthlyExpenses:'', liquidReserve:'',
    riskTolerance:'متوسط', maxLoss:'20', previousExp:'نعم',
    taxResident:'السعودية', usCitizen:'لا', fatca:'غير منطبق',
  })

  // Investments - rows per type
  const [saStocks, setSaStocks] = useState<StockRow[]>([])
  const [gulfStocks, setGulfStocks] = useState<StockRow[]>([])
  const [globalStocks, setGlobalStocks] = useState<StockRow[]>([])
  const [cryptoRows, setCryptoRows] = useState<CryptoRow[]>([])
  const [forexRows, setForexRows] = useState<ForexRow[]>([])
  const [metalRows, setMetalRows] = useState<MetalRow[]>([])
  const [oilRows, setOilRows] = useState<OilRow[]>([])

  // Banking
  const [banking, setBanking] = useState({
    bankName:'', iban:'', accountName:'', branch:'', swiftCode:'',
    secondBankName:'', secondIBAN:'', secondAccountName:'',
    transferMethod:'حوالة بنكية', depositFrequency:'شهري',
  })

  // Docs
  const [docs, setDocs] = useState({
    idCopy:false, addressProof:false, bankStatement:false,
    taxForm:false, riskForm:false, contractSigned:false,
    kycStatus:'مكتمل', verificationDate:'', verifiedBy:'',
  })

  // Notes
  const [adminNotes, setAdminNotes] = useState({
    internalNotes:'', specialConditions:'', feeOverride:'',
    priorityLevel:'عادي', tags:'', followUpDate:'',
  })

  const makeRowUpdater = <T extends Record<string,string>>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
    (i: number, k: keyof T, v: string) => setter(rows => rows.map((r,idx)=>idx===i?{...r,[k]:v}:r))

  const makeRowRemover = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
    (i: number) => setter(rows => rows.filter((_,idx)=>idx!==i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(()=>{ setSaved(false); setMainTab('list') }, 2500)
  }

  const investTabs = [
    {key:'sa',label:'🇸🇦 أسهم سعودية',count:saStocks.length},
    {key:'gulf',label:'🌍 أسهم خليجية',count:gulfStocks.length},
    {key:'global',label:'🌐 أسهم عالمية',count:globalStocks.length},
    {key:'crypto',label:'₿ رقمية',count:cryptoRows.length},
    {key:'forex',label:'💱 فوركس',count:forexRows.length},
    {key:'metals',label:'💎 معادن',count:metalRows.length},
    {key:'oil',label:'⛽ نفط',count:oilRows.length},
  ]

  const saOptions = STOCKS_SA_LIST.map(s=>`${s.code} - ${s.name}`)
  const globalOptions = STOCKS_GLOBAL_LIST.map(s=>`${s.code} - ${s.name} (${s.exchange})`)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>المحافظ الاستثمارية</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{mockPortfolios.length} محفظة — إجمالي AUM: ${(totalAUM/1000).toFixed(0)}K</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {mainTab==='list' && (
            <>
              {[{k:'grid',l:'بطاقات'},{k:'table',l:'جدول'}].map(m=>(
                <button key={m.k} onClick={()=>setViewMode(m.k as any)}
                  style={{padding:'7px 14px',background:viewMode===m.k?'rgba(14,165,233,0.15)':'transparent',border:`1px solid ${viewMode===m.k?'rgba(14,165,233,0.3)':'#E2E8F0'}`,borderRadius:8,color:viewMode===m.k?'#0EA5E9':'#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{m.l}</button>
              ))}
            </>
          )}
          <button onClick={()=>setMainTab(mainTab==='list'?'create':'list')}
            style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:mainTab==='create'?'rgba(14,165,233,0.1)':'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:mainTab==='create'?'1px solid rgba(14,165,233,0.3)':'none',borderRadius:8,color:mainTab==='create'?'#0EA5E9':'#FFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            {mainTab==='create'?'← قائمة المحافظ':<><Plus size={14}/> إنشاء محفظة جديدة</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {summaryCards.map((s,i)=>(
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.3rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ========== PORTFOLIO LIST ========== */}
      {mainTab === 'list' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
            <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>ترتيب الأداء</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[...mockPortfolios].sort((a,b)=>b.return-a.return).map((p,i)=>(
                <div key={p.clientId} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 14px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:10}}>
                  <span style={{fontSize:'1.1rem',flexShrink:0}}>{i===0?'🥇':i===1?'🥈':'🥉'}</span>
                  <span style={{fontSize:'0.85rem',fontWeight:600,color:'#1E293B',flex:1}}>{p.clientName}</span>
                  <span style={{fontSize:'0.78rem',color:'#64748B',fontFamily:'monospace'}}>AUM: ${p.total.toLocaleString()}</span>
                  <span style={{fontSize:'0.85rem',fontWeight:700,color:'#00D97E',fontFamily:'monospace'}}>+{p.return}%</span>
                  <div style={{width:100,height:6,background:'#CBD5E1',borderRadius:3}}>
                    <div style={{height:'100%',width:`${(p.return/25)*100}%`,background:'linear-gradient(90deg,#00D97E,#00B87E)',borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {mockPortfolios.map(p=>(
              <div key={p.clientId} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
                <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',fontWeight:700,color:'#FFF',flexShrink:0}}>{p.clientName.charAt(0)}</div>
                    <div>
                      <div style={{fontSize:'0.82rem',fontWeight:700,color:'#1E293B'}}>{p.clientName}</div>
                      <div style={{fontSize:'0.65rem',color:'#64748B'}}>{p.advisor}</div>
                    </div>
                  </div>
                  <span style={{fontSize:'0.78rem',fontWeight:700,color:'#00D97E'}}>+{p.return}%</span>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                    <span style={{fontSize:'0.72rem',color:'#64748B'}}>إجمالي المحفظة</span>
                    <span style={{fontSize:'1rem',fontWeight:800,color:'#0EA5E9',fontFamily:'monospace'}}>${p.total.toLocaleString()}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {p.assets.map((a,ai)=>(
                      <div key={ai} style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:assetColors[a.type]||'#64748B',flexShrink:0}}/>
                        <span style={{fontSize:'0.72rem',color:'#1E293B',flex:1}}>{a.name}</span>
                        <span style={{fontSize:'0.7rem',color:'#64748B',fontFamily:'monospace'}}>${a.value.toLocaleString()}</span>
                        <span style={{fontSize:'0.68rem',fontWeight:600,color:a.change>=0?'#00D97E':'#FF4560',fontFamily:'monospace'}}>{a.change>=0?'+':''}{a.change}%</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:12,height:6,background:'#CBD5E1',borderRadius:3,overflow:'hidden',display:'flex'}}>
                    {p.assets.map((a,ai)=>(
                      <div key={ai} style={{height:'100%',flex:a.value/p.total,background:assetColors[a.type]||'#64748B'}}/>
                    ))}
                  </div>
                  <div style={{marginTop:10,display:'flex',gap:6}}>
                    <button style={{flex:1,padding:'7px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📊 تقرير</button>
                    <button style={{flex:1,padding:'7px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:7,color:'#0EA5E9',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✏️ تعديل</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== CREATE PORTFOLIO FORM ========== */}
      {mainTab === 'create' && (
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Disclaimer */}
          <div style={{background:'linear-gradient(135deg,rgba(255,69,96,0.06),rgba(245,158,11,0.06))',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{fontSize:'1.3rem',flexShrink:0}}>⚠️</span>
            <div>
              <div style={{fontSize:'0.88rem',fontWeight:700,color:'#1E293B',marginBottom:4}}>إشعار مهم — نموذج إنشاء محفظة استثمارية</div>
              <div style={{fontSize:'0.78rem',color:'#475569',lineHeight:1.8}}>
                جميع البيانات المدخلة <strong>سرية وخاضعة لأحكام الخصوصية</strong>. تأكد من دقة المعلومات قبل الحفظ.
                لا يُعدّ هذا النموذج وحده عقداً استثمارياً — يجب توقيع اتفاقية منفصلة.
              </div>
            </div>
          </div>

          {/* ── SECTION 1: Personal Info ── */}
          <SectionCard title="البيانات الشخصية والأساسية" icon="👤" open={openSections.personal} onToggle={()=>toggleSection('personal')}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              <div>
                <label style={C.label}>العميل المرتبط *</label>
                <select value={personal.clientId} onChange={e=>setPersonal(s=>({...s,clientId:e.target.value}))} style={{...C.input,cursor:'pointer'}} required>
                  <option value="">-- اختر العميل --</option>
                  {mockClients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>كود المحفظة *</label>
                <input value={personal.portfolioCode} onChange={e=>setPersonal(s=>({...s,portfolioCode:e.target.value}))}
                  placeholder="PF-007" style={C.input} required/>
              </div>
              <div>
                <label style={C.label}>المستشار المسؤول</label>
                <select value={personal.advisor} onChange={e=>setPersonal(s=>({...s,advisor:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  <option value="">اختر</option>
                  {['أحمد العمري','خالد محمد','سارة الزهراني'].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>الاسم الكامل</label>
                <input value={personal.fullName} onChange={e=>setPersonal(s=>({...s,fullName:e.target.value}))} placeholder="كما في الهوية" style={C.input}/>
              </div>
              <div>
                <label style={C.label}>الجنسية</label>
                <input value={personal.nationality} onChange={e=>setPersonal(s=>({...s,nationality:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>نوع الهوية</label>
                <select value={personal.idType} onChange={e=>setPersonal(s=>({...s,idType:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['هوية وطنية','جواز سفر','إقامة'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>رقم الهوية</label>
                <input value={personal.idNumber} onChange={e=>setPersonal(s=>({...s,idNumber:e.target.value}))} style={{...C.input,fontFamily:'monospace'}}/>
              </div>
              <div>
                <label style={C.label}>تاريخ انتهاء الهوية</label>
                <input type="date" value={personal.idExpiry} onChange={e=>setPersonal(s=>({...s,idExpiry:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>تاريخ فتح المحفظة</label>
                <input type="date" value={personal.openDate} onChange={e=>setPersonal(s=>({...s,openDate:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>الهاتف</label>
                <input value={personal.phone} onChange={e=>setPersonal(s=>({...s,phone:e.target.value}))} placeholder="+966501234567" style={{...C.input,fontFamily:'monospace'}}/>
              </div>
              <div>
                <label style={C.label}>البريد الإلكتروني</label>
                <input type="email" value={personal.email} onChange={e=>setPersonal(s=>({...s,email:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>المدينة</label>
                <input value={personal.city} onChange={e=>setPersonal(s=>({...s,city:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>مستوى المخاطرة</label>
                <select value={personal.riskLevel} onChange={e=>setPersonal(s=>({...s,riskLevel:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['منخفض','منخفض–متوسط','متوسط','متوسط–مرتفع','مرتفع'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>هدف الاستثمار</label>
                <select value={personal.investmentGoal} onChange={e=>setPersonal(s=>({...s,investmentGoal:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['نمو رأس المال','دخل دوري','الحفاظ على الثروة','التقاعد','تعليم الأبناء'].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>أفق الاستثمار</label>
                <select value={personal.investmentHorizon} onChange={e=>setPersonal(s=>({...s,investmentHorizon:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['أقل من سنة','1–3 سنوات','3–5 سنوات','5 سنوات','أكثر من 10 سنوات'].map(h=><option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>عملة المحفظة</label>
                <select value={personal.currency} onChange={e=>setPersonal(s=>({...s,currency:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['USD','SAR','AED','EUR','GBP'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── SECTION 2: Financial Status ── */}
          <SectionCard title="الوضع المالي والاستثماري" icon="💰" open={openSections.financial} onToggle={()=>toggleSection('financial')}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {[
                {k:'initialCapital',l:'رأس المال الابتدائي *',ph:'100,000'},
                {k:'monthlyAddition',l:'الإضافة الشهرية',ph:'5,000'},
                {k:'annualIncome',l:'الدخل السنوي التقريبي',ph:'200,000'},
                {k:'netWorth',l:'صافي الثروة المقدّرة',ph:'1,000,000'},
                {k:'otherInvestments',l:'استثمارات أخرى (قيمة)',ph:'500,000'},
                {k:'monthlyExpenses',l:'المصروفات الشهرية',ph:'10,000'},
                {k:'liquidReserve',l:'الاحتياطي السائل (أشهر)',ph:'6'},
                {k:'maxLoss',l:'أقصى خسارة مقبولة %',ph:'20'},
              ].map(f=>(
                <div key={f.k}>
                  <label style={C.label}>{f.l}</label>
                  <input value={(financial as any)[f.k]} onChange={e=>setFinancial(s=>({...s,[f.k]:e.target.value}))}
                    placeholder={f.ph} style={{...C.input,fontFamily:'monospace'}}/>
                </div>
              ))}
              <div>
                <label style={C.label}>تحمّل المخاطر</label>
                <select value={financial.riskTolerance} onChange={e=>setFinancial(s=>({...s,riskTolerance:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['منخفض','متوسط','مرتفع'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>خبرة استثمارية سابقة</label>
                <select value={financial.previousExp} onChange={e=>setFinancial(s=>({...s,previousExp:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['نعم','لا','محدودة'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>مقيم ضريبي في</label>
                <input value={financial.taxResident} onChange={e=>setFinancial(s=>({...s,taxResident:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>مواطن أمريكي / FATCA</label>
                <select value={financial.usCitizen} onChange={e=>setFinancial(s=>({...s,usCitizen:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['لا','نعم'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── SECTION 3: Investments ── */}
          <SectionCard title="الاستثمارات والأصول" icon="📊" open={openSections.investments} onToggle={()=>toggleSection('investments')}>
            {/* Investment sub-tabs */}
            <div style={{display:'flex',gap:2,flexWrap:'wrap',marginBottom:20,background:'#F1F5F9',borderRadius:8,padding:3}}>
              {investTabs.map(t=>(
                <button key={t.key} type="button" onClick={()=>setInvestTab(t.key as any)}
                  style={{padding:'6px 12px',background:investTab===t.key?'#FFFFFF':'transparent',border:'none',borderRadius:6,
                    color:investTab===t.key?'#0EA5E9':'#64748B',fontSize:'0.75rem',fontWeight:investTab===t.key?700:400,
                    cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',gap:5,
                    boxShadow:investTab===t.key?'0 1px 3px rgba(0,0,0,0.1)':'none',whiteSpace:'nowrap'}}>
                  {t.label}
                  {t.count > 0 && <span style={{background:'rgba(14,165,233,0.2)',color:'#0EA5E9',borderRadius:8,padding:'1px 6px',fontSize:'0.6rem',fontWeight:700}}>{t.count}</span>}
                </button>
              ))}
            </div>

            {investTab==='sa' && (
              <InvestmentTable
                rows={saStocks}
                onAdd={()=>setSaStocks(r=>[...r,{code:'',name:'',qty:'',price:'',notes:''}])}
                onRemove={makeRowRemover(setSaStocks)}
                onChange={makeRowUpdater(setSaStocks)}
                columns={[
                  {key:'code',label:'الرمز',type:'select',options:saOptions},
                  {key:'qty',label:'الكمية (أسهم)'},
                  {key:'price',label:'سعر الشراء (ر.س)'},
                  {key:'notes',label:'ملاحظة'},
                ]}
              />
            )}
            {investTab==='gulf' && (
              <InvestmentTable
                rows={gulfStocks}
                onAdd={()=>setGulfStocks(r=>[...r,{code:'',name:'',qty:'',price:'',notes:''}])}
                onRemove={makeRowRemover(setGulfStocks)}
                onChange={makeRowUpdater(setGulfStocks)}
                columns={[
                  {key:'code',label:'رمز السهم'},
                  {key:'name',label:'اسم الشركة'},
                  {key:'qty',label:'الكمية'},
                  {key:'price',label:'السعر'},
                  {key:'notes',label:'ملاحظة'},
                ]}
              />
            )}
            {investTab==='global' && (
              <InvestmentTable
                rows={globalStocks}
                onAdd={()=>setGlobalStocks(r=>[...r,{code:'',name:'',qty:'',price:'',notes:''}])}
                onRemove={makeRowRemover(setGlobalStocks)}
                onChange={makeRowUpdater(setGlobalStocks)}
                columns={[
                  {key:'code',label:'الرمز',type:'select',options:globalOptions},
                  {key:'qty',label:'الأسهم'},
                  {key:'price',label:'السعر ($)'},
                  {key:'notes',label:'ملاحظة'},
                ]}
              />
            )}
            {investTab==='crypto' && (
              <InvestmentTable
                rows={cryptoRows}
                onAdd={()=>setCryptoRows(r=>[...r,{symbol:'',qty:'',avgPrice:''}])}
                onRemove={makeRowRemover(setCryptoRows)}
                onChange={makeRowUpdater(setCryptoRows)}
                columns={[
                  {key:'symbol',label:'العملة',type:'select',options:CRYPTO_LIST},
                  {key:'qty',label:'الكمية'},
                  {key:'avgPrice',label:'متوسط السعر ($)'},
                ]}
              />
            )}
            {investTab==='forex' && (
              <InvestmentTable
                rows={forexRows}
                onAdd={()=>setForexRows(r=>[...r,{pair:'',lots:'',direction:'شراء',avgPrice:''}])}
                onRemove={makeRowRemover(setForexRows)}
                onChange={makeRowUpdater(setForexRows)}
                columns={[
                  {key:'pair',label:'الزوج',type:'select',options:FOREX_PAIRS_LIST},
                  {key:'lots',label:'اللوتات'},
                  {key:'direction',label:'الاتجاه',type:'select',options:['شراء','بيع']},
                  {key:'avgPrice',label:'متوسط السعر'},
                ]}
              />
            )}
            {investTab==='metals' && (
              <InvestmentTable
                rows={metalRows}
                onAdd={()=>setMetalRows(r=>[...r,{metal:'',weight:'',unit:'أوقية',avgPrice:''}])}
                onRemove={makeRowRemover(setMetalRows)}
                onChange={makeRowUpdater(setMetalRows)}
                columns={[
                  {key:'metal',label:'المعدن',type:'select',options:METALS_LIST},
                  {key:'weight',label:'الوزن/الكمية'},
                  {key:'unit',label:'الوحدة',type:'select',options:['أوقية','جرام','كيلو']},
                  {key:'avgPrice',label:'متوسط السعر ($)'},
                ]}
              />
            )}
            {investTab==='oil' && (
              <InvestmentTable
                rows={oilRows}
                onAdd={()=>setOilRows(r=>[...r,{type:'',contracts:'',avgPrice:''}])}
                onRemove={makeRowRemover(setOilRows)}
                onChange={makeRowUpdater(setOilRows)}
                columns={[
                  {key:'type',label:'النوع',type:'select',options:OIL_TYPES_LIST},
                  {key:'contracts',label:'العقود'},
                  {key:'avgPrice',label:'متوسط السعر ($)'},
                ]}
              />
            )}
          </SectionCard>

          {/* ── SECTION 4: Banking ── */}
          <SectionCard title="البيانات البنكية" icon="🏦" open={openSections.banking} onToggle={()=>toggleSection('banking')}>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:'0.8rem',fontWeight:700,color:'#1E293B',marginBottom:12}}>الحساب البنكي الرئيسي</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                <div>
                  <label style={C.label}>اسم البنك</label>
                  <select value={banking.bankName} onChange={e=>setBanking(s=>({...s,bankName:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                    <option value="">اختر البنك</option>
                    {BANKS_SA_LIST.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={C.label}>رقم IBAN</label>
                  <input value={banking.iban} onChange={e=>setBanking(s=>({...s,iban:e.target.value}))}
                    placeholder="SA00 0000 0000 0000 0000 0000" style={{...C.input,fontFamily:'monospace'}}/>
                </div>
                <div>
                  <label style={C.label}>اسم صاحب الحساب</label>
                  <input value={banking.accountName} onChange={e=>setBanking(s=>({...s,accountName:e.target.value}))} style={C.input}/>
                </div>
                <div>
                  <label style={C.label}>الفرع</label>
                  <input value={banking.branch} onChange={e=>setBanking(s=>({...s,branch:e.target.value}))} style={C.input}/>
                </div>
                <div>
                  <label style={C.label}>رمز SWIFT</label>
                  <input value={banking.swiftCode} onChange={e=>setBanking(s=>({...s,swiftCode:e.target.value}))}
                    style={{...C.input,fontFamily:'monospace'}}/>
                </div>
                <div>
                  <label style={C.label}>طريقة التحويل المفضلة</label>
                  <select value={banking.transferMethod} onChange={e=>setBanking(s=>({...s,transferMethod:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                    {['حوالة بنكية','SWIFT','عبر التطبيق'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{borderTop:'1px solid #E2E8F0',paddingTop:16}}>
              <div style={{fontSize:'0.8rem',fontWeight:700,color:'#1E293B',marginBottom:12}}>حساب بنكي ثانوي (اختياري)</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                <div>
                  <label style={C.label}>اسم البنك الثانوي</label>
                  <select value={banking.secondBankName} onChange={e=>setBanking(s=>({...s,secondBankName:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                    <option value="">-- اختياري --</option>
                    {BANKS_SA_LIST.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={C.label}>IBAN الثانوي</label>
                  <input value={banking.secondIBAN} onChange={e=>setBanking(s=>({...s,secondIBAN:e.target.value}))}
                    placeholder="SA00..." style={{...C.input,fontFamily:'monospace'}}/>
                </div>
                <div>
                  <label style={C.label}>اسم الحساب الثانوي</label>
                  <input value={banking.secondAccountName} onChange={e=>setBanking(s=>({...s,secondAccountName:e.target.value}))} style={C.input}/>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── SECTION 5: Documents ── */}
          <SectionCard title="المستندات والوثائق" icon="📎" open={openSections.docs} onToggle={()=>toggleSection('docs')}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
              {[
                {k:'idCopy',l:'صورة الهوية / الجواز'},
                {k:'addressProof',l:'إثبات العنوان'},
                {k:'bankStatement',l:'كشف حساب بنكي (3 أشهر)'},
                {k:'taxForm',l:'نموذج معلومات ضريبية'},
                {k:'riskForm',l:'نموذج المخاطرة الموقّع'},
                {k:'contractSigned',l:'عقد إدارة المحفظة الموقّع'},
              ].map(d=>(
                <div key={d.k} style={{background:'#FFFFFF',border:`1px solid ${(docs as any)[d.k]?'rgba(0,217,126,0.4)':'#E2E8F0'}`,borderRadius:10,padding:'14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontSize:'0.78rem',fontWeight:600,color:'#1E293B'}}>{d.l}</div>
                    <div style={{fontSize:'0.65rem',color:'#64748B',marginTop:3}}>{(docs as any)[d.k]?'✅ تم الرفع':'لم يُرفع بعد'}</div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button type="button"
                      onClick={()=>setDocs(s=>({...s,[d.k]:!(s as any)[d.k]}))}
                      style={{width:30,height:30,background:(docs as any)[d.k]?'rgba(0,217,126,0.15)':'#F1F5F9',border:`1px solid ${(docs as any)[d.k]?'rgba(0,217,126,0.3)':'#E2E8F0'}`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:(docs as any)[d.k]?'#00D97E':'#64748B',padding:0}}>
                      {(docs as any)[d.k]?<Check size={14}/>:<Upload size={14}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              <div>
                <label style={C.label}>حالة KYC</label>
                <select value={docs.kycStatus} onChange={e=>setDocs(s=>({...s,kycStatus:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['مكتمل','جزئي','معلق','مرفوض'].map(k=><option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>تاريخ التحقق</label>
                <input type="date" value={docs.verificationDate} onChange={e=>setDocs(s=>({...s,verificationDate:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>تم التحقق بواسطة</label>
                <input value={docs.verifiedBy} onChange={e=>setDocs(s=>({...s,verifiedBy:e.target.value}))} style={C.input}/>
              </div>
            </div>
          </SectionCard>

          {/* ── SECTION 6: Admin Notes ── */}
          <SectionCard title="ملاحظات المشرف الداخلية" icon="📝" open={openSections.notes} onToggle={()=>toggleSection('notes')}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div style={{gridColumn:'span 2'}}>
                <label style={C.label}>ملاحظات داخلية (لا تُشارك مع العميل)</label>
                <textarea value={adminNotes.internalNotes} onChange={e=>setAdminNotes(s=>({...s,internalNotes:e.target.value}))}
                  rows={4} placeholder="ملاحظات خاصة بالفريق..."
                  style={{...C.input,resize:'vertical',lineHeight:1.7}}/>
              </div>
              <div>
                <label style={C.label}>شروط خاصة</label>
                <textarea value={adminNotes.specialConditions} onChange={e=>setAdminNotes(s=>({...s,specialConditions:e.target.value}))}
                  rows={3} style={{...C.input,resize:'vertical',lineHeight:1.7}}/>
              </div>
              <div>
                <label style={C.label}>تعديل الرسوم (إن وجد)</label>
                <input value={adminNotes.feeOverride} onChange={e=>setAdminNotes(s=>({...s,feeOverride:e.target.value}))}
                  placeholder="مثال: 0.8% بدلاً من 1%" style={C.input}/>
              </div>
              <div>
                <label style={C.label}>مستوى الأولوية</label>
                <select value={adminNotes.priorityLevel} onChange={e=>setAdminNotes(s=>({...s,priorityLevel:e.target.value}))} style={{...C.input,cursor:'pointer'}}>
                  {['عادي','متوسط','عالٍ','VIP'].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={C.label}>تاريخ المتابعة التالية</label>
                <input type="date" value={adminNotes.followUpDate} onChange={e=>setAdminNotes(s=>({...s,followUpDate:e.target.value}))} style={C.input}/>
              </div>
              <div>
                <label style={C.label}>وسوم / Tags</label>
                <input value={adminNotes.tags} onChange={e=>setAdminNotes(s=>({...s,tags:e.target.value}))}
                  placeholder="VIP, حساس, عميل قديم..." style={C.input}/>
              </div>
            </div>
          </SectionCard>

          {/* Submit Bar */}
          <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{fontSize:'0.78rem',color:'#64748B'}}>
              يرجى مراجعة جميع البيانات قبل الحفظ. ستُحفظ المحفظة بحالة <strong>مسودة</strong> حتى تفعيلها.
            </div>
            <div style={{display:'flex',gap:10,flexShrink:0}}>
              <button type="button" onClick={()=>setMainTab('list')}
                style={{padding:'10px 20px',background:'transparent',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                إلغاء
              </button>
              <button type="submit"
                style={{padding:'10px 24px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFF',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',gap:6}}>
                {saved ? <><Check size={16}/> تم الحفظ!</> : '💾 حفظ المحفظة'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
