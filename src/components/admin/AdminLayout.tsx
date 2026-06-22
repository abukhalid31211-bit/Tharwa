import { useState, useEffect } from 'react'
import { Bell, LogOut, Settings, Menu, X, Search, ChevronRight, TrendingUp, Users, FileText, MessageSquare, BarChart2, Shield, Home, Briefcase, CreditCard, Bell as BellIcon, UserCheck, Lock, Layout, HelpCircle, Star, Palette, Info, Globe, Ticket, UserCog, ShieldCheck } from 'lucide-react'
import Overview from './pages/Overview'
import Clients from './pages/Clients'
import Portfolios from './pages/Portfolios'
import Transactions from './pages/Transactions'
import Messages from './pages/Messages'
import Content from './pages/Content'
import Reports from './pages/Reports'
import Team from './pages/Team'
import Notifications from './pages/Notifications'
import SettingsPage from './pages/Settings'
import Security from './pages/Security'
import HeroManager from './pages/HeroManager'
import ServicesManager from './pages/ServicesManager'
import MarketsManager from './pages/MarketsManager'
import FAQManager from './pages/FAQManager'
import TestimonialsManager from './pages/TestimonialsManager'
import SiteDesign from './pages/SiteDesign'
import AboutManager from './pages/AboutManager'
import SubAdmins from './pages/SubAdmins'
import PrivacyPolicyManager from './pages/PrivacyPolicyManager'
import { mockNotifications } from './adminData'
import { getContactMessages } from '../../lib/store'

type Page = 'overview'|'clients'|'portfolios'|'transactions'|'messages'|'content'|'reports'|'team'|'notifications'|'settings'|'security'|'hero'|'services_mgr'|'markets_mgr'|'faq_mgr'|'testimonials'|'site_design'|'about_mgr'|'sub_admins'|'privacy_policy'

interface Props {
  onLogout: () => void
  role: 'super' | 'sub'
}

const SUB_ADMIN_ALLOWED: Page[] = ['clients', 'portfolios', 'transactions']

const superNavGroups = [
  { title: 'الرئيسية', items: [
    { key: 'overview', Icon: Home, label: 'لوحة التحكم' },
  ]},
  { title: 'إدارة العملاء ومحافظهم', items: [
    { key: 'clients', Icon: Users, label: 'العملاء والحسابات', badge: 3 },
    { key: 'portfolios', Icon: Briefcase, label: 'المحافظ الاستثمارية' },
    { key: 'transactions', Icon: CreditCard, label: 'العمليات', badge: 7 },
    { key: 'messages', Icon: MessageSquare, label: 'الرسائل', badge: 0 },
  ]},
  { title: 'المنصة', items: [
    { key: 'content', Icon: FileText, label: 'المحتوى' },
    { key: 'reports', Icon: BarChart2, label: 'التقارير' },
    { key: 'team', Icon: UserCheck, label: 'الفريق' },
  ]},
  { title: 'إدارة الموقع', items: [
    { key: 'hero', Icon: Layout, label: 'قسم البطل' },
    { key: 'services_mgr', Icon: Ticket, label: 'الخدمات' },
    { key: 'markets_mgr', Icon: TrendingUp, label: 'الأسواق' },
    { key: 'faq_mgr', Icon: HelpCircle, label: 'الأسئلة الشائعة' },
    { key: 'testimonials', Icon: Star, label: 'الشهادات' },
    { key: 'about_mgr', Icon: Info, label: 'من نحن' },
    { key: 'site_design', Icon: Palette, label: 'التصميم والتنقل' },
    { key: 'privacy_policy', Icon: ShieldCheck, label: 'سياسة الخصوصية' },
  ]},
  { title: 'النظام', items: [
    { key: 'notifications', Icon: BellIcon, label: 'الإشعارات', badge: mockNotifications.filter(n=>!n.read).length },
    { key: 'settings', Icon: Settings, label: 'الإعدادات' },
    { key: 'security', Icon: Lock, label: 'الأمان' },
  ]},
  { title: 'إدارة الصلاحيات', items: [
    { key: 'sub_admins', Icon: UserCog, label: 'إضافة مشرف' },
  ]},
]

const subNavGroups = [
  { title: 'إدارة العملاء ومحافظهم', items: [
    { key: 'clients', Icon: Users, label: 'العملاء والحسابات', badge: 3 },
    { key: 'portfolios', Icon: Briefcase, label: 'المحافظ الاستثمارية' },
    { key: 'transactions', Icon: CreditCard, label: 'العمليات', badge: 7 },
  ]},
]

