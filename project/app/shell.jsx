// GHL-style sidebar — agency switcher, dense module list, sub-account context
const { useState: sUS } = React;

const NAV_PRIMARY = [
  { id: 'dashboard',   label: 'Dashboard',     icon: 'dash' },
  { id: 'launchpad',   label: 'Launchpad',     icon: 'rocket' },
  { id: 'inbox',       label: 'Conversations', icon: 'inbox', badge: 23 },
  { id: 'calendars',   label: 'Calendars',     icon: 'cal' },
  { id: 'contacts',    label: 'Contacts',      icon: 'contact', count: 12482 },
  { id: 'pipeline',    label: 'Opportunities', icon: 'pipeline' },
  { id: 'payments',    label: 'Payments',      icon: 'payments' },
];
const NAV_MARKETING = [
  { id: 'campaigns',   label: 'Marketing',     icon: 'campaign' },
  { id: 'automation',  label: 'Automation',    icon: 'flow' },
  { id: 'sites',       label: 'Sites & Funnels', icon: 'funnel' },
  { id: 'memberships', label: 'Memberships',   icon: 'members' },
  { id: 'reputation',  label: 'Reputation',    icon: 'reviews', badge: 4 },
];
const NAV_INTELLIGENCE = [
  { id: 'reporting',   label: 'Reporting',     icon: 'chart' },
  { id: 'ai',          label: 'AI Employees',  icon: 'ai', tag: 'New' },
];
const NAV_BOTTOM = [
  { id: 'apps',        label: 'App Marketplace', icon: 'store' },
  { id: 'admin',       label: 'Agency view',     icon: 'shield' },
  { id: 'settings',    label: 'Settings',        icon: 'cog' },
];

