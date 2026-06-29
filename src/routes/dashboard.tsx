import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User, Wallet, BarChart3, Bell, Settings, LogOut, Menu, X,
  FileText, MessageSquare, Landmark, Phone, Mail,
  Shield, Copy, Check, Eye, EyeOff,
  Home, Activity,
} from "lucide-react";
import { getMyProfile, getMyPortfolio, getMyTransactions, submitContactMessage, type ClientProfile, type Portfolio, type ClientTransaction } from "../lib/api";
import { clearClientSession, getClientSession } from "../lib/auth";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

// ─── Types ───────────────────────────────────────────────────────────────────
type FV = { value: string; visible: boolean }
type FSSection = Record<string, FV>

interface PortfolioData {
  personal?: FSSection
  financial?: FSSection
  banking?: FSSection
  docs?: FSSection
  notes?: FSSection
  investments?: {
    visible?: Record<string,boolean>
    saStocks?: InvestRow[]
    gulfStocks?: InvestRow[]
    globalStocks?: InvestRow[]
    cryptoRows?: CryptoRow[]
    forexRows?: ForexRow[]
    metalRows?: MetalRow[]
    oilRows?: OilRow[]
  }
  sectionNotes?: Record<string, string>
}
interface InvestRow  { code?: string; name?: string; qty?: string; price?: string; notes?: string }
interface CryptoRow  { symbol?: string; qty?: string; avgPrice?: string }
interface ForexRow   { pair?: string; lots?: string; direction?: string; avgPrice?: string }
interface MetalRow   { metal?: string; weight?: string; unit?: string; avgPrice?: string }
interface OilRow     { type?: string; contracts?: string; avgPrice?: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const font = "'Cairo', sans-serif";
function fmtDate(d: string) { try { return new Date(d).toLocaleDateString("ar-SA") } catch { return d } }

function getVisibleFields(section: FSSection | undefined): { label: string; value: string }[] {
  if (!section) return []
  const LABELS: Record<string,string> = {
    fullName:'الاسم الكامل', nationality:'الجنسية', idType:'نوع الهوية', idNumber:'رقم الهوية',
    idExpiry:'انتهاء الهوية', phone:'الهاتف', altPhone:'هاتف بديل', email:'البريد الإلكتروني',
    address:'العنوان', city:'المدينة', country:'الدولة', openDate:'تاريخ الفتح',
    portfolioCode:'كود المحفظة', riskLevel:'مستوى المخاطرة', investmentGoal:'هدف الاستثمار',
    investmentHorizon:'أفق الاستثمار', currency:'العملة',
    initialCapital:'رأس المال الابتدائي', monthlyAddition:'الإضافة الشهرية',
    annualIncome:'الدخل السنوي', netWorth:'صافي الثروة',
    otherInvestments:'استثمارات أخرى', monthlyExpenses:'المصروفات الشهرية',
    liquidReserve:'الاحتياطي السائل', riskTolerance:'تحمّل المخاطر',
    maxLoss:'أقصى خسارة', previousExp:'خبرة سابقة',
    taxResident:'المقيم الضريبي', usCitizen:'مواطن أمريكي',
    bankName:'البنك', iban:'رقم IBAN', accountName:'اسم صاحب الحساب',
    branch:'الفرع', swiftCode:'رمز SWIFT', transferMethod:'طريقة التحويل',
    secondBankName:'البنك الثانوي', secondIBAN:'IBAN الثانوي', secondAccountName:'الحساب الثانوي',
    internalNotes:'ملاحظات', specialConditions:'شروط خاصة',
  }
  return Object.entries(section)
    .filter(([, fv]) => fv?.visible && fv?.value)
    .map(([k, fv]) => ({ label: LABELS[k] || k, value: fv.value }))
}

// ─── Components ───────────────────────────────────────────────────────────────
function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  if (items.length === 0) return <div style={{ color: '#94A3B8', fontSize: '0.82rem', textAlign: 'center', padding: '20px 0' }}>لا توجد بيانات محددة لعرضها حالياً.</div>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#1E293B', wordBreak: 'break-all' }}>{it.value}</div>
        </div>
      ))}
    </div>
  )
}

function SH({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <div style={{ fontSize: '0.97rem', fontWeight: 800, color: '#1E293B' }}>{title}</div>
    </div>
  )
}

