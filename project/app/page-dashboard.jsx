// Dashboard — KPIs, charts, activity, quick actions
const { useState: dUS, useMemo: dUM } = React;

function Spark({ data, color = 'var(--accent)', height = 36 }) {
  const w = 120, h = height, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const area = `M0,${h} L${pts.split(' ').map(p => p.replace(',', ' ')).join(' L')} L${w},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi,'')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace(/[^a-z]/gi,'')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Kpi({ label, value, delta, deltaUp, sparkData, color, icon: Ico }) {
  return (
    <div className="kpi">
      <div className="row gap-2 muted" style={{fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'.05em'}}>
        {Ico && <Ico size={13}/>} {label}
      </div>
      <div className="row" style={{justifyContent:'space-between', alignItems:'flex-end', marginTop:8}}>
        <div className="col gap-1">
          <div style={{fontSize:26, fontWeight:600, letterSpacing:'-0.02em'}}>{value}</div>
          <div className="row gap-1" style={{fontSize:11}}>
            <span style={{color: deltaUp ? '#4ADE80' : '#FB7185', display:'inline-flex', alignItems:'center', gap:2}}>
              {deltaUp ? <I.arrowUp size={11}/> : <I.arrowDn size={11}/>} {delta}
            </span>
            <span className="muted-2">vs last week</span>
          </div>
        </div>
        <Spark data={sparkData} color={color}/>
      </div>
    </div>
  );
}

function ChartCard({ title, children, subtitle, action }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="col gap-1 flex-1">
          <h3 className="card-title">{title}</h3>
          {subtitle && <div className="muted-2" style={{fontSize:11}}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function GrowthChart() {
  const w = 600, h = 220;
  const data = [820, 880, 940, 1020, 1180, 1100, 1240, 1350, 1290, 1420, 1580, 1640, 1720, 1860, 1920, 2080, 2200, 2310, 2280, 2440, 2580, 2710, 2820, 2950, 3080, 3220, 3340, 3490, 3620, 3780];
  const max = Math.max(...data), min = Math.min(...data) * 0.9;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const cw = w - padL - padR, ch = h - padT - padB;
  const pts = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * cw;
    const y = padT + ch - ((v - min) / (max - min)) * ch;
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');
  const area = `${line} L${pts[pts.length-1][0]},${padT+ch} L${pts[0][0]},${padT+ch} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      <defs>
        <linearGradient id="growth-g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6366F1" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#6366F1" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,1,2,3].map(i => {
        const y = padT + (ch / 3) * i;
        const v = Math.round(max - ((max - min) / 3) * i);
        return <g key={i}>
          <line x1={padL} y1={y} x2={w-padR} y2={y} stroke="var(--border)" strokeDasharray="2 4"/>
          <text x={padL-8} y={y+3} textAnchor="end" fill="var(--text-3)" fontSize="10">{v.toLocaleString()}</text>
        </g>;
      })}
      {['Apr 1','Apr 8','Apr 15','Apr 22','Apr 29'].map((t, i, a) => (
        <text key={t} x={padL + (i/(a.length-1))*cw} y={h-8} textAnchor="middle" fill="var(--text-3)" fontSize="10">{t}</text>
      ))}
      <path d={area} fill="url(#growth-g)"/>
      <path d={line} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.filter((_,i)=>i%5===0).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#818CF8" stroke="var(--surface)" strokeWidth="1.5"/>
      ))}
    </svg>
  );
}

