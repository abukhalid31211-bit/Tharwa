import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { chartRevenue, chartNewClients, chartPortfolioAlloc, chartAUM } from '../adminData'

const C = { card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 } as React.CSSProperties }

const topPerformers = [
  {rank:'🥇',name:'محمد الأحمد',ret:24.3,assets:125000,pct:97},
  {rank:'🥈',name:'عبدالله السالم',ret:21.7,assets:312000,pct:87},
  {rank:'🥉',name:'طارق القحطاني',ret:19.2,assets:234000,pct:77},
  {rank:'4',name:'سارة العمري',ret:18.4,assets:87200,pct:74},
  {rank:'5',name:'فاطمة الزهراني',ret:16.9,assets:43200,pct:68},
]

const advisorPerf = [
  {name:'أحمد العمري',aum:450,clients:124},
  {name:'خالد محمد',aum:380,clients:87},
  {name:'سارة الزهراني',aum:290,clients:54},
]

const kpis = [
  {label:'العائد الإجمالي YTD',value:'+18.3%',change:'▲ vs 15.2% العام الماضي',color:'#00D97E'},
  {label:'إيرادات الشهر',value:'$94K',change:'▲ +8.4% vs الشهر الماضي',color:'#0EA5E9'},
  {label:'عملاء جدد الشهر',value:'67',change:'▲ +22% vs الشهر الماضي',color:'#3B82F6'},
  {label:'صافي الأصول الجديدة',value:'$12.4M',change:'▲ +5.1%',color:'#8B5CF6'},
]

export default function Reports() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1E293B',margin:0}}>التقارير والإحصائيات</h1>
          <p style={{fontSize:'0.78rem',color:'#64748B',marginTop:3}}>نظرة شاملة على الأداء</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <div style={{display:'flex',gap:2,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,padding:3}}>
            {['أسبوع','شهر','ربع','سنة'].map(p=>(
              <button key={p} style={{padding:'5px 10px',background: p==='شهر' ? '#F1F5F9' : 'transparent',border:'none',borderRadius:6,color: p==='شهر' ? '#1E293B' : '#64748B',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{p}</button>
            ))}
          </div>
          <button style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'linear-gradient(135deg,#0EA5E9,#38BDF8)',border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📥 تصدير PDF</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:16}}>
            <div style={{fontSize:'0.68rem',color:'#64748B',fontWeight:600,marginBottom:8}}>{k.label}</div>
            <div style={{fontSize:'1.6rem',fontWeight:800,color:k.color,fontFamily:'monospace',lineHeight:1,marginBottom:6}}>{k.value}</div>
            <div style={{fontSize:'0.65rem',color:'#00D97E'}}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
        <div style={C.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B'}}>الإيرادات والأرباح</div>
            <span style={{fontSize:'0.7rem',color:'#64748B'}}>بالألف دولار</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartRevenue}>
              <XAxis dataKey="month" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.5)" strokeDasharray="3 3"/>
              <Bar dataKey="revenue" fill="#3B82F6" radius={[3,3,0,0]} name="إيرادات"/>
              <Bar dataKey="profit" fill="#C9A84C" radius={[3,3,0,0]} name="أرباح"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={C.card}>
          <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>توزيع المحافظ</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={chartPortfolioAlloc} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                {chartPortfolioAlloc.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:8}}>
            {chartPortfolioAlloc.map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:7,height:7,borderRadius:'50%',background:d.color}}/><span style={{fontSize:'0.7rem',color:'#1E293B'}}>{d.name}</span></div>
                <span style={{fontSize:'0.7rem',color:'#64748B',fontFamily:'monospace'}}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div style={C.card}>
          <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>نمو AUM</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartAUM}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="month" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.5)" strokeDasharray="3 3"/>
              <Area type="monotone" dataKey="aum" stroke="#C9A84C" strokeWidth={2} fill="url(#g)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={C.card}>
          <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>عملاء جدد</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartNewClients}>
              <XAxis dataKey="month" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.5)" strokeDasharray="3 3"/>
              <Bar dataKey="clients" fill="#3B82F6" radius={[3,3,0,0]} name="عملاء جدد"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers + Advisors */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:16}}>
        <div style={C.card}>
          <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>أفضل العملاء أداءً</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {topPerformers.map((p,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',background:'#F1F5F9',borderRadius:8}}>
                <span style={{fontSize:'1rem',flexShrink:0,width:24,textAlign:'center'}}>{p.rank}</span>
                <span style={{fontSize:'0.82rem',fontWeight:600,color:'#1E293B',flex:1}}>{p.name}</span>
                <span style={{fontSize:'0.75rem',color:'#64748B',fontFamily:'monospace'}}>AUM: ${p.assets.toLocaleString()}</span>
                <span style={{fontSize:'0.82rem',fontWeight:700,color:'#00D97E',fontFamily:'monospace'}}>+{p.ret}%</span>
                <div style={{width:80,height:5,background:'#CBD5E1',borderRadius:3}}>
                  <div style={{height:'100%',width:`${p.pct}%`,background:'#00D97E',borderRadius:3}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={C.card}>
          <div style={{fontSize:'0.875rem',fontWeight:700,color:'#1E293B',marginBottom:14}}>أداء المستشارين</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {advisorPerf.map((a,i)=>(
              <div key={i} style={{padding:'12px 14px',background:'#F1F5F9',borderRadius:8}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{fontSize:'0.82rem',fontWeight:600,color:'#1E293B'}}>{a.name}</span>
                  <span style={{fontSize:'0.75rem',color:'#0EA5E9',fontFamily:'monospace'}}>AUM: ${a.aum}M</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'#64748B',marginBottom:6}}>
                  <span>{a.clients} عميل</span>
                  <span>{Math.round(a.aum/a.clients*10)/10}M لكل عميل</span>
                </div>
                <div style={{height:4,background:'#CBD5E1',borderRadius:2}}>
                  <div style={{height:'100%',width:`${(a.aum/450)*100}%`,background:'linear-gradient(90deg,#C9A84C,#E8C96A)',borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
