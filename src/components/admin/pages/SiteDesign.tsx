import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save, GripVertical, Eye } from 'lucide-react'
import { mockNavLinks, mockFooterData } from '../adminData'
import { getSettings, saveSettings } from '../../../lib/api'

const S = { bg:'#F1F5F9',card:'#FFFFFF',border:'#E2E8F0',gold:'#0EA5E9',text:'#1E293B',muted:'#64748B',green:'#059669',red:'#EF4444' }

type NavLink = typeof mockNavLinks[0]

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <div onClick={()=>onChange(!on)} style={{width:38,height:20,borderRadius:20,background:on?S.gold:'#E2E8F0',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?'auto':2,right:on?2:'auto',width:16,height:16,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
  </div>
}

function Field({label,value,onChange,type='text',rows=0,placeholder=''}:{label:string;value:string;onChange:(v:string)=>void;type?:string;rows?:number;placeholder?:string}) {
  const base:React.CSSProperties = {width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}
  return (
    <div>
      <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>{label}</div>
      {rows>0 ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...base,resize:'vertical'}} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
              : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>}
    </div>
  )
}

function SectionCard({title,children,action}:{title:string;children:React.ReactNode;action?:React.ReactNode}) {
  return (
    <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:20}}>
      <div style={{fontSize:'0.875rem',fontWeight:700,color:S.text,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span>{title}</span>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function SiteDesign() {
  const [tab, setTab] = useState<'nav'|'footer'|'floating'|'seo'>('nav')
  const [links, setLinks] = useState<NavLink[]>([...mockNavLinks])
  const [footer, setFooter] = useState({...mockFooterData})
  const [editLink, setEditLink] = useState<NavLink|null>(null)
  const [isNewLink, setIsNewLink] = useState(false)
  const [saved, setSaved] = useState(false)
  const [floatWhatsapp, setFloatWhatsapp] = useState(true)
  const [floatBackToTop, setFloatBackToTop] = useState(true)
  const [cookieBanner, setCookieBanner] = useState(true)
  const [cookieText, setCookieText] = useState(mockFooterData.cookieBannerText)

  useEffect(() => {
    getSettings().then(data => {
      const s = (data as {settings?: Record<string,string>}).settings || {}
      try { if (s.site_nav_links) setLinks(JSON.parse(s.site_nav_links)) } catch {}
      try { if (s.site_footer) setFooter(JSON.parse(s.site_footer)) } catch {}
      try { if (s.site_float_whatsapp !== undefined) setFloatWhatsapp(s.site_float_whatsapp === 'true') } catch {}
      try { if (s.site_float_backtotop !== undefined) setFloatBackToTop(s.site_float_backtotop === 'true') } catch {}
      try { if (s.site_cookie_banner !== undefined) setCookieBanner(s.site_cookie_banner === 'true') } catch {}
      try { if (s.site_cookie_text) setCookieText(s.site_cookie_text) } catch {}
    }).catch(() => {})
  }, [])

  const save = async () => {
    try {
      await saveSettings({
        site_nav_links: JSON.stringify(links),
        site_footer: JSON.stringify(footer),
        site_float_whatsapp: String(floatWhatsapp),
        site_float_backtotop: String(floatBackToTop),
        site_cookie_banner: String(cookieBanner),
        site_cookie_text: cookieText,
      })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('حدث خطأ أثناء الحفظ') }
  }

  const saveLink = (l:NavLink) => {
    if (isNewLink) setLinks(prev=>[...prev,l])
    else setLinks(prev=>prev.map(x=>x.id===l.id?l:x))
    setEditLink(null); setIsNewLink(false)
  }

  const delLink = (id:number) => setLinks(prev=>prev.filter(l=>l.id!==id))
  const toggleLink = (id:number) => setLinks(prev=>prev.map(l=>l.id===id?{...l,visible:!l.visible}:l))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:S.text,margin:0}}>تصميم الموقع والتنقل</h1>
          <p style={{fontSize:'0.78rem',color:S.muted,marginTop:3}}>القائمة الرئيسية • الفوتر • الأزرار العائمة</p>
        </div>
        <button onClick={()=>window.open('/','_blank')} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:8,color:'#0EA5E9',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Eye size={13}/> معاينة
          </button>
        <button onClick={save} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 18px',background:saved?`rgba(0,217,126,0.15)`:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:saved?`1px solid rgba(0,217,126,0.4)`:'none',borderRadius:8,color:saved?S.green:'#FFFFFF',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          {saved ? '✓ تم الحفظ' : <><Save size={13}/> حفظ</>}
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,background:S.card,border:`1px solid ${S.border}`,borderRadius:10,padding:4,width:'fit-content'}}>
        {([['nav','🧭 القائمة'],['footer','🦶 الفوتر'],['floating','⚡ عائمة'],['seo','🌐 SEO']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 18px',background:tab===k?S.bg:'transparent',border:'none',borderRadius:7,color:tab===k?S.text:S.muted,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight:tab===k?600:400}}>{l}</button>
        ))}
      </div>

      {tab==='nav' && (
        <SectionCard title="🧭 القائمة الرئيسية" action={
          <button onClick={()=>{setIsNewLink(true);setEditLink({id:Date.now(),label:'',url:'/',type:'internal',target:'_self',hasMega:false,visible:true,order:links.length+1})}}
            style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:7,color:S.gold,fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
            <Plus size={12}/> رابط جديد
          </button>
        }>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {links.map((l,i)=>(
              <div key={l.id} style={{display:'grid',gridTemplateColumns:'28px 1fr 160px 80px 60px 80px',gap:10,alignItems:'center',padding:'10px 12px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`,opacity:l.visible?1:0.5}}>
                <div style={{display:'flex',justifyContent:'center',cursor:'grab',color:S.muted}}><GripVertical size={14}/></div>
                <div>
                  <div style={{fontSize:'0.82rem',fontWeight:600,color:S.text}}>{l.label||'(بدون نص)'}</div>
                  <div style={{fontSize:'0.65rem',color:S.muted,fontFamily:'monospace'}}>{l.url}</div>
                </div>
                <div style={{display:'flex',gap:4}}>
                  {l.hasMega && <span style={{fontSize:'0.6rem',background:'rgba(59,130,246,0.1)',color:'#3B82F6',borderRadius:4,padding:'2px 6px'}}>Mega Menu</span>}
                  <span style={{fontSize:'0.6rem',background:'rgba(203,213,225,0.8)',color:S.muted,borderRadius:4,padding:'2px 6px'}}>{l.type}</span>
                </div>
                <div style={{display:'flex',gap:4}}>
                  <button onClick={()=>{setEditLink({...l});setIsNewLink(false)}} style={{width:26,height:26,background:`rgba(14,165,233,0.1)`,border:`1px solid rgba(14,165,233,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.gold}}><Edit size={10}/></button>
                  <button onClick={()=>delLink(l.id)} style={{width:26,height:26,background:`rgba(255,69,96,0.1)`,border:`1px solid rgba(255,69,96,0.2)`,borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:S.red}}><Trash2 size={10}/></button>
                </div>
                <Toggle on={l.visible} onChange={()=>toggleLink(l.id)}/>
                <span style={{fontSize:'0.62rem',color:l.visible?S.green:S.muted,textAlign:'center'}}>{i+1}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab==='footer' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <SectionCard title="🏢 معلومات الشركة">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="اسم الشركة (عربي)" value={footer.companyName} onChange={v=>setFooter({...footer,companyName:v})}/>
              <Field label="اسم الشركة (إنجليزي)" value={footer.companyNameEn} onChange={v=>setFooter({...footer,companyNameEn:v})}/>
              <div style={{gridColumn:'1/-1'}}><Field label="الوصف" value={footer.description} onChange={v=>setFooter({...footer,description:v})} rows={2}/></div>
              <Field label="شارة 1 (ترخيص)" value={footer.badge1} onChange={v=>setFooter({...footer,badge1:v})}/>
              <Field label="شارة 2 (معيار)" value={footer.badge2} onChange={v=>setFooter({...footer,badge2:v})}/>
            </div>
          </SectionCard>

          <SectionCard title="📞 معلومات التواصل">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="رقم الهاتف" value={footer.phone} onChange={v=>setFooter({...footer,phone:v})}/>
              <Field label="البريد الإلكتروني" value={footer.email} onChange={v=>setFooter({...footer,email:v})}/>
              <div style={{gridColumn:'1/-1'}}><Field label="العنوان" value={footer.address} onChange={v=>setFooter({...footer,address:v})}/></div>
              <div style={{gridColumn:'1/-1'}}><Field label="أوقات العمل" value={footer.workHours} onChange={v=>setFooter({...footer,workHours:v})} rows={2}/></div>
            </div>
          </SectionCard>

          <SectionCard title="📲 روابط التواصل الاجتماعي">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="LinkedIn" value={footer.linkedin} onChange={v=>setFooter({...footer,linkedin:v})} placeholder="https://linkedin.com/..."/>
              <Field label="Twitter / X" value={footer.twitter} onChange={v=>setFooter({...footer,twitter:v})} placeholder="https://twitter.com/..."/>
              <Field label="Instagram" value={footer.instagram} onChange={v=>setFooter({...footer,instagram:v})} placeholder="https://instagram.com/..."/>
              <Field label="YouTube" value={footer.youtube} onChange={v=>setFooter({...footer,youtube:v})} placeholder="https://youtube.com/..."/>
            </div>
          </SectionCard>

          <SectionCard title="📋 الروابط القانونية">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <Field label="سياسة الخصوصية" value={footer.privacyLink} onChange={v=>setFooter({...footer,privacyLink:v})}/>
              <Field label="الشروط والأحكام" value={footer.termsLink} onChange={v=>setFooter({...footer,termsLink:v})}/>
              <Field label="الإفصاحات" value={footer.disclosuresLink} onChange={v=>setFooter({...footer,disclosuresLink:v})}/>
              <div style={{gridColumn:'1/-1'}}><Field label="نص حقوق النشر" value={footer.copyright} onChange={v=>setFooter({...footer,copyright:v})}/></div>
            </div>
          </SectionCard>

          <SectionCard title="🎯 قسم الـ CTA">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><Field label="العنوان الرئيسي" value={footer.ctaTitle} onChange={v=>setFooter({...footer,ctaTitle:v})}/></div>
              <div style={{gridColumn:'1/-1'}}><Field label="الوصف" value={footer.ctaDesc} onChange={v=>setFooter({...footer,ctaDesc:v})} rows={2}/></div>
              <Field label="نص الزر الأول" value={footer.ctaBtn1} onChange={v=>setFooter({...footer,ctaBtn1:v})}/>
              <Field label="رابط الزر الأول" value={footer.ctaBtn1Link} onChange={v=>setFooter({...footer,ctaBtn1Link:v})}/>
              <Field label="نص الزر الثاني" value={footer.ctaBtn2} onChange={v=>setFooter({...footer,ctaBtn2:v})}/>
              <Field label="رابط الزر الثاني" value={footer.ctaBtn2Link} onChange={v=>setFooter({...footer,ctaBtn2Link:v})}/>
            </div>
          </SectionCard>

          <SectionCard title="📧 النشرة البريدية">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><Field label="عنوان النشرة" value={footer.newsletterTitle} onChange={v=>setFooter({...footer,newsletterTitle:v})}/></div>
            </div>
          </SectionCard>
        </div>
      )}

      {tab==='floating' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <SectionCard title="💬 زر واتساب العائم">
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:'1.5rem'}}>💬</span>
                  <div>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:S.text}}>تفعيل زر واتساب</div>
                    <div style={{fontSize:'0.68rem',color:S.muted}}>يظهر في الجهة السفلية من الصفحة</div>
                  </div>
                </div>
                <Toggle on={floatWhatsapp} onChange={setFloatWhatsapp}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Field label="رقم واتساب (بدون +)" value={footer.whatsapp} onChange={v=>setFooter({...footer,whatsapp:v})} placeholder="97141234567"/>
                <Field label="نص الزر" value={footer.whatsappText} onChange={v=>setFooter({...footer,whatsappText:v})}/>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="⬆️ زر العودة للأعلى">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:'1.5rem'}}>⬆️</span>
                <div>
                  <div style={{fontSize:'0.82rem',fontWeight:600,color:S.text}}>تفعيل زر العودة للأعلى</div>
                  <div style={{fontSize:'0.68rem',color:S.muted}}>يظهر عند التمرير لأسفل الصفحة</div>
                </div>
              </div>
              <Toggle on={floatBackToTop} onChange={setFloatBackToTop}/>
            </div>
          </SectionCard>

          <SectionCard title="🍪 بانر ملفات تعريف الارتباط">
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',background:S.bg,borderRadius:10,border:`1px solid ${S.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:'1.5rem'}}>🍪</span>
                  <div>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:S.text}}>تفعيل بانر الكوكيز</div>
                    <div style={{fontSize:'0.68rem',color:S.muted}}>يظهر للزوار الجدد في أسفل الصفحة</div>
                  </div>
                </div>
                <Toggle on={cookieBanner} onChange={setCookieBanner}/>
              </div>
              <Field label="نص البانر" value={cookieText} onChange={setCookieText} rows={2}/>
            </div>
          </SectionCard>
        </div>
      )}

      {tab==='seo' && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[
            {title:'🏠 الصفحة الرئيسية',fields:[{l:'العنوان (Title)',v:'Golden Horizon Investments | استثمر بثقة'},{l:'الوصف (Meta Description)',v:'شركة استثمار رائدة في الخليج...'},{l:'الكلمات المفتاحية',v:'استثمار، أسهم، ذهب، عملات رقمية'}]},
            {title:'📄 صفحة من نحن',fields:[{l:'العنوان',v:'من نحن | Golden Horizon'},{l:'الوصف',v:'تعرف على فريق Golden Horizon وقصة نجاحنا...'},{l:'الكلمات المفتاحية',v:'شركة استثمار، تاريخ، فريق'}]},
            {title:'🛠 صفحة الخدمات',fields:[{l:'العنوان',v:'خدماتنا | Golden Horizon'},{l:'الوصف',v:'اكتشف خدمات إدارة المحافظ الاستثمارية...'},{l:'الكلمات المفتاحية',v:'خدمات استثمار، محافظ، أسهم'}]},
          ].map((page,i)=>(
            <SectionCard key={i} title={page.title}>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {page.fields.map((f,j)=>(
                  <div key={j}>
                    <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:4}}>{f.l}</div>
                    <input defaultValue={f.v} style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}}
                      onFocus={e=>e.currentTarget.style.borderColor=S.gold} onBlur={e=>e.currentTarget.style.borderColor=S.border}/>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {/* Edit Link Modal */}
      {editLink && (
        <div style={{position:'fixed',inset:0,background:'rgba(100,116,139,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setEditLink(null)}>
          <div style={{background:'#FFFFFF',border:`1px solid ${S.border}`,borderRadius:16,width:'100%',maxWidth:500}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${S.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:S.text}}>{isNewLink?'رابط جديد':'تعديل الرابط'}</span>
              <button onClick={()=>setEditLink(null)} style={{background:'none',border:'none',cursor:'pointer',color:S.muted,display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Field label="النص" value={editLink.label} onChange={v=>setEditLink({...editLink,label:v})}/>
                <Field label="الرابط" value={editLink.url} onChange={v=>setEditLink({...editLink,url:v})}/>
                <div>
                  <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>النوع</div>
                  <select value={editLink.type} onChange={e=>setEditLink({...editLink,type:e.target.value})} style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                    <option value="internal">داخلي</option>
                    <option value="external">خارجي</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:'0.7rem',color:S.muted,fontWeight:600,marginBottom:5}}>الفتح في</div>
                  <select value={editLink.target} onChange={e=>setEditLink({...editLink,target:e.target.value})} style={{width:'100%',padding:'9px 12px',background:S.bg,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                    <option value="_self">نفس التبويب</option>
                    <option value="_blank">تبويب جديد</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',gap:16}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Toggle on={editLink.hasMega} onChange={v=>setEditLink({...editLink,hasMega:v})}/>
                  <span style={{fontSize:'0.78rem',color:S.text}}>Mega Menu</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Toggle on={editLink.visible} onChange={v=>setEditLink({...editLink,visible:v})}/>
                  <span style={{fontSize:'0.78rem',color:S.text}}>ظاهر</span>
                </div>
              </div>
              <button onClick={()=>saveLink(editLink)} style={{width:'100%',padding:'11px',background:`linear-gradient(135deg,${S.gold},#38BDF8)`,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                💾 حفظ الرابط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
