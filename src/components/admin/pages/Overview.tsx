import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { chartAUM, chartPortfolioAlloc, chartRevenue, mockClients, mockTransactions, mockNotifications } from '../adminData'

const C = { card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14 } as React.CSSProperties }

const kpis = [
  { label:'إجمالي العملاء', value:'5,234', change:'+12 هذا الشهر', icon:'👥', color:'#3B82F6', positive:true },
  { label:'الأصول المُدارة', value:'$2.4B', change:'▲ +3.2%', icon:'💰', color:'#0EA5E9', positive:true },
  { label:'متوسط العائد', value:'+18.3%', change:'هذا الشهر', icon:'📈', color:'#00D97E', positive:true },
  { label:'إيرادات اليوم', value:'$142K', change:'▲ +8.4%', icon:'💸', color:'#00D97E', positive:true },
  { label:'رسائل معلقة', value:'24', change:'تحتاج ردًا', icon:'💬', color:'#F59E0B', positive:false },
  { label:'طلبات جديدة', value:'8', change:'تنتظر موافقة', icon:'📋', color:'#FF4560', positive:false },
  { label:'صفقات اليوم', value:'34', change:'$4.2M حجم', icon:'⚡', color:'#0EA5E9', positive:true },
  { label:'حالة النظام', value:'✅ طبيعي', change:'آخر فحص: الآن', icon:'🛡️', color:'#00D97E', positive:true },
]

const alerts = [
  { color:'#FF4560', bg:'rgba(255,69,96,0.08)', icon:'🔴', text:'3 طلبات تسجيل جديدة معلقة', action:'مراجعة' },
  { color:'#F59E0B', bg:'rgba(245,158,11,0.08)', icon:'🟡', text:'تقرير منتهي الصلاحية — سارة العمري', action:'تجديد' },
  { color:'#3B82F6', bg:'rgba(59,130,246,0.08)', icon:'🔵', text:'رسالة لم تُقرأ منذ 24 ساعة من خالد', action:'رد' },
]

const quickActions = [
  { icon:'➕', label:'إضافة عميل', color:'#3B82F6' },
  { icon:'💸', label:'صفقة جديدة', color:'#0EA5E9' },
  { icon:'📊', label:'إنشاء تقرير', color:'#00D97E' },
  { icon:'📰', label:'نشر خبر', color:'#F59E0B' },
  { icon:'👤', label:'إضافة مشرف', color:'#8B5CF6' },
  { icon:'📧', label:'إرسال بريد', color:'#EC4899' },
]

const activity = [
  { icon:'👤', text:'تسجيل عميل جديد — محمد السالم', time:'10:45 ص', type:'new' },
  { icon:'💸', text:'صفقة شراء أرامكو — محمد الأحمد ($12,400)', time:'10:32 ص', type:'tx' },
  { icon:'💬', text:'رسالة جديدة من خالد التميمي', time:'10:15 ص', type:'msg' },
  { icon:'📊', text:'تقرير شهري أُرسل لـ 45 عميل', time:'09:50 ص', type:'report' },
  { icon:'🔐', text:'تسجيل دخول — خالد محمد من الرياض', time:'09:30 ص', type:'auth' },
  { icon:'✅', text:'موافقة على طلب سارة الزهراني', time:'09:10 ص', type:'approve' },
  { icon:'📈', text:'ارتفاع محفظة عبدالله السالم +2.3%', time:'08:55 ص', type:'perf' },
]

const marketTickers = [
  { name:'أرامكو', value:'124.40', change:'+2.1%', pos:true },
  { name:'BTC', value:'$67,240', change:'+3.4%', pos:true },
  { name:'ذهب', value:'$2,340', change:'+0.9%', pos:true },
  { name:'Apple', value:'$189.5', change:'-1.2%', pos:false },
  { name:'نفط', value:'$87.3', change:'-0.4%', pos:false },
  { name:'EUR/USD', value:'1.0842', change:'+0.2%', pos:true },
]

