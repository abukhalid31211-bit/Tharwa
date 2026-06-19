import { useState } from 'react'
import { mockNotifications } from '../adminData'

const typeColors: Record<string,{color:string;bg:string}> = {
  critical:{color:'#FF4560',bg:'rgba(255,69,96,0.08)'},
  warning:{color:'#F59E0B',bg:'rgba(245,158,11,0.08)'},
  info:{color:'#3B82F6',bg:'rgba(59,130,246,0.08)'},
  success:{color:'#00D97E',bg:'rgba(0,217,126,0.08)'},
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const markAllRead = () => setNotifs(n => n.map(x => ({...x,read:true})))
  const markRead = (id:number) => setNotifs(n => n.map(x => x.id===id ? {...x,read:true} : x))
  const deleteNotif = (id:number) => setNotifs(n => n.filter(x => x.id!==id))

  const filtered = notifs.filter(n => {
    if (filter==='all') return true
    if (filter==='unread') return !n.read
    return n.type===filter
  })

  const unread = notifs.filter(n=>!n.read).length

  const tabs = [
    {key:'all',label:'الكل',count:notifs.length},
    {key:'unread',label:'غير مقروء',count:unread},
    {key:'critical',label:'عاجل',count:notifs.filter(n=>n.type==='critical').length},
    {key:'warning',label:'تحذير',count:notifs.filter(n=>n.type==='warning').length},
    {key:'info',label:'معلومات',count:notifs.filter(n=>n.type==='info').length},
    {key:'success',label:'نجاح',count:notifs.filter(n=>n.type==='success').length},
  ]

  const rules = [
    {icon:'💸',label:'صفقة كبيرة (أكثر من $50K)',enabled:true,channel:'بريد + لوحة'},
    {icon:'👤',label:'تسجيل عميل جديد',enabled:true,channel:'لوحة'},
    {icon:'🔐',label:'محاولة تسجيل دخول فاشلة',enabled:true,channel:'بريد + لوحة'},
    {icon:'📊',label:'تقرير شهري جاهز',enabled:false,channel:'بريد'},
    {icon:'💬',label:'رسالة جديدة من عميل',enabled:true,channel:'لوحة'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>مركز الإشعارات</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>{unread} غير مقروء من {notifs.length} إشعار</p>
        </div>
        <button onClick={markAllRead} style={{padding:'8px 14px',background:'transparent',border:'1px solid #E2E8F0',borderRadius:8,color:'#64748B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.78rem'}}>
          ✓ تعليم الكل مقروء
        </button>
      </div>

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[
          {label:'إجمالي',value:notifs.length,color:'#64748B',icon:'🔔'},
          {label:'غير مقروء',value:unread,color:'#FF4560',icon:'🔴'},
          {label:'عاجل',value:notifs.filter(n=>n.type==='critical').length,color:'#FF4560',icon:'⚠️'},
          {label:'اليوم',value:notifs.filter(n=>!n.time.includes('أمس')).length,color:'#0EA5E9',icon:'📅'},
        ].map((s,i)=>(
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.4rem'}}>{s.icon}</span>
            <div>
              <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.5rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20}}>
        {/* Notifications List */}
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #E2E8F0',display:'flex',gap:6,overflowX:'auto'}}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>setFilter(t.key)} style={{padding:'5px 12px',background: filter===t.key ? '#F1F5F9' : 'transparent',border:`1px solid ${filter===t.key ? '#E2E8F0' : 'transparent'}`,borderRadius:8,color: filter===t.key ? '#1E293B' : '#64748B',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap',flexShrink:0}}>
                {t.label}
                {t.count > 0 && <span style={{background: filter===t.key ? 'rgba(14,165,233,0.2)' : '#E2E8F0',color: filter===t.key ? '#0EA5E9' : '#64748B',borderRadius:8,padding:'1px 6px',fontSize:'0.6rem'}}>{t.count}</span>}
              </button>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {filtered.length === 0 ? (
              <div style={{padding:40,textAlign:'center',color:'#64748B',fontSize:'0.85rem'}}>لا توجد إشعارات</div>
            ) : filtered.map(n=>(
              <div key={n.id} style={{display:'flex',gap:12,padding:'14px 16px',borderBottom:'1px solid rgba(203,213,225,0.6)',background: !n.read ? 'rgba(14,165,233,0.02)' : 'transparent',transition:'background 0.15s',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.05)'}
                onMouseLeave={e=>e.currentTarget.style.background=!n.read?'rgba(14,165,233,0.02)':'transparent'}
                onClick={()=>markRead(n.id)}>
                <div style={{width:36,height:36,borderRadius:'50%',background:typeColors[n.type]?.bg,border:`1px solid ${typeColors[n.type]?.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                    <span style={{fontSize:'0.82rem',fontWeight: !n.read ? 700 : 500,color:'#1E293B'}}>{n.title}</span>
                    <span style={{fontSize:'0.65rem',color:'#94A3B8',flexShrink:0}}>{n.time}</span>
                  </div>
                  <div style={{fontSize:'0.72rem',color:'#64748B',marginTop:3}}>{n.desc}</div>
                  {(n.actions||[]).length > 0 && (
                    <div style={{display:'flex',gap:6,marginTop:8}}>
                      {n.actions.map((a:string)=>(
                        <button key={a} style={{padding:'4px 10px',background:`${typeColors[n.type]?.color}15`,border:`1px solid ${typeColors[n.type]?.color}33`,borderRadius:6,color:typeColors[n.type]?.color,fontSize:'0.68rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{a}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:4,flexShrink:0}}>
                  {!n.read && <div style={{width:7,height:7,borderRadius:'50%',background:'#0EA5E9'}}/>}
                  <button onClick={e=>{e.stopPropagation();deleteNotif(n.id)}} style={{background:'none',border:'none',color:'#94A3B8',cursor:'pointer',fontSize:'0.8rem',padding:2}}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Rules */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',fontSize:'0.875rem',fontWeight:700,color:'#1E293B'}}>قواعد الإشعارات</div>
            <div style={{display:'flex',flexDirection:'column'}}>
              {rules.map((r,i)=>(
                <div key={i} style={{padding:'12px 16px',borderBottom: i<rules.length-1 ? '1px solid rgba(203,213,225,0.6)' : 'none',display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:'1rem',flexShrink:0}}>{r.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.75rem',color:'#1E293B',lineHeight:1.4}}>{r.label}</div>
                    <div style={{fontSize:'0.62rem',color:'#64748B',marginTop:2}}>{r.channel}</div>
                  </div>
                  <div onClick={()=>{}} style={{width:36,height:20,borderRadius:20,background: r.enabled ? '#0EA5E9' : '#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
                    <div style={{position:'absolute',top:2,right: r.enabled ? 2 : 'auto',left: r.enabled ? 'auto' : 2,width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:16}}>
            <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:12}}>قنوات الإشعار</div>
            {[{icon:'📧',label:'البريد الإلكتروني',status:'مفعّل',color:'#00D97E'},{icon:'📱',label:'الرسائل النصية',status:'غير مفعّل',color:'#64748B'},{icon:'🔔',label:'لوحة التحكم',status:'مفعّل',color:'#00D97E'}].map((c,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom: i<2 ? '1px solid rgba(203,213,225,0.6)' : 'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span>{c.icon}</span>
                  <span style={{fontSize:'0.78rem',color:'#1E293B'}}>{c.label}</span>
                </div>
                <span style={{fontSize:'0.68rem',color:c.color,fontWeight:600}}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
