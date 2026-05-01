// Sites & Funnels — list of websites/funnels with previews and stats
function SitesPage() {
  const sites = [
    { name:'Acme — Pricing Funnel',   type:'funnel',  status:'live',     pages:5, visits:'12.4K', conv:'8.4%',  rev:'₹4.2L', updated:'2h ago',  color:'#6366F1', perf:'great' },
    { name:'Spring Promo Landing',     type:'landing', status:'live',     pages:1, visits:'4.8K',  conv:'14.2%', rev:'₹1.8L', updated:'1d ago',  color:'#22C55E', perf:'great' },
    { name:'Webinar Registration',     type:'funnel',  status:'live',     pages:3, visits:'2.1K',  conv:'42.0%', rev:'—',     updated:'3d ago',  color:'#F59E0B', perf:'good' },
    { name:'Acme HQ — Marketing Site', type:'website', status:'live',     pages:14,visits:'58K',   conv:'2.1%',  rev:'—',     updated:'5d ago',  color:'#A78BFA', perf:'good' },
    { name:'Cart Recovery — WA Flow',  type:'funnel',  status:'paused',   pages:2, visits:'820',   conv:'22.4%', rev:'₹62K',  updated:'2w ago',  color:'#EC4899', perf:'great' },
    { name:'May Launch Teaser',        type:'landing', status:'draft',    pages:1, visits:'—',     conv:'—',     rev:'—',     updated:'just now',color:'#14B8A6', perf:'na' },
  ];
  const typeIcon = { funnel:I.funnel, landing:I.swatchSm, website:I.globe2 };
  const statusPill = {
    live:   <span className="pill green"><span className="dot pulse" style={{background:'#22C55E'}}/> Live</span>,
    paused: <span className="pill amber"><I.pause size={9}/> Paused</span>,
    draft:  <span className="pill"><I.pencil size={9}/> Draft</span>,
  };

  return (
    <>
      <Topbar
        title="Sites & Funnels" subtitle={`${sites.length} sites · 4 live`}
        actions={<>
          <div className="row gap-1 segment">
            <button className="seg-btn active">All</button>
            <button className="seg-btn">Funnels</button>
            <button className="seg-btn">Landing</button>
            <button className="seg-btn">Sites</button>
          </div>
          <button className="btn"><I.swatch size={13}/> Templates</button>
          <button className="btn primary"><I.plus size={14}/> New site</button>
        </>}
      />
      <div className="page">
        <div className="row gap-3" style={{marginBottom:14}}>
          <Stat label="Visits (30d)"  v="78,340" sub="+18.4%"/>
          <Stat label="Conversions"   v="6,120"  sub="7.8% rate"/>
          <Stat label="Revenue"       v="₹6.2L"  sub="attributed"/>
          <Stat label="Avg page speed" v="92"    sub="Lighthouse"/>
        </div>

        <div className="sites-grid">
          {sites.map((s,i) => {
            const Ic = typeIcon[s.type];
            return (
              <div key={i} className="card site-card">
                <div className="site-thumb" style={{background:`linear-gradient(135deg, color-mix(in srgb, ${s.color} 28%, var(--surface-2)), var(--surface-2))`}}>
                  <FakeSitePreview color={s.color} kind={s.type}/>
                  <div className="site-thumb-overlay">
                    <button className="btn sm"><I.eye size={11}/> Preview</button>
                    <button className="btn sm primary"><I.pencil size={11}/> Edit</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row gap-2" style={{marginBottom:6}}>
                    <Ic size={13} className="muted-2"/>
                    <span className="muted-2" style={{fontSize:11, textTransform:'capitalize'}}>{s.type}</span>
                    {statusPill[s.status]}
                  </div>
                  <div style={{fontSize:13.5, fontWeight:600, marginBottom:2}}>{s.name}</div>
                  <div className="muted-2" style={{fontSize:11}}>{s.pages} {s.pages===1?'page':'pages'} · Updated {s.updated}</div>
                  <div className="row gap-3" style={{marginTop:12, paddingTop:10, borderTop:'1px solid var(--border-soft)', fontSize:11}}>
                    <div className="col"><span className="muted-2">Visits</span><span style={{fontWeight:600}}>{s.visits}</span></div>
                    <div className="col"><span className="muted-2">Conv</span><span style={{fontWeight:600, color:s.perf==='great'?'#4ADE80':'var(--text)'}}>{s.conv}</span></div>
                    <div className="col"><span className="muted-2">Revenue</span><span style={{fontWeight:600}}>{s.rev}</span></div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card site-card site-card-empty">
            <div className="col gap-2" style={{alignItems:'center', justifyContent:'center', padding:'40px 20px', height:'100%'}}>
              <div style={{width:48, height:48, borderRadius:'50%', background:'var(--surface-2)', display:'flex', alignItems:'center', justifyContent:'center'}}><I.plus size={20} className="muted-2"/></div>
              <div style={{fontWeight:600, fontSize:13}}>Start from template</div>
              <div className="muted-2" style={{fontSize:11, textAlign:'center'}}>240+ funnels & sites</div>
              <button className="btn sm primary">Browse templates</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FakeSitePreview({ color, kind }) {
  if (kind === 'funnel') return (
    <svg viewBox="0 0 200 110" style={{width:'100%', height:'100%'}}>
      <rect x="20" y="14" width="160" height="22" rx="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="20" y="42" width="100" height="6" rx="2" fill="rgba(255,255,255,0.32)"/>
      <rect x="20" y="52" width="80"  height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="20" y="68" width="50" height="14" rx="2" fill={color}/>
      <rect x="120" y="42" width="60" height="44" rx="3" fill="rgba(255,255,255,0.1)"/>
      <circle cx="150" cy="64" r="10" fill={color} opacity="0.6"/>
      <rect x="20" y="92" width="160" height="3" rx="2" fill="rgba(255,255,255,0.08)"/>
    </svg>
  );
  if (kind === 'landing') return (
    <svg viewBox="0 0 200 110" style={{width:'100%', height:'100%'}}>
      <rect x="14" y="10" width="172" height="34" rx="3" fill="rgba(255,255,255,0.14)"/>
      <rect x="50" y="20" width="100" height="6" rx="2" fill="#fff" opacity="0.7"/>
      <rect x="60" y="32" width="80" height="3" rx="2" fill="#fff" opacity="0.4"/>
      <rect x="14" y="50" width="172" height="22" rx="3" fill={color} opacity="0.4"/>
      <rect x="14" y="78" width="84" height="22" rx="3" fill="rgba(255,255,255,0.1)"/>
      <rect x="102" y="78" width="84" height="22" rx="3" fill="rgba(255,255,255,0.1)"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 200 110" style={{width:'100%', height:'100%'}}>
      <rect x="0" y="0" width="200" height="14" fill="rgba(0,0,0,0.2)"/>
      <rect x="14" y="22" width="172" height="40" rx="3" fill={color} opacity="0.32"/>
      <rect x="14" y="68" width="55" height="32" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="73" y="68" width="55" height="32" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="132" y="68" width="55" height="32" rx="3" fill="rgba(255,255,255,0.08)"/>
    </svg>
  );
}

window.SitesPage = SitesPage;