function FunnelChart() {
  const stages = [
    { label: 'Contacts',     value: 12482, color: '#3B82F6' },
    { label: 'Engaged',      value: 4820,  color: '#6366F1' },
    { label: 'Qualified',    value: 1640,  color: '#A78BFA' },
    { label: 'Proposal',     value: 612,   color: '#EC4899' },
    { label: 'Won',          value: 184,   color: '#22C55E' },
  ];
  const max = stages[0].value;
  return (
    <div className="col gap-3">
      {stages.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i ? ((s.value / stages[i-1].value) * 100).toFixed(1) : null;
        return (
          <div key={s.label} className="col gap-1">
            <div className="row gap-2" style={{fontSize:12}}>
              <span style={{flex:1, fontWeight:500}}>{s.label}</span>
              <span className="muted-2">{conv && `${conv}% →`}</span>
              <span className="mono" style={{fontVariantNumeric:'tabular-nums'}}>{s.value.toLocaleString()}</span>
            </div>
            <div style={{height:10, background:'var(--surface-2)', borderRadius:4, overflow:'hidden'}}>
              <div style={{height:'100%', width:`${pct}%`, background:s.color, borderRadius:4}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChannelBars() {
  const days = Array.from({length:14}, (_,i) => ({
    d: i+1,
    email: 200 + Math.round(Math.sin(i*0.7)*60 + Math.random()*40 + 80),
    sms:   100 + Math.round(Math.cos(i*0.5)*30 + Math.random()*30 + 40),
    wa:    150 + Math.round(Math.sin(i*0.4+1)*40 + Math.random()*30 + 60),
  }));
  const max = Math.max(...days.map(d => d.email + d.sms + d.wa));
  return (
    <div className="col gap-3">
      <div className="row gap-3" style={{fontSize:11}}>
        <span className="row gap-1"><span className="dot" style={{background:'#6366F1', width:8, height:8, borderRadius:2}}/>Email</span>
        <span className="row gap-1"><span className="dot" style={{background:'#22C55E', width:8, height:8, borderRadius:2}}/>WhatsApp</span>
        <span className="row gap-1"><span className="dot" style={{background:'#F59E0B', width:8, height:8, borderRadius:2}}/>SMS</span>
      </div>
      <div className="row gap-1" style={{height:140, alignItems:'flex-end'}}>
        {days.map((d,i) => {
          const h = ((d.email + d.sms + d.wa) / max) * 130;
          const eh = (d.email/(d.email+d.sms+d.wa))*h;
          const wh = (d.wa/(d.email+d.sms+d.wa))*h;
          const sh = (d.sms/(d.email+d.sms+d.wa))*h;
          return (
            <div key={i} className="col" style={{flex:1, gap:1, alignItems:'stretch'}}>
              <div style={{height:`${sh}px`, background:'#F59E0B', borderRadius:'2px 2px 0 0'}}/>
              <div style={{height:`${wh}px`, background:'#22C55E'}}/>
              <div style={{height:`${eh}px`, background:'#6366F1', borderRadius:i===days.length-1?'0':'0'}}/>
            </div>
          );
        })}
      </div>
      <div className="row" style={{fontSize:10, color:'var(--text-3)', justifyContent:'space-between'}}>
        <span>Apr 16</span><span>Apr 22</span><span>Apr 29</span>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { t: 'now', user: 'Workflow', icon: 'flow', color: '#A78BFA', text: <>“Welcome series” triggered for <b>Sana Iqbal</b></>, meta: 'Step 2 of 5 · email' },
    { t: '4m', user: 'Aman D.', icon: 'pipeline', color: '#22C55E', text: <>Moved <b>Acme HVAC</b> to <b>Proposal Sent</b></>, meta: 'Deal · ₹4,80,000' },
    { t: '12m', user: 'Campaign', icon: 'campaign', color: '#6366F1', text: <>“April newsletter” sent to <b>4,210</b> contacts</>, meta: 'Open rate 38.2%' },
    { t: '24m', user: 'Form', icon: 'spark', color: '#F59E0B', text: <>New lead from <b>website-pricing</b></>, meta: 'Auto-tagged: hot-lead, mumbai' },
    { t: '47m', user: 'Riya A.', icon: 'contact', color: '#3B82F6', text: <>Imported <b>284 contacts</b> from CSV</>, meta: '12 duplicates merged' },
    { t: '1h', user: 'WhatsApp', icon: 'wa', color: '#22C55E', text: <>Template <b>order-confirmation-v3</b> approved by Meta</>, meta: 'Available in campaigns' },
  ];
  return (
    <div className="col" style={{gap:0}}>
      {items.map((it, i) => {
        const Ic = I[it.icon];
        return (
          <div key={i} className="row gap-3" style={{padding:'10px 0', borderBottom:i<items.length-1?'1px solid var(--border-soft)':'none'}}>
            <div style={{width:28, height:28, borderRadius:8, background:`color-mix(in srgb, ${it.color} 16%, transparent)`, color:it.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              <Ic size={14}/>
            </div>
            <div className="col flex-1" style={{gap:2}}>
              <div style={{fontSize:12.5, lineHeight:1.4}}>{it.text}</div>
              <div className="muted-2" style={{fontSize:11}}>{it.user} · {it.meta}</div>
            </div>
            <div className="muted-2" style={{fontSize:11}}>{it.t}</div>
          </div>
        );
      })}
    </div>
  );
}

function DashboardPage() {
  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Acme Marketing · Apr 1 – Apr 30"
        actions={<>
          <div className="row gap-1 segment">
            <button className="seg-btn">Today</button>
            <button className="seg-btn">7d</button>
            <button className="seg-btn active">30d</button>
            <button className="seg-btn">90d</button>
            <button className="seg-btn">Custom</button>
          </div>
          <button className="btn"><I.download size={14}/> Export</button>
          <button className="btn primary"><I.plus size={14}/> Quick action</button>
        </>}
      />
      <div className="page">
        <div className="kpi-grid">
          <Kpi label="Total contacts"   value="12,482" delta="+8.4%" deltaUp icon={I.contact}  color="#6366F1" sparkData={[12,14,13,16,18,22,21,24,28,30,33,36,42]}/>
          <Kpi label="Active leads"     value="₹38.2L" delta="+12.1%" deltaUp icon={I.pipeline} color="#22C55E" sparkData={[8,10,12,11,14,16,18,17,20,22,24,28,32]}/>
          <Kpi label="Campaigns sent"   value="187"    delta="+4.6%"  deltaUp icon={I.campaign} color="#A78BFA" sparkData={[2,4,5,8,7,10,12,11,14,16,15,18,20]}/>
          <Kpi label="Messages delivered" value="48,210" delta="+22.0%" deltaUp icon={I.send}    color="#3B82F6" sparkData={[20,18,24,26,30,28,34,38,40,44,48,52,58]}/>
          <Kpi label="Automation runs"  value="2,914"  delta="-1.2%"          icon={I.flow}     color="#EC4899" sparkData={[40,38,42,44,40,38,36,34,38,36,34,32,30]}/>
          <Kpi label="Open conversations" value="23"   delta="+3"     deltaUp icon={I.inbox}    color="#F59E0B" sparkData={[8,10,12,14,12,16,18,15,20,22,18,21,23]}/>
        </div>

        <div className="dash-grid" style={{marginTop:16}}>
          <ChartCard title="Contact growth" subtitle="New contacts per day · 30 days"
            action={<div className="row gap-2"><span className="pill green">+24.6%</span><button className="icon-btn"><I.more size={14}/></button></div>}>
            <GrowthChart/>
          </ChartCard>

          <ChartCard title="Lead funnel" subtitle="Apr 1 – Apr 30">
            <FunnelChart/>
          </ChartCard>

          <ChartCard title="Message volume" subtitle="By channel · last 14 days"
            action={<button className="btn sm ghost">All channels <I.chevD size={11}/></button>}>
            <ChannelBars/>
          </ChartCard>

          <ChartCard title="Recent activity" subtitle="Live feed across modules"
            action={<button className="btn sm ghost">View all</button>}>
            <ActivityFeed/>
          </ChartCard>

          <ChartCard title="Campaign performance" subtitle="Last 30 days · all channels">
            <table className="table compact">
              <thead><tr><th>Campaign</th><th>Channel</th><th>Sent</th><th>Open</th><th>Click</th><th>Reply</th></tr></thead>
              <tbody>
                <tr><td><b>Spring Promo 2026</b></td><td><span className="pill blue"><I.mail size={10}/> Email</span></td><td>4,210</td><td>38.2%</td><td>9.4%</td><td>2.1%</td></tr>
                <tr><td><b>Cart abandon · WA</b></td><td><span className="pill green"><I.wa size={10}/> WA</span></td><td>1,820</td><td>92.1%</td><td>—</td><td>14.2%</td></tr>
                <tr><td><b>OTP welcome SMS</b></td><td><span className="pill amber"><I.phone size={10}/> SMS</span></td><td>3,940</td><td>—</td><td>—</td><td>—</td></tr>
                <tr><td><b>Renewal reminder</b></td><td><span className="pill blue"><I.mail size={10}/> Email</span></td><td>612</td><td>54.0%</td><td>22.1%</td><td>8.4%</td></tr>
                <tr><td><b>Webinar invite</b></td><td><span className="pill blue"><I.mail size={10}/> Email</span></td><td>2,140</td><td>41.8%</td><td>11.0%</td><td>3.2%</td></tr>
              </tbody>
            </table>
          </ChartCard>

          <ChartCard title="Quick actions">
            <div className="quick-grid">
              <button className="quick-btn"><I.contact size={16}/><span>New contact</span></button>
              <button className="quick-btn"><I.pipeline size={16}/><span>New deal</span></button>
              <button className="quick-btn"><I.campaign size={16}/><span>Launch campaign</span></button>
              <button className="quick-btn"><I.flow size={16}/><span>Build workflow</span></button>
              <button className="quick-btn"><I.upload size={16}/><span>Import CSV</span></button>
              <button className="quick-btn"><I.bot size={16}/><span>Train chatbot</span></button>
            </div>
          </ChartCard>
        </div>
      </div>
    </>
  );
}
window.DashboardPage = DashboardPage;
