import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User, Wallet, BarChart3, Bell, Settings, LogOut, Menu, X,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ChevronRight, FileText, MessageSquare, Building2, StickyNote,
  Shield, Phone, Mail, MapPin, Calendar, Flag, Briefcase,
  CreditCard, DollarSign, Target, AlertCircle, PieChart,
  Activity, Home, Eye, EyeOff, Copy, Check, Download,
  Info, Star, Landmark
} from "lucide-react";
import { getLiveClients, getLiveTransactions, getSiteName, addContactMessage } from "../lib/store";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

/* ────────────────── mock data per client ────────────────── */
const CLIENT_PROFILES: Record<number, ClientProfile> = {
  1: {
    personal: {
      fullName: "محمد عبدالله الأحمد", nationality: "سعودي", dob: "1985-03-15",
      idNumber: "1023456789", idExpiry: "2028-04-01",
      phone: "+966 50 123 4567", altPhone: "+966 55 987 6543",
      email: "mohammed@tharwah.com", address: "حي النزهة، شارع الأمير محمد",
      city: "الرياض", country: "المملكة العربية السعودية", postalCode: "11564",
      maritalStatus: "متزوج", dependents: "3", employer: "أرامكو السعودية",
      jobTitle: "مدير مشاريع", workPhone: "+966 13 111 0000",
      taxResidency: "المملكة العربية السعودية", taxId: "—",
    },
    financial: {
      annualIncome: "500,000 – 1,000,000 ريال", netWorth: "أكثر من 5 مليون ريال",
      investableAssets: "2,500,000 ريال", investmentGoal: "نمو رأس المال على المدى البعيد",
      riskTolerance: "مرتفع", investmentHorizon: "أكثر من 10 سنوات",
      experienceYears: "7 سنوات", prevExperience: "أسهم خليجية، عملات رقمية، معادن",
      monthlyExpenses: "25,000 ريال", emergencyFund: "نعم (6 أشهر)",
      liabilities: "قرض عقاري — 800,000 ريال متبقية",
      financingSource: "دخل شخصي + عائد استثمارات",
    },
    investments: {
      totalValue: 1284718, totalReturn: 12.4, returnAmount: 142850,
      cashBalance: 89944,
      assets: [
        { type: "أسهم سعودية", name: "أرامكو السعودية", code: "2222", qty: 500, price: 28.5, value: 142500, change: 2.1, weight: 11.1 },
        { type: "أسهم عالمية", name: "NVIDIA", code: "NVDA", qty: 40, price: 875, value: 350000, change: 5.8, weight: 27.2 },
        { type: "أسهم عالمية", name: "Apple", code: "AAPL", qty: 120, price: 195, value: 234000, change: 1.4, weight: 18.2 },
        { type: "عملات رقمية", name: "Bitcoin", code: "BTC", qty: 1.8, price: 67240, value: 121032, change: 3.4, weight: 9.4 },
        { type: "عملات رقمية", name: "Ethereum", code: "ETH", qty: 15, price: 3820, value: 57300, change: 5.2, weight: 4.5 },
        { type: "معادن", name: "ذهب", code: "XAU", qty: 12, price: 2340, value: 28080, change: 0.9, weight: 2.2 },
        { type: "فوركس", name: "EUR/USD", code: "EURUSD", qty: 10, price: 1.0821, value: 108210, change: -0.3, weight: 8.4 },
        { type: "نقد", name: "نقد متاح", code: "—", qty: 1, price: 89944, value: 89944, change: 0, weight: 7.0 },
      ],
    },
    banking: {
      accounts: [
        { label: "الحساب الرئيسي", bank: "مصرف الراجحي", iban: "SA44 2000 0001 2345 6789 1234", type: "جاري إسلامي", currency: "ريال سعودي", swift: "RJHISARI", branch: "الرياض — حي الورود" },
        { label: "الحساب الثانوي", bank: "البنك الأهلي السعودي", iban: "SA03 8000 0000 6080 1016 7519", type: "ادخار", currency: "ريال سعودي", swift: "NCBKSAJE", branch: "الرياض — حي المروج" },
      ],
    },
    notes: [
      { date: "2025-06-01", author: "أحمد المشرف", text: "العميل يرغب في زيادة التعرض للأسهم الأمريكية في الربع القادم. تمت مناقشة تقليل الكاش من 7% إلى 5%." },
      { date: "2025-04-15", author: "أحمد المشرف", text: "اجتماع مراجعة ربع سنوي — رضا تام عن الأداء. طلب تقرير مفصل لأغراض ضريبية." },
      { date: "2025-02-10", author: "خالد محمد", text: "تم تحديث وثيقة الهوية الوطنية. استحقاق تجديد جواز السفر في يوليو 2025." },
    ],
    advisor: { name: "أحمد المشرف", title: "مستشار استثماري أول", phone: "+966 11 000 1234", email: "ahmed@tharwah.com" },
    portfolioCode: "PF-001", tier: "VIP", joinedDate: "يناير 2022",
  },
  2: {
    personal: {
      fullName: "سارة محمد العمري", nationality: "إماراتية", dob: "1990-07-22",
      idNumber: "784-1990-1234567-1", idExpiry: "2027-09-01",
      phone: "+971 50 123 4567", altPhone: "+971 55 876 5432",
      email: "sara@tharwah.com", address: "الخليج التجاري، برج المركز",
      city: "دبي", country: "الإمارات العربية المتحدة", postalCode: "00000",
      maritalStatus: "غير متزوجة", dependents: "0", employer: "شركة ADNOC",
      jobTitle: "مديرة مالية", workPhone: "+971 2 602 0000",
      taxResidency: "الإمارات العربية المتحدة", taxId: "—",
    },
    financial: {
      annualIncome: "250,000 – 500,000 درهم", netWorth: "2–5 مليون درهم",
      investableAssets: "1,200,000 درهم", investmentGoal: "دخل منتظم + نمو معتدل",
      riskTolerance: "متوسط", investmentHorizon: "5–10 سنوات",
      experienceYears: "4 سنوات", prevExperience: "أسهم عالمية، عملات رقمية",
      monthlyExpenses: "15,000 درهم", emergencyFund: "نعم (3 أشهر)",
      liabilities: "لا يوجد",
      financingSource: "دخل شخصي",
    },
    investments: {
      totalValue: 872000, totalReturn: 14.3, returnAmount: 109000,
      cashBalance: 55000,
      assets: [
        { type: "أسهم عالمية", name: "Microsoft", code: "MSFT", qty: 60, price: 415, value: 249000, change: 1.8, weight: 28.6 },
        { type: "عملات رقمية", name: "Ethereum", code: "ETH", qty: 20, price: 3820, value: 76400, change: 5.2, weight: 8.8 },
        { type: "أسهم عالمية", name: "Apple", code: "AAPL", qty: 80, price: 195, value: 156000, change: 1.4, weight: 17.9 },
        { type: "نفط وطاقة", name: "نفط برنت", code: "BRENT", qty: 100, price: 87.3, value: 87300, change: -0.4, weight: 10.0 },
        { type: "معادن", name: "ذهب", code: "XAU", qty: 10, price: 2340, value: 23400, change: 0.9, weight: 2.7 },
        { type: "نقد", name: "نقد متاح", code: "—", qty: 1, price: 55000, value: 55000, change: 0, weight: 6.3 },
      ],
    },
    banking: {
      accounts: [
        { label: "الحساب الرئيسي", bank: "بنك الإمارات دبي الوطني (ENBD)", iban: "AE070331234567890123456", type: "جاري", currency: "درهم إماراتي", swift: "EBILAEAD", branch: "دبي — الخليج التجاري" },
      ],
    },
    notes: [
      { date: "2025-05-20", author: "خالد محمد", text: "العميلة ترغب في تنويع نحو الأسهم الخليجية. جدولة مراجعة شاملة في يوليو 2025." },
    ],
    advisor: { name: "خالد محمد", title: "مستشار استثماري", phone: "+971 4 000 5678", email: "khalid@tharwah.com" },
    portfolioCode: "PF-002", tier: "premium", joinedDate: "مارس 2022",
  },
  4: {
    personal: {
      fullName: "نورة خالد الشمري", nationality: "قطرية", dob: "1993-11-30",
      idNumber: "28411030001", idExpiry: "2026-12-01",
      phone: "+974 50 123 4567", altPhone: "—",
      email: "noura@tharwah.com", address: "الدوحة — حي الرمال",
      city: "الدوحة", country: "قطر", postalCode: "—",
      maritalStatus: "متزوجة", dependents: "1", employer: "وزارة المالية القطرية",
      jobTitle: "محللة اقتصادية", workPhone: "+974 44 09 0000",
      taxResidency: "قطر", taxId: "—",
    },
    financial: {
      annualIncome: "200,000 – 350,000 ريال قطري", netWorth: "1–2 مليون ريال قطري",
      investableAssets: "600,000 ريال قطري", investmentGoal: "حفظ الثروة والتقاعد المبكر",
      riskTolerance: "منخفض – متوسط", investmentHorizon: "10–15 سنة",
      experienceYears: "2 سنة", prevExperience: "صناديق استثمارية فقط",
      monthlyExpenses: "12,000 ريال قطري", emergencyFund: "نعم (12 شهراً)",
      liabilities: "لا يوجد",
      financingSource: "مدخرات شخصية",
    },
    investments: {
      totalValue: 568000, totalReturn: 8.9, returnAmount: 46400,
      cashBalance: 98000,
      assets: [
        { type: "أسهم سعودية", name: "مصرف الراجحي", code: "1120", qty: 300, price: 90.6, value: 271800, change: 1.1, weight: 47.9 },
        { type: "معادن", name: "ذهب", code: "XAU", qty: 8, price: 2340, value: 18720, change: 0.9, weight: 3.3 },
        { type: "صناديق", name: "صندوق الاستثمار الخليجي", code: "GULF-ETF", qty: 500, price: 35.8, value: 17900, change: 2.3, weight: 3.2 },
        { type: "نقد", name: "نقد متاح", code: "—", qty: 1, price: 98000, value: 98000, change: 0, weight: 17.3 },
      ],
    },
    banking: {
      accounts: [
        { label: "الحساب الرئيسي", bank: "مصرف قطر الإسلامي (QIB)", iban: "QA58QNBA000000000000693123456", type: "جاري إسلامي", currency: "ريال قطري", swift: "QIIBQAQA", branch: "الدوحة — الروضة" },
      ],
    },
    notes: [
      { date: "2025-06-10", author: "خالد محمد", text: "العميلة تفضل الاستثمارات المتوافقة مع أحكام الشريعة الإسلامية بشكل حصري." },
    ],
    advisor: { name: "خالد محمد", title: "مستشار استثماري", phone: "+974 44 000 5678", email: "khalid@tharwah.com" },
    portfolioCode: "PF-004", tier: "standard", joinedDate: "فبراير 2023",
  },
};

