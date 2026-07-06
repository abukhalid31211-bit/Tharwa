import { useState } from 'react'
import { Save, Eye, RefreshCw } from 'lucide-react'
import { mockHeroData, mockTrustBadges, mockSiteStats } from '../adminData'
import { saveSettings } from '../../../lib/api'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

function Field({label,value,onChange,type='text',rows=0}:{label:string;value:string;onChange:(v:string)=>void;type?:string;rows?:number}) {
  const base:React.CSSProperties = {width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}
  return (
    <div>
      <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>{label}</div>
      {rows > 0
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            style={{...base,resize:'vertical'}}
            onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)}
            style={base}
            onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
      }
    </div>
  )
}

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:38,height:20,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function SectionCard({title,children}:{title:string;children:React.ReactNode}) {
  return (
    <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:20}}>
      <div style={{fontSize:'0.875rem',fontWeight:700,color:S.text,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${S.border}`}}>{title}</div>
      {children}
    </div>
  )
}

export default function HeroManager() {
  const [hero, setHero] = useState({...mockHeroData})
  const [badges, setBadges] = useState([...mockTrustBadges])
  const [stats, setStats] = useState([...mockSiteStats])
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'hero'|'badges'|'stats'>('hero')

  const save = async () => {
    try {
      await saveSettings({
        hero_data: JSON.stringify(hero),
        trust_badges: JSON.stringify(badges),
        site_stats: JSON.stringify(stats),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('حدث خطأ أثناء الحفظ')
    }
  }

  const updateBadge = (id:number, field:string, value:unknown) =>
    setBadges(b => b.map(x => x.id===id ? {...x,[field]:value} : x))

  const updateStat = (id:number, field:string, value:unknown) =>
    setStats(s => s.map(x => x.id===id ? {...x,[field]:value} : x))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>إدارة القسم الرئيسي</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>Hero Section • شارات الثقة • الإحصائيات</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>window.open('/','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة الصفحة
          </button>
          <button onClick={save} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:saved?`rgba(0,217,126,0.15)`:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:saved?`1px solid rgba(0,217,126,0.4)`:'none',borderRadius:8,color:saved?S.green:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            {saved ? <><RefreshCw size={13}/> تم الحفظ</> : <><Save size={13}/> حفظ</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,background:S.card,border:`1px solid ${S.border}`,borderRadius:10,padding:4,width:'fit-content'}}>
        {([['hero','🦸 قسم البطل'],['badges','🛡️ شارات الثقة'],['stats','📊 الإحصائيات']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 18px',background:tab===k?S.bg:'transparent',border:'none',borderRadius:7,color:tab===k?S.text:S.muted,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:tab===k?600:400}}>{l}</button>
        ))}
      </div>

      {tab==='hero' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <SectionCard title="🏷️ الشارة العلوية">
            <Field label="نص الشارة (الشريط الأعلى)" value={hero.badge} onChange={v=>setHero({...hero,badge:v})}/>
          </SectionCard>

          <SectionCard title="📝 النصوص الرئيسية">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="الكلمة المتحولة (Typewriter)" value={hero.typewriterText} onChange={v=>setHero({...hero,typewriterText:v})}/>
              <Field label="السطر الثاني" value={hero.line2} onChange={v=>setHero({...hero,line2:v})}/>
              <div style={{gridColumn:'1/-1'}}>
                <Field label="السطر الثالث (الوصف المختصر)" value={hero.line3} onChange={v=>setHero({...hero,line3:v})}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <Field label="الوصف الطويل (الفقرة)" value={hero.description} onChange={v=>setHero({...hero,description:v})} rows={3}/>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="🔘 أزرار الاستدعاء (CTA)">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="نص الزر الأول" value={hero.btn1Text} onChange={v=>setHero({...hero,btn1Text:v})}/>
              <Field label="رابط الزر الأول" value={hero.btn1Link} onChange={v=>setHero({...hero,btn1Link:v})}/>
              <Field label="نص الزر الثاني" value={hero.btn2Text} onChange={v=>setHero({...hero,btn2Text:v})}/>
              <Field label="رابط الزر الثاني" value={hero.btn2Link} onChange={v=>setHero({...hero,btn2Link:v})}/>
            </div>
          </SectionCard>

          <SectionCard title="💼 بيانات المحفظة العائمة">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12}}>
              <Field label="قيمة المحفظة" value={hero.portfolioValue} onChange={v=>setHero({...hero,portfolioValue:v})}/>
              <Field label="التغيير" value={hero.portfolioChange} onChange={v=>setHero({...hero,portfolioChange:v})}/>
              <Field label="البطاقة العائمة 1 (رمز)" value={hero.floatingCard1Symbol} onChange={v=>setHero({...hero,floatingCard1Symbol:v})}/>
              <Field label="البطاقة العائمة 1 (نسبة)" value={hero.floatingCard1Change} onChange={v=>setHero({...hero,floatingCard1Change:v})}/>
              <Field label="البطاقة العائمة 2 (رمز)" value={hero.floatingCard2Symbol} onChange={v=>setHero({...hero,floatingCard2Symbol:v})}/>
              <Field label="البطاقة العائمة 2 (نسبة)" value={hero.floatingCard2Change} onChange={v=>setHero({...hero,floatingCard2Change:v})}/>
            </div>
          </SectionCard>
        </div>
      )}

      {tab==='badges' && (
        <SectionCard title="🛡️ شارات الثقة (Trust Badges)">
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {badges.map(b=>(
              <div key={b.id} style={{display:'grid',gridTemplateColumns:'60px 1fr 80px',gap:12,alignItems:'center',padding:'10px 14px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`}}>
                <input value={b.icon} onChange={e=>updateBadge(b.id,'icon',e.target.value)}
                  style={{padding:'8px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'1.3rem',textAlign:'center',outline:'none',fontFamily:"'Cairo',sans-serif"}}/>
                <input value={b.text} onChange={e=>updateBadge(b.id,'text',e.target.value)}
                  style={{padding:'9px 12px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.82rem',outline:'none',fontFamily:"'Cairo',sans-serif"}}
                  onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Toggle on={b.visible} onChange={v=>updateBadge(b.id,'visible',v)}/>
                </div>
              </div>
            ))}
            <button onClick={()=>setBadges([...badges,{id:Date.now(),icon:'🌟',text:'شارة جديدة',visible:true,order:badges.length+1}])}
              style={{padding:'9px',background:`rgba(14,165,233,0.06)`,border:`1px dashed rgba(14,165,233,0.3)`,borderRadius:10,color:S.gold,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
              + إضافة شارة
            </button>
          </div>
        </SectionCard>
      )}

      {tab==='stats' && (
        <SectionCard title="📊 إحصائيات القسم الرئيسي">
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {stats.map(s=>(
              <div key={s.id} style={{display:'grid',gridTemplateColumns:'60px 80px 1fr 100px 80px 80px',gap:10,alignItems:'center',padding:'10px 14px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`}}>
                <input value={s.prefix} onChange={e=>updateStat(s.id,'prefix',e.target.value)} placeholder="بادئة"
                  style={{padding:'8px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.gold,fontSize:'0.82rem',outline:'none',fontFamily:'monospace',textAlign:'center'}}/>
                <input type="number" value={s.value} onChange={e=>updateStat(s.id,'value',Number(e.target.value))} placeholder="القيمة"
                  style={{padding:'8px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.82rem',outline:'none',fontFamily:'monospace',textAlign:'center'}}/>
                <input value={s.label} onChange={e=>updateStat(s.id,'label',e.target.value)} placeholder="التسمية"
                  style={{padding:'8px 12px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.82rem',outline:'none',fontFamily:"'Cairo',sans-serif"}}/>
                <input value={s.suffix} onChange={e=>updateStat(s.id,'suffix',e.target.value)} placeholder="لاحقة"
                  style={{padding:'8px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.gold,fontSize:'0.82rem',outline:'none',fontFamily:'monospace',textAlign:'center'}}/>
                <input type="number" value={s.duration} onChange={e=>updateStat(s.id,'duration',Number(e.target.value))} placeholder="مدة"
                  style={{padding:'8px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:7,color:S.muted,fontSize:'0.75rem',outline:'none',textAlign:'center'}}/>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <Toggle on={s.visible} onChange={v=>updateStat(s.id,'visible',v)}/>
                </div>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'60px 80px 1fr 100px 80px 80px',gap:10,paddingRight:14}}>
              {['بادئة','القيمة','التسمية','لاحقة','مدة (ms)','ظاهر'].map(h=>(
                <span key={h} style={{fontSize:'0.62rem',color:S.muted,fontWeight:600,textAlign:'center'}}>{h}</span>
              ))}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