const pageTitles: Record<Page,string> = {
  overview:'لوحة التحكم',clients:'العملاء',portfolios:'المحافظ',
  transactions:'العمليات',messages:'الرسائل',content:'المحتوى',
  reports:'التقارير',team:'الفريق',notifications:'الإشعارات',
  settings:'الإعدادات',security:'الأمان',
  hero:'قسم البطل',services_mgr:'إدارة الخدمات',markets_mgr:'إدارة الأسواق',
  faq_mgr:'الأسئلة الشائعة',testimonials:'الشهادات',
  site_design:'التصميم والتنقل',about_mgr:'صفحة من نحن',
  sub_admins:'إدارة المشرفين', privacy_policy:'سياسة الخصوصية',
}

export default function AdminLayout({ onLogout, role }: Props) {
  const isSuper = role === 'super'
  const defaultPage: Page = isSuper ? 'overview' : 'clients'
  const navGroups = isSuper ? superNavGroups : subNavGroups

  const [page, setPage] = useState<Page>(defaultPage)
  const [collapsed, setCollapsed] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [contactNewCount, setContactNewCount] = useState(() => getContactMessages().filter(m => m.status === 'new').length)
  const unread = mockNotifications.filter(n=>!n.read).length

  useEffect(() => {
    const update = () => setContactNewCount(getContactMessages().filter(m => m.status === 'new').length)
    window.addEventListener('tharwah_contact_messages_changed', update)
    return () => window.removeEventListener('tharwah_contact_messages_changed', update)
  }, [])

  const adminName = isSuper
    ? 'أحمد المشرف'
    : (localStorage.getItem('admin_name') || 'مشرف')
  const adminEmail = localStorage.getItem('admin_email') || ''

  const safePage: Page = (!isSuper && !SUB_ADMIN_ALLOWED.includes(page)) ? 'clients' : page

  const renderPage = () => {
    switch(safePage) {
      case 'overview': return <Overview />
      case 'clients': return <Clients />
      case 'portfolios': return <Portfolios />
      case 'transactions': return <Transactions />
      case 'messages': return <Messages />
      case 'content': return <Content />
      case 'reports': return <Reports />
      case 'team': return <Team />
      case 'notifications': return <Notifications />
      case 'settings': return <SettingsPage />
      case 'security': return <Security />
      case 'hero': return <HeroManager />
      case 'services_mgr': return <ServicesManager />
      case 'markets_mgr': return <MarketsManager />
      case 'faq_mgr': return <FAQManager />
      case 'testimonials': return <TestimonialsManager />
      case 'site_design': return <SiteDesign />
      case 'about_mgr': return <AboutManager />
      case 'sub_admins': return isSuper ? <SubAdmins /> : <Clients />
      case 'privacy_policy': return isSuper ? <PrivacyPolicyManager /> : <Clients />
      default: return isSuper ? <Overview /> : <Clients />
    }
  }

  const handleNavClick = (key: string) => {
    const target = key as Page
    if (!isSuper && !SUB_ADMIN_ALLOWED.includes(target)) return
    setPage(target)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4F8', display:'flex', fontFamily:"'Cairo',sans-serif", direction:'rtl', color:'#1E293B', minWidth:1280 }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background:'#FFFFFF', borderLeft:'1px solid #E2E8F0',
        display:'flex', flexDirection:'column', transition:'width 0.25s ease',
        flexShrink:0, zIndex:100, height:'100vh', position:'sticky', top:0, overflowX:'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding:'0 12px', height:60, borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', overflow:'hidden' }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#0EA5E9,#0284C7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>⚡</div>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#1E293B', whiteSpace:'nowrap' }}>Golden Horizon</div>
                <div style={{ fontSize:'0.6rem', color:'#0EA5E9', whiteSpace:'nowrap' }}>Admin Panel</div>
              </div>
            </div>
          )}
          {collapsed && <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#0EA5E9,#0284C7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', margin:'0 auto' }}>⚡</div>}
          {!collapsed && (
            <button onClick={()=>setCollapsed(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:4, display:'flex' }}>
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={()=>setCollapsed(false)} style={{ margin:'8px 10px', background:'none', border:'1px solid #E2E8F0', borderRadius:6, cursor:'pointer', color:'#64748B', display:'flex', alignItems:'center', justifyContent:'center', padding:6 }}>
            <Menu size={15} />
          </button>
        )}

        {/* Role badge */}
        {!collapsed && (
          <div style={{ margin:'6px 12px 2px', padding:'5px 10px', borderRadius:8, background: isSuper ? 'rgba(201,168,76,0.12)' : 'rgba(14,165,233,0.08)', border: `1px solid ${isSuper ? 'rgba(201,168,76,0.3)' : 'rgba(14,165,233,0.2)'}`, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:'0.65rem', fontWeight:700, color: isSuper ? '#C9A84C' : '#0EA5E9', whiteSpace:'nowrap' }}>
              {isSuper ? '👑 Super Admin' : '🔵 مشرف فرعي'}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'4px 0', scrollbarWidth:'none' }}>
          {navGroups.map(group => (
            <div key={group.title} style={{ marginBottom:2 }}>
              {!collapsed && (
                <div style={{ fontSize:'0.58rem', fontWeight:700, color:'#94A3B8', letterSpacing:'1.5px', textTransform:'uppercase', padding:'8px 14px 4px' }}>
                  {group.title}
                </div>
              )}
              {group.items.map(item => {
                const isActive = safePage === item.key
                const { Icon } = item
                const isSpecial = item.key === 'sub_admins' || item.key === 'privacy_policy'
                return (
                  <button key={item.key}
                    onClick={()=>handleNavClick(item.key)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', gap:9,
                      padding: collapsed ? '9px 0' : '9px 14px',
                      background: isActive ? 'rgba(14,165,233,0.1)' : (isSpecial && !isActive ? 'rgba(201,168,76,0.05)' : 'transparent'),
                      border:'none',
                      borderRight: isActive ? '2px solid #C9A84C' : (isSpecial ? '2px solid rgba(201,168,76,0.3)' : '2px solid transparent'),
                      borderLeft:'none', cursor:'pointer',
                      color: isActive ? '#0EA5E9' : (isSpecial ? '#C9A84C' : '#475569'),
                      fontSize:'0.82rem', fontWeight: isActive ? 700 : (isSpecial ? 600 : 400),
                      fontFamily:"'Cairo',sans-serif", transition:'all 0.15s',
                      textAlign:'right', justifyContent: collapsed ? 'center' : 'flex-start',
                      position:'relative',
                    }}
                    onMouseEnter={e=>{if(!isActive){e.currentTarget.style.color='#0EA5E9';e.currentTarget.style.background='rgba(14,165,233,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){e.currentTarget.style.color=isSpecial?'#C9A84C':'#475569';e.currentTarget.style.background=isSpecial?'rgba(201,168,76,0.05)':'transparent'}}}>
                    <Icon size={16} style={{ flexShrink:0 }} />
                    {!collapsed && <>
                      <span style={{ flex:1, whiteSpace:'nowrap' }}>{item.label}</span>
                      {(item.key === 'messages' ? contactNewCount : (item as {badge?:number}).badge!) > 0 && (
                        <span style={{ background:'#FF4560', color:'white', borderRadius:10, padding:'1px 6px', fontSize:'0.6rem', fontWeight:700 }}>{item.key === 'messages' ? contactNewCount : (item as {badge?:number}).badge}</span>
                      )}
                    </>}
                    {collapsed && (item.key === 'messages' ? contactNewCount : (item as {badge?:number}).badge!) > 0 && (
                      <span style={{ position:'absolute', top:4, right:8, width:6, height:6, background:'#FF4560', borderRadius:'50%' }} />
                    )}
                  </button>
                )
              })}
              {!collapsed && <div style={{ height:1, background:'rgba(203,213,225,0.5)', margin:'4px 12px' }} />}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid #E2E8F0', position:'relative' }}>
          <button onClick={()=>setShowUserMenu(!showUserMenu)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:8, background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.15)', borderRadius:8, cursor:'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background: isSuper ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'linear-gradient(135deg,#0EA5E9,#38BDF8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:'#FFFFFF', flexShrink:0 }}>
              {adminName.charAt(0)}
            </div>
            {!collapsed && <div style={{ flex:1, textAlign:'right' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#1E293B', whiteSpace:'nowrap' }}>{adminName}</div>
              <div style={{ fontSize:'0.58rem', color: isSuper ? '#C9A84C' : '#0EA5E9' }}>{isSuper ? 'Super Admin' : 'مشرف فرعي'}</div>
            </div>}
          </button>
          {showUserMenu && !collapsed && (
            <div style={{ position:'absolute', bottom:'100%', right:8, left:8, marginBottom:4, background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:8, overflow:'hidden', zIndex:200 }}>
              {isSuper && (
                <button onClick={()=>{setPage('settings');setShowUserMenu(false)}} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'none', border:'none', color:'#1E293B', fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.08)'}
                  onMouseLeave={e=>e.currentTarget.style.background='none'}>
                  <Settings size={13} color="#64748B" /> الإعدادات
                </button>
              )}
              {!collapsed && adminEmail && (
                <div style={{ padding:'6px 12px', fontSize:'0.7rem', color:'#94A3B8', borderTop: isSuper ? '1px solid #CBD5E1' : 'none', fontFamily:'monospace' }}>
                  {adminEmail}
                </div>
              )}
              <div style={{ height:1, background:'#CBD5E1' }} />
              <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'none', border:'none', color:'#FF4560', fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,69,96,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <LogOut size={13} /> خروج
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Topbar */}
        <header style={{ height:60, background:'#FFFFFF', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:90, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'#64748B' }}>
            <span>Golden Horizon</span>
            <ChevronRight size={12} />
            <span style={{ color:'#1E293B', fontWeight:600 }}>{pageTitles[safePage]}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, maxWidth:360 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 12px', fontSize:'0.78rem', color:'#64748B' }}>
              <Search size={13} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{ background:'none', border:'none', outline:'none', color:'#1E293B', fontSize:'0.78rem', fontFamily:"'Cairo',sans-serif", flex:1, minWidth:0 }} />
              <kbd style={{ background:'#CBD5E1', borderRadius:3, padding:'1px 5px', fontSize:'0.65rem', color:'#94A3B8', flexShrink:0 }}>⌘K</kbd>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:'rgba(0,217,126,0.08)', border:'1px solid rgba(0,217,126,0.2)', borderRadius:6, fontSize:'0.7rem', color:'#00D97E' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#00D97E', display:'inline-block', animation:'blink 1.5s infinite' }} />
              مباشر
            </div>
            {isSuper && (
              <div style={{ position:'relative' }}>
                <button onClick={()=>setShowNotif(!showNotif)} style={{ width:36, height:36, background: showNotif ? 'rgba(14,165,233,0.1)' : '#F1F5F9', border:`1px solid ${showNotif ? 'rgba(14,165,233,0.3)' : '#E2E8F0'}`, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748B', position:'relative' }}>
                  <Bell size={15} />
                  {unread > 0 && <span style={{ position:'absolute', top:5, left:5, width:7, height:7, background:'#FF4560', border:'2px solid #FFFFFF', borderRadius:'50%' }} />}
                </button>
                {showNotif && (
                  <div style={{ position:'absolute', top:'100%', left:0, marginTop:8, width:320, background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:12, boxShadow:'0 8px 30px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
                    <div style={{ padding:'12px 14px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontWeight:700, fontSize:'0.85rem' }}>الإشعارات</span>
                      <span style={{ fontSize:'0.7rem', color:'#0EA5E9', cursor:'pointer' }}>تعليم الكل مقروء</span>
                    </div>
                    {mockNotifications.slice(0,5).map(n => (
                      <div key={n.id} style={{ display:'flex', gap:10, padding:'10px 14px', borderBottom:'1px solid rgba(203,213,225,0.5)', cursor:'pointer', background: !n.read ? 'rgba(14,165,233,0.03)' : 'transparent' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.06)'}
                        onMouseLeave={e=>e.currentTarget.style.background=!n.read?'rgba(14,165,233,0.03)':'transparent'}>
                        <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{n.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E293B' }}>{n.title}</div>
                          <div style={{ fontSize:'0.7rem', color:'#64748B', marginTop:2 }}>{n.desc}</div>
                        </div>
                        <div style={{ fontSize:'0.65rem', color:'#94A3B8', flexShrink:0 }}>{n.time}</div>
                      </div>
                    ))}
                    <button onClick={()=>{setPage('notifications');setShowNotif(false)}} style={{ width:'100%', padding:'10px', background:'none', border:'none', color:'#0EA5E9', fontSize:'0.78rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif", borderTop:'1px solid #E2E8F0' }}>
                      عرض الكل
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:24, overflowY:'auto' }}>
          {renderPage()}
        </main>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px }
      `}</style>
    </div>
  )
}
