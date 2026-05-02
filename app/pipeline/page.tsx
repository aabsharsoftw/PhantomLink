'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const STAGES = [
  { id: 'new',       name: 'New Lead',      color: '#6C7187' },
  { id: 'contact',   name: 'Contacted',     color: '#3B82F6' },
  { id: 'qualified', name: 'Qualified',     color: '#A78BFA' },
  { id: 'proposal',  name: 'Proposal Sent', color: '#EC4899' },
  { id: 'won',       name: 'Won',           color: '#22C55E' },
]

type Deal = { id: string; name: string; v: string; who: string; co: string; tags: string[]; days: number; p: string; email?: string; phone?: string; notes?: string }

const INITIAL_DEALS: Record<string, Deal[]> = {
  new: [
    { id: 'd1', name: 'Helio · 200 seats',  v: '₹4,80,000', who: 'FK', co: 'Helio',        tags: ['enterprise'], days: 1, p: 'high', email: 'faraz@helio.co',      phone: '+91 99008 12340', notes: 'Interested in 200 seat enterprise plan. Decision maker is Faraz.' },
    { id: 'd2', name: 'Quay onboarding',     v: '₹1,20,000', who: 'SM', co: 'Quay',         tags: ['trial'],      days: 2, p: 'med',  email: 'sahil@quay.io',       phone: '+91 98000 14422', notes: 'Came in via import. Needs onboarding package.' },
    { id: 'd3', name: 'Dunes retainer Q3',   v: '₹3,60,000', who: 'MI', co: 'Dunes Studio', tags: ['agency'],     days: 1, p: 'med',  email: 'meera@dunes.studio',  phone: '+91 89765 21034', notes: 'Agency retainer for Q3. Pending internal approval.' },
  ],
  contact: [
    { id: 'd4', name: 'Northwind expansion', v: '₹2,40,000', who: 'PK', co: 'Northwind', tags: ['expansion'],  days: 4, p: 'med',  email: 'priya@northwind.co',   phone: '+91 98201 49832', notes: 'Expanding from 10 to 50 seats. Demo scheduled.' },
    { id: 'd5', name: 'Arcwise pilot',        v: '₹6,00,000', who: 'RM', co: 'Arcwise',   tags: ['enterprise'], days: 3, p: 'high', email: 'rohit@arcwise.app',    phone: '+91 99876 11240', notes: 'Pilot for 6 months. Procurement involved.' },
  ],
  qualified: [
    { id: 'd6', name: 'Levanta — annual',     v: '₹8,40,000', who: 'SI', co: 'Levanta',  tags: ['hot-lead','mumbai'], days: 5, p: 'high', email: 'sana@levanta.io',      phone: '+91 98103 22018', notes: '3 sub-brands. Annual contract. Closing this week.' },
    { id: 'd7', name: 'Orbital · team plan',  v: '₹1,80,000', who: 'AR', co: 'Orbital',  tags: ['demo-booked'], days: 2, p: 'med', email: 'aditi@orbital.tech',    phone: '+91 90120 84411', notes: 'Demo booked for May 2. Team of 12.' },
    { id: 'd8', name: 'Meridian add-on',      v: '₹95,000',   who: 'VS', co: 'Meridian', tags: ['hot-lead'],    days: 6, p: 'low', email: 'v.shah@meridian.in',    phone: '+91 98765 41200', notes: 'Add-on to existing plan. Low friction close.' },
  ],
  proposal: [
    { id: 'd9',  name: 'Acme HVAC',        v: '₹4,80,000', who: 'AD', co: 'Acme HVAC', tags: ['enterprise'], days: 7, p: 'high', email: 'admin@acmehvac.in',    phone: '+91 98110 00001', notes: 'Proposal sent Apr 25. Awaiting sign-off from director.' },
    { id: 'd10', name: 'Belvedere Iberia', v: '€18,000',   who: 'LP', co: 'Belvedere', tags: ['intl'],       days: 9, p: 'med',  email: 'lina@belvedere.es',    phone: '+34 612 88 04 12', notes: 'International deal. Contract signing tomorrow.' },
  ],
  won: [
    { id: 'd11', name: 'Flux growth plan', v: '₹2,40,000', who: 'KB', co: 'Flux', tags: ['won'], days: 0, p: 'high', email: 'karan@flux.app',  phone: '+91 99887 76651', notes: 'Closed Apr 28. Annual plan.' },
    { id: 'd12', name: 'Sahil retainer',   v: '₹60,000',   who: 'SM', co: 'Quay', tags: ['won'], days: 0, p: 'med',  email: 'sahil@quay.io',   phone: '+91 98000 14422', notes: 'Monthly retainer. Auto-renews.' },
  ],
}