/* fill remaining clients with a generic fallback */
function getProfile(id: number): ClientProfile {
  return CLIENT_PROFILES[id] ?? {
    personal: { fullName: "عميل ثروة كابيتال", nationality: "—", dob: "—", idNumber: "—", idExpiry: "—", phone: "—", altPhone: "—", email: "—", address: "—", city: "—", country: "—", postalCode: "—", maritalStatus: "—", dependents: "—", employer: "—", jobTitle: "—", workPhone: "—", taxResidency: "—", taxId: "—" },
    financial: { annualIncome: "—", netWorth: "—", investableAssets: "—", investmentGoal: "—", riskTolerance: "—", investmentHorizon: "—", experienceYears: "—", prevExperience: "—", monthlyExpenses: "—", emergencyFund: "—", liabilities: "—", financingSource: "—" },
    investments: { totalValue: 0, totalReturn: 0, returnAmount: 0, cashBalance: 0, assets: [] },
    banking: { accounts: [] },
    notes: [],
    advisor: { name: "—", title: "—", phone: "—", email: "—" },
    portfolioCode: "PF-000", tier: "standard", joinedDate: "—",
  };
}

interface PersonalInfo { fullName:string; nationality:string; dob:string; idNumber:string; idExpiry:string; phone:string; altPhone:string; email:string; address:string; city:string; country:string; postalCode:string; maritalStatus:string; dependents:string; employer:string; jobTitle:string; workPhone:string; taxResidency:string; taxId:string; }
interface FinancialInfo { annualIncome:string; netWorth:string; investableAssets:string; investmentGoal:string; riskTolerance:string; investmentHorizon:string; experienceYears:string; prevExperience:string; monthlyExpenses:string; emergencyFund:string; liabilities:string; financingSource:string; }
interface AssetRow { type:string; name:string; code:string; qty:number; price:number; value:number; change:number; weight:number; }
interface BankAccount { label:string; bank:string; iban:string; type:string; currency:string; swift:string; branch:string; }
interface NoteEntry { date:string; author:string; text:string; }
interface ClientProfile {
  personal: PersonalInfo;
  financial: FinancialInfo;
  investments: { totalValue:number; totalReturn:number; returnAmount:number; cashBalance:number; assets: AssetRow[] };
  banking: { accounts: BankAccount[] };
  notes: NoteEntry[];
  advisor: { name:string; title:string; phone:string; email:string; };
  portfolioCode: string; tier: string; joinedDate: string;
}

