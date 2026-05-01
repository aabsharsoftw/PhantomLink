// Campaigns — list of campaigns with stats
function CampaignsPage() {
  const camps = [
    { name:'Spring Promo 2026',    ch:'mail', status:'sent',     sent:4210, open:38.2, click:9.4, owner:'RA', date:'Apr 24', perf:'good' },
    { name:'Cart abandon · WA',    ch:'wa',   status:'running',  sent:1820, open:92.1, click:14.2, owner:'AD', date:'Apr 22', perf:'great' },
    { name:'OTP welcome SMS',      ch:'sms',  status:'running',  sent:3940, open:0,    click:0,    owner:'NK', date:'Apr 21', perf:'na' },
    { name:'Renewal reminder',     ch:'mail', status:'sent',     sent:612,  open:54.0, click:22.1, owner:'RA', date:'Apr 18', perf:'great' },
    { name:'Webinar invite',       ch:'mail', status:'sent',     sent:2140, open:41.8, click:11.0, owner:'AD', date:'Apr 15', perf:'good' },
    { name:'May launch teaser',    ch:'mail', status:'scheduled',sent:0,    open:0,    click:0,    owner:'RA', date:'May 3',  perf:'na' },
    { name:'Reactivation · WA',    ch:'wa',   status:'draft',    sent:0,    open:0,    click:0,    owner:'NK', date:'—',     perf:'na' },
  ];
  const ChIcon = { wa:I.wa, mail:I.mail, sms:I.phone };
  const statusPill = {
    sent:      <span className="pill green"><I.check size={10}/> Sent</span>,
    running:   <span className="pill blue"><span className="dot pulse" style={{background:'#22C55E'}}/> Running</span>,
    scheduled: <span className="pill amber"><I.clock size={10}/> Scheduled</span>,
    draft:     <span className="pill"><I.copy size={10}/> Draft</span>,
  };

  return (
    <>
      <Topbar
        title="Campaigns" subtitle={`${camps.length} campaigns · 2 running`}
        actions={<>
          <button className="btn"><I.filter size={13}/> Filter</button>
          <button className="btn"><I.copy size={13}/> Templates</button>
          <button className="btn primary"><I.plus size={14}/> New campaign</button>
        </>}
      />
      <div className="page">
        <div className="row gap-3" style={{marginBottom:14}}>
          <Stat label="Sent (30d)" v="48,210" sub="+22.0%"/>
          <Stat label="Avg open"   v="42.1%" sub="vs 38.6%"/>
          <Stat label="Avg click"  v="11.4%" sub="vs 9.8%"/>
          <Stat label="Revenue"    v="₹14.2L" sub="attributed"/>
        </div>

        <div className="card" style={{padding:0}}>
          <div className="row gap-2" style={{padding:'10px 14px', borderBottom:'1px solid var(--border)'}}>
            <div className="row gap-1 segment">
              <button className="seg-btn active">All</button>
              <button className="seg-btn">Email</button>
              <button className="seg-btn">WhatsApp</button>
              <button className="seg-btn">SMS</button>
            </div>
            <div className="flex-1"/>
            <div className="input-icon"><I.search size={13}/><input className="input" placeholder="Search campaigns" style={{width:200}}/></div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:30}}><input type="checkbox"/></th>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Open</th>
                <th>Click</th>
                <th>Owner</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {camps.map((c,i) => {
                const Ch = ChIcon[c.ch];
                return (
                  <tr key={i}>
                    <td><input type="checkbox"/></td>
                    <td>
                      <div className="row gap-3">
                        <div style={{width:32, height:32, borderRadius:8, background:'var(--surface-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                          <Ch size={14} className="muted"/>
                        </div>
                        <div className="col" style={{lineHeight:1.3}}>
                          <span style={{fontWeight:500}}>{c.name}</span>
                          <span className="muted-2" style={{fontSize:11}}>Audience · Hot leads — Apr</span>
                        </div>
                      </div>
                    </td>
                    <td className="muted" style={{textTransform:'capitalize'}}>{c.ch === 'wa' ? 'WhatsApp' : c.ch === 'mail' ? 'Email' : 'SMS'}</td>
                    <td>{statusPill[c.status]}</td>
                    <td className="mono" style={{fontVariantNumeric:'tabular-nums'}}>{c.sent ? c.sent.toLocaleString() : '—'}</td>
                    <td>{c.open ? <PerfBar v={c.open}/> : <span className="muted-2">—</span>}</td>
                    <td>{c.click ? <PerfBar v={c.click} max={30} color="#A78BFA"/> : <span className="muted-2">—</span>}</td>
                    <td><div className="avatar sm" style={{background:'#374151'}}>{c.owner}</div></td>
                    <td className="muted">{c.date}</td>
                    <td><button className="icon-btn"><I.more size={14}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Stat({label, v, sub}) {
  return (
    <div className="card flex-1" style={{padding:'14px 18px'}}>
      <div className="muted-2" style={{fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'.05em'}}>{label}</div>
      <div style={{fontSize:24, fontWeight:600, marginTop:4, letterSpacing:'-0.02em'}}>{v}</div>
      <div className="muted-2" style={{fontSize:11}}>{sub}</div>
    </div>
  );
}

function PerfBar({v, max=100, color='#22C55E'}) {
  return (
    <div className="row gap-2" style={{alignItems:'center'}}>
      <div style={{width:60, height:4, background:'var(--surface-2)', borderRadius:2, overflow:'hidden'}}>
        <div style={{width:`${Math.min(100,(v/max)*100)}%`, height:'100%', background:color}}/>
      </div>
      <span className="mono" style={{fontSize:11, fontVariantNumeric:'tabular-nums'}}>{v}%</span>
    </div>
  );
}

window.CampaignsPage = CampaignsPage;
