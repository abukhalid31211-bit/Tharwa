import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save, Eye } from 'lucide-react'
import { mockTimelineEvents, mockCoreValues, mockWhyChooseUs, mockHowItWorks, mockAboutHeroStats } from '../adminData'
import { getSettings, saveSettings } from '../../../lib/api'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

type Timeline = typeof mockTimelineEvents[0]
type Value = typeof mockCoreValues[0]
type Feature = typeof mockWhyChooseUs[0]
type Step = typeof mockHowItWorks[0]
type Stat = typeof mockAboutHeroStats[0]

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:36,height:19,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:15,height:15,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function Field({label,value,onChange,rows=0}:{label:string;value:string;onChange:(v:string)=>void;rows?:number}) {
  const base:React.CSSProperties = {width:'100%',padding:'8px 11px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.8rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}
  return (
    <div>
      <div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600,marginBottom:4}}>{label}</div>
      {rows>0 ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} style={{...base,resize:'vertical'}} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
               : <input value={value} onChange={e=>onChange(e.target.value)} style={base} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>}
    </div>
  )
}

function SectionCard({title,onAdd,children}:{title:string;onAdd?:()=>void;children:React.ReactNode}) {
  return (
    <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${S.border}`}}>
        <span style={{fontSize:'0.875rem',fontWeight:700,color:S.text}}>{title}</span>
        {onAdd && <button onClick={onAdd} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:7,color:S.gold,fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}><Plus size={12}/>إضافة</button>}
      </div>
      {children}
    </div>
  )
}

type ModalItem = {type:'timeline';item:Timeline}|{type:'value';item:Value}|{type:'feature';item:Feature}|{type:'step';item:Step}|{type:'stat';item:Stat}

export default function AboutManager() {
  const [tab, setTab] = useState<'timeline'|'values'|'why'|'how'|'stats'>('timeline')
  const [timeline, setTimeline] = useState<Timeline[]>([...mockTimelineEvents])
  const [values, setValues] = useState<Value[]>([...mockCoreValues])
  const [features, setFeatures] = useState<Feature[]>([...mockWhyChooseUs])
  const [steps, setSteps] = useState<Step[]>([...mockHowItWorks])
  const [heroStats, setHeroStats] = useState<Stat[]>([...mockAboutHeroStats])
  const [modal, setModal] = useState<ModalItem|null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings().then(data => {
      const s = (data as {settings?: Record<string,string>}).settings || {}
      try { if (s.about_timeline) setTimeline(JSON.parse(s.about_timeline)) } catch {}
      try { if (s.about_values) setValues(JSON.parse(s.about_values)) } catch {}
      try { if (s.about_features) setFeatures(JSON.parse(s.about_features)) } catch {}
      try { if (s.about_steps) setSteps(JSON.parse(s.about_steps)) } catch {}
      try { if (s.about_hero_stats) setHeroStats(JSON.parse(s.about_hero_stats)) } catch {}
    }).catch(() => {})
  }, [])

  const save = async () => {
    try {
      await saveSettings({
        about_timeline: JSON.stringify(timeline),
        about_values: JSON.stringify(values),
        about_features: JSON.stringify(features),
        about_steps: JSON.stringify(steps),
        about_hero_stats: JSON.stringify(heroStats),
      })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('حدث خطأ أثناء الحفظ') }
  }

  const openModal = (type:ModalItem['type'], item:unknown, isNewItem=false) => {
    setIsNew(isNewItem)
    setModal({type, item} as ModalItem)
  }

  const saveModal = () => {
    if (!modal) return
    if (modal.type==='timeline') {
      if (isNew) setTimeline(prev=>[...prev,modal.item])
      else setTimeline(prev=>prev.map(x=>x.id===modal.item.id?modal.item:x))
    } else if (modal.type==='value') {
      if (isNew) setValues(prev=>[...prev,modal.item])
      else setValues(prev=>prev.map(x=>x.id===modal.item.id?modal.item:x))
    } else if (modal.type==='feature') {
      if (isNew) setFeatures(prev=>[...prev,modal.item])
      else setFeatures(prev=>prev.map(x=>x.id===modal.item.id?modal.item:x))
    } else if (modal.type==='step') {
      if (isNew) setSteps(prev=>[...prev,modal.item])
      else setSteps(prev=>prev.map(x=>x.id===modal.item.id?modal.item:x))
    } else if (modal.type==='stat') {
      if (isNew) setHeroStats(prev=>[...prev,modal.item])
      else setHeroStats(prev=>prev.map(x=>x.id===modal.item.id?modal.item:x))
    }
    setModal(null)
    save()
  }

  const updateModalItem = (field:string, value:unknown) => {
    if (!modal) return
    setModal({...modal, item:{...modal.item,[field]:value}} as ModalItem)
  }

  const del = (type:string, id:number) => {
    if (type==='timeline') setTimeline(prev=>prev.filter(x=>x.id!==id))
    else if (type==='value') setValues(prev=>prev.filter(x=>x.id!==id))
    else if (type==='feature') setFeatures(prev=>prev.filter(x=>x.id!==id))
    else if (type==='step') setSteps(prev=>prev.filter(x=>x.id!==id))
    else if (type==='stat') setHeroStats(prev=>prev.filter(x=>x.id!==id))
  }

  const toggleItem = (type:string, id:number) => {
    if (type==='timeline') setTimeline(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))
    else if (type==='value') setValues(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))
    else if (type==='feature') setFeatures(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))
    else if (type==='step') setSteps(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))
    else if (type==='stat') setHeroStats(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))
  }

  const ItemCard = ({type,id,title,sub,icon,visible,onEdit}:{type:string;id:number;title:string;sub:string;icon?:string;visible:boolean;onEdit:()=>void}) => (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`,opacity:visible?1:0.5}}>
      {icon && <span style={{fontSize:'1.3rem',flexShrink:0}}>{icon}</span>}
      <div style={{flex:1}}>
        <div style={{fontSize:'0.82rem',fontWeight:600,color:S.text}}>{title||'(بدون عنوان)'}</div>
        <div style={{fontSize:'0.7rem',color:S.muted,marginTop:2}}>{sub}</div>
      </div>
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <Toggle on={visible} onChange={()=>toggleItem(type,id)}/>
        <button onClick={onEdit} style={{width:28,height:28,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={11}/></button>
        <button onClick={()=>del(type,id)} style={{width:28,height:28,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={11}/></button>
      </div>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>صفحة من نحن</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>التاريخ • القيم • لماذا نحن • كيف نعمل</p>
        </div>
        <button onClick={()=>window.open('/about','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
        <button onClick={save} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 18px',background:saved?`rgba(0,217,126,0.15)`:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:saved?`1px solid rgba(0,217,126,0.4)`:'none',borderRadius:8,color:saved?S.green:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          {saved ? '✓ تم الحفظ' : <><Save size={13}/> حفظ</>}
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,background:S.card,border:`1px solid ${S.border}`,borderRadius:10,padding:4,width:'fit-content',flexWrap:'wrap'}}>
        {([['timeline','🕐 التاريخ'],['values','💎 القيم'],['why','🏆 لماذا نحن'],['how','⚙️ كيف نعمل'],['stats','📊 إحصائيات']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 16px',background:tab===k?S.bg:'transparent',border:'none',borderRadius:7,color:tab===k?S.text:S.muted,fontSize:'0.76rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:tab===k?600:400}}>{l}</button>
        ))}
      </div>

      {tab==='timeline' && (
        <SectionCard title="🕐 أحداث التاريخ" onAdd={()=>openModal('timeline',{id:Date.now(),year:String(new Date().getFullYear()),title:'',description:'',order:timeline.length+1,visible:true},true)}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {timeline.map(ev=>(
              <ItemCard key={ev.id} type="timeline" id={ev.id} title={ev.title} sub={`${ev.year} — ${ev.description.slice(0,60)}...`} visible={ev.visible} onEdit={()=>openModal('timeline',{...ev})}/>
            ))}
          </div>
        </SectionCard>
      )}

      {tab==='values' && (
        <SectionCard title="💎 القيم الجوهرية" onAdd={()=>openModal('value',{id:Date.now(),icon:'🌟',title:'',description:'',order:values.length+1,visible:true},true)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {values.map(v=>(
              <ItemCard key={v.id} type="value" id={v.id} title={v.title} sub={v.description} icon={v.icon} visible={v.visible} onEdit={()=>openModal('value',{...v})}/>
            ))}
          </div>
        </SectionCard>
      )}

      {tab==='why' && (
        <SectionCard title="🏆 لماذا تختارنا" onAdd={()=>openModal('feature',{id:Date.now(),icon:'✨',title:'',description:'',order:features.length+1,visible:true},true)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {features.map(f=>(
              <ItemCard key={f.id} type="feature" id={f.id} title={f.title} sub={f.description} icon={f.icon} visible={f.visible} onEdit={()=>openModal('feature',{...f})}/>
            ))}
          </div>
        </SectionCard>
      )}

      {tab==='how' && (
        <SectionCard title="⚙️ كيف نعمل" onAdd={()=>openModal('step',{id:Date.now(),step:`0${steps.length+1}`,icon:'🔹',title:'',description:'',order:steps.length+1,visible:true},true)}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {steps.map(s=>(
              <ItemCard key={s.id} type="step" id={s.id} title={`الخطوة ${s.step}: ${s.title}`} sub={s.description} icon={s.icon} visible={s.visible} onEdit={()=>openModal('step',{...s})}/>
            ))}
          </div>
        </SectionCard>
      )}

      {tab==='stats' && (
        <SectionCard title="📊 إحصائيات صفحة من نحن" onAdd={()=>openModal('stat',{id:Date.now(),icon:'📌',value:'',label:'',order:heroStats.length+1,visible:true},true)}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
            {heroStats.map(s=>(
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'14px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`,opacity:s.visible?1:0.5}}>
                <span style={{fontSize:'1.8rem'}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'1.1rem',fontWeight:800,color:S.gold,fontFamily:'monospace'}}>{s.value}</div>
                  <div style={{fontSize:'0.72rem',color:S.muted}}>{s.label}</div>
                </div>
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <Toggle on={s.visible} onChange={()=>toggleItem('stat',s.id)}/>
                  <button onClick={()=>openModal('stat',{...s})} style={{width:26,height:26,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={10}/></button>
                  <button onClick={()=>del('stat',s.id)} style={{width:26,height:26,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={10}/></button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Universal Edit Modal */}
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setModal(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:520}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:S.text}}>
                {modal.type==='timeline'?'حدث تاريخي':modal.type==='value'?'قيمة جوهرية':modal.type==='feature'?'ميزة':modal.type==='step'?'خطوة':'إحصائية'}
              </span>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:12}}>
              {modal.type==='timeline' && (
                <>
                  <div style={{display:'grid',gridTemplateColumns:'100px 1fr',gap:12}}>
                    <Field label="السنة" value={modal.item.year} onChange={v=>updateModalItem('year',v)}/>
                    <Field label="العنوان" value={modal.item.title} onChange={v=>updateModalItem('title',v)}/>
                  </div>
                  <Field label="الوصف" value={modal.item.description} onChange={v=>updateModalItem('description',v)} rows={3}/>
                </>
              )}
              {(modal.type==='value'||modal.type==='feature') && (
                <>
                  <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:12}}>
                    <Field label="الأيقونة" value={modal.item.icon} onChange={v=>updateModalItem('icon',v)}/>
                    <Field label="العنوان" value={modal.item.title} onChange={v=>updateModalItem('title',v)}/>
                  </div>
                  <Field label="الوصف" value={modal.item.description} onChange={v=>updateModalItem('description',v)} rows={2}/>
                </>
              )}
              {modal.type==='step' && (
                <>
                  <div style={{display:'grid',gridTemplateColumns:'80px 80px 1fr',gap:12}}>
                    <Field label="رقم الخطوة" value={modal.item.step} onChange={v=>updateModalItem('step',v)}/>
                    <Field label="الأيقونة" value={modal.item.icon} onChange={v=>updateModalItem('icon',v)}/>
                    <Field label="العنوان" value={modal.item.title} onChange={v=>updateModalItem('title',v)}/>
                  </div>
                  <Field label="الوصف" value={modal.item.description} onChange={v=>updateModalItem('description',v)} rows={2}/>
                </>
              )}
              {modal.type==='stat' && (
                <div style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr',gap:12}}>
                  <Field label="الأيقونة" value={modal.item.icon} onChange={v=>updateModalItem('icon',v)}/>
                  <Field label="القيمة" value={modal.item.value} onChange={v=>updateModalItem('value',v)}/>
                  <Field label="التسمية" value={modal.item.label} onChange={v=>updateModalItem('label',v)}/>
                </div>
              )}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderTop:`1px solid ${S.border}`}}>
                <span style={{fontSize:'0.78rem',color:S.text}}>إظهار في الموقع</span>
                <Toggle on={modal.item.visible} onChange={v=>updateModalItem('visible',v)}/>
              </div>
              <button onClick={saveModal} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