const tierMap: Record<string,{label:string;color:string;bg:string}> = {
  VIP: { label:"VIP", color:"#0EA5E9", bg:"rgba(14,165,233,0.12)" },
  premium: { label:"بريميوم", color:"#8B5CF6", bg:"rgba(139,92,246,0.12)" },
  standard: { label:"قياسي", color:"#64748B", bg:"rgba(100,116,139,0.12)" },
};
const typeColors: Record<string,string> = {
  "أسهم سعودية":"#10B981","أسهم عالمية":"#3B82F6","عملات رقمية":"#F59E0B",
  "معادن":"#9CA3AF","فوركس":"#6366F1","نفط وطاقة":"#EF4444","صناديق":"#EC4899","نقد":"#94A3B8"
};

const navLinks = [
  { id:"info", icon: User, label:"معلومات العميل" },
  { id:"investments", icon: PieChart, label:"الاستثمارات والأصول" },
  { id:"banking", icon: Landmark, label:"البيانات البنكية" },
  { id:"notes", icon: StickyNote, label:"ملاحظات الإدارة" },
  { id:"performance", icon: Activity, label:"أداء المحفظة" },
  { id:"transactions", icon: FileText, label:"آخر المعاملات" },
  { id:"support", icon: MessageSquare, label:"الدعم", badge:1 },
  { id:"settings", icon: Settings, label:"الإعدادات" },
];

const mockRecentTransactions = [
  { type:"شراء", asset:"NVIDIA", amount:"+15 سهم", value:"$13,125", date:"14 يون 2025", dir:"in" },
  { type:"بيع", asset:"أرامكو", amount:"−50 سهم", value:"$1,425", date:"10 يون 2025", dir:"out" },
  { type:"شراء", asset:"Bitcoin", amount:"+0.3 BTC", value:"$20,172", date:"5 يون 2025", dir:"in" },
  { type:"توزيعات", asset:"Microsoft", amount:"+ربح", value:"$312", date:"1 يون 2025", dir:"in" },
  { type:"شراء", asset:"ذهب XAU", amount:"+2 oz", value:"$4,680", date:"28 مايو 2025", dir:"in" },
];

function fmt(n: number) { return n.toLocaleString("ar-SA", { maximumFractionDigits:0 }); }