const tagColor: Record<string, string> = {
  enterprise: 'violet', trial: 'teal', agency: 'amber', expansion: 'blue',
  'hot-lead': 'red', mumbai: 'blue', 'demo-booked': 'green', intl: 'pink', won: 'green',
}
const prioColor: Record<string, string> = { high: '#EF4444', med: '#F59E0B', low: '#6C7187' }
const prioLabel: Record<string, string> = { high: 'High', med: 'Medium', low: 'Low' }

const BLANK_DEAL = { name: '', v: '', co: '', who: '', tags: [] as string[], days: 0, p: 'med', email: '', phone: '', notes: '' }

export default function LeadManagementPage() {
  const [deals, setDeals] = useState<Record<string, Deal[]>>(INITIAL_DEALS)
  const [dragSrc, setDragSrc] = useState<{ stageId: string; dealId: string } | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [selected, setSelected] = useState<{ deal: Deal; stageId: string } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(BLANK_DEAL)
  const [addStage, setAddStage] = useState('new')
  const [toast, setToast] = useState('')
  const [view, setView] = useState<'board' | 'list'>('board')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleDragStart(stageId: string, dealId: string) {
    setDragSrc({ stageId, dealId })
  }

  function handleDrop(targetStageId: string) {
    if (!dragSrc || dragSrc.stageId === targetStageId) { setDragSrc(null); setDragOver(null); return }
    setDeals(prev => {
      const src = [...prev[dragSrc.stageId]]
      const idx = src.findIndex(d => d.id === dragSrc.dealId)
      if (idx === -1) return prev
      const [deal] = src.splice(idx, 1)
      const tgt = [...(prev[targetStageId] || [])]
      tgt.unshift(deal)
      return { ...prev, [dragSrc.stageId]: src, [targetStageId]: tgt }
    })
    setDragSrc(null)
    setDragOver(null)
    showToast(`Moved to ${STAGES.find(s => s.id === targetStageId)?.name}`)
  }

  function moveDeal(deal: Deal, fromStageId: string, direction: 1 | -1) {
    const fromIdx = STAGES.findIndex(s => s.id === fromStageId)
    const toIdx = fromIdx + direction
    if (toIdx < 0 || toIdx >= STAGES.length) return
    const toStageId = STAGES[toIdx].id
    setDeals(prev => {
      const src = prev[fromStageId].filter(d => d.id !== deal.id)
      const tgt = [deal, ...(prev[toStageId] || [])]
      return { ...prev, [fromStageId]: src, [toStageId]: tgt }
    })
    setSelected({ deal, stageId: toStageId })
    showToast(`Moved to ${STAGES[toIdx].name}`)
  }

  function deleteDeal(deal: Deal, stageId: string) {
    setDeals(prev => ({ ...prev, [stageId]: prev[stageId].filter(d => d.id !== deal.id) }))
    setSelected(null)
    showToast('Deal deleted')
  }

  function handleAdd() {
    if (!form.name.trim()) return
    const newDeal: Deal = { ...form, id: `d${Date.now()}`, tags: form.tags }
    setDeals(prev => ({ ...prev, [addStage]: [newDeal, ...(prev[addStage] || [])] }))
    setForm(BLANK_DEAL)
    setShowAdd(false)
    showToast('Deal created')
  }

  const totals = STAGES.map(s => ({
    count: deals[s.id]?.length || 0,
    val: (deals[s.id] || []).reduce((a, d) => a + (parseInt(d.v.replace(/[^\d]/g, '')) || 0), 0),
  }))

  const allDeals = STAGES.flatMap(s => (deals[s.id] || []).map(d => ({ ...d, stage: s.name, stageId: s.id })))

  return (
    <>
      <Topbar
        title="Lead Management"
        breadcrumb={['Workspace', 'Inbound — SaaS']}
        actions={<>
          <div className="row gap-1 segment">
            <button className={`seg-btn${view === 'board' ? ' active' : ''}`} onClick={() => setView('board')}><I.grid size={11} /> Board</button>
            <button className={`seg-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}><I.list size={11} /> List</button>
          </div>
          <button className="btn"><I.filter size={13} /> Filters</button>
          <button className="btn primary" onClick={() => setShowAdd(true)}><I.plus size={14} /> New deal</button>
        </>}
      />

      {view === 'board' ? (
        <div className="page" style={{ padding: '16px 20px', overflowX: 'auto', overflowY: 'hidden', height: '100%' }}>
          <div className="row gap-3" style={{ height: '100%', alignItems: 'stretch', minWidth: 'min-content' }}>
            {STAGES.map((s, idx) => {
              const t = totals[idx]
              return (
                <div key={s.id} className="col gap-2" style={{ minWidth: 280, width: 280, flex: '0 0 280px' }}
                  onDragOver={e => { e.preventDefault(); setDragOver(s.id) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(s.id)}
                >
                  <div className="row gap-2" style={{ padding: '2px 4px' }}>
                    <span className="dot" style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                    <span className="muted-2" style={{ fontSize: 11 }}>{t.count}</span>
                    <div className="flex-1" />
                    <span className="muted" style={{ fontSize: 11 }}>₹{(t.val / 100000).toFixed(1)}L</span>
                    <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => { setAddStage(s.id); setShowAdd(true) }}><I.plus size={12} /></button>
                  </div>
                  <div className={`col gap-2 stage-col${dragOver === s.id ? ' drag-over' : ''}`} style={{ flex: 1, overflowY: 'auto', padding: 4, borderRadius: 8, minHeight: 80 }}>
                    {(deals[s.id] || []).map((d, i) => (
                      <div
                        key={d.id}
                        className="deal-card"
                        draggable
                        onDragStart={() => handleDragStart(s.id, d.id)}
                        onClick={() => setSelected({ deal: d, stageId: s.id })}
                        style={{ opacity: dragSrc?.dealId === d.id ? 0.4 : 1, cursor: 'grab' }}
                      >
                        <div className="row gap-2" style={{ justifyContent: 'space-between' }}>
                          <div className="row gap-1" style={{ fontSize: 11, color: 'var(--text-3)' }}>
                            <I.building size={11} /> {d.co}
                          </div>
                          <span className="dot" style={{ width: 6, height: 6, background: prioColor[d.p], borderRadius: '50%' }} title={prioLabel[d.p]} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{d.name}</div>
                        <div className="row gap-1" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                          {d.tags.map(t => <span key={t} className={`pill ${tagColor[t] || ''}`} style={{ fontSize: 10 }}>{t}</span>)}
                        </div>
                        <div className="row gap-2" style={{ marginTop: 10, alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{d.v}</span>
                          <div className="flex-1" />
                          {d.days > 0 && <span className="row gap-1 muted-2" style={{ fontSize: 10 }}><I.clock size={10} /> {d.days}d</span>}
                          <div className="avatar sm" style={{ background: `hsl(${i * 53 % 360},42%,42%)`, width: 20, height: 20, fontSize: 9 }}>{d.who}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="page">
          <div className="card" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Deal</th><th>Company</th><th>Stage</th><th>Value</th><th>Priority</th><th>Owner</th><th>Days</th><th></th>
                </tr>
              </thead>
              <tbody>
                {allDeals.map((d, i) => {
                  const stageInfo = STAGES.find(s => s.id === d.stageId)!
                  return (
                    <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setSelected({ deal: d, stageId: d.stageId })}>
                      <td><span style={{ fontWeight: 500 }}>{d.name}</span></td>
                      <td className="muted">{d.co}</td>
                      <td><span className="pill" style={{ borderLeft: `3px solid ${stageInfo.color}` }}>{d.stage}</span></td>
                      <td className="mono">{d.v}</td>
                      <td><span style={{ color: prioColor[d.p], fontSize: 12, fontWeight: 600 }}>{prioLabel[d.p]}</span></td>
                      <td><div className="avatar sm" style={{ background: `hsl(${i * 53 % 360},42%,42%)` }}>{d.who}</div></td>
                      <td className="muted">{d.days > 0 ? `${d.days}d` : '—'}</td>
                      <td><button className="icon-btn"><I.more size={14} /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal detail panel */}
      {selected && (() => {
        const { deal, stageId } = selected
        const stageIdx = STAGES.findIndex(s => s.id === stageId)
        return (
          <div className="detail-panel">
            <div className="detail-panel-header">
              <div className="col flex-1" style={{ gap: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{deal.name}</div>
                <div className="row gap-2">
                  <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{deal.v}</span>
                  <span className="pill" style={{ borderLeft: `3px solid ${STAGES[stageIdx].color}`, fontSize: 11 }}>{STAGES[stageIdx].name}</span>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setSelected(null)}><I.x size={14} /></button>
            </div>

            <div className="detail-section">
              <div className="detail-label">Move stage</div>
              <div className="row gap-2">
                <button className="btn sm" disabled={stageIdx === 0} onClick={() => moveDeal(deal, stageId, -1)}>
                  ← {stageIdx > 0 ? STAGES[stageIdx - 1].name : '—'}
                </button>
                <div className="flex-1" />
                <button className="btn sm primary" disabled={stageIdx === STAGES.length - 1} onClick={() => moveDeal(deal, stageId, 1)}>
                  {stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1].name : '—'} →
                </button>
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-label">Details</div>
              <div className="detail-row"><span>Company</span><span>{deal.co}</span></div>
              <div className="detail-row"><span>Email</span><span style={{ fontSize: 11 }}>{deal.email}</span></div>
              <div className="detail-row"><span>Phone</span><span>{deal.phone}</span></div>
              <div className="detail-row"><span>Priority</span><span style={{ color: prioColor[deal.p], fontWeight: 600 }}>{prioLabel[deal.p]}</span></div>
              <div className="detail-row"><span>Owner</span><span>{deal.who}</span></div>
              {deal.days > 0 && <div className="detail-row"><span>In stage</span><span>{deal.days} days</span></div>}
            </div>

            <div className="detail-section">
              <div className="detail-label">Tags</div>
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {deal.tags.map(t => <span key={t} className={`pill ${tagColor[t] || ''}`}>{t}</span>)}
              </div>
            </div>

            {deal.notes && (
              <div className="detail-section">
                <div className="detail-label">Notes</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{deal.notes}</div>
              </div>
            )}

            <div className="detail-section" style={{ border: 'none' }}>
              <div className="row gap-2">
                <button className="btn sm" style={{ flex: 1 }}><I.mail size={12} /> Email</button>
                <button className="btn sm" style={{ flex: 1 }}><I.wa size={12} /> WhatsApp</button>
                <button className="btn sm ghost" onClick={() => deleteDeal(deal, stageId)}><I.x size={12} /></button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Add deal modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>New Deal</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowAdd(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="form-field">
                <label>Deal name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Acme — Pro plan" />
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Company</label>
                  <input className="input" value={form.co} onChange={e => setForm({ ...form, co: e.target.value })} placeholder="Company name" />
                </div>
                <div className="form-field">
                  <label>Value</label>
                  <input className="input" value={form.v} onChange={e => setForm({ ...form, v: e.target.value })} placeholder="₹0" />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Stage</label>
                  <select value={addStage} onChange={e => setAddStage(e.target.value)}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Priority</label>
                  <select value={form.p} onChange={e => setForm({ ...form, p: e.target.value })}>
                    <option value="high">High</option>
                    <option value="med">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Email</label>
                  <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@company.com" />
                </div>
                <div className="form-field">
                  <label>Owner initials</label>
                  <input className="input" value={form.who} onChange={e => setForm({ ...form, who: e.target.value })} placeholder="RA" maxLength={3} />
                </div>
              </div>
              <div className="form-field">
                <label>Notes</label>
                <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any context about this deal…" style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit' }} />
              </div>
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn primary" onClick={handleAdd}><I.plus size={13} /> Create deal</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>
      )}
    </>
  )
}