function SectionNoteDisplay({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div style={{ marginTop: 16, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>📝 ملاحظة</div>
      <div style={{ fontSize: '0.83rem', color: '#475569', lineHeight: 1.8 }}>{text}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'info',         icon: User,         label: 'معلومات العميل' },
  { id: 'investments',  icon: BarChart3,     label: 'الاستثمارات والأصول' },
  { id: 'banking',      icon: Landmark,      label: 'البيانات البنكية' },
  { id: 'transactions', icon: FileText,      label: 'المعاملات' },
  { id: 'support',      icon: MessageSquare, label: 'التواصل' },
  { id: 'settings',     icon: Settings,      label: 'الإعدادات' },
]

function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')
  const [sideOpen, setSideOpen] = useState(false)

  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [transactions, setTransactions] = useState<ClientTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [ibanVisible, setIbanVisible] = useState<Record<string,boolean>>({})
  const [copied, setCopied] = useState<string|null>(null)
  const [supportMsg, setSupportMsg] = useState('')
  const [supportSent, setSupportSent] = useState(false)
  const [supportLoading, setSupportLoading] = useState(false)

  useEffect(() => {
    const session = getClientSession()
    if (!session) { navigate({ to: '/login' }); return }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true); setError('')
    try {
      const [pfRes, ptRes, txRes] = await Promise.all([
        getMyProfile(),
        getMyPortfolio(),
        getMyTransactions(20),
      ])
      setProfile(pfRes.client)
      setPortfolio(ptRes.portfolio)
      setTransactions(txRes.transactions || [])
    } catch (e: unknown) {
      if (e instanceof Error && e.message.toLowerCase().includes('unauthorized')) {
        clearClientSession(); navigate({ to: '/login' }); return
      }
      setError(e instanceof Error ? e.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { clearClientSession(); navigate({ to: '/login' }) }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000) })
  }

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportMsg.trim() || !profile) return
    setSupportLoading(true)
    try {
      await submitContactMessage({ name: profile.name, email: profile.email || '', message: supportMsg, source: 'client-dashboard' })
      setSupportSent(true); setSupportMsg('')
    } catch { /* ignore */ }
    finally { setSupportLoading(false) }
  }

  // portfolio data helpers
  const pd = portfolio?.portfolio_data as PortfolioData | undefined
  const sectionNotes = pd?.sectionNotes || {}

  const personalFields = [
    ...getVisibleFields(pd?.personal),
  ]
  const financialFields = getVisibleFields(pd?.financial)
  const bankingFields   = getVisibleFields(pd?.banking)
  const noteFields      = getVisibleFields(pd?.notes)

  const investData  = pd?.investments
  const investVis   = investData?.visible || {}

  const investSections = [
    { key: 'sa',     label: '🇸🇦 أسهم سعودية',  rows: investData?.saStocks?.filter(r=>r.code||r.name||r.qty),     cols: ['code','name','qty','price','notes'] as const },
    { key: 'gulf',   label: '🌍 أسهم خليجية',    rows: investData?.gulfStocks?.filter(r=>r.code||r.name||r.qty),   cols: ['code','name','qty','price','notes'] as const },
    { key: 'global', label: '🌐 أسهم عالمية',    rows: investData?.globalStocks?.filter(r=>r.code||r.name||r.qty), cols: ['code','name','qty','price','notes'] as const },
    { key: 'crypto', label: '₿ عملات رقمية',     rows: (investData?.cryptoRows as unknown as InvestRow[])?.filter(r=>(r as unknown as CryptoRow).symbol), cols: ['symbol','qty','avgPrice'] as const },
    { key: 'forex',  label: '💱 فوركس',           rows: (investData?.forexRows as unknown as InvestRow[])?.filter(r=>(r as unknown as ForexRow).pair),   cols: ['pair','lots','direction','avgPrice'] as const },
    { key: 'metals', label: '💎 معادن',            rows: (investData?.metalRows as unknown as InvestRow[])?.filter(r=>(r as unknown as MetalRow).metal),  cols: ['metal','weight','unit','avgPrice'] as const },
    { key: 'oil',    label: '⛽ نفط',              rows: (investData?.oilRows as unknown as InvestRow[])?.filter(r=>(r as unknown as OilRow).type),        cols: ['type','contracts','avgPrice'] as const },
  ].filter(s => investVis[s.key] !== false && s.rows && s.rows.length > 0)

  const colLabels: Record<string,string> = {
    code:'الرمز', name:'الاسم', qty:'الكمية', price:'السعر', notes:'ملاحظة',
    symbol:'العملة', avgPrice:'متوسط السعر', pair:'الزوج', lots:'اللوتات',
    direction:'الاتجاه', metal:'المعدن', weight:'الوزن', unit:'الوحدة',
    type:'النوع', contracts:'العقود',
  }

  const txTypeColors: Record<string,string> = {
    buy:'#00D97E', sell:'#FF4560', transfer:'#3B82F6', deposit:'#0EA5E9', withdraw:'#F59E0B',
  }
  const txTypeLabels: Record<string,string> = {
    buy:'شراء', sell:'بيع', transfer:'تحويل', deposit:'إيداع', withdraw:'سحب',
  }

  const membershipLabel = profile?.membership_level || 'عادي'
  const membershipColors: Record<string,string> = {
    'عادي':'#64748B', Silver:'#94A3B8', Gold:'#F59E0B', Platinum:'#6366F1',
    VIP:'#0EA5E9', 'VIP+':'#3B82F6', Private:'#8B5CF6', Elite:'#FF4560',
  }
  const tierColor = membershipColors[membershipLabel] || '#0EA5E9'

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily: font }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', border:'4px solid #E2E8F0', borderTopColor:'#0EA5E9', margin:'0 auto 16px', animation:'spin 1s linear infinite' }}/>
        <div style={{ color:'#64748B', fontSize:'0.9rem' }}>جارٍ تحميل بياناتك...</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily: font }}>
      <div style={{ textAlign:'center', maxWidth:380, padding:32 }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>⚠️</div>
        <div style={{ fontSize:'1rem', fontWeight:700, color:'#1E293B', marginBottom:8 }}>خطأ في تحميل البيانات</div>
        <div style={{ fontSize:'0.85rem', color:'#64748B', marginBottom:20 }}>{error}</div>
        <button onClick={loadData} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, cursor:'pointer', fontFamily: font }}>إعادة المحاولة</button>
      </div>
    </div>
  )

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#F0F4F8', display:'flex', fontFamily: font, direction:'rtl' }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        .nav-item:hover{background:rgba(14,165,233,0.08)!important;color:#0EA5E9!important}
      `}</style>

      {/* Mobile overlay */}
      {sideOpen && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:80 }} onClick={() => setSideOpen(false)} />}

      {/* Sidebar */}
      <aside style={{
        width: 220, background:'#FFFFFF', borderLeft:'1px solid #E2E8F0',
        display:'flex', flexDirection:'column', flexShrink:0, zIndex:90,
        height:'100vh', position:'sticky', top:0, overflowX:'hidden', overflowY:'auto',
      }}>
        {/* Logo */}
        <div style={{ padding:'0 14px', height:60, borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#0EA5E9,#0284C7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#1E293B' }}>ثروة كابيتال</div>
            <div style={{ fontSize:'0.6rem', color:'#0EA5E9' }}>لوحة العميل</div>
          </div>
        </div>

        {/* Client badge */}
        <div style={{ padding:'10px 14px 6px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:`${tierColor}12`, border:`1px solid ${tierColor}33`, borderRadius:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${tierColor},${tierColor}aa)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.85rem', flexShrink:0 }}>
              {(profile?.name||'?').charAt(0)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#1E293B', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{profile?.name}</div>
              <div style={{ fontSize:'0.6rem', color: tierColor, fontWeight:700 }}>{membershipLabel}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'4px 0', overflowY:'auto', scrollbarWidth:'none' }}>
          {NAV.map(item => {
            const isActive = activeTab === item.id
            return (
              <button key={item.id} className="nav-item" onClick={() => { setActiveTab(item.id); setSideOpen(false) }}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'10px 14px', background: isActive?'rgba(14,165,233,0.1)':'transparent', border:'none', borderRight:`2px solid ${isActive?'#C9A84C':'transparent'}`, borderLeft:'none', cursor:'pointer', color: isActive?'#0EA5E9':'#475569', fontSize:'0.82rem', fontWeight: isActive?700:400, fontFamily: font, textAlign:'right', transition:'all .15s' }}>
                <item.icon size={16} style={{ flexShrink:0 }}/>
                <span style={{ flex:1, whiteSpace:'nowrap' }}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid #E2E8F0' }}>
          <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:'rgba(255,69,96,0.06)', border:'1px solid rgba(255,69,96,0.15)', borderRadius:8, cursor:'pointer', color:'#FF4560', fontSize:'0.8rem', fontFamily: font }}>
            <LogOut size={14}/> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflowX:'hidden' }}>
        {/* Topbar */}
        <header style={{ height:60, background:'#FFFFFF', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:70 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => setSideOpen(!sideOpen)} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748B', display:'flex', padding:4 }}>
              {sideOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
            <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#1E293B' }}>
              {NAV.find(n=>n.id===activeTab)?.label}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {profile?.account_number && (
              <div style={{ fontSize:'0.7rem', color:'#64748B', background:'#F1F5F9', padding:'4px 10px', borderRadius:6, fontFamily:'monospace' }}>
                {profile.account_number}
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:'rgba(0,217,126,0.08)', border:'1px solid rgba(0,217,126,0.2)', borderRadius:6, fontSize:'0.7rem', color:'#00D97E' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#00D97E', display:'inline-block' }}/> مباشر
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:24, overflowY:'auto' }}>

          {/* ── معلومات العميل ── */}
          {activeTab === 'info' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Hero card */}
              <div style={{ background:'linear-gradient(135deg,#0EA5E9,#0284C7)', borderRadius:14, padding:'20px 24px', color:'#fff', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', left:-30, top:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
                <div style={{ position:'absolute', left:60, bottom:-40, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
                <div style={{ position:'relative', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:800, flexShrink:0 }}>
                    {(profile?.name||'?').charAt(0)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'1.2rem', fontWeight:800 }}>{profile?.name}</div>
                    <div style={{ fontSize:'0.78rem', opacity:0.85 }}>{profile?.email}</div>
                    {profile?.phone && <div style={{ fontSize:'0.78rem', opacity:0.8, marginTop:2 }}>{profile?.phone}</div>}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                    <span style={{ padding:'4px 14px', borderRadius:20, background:'rgba(255,255,255,0.2)', fontSize:'0.78rem', fontWeight:700 }}>{membershipLabel}</span>
                    {profile?.join_date && <span style={{ fontSize:'0.68rem', opacity:0.75 }}>منذ {fmtDate(profile.join_date)}</span>}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
                {[
                  { label:'رقم الحساب', value: profile?.account_number||'—', icon:'🔢' },
                  { label:'كود المحفظة', value: profile?.portfolio_code||'—', icon:'💼' },
                  { label:'الاستثمار الأولي', value: profile?.initial_investment||'—', icon:'💰' },
                  { label:'الحالة', value: profile?.status==='active'?'✅ نشط':profile?.status==='pending'?'⏳ قيد المراجعة':'موقوف', icon:'📋' },
                ].map(s=>(
                  <div key={s.label} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:'1.2rem' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:'0.65rem', color:'#94A3B8', fontWeight:600 }}>{s.label}</div>
                      <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#1E293B' }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal data from portfolio_data */}
              {personalFields.length > 0 && (
                <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 }}>
                  <SH icon="👤" title="البيانات الشخصية"/>
                  <InfoGrid items={personalFields}/>
                  <SectionNoteDisplay text={sectionNotes.personal}/>
                </div>
              )}

              {/* Financial data */}
              {financialFields.length > 0 && (
                <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 }}>
                  <SH icon="💰" title="الوضع المالي"/>
                  <InfoGrid items={financialFields}/>
                  <SectionNoteDisplay text={sectionNotes.financial}/>
                </div>
              )}

              {noteFields.length > 0 && (
                <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 }}>
                  <SH icon="📝" title="ملاحظات"/>
                  <InfoGrid items={noteFields}/>
                </div>
              )}

              {!portfolio && (
                <div style={{ textAlign:'center', padding:30, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, color:'#94A3B8', fontSize:'0.85rem' }}>
                  لا توجد بيانات محفظة مسجلة بعد. تواصل مع الإدارة لإعداد محفظتك.
                </div>
              )}
            </div>
          )}

          {/* ── الاستثمارات ── */}
          {activeTab === 'investments' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1E293B', margin:0 }}>الاستثمارات والأصول</h2>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:3 }}>محفظتك الاستثمارية كما حددها الفريق</p>
              </div>

              {investSections.length === 0 ? (
                <div style={{ textAlign:'center', padding:40, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, color:'#94A3B8', fontSize:'0.85rem' }}>
                  لا توجد استثمارات مُضافة حتى الآن.
                </div>
              ) : (
                investSections.map(sec => (
                  <div key={sec.key} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:'0.88rem', fontWeight:700, color:'#1E293B' }}>{sec.label}</span>
                      <span style={{ fontSize:'0.72rem', color:'#64748B' }}>{sec.rows?.length} عنصر</span>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:400 }}>
                        <thead>
                          <tr>
                            {sec.cols.filter(c => (sec.rows||[]).some(r => (r as Record<string,string>)[c])).map(c => (
                              <th key={c} style={{ padding:'8px 12px', textAlign:'right', fontSize:'0.68rem', fontWeight:700, color:'#64748B', background:'#F1F5F9', borderBottom:'1px solid #E2E8F0', whiteSpace:'nowrap' }}>
                                {colLabels[c]||c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(sec.rows||[]).map((row, i) => (
                            <tr key={i}>
                              {sec.cols.filter(c => (sec.rows||[]).some(r => (r as Record<string,string>)[c])).map(c => (
                                <td key={c} style={{ padding:'9px 12px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.5)', fontFamily: c==='code'||c==='symbol'||c==='pair'||c==='price'||c==='avgPrice'||c==='qty'||c==='lots' ? 'monospace' : font }}>
                                  {(row as Record<string,string>)[c] || '—'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
              <SectionNoteDisplay text={sectionNotes.investments}/>
            </div>
          )}

          {/* ── البيانات البنكية ── */}
          {activeTab === 'banking' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1E293B', margin:0 }}>البيانات البنكية</h2>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:3 }}>حساباتك البنكية المسجلة</p>
              </div>

              {bankingFields.length === 0 ? (
                <div style={{ textAlign:'center', padding:40, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, color:'#94A3B8', fontSize:'0.85rem' }}>
                  لا توجد بيانات بنكية مسجلة حتى الآن.
                </div>
              ) : (
                <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 }}>
                  <SH icon="🏦" title="تفاصيل الحسابات البنكية"/>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {bankingFields.map((item, i) => {
                      const isIBAN = item.label.includes('IBAN') || item.label.includes('آيبان')
                      const key = `iban_${i}`
                      const show = ibanVisible[key]
                      return (
                        <div key={i} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', marginBottom:3 }}>{item.label}</div>
                            <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#1E293B', fontFamily: isIBAN?'monospace':font, letterSpacing: isIBAN?.5:undefined }}>
                              {isIBAN && !show ? item.value.replace(/[A-Z0-9]/g, '•') : item.value}
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                            {isIBAN && (
                              <button onClick={() => setIbanVisible(v=>({...v,[key]:!v[key]}))} style={{ padding:'5px 10px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:6, cursor:'pointer', color:'#64748B', display:'flex', alignItems:'center', gap:4, fontSize:'0.7rem', fontFamily: font }}>
                                {show ? <><EyeOff size={11}/> إخفاء</> : <><Eye size={11}/> عرض</>}
                              </button>
                            )}
                            <button onClick={() => handleCopy(item.value, key)} style={{ padding:'5px 10px', background: copied===key?'rgba(0,217,126,0.1)':'rgba(14,165,233,0.1)', border:`1px solid ${copied===key?'rgba(0,217,126,0.3)':'rgba(14,165,233,0.2)'}`, borderRadius:6, cursor:'pointer', color: copied===key?'#00D97E':'#0EA5E9', display:'flex', alignItems:'center', gap:4, fontSize:'0.7rem', fontFamily: font }}>
                              {copied===key ? <><Check size={11}/> تم</> : <><Copy size={11}/> نسخ</>}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <SectionNoteDisplay text={sectionNotes.banking}/>
                </div>
              )}
            </div>
          )}

          {/* ── المعاملات ── */}
          {activeTab === 'transactions' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1E293B', margin:0 }}>آخر المعاملات</h2>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:3 }}>{transactions.length} معاملة مسجلة</p>
              </div>

              {transactions.length === 0 ? (
                <div style={{ textAlign:'center', padding:40, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, color:'#94A3B8', fontSize:'0.85rem' }}>
                  لا توجد معاملات مسجلة حتى الآن.
                </div>
              ) : (
                <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                      <thead>
                        <tr>{['النوع','المبلغ','العملة','المرجع','الحالة','التاريخ'].map(h=>(
                          <th key={h} style={{ padding:'10px 14px', textAlign:'right', fontSize:'0.68rem', fontWeight:700, color:'#64748B', background:'#F1F5F9', borderBottom:'1px solid #E2E8F0', whiteSpace:'nowrap' }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {transactions.map(tx => (
                          <tr key={tx.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'10px 14px', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>
                              <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'0.68rem', fontWeight:700, background:`${txTypeColors[tx.type]||'#64748B'}18`, color:txTypeColors[tx.type]||'#64748B', border:`1px solid ${txTypeColors[tx.type]||'#64748B'}33` }}>
                                {txTypeLabels[tx.type]||tx.type}
                              </span>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'0.83rem', fontWeight:700, color:'#0EA5E9', fontFamily:'monospace', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>{tx.amount?.toLocaleString()||'—'}</td>
                            <td style={{ padding:'10px 14px', fontSize:'0.8rem', color:'#475569', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>{tx.currency||'—'}</td>
                            <td style={{ padding:'10px 14px', fontSize:'0.72rem', color:'#94A3B8', fontFamily:'monospace', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>{tx.reference||'—'}</td>
                            <td style={{ padding:'10px 14px', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>
                              <span style={{ padding:'2px 8px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:tx.status==='completed'?'rgba(0,217,126,0.1)':tx.status==='pending'?'rgba(245,158,11,0.1)':'rgba(255,69,96,0.1)', color:tx.status==='completed'?'#00D97E':tx.status==='pending'?'#F59E0B':'#FF4560' }}>
                                {tx.status==='completed'?'مكتمل':tx.status==='pending'?'معلق':'مرفوض'}
                              </span>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'0.72rem', color:'#64748B', whiteSpace:'nowrap', borderBottom:'1px solid rgba(203,213,225,0.5)' }}>{fmtDate(tx.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── التواصل ── */}
          {activeTab === 'support' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:640 }}>
              <div>
                <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1E293B', margin:0 }}>التواصل مع الإدارة</h2>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:3 }}>أرسل رسالتك وسيتم الرد عليك في أقرب وقت</p>
              </div>

              <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:24 }}>
                {supportSent ? (
                  <div style={{ textAlign:'center', padding:'30px 0' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
                    <div style={{ fontSize:'0.95rem', fontWeight:700, color:'#1E293B', marginBottom:6 }}>تم إرسال رسالتك بنجاح</div>
                    <div style={{ fontSize:'0.82rem', color:'#64748B', marginBottom:20 }}>سيتواصل معك فريقنا قريباً.</div>
                    <button onClick={() => setSupportSent(false)} style={{ padding:'9px 20px', background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:8, color:'#0EA5E9', fontWeight:700, cursor:'pointer', fontFamily: font, fontSize:'0.85rem' }}>
                      إرسال رسالة أخرى
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSupport} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      {[{l:'الاسم', v:profile?.name||''}, {l:'البريد الإلكتروني', v:profile?.email||''}].map(f=>(
                        <div key={f.l}>
                          <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#475569', marginBottom:5 }}>{f.l}</label>
                          <input readOnly value={f.v} style={{ width:'100%', padding:'10px 12px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, fontSize:'0.83rem', fontFamily: font, color:'#94A3B8', boxSizing:'border-box', outline:'none' }}/>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#475569', marginBottom:5 }}>الرسالة *</label>
                      <textarea value={supportMsg} onChange={e=>setSupportMsg(e.target.value)} rows={5} required placeholder="اكتب رسالتك هنا..." style={{ width:'100%', padding:'10px 12px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:8, fontSize:'0.83rem', fontFamily: font, color:'#1E293B', boxSizing:'border-box', outline:'none', resize:'vertical', lineHeight:1.7 }}/>
                    </div>
                    <button type="submit" disabled={supportLoading} style={{ alignSelf:'flex-start', padding:'11px 28px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:supportLoading?'not-allowed':'pointer', fontFamily: font, fontSize:'0.85rem', opacity:supportLoading?0.7:1 }}>
                      {supportLoading ? '⏳ جارٍ الإرسال...' : <><MessageSquare size={14} style={{display:'inline',verticalAlign:'middle',marginLeft:6}}/> إرسال الرسالة</>}
                    </button>
                  </form>
                )}
              </div>

              <div style={{ background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:12, padding:'14px 18px' }}>
                <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#0EA5E9', marginBottom:10 }}>📞 بيانات التواصل</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { icon: <Mail size={13}/>, label:'البريد الإلكتروني', value:'info@tharwahcapital.com' },
                    { icon: <Phone size={13}/>, label:'الهاتف', value:'+966 11 000 1234' },
                    { icon: <Shield size={13}/>, label:'ساعات العمل', value:'الأحد – الخميس / 9 ص – 5 م' },
                  ].map(row=>(
                    <div key={row.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ color:'#0EA5E9' }}>{row.icon}</span>
                      <span style={{ fontSize:'0.72rem', color:'#64748B', fontWeight:600 }}>{row.label}:</span>
                      <span style={{ fontSize:'0.78rem', color:'#1E293B' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── الإعدادات ── */}
          {activeTab === 'settings' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:520 }}>
              <div>
                <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1E293B', margin:0 }}>الإعدادات</h2>
                <p style={{ fontSize:'0.8rem', color:'#64748B', marginTop:3 }}>معلومات حسابك</p>
              </div>
              <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { l:'الاسم', v: profile?.name||'—' },
                  { l:'البريد الإلكتروني', v: profile?.email||'—' },
                  { l:'رقم الهاتف', v: profile?.phone||'—' },
                  { l:'رقم الحساب', v: profile?.account_number||'—' },
                  { l:'كود المحفظة', v: profile?.portfolio_code||'—' },
                  { l:'مستوى العضوية', v: membershipLabel },
                  { l:'الحالة', v: profile?.status==='active'?'نشط':profile?.status==='pending'?'قيد المراجعة':'موقوف' },
                ].map(row=>(
                  <div key={row.l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 12px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:8 }}>
                    <span style={{ fontSize:'0.78rem', color:'#64748B', fontWeight:600 }}>{row.l}</span>
                    <span style={{ fontSize:'0.82rem', color:'#1E293B', fontWeight:700 }}>{row.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(255,69,96,0.06)', border:'1px solid rgba(255,69,96,0.2)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:'0.82rem', color:'#64748B', marginBottom:12 }}>لتغيير كلمة المرور أو بياناتك الشخصية، يرجى التواصل مع الإدارة.</div>
                <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:'rgba(255,69,96,0.1)', border:'1px solid rgba(255,69,96,0.2)', borderRadius:8, cursor:'pointer', color:'#FF4560', fontWeight:700, fontFamily: font, fontSize:'0.82rem' }}>
                  <LogOut size={13}/> تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div style={{ position:'fixed', top:0, right:0, bottom:0, width:220, background:'#FFFFFF', zIndex:100, borderLeft:'1px solid #E2E8F0', display:'flex', flexDirection:'column', boxShadow:'4px 0 20px rgba(0,0,0,0.15)' }}>
          <div style={{ padding:'0 14px', height:60, borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#1E293B' }}>القائمة</span>
            <button onClick={() => setSideOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748B' }}><X size={18}/></button>
          </div>
          <nav style={{ flex:1, padding:'8px 0' }}>
            {NAV.map(item => (
              <button key={item.id} className="nav-item" onClick={() => { setActiveTab(item.id); setSideOpen(false) }}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'10px 14px', background: activeTab===item.id?'rgba(14,165,233,0.1)':'transparent', border:'none', borderRight:`2px solid ${activeTab===item.id?'#C9A84C':'transparent'}`, borderLeft:'none', cursor:'pointer', color: activeTab===item.id?'#0EA5E9':'#475569', fontSize:'0.82rem', fontWeight: activeTab===item.id?700:400, fontFamily: font, textAlign:'right' }}>
                <item.icon size={16} style={{ flexShrink:0 }}/> {item.label}
              </button>
            ))}
          </nav>
          <div style={{ padding:'10px 8px', borderTop:'1px solid #E2E8F0' }}>
            <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:'rgba(255,69,96,0.06)', border:'1px solid rgba(255,69,96,0.15)', borderRadius:8, cursor:'pointer', color:'#FF4560', fontSize:'0.8rem', fontFamily: font }}>
              <LogOut size={14}/> تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {/* Unused icons to avoid tree-shaking warnings */}
      <span style={{ display:'none' }}><Home size={1}/><Activity size={1}/><Bell size={1}/><Wallet size={1}/></span>
    </div>
  )
}