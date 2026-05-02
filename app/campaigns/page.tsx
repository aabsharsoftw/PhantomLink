'use client'

import { useState, ReactElement } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Campaign = {
  id: number; name: string; ch: string; status: string
  sent: number; open: number; click: number; owner: string; date: string; audience: string
}

const INITIAL_CAMPS: Campaign[] = [
  { id: 1, name: 'Spring Promo 2026',  ch: 'mail', status: 'sent',      sent: 4210, open: 38.2, click: 9.4,  owner: 'RA', date: 'Apr 24', audience: 'Hot leads — Apr' },
  { id: 2, name: 'Cart abandon · WA',  ch: 'wa',   status: 'running',   sent: 1820, open: 92.1, click: 14.2, owner: 'AD', date: 'Apr 22', audience: 'Abandoned carts' },
  { id: 3, name: 'OTP welcome SMS',    ch: 'sms',  status: 'running',   sent: 3940, open: 0,    click: 0,    owner: 'NK', date: 'Apr 21', audience: 'New signups' },
  { id: 4, name: 'Renewal reminder',   ch: 'mail', status: 'sent',      sent: 612,  open: 54.0, click: 22.1, owner: 'RA', date: 'Apr 18', audience: 'Renewals — Q2' },
  { id: 5, name: 'Webinar invite',     ch: 'mail', status: 'sent',      sent: 2140, open: 41.8, click: 11.0, owner: 'AD', date: 'Apr 15', audience: 'Newsletter subs' },
  { id: 6, name: 'May launch teaser',  ch: 'mail', status: 'scheduled', sent: 0,    open: 0,    click: 0,    owner: 'RA', date: 'May 3',  audience: 'All contacts' },
  { id: 7, name: 'Reactivation · WA', ch: 'wa',   status: 'draft',     sent: 0,    open: 0,    click: 0,    owner: 'NK', date: '—',      audience: 'Churned 30d' },
]

const ChIcon: Record<string, (p: { size: number; className?: string }) => ReactElement> = { wa: I.wa, mail: I.mail, sms: I.phone }

function StatusPill({ status }: { status: string }) {
  if (status === 'sent')      return <span className="pill green"><I.check size={10} /> Sent</span>
  if (status === 'running')   return <span className="pill blue"><span className="dot pulse" style={{ background: '#22C55E' }} /> Running</span>
  if (status === 'scheduled') return <span className="pill amber"><I.clock size={10} /> Scheduled</span>
  return <span className="pill"><I.copy size={10} /> Draft</span>
}

