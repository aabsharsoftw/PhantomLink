'use client'

import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const stages = [
  { id: 'new',       name: 'New Lead',      color: '#6C7187' },
  { id: 'contact',   name: 'Contacted',     color: '#3B82F6' },
  { id: 'qualified', name: 'Qualified',     color: '#A78BFA' },
  { id: 'proposal',  name: 'Proposal Sent', color: '#EC4899' },
  { id: 'won',       name: 'Won',           color: '#22C55E' },
]

const deals: Record<string, Array<{ name: string; v: string; who: string; co: string; tags: string[]; days: number; p: string }>> = {
  new: [
    { name: 'Helio · 200 seats',  v: '₹4,80,000', who: 'FK', co: 'Helio',        tags: ['enterprise'], days: 1, p: 'high' },
    { name: 'Quay onboarding',     v: '₹1,20,000', who: 'SM', co: 'Quay',         tags: ['trial'],      days: 2, p: 'med' },
    { name: 'Dunes retainer Q3',   v: '₹3,60,000', who: 'MI', co: 'Dunes Studio', tags: ['agency'],     days: 1, p: 'med' },
  ],
  contact: [
    { name: 'Northwind expansion', v: '₹2,40,000', who: 'PK', co: 'Northwind', tags: ['expansion'],  days: 4, p: 'med' },
    { name: 'Arcwise pilot',        v: '₹6,00,000', who: 'RM', co: 'Arcwise',   tags: ['enterprise'], days: 3, p: 'high' },
  ],
  qualified: [
    { name: 'Levanta — annual',     v: '₹8,40,000', who: 'SI', co: 'Levanta',  tags: ['hot-lead','mumbai'], days: 5, p: 'high' },
    { name: 'Orbital · team plan',  v: '₹1,80,000', who: 'AR', co: 'Orbital',  tags: ['demo-booked'], days: 2, p: 'med' },
    { name: 'Meridian add-on',      v: '₹95,000',   who: 'VS', co: 'Meridian', tags: ['hot-lead'],    days: 6, p: 'low' },
  ],
  proposal: [
    { name: 'Acme HVAC',            v: '₹4,80,000', who: 'AD', co: 'Acme HVAC', tags: ['enterprise'], days: 7, p: 'high' },
    { name: 'Belvedere Iberia',     v: '€18,000',   who: 'LP', co: 'Belvedere', tags: ['intl'],       days: 9, p: 'med' },
  ],
  won: [
    { name: 'Flux growth plan',     v: '₹2,40,000', who: 'KB', co: 'Flux', tags: ['won'], days: 0, p: 'high' },
    { name: 'Sahil retainer',       v: '₹60,000',   who: 'SM', co: 'Quay', tags: ['won'], days: 0, p: 'med' },
  ],
}

const tagColor: Record<string, string> = {
  enterprise: 'violet', trial: 'teal', agency: 'amber', expansion: 'blue',
  'hot-lead': 'red', mumbai: 'blue', 'demo-booked': 'green', intl: 'pink', won: 'green',
}
const prioColor: Record<string, string> = { high: '#EF4444', med: '#F59E0B', low: '#6C7187' }

export default function PipelinePage() {
  const totals = stages.map(s => ({
    id: s.id,
    count: deals[s.id]?.length || 0,
    val: (deals[s.id] || []).reduce((a, d) => a + (parseInt(d.v.replace(/[^\d]/g, '')) || 0), 0),
  }))

  return (
    <>
      <Topbar
        title="Pipeline"
        breadcrumb={['Workspace', 'Inbound — SaaS']}
        actions={<>
          <div className="row gap-1 segment">
            <button className="seg-btn active"><I.grid size={11} /> Board</button>
            <button className="seg-btn"><I.list size={11} /> List</button>
          </div>
          <button className="btn"><I.filter size={13} /> Filters</button>
          <button className="btn"><I.user size={13} /> Owner: All</button>
          <button className="btn primary"><I.plus size={14} /> New deal</button>
        </>}
      />
      <div className="page" style={{ padding: '16px 20px', overflowX: 'auto', overflowY: 'hidden', height: '100%' }}>
        <div className="row gap-3" style={{ height: '100%', alignItems: 'stretch', minWidth: 'min-content' }}>
          {stages.map((s, idx) => {
            const t = totals[idx]
            return (
              <div key={s.id} className="col gap-2" style={{ minWidth: 280, width: 280, flex: '0 0 280px' }}>
                <div className="row gap-2" style={{ padding: '2px 4px' }}>
                  <span className="dot" style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  <span className="muted-2" style={{ fontSize: 11 }}>{t.count}</span>
                  <div className="flex-1" />
                  <span className="muted" style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>₹{(t.val / 100000).toFixed(1)}L</span>
                  <button className="icon-btn" style={{ width: 22, height: 22 }}><I.plus size={12} /></button>
                </div>
                <div className="col gap-2 stage-col">
                  {(deals[s.id] || []).map((d, i) => (
                    <div key={i} className="deal-card">
                      <div className="row gap-2" style={{ justifyContent: 'space-between' }}>
                        <div className="row gap-1" style={{ fontSize: 11, color: 'var(--text-3)' }}>
                          <I.building size={11} /> {d.co}
                        </div>
                        <span className="dot" style={{ width: 6, height: 6, background: prioColor[d.p] }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{d.name}</div>
                      <div className="row gap-1" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                        {d.tags.map(t => <span key={t} className={`pill ${tagColor[t] || ''}`}>{t}</span>)}
                      </div>
                      <div className="row gap-2" style={{ marginTop: 10, alignItems: 'center' }}>
                        <span className="mono" style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.v}</span>
                        <div className="flex-1" />
                        <span className="row gap-1 muted-2" style={{ fontSize: 10 }}>
                          <I.clock size={10} /> {d.days}d
                        </span>
                        <div className="avatar sm" style={{ background: `hsl(${(i + idx) * 53 % 360},42%,42%)`, width: 20, height: 20, fontSize: 9 }}>{d.who}</div>
                      </div>
                    </div>
                  ))}
                  {s.id === 'qualified' && (
                    <div className="deal-card ghost"><span className="muted-2" style={{ fontSize: 11 }}>+ Drop a contact here to create a deal</span></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
