import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { getServices, createService, updateService, deleteService } from '../../../lib/api'
import type { Service } from '../../../lib/api'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:38,height:20,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function Field({label,value,onChange,rows=0}:{label:string;value:string;onChange:(v:string)=>void;rows?:number}) {
  const base:React.CSSProperties = {width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}
  return (
    <div>
      <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>{label}</div>
      {rows>0 ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} style={{...base,resize:'vertical'}} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
               : <input value={value} onChange={e=>onChange(e.target.value)} style={base} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>}
    </div>
  )
}

const riskColor = (r:string) => r.includes('منخفض') ? S.green : r.includes('مرتفع') ? S.red : S.gold

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service|null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getServices()
      .then(res => setServices(res.items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setIsNew(true)
    setEditing({id:Date.now(),slug:'new-service',emoji:'📊',icon:'TrendingUp',title:'',subtitle:'',description:'',features:['','',''],returns:'',risk:'متوسط',minInvest:'',visible:true,order:services.length+1})
  }

  const save = async (svc:Service) => {
    try {
      if (isNew) {
        const { item } = await createService(svc)
        setServices(prev=>[...prev,item])
      } else {
        const { item } = await updateService(svc.id, svc)
        setServices(prev=>prev.map(s=>s.id===svc.id?item:s))
      }
      setEditing(null); setIsNew(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
    } catch { alert('حدث خطأ أثناء الحفظ') }
  }

  const del = async (id:number) => {
    await deleteService(id).catch(()=>{})
    setServices(prev=>prev.filter(s=>s.id!==id))
  }

  const toggle = async (id:number) => {
    const svc = services.find(s=>s.id===id)
    if (!svc) return
    const updated = { ...svc, visible: !svc.visible }
    setServices(prev=>prev.map(s=>s.id===id?updated:s))
    await updateService(id, { visible: updated.visible }).catch(()=>{})
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>إدارة الخدمات</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>{services.length} خدمة — {services.filter(s=>s.visible).length} ظاهرة</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saved && <span style={{fontSize:'0.75rem',color:S.green}}>✓ تم الحفظ</span>}
          <button onClick={()=>window.open('/services','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
          <button onClick={openNew} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> خدمة جديدة
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[{l:'إجمالي الخدمات',v:services.length,c:'#3B82F6',i:'📋'},
          {l:'ظاهرة',v:services.filter(s=>s.visible).length,c:S.green,i:'👁️'},
          {l:'مخفية',v:services.filter(s=>!s.visible).length,c:S.muted,i:'🙈'},
          {l:'ميزات إجمالية',v:services.reduce((a,s)=>a+s.features.length,0),c:S.gold,i:'✅'},
        ].map((x,i)=>(
          <div key={i} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.4rem'}}>{x.i}</span>
            <div><div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600}}>{x.l}</div><div style={{fontSize:'1.4rem',fontWeight:800,color:x.c,fontFamily:'monospace'}}>{x.v}</div></div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{padding:32,textAlign:'center',color:S.muted,fontSize:'0.82rem'}}>جاري التحميل...</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
          {services.map(svc=>(
            <div key={svc.id} style={{background:S.card,border:`1px solid ${svc.visible?S.border:'rgba(203,213,225,0.6)'}`,borderRadius:14,padding:20,opacity:svc.visible?1:0.6}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,rgba(14,165,233,0.15),rgba(14,165,233,0.05))`,border:`1px solid rgba(14,165,233,0.2)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>
                  {svc.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.9rem',fontWeight:700,color:S.text}}>{svc.title||'(بدون عنوان)'}</div>
                  <div style={{fontSize:'0.7rem',color:S.muted,marginTop:2}}>{svc.subtitle}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                  <Toggle on={svc.visible} onChange={()=>toggle(svc.id)}/>
                  <span style={{fontSize:'0.62rem',color:svc.visible?S.green:S.muted}}>{svc.visible?'ظاهر':'مخفي'}</span>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
                {[{l:'العائد',v:svc.returns||'—',c:'#3B82F6'},{l:'المخاطر',v:svc.risk||'—',c:riskColor(svc.risk||'')},{l:'الحد الأدنى',v:svc.minInvest||'—',c:S.gold}].map(x=>(
                  <div key={x.l} style={{background:S.bg,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                    <div style={{fontSize:'0.6rem',color:S.muted,fontWeight:600}}>{x.l}</div>
                    <div style={{fontSize:'0.75rem',fontWeight:700,color:x.c,fontFamily:'monospace'}}>{x.v}</div>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:'0.65rem',color:S.muted,fontWeight:600,marginBottom:6}}>المميزات ({svc.features.length})</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {svc.features.slice(0,4).map((f,i)=>(
                    <span key={i} style={{fontSize:'0.62rem',color:S.text,background:'rgba(203,213,225,0.8)',borderRadius:4,padding:'2px 7px'}}>✅ {f}</span>
                  ))}
                  {svc.features.length>4 && <span style={{fontSize:'0.62rem',color:S.muted,padding:'2px 4px'}}>+{svc.features.length-4}</span>}
                </div>
              </div>

              <div style={{display:'flex',gap:6,borderTop:`1px solid ${S.border}`,paddingTop:12}}>
                <button onClick={()=>{setEditing({...svc});setIsNew(false)}} style={{flex:1,padding:'7px',background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:7,color:S.gold,fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                  <Edit size={11}/> تعديل
                </button>
                <button onClick={()=>toggle(svc.id)} style={{width:32,background:svc.visible?`rgba(107,132,168,0.1)`:`rgba(0,217,126,0.1)`,border:`1px solid ${svc.visible?'rgba(107,132,168,0.2)':'rgba(0,217,126,0.2)'}`,borderRadius:7,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:svc.visible?S.muted:S.green}}>
                  {svc.visible ? <EyeOff size={11}/> : <Eye size={11}/>}
                </button>
                <button onClick={()=>del(svc.id)} style={{width:32,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:7,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}>
                  <Trash2 size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setEditing(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:680,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#FFFFFF',zIndex:1}}>
              <span style={{fontWeight:700,color:S.text}}>{isNew?'خدمة جديدة':'تعديل الخدمة'}</span>
              <button onClick={()=>setEditing(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr',gap:12}}>
                <Field label="الإيموجي" value={editing.emoji} onChange={v=>setEditing({...editing,emoji:v})}/>
                <Field label="عنوان الخدمة" value={editing.title} onChange={v=>setEditing({...editing,title:v})}/>
                <Field label="العنوان الفرعي" value={editing.subtitle||''} onChange={v=>setEditing({...editing,subtitle:v})}/>
              </div>
              <Field label="الوصف" value={editing.description||''} onChange={v=>setEditing({...editing,description:v})} rows={3}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                <Field label="معدل العائد المتوقع" value={editing.returns||''} onChange={v=>setEditing({...editing,returns:v})}/>
                <Field label="مستوى المخاطر" value={editing.risk||''} onChange={v=>setEditing({...editing,risk:v})}/>
                <Field label="الحد الأدنى للاستثمار" value={editing.minInvest||''} onChange={v=>setEditing({...editing,minInvest:v})}/>
              </div>
              <div>
                <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:8}}>المميزات</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {editing.features.map((f,i)=>(
                    <div key={i} style={{display:'flex',gap:6}}>
                      <input value={f} onChange={e=>setEditing({...editing,features:editing.features.map((x,j)=>j===i?e.target.value:x)})}
                        style={{flex:1,padding:'8px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}
                        onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
                      <button onClick={()=>setEditing({...editing,features:editing.features.filter((_,j)=>j!==i)})}
                        style={{width:32,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:7,cursor:'pointer',color:S.red,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <X size={11}/>
                      </button>
                    </div>
                  ))}
                  <button onClick={()=>setEditing({...editing,features:[...editing.features,'']})}
                    style={{padding:'7px',background:`rgba(14,165,233,0.06)`,border:`1px dashed rgba(14,165,233,0.3)`,borderRadius:7,color:S.gold,fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
                    + إضافة ميزة
                  </button>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderTop:`1px solid ${S.border}`}}>
                <span style={{fontSize:'0.82rem',color:S.text}}>إظهار الخدمة في الموقع</span>
                <Toggle on={editing.visible} onChange={v=>setEditing({...editing,visible:v})}/>
              </div>
              <button onClick={()=>save(editing)} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ الخدمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