function Sidebar({ active, onNav }) {
  const [openSwitch, setOpenSwitch] = sUS(false);
  const Item = ({ item }) => {
    const isActive = active === item.id;
    const Ico = I[item.icon];
    return (
      <button onClick={() => onNav(item.id)} className={`nav-item${isActive?' active':''}`}>
        <Ico size={15} />
        <span className="flex-1" style={{textAlign:'left'}}>{item.label}</span>
        {item.tag && <span className="nav-tag">{item.tag}</span>}
        {item.badge && <span className="nav-badge">{item.badge}</span>}
        {item.count && <span className="nav-count">{item.count.toLocaleString()}</span>}
      </button>
    );
  };
  return (
    <aside className="sidebar">
      {/* Agency switcher card */}
      <div className="agency-switcher" onClick={() => setOpenSwitch(!openSwitch)}>
        <div style={{width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#6366F1,#A78BFA)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0}}>P</div>
        <div className="col flex-1" style={{minWidth:0, lineHeight:1.2}}>
          <div className="row gap-1" style={{fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.04em', fontWeight:600}}>
            <I.building size={9}/> PhantomCore Agency
          </div>
          <div className="row gap-2" style={{marginTop:2}}>
            <span style={{fontWeight:600, fontSize:13}} className="truncate flex-1">Acme Marketing</span>
            <I.chevD size={12} className="muted-2"/>
          </div>
        </div>
      </div>

      <button className="search-trigger">
        <I.search size={13} />
        <span className="flex-1" style={{textAlign:'left'}}>Search…</span>
        <span className="kbd">⌘K</span>
      </button>

      <div className="col gap-1" style={{marginTop:6}}>
        {NAV_PRIMARY.map(n => <Item key={n.id} item={n} />)}
      </div>

      <div className="nav-section-label">Marketing</div>
      <div className="col gap-1">
        {NAV_MARKETING.map(n => <Item key={n.id} item={n} />)}
      </div>

      <div className="nav-section-label">Intelligence</div>
      <div className="col gap-1">
        {NAV_INTELLIGENCE.map(n => <Item key={n.id} item={n} />)}
      </div>

      <div className="nav-section-label">Pipelines</div>
      <div className="col gap-1">
        <button className="nav-item small"><span className="dot" style={{background:'var(--accent)'}}/><span className="flex-1" style={{textAlign:'left'}}>Inbound — SaaS</span><span className="muted-2">42</span></button>
        <button className="nav-item small"><span className="dot" style={{background:'var(--teal)'}}/><span className="flex-1" style={{textAlign:'left'}}>Enterprise</span><span className="muted-2">14</span></button>
        <button className="nav-item small"><span className="dot" style={{background:'var(--amber)'}}/><span className="flex-1" style={{textAlign:'left'}}>Renewals Q3</span><span className="muted-2">23</span></button>
      </div>

      <div className="flex-1" />

      <div className="col gap-1">
        {NAV_BOTTOM.map(n => <Item key={n.id} item={n} />)}
      </div>

      <div className="user-card">
        <div className="avatar" style={{background:'linear-gradient(135deg,#A78BFA,#6366F1)'}}>RA</div>
        <div className="col flex-1" style={{lineHeight:1.25, minWidth:0}}>
          <div className="truncate" style={{fontWeight:500, fontSize:12}}>Riya Acharya</div>
          <div className="muted-2 truncate" style={{fontSize:11}}>Sub-account Admin</div>
        </div>
        <I.more size={14} className="muted-2"/>
      </div>
    </aside>
  );
}

function ContextStrip({ snapshot = 'SaaS Starter v3', envBadge = 'Live' }) {
  return (
    <div className="ctx-strip">
      <div className="row gap-2">
        <span className="muted-2" style={{fontSize:11}}>Sub-account</span>
        <span style={{fontSize:12, fontWeight:600}}>Acme Marketing</span>
        <span className="pill green" style={{fontSize:10}}><span className="dot pulse" style={{background:'#22C55E'}}/>{envBadge}</span>
      </div>
      <div className="row gap-2">
        <span className="muted-2" style={{fontSize:11}}>·</span>
        <I.layers size={12} className="muted-2"/>
        <span style={{fontSize:11}} className="muted">Snapshot: <b style={{color:'var(--text-2)'}}>{snapshot}</b></span>
      </div>
      <div className="row gap-2">
        <span className="muted-2" style={{fontSize:11}}>·</span>
        <I.globe2 size={12} className="muted-2"/>
        <span style={{fontSize:11}} className="muted">app.acmemarketing.io</span>
      </div>
      <div className="flex-1"/>
      <div className="row gap-2">
        <span className="muted-2" style={{fontSize:11}}>3 unread tasks</span>
        <span className="muted-2" style={{fontSize:11}}>·</span>
        <span className="muted-2" style={{fontSize:11}}>API · 99.98%</span>
        <button className="btn sm ghost"><I.swap size={11}/> Switch sub-account</button>
        <button className="btn sm ghost"><I.eye size={11}/> View as agency</button>
      </div>
    </div>
  );
}

function Topbar({ title, subtitle, actions, breadcrumb }) {
  return (
    <header className="topbar">
      <div className="col gap-1 flex-1">
        {breadcrumb && <div className="row gap-1 muted-2" style={{fontSize:11}}>
          {breadcrumb.map((b,i) => <React.Fragment key={i}>
            <span>{b}</span>{i<breadcrumb.length-1 && <I.chevR size={11}/>}
          </React.Fragment>)}
        </div>}
        <div className="row gap-3">
          <h1 className="page-title">{title}</h1>
          {subtitle && <span className="muted" style={{fontSize:12, marginTop:4}}>{subtitle}</span>}
        </div>
      </div>
      <div className="row gap-2">
        {actions}
        <button className="icon-btn" title="Help"><I.flask size={15}/></button>
        <button className="icon-btn"><I.bell size={16}/><span className="dot-badge"/></button>
        <div className="topbar-divider"/>
        <button className="btn ghost"><I.spark size={14}/> Ask AI</button>
      </div>
    </header>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.ContextStrip = ContextStrip;