const tasks = [
  { priority:'عالي', color:'#FF4560', title:'مراجعة طلبات الانضمام', count:3, due:'اليوم' },
  { priority:'متوسط', color:'#F59E0B', title:'إرسال التقارير الشهرية', count:45, due:'الجمعة' },
  { priority:'منخفض', color:'#00D97E', title:'تحديث صفحة الخدمات', count:1, due:'الأسبوع القادم' },
]

export default function Overview() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#1E293B', margin:0 }}>{greeting}، أحمد 👋</h1>
          <p style={{ fontSize:'0.82rem', color:'#64748B', marginTop:4 }}>
            {now.toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            &nbsp;·&nbsp;🟢 جميع الأنظمة تعمل بشكل طبيعي
          </p>
        </div>
        <div style={{ display:'flex', gap:8, fontSize:'0.78rem' }}>
          <button style={{ padding:'8px 14px', background:'transparent', border:'1px solid #E2E8F0', borderRadius:8, color:'#64748B', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📅 هذا الشهر</button>
          <button style={{ padding:'8px 14px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, color:'#FFFFFF', fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📥 تصدير</button>
        </div>
      </div>

      {/* Market Ticker */}
      <div style={{ ...C.card, padding:'10px 16px', display:'flex', gap:24, overflowX:'auto' }}>
        <span style={{ fontSize:'0.7rem', color:'#64748B', flexShrink:0, alignSelf:'center' }}>الأسواق:</span>
        {marketTickers.map((t,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontSize:'0.78rem', color:'#1E293B', fontWeight:600 }}>{t.name}</span>
            <span style={{ fontSize:'0.78rem', color:'#1E293B', fontFamily:'monospace' }}>{t.value}</span>
            <span style={{ fontSize:'0.7rem', color: t.pos ? '#00D97E' : '#FF4560', fontWeight:600 }}>{t.change}</span>
          </div>
        ))}
      </div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {kpis.map((k,i) => (
          <div key={i} style={{ ...C.card, padding:20, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.72rem', color:'#64748B', fontWeight:600 }}>{k.label}</span>
              <span style={{ fontSize:'1.2rem' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'1.6rem', fontWeight:800, color:k.color, fontFamily:'monospace', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:'0.7rem', color: k.positive ? '#00D97E' : '#F59E0B' }}>{k.change}</div>
            <div style={{ height:3, background:'#CBD5E1', borderRadius:2 }}>
              <div style={{ height:'100%', width:`${40+i*7}%`, background:k.color, borderRadius:2, opacity:0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        {/* AUM Chart */}
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>الأصول المُدارة (AUM)</div>
              <div style={{ fontSize:'0.72rem', color:'#64748B', marginTop:2 }}>بالمليون دولار — آخر 12 شهراً</div>
            </div>
            <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#0EA5E9', fontFamily:'monospace' }}>$2.4B <span style={{ fontSize:'0.7rem', color:'#00D97E' }}>▲3.2%</span></div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartAUM}>
              <defs>
                <linearGradient id="aum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.78rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.6)" strokeDasharray="3 3"/>
              <Area type="monotone" dataKey="aum" stroke="#C9A84C" strokeWidth={2} fill="url(#aum)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Allocation */}
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', marginBottom:12 }}>توزيع المحافظ</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={chartPortfolioAlloc} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                {chartPortfolioAlloc.map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
            {chartPortfolioAlloc.map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:d.color }} />
                  <span style={{ fontSize:'0.72rem', color:'#1E293B' }}>{d.name}</span>
                </div>
                <span style={{ fontSize:'0.72rem', color:'#64748B', fontFamily:'monospace' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue + Activity + Tasks */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 0.8fr', gap:20 }}>
        {/* Revenue */}
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>الإيرادات والأرباح</div>
            <span style={{ fontSize:'0.7rem', color:'#64748B' }}>بالألف دولار</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartRevenue.slice(-6)}>
              <XAxis dataKey="month" tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.5)" strokeDasharray="3 3"/>
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4,4,0,0]} name="إيرادات"/>
              <Bar dataKey="profit" fill="#C9A84C" radius={[4,4,0,0]} name="أرباح"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', marginBottom:14 }}>آخر النشاطات</div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {activity.map((a,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i<activity.length-1 ? '1px solid rgba(203,213,225,0.6)' : 'none' }}>
                <span style={{ fontSize:'0.9rem', flexShrink:0 }}>{a.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.72rem', color:'#1E293B', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.text}</div>
                  <div style={{ fontSize:'0.65rem', color:'#94A3B8', marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks + Quick Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Alerts */}
          <div style={{ ...C.card, padding:16 }}>
            <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', marginBottom:10 }}>تنبيهات عاجلة</div>
            {alerts.map((a,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', background:a.bg, border:`1px solid ${a.color}22`, borderRadius:8, marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, minWidth:0 }}>
                  <span>{a.icon}</span>
                  <span style={{ fontSize:'0.68rem', color:'#1E293B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.text}</span>
                </div>
                <button style={{ fontSize:'0.62rem', color:a.color, background:'none', border:`1px solid ${a.color}44`, borderRadius:5, padding:'3px 7px', cursor:'pointer', fontFamily:"'Cairo',sans-serif", flexShrink:0, marginRight:6 }}>{a.action}</button>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ ...C.card, padding:16 }}>
            <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', marginBottom:10 }}>إجراءات سريعة</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {quickActions.map((q,i) => (
                <button key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 4px', background:`${q.color}11`, border:`1px solid ${q.color}33`, borderRadius:8, cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${q.color}22`}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`${q.color}11`}}>
                  <span style={{ fontSize:'1.2rem' }}>{q.icon}</span>
                  <span style={{ fontSize:'0.6rem', color:'#1E293B', textAlign:'center', lineHeight:1.2 }}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ ...C.card, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>آخر الصفقات</div>
          <span style={{ fontSize:'0.72rem', color:'#0EA5E9', cursor:'pointer' }}>عرض الكل ←</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
            <thead>
              <tr>
                {['#','النوع','العميل','الأصل','الكمية','السعر','الإجمالي','الحالة','التاريخ'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'right', fontSize:'0.7rem', fontWeight:600, color:'#64748B', borderBottom:'1px solid #E2E8F0', background:'#F1F5F9', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.slice(0,5).map(tx => (
                <tr key={tx.id} style={{ transition:'background 0.1s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'10px 16px', fontSize:'0.75rem', color:'#94A3B8', fontFamily:'monospace', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>#{tx.id}</td>
                  <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>
                    <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.68rem', fontWeight:700, background: tx.type==='buy'?'rgba(0,217,126,0.1)':tx.type==='sell'?'rgba(255,69,96,0.1)':'rgba(59,130,246,0.1)', color: tx.type==='buy'?'#00D97E':tx.type==='sell'?'#FF4560':'#3B82F6' }}>
                      {tx.type==='buy'?'شراء':tx.type==='sell'?'بيع':'تحويل'}
                    </span>
                  </td>
                  <td style={{ padding:'10px 16px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>{tx.client}</td>
                  <td style={{ padding:'10px 16px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', fontWeight:600 }}>{tx.asset}</td>
                  <td style={{ padding:'10px 16px', fontSize:'0.78rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', fontFamily:'monospace' }}>{tx.qty}</td>
                  <td style={{ padding:'10px 16px', fontSize:'0.78rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', fontFamily:'monospace' }}>${tx.price.toLocaleString()}</td>
                  <td style={{ padding:'10px 16px', fontSize:'0.8rem', color:'#0EA5E9', borderBottom:'1px solid rgba(203,213,225,0.6)', fontFamily:'monospace', fontWeight:700 }}>${tx.total.toLocaleString()}</td>
                  <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>
                    <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.68rem', fontWeight:600, background: tx.status==='completed'?'rgba(0,217,126,0.1)':'rgba(245,158,11,0.1)', color: tx.status==='completed'?'#00D97E':'#F59E0B' }}>
                      {tx.status==='completed'?'مكتمل':'معلق'}
                    </span>
                  </td>
                  <td style={{ padding:'10px 16px', fontSize:'0.7rem', color:'#64748B', borderBottom:'1px solid rgba(203,213,225,0.6)', whiteSpace:'nowrap' }}>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
