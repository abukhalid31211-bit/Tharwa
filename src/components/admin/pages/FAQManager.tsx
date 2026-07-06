import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../../lib/api'
import type { FAQ } from '../../../lib/api'
import { mockFAQCategories } from '../adminData'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

type Cat = typeof mockFAQCategories[0]

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:36,height:19,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:15,height:15,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [cats, setCats] = useState<Cat[]>([...mockFAQCategories])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'faqs'|'categories'>('faqs')
  const [catFilter, setCatFilter] = useState(0)
  const [expanded, setExpanded] = useState<number|null>(null)
  const [editing, setEditing] = useState<FAQ|null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newCat, setNewCat] = useState('')

  useEffect(() => {
    getFAQs()
      .then(res => setFaqs(res.items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = catFilter===0 ? faqs : faqs.filter(f=>f.categoryId===catFilter)

  const openNew = () => {
    setIsNew(true)
    setEditing({id:Date.now(),categoryId:cats[0]?.id||1,question:'',answer:'',order:faqs.length+1,visible:true})
  }

  const saveFAQ = async (f:FAQ) => {
    try {
      if (isNew) {
        const { item } = await createFAQ(f)
        setFaqs(prev=>[...prev,item])
      } else {
        const { item } = await updateFAQ(f.id, f)
        setFaqs(prev=>prev.map(x=>x.id===f.id?item:x))
      }
      setEditing(null); setIsNew(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
    } catch { alert('حدث خطأ أثناء الحفظ') }
  }

  const delFAQ = async (id:number) => {
    await deleteFAQ(id).catch(()=>{})
    setFaqs(prev=>prev.filter(f=>f.id!==id))
  }

  const toggleFAQ = async (id:number) => {
    const faq = faqs.find(f=>f.id===id)
    if (!faq) return
    const updated = { ...faq, visible: !faq.visible }
    setFaqs(prev=>prev.map(f=>f.id===id?updated:f))
    await updateFAQ(id, { visible: updated.visible }).catch(()=>{})
  }

  const addCat = () => {
    if (!newCat.trim()) return
    setCats(prev=>[...prev,{id:Date.now(),name:newCat.trim(),order:cats.length+1,visible:true}])
    setNewCat('')
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>إدارة الأسئلة الشائعة</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>{faqs.length} سؤال في {cats.length} قسم</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saved && <span style={{fontSize:'0.75rem',color:S.green}}>✓ تم الحفظ</span>}
          <button onClick={()=>window.open('/faq','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
          <button onClick={openNew} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={14}/> سؤال جديد
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[{l:'إجمالي الأسئلة',v:faqs.length,c:'#3B82F6',i:'❓'},
          {l:'مفعّل',v:faqs.filter(f=>f.visible).length,c:S.green,i:'✅'},
          {l:'مخفي',v:faqs.filter(f=>!f.visible).length,c:S.muted,i:'🙈'},
          {l:'الأقسام',v:cats.length,c:S.gold,i:'📂'},
        ].map((x,i)=>(
          <div key={i} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.4rem'}}>{x.i}</span>
            <div><div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600}}>{x.l}</div><div style={{fontSize:'1.4rem',fontWeight:800,color:x.c,fontFamily:'monospace'}}>{x.v}</div></div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:4,background:S.card,border:`1px solid ${S.border}`,borderRadius:10,padding:4,width:'fit-content'}}>
        {([['faqs','❓ الأسئلة'],['categories','📂 الأقسام']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 18px',background:tab===k?S.bg:'transparent',border:'none',borderRadius:7,color:tab===k?S.text:S.muted,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:tab===k?600:400}}>{l}</button>
        ))}
      </div>

      {tab==='faqs' && (
        <>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <button onClick={()=>setCatFilter(0)} style={{padding:'6px 14px',background:catFilter===0?`rgba(14,165,233,0.12)`:'transparent',border:`1px solid ${catFilter===0?'rgba(14,165,233,0.3)':S.border}`,borderRadius:20,color:catFilter===0?S.gold:S.muted,fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>الكل</button>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{padding:'6px 14px',background:catFilter===c.id?`rgba(14,165,233,0.12)`:'transparent',border:`1px solid ${catFilter===c.id?'rgba(14,165,233,0.3)':S.border}`,borderRadius:20,color:catFilter===c.id?S.gold:S.muted,fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
                {c.name} <span style={{color:S.muted,fontFamily:'monospace',fontSize:'0.7rem'}}>({faqs.filter(f=>f.categoryId===c.id).length})</span>
              </button>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {loading ? (
              <div style={{padding:32,textAlign:'center',color:S.muted,fontSize:'0.82rem'}}>جاري التحميل...</div>
            ) : filtered.map(faq=>(
              <div key={faq.id} style={{background:S.card,border:`1px solid ${faq.visible?S.border:'rgba(203,213,225,0.6)'}`,borderRadius:12,overflow:'hidden',opacity:faq.visible?1:0.6}}>
                <div style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',userSelect:'none'}}
                  onClick={()=>setExpanded(expanded===faq.id?null:faq.id)}>
                  <div style={{width:28,height:28,borderRadius:8,background:`rgba(14,165,233,0.1)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',color:S.gold,fontWeight:800,flexShrink:0}}>
                    {faq.order}
                  </div>
                  <span style={{flex:1,fontSize:'0.85rem',fontWeight:600,color:S.text}}>{faq.question||'(بدون سؤال)'}</span>
                  <span style={{fontSize:'0.65rem',color:S.muted,background:'rgba(203,213,225,0.8)',padding:'2px 8px',borderRadius:20}}>
                    {cats.find(c=>c.id===faq.categoryId)?.name||'—'}
                  </span>
                  <div style={{display:'flex',gap:4,alignItems:'center'}}>
                    <button onClick={e=>{e.stopPropagation();setEditing({...faq});setIsNew(false)}} style={{width:26,height:26,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={11}/></button>
                    <button onClick={e=>{e.stopPropagation();toggleFAQ(faq.id)}} style={{width:26,height:26,background:`rgba(107,132,168,0.1)`,border:`1px solid rgba(107,132,168,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.muted}}>
                      <Toggle on={faq.visible} onChange={()=>{}}/>
                    </button>
                    <button onClick={e=>{e.stopPropagation();delFAQ(faq.id)}} style={{width:26,height:26,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={11}/></button>
                    <span style={{color:S.muted,marginRight:4}}>{expanded===faq.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</span>
                  </div>
                </div>
                {expanded===faq.id && (
                  <div style={{padding:'0 16px 14px',borderTop:`1px solid rgba(203,213,225,0.6)`}}>
                    <p style={{fontSize:'0.8rem',color:S.muted,lineHeight:1.8,margin:'12px 0 0'}}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab==='categories' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:16}}>
            <div style={{fontSize:'0.82rem',fontWeight:700,color:S.text,marginBottom:12}}>إضافة قسم جديد</div>
            <div style={{display:'flex',gap:8}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCat()}
                placeholder="اسم القسم..."
                style={{flex:1,padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}
                onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
              <button onClick={addCat} style={{padding:'9px 18px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>إضافة</button>
            </div>
          </div>

          {cats.map((c,i)=>(
            <div key={c.id} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:28,height:28,borderRadius:8,background:`rgba(14,165,233,0.1)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',color:S.gold,fontWeight:800}}>{i+1}</div>
              <span style={{fontSize:'0.85rem',fontWeight:600,color:S.text,flex:1}}>{c.name}</span>
              <span style={{fontSize:'0.72rem',color:S.muted}}>{faqs.filter(f=>f.categoryId===c.id).length} سؤال</span>
              <Toggle on={c.visible} onChange={v=>setCats(prev=>prev.map(x=>x.id===c.id?{...x,visible:v}:x))}/>
              <button onClick={()=>setCats(prev=>prev.filter(x=>x.id!==c.id))} style={{width:26,height:26,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={11}/></button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setEditing(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:580}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:S.text}}>{isNew?'سؤال جديد':'تعديل السؤال'}</span>
              <button onClick={()=>setEditing(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>القسم</div>
                <select value={editing.categoryId} onChange={e=>setEditing({...editing,categoryId:Number(e.target.value)})} style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>السؤال</div>
                <input value={editing.question} onChange={e=>setEditing({...editing,question:e.target.value})}
                  placeholder="اكتب السؤال هنا..."
                  style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.85rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none',fontWeight:600}}
                  onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
              </div>
              <div>
                <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>الإجابة</div>
                <textarea value={editing.answer} onChange={e=>setEditing({...editing,answer:e.target.value})} rows={4}
                  placeholder="اكتب الإجابة هنا..."
                  style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none',resize:'vertical'}}
                  onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderTop:`1px solid ${S.border}`}}>
                <span style={{fontSize:'0.82rem',color:S.text}}>إظهار السؤال في الموقع</span>
                <Toggle on={editing.visible} onChange={v=>setEditing({...editing,visible:v})}/>
              </div>
              <button onClick={()=>saveFAQ(editing)} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ السؤال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
