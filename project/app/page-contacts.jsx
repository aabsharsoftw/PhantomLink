// Contacts — table list with filters, segments
function ContactsPage() {
  const contacts = [
    { name:'Sana Iqbal',     email:'sana@levanta.io',      phone:'+91 98103 22018', company:'Levanta',         tags:['hot-lead','mumbai'], owner:'RA', source:'Website',  created:'Apr 28', score:92 },
    { name:'Rohit Menon',    email:'rohit@arcwise.app',    phone:'+91 99876 11240', company:'Arcwise',         tags:['enterprise'],         owner:'AD', source:'Referral', created:'Apr 28', score:88 },
    { name:'Priya Kulkarni', email:'priya@northwind.co',   phone:'+91 98201 49832', company:'Northwind',       tags:['newsletter'],         owner:'RA', source:'Import',   created:'Apr 27', score:64 },
    { name:'Vikram Shah',    email:'v.shah@meridian.in',   phone:'+91 98765 41200', company:'Meridian Labs',   tags:['hot-lead'],           owner:'NK', source:'API',      created:'Apr 27', score:81 },
    { name:'Aditi Rao',      email:'aditi@orbital.tech',   phone:'+91 90120 84411', company:'Orbital',         tags:['demo-booked'],        owner:'AD', source:'Website',  created:'Apr 26', score:76 },
    { name:'Faraz Khan',     email:'faraz@helio.co',       phone:'+91 99008 12340', company:'Helio',           tags:['enterprise','demo-booked'], owner:'RA', source:'Referral', created:'Apr 26', score:84 },
    { name:'Meera Iyer',     email:'meera@dunes.studio',   phone:'+91 89765 21034', company:'Dunes Studio',    tags:['agency'],             owner:'NK', source:'Form',     created:'Apr 25', score:58 },
    { name:'Karan Bhatt',    email:'karan@flux.app',       phone:'+91 99887 76651', company:'Flux',            tags:['hot-lead','trial'],   owner:'AD', source:'Campaign', created:'Apr 25', score:79 },
    { name:'Lina Pereira',   email:'lina@belvedere.es',    phone:'+34 612 88 04 12', company:'Belvedere',       tags:['intl','enterprise'],  owner:'RA', source:'Website',  created:'Apr 25', score:71 },
    { name:'Sahil Mehta',    email:'sahil@quay.io',        phone:'+91 98000 14422', company:'Quay',            tags:['churned'],            owner:'NK', source:'Import',   created:'Apr 24', score:32 },
  ];
  const tagColor = { 'hot-lead':'red','mumbai':'blue','enterprise':'violet','newsletter':'pill','demo-booked':'green','agency':'amber','trial':'teal','intl':'pink','churned':'pill' };
  return (
    <>
      <Topbar
        title="Contacts" subtitle={`${contacts.length.toLocaleString()} of 12,482 visible`}
        actions={<>
          <button className="btn"><I.upload size={14}/> Import</button>
          <button className="btn"><I.download size={14}/> Export</button>
          <button className="btn primary"><I.plus size={14}/> New contact</button>
        </>}
      />
      <div className="page" style={{padding:0, display:'grid', gridTemplateColumns:'220px 1fr', overflow:'hidden'}}>
        {/* Segments rail */}
        <aside style={{borderRight:'1px solid var(--border)', padding:'14px 12px', overflow:'auto'}}>
          <div className="nav-section-label" style={{padding:'4px 8px'}}>Smart lists</div>
          <div className="col gap-1">
            {[
              {n:'All contacts', c:12482, active:true},
              {n:'Hot leads · Mumbai', c:284, dot:'#EF4444'},
              {n:'Demo booked', c:42, dot:'#22C55E'},
              {n:'Enterprise · India', c:118, dot:'#A78BFA'},
              {n:'Trial — day 7', c:96, dot:'#14B8A6'},
              {n:'Newsletter subs', c:8204, dot:'#3B82F6'},
              {n:'Churned (30d)', c:212, dot:'#6C7187'},
            ].map((s,i) => (
              <button key={i} className={`nav-item small${s.active?' active':''}`}>
                {s.dot ? <span className="dot" style={{background:s.dot}}/> : <I.list size={12}/>}
                <span className="flex-1" style={{textAlign:'left'}}>{s.n}</span>
                <span className="muted-2" style={{fontSize:10}}>{s.c.toLocaleString()}</span>
              </button>
            ))}
          </div>
          <div className="nav-section-label" style={{padding:'12px 8px 4px'}}>Static lists</div>
          <div className="col gap-1">
            <button className="nav-item small"><I.list size={12}/><span className="flex-1" style={{textAlign:'left'}}>VIP customers</span><span className="muted-2" style={{fontSize:10}}>34</span></button>
            <button className="nav-item small"><I.list size={12}/><span className="flex-1" style={{textAlign:'left'}}>Beta program</span><span className="muted-2" style={{fontSize:10}}>120</span></button>
          </div>
          <button className="btn ghost sm" style={{marginTop:10, width:'100%', justifyContent:'flex-start'}}><I.plus size={12}/> New list</button>

          <div className="nav-section-label" style={{padding:'14px 8px 4px'}}>Tags</div>
          <div className="row gap-1" style={{flexWrap:'wrap', padding:'0 4px'}}>
            {['hot-lead','enterprise','newsletter','mumbai','demo-booked','agency','trial','intl','churned','event-2026'].map(t =>
              <span key={t} className="tag-chip">#{t}</span>
            )}
          </div>
        </aside>

        <div className="col" style={{minHeight:0}}>
          <div className="row gap-2" style={{padding:'10px 16px', borderBottom:'1px solid var(--border)'}}>
            <div className="input-icon flex-1" style={{maxWidth:320}}>
              <I.search size={14}/>
              <input className="input" placeholder="Search by name, email, phone, company…" style={{width:'100%'}}/>
            </div>
            <button className="btn"><I.filter size={13}/> Filters <span className="pill blue" style={{marginLeft:4}}>3</span></button>
            <button className="btn ghost"><I.tag size={13}/> Tag: hot-lead <I.x size={11}/></button>
            <button className="btn ghost">Source: Website <I.x size={11}/></button>
            <div className="flex-1"/>
            <span className="muted-2" style={{fontSize:11}}>Saved view: <b style={{color:'var(--text)'}}>Hot · April</b></span>
            <button className="icon-btn"><I.refresh size={14}/></button>
            <button className="icon-btn"><I.cog size={14}/></button>
          </div>

          <div className="flex-1" style={{overflow:'auto'}}>
            <table className="table contacts-table">
              <thead>
                <tr>
                  <th style={{width:30}}><input type="checkbox" defaultChecked/></th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Tags</th>
                  <th>Source</th>
                  <th>Owner</th>
                  <th>Score</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c,i) => (
                  <tr key={i} className={i===0?'row-active':''}>
                    <td><input type="checkbox"/></td>
                    <td>
                      <div className="row gap-3">
                        <div className="avatar sm" style={{background:`hsl(${i*47%360},45%,45%)`}}>{c.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div className="col" style={{lineHeight:1.3}}>
                          <span style={{fontWeight:500}}>{c.name}</span>
                          <span className="muted-2" style={{fontSize:11}}>{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><div className="row gap-2"><I.building size={12} className="muted-2"/>{c.company}</div></td>
                    <td>
                      <div className="row gap-1" style={{flexWrap:'wrap'}}>
                        {c.tags.map(t => <span key={t} className={`pill ${tagColor[t]||''}`}>{t}</span>)}
                      </div>
                    </td>
                    <td className="muted">{c.source}</td>
                    <td><div className="avatar sm" style={{background:'#374151'}}>{c.owner}</div></td>
                    <td>
                      <div className="row gap-2" style={{alignItems:'center'}}>
                        <div style={{width:50, height:4, background:'var(--surface-2)', borderRadius:2, overflow:'hidden'}}>
                          <div style={{width:`${c.score}%`, height:'100%', background:c.score>=80?'#22C55E':c.score>=60?'#F59E0B':'#EF4444'}}/>
                        </div>
                        <span className="mono" style={{fontSize:11, fontVariantNumeric:'tabular-nums'}}>{c.score}</span>
                      </div>
                    </td>
                    <td className="muted">{c.created}</td>
                    <td><button className="icon-btn"><I.more size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row gap-3" style={{padding:'10px 16px', borderTop:'1px solid var(--border)', fontSize:11}}>
            <span className="muted">1–{contacts.length} of 12,482</span>
            <div className="flex-1"/>
            <button className="btn sm">Previous</button>
            <button className="btn sm">Next <I.chevR size={11}/></button>
          </div>
        </div>
      </div>
    </>
  );
}
window.ContactsPage = ContactsPage;
