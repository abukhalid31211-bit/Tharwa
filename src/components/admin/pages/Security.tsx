import { useState } from 'react'
import { mockLogs } from '../adminData'
import { Shield } from 'lucide-react'

const sessions = [
  {device:'💻',name:'Chrome — Windows 11',ip:'197.48.12.55',location:'الرياض، SA',time:'الآن',current:true},
  {device:'📱',name:'Safari — iPhone 15',ip:'197.48.12.60',location:'الرياض، SA',time:'منذ 2 ساعة',current:false},
  {device:'💻',name:'Firefox — macOS',ip:'197.48.12.72',location:'جدة، SA',time:'أمس 18:30',current:false},
]

const threats = [
  {ip:'45.227.115.8',country:'🇷🇺 روسيا',attempts:6,lastAttempt:'09:15:44',status:'محظور'},
  {ip:'185.220.101.45',country:'🇩🇪 ألمانيا',attempts:2,lastAttempt:'أمس 22:10',status:'مراقبة'},
]

type SecuritySection = {
  title: string; icon: string
  items: { label: string; on: boolean }[]
}

const defaultSections: SecuritySection[] = [
  {title:'المصادقة الثنائية (2FA)',icon:'🔐',items:[{label:'المصادقة بالبريد',on:true},{label:'رمز SMS',on:false},{label:'تطبيق Authenticator',on:false}]},
  {title:'سياسة كلمة المرور',icon:'🔑',items:[{label:'تغيير كل 90 يوم',on:true},{label:'8 أحرف على الأقل',on:true},{label:'منع إعادة استخدام',on:true}]},
  {title:'القيود الجغرافية',icon:'🌍',items:[{label:'السماح فقط بدول الخليج',on:false},{label:'حظر IPs المشبوهة تلقائياً',on:true},{label:'تسجيل كل الدخولات',on:true}]},
  {title:'إعدادات الجلسة',icon:'⏱️',items:[{label:'انتهاء بعد 30 دقيقة خمول',on:true},{label:'جلسة واحدة في كل وقت',on:false},{label:'إشعار عند تسجيل دخول جديد',on:true}]},
]