function PerfBar({ v, max = 100, color = '#22C55E' }: { v: number; max?: number; color?: string }) {
  return (
    <div className="row gap-2" style={{ alignItems: 'center' }}>
      <div style={{ width: 60, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, (v / max) * 100)}%`, height: '100%', background: color }} />
      </div>
      <span className="mono" style={{ fontSize: 11 }}>{v}%</span>
    </div>
  )
}

function Stat({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="card flex-1" style={{ padding: '14px 18px' }}>
      <div className="muted-2" style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4, letterSpacing: '-0.02em' }}>{v}</div>
      <div className="muted-2" style={{ fontSize: 11 }}>{sub}</div>
    </div>
  )
}

export default function CampaignsPage() {
  const [camps, setCamps] = useState<Campaign[]>(INITIAL_CAMPS)
  const [channel, setChannel] = useState<'all' | 'mail' | 'wa' | 'sms'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newCamp, setNewCamp] = useState({ name: '', ch: 'mail', audience: '' })
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = camps.filter(c => {
    const matchCh = channel === 'all' || c.ch === channel
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.audience.toLowerCase().includes(search.toLowerCase())
    return matchCh && matchSearch
  })

  function handleCreate() {
    if (!newCamp.name.trim()) return
    const camp: Campaign = {
      id: Date.now(), name: newCamp.name, ch: newCamp.ch, status: 'draft',
      sent: 0, open: 0, click: 0, owner: 'RA',
      date: 'Today', audience: newCamp.audience || 'All contacts',
    }
    setCamps(prev => [camp, ...prev])
    setNewCamp({ name: '', ch: 'mail', audience: '' })
    setShowNew(false)
    showToast('Campaign created as draft')
  }

  function handleDuplicate(c: Campaign) {
    const dup: Campaign = { ...c, id: Date.now(), name: `${c.name} (copy)`, status: 'draft', sent: 0, open: 0, click: 0, date: 'Today' }
    setCamps(prev => [dup, ...prev])
    showToast('Campaign duplicated')
  }

  function handleDelete(id: number) {
    setCamps(prev => prev.filter(c => c.id !== id))
    setSelected(null)
    showToast('Campaign deleted')
  }

  function handleLaunch(id: number) {
    setCamps(prev => prev.map(c => c.id === id ? { ...c, status: 'running' } : c))
    setSelected(prev => prev ? { ...prev, status: 'running' } : prev)
    showToast('Campaign launched!')
  }

  function handlePause(id: number) {
    setCamps(prev => prev.map(c => c.id === id ? { ...c, status: 'scheduled' } : c))
    setSelected(prev => prev ? { ...prev, status: 'scheduled' } : prev)
    showToast('Campaign paused')
  }

  return (
    <>
      <Topbar
        title="Campaigns"
        subtitle={`${camps.length} campaigns · ${camps.filter(c => c.status === 'running').length} running`}
        actions={<>
          <button className="btn"><I.filter size={13} /> Filter</button>
          <button className="btn"><I.copy size={13} /> Templates</button>
          <button className="btn primary" onClick={() => setShowNew(true)}><I.plus size={14} /> New campaign</button>
        </>}
      />
      <div className="page">
        <div className="row gap-3" style={{ marginBottom: 14 }}>
          <Stat label="Sent (30d)" v="48,210" sub="+22.0%" />
          <Stat label="Avg open"  v="42.1%"  sub="vs 38.6%" />
          <Stat label="Avg click" v="11.4%"  sub="vs 9.8%" />
          <Stat label="Revenue"   v="₹14.2L" sub="attributed" />
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="row gap-2" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <div className="row gap-1 segment">
              {(['all','mail','wa','sms'] as const).map(ch => (
                <button key={ch} className={`seg-btn${channel === ch ? ' active' : ''}`} onClick={() => setChannel(ch)}>
                  {ch === 'all' ? 'All' : ch === 'mail' ? 'Email' : ch === 'wa' ? 'WhatsApp' : 'SMS'}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="input-icon">
              <I.search size={13} />
              <input className="input" placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
            </div>
            {search && <button className="icon-btn" onClick={() => setSearch('')}><I.x size={12} /></button>}
          </div>

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Campaign</th><th>Channel</th><th>Status</th>
                <th>Sent</th><th>Open</th><th>Click</th>
                <th>Owner</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No campaigns match your search</td></tr>
              ) : filtered.map(c => {
                const Ch = ChIcon[c.ch]
                return (
                  <tr key={c.id} style={{ cursor: 'pointer' }} className={selected?.id === c.id ? 'row-active' : ''} onClick={() => setSelected(c)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div className="row gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Ch size={14} className="muted" />
                        </div>
                        <div className="col" style={{ lineHeight: 1.3 }}>
                          <span style={{ fontWeight: 500 }}>{c.name}</span>
                          <span className="muted-2" style={{ fontSize: 11 }}>{c.audience}</span>
                        </div>
                      </div>
                    </td>
                    <td className="muted" style={{ textTransform: 'capitalize' }}>{c.ch === 'wa' ? 'WhatsApp' : c.ch === 'mail' ? 'Email' : 'SMS'}</td>
                    <td><StatusPill status={c.status} /></td>
                    <td className="mono">{c.sent ? c.sent.toLocaleString() : '—'}</td>
                    <td>{c.open ? <PerfBar v={c.open} /> : <span className="muted-2">—</span>}</td>
                    <td>{c.click ? <PerfBar v={c.click} max={30} color="#A78BFA" /> : <span className="muted-2">—</span>}</td>
                    <td><div className="avatar sm" style={{ background: '#374151' }}>{c.owner}</div></td>
                    <td className="muted">{c.date}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="row gap-1">
                        <button className="icon-btn" title="Duplicate" onClick={() => handleDuplicate(c)}><I.copy size={13} /></button>
                        <button className="icon-btn"><I.more size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign detail panel */}
      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-header">
            <div className="col flex-1" style={{ gap: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{selected.name}</div>
              <div className="row gap-2">
                <StatusPill status={selected.status} />
                <span className="muted-2" style={{ fontSize: 11 }}>{selected.ch === 'wa' ? 'WhatsApp' : selected.ch === 'mail' ? 'Email' : 'SMS'}</span>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setSelected(null)}><I.x size={14} /></button>
          </div>

          <div className="detail-section">
            <div className="row gap-2">
              {selected.status === 'draft' || selected.status === 'scheduled' ? (
                <button className="btn sm primary" style={{ flex: 1 }} onClick={() => handleLaunch(selected.id)}><I.send size={12} /> Launch</button>
              ) : selected.status === 'running' ? (
                <button className="btn sm" style={{ flex: 1 }} onClick={() => handlePause(selected.id)}><I.pause size={12} /> Pause</button>
              ) : null}
              <button className="btn sm" style={{ flex: 1 }} onClick={() => handleDuplicate(selected)}><I.copy size={12} /> Duplicate</button>
              <button className="btn sm ghost" onClick={() => handleDelete(selected.id)}><I.x size={12} /></button>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Performance</div>
            <div className="detail-row"><span>Sent</span><span className="mono">{selected.sent ? selected.sent.toLocaleString() : '—'}</span></div>
            <div className="detail-row"><span>Open rate</span><span>{selected.open ? `${selected.open}%` : '—'}</span></div>
            <div className="detail-row"><span>Click rate</span><span>{selected.click ? `${selected.click}%` : '—'}</span></div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Details</div>
            <div className="detail-row"><span>Audience</span><span>{selected.audience}</span></div>
            <div className="detail-row"><span>Owner</span><span>{selected.owner}</span></div>
            <div className="detail-row"><span>Date</span><span>{selected.date}</span></div>
          </div>
        </div>
      )}

      {/* New campaign modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>New Campaign</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowNew(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="form-field">
                <label>Campaign name *</label>
                <input className="input" value={newCamp.name} onChange={e => setNewCamp({ ...newCamp, name: e.target.value })} placeholder="e.g. May Newsletter" />
              </div>
              <div className="form-field">
                <label>Channel</label>
                <select value={newCamp.ch} onChange={e => setNewCamp({ ...newCamp, ch: e.target.value })}>
                  <option value="mail">Email</option>
                  <option value="wa">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div className="form-field">
                <label>Audience / segment</label>
                <input className="input" value={newCamp.audience} onChange={e => setNewCamp({ ...newCamp, audience: e.target.value })} placeholder="e.g. Hot leads — May" />
              </div>
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn primary" onClick={handleCreate}><I.plus size={13} /> Create campaign</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
