import { useState } from 'react'
import { Plus, Edit, Trash2, X, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { mockMarketAssets, mockTickerItems, mockMarketCategories } from '../adminData'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

type Asset = typeof mockMarketAssets[0]
type Ticker = typeof mockTickerItems[0]

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:36,height:19,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:15,height:15,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return (
    <div>
      <div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600,marginBottom:4}}>{label}</div>
      <input value={value} onChange={e=>onChange(e.target.value)} style={{width:'100%',padding:'8px 10px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}}
        onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
    </div>
  )
}

export default function MarketsManager() {
  const [tab, setTab] = useState<'assets'|'ticker'|'categories'>('assets')
  const [assets, setAssets] = useState<Asset[]>([...mockMarketAssets])
  const [tickers, setTickers] = useState<Ticker[]>([...mockTickerItems])
  const [categories, setCategories] = useState([...mockMarketCategories])
  const [catFilter, setCatFilter] = useState('الكل')
  const [editing, setEditing] = useState<Asset|null>(null)
  const [editTicker, setEditTicker] = useState<Ticker|null>(null)
  const [saved, setSaved] = useState(false)

  const cats = ['الكل', ...categories.map(c=>c.name)]
  const filtered = catFilter==='الكل' ? assets : assets.filter(a=>a.category===catFilter)

  const saveAsset = (a:Asset) => {
    setAssets(prev => editing && assets.find(x=>x.id===editing.id) ? prev.map(x=>x.id===a.id?a:x) : [...prev,a])
    setEditing(null); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const saveTicker = (t:Ticker) => {
    setTickers(prev=>prev.map(x=>x.id===t.id?t:x))
    setEditTicker(null)
  }

  const toggleAsset = (id:number) => setAssets(prev=>prev.map(a=>a.id===id?{...a,visible:!a.visible}:a))
  const delAsset = (id:number) => setAssets(prev=>prev.filter(a=>a.id!==id))
  const toggleTicker = (id:number) => setTickers(prev=>prev.map(t=>t.id===id?{...t,visible:!t.visible}:t))
  const delTicker = (id:number) => setTickers(prev=>prev.filter(t=>t.id!==id))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>إدارة الأسواق</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>الأصول المالية • الشريط المتحرك • الفئات</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saved && <span style={{fontSize:'0.75rem',color:S.green}}>✓ تم الحفظ</span>}
          <button onClick={()=>window.open('/markets','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
          {tab==='assets' && (
            <button onClick={()=>setEditing({id:Date.now(),category:categories[0]?.name||'الأسهم',name:'',symbol:'',price:'',change:0,volume:'',marketCap:'',visible:true,order:assets.length+1})}
              style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
              <Plus size={14}/> أصل جديد
            </button>
          )}
          {tab==='ticker' && (
            <button onClick={()=>setTickers([...tickers,{id:Date.now(),symbol:'NEW',price:'0',change:0,dir:'up',visible:true,order:tickers.length+1}])}
              style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
              <Plus size={14}/> إضافة للشريط
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,background:S.card,border:`1px solid ${S.border}`,borderRadius:10,padding:4,width:'fit-content'}}>
        {([['assets','📊 الأصول'],['ticker','📡 الشريط المتحرك'],['categories','🏷️ الفئات']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 18px',background:tab===k?S.bg:'transparent',border:'none',borderRadius:7,color:tab===k?S.text:S.muted,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:tab===k?600:400}}>{l}</button>
        ))}
      </div>

      {tab==='assets' && (
        <>
          {/* Cat filter */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCatFilter(c)} style={{padding:'6px 14px',background:catFilter===c?`rgba(14,165,233,0.12)`:'transparent',border:`1px solid ${catFilter===c?'rgba(14,165,233,0.3)':S.border}`,borderRadius:20,color:catFilter===c?S.gold:S.muted,fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{c}</button>
            ))}
          </div>

          <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
                <thead>
                  <tr>{['الأصل','الرمز','السعر','التغيير','الحجم','الفئة','الظهور','إجراءات'].map(h=>(
                    <th key={h} style={{padding:'10px 14px',textAlign:'right',fontSize:'0.68rem',fontWeight:600,color:S.muted,borderBottom:`1px solid ${S.border}`,background:S.bg,whiteSpace:'nowrap'}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(a=>(
                    <tr key={a.id} style={{opacity:a.visible?1:0.5}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.02)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'10px 14px',fontSize:'0.8rem',fontWeight:600,color:S.text,borderBottom:`1px solid rgba(203,213,225,0.6)`}}>{a.name}</td>
                      <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                        <span style={{background:'rgba(59,130,246,0.1)',color:'#3B82F6',borderRadius:6,padding:'2px 8px',fontSize:'0.68rem',fontFamily:'monospace',fontWeight:700}}>{a.symbol}</span>
                      </td>
                      <td style={{padding:'10px 14px',fontSize:'0.78rem',fontFamily:'monospace',color:S.text,borderBottom:`1px solid rgba(203,213,225,0.6)`}}>{a.price}</td>
                      <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.78rem',fontWeight:700,color:a.change>=0?S.green:S.red}}>
                          {a.change>=0?<TrendingUp size={12}/>:<TrendingDown size={12}/>}
                          {a.change>=0?'+':''}{a.change}%
                        </span>
                      </td>
                      <td style={{padding:'10px 14px',fontSize:'0.72rem',color:S.muted,borderBottom:`1px solid rgba(203,213,225,0.6)`,fontFamily:'monospace'}}>{a.volume}</td>
                      <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                        <span style={{background:'rgba(203,213,225,0.8)',color:S.muted,borderRadius:5,padding:'2px 8px',fontSize:'0.65rem'}}>{a.category}</span>
                      </td>
                      <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                        <Toggle on={a.visible} onChange={()=>toggleAsset(a.id)}/>
                      </td>
                      <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                        <div style={{display:'flex',gap:4}}>
                          <button onClick={()=>setEditing({...a})} style={{width:28,height:28,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={11}/></button>
                          <button onClick={()=>delAsset(a.id)} style={{width:28,height:28,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={11}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab==='ticker' && (
        <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'0.82rem',fontWeight:700,color:S.text}}>📡 الشريط المتحرك — {tickers.filter(t=>t.visible).length} ظاهر</span>
            <span style={{fontSize:'0.72rem',color:S.muted}}>يُحدّث تلقائياً كل 30 ثانية</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
              <thead>
                <tr>{['الرمز','السعر','التغيير %','الاتجاه','الظهور','إجراءات'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'right',fontSize:'0.68rem',fontWeight:600,color:S.muted,borderBottom:`1px solid ${S.border}`,background:S.bg}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {tickers.map(t=>(
                  <tr key={t.id} style={{opacity:t.visible?1:0.5}}>
                    {editTicker?.id===t.id ? (
                      <>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <input value={editTicker.symbol} onChange={e=>setEditTicker({...editTicker,symbol:e.target.value})} style={{padding:'6px 10px',background:S.bg,border:`1px solid ${S.gold}`,borderRadius:6,color:S.text,fontSize:'0.78rem',fontFamily:'monospace',outline:'none',width:120}}/>
                        </td>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <input value={editTicker.price} onChange={e=>setEditTicker({...editTicker,price:e.target.value})} style={{padding:'6px 10px',background:S.bg,border:`1px solid ${S.gold}`,borderRadius:6,color:S.text,fontSize:'0.78rem',fontFamily:'monospace',outline:'none',width:100}}/>
                        </td>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <input type="number" value={editTicker.change} onChange={e=>setEditTicker({...editTicker,change:parseFloat(e.target.value)||0})} style={{padding:'6px 10px',background:S.bg,border:`1px solid ${S.gold}`,borderRadius:6,color:S.text,fontSize:'0.78rem',outline:'none',width:80}}/>
                        </td>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <select value={editTicker.dir} onChange={e=>setEditTicker({...editTicker,dir:e.target.value as 'up'|'down'})} style={{padding:'6px 10px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,fontSize:'0.78rem',outline:'none'}}>
                            <option value="up">▲ صاعد</option><option value="down">▼ هابط</option>
                          </select>
                        </td>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}><Toggle on={editTicker.visible} onChange={v=>setEditTicker({...editTicker,visible:v})}/></td>
                        <td style={{padding:'8px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <div style={{display:'flex',gap:4}}>
                            <button onClick={()=>saveTicker(editTicker)} style={{padding:'5px 10px',background:`rgba(0,217,126,0.1)`,border:`1px solid rgba(0,217,126,0.3)`,borderRadius:6,color:S.green,fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>حفظ</button>
                            <button onClick={()=>setEditTicker(null)} style={{width:26,background:'transparent',border:`1px solid ${S.border}`,borderRadius:6,cursor:'pointer',color:S.muted,display:'flex',alignItems:'center',justifyContent:'center'}}><X size={10}/></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{padding:'10px 14px',fontSize:'0.82rem',fontWeight:700,color:S.text,borderBottom:`1px solid rgba(203,213,225,0.6)`,fontFamily:'monospace'}}>{t.symbol}</td>
                        <td style={{padding:'10px 14px',fontSize:'0.78rem',color:S.muted,borderBottom:`1px solid rgba(203,213,225,0.6)`,fontFamily:'monospace'}}>{t.price}</td>
                        <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <span style={{color:t.dir==='up'?S.green:S.red,fontWeight:700,fontSize:'0.78rem',fontFamily:'monospace'}}>{t.dir==='up'?'+':''}{t.change}%</span>
                        </td>
                        <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <span style={{fontSize:'0.75rem',color:t.dir==='up'?S.green:S.red}}>{t.dir==='up'?'▲ صاعد':'▼ هابط'}</span>
                        </td>
                        <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}><Toggle on={t.visible} onChange={()=>toggleTicker(t.id)}/></td>
                        <td style={{padding:'10px 14px',borderBottom:`1px solid rgba(203,213,225,0.6)`}}>
                          <div style={{display:'flex',gap:4}}>
                            <button onClick={()=>setEditTicker({...t})} style={{width:28,height:28,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={11}/></button>
                            <button onClick={()=>delTicker(t.id)} style={{width:28,height:28,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={11}/></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='categories' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {categories.map((c,i)=>(
            <div key={c.id} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:'0.82rem',fontWeight:700,color:S.text,flex:1}}>{c.name}</span>
              <span style={{fontSize:'0.72rem',color:S.muted}}>{assets.filter(a=>a.category===c.name).length} أصل</span>
              <Toggle on={c.visible} onChange={v=>setCategories(prev=>prev.map(x=>x.id===c.id?{...x,visible:v}:x))}/>
              <span style={{fontSize:'0.65rem',color:c.visible?S.green:S.muted}}>{c.visible?'ظاهر':'مخفي'}</span>
            </div>
          ))}
          <button onClick={()=>setCategories([...categories,{id:Date.now(),name:'فئة جديدة',visible:true,order:categories.length+1}])}
            style={{padding:'10px',background:`rgba(14,165,233,0.06)`,border:`1px dashed rgba(14,165,233,0.3)`,borderRadius:10,color:S.gold,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            + إضافة فئة
          </button>
        </div>
      )}

      {/* Asset Edit Modal */}
      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setEditing(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:560}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:S.text}}>تعديل الأصل المالي</span>
              <button onClick={()=>setEditing(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Field label="اسم الأصل" value={editing.name} onChange={v=>setEditing({...editing,name:v})}/>
                <Field label="الرمز (Symbol)" value={editing.symbol} onChange={v=>setEditing({...editing,symbol:v})}/>
                <Field label="السعر" value={editing.price} onChange={v=>setEditing({...editing,price:v})}/>
                <div>
                  <div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600,marginBottom:4}}>التغيير %</div>
                  <input type="number" step="0.1" value={editing.change} onChange={e=>setEditing({...editing,change:parseFloat(e.target.value)||0})} style={{width:'100%',padding:'8px 10px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.78rem',outline:'none',boxSizing:'border-box'}}/>
                </div>
                <Field label="حجم التداول" value={editing.volume} onChange={v=>setEditing({...editing,volume:v})}/>
                <Field label="القيمة السوقية" value={editing.marketCap} onChange={v=>setEditing({...editing,marketCap:v})}/>
                <div>
                  <div style={{fontSize:'0.68rem',color:S.muted,fontWeight:600,marginBottom:4}}>الفئة</div>
                  <select value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})} style={{width:'100%',padding:'8px 10px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:7,color:S.text,fontSize:'0.78rem',outline:'none',fontFamily:"'Cairo',sans-serif"}}>
                    {categories.map(c=><option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0'}}>
                  <span style={{fontSize:'0.78rem',color:S.text}}>إظهار</span>
                  <Toggle on={editing.visible} onChange={v=>setEditing({...editing,visible:v})}/>
                </div>
              </div>
              <button onClick={()=>saveAsset(editing)} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