export default function Security() {
  const [activeTab, setActiveTab] = useState<'logs'|'sessions'|'threats'|'settings'>('logs')
  const [logFilter, setLogFilter] = useState('all')
  const [sections, setSections] = useState<SecuritySection[]>(defaultSections)

  const toggleItem = (si: number, ii: number) => {
    setSections(prev => prev.map((s, sIdx) => sIdx !== si ? s : {
      ...s,
      items: s.items.map((item, iIdx) => iIdx !== ii ? item : { ...item, on: !item.on })
    }))
  }

  const summaryCards = [
    {label:'محاولات فاشلة اليوم',value:'3',icon:'🔴',color:'#FF4560'},
    {label:'جلسات نشطة',value:'8',icon:'🟢',color:'#00D97E'},
    {label:'IPs مشبوهة',value:'1',icon:'⚠️',color:'#F59E0B'},
    {label:'مستوى الأمان',value:'عالي',icon:'🛡️',color:'#00D97E'},
  ]

  const filteredLogs = mockLogs.filter(l => logFilter==='all' || (logFilter==='failed'&&l.status==='failed') || (logFilter==='success'&&l.status==='success'))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>الأمان والسجلات</h1>
        <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>مراقبة النشاط وإدارة الأمان</p>
      </div>

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

      <div style={{display:'flex',gap:4,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:10,padding:4,width:'fit-content'}}>
        {([{k:'logs',l:'سجلات النشاط'},{k:'sessions',l:'الجلسات النشطة'},{k:'threats',l:'التهديدات'},{k:'settings',l:'إعدادات الأمان'}] as const).map(t=>(
          <button key={t.k} onClick={()=>setActiveTab(t.k)} style={{padding:'7px 16px',background: activeTab===t.k ? '#F1F5F9' : 'transparent',border:'none',borderRadius:7,color: activeTab===t.k ? '#1E293B' : '#64748B',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",whiteSpace:'nowrap',fontWeight: activeTab===t.k ? 600 : 400}}>
            {t.l}
          </button>
        ))}
      </div>

      {activeTab==='logs' && (
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',gap:8,alignItems:'center'}}>
            <div style={{display:'flex',gap:2,background:'#F1F5F9',borderRadius:8,padding:3}}>
              {[{k:'all',l:'الكل'},{k:'success',l:'ناجح'},{k:'failed',l:'فاشل'}].map(t=>(
                <button key={t.k} onClick={()=>setLogFilter(t.k)} style={{padding:'5px 10px',background: logFilter===t.k ? '#F8FAFC' : 'transparent',border:'none',borderRadius:6,color: logFilter===t.k ? '#1E293B' : '#64748B',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
              ))}
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
              <thead>
                <tr>{['الوقت','المستخدم','الحدث','عنوان IP','الموقع','الحالة'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'right',fontSize:'0.7rem',fontWeight:600,color:'#64748B',borderBottom:'1px solid #E2E8F0',background:'#F1F5F9',whiteSpace:'nowrap'}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filteredLogs.map(log=>(
                  <tr key={log.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'10px 14px',fontSize:'0.75rem',color:'#64748B',borderBottom:'1px solid rgba(203,213,225,0.6)',fontFamily:'monospace',whiteSpace:'nowrap'}}>{log.time}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.8rem',color:'#1E293B',borderBottom:'1px solid rgba(203,213,225,0.6)',fontWeight:600}}>{log.user}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.78rem',color:'#1E293B',borderBottom:'1px solid rgba(203,213,225,0.6)'}}>{log.event}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.72rem',color:'#64748B',borderBottom:'1px solid rgba(203,213,225,0.6)',fontFamily:'monospace'}}>{log.ip}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.72rem',color:'#64748B',borderBottom:'1px solid rgba(203,213,225,0.6)'}}>{log.ip.startsWith('197') ? '🇸🇦 الرياض' : log.ip==='localhost' ? '🖥️ محلي' : '🌍 خارجي'}</td>
                    <td style={{padding:'10px 14px',borderBottom:'1px solid rgba(203,213,225,0.6)'}}>
                      <span style={{padding:'3px 9px',borderRadius:20,fontSize:'0.68rem',fontWeight:600,background: log.status==='success'?'rgba(0,217,126,0.1)':'rgba(255,69,96,0.1)',color: log.status==='success'?'#00D97E':'#FF4560'}}>{log.status==='success'?'ناجح':'فاشل'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab==='sessions' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {sessions.map((s,i)=>(
            <div key={i} style={{background:'#F8FAFC',border:`1px solid ${s.current ? 'rgba(0,217,126,0.3)' : '#E2E8F0'}`,borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
              <span style={{fontSize:'1.8rem',flexShrink:0}}>{s.device}</span>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <span style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B'}}>{s.name}</span>
                  {s.current && <span style={{background:'rgba(0,217,126,0.1)',color:'#00D97E',borderRadius:10,padding:'2px 8px',fontSize:'0.65rem',fontWeight:700}}>الجلسة الحالية</span>}
                </div>
                <div style={{display:'flex',gap:16,fontSize:'0.72rem',color:'#64748B'}}>
                  <span>IP: <span style={{fontFamily:'monospace',color:'#1E293B'}}>{s.ip}</span></span>
                  <span>{s.location}</span>
                  <span>{s.time}</span>
                </div>
              </div>
              {!s.current && (
                <button style={{padding:'7px 14px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:7,color:'#FF4560',fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>إنهاء الجلسة</button>
              )}
            </div>
          ))}
          <button style={{padding:'10px',background:'rgba(255,69,96,0.08)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:10,color:'#FF4560',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            🔒 إنهاء كل الجلسات الأخرى
          </button>
        </div>
      )}

      {activeTab==='threats' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'rgba(255,69,96,0.06)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:10}}>
            <span>🔴</span>
            <span style={{fontSize:'0.82rem',color:'#FF4560',fontWeight:600}}>تم اكتشاف {threats.length} IPs مشبوهة — حظر تلقائي مفعّل</span>
          </div>
          {threats.map((t,i)=>(
            <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:'rgba(255,69,96,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>🚨</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                  <span style={{fontFamily:'monospace',fontWeight:700,color:'#1E293B',fontSize:'0.85rem'}}>{t.ip}</span>
                  <span style={{fontSize:'0.78rem',color:'#64748B'}}>{t.country}</span>
                </div>
                <div style={{fontSize:'0.72rem',color:'#64748B'}}>{t.attempts} محاولة فاشلة · آخر محاولة: {t.lastAttempt}</div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:20,fontSize:'0.7rem',fontWeight:700,background: t.status==='محظور' ? 'rgba(255,69,96,0.1)' : 'rgba(245,158,11,0.1)',color: t.status==='محظور' ? '#FF4560' : '#F59E0B'}}>{t.status}</span>
              <button style={{padding:'7px 14px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:7,color:'#FF4560',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>حظر دائم</button>
            </div>
          ))}
        </div>
      )}

      {activeTab==='settings' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {sections.map((section, si)=>(
            <div key={si} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
              <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:'1.1rem'}}>{section.icon}</span>
                <span style={{fontSize:'0.85rem',fontWeight:700,color:'#1E293B'}}>{section.title}</span>
              </div>
              <div style={{padding:'4px 0'}}>
                {section.items.map((item, ii)=>(
                  <div key={ii} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom: ii<section.items.length-1 ? '1px solid rgba(203,213,225,0.5)' : 'none'}}>
                    <span style={{fontSize:'0.78rem',color:'#1E293B'}}>{item.label}</span>
                    <div onClick={()=>toggleItem(si, ii)} style={{width:40,height:22,borderRadius:22,background: item.on ? '#0EA5E9' : '#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
                      <div style={{position:'absolute',top:3,left: item.on ? 'auto' : 3,right: item.on ? 3 : 'auto',width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
