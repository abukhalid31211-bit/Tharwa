import { useState } from 'react'
import { Plus, Edit, Trash2, X, Star, Eye } from 'lucide-react'
import { mockTestimonials } from '../adminData'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

type Testimonial = typeof mockTestimonials[0]

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:36,height:19,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:15,height:15,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function StarRating({value,onChange}:{value:number;onChange:(v:number)=>void}) {
  return (
    <div style={{display:'flex',gap:4}}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} onClick={()=>onChange(n)} style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:'1.2rem',color:n<=value?S.gold:'rgba(203,213,225,0.8)',transition:'color 0.2s'}}>★</button>
      ))}
    </div>
  )
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

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([...mockTestimonials])
  const [editing, setEditing] = useState<Testimonial|null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)

  const openNew = () => {
    setIsNew(true)
    setEditing({id:Date.now(),name:'',role:'',city:'',text:'',rating:5,visible:true,order:items.length+1})
  }

  const saveItem = (item:Testimonial) => {
    if (isNew) setItems(prev=>[...prev,item])
    else setItems(prev=>prev.map(x=>x.id===item.id?item:x))
    setEditing(null); setIsNew(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const del = (id:number) => setItems(prev=>prev.filter(x=>x.id!==id))
  const toggle = (id:number) => setItems(prev=>prev.map(x=>x.id===id?{...x,visible:!x.visible}:x))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>إدارة الشهادات والتقييمات</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>{items.length} شهادة — متوسط {(items.reduce((s,i)=>s+i.rating,0)/items.length).toFixed(1)} ⭐</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saved && <span style={{fontSize:'0.75rem',color:S.green}}>✓ تم الحفظ</span>}
          <button onClick={()=>window.open('/','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
          <button onClick={openNew} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> شهادة جديدة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[{l:'إجمالي الشهادات',v:items.length,c:'#3B82F6',i:'💬'},
          {l:'ظاهرة',v:items.filter(x=>x.visible).length,c:S.green,i:'✅'},
          {l:'تقييم 5 نجوم',v:items.filter(x=>x.rating===5).length,c:S.gold,i:'⭐'},
          {l:'متوسط التقييم',v:(items.reduce((s,i)=>s+i.rating,0)/items.length).toFixed(1),c:S.gold,i:'📊'},
        ].map((x,i)=>(
          <div key={i} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.4rem'}}>{x.i}</span>
            <div><div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600}}>{x.l}</div><div style={{fontSize:'1.4rem',fontWeight:800,color:x.c,fontFamily:'monospace'}}>{x.v}</div></div>
          </div>
        ))}
      </div>

      {/* Testimonial Cards Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        {items.map(item=>(
          <div key={item.id} style={{background:S.card,border:`1px solid ${item.visible?S.border:'rgba(203,213,225,0.6)'}`,borderRadius:14,padding:20,display:'flex',flexDirection:'column',gap:14,opacity:item.visible?1:0.6}}>
            {/* Header */}
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,rgba(14,165,233,0.2),rgba(14,165,233,0.05))`,border:`1px solid rgba(14,165,233,0.2)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',fontWeight:800,color:S.gold,flexShrink:0}}>
                {item.name ? item.name.charAt(0) : '?'}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.88rem',fontWeight:700,color:S.text}}>{item.name||'(بدون اسم)'}</div>
                <div style={{fontSize:'0.72rem',color:S.muted,marginTop:2}}>{item.role} — {item.city}</div>
              </div>
              <Toggle on={item.visible} onChange={()=>toggle(item.id)}/>
            </div>

            {/* Stars */}
            <div style={{display:'flex',gap:2}}>
              {[1,2,3,4,5].map(n=>(
                <Star key={n} size={14} fill={n<=item.rating?S.gold:'transparent'} color={n<=item.rating?S.gold:'rgba(203,213,225,0.8)'}/>
              ))}
            </div>

            {/* Text */}
            <p style={{fontSize:'0.82rem',color:S.muted,lineHeight:1.8,margin:0,flex:1}}>
              "{item.text}"
            </p>

            {/* Actions */}
            <div style={{display:'flex',gap:6,borderTop:`1px solid ${S.border}`,paddingTop:12}}>
              <button onClick={()=>{setEditing({...item});setIsNew(false)}} style={{flex:1,padding:'7px',background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:7,color:S.gold,fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                <Edit size={11}/> تعديل
              </button>
              <button onClick={()=>del(item.id)} style={{width:32,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:7,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}>
                <Trash2 size={11}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setEditing(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:560}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:S.text}}>{isNew?'شهادة جديدة':'تعديل الشهادة'}</span>
              <button onClick={()=>setEditing(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Field label="الاسم الكامل" value={editing.name} onChange={v=>setEditing({...editing,name:v})}/>
                <Field label="المدينة" value={editing.city} onChange={v=>setEditing({...editing,city:v})}/>
                <div style={{gridColumn:'1/-1'}}>
                  <Field label="الوظيفة / الصفة" value={editing.role} onChange={v=>setEditing({...editing,role:v})}/>
                </div>
              </div>
              <Field label="نص الشهادة" value={editing.text} onChange={v=>setEditing({...editing,text:v})} rows={4}/>
              <div>
                <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:8}}>التقييم</div>
                <StarRating value={editing.rating} onChange={v=>setEditing({...editing,rating:v})}/>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderTop:`1px solid ${S.border}`}}>
                <span style={{fontSize:'0.82rem',color:S.text}}>إظهار الشهادة في الموقع</span>
                <Toggle on={editing.visible} onChange={v=>setEditing({...editing,visible:v})}/>
              </div>
              <button onClick={()=>saveItem(editing)} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ الشهادة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