/* ─── InfoGrid ─────────────────────────────── */
function InfoGrid({ items }: { items: {label:string;value:string}[] }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
      {items.map(it => (
        <div key={it.label} style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#94A3B8", marginBottom:4 }}>{it.label}</div>
          <div style={{ fontSize:"0.83rem", fontWeight:600, color:"#1E293B", wordBreak:"break-all" }}>{it.value || "—"}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── SectionHeader ─────────────────────────── */
function SH({ icon, title, sub }: { icon:string; title:string; sub?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <span style={{ fontSize:"1.25rem" }}>{icon}</span>
      <div>
        <div style={{ fontSize:"0.97rem", fontWeight:800, color:"#1E293B" }}>{title}</div>
        {sub && <div style={{ fontSize:"0.72rem", color:"#94A3B8" }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────── */
function Dashboard() {
  const [activeTab, setActiveTab] = useState("info");
  const [sideOpen, setSideOpen] = useState(false);
  const [clientAuth, setClientAuth] = useState<{ id:number; name:string; email:string; portfolioCode:string; initial:string } | null>(null);
  const [ibanVisible, setIbanVisible] = useState<Record<number,boolean>>({});
  const [copied, setCopied] = useState<string|null>(null);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [adminStatus, setAdminStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("tharwah_client_auth");
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        setClientAuth(auth);
        // Check if admin has overridden this client's status
        const liveClients = getLiveClients<{ id: number; status: string; name: string }>();
        if (liveClients.length > 0) {
          const match = liveClients.find(c => c.id === auth.id);
          if (match) setAdminStatus(match.status);
        }
      }
      catch { navigate({ to: "/login" }); }
    } else {
      navigate({ to: "/login" });
    }
  }, []);

  // Live transactions from admin
  const adminTransactions = getLiveTransactions<{ id: number; type: string; client: string; asset: string; qty: number; price: number; total: number; status: string; date: string }>();

  const profile = clientAuth ? getProfile(clientAuth.id) : getProfile(1);
  const { personal, financial, investments, banking, notes, advisor, portfolioCode, tier, joinedDate } = profile;
  const tierInfo = tierMap[tier] ?? tierMap.standard;

  // Determine effective status
  const effectiveStatus = adminStatus || 'active';
  const isFrozen = effectiveStatus === 'frozen' || effectiveStatus === 'suspended' || effectiveStatus === 'inactive';

  function copyText(text: string, key: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleLogout() {
    localStorage.removeItem("tharwah_client_auth");
    navigate({ to: "/" });
  }

  /* ── Allocation donut data ─── */
  const totalAssets = investments.assets.reduce((s, a) => s + a.value, 0) || 1;
  const byType: Record<string, number> = {};
  investments.assets.forEach(a => { byType[a.type] = (byType[a.type] || 0) + a.value; });
  const donutSlices: { type:string; pct:number; color:string }[] = Object.entries(byType).map(([t,v]) => ({ type:t, pct:Math.round(v/totalAssets*100), color: typeColors[t] ?? "#94A3B8" }));

  /* simple donut SVG */
  let cumPct = 0;
  const R = 70, CX = 90, CY = 90;
  function polarToXY(pct: number) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  }
  const donutPaths = donutSlices.map(sl => {
    const start = cumPct;
    cumPct += sl.pct;
    if (sl.pct === 0) return null;
    const p1 = polarToXY(start);
    const p2 = polarToXY(cumPct);
    const large = sl.pct > 50 ? 1 : 0;
    return { ...sl, d: `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${large} 1 ${p2.x} ${p2.y} Z` };
  }).filter(Boolean);

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex", fontFamily:"'Cairo',sans-serif" }}>
      {/* ── Sidebar ─────────────────────────────── */}
      <aside style={{
        position:"fixed", top:0, right:0, bottom:0, zIndex:50,
        width:260, background:"#FFFFFF", borderLeft:"1px solid #E2E8F0",
        display:"flex", flexDirection:"column",
        transform: sideOpen ? "translateX(0)" : "translateX(100%)",
        transition:"transform .3s",
      }}
        className="lg:!transform-none lg:!static"
      >
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"18px 20px", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#D4AF37,#B8860B)", display:"grid", placeItems:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:"1rem" }}>ث</span>
          </div>
          <div>
            <div style={{ fontWeight:900, fontSize:"0.82rem", color:"#1E293B" }}>{getSiteName()}</div>
            <div style={{ fontSize:"0.65rem", color:"#D4AF37", fontWeight:700 }}>بوابة العملاء</div>
          </div>
          <button onClick={() => setSideOpen(false)} style={{ marginRight:"auto", background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Client badge */}
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#B8860B)", display:"grid", placeItems:"center", color:"#fff", fontWeight:900, fontSize:"1.1rem", flexShrink:0 }}>
              {clientAuth?.initial ?? "م"}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:"0.83rem", color:"#1E293B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{clientAuth?.name ?? personal.fullName}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.62rem", fontWeight:700, background:tierInfo.bg, color:tierInfo.color }}>{tierInfo.label}</span>
                <span style={{ fontSize:"0.62rem", color:"#94A3B8" }}>{portfolioCode}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop:10, padding:"8px 12px", background:"#F8FAFC", borderRadius:8, border:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginBottom:2 }}>إجمالي المحفظة</div>
            <div style={{ fontWeight:900, fontSize:"1rem", color:"#1E293B" }}>${fmt(investments.totalValue)}</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.7rem", color:"#10B981", fontWeight:700, marginTop:2 }}>
              <TrendingUp size={11}/> +{investments.totalReturn}% ({joinedDate})
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => { setActiveTab(l.id); setSideOpen(false); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, marginBottom:3, border:"none", cursor:"pointer", transition:"all .15s",
                background: activeTab===l.id ? "rgba(212,175,55,0.1)" : "transparent",
                color: activeTab===l.id ? "#D4AF37" : "#64748B",
                fontWeight: activeTab===l.id ? 800 : 600, fontSize:"0.82rem", fontFamily:"'Cairo',sans-serif",
              }}>
              <l.icon size={16} style={{ flexShrink:0 }} />
              {l.label}
              {l.badge && !notifRead && (
                <span style={{ marginRight:"auto", minWidth:18, height:18, borderRadius:9, background:"#EF4444", color:"#fff", fontSize:"0.6rem", fontWeight:900, display:"grid", placeItems:"center" }}>{l.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:12, borderTop:"1px solid #E2E8F0" }}>
          <button onClick={handleLogout}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", background:"transparent", color:"#EF4444", fontWeight:700, fontSize:"0.82rem", fontFamily:"'Cairo',sans-serif", transition:"all .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background="rgba(239,68,68,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background="transparent")}
          >
            <LogOut size={16}/> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:40 }}
          className="lg:hidden"
        />
      )}

      {/* ── Main ─────��────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, marginRight:0 }} className="lg:mr-[260px]">
        {/* Top bar */}
        <header style={{ background:"#FFFFFF", borderBottom:"1px solid #E2E8F0", padding:"14px 24px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:30 }}>
          <button onClick={() => setSideOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"#1E293B" }} className="lg:hidden">
            <Menu size={22}/>
          </button>
          <div>
            <h1 style={{ fontWeight:900, fontSize:"1.05rem", color:"#1E293B", margin:0 }}>
              {navLinks.find(n=>n.id===activeTab)?.label ?? "معلومات العميل"}
            </h1>
            <p style={{ fontSize:"0.67rem", color:"#94A3B8", margin:0 }}>آخر تحديث: اليوم 10:24 ص</p>
          </div>
          <div style={{ marginRight:"auto", display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => { setNotifRead(true); setActiveTab("support"); }}
              style={{ position:"relative", background:"none", border:"none", cursor:"pointer", color:"#94A3B8", padding:4 }}>
              <Bell size={20}/>
              {!notifRead && <span style={{ position:"absolute", top:0, right:0, width:8, height:8, borderRadius:"50%", background:"#EF4444" }}/>}
            </button>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#B8860B)", display:"grid", placeItems:"center", color:"#fff", fontWeight:900, fontSize:"0.9rem" }}>
              {clientAuth?.initial ?? "م"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px 24px 40px" }}>

          {/* ── Admin Status Banner ── */}
          {isFrozen && (
            <div style={{ marginBottom:20, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <AlertCircle size={20} style={{ color:"#EF4444", flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:800, fontSize:"0.88rem", color:"#EF4444" }}>
                  {effectiveStatus === 'frozen' ? '🔒 حسابك مجمّد مؤقتاً' :
                   effectiveStatus === 'suspended' ? '⛔ حسابك موقوف' : '⚠️ حسابك غير نشط'}
                </div>
                <div style={{ fontSize:"0.75rem", color:"#64748B", marginTop:3 }}>
                  لمزيد من التفاصيل، يرجى التواصل مع المستشار أو فريق الدعم.
                </div>
              </div>
            </div>
          )}


          {/* ══ TAB: معلومات العميل ══ */}
          {activeTab === "info" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* Advisor card */}
              <div style={{ background:"linear-gradient(135deg,#1E293B,#334155)", borderRadius:16, padding:"20px 24px", display:"flex", flexWrap:"wrap", gap:20, alignItems:"center" }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.5)", marginBottom:4 }}>مستشارك الاستثماري</div>
                  <div style={{ fontWeight:900, fontSize:"1.05rem", color:"#fff" }}>{advisor.name}</div>
                  <div style={{ fontSize:"0.75rem", color:"#D4AF37", marginBottom:10 }}>{advisor.title}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                    <a href={`tel:${advisor.phone}`} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.75rem", color:"rgba(255,255,255,0.7)", textDecoration:"none" }}>
                      <Phone size={13}/> {advisor.phone}
                    </a>
                    <a href={`mailto:${advisor.email}`} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.75rem", color:"rgba(255,255,255,0.7)", textDecoration:"none" }}>
                      <Mail size={13}/> {advisor.email}
                    </a>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.5)" }}>كود المحفظة</span>
                    <span style={{ fontWeight:900, color:"#D4AF37", fontSize:"0.95rem" }}>{portfolioCode}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.5)" }}>العضوية</span>
                    <span style={{ padding:"3px 10px", borderRadius:20, background:tierInfo.bg, color:tierInfo.color, fontSize:"0.7rem", fontWeight:700 }}>{tierInfo.label}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.5)" }}>عضو منذ</span>
                    <span style={{ fontSize:"0.78rem", color:"#fff", fontWeight:700 }}>{joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Personal data */}
              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"20px 22px" }}>
                <SH icon="👤" title="البيانات الشخصية" sub="المعلومات الأساسية المسجلة في الملف"/>
                <InfoGrid items={[
                  { label:"الاسم الكامل", value:personal.fullName },
                  { label:"الجنسية", value:personal.nationality },
                  { label:"تاريخ الميلاد", value:personal.dob },
                  { label:"رقم الهوية / الإقامة", value:personal.idNumber },
                  { label:"انتهاء الهوية", value:personal.idExpiry },
                  { label:"الجوال", value:personal.phone },
                  { label:"جوال بديل", value:personal.altPhone },
                  { label:"البريد الإلكتروني", value:personal.email },
                  { label:"العنوان", value:personal.address },
                  { label:"المدينة", value:personal.city },
                  { label:"الدولة", value:personal.country },
                  { label:"الرمز البريدي", value:personal.postalCode },
                  { label:"الحالة الاجتماعية", value:personal.maritalStatus },
                  { label:"عدد المعالين", value:personal.dependents },
                  { label:"جهة العمل", value:personal.employer },
                  { label:"المسمى الوظيفي", value:personal.jobTitle },
                  { label:"هاتف العمل", value:personal.workPhone },
                  { label:"دولة الإقامة الضريبية", value:personal.taxResidency },
                  { label:"الرقم الضريبي", value:personal.taxId },
                ]}/>
              </div>

              {/* Financial status */}
              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"20px 22px" }}>
                <SH icon="💰" title="الوضع المالي" sub="الملف الاستثماري ودرجة المخاطرة"/>
                <InfoGrid items={[
                  { label:"الدخل السنوي", value:financial.annualIncome },
                  { label:"صافي الثروة", value:financial.netWorth },
                  { label:"الأصول القابلة للاستثمار", value:financial.investableAssets },
                  { label:"الهدف الاستثماري", value:financial.investmentGoal },
                  { label:"مستوى المخاطرة", value:financial.riskTolerance },
                  { label:"الأفق الزمني", value:financial.investmentHorizon },
                  { label:"سنوات الخبرة", value:financial.experienceYears },
                  { label:"الخبرات السابقة", value:financial.prevExperience },
                  { label:"المصروفات الشهرية", value:financial.monthlyExpenses },
                  { label:"احتياطي الطوارئ", value:financial.emergencyFund },
                  { label:"الالتزامات / القروض", value:financial.liabilities },
                  { label:"مصدر التمويل", value:financial.financingSource },
                ]}/>
              </div>
            </div>
          )}

          {/* ══ TAB: الاستثمارات ══ */}
          {activeTab === "investments" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* KPI row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
                {[
                  { label:"إجمالي المحفظة", value:`$${fmt(investments.totalValue)}`, sub:`+${investments.totalReturn}%`, icon:Wallet, up:true },
                  { label:"الأرباح المحققة", value:`$${fmt(investments.returnAmount)}`, sub:"منذ البداية", icon:TrendingUp, up:true },
                  { label:"الأصول المستثمرة", value:`$${fmt(investments.totalValue-investments.cashBalance)}`, sub:`${Math.round((1-investments.cashBalance/investments.totalValue)*100)}%`, icon:BarChart3, up:true },
                  { label:"النقد المتاح", value:`$${fmt(investments.cashBalance)}`, sub:`${Math.round(investments.cashBalance/investments.totalValue*100)}%`, icon:DollarSign, up:false },
                ].map(c => (
                  <div key={c.label} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#94A3B8", marginBottom:4 }}>{c.label}</div>
                      <div style={{ fontWeight:900, fontSize:"1.15rem", color:"#1E293B", marginBottom:3 }}>{c.value}</div>
                      <div style={{ fontSize:"0.7rem", color: c.up ? "#10B981" : "#94A3B8", fontWeight:700 }}>{c.up ? "▲ " : ""}{c.sub}</div>
                    </div>
                    <div style={{ width:38, height:38, borderRadius:10, background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.2)", display:"grid", placeItems:"center", color:"#D4AF37" }}>
                      <c.icon size={18}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Donut + allocation */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:16 }}>
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"20px 22px" }}>
                  <SH icon="🍩" title="توزيع الأصول"/>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                    <svg width={180} height={180} viewBox="0 0 180 180">
                      {donutPaths.map((p,i) => p && (
                        <path key={i} d={p.d} fill={p.color} opacity={0.9}/>
                      ))}
                      <circle cx={CX} cy={CY} r={42} fill="#fff"/>
                      <text x={CX} y={CY-6} textAnchor="middle" fontSize={11} fontWeight={900} fill="#1E293B">${fmt(investments.totalValue/1000)}K</text>
                      <text x={CX} y={CY+9} textAnchor="middle" fontSize={8} fill="#94A3B8">إجمالي</text>
                    </svg>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {donutSlices.map(sl => (
                      <div key={sl.type} style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ width:10, height:10, borderRadius:3, background:sl.color, flexShrink:0 }}/>
                        <span style={{ fontSize:"0.75rem", color:"#475569", flex:1 }}>{sl.type}</span>
                        <span style={{ fontSize:"0.75rem", fontWeight:700, color:"#1E293B" }}>{sl.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assets table */}
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #E2E8F0" }}>
                    <SH icon="📊" title="تفاصيل الأصول" sub="جميع المراكز المفتوحة"/>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
                      <thead>
                        <tr style={{ background:"#F8FAFC" }}>
                          {["الأصل","النوع","الكمية","متوسط السعر","القيمة الحالية","التغيير","الوزن"].map(h => (
                            <th key={h} style={{ padding:"10px 14px", textAlign:"right", fontSize:"0.67rem", fontWeight:700, color:"#94A3B8", borderBottom:"1px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {investments.assets.map((a,i) => (
                          <tr key={i} style={{ borderBottom:"1px solid rgba(203,213,225,0.4)" }}
                            onMouseEnter={e => (e.currentTarget.style.background="#F8FAFC")}
                            onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                          >
                            <td style={{ padding:"10px 14px" }}>
                              <div style={{ fontWeight:700, color:"#1E293B" }}>{a.name}</div>
                              <div style={{ fontSize:"0.65rem", color:"#94A3B8" }}>{a.code}</div>
                            </td>
                            <td style={{ padding:"10px 14px" }}>
                              <span style={{ padding:"3px 8px", borderRadius:20, fontSize:"0.65rem", fontWeight:700, background:(typeColors[a.type]||"#94A3B8")+"22", color:typeColors[a.type]||"#94A3B8" }}>{a.type}</span>
                            </td>
                            <td style={{ padding:"10px 14px", fontFamily:"monospace", color:"#475569" }}>{a.qty}</td>
                            <td style={{ padding:"10px 14px", fontFamily:"monospace", color:"#475569" }}>${a.price.toLocaleString()}</td>
                            <td style={{ padding:"10px 14px", fontWeight:700, color:"#1E293B", fontFamily:"monospace" }}>${fmt(a.value)}</td>
                            <td style={{ padding:"10px 14px" }}>
                              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:"0.75rem", fontWeight:700, color: a.change>0 ? "#10B981" : a.change<0 ? "#EF4444" : "#94A3B8" }}>
                                {a.change>0 ? <ArrowUpRight size={12}/> : a.change<0 ? <ArrowDownRight size={12}/> : null}
                                {a.change>0?"+":""}{a.change}%
                              </span>
                            </td>
                            <td style={{ padding:"10px 14px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <div style={{ flex:1, height:4, background:"#F1F5F9", borderRadius:2, overflow:"hidden", minWidth:40 }}>
                                  <div style={{ height:"100%", background:typeColors[a.type]||"#94A3B8", borderRadius:2, width:`${a.weight}%` }}/>
                                </div>
                                <span style={{ fontSize:"0.7rem", color:"#94A3B8", width:28 }}>{a.weight}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: البيانات البنكية ══ */}
          {activeTab === "banking" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <Shield size={15} color="#D4AF37"/>
                <span style={{ fontSize:"0.78rem", color:"#92400E", fontWeight:600 }}>بياناتك البنكية مشفرة ومحمية — لا تشاركها مع أحد</span>
              </div>

              {banking.accounts.length === 0 ? (
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:40, textAlign:"center", color:"#94A3B8" }}>
                  <Landmark size={40} style={{ marginBottom:12, opacity:0.3 }}/>
                  <div style={{ fontWeight:700 }}>لم يتم إضافة بيانات بنكية بعد</div>
                  <div style={{ fontSize:"0.78rem", marginTop:4 }}>تواصل مع مستشارك لإضافة حسابك البنكي</div>
                </div>
              ) : banking.accounts.map((acc, idx) => (
                <div key={idx} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, overflow:"hidden" }}>
                  <div style={{ padding:"14px 20px", background:"#F8FAFC", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", gap:10 }}>
                    <Landmark size={16} color="#D4AF37"/>
                    <span style={{ fontWeight:800, fontSize:"0.88rem", color:"#1E293B" }}>{acc.label}</span>
                    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.62rem", fontWeight:700, background:"rgba(16,185,129,0.1)", color:"#10B981" }}>فعّال</span>
                  </div>
                  <div style={{ padding:"20px 22px" }}>
                    <InfoGrid items={[
                      { label:"البنك", value:acc.bank },
                      { label:"نوع الحساب", value:acc.type },
                      { label:"العملة", value:acc.currency },
                      { label:"SWIFT / BIC", value:acc.swift },
                      { label:"الفرع", value:acc.branch },
                    ]}/>
                    {/* IBAN with reveal */}
                    <div style={{ marginTop:14, padding:"14px 16px", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:10 }}>
                      <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#94A3B8", marginBottom:6 }}>رقم الآيبان (IBAN)</div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, fontFamily:"monospace", fontWeight:700, fontSize:"0.85rem", color:"#1E293B", letterSpacing:"0.05em" }}>
                          {ibanVisible[idx] ? acc.iban : acc.iban.slice(0,4) + " •••• •••• •••• " + acc.iban.slice(-4)}
                        </div>
                        <button onClick={() => setIbanVisible(p => ({...p,[idx]:!p[idx]}))}
                          style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:7, padding:"5px 10px", cursor:"pointer", color:"#64748B", display:"flex", alignItems:"center", gap:5, fontSize:"0.72rem" }}>
                          {ibanVisible[idx] ? <EyeOff size={13}/> : <Eye size={13}/>}
                          {ibanVisible[idx] ? "إخفاء" : "إظهار"}
                        </button>
                        <button onClick={() => copyText(acc.iban, `iban-${idx}`)}
                          style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:7, padding:"5px 10px", cursor:"pointer", color: copied===`iban-${idx}` ? "#10B981" : "#64748B", display:"flex", alignItems:"center", gap:5, fontSize:"0.72rem", transition:"color .2s" }}>
                          {copied===`iban-${idx}` ? <Check size={13}/> : <Copy size={13}/>}
                          {copied===`iban-${idx}` ? "تم النسخ" : "نسخ"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ TAB: ملاحظات الإدارة ══ */}
          {activeTab === "notes" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <Info size={15} color="#6366F1"/>
                <span style={{ fontSize:"0.78rem", color:"#3730A3", fontWeight:600 }}>هذه ملاحظات داخلية يكتبها مستشارك — للاطلاع فقط</span>
              </div>

              {notes.length === 0 ? (
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:40, textAlign:"center", color:"#94A3B8" }}>
                  <StickyNote size={40} style={{ marginBottom:12, opacity:0.3 }}/>
                  <div style={{ fontWeight:700 }}>لا توجد ملاحظات حتى الآن</div>
                </div>
              ) : notes.map((n, i) => (
                <div key={i} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#B8860B)", display:"grid", placeItems:"center", color:"#fff", fontWeight:900, fontSize:"0.85rem" }}>
                      {n.author.slice(0,1)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.82rem", color:"#1E293B" }}>{n.author}</div>
                      <div style={{ fontSize:"0.68rem", color:"#94A3B8" }}>{n.date}</div>
                    </div>
                  </div>
                  <p style={{ margin:0, fontSize:"0.85rem", color:"#334155", lineHeight:1.7, borderRight:"3px solid #D4AF37", paddingRight:14 }}>{n.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* ══ TAB: أداء المحفظة ══ */}
          {activeTab === "performance" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* period selector */}
              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"20px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
                  <SH icon="📈" title="أداء المحفظة عبر الزمن"/>
                  <div style={{ display:"flex", gap:6 }}>
                    {["3 أشهر","6 أشهر","سنة","منذ البداية"].map(p => (
                      <button key={p}
                        style={{ padding:"5px 12px", borderRadius:8, border:"1px solid #E2E8F0", background:"#F8FAFC", fontSize:"0.72rem", fontWeight:600, color:"#64748B", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}
                        onMouseEnter={e => { e.currentTarget.style.background="#D4AF37"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#D4AF37"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="#F8FAFC"; e.currentTarget.style.color="#64748B"; e.currentTarget.style.borderColor="#E2E8F0"; }}
                      >{p}</button>
                    ))}
                  </div>
                </div>
                <svg viewBox="0 0 600 180" style={{ width:"100%" }}>
                  <defs>
                    <linearGradient id="pGold" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0,1,2,3,4].map(i=>(
                    <line key={i} x1="0" y1={i*45} x2="600" y2={i*45} stroke="#F1F5F9" strokeWidth="1"/>
                  ))}
                  <polyline fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round"
                    points="0,145 55,132 110,138 165,100 220,112 275,72 330,84 385,50 440,56 495,32 550,28 600,22"/>
                  <polygon fill="url(#pGold)"
                    points="0,145 55,132 110,138 165,100 220,112 275,72 330,84 385,50 440,56 495,32 550,28 600,22 600,180 0,180"/>
                  {["يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر","يناير","فبراير","مارس","أبريل","مايو","يونيو"].map((m,i)=>(
                    <text key={m} x={i*54+4} y="175" fontSize="8" fill="#94A3B8">{m}</text>
                  ))}
                </svg>
              </div>

              {/* stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
                {[
                  { label:"العائد الكلي", value:`+${investments.totalReturn}%`, color:"#10B981" },
                  { label:"أفضل أصل", value:"NVIDIA +5.8%", color:"#10B981" },
                  { label:"أسوأ أداء", value:"نفط −0.4%", color:"#EF4444" },
                  { label:"معامل شارب", value:"1.82", color:"#6366F1" },
                  { label:"الحد الأقصى للخسارة", value:"−4.2%", color:"#EF4444" },
                  { label:"التقلب (Volatility)", value:"12.6%", color:"#F59E0B" },
                ].map(s => (
                  <div key={s.label} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ fontSize:"0.67rem", color:"#94A3B8", marginBottom:5, fontWeight:700 }}>{s.label}</div>
                    <div style={{ fontWeight:900, fontSize:"1.05rem", color:s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ TAB: آخر المعاملات ══ */}
          {activeTab === "transactions" && (
            <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, overflow:"hidden" }}>
              <div style={{ padding:"16px 22px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <SH icon="📋" title="سجل المعاملات"/>
                <button style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"1px solid #E2E8F0", background:"#F8FAFC", fontSize:"0.75rem", fontWeight:700, color:"#64748B", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                  <Download size={13}/> تصدير PDF
                </button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.8rem" }}>
                  <thead>
                    <tr style={{ background:"#F8FAFC" }}>
                      {["النوع","الأصل","الكمية","القيمة","التاريخ"].map(h => (
                        <th key={h} style={{ padding:"11px 16px", textAlign:"right", fontSize:"0.68rem", fontWeight:700, color:"#94A3B8", borderBottom:"1px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentTransactions.map((t,i) => (
                      <tr key={i} style={{ borderBottom:"1px solid rgba(203,213,225,0.4)", transition:"background .1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background="#F8FAFC")}
                        onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                      >
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:"0.68rem", fontWeight:700,
                            background: t.dir==="in" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            color: t.dir==="in" ? "#10B981" : "#EF4444",
                          }}>
                            {t.dir==="in" ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
                            {t.type}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px", fontWeight:700, color:"#1E293B" }}>{t.asset}</td>
                        <td style={{ padding:"12px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:"#64748B" }}>{t.amount}</td>
                        <td style={{ padding:"12px 16px", fontWeight:700, fontFamily:"monospace", color:"#1E293B" }}>{t.value}</td>
                        <td style={{ padding:"12px 16px", fontSize:"0.72rem", color:"#94A3B8" }}>{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ TAB: الدعم ══ */}
          {activeTab === "support" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:680 }}>
              {!notifRead && (
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:12 }}>
                  <Bell size={16} color="#6366F1" style={{ flexShrink:0, marginTop:2 }}/>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.83rem", color:"#3730A3", marginBottom:3 }}>إشعار جديد من مستشارك</div>
                    <div style={{ fontSize:"0.78rem", color:"#4338CA" }}>يسعدنا إعلامكم بصدور تقرير الأداء الربعي — يرجى التواصل لمراجعته.</div>
                    <button onClick={() => setNotifRead(true)}
                      style={{ marginTop:8, padding:"4px 12px", borderRadius:7, border:"1px solid rgba(99,102,241,0.3)", background:"transparent", fontSize:"0.72rem", color:"#6366F1", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                      تم القراءة ✓
                    </button>
                  </div>
                </div>
              )}

              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"22px 24px" }}>
                <SH icon="💬" title="تواصل مع مستشارك" sub="سيتم الرد خلال 24 ساعة عمل"/>
                {supportSent ? (
                  <div style={{ textAlign:"center", padding:"30px 0", color:"#10B981" }}>
                    <Check size={40} style={{ marginBottom:12 }}/>
                    <div style={{ fontWeight:800, fontSize:"1rem" }}>تم إرسال رسالتك بنجاح!</div>
                    <div style={{ fontSize:"0.8rem", color:"#64748B", marginTop:6 }}>سيتواصل معك {advisor.name} قريباً</div>
                    <button onClick={() => { setSupportSent(false); setSupportMsg(""); }}
                      style={{ marginTop:16, padding:"8px 20px", borderRadius:9, border:"1px solid #E2E8F0", background:"#F8FAFC", fontSize:"0.78rem", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                      إرسال رسالة أخرى
                    </button>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); if(supportMsg.trim()) { addContactMessage({ name: clientAuth?.name ?? personal.fullName, email: clientAuth?.email ?? personal.email, phone: personal.phone, service: "دعم العملاء", message: supportMsg, source: "support" }); setSupportSent(true); } }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                      {[
                        { label:"استفسار عام", icon:"❓" },
                        { label:"طلب تقرير", icon:"📄" },
                        { label:"تعديل المحفظة", icon:"✏️" },
                        { label:"مشكلة تقنية", icon:"🔧" },
                      ].map(t => (
                        <button key={t.label} type="button"
                          style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #E2E8F0", background:"#F8FAFC", fontSize:"0.78rem", fontWeight:600, color:"#475569", cursor:"pointer", textAlign:"center", fontFamily:"'Cairo',sans-serif", transition:"all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor="#D4AF37"; e.currentTarget.style.background="rgba(212,175,55,0.06)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.background="#F8FAFC"; }}
                          onClick={() => setSupportMsg(p => p + (p ? " — " : "") + t.label)}
                        >
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={supportMsg}
                      onChange={e => setSupportMsg(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      style={{ width:"100%", padding:"12px 14px", border:"1px solid #E2E8F0", borderRadius:10, fontSize:"0.83rem", color:"#1E293B", fontFamily:"'Cairo',sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }}
                    />
                    <button type="submit"
                      style={{ marginTop:12, padding:"11px 28px", borderRadius:10, background:"linear-gradient(135deg,#D4AF37,#B8860B)", color:"#fff", fontWeight:800, fontSize:"0.85rem", border:"none", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                      إرسال الرسالة
                    </button>
                  </form>
                )}
              </div>

              {/* Advisor card */}
              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#B8860B)", display:"grid", placeItems:"center", color:"#fff", fontWeight:900, fontSize:"1.2rem", flexShrink:0 }}>
                  {advisor.name.slice(0,1)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:"0.9rem", color:"#1E293B" }}>{advisor.name}</div>
                  <div style={{ fontSize:"0.72rem", color:"#D4AF37", marginBottom:6 }}>{advisor.title}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <a href={`tel:${advisor.phone}`} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.73rem", color:"#64748B", textDecoration:"none" }}>
                      <Phone size={12}/>{advisor.phone}
                    </a>
                    <a href={`mailto:${advisor.email}`} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.73rem", color:"#64748B", textDecoration:"none" }}>
                      <Mail size={12}/>{advisor.email}
                    </a>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#10B981" }}/>
                  <span style={{ fontSize:"0.72rem", color:"#10B981", fontWeight:700 }}>متاح الآن</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: الإعدادات ══ */}
          {activeTab === "settings" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:600 }}>
              {[
                {
                  title:"بيانات الحساب",
                  icon:"⚙️",
                  items:[
                    { label:"البريد الإلكتروني", value:clientAuth?.email ?? personal.email, type:"email" },
                    { label:"كلمة المرور", value:"••••••••••", type:"password" },
                  ]
                },
                {
                  title:"إعدادات الإشعارات",
                  icon:"🔔",
                  toggles:[
                    { label:"إشعارات البريد الإلكتروني", val:true },
                    { label:"إشعارات الواتساب", val:true },
                    { label:"تنبيهات تغير الأسعار", val:false },
                    { label:"التقارير الشهرية", val:true },
                  ]
                }
              ].map(sec => (
                <div key={sec.title} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:14, padding:"20px 22px" }}>
                  <SH icon={sec.icon} title={sec.title}/>
                  {sec.items?.map((it,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom: i<(sec.items!.length-1) ? "1px solid #F1F5F9" : "none" }}>
                      <div>
                        <div style={{ fontSize:"0.82rem", fontWeight:600, color:"#1E293B" }}>{it.label}</div>
                        <div style={{ fontSize:"0.73rem", color:"#94A3B8", marginTop:2 }}>{it.value}</div>
                      </div>
                      <button style={{ padding:"6px 14px", borderRadius:8, border:"1px solid #E2E8F0", background:"#F8FAFC", fontSize:"0.73rem", fontWeight:700, color:"#64748B", cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                        تعديل
                      </button>
                    </div>
                  ))}
                  {sec.toggles?.map((tg,i) => (
                    <ToggleRow key={i} label={tg.label} defaultVal={tg.val} last={i===(sec.toggles!.length-1)}/>
                  ))}
                </div>
              ))}

              <button onClick={handleLogout}
                style={{ padding:"12px", borderRadius:12, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.05)", color:"#EF4444", fontWeight:800, fontSize:"0.85rem", cursor:"pointer", fontFamily:"'Cairo',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <LogOut size={16}/> تسجيل الخروج من الجهاز
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultVal, last }: { label:string; defaultVal:boolean; last:boolean }) {
  const [on, setOn] = useState(defaultVal);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom: last ? "none" : "1px solid #F1F5F9" }}>
      <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#1E293B" }}>{label}</span>
      <button onClick={() => setOn(p => !p)}
        style={{ width:44, height:24, borderRadius:12, background: on ? "#D4AF37" : "#E2E8F0", border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
        <span style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"all .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)", right: on ? 3 : "calc(100% - 21px)" }}/>
      </button>
    </div>
  );
}
