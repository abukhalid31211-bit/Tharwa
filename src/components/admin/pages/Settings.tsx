import { useState } from 'react'

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:40,height:22,borderRadius:22,background: on ? '#0EA5E9' : '#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:3,left: on ? 'auto' : 3,right: on ? 3 : 'auto',width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function Field({label,value,placeholder,type='text'}:{label:string;value:string;placeholder?:string;type?:string}) {
  const [v,setV] = useState(value)
  return (
    <div>
      <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>{label}</div>
      <input type={type} value={v} onChange={e=>setV(e.target.value)} placeholder={placeholder} style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}} onFocus={e=>e.target.style.borderColor='#0EA5E9'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
    </div>
  )
}

const navItems = [
  {k:'general',icon:'🏢',l:'عام'},
  {k:'appearance',icon:'🎨',l:'المظهر'},
  {k:'email',icon:'📧',l:'البريد'},
  {k:'financial',icon:'💰',l:'المالية'},
  {k:'notifications',icon:'🔔',l:'الإشعارات'},
  {k:'seo',icon:'🌐',l:'SEO'},
  {k:'api',icon:'🔗',l:'API والتكامل'},
  {k:'backup',icon:'💾',l:'النسخ الاحتياطي'},
]

export default function Settings() {
  const [activeNav, setActiveNav] = useState('general')
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000) }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>إعدادات المنصة</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>تخصيص وإدارة منصة Golden Horizon</p>
        </div>
        <button onClick={save} style={{padding:'9px 20px',background: saved ? 'rgba(0,217,126,0.2)' : 'linear-gradient(135deg,#0EA5E9,#38BDF8)',border: saved ? '1px solid rgba(0,217,126,0.4)' : 'none',borderRadius:8,color: saved ? '#00D97E' : '#F1F5F9',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem',transition:'all 0.2s'}}>
          {saved ? '✓ تم الحفظ' : '💾 حفظ التغييرات'}
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:20,alignItems:'start'}}>
        {/* Sidebar Nav */}
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden'}}>
          {navItems.map((item,i)=>(
            <button key={item.k} onClick={()=>setActiveNav(item.k)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background: activeNav===item.k ? 'rgba(14,165,233,0.08)' : 'transparent',border:'none',borderRight: activeNav===item.k ? '2px solid #C9A84C' : '2px solid transparent',borderLeft:'none',color: activeNav===item.k ? '#0EA5E9' : '#475569',fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",textAlign:'right',transition:'all 0.15s',borderBottom: i<navItems.length-1 ? '1px solid rgba(203,213,225,0.5)' : 'none'}}
              onMouseEnter={e=>{if(activeNav!==item.k)e.currentTarget.style.background='rgba(14,165,233,0.04)'}}
              onMouseLeave={e=>{if(activeNav!==item.k)e.currentTarget.style.background='transparent'}}>
              <span style={{fontSize:'1rem'}}>{item.icon}</span>
              <span>{item.l}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {activeNav==='general' && (
            <>
              <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
                <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:16}}>🏢 معلومات المنصة</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <Field label="اسم المنصة" value="Golden Horizon Investments"/>
                  <Field label="البريد الرسمي" value="info@goldenhorizon.com"/>
                  <Field label="رقم الهاتف" value="+966 11 234 5678"/>
                  <Field label="الموقع الجغرافي" value="الرياض، المملكة العربية السعودية"/>
                  <div style={{gridColumn:'1/-1'}}><Field label="العنوان" value="طريق الملك فهد، حي العليا، الرياض 12211"/></div>
                  <div style={{gridColumn:'1/-1'}}>
                    <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>وصف المنصة</div>
                    <textarea defaultValue="منصة Golden Horizon للاستثمارات المالية — نقدم خدمات إدارة المحافظ والاستشارات المالية للمستثمرين في منطقة الخليج العربي." rows={3}
                      style={{width:'100%',padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",resize:'none',outline:'none',boxSizing:'border-box'}}
                      onFocus={e=>e.target.style.borderColor='#0EA5E9'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </div>
                </div>
              </div>
              <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
                <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:16}}>⚙️ إعدادات النظام</div>
                {[{label:'الوضع التجريبي (Maintenance Mode)',on:false},{label:'التسجيل مفتوح للعامة',on:false},{label:'عرض بيانات حية من السوق',on:true},{label:'التوقيع الإلكتروني مطلوب',on:true}].map((item,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom: i<3 ? '1px solid rgba(203,213,225,0.6)' : 'none'}}>
                    <span style={{fontSize:'0.82rem',color:'#1E293B'}}>{item.label}</span>
                    <Toggle on={item.on} onChange={()=>{}}/>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeNav==='financial' && (
            <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
              <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:16}}>💰 الهيكل المالي</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <Field label="رسوم الإدارة %" value="1.5"/>
                <Field label="رسوم الأداء %" value="20"/>
                <Field label="الحد الأدنى للاستثمار ($)" value="10,000"/>
                <Field label="الحد الأقصى للسحب اليومي ($)" value="500,000"/>
                <Field label="عملة النظام" value="USD"/>
                <Field label="المحفظة الافتراضية" value="مختلطة محافظة"/>
              </div>
              <div style={{marginTop:16}}>
                <div style={{fontSize:'0.8rem',fontWeight:700,color:'#1E293B',marginBottom:10}}>فئات رسوم الإدارة</div>
                <div style={{background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:10,overflow:'hidden'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['الفئة','الحد الأدنى','الحد الأقصى','الرسوم %'].map(h=><th key={h} style={{padding:'9px 14px',textAlign:'right',fontSize:'0.68rem',color:'#64748B',borderBottom:'1px solid #E2E8F0',fontWeight:600}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[['عادي','$10K','$100K','1.5%'],['بريميوم','$100K','$500K','1.2%'],['VIP','$500K+','—','0.9%']].map((row,i)=>(
                        <tr key={i}><td style={{padding:'9px 14px',fontSize:'0.78rem',color:'#1E293B',borderBottom: i<2 ? '1px solid rgba(203,213,225,0.6)' : 'none'}}>{row[0]}</td><td style={{padding:'9px 14px',fontSize:'0.78rem',color:'#64748B',borderBottom: i<2 ? '1px solid rgba(203,213,225,0.6)' : 'none',fontFamily:'monospace'}}>{row[1]}</td><td style={{padding:'9px 14px',fontSize:'0.78rem',color:'#64748B',borderBottom: i<2 ? '1px solid rgba(203,213,225,0.6)' : 'none',fontFamily:'monospace'}}>{row[2]}</td><td style={{padding:'9px 14px',borderBottom: i<2 ? '1px solid rgba(203,213,225,0.6)' : 'none'}}><span style={{color:'#0EA5E9',fontFamily:'monospace',fontWeight:700,fontSize:'0.82rem'}}>{row[3]}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeNav==='api' && (
            <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:20}}>
              <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:16}}>🔗 مفاتيح API والتكامل</div>
              {[
                {label:'مفتاح API الرئيسي',value:'gh_prod_••••••••••••••••••••••••••••••••',masked:true},
                {label:'مفتاح API الاختبار',value:'gh_test_••••••••••••••••••••••••••••••••',masked:true},
                {label:'Webhook URL',value:'https://goldenhorizon.com/api/webhook'},
              ].map((f,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{fontSize:'0.72rem',color:'#64748B',fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <div style={{display:'flex',gap:8}}>
                    <div style={{flex:1,padding:'10px 12px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.78rem',fontFamily:'monospace'}}>{f.value}</div>
                    <button style={{padding:'10px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:8,color:'#0EA5E9',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",flexShrink:0}}>نسخ</button>
                    {f.masked && <button style={{padding:'10px 14px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8,color:'#3B82F6',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",flexShrink:0}}>تجديد</button>}
                  </div>
                </div>
              ))}
              <div style={{marginTop:16,padding:14,background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:8}}>
                <div style={{fontSize:'0.75rem',color:'#F59E0B',fontWeight:600,marginBottom:4}}>⚠️ تنبيه أمني</div>
                <div style={{fontSize:'0.72rem',color:'#1E293B',lineHeight:1.6}}>لا تشارك مفاتيح API مع أي شخص. في حال الاشتباه في اختراق، قم بتجديد المفاتيح فوراً.</div>
              </div>
            </div>
          )}

          {!['general','financial','api'].includes(activeNav) && (
            <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,padding:40,textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:12}}>{navItems.find(n=>n.k===activeNav)?.icon}</div>
              <div style={{fontSize:'0.9rem',color:'#64748B'}}>إعدادات {navItems.find(n=>n.k===activeNav)?.l} — قريباً</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
