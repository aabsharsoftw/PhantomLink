'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Workflow = {
  id: number; name: string; status: 'draft' | 'published'
  totalEnrolled: number; activeEnrolled: number
  lastUpdated: string; createdOn: string
}

const INITIAL_WORKFLOWS: Workflow[] = [
  { id: 1, name: 'Copy - SMS-Broadnet Integration Promotional (PHANPRO)', status: 'draft',     totalEnrolled: 15,   activeEnrolled: 0, lastUpdated: 'Mar 31, 6:15 PM', createdOn: 'Mar 24, 3:33 PM' },
  { id: 2, name: 'New vs Existing User Flow : 1773304256148',             status: 'draft',     totalEnrolled: 0,    activeEnrolled: 0, lastUpdated: 'Mar 31, 5:15 PM', createdOn: 'Mar 12, 12:30 PM' },
  { id: 3, name: 'PhantomPulse WhatsApp Support CPS vs Public',           status: 'draft',     totalEnrolled: 14,   activeEnrolled: 0, lastUpdated: 'Mar 31, 6:14 PM', createdOn: 'Mar 31, 2:50 PM' },
  { id: 4, name: 'Recipe - WhatsApp Delivery Status',                     status: 'draft',     totalEnrolled: 0,    activeEnrolled: 0, lastUpdated: 'Feb 23, 11:22 PM',createdOn: 'Feb 23, 11:22 PM' },
  { id: 5, name: 'SMS-Broadnet Integration Promotional (PHANTRR)',        status: 'draft',     totalEnrolled: 2127, activeEnrolled: 0, lastUpdated: 'Mar 31, 6:15 PM', createdOn: 'Feb 23, 10:07 PM' },
  { id: 6, name: 'STEP 1: Support Form Submitted',                        status: 'published', totalEnrolled: 1,    activeEnrolled: 0, lastUpdated: 'Feb 25, 7:58 PM', createdOn: 'Feb 25, 7:58 PM' },
  { id: 7, name: 'Telephony-UAE',                                         status: 'draft',     totalEnrolled: 0,    activeEnrolled: 0, lastUpdated: 'Feb 23, 11:35 PM',createdOn: 'Feb 23, 11:32 PM' },
]

// ─── Workflow Builder (existing canvas UI) ─────────────────────────────────────

const NODES = [
  { id: 'trg',  type: 'trigger',   x: 40,   y: 200, title: 'Form submitted',       sub: 'website / pricing-page',    icon: 'spark',    color: '#F59E0B' },
  { id: 'wait', type: 'delay',     x: 280,  y: 200, title: 'Wait 2 hours',          sub: 'business hours · IST',      icon: 'clock',    color: '#6C7187' },
  { id: 'cond', type: 'condition', x: 520,  y: 200, title: 'If contact.score ≥ 70', sub: 'Lead scoring rule',         icon: 'branch',   color: '#A78BFA' },
  { id: 'wa',   type: 'action',    x: 780,  y: 80,  title: 'Send WhatsApp',         sub: 'tmpl: sales-intro-v2',      icon: 'wa',       color: '#22C55E' },
  { id: 'task', type: 'action',    x: 1040, y: 80,  title: 'Create task',           sub: 'Owner: round-robin sales',  icon: 'check',    color: '#3B82F6' },
  { id: 'mail', type: 'action',    x: 780,  y: 320, title: 'Send email',            sub: 'campaign: nurture-day-1',   icon: 'mail',     color: '#6366F1' },
  { id: 'tag',  type: 'action',    x: 1040, y: 320, title: 'Add tag',               sub: '#newsletter, #cold-lead',   icon: 'tag',      color: '#EC4899' },
  { id: 'end',  type: 'end',       x: 1300, y: 200, title: 'End',                   sub: 'Continue in CRM',           icon: 'flag',     color: '#6C7187' },
]

const EDGES = [
  { from: 'trg',  to: 'wait' },
  { from: 'wait', to: 'cond' },
  { from: 'cond', to: 'wa',   label: 'Yes', color: '#22C55E' },
  { from: 'cond', to: 'mail', label: 'No',  color: '#EF4444' },
  { from: 'wa',   to: 'task' },
  { from: 'mail', to: 'tag' },
  { from: 'task', to: 'end' },
  { from: 'tag',  to: 'end' },
]

const NODE_W = 200, NODE_H = 80

function edgePath(a: typeof NODES[0], b: typeof NODES[0]) {
  const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2
  const x2 = b.x,           y2 = b.y + NODE_H / 2
  const mx = (x1 + x2) / 2
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
}

function PaletteItem({ label, icon, color }: { label: string; icon: string; color: string }) {
  const Ic = I[icon]
  return (
    <div className="palette-node">
      <div style={{ width: 24, height: 24, borderRadius: 6, background: `color-mix(in srgb, ${color} 18%, transparent)`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic size={12} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
      <div className="flex-1" />
      <I.drag size={12} className="muted-2" />
    </div>
  )
}

function WorkflowBuilder({ workflow, onBack }: { workflow: Workflow | null; onBack: () => void }) {
  const [wfName, setWfName] = useState(workflow?.name ?? 'Untitled workflow')
  const [editName, setEditName] = useState(false)
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Builder topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 52, borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
        <button className="btn ghost" onClick={onBack} style={{ fontSize: 12, gap: 6, flexShrink: 0 }}>← Workflows</button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {editName ? (
            <input
              autoFocus value={wfName}
              onChange={e => setWfName(e.target.value)}
              onBlur={() => setEditName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditName(false)}
              style={{ background: 'transparent', border: '1px solid var(--accent)', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'center', minWidth: 260 }}
            />
          ) : (
            <button onClick={() => setEditName(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontSize: 13, fontWeight: 600, padding: '4px 8px', borderRadius: 6 }}>
              {wfName} <I.pencil size={12} className="muted-2" />
            </button>
          )}
        </div>
        <div className="row gap-2">
          <span className="pill green"><span className="dot" style={{ background: '#22C55E' }} /> Live</span>
          <button className="btn"><I.flow size={13} /> Test run</button>
          <button className="btn"><I.history size={13} /> History</button>
          <button className="btn primary"><I.check size={14} /> Publish changes</button>
        </div>
      </div>

      {/* Builder body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr 280px', overflow: 'hidden' }}>

        {/* Palette */}
        <aside className="builder-rail">
          <div className="ctx-label" style={{ padding: '10px 12px 6px' }}>Triggers</div>
          {[
            { label: 'Form submitted',     icon: 'spark',    color: '#F59E0B' },
            { label: 'Tag added',          icon: 'tag',      color: '#EC4899' },
            { label: 'Deal stage changed', icon: 'pipeline', color: '#22C55E' },
            { label: 'Email opened',       icon: 'mail',     color: '#6366F1' },
            { label: 'Schedule',           icon: 'clock',    color: '#6C7187' },
          ].map(p => <PaletteItem key={p.label} {...p} />)}

          <div className="ctx-label" style={{ padding: '14px 12px 6px' }}>Actions</div>
          {[
            { label: 'Send email',      icon: 'mail',     color: '#6366F1' },
            { label: 'Send WhatsApp',   icon: 'wa',       color: '#22C55E' },
            { label: 'Send SMS',        icon: 'phone',    color: '#F59E0B' },
            { label: 'Create task',     icon: 'check',    color: '#3B82F6' },
            { label: 'Update contact',  icon: 'contact',  color: '#A78BFA' },
            { label: 'Move deal stage', icon: 'pipeline', color: '#22C55E' },
            { label: 'Webhook',         icon: 'link',     color: '#6C7187' },
          ].map(p => <PaletteItem key={p.label} {...p} />)}

          <div className="ctx-label" style={{ padding: '14px 12px 6px' }}>Logic</div>
          {[
            { label: 'If / else',  icon: 'branch', color: '#A78BFA' },
            { label: 'Wait',       icon: 'clock',  color: '#6C7187' },
            { label: 'Split test', icon: 'split',  color: '#3B82F6' },
            { label: 'Goal',       icon: 'flag',   color: '#22C55E' },
          ].map(p => <PaletteItem key={p.label} {...p} />)}
        </aside>

        {/* Canvas */}
        <div className="builder-canvas">
          <div className="builder-toolbar">
            <button className="icon-btn"><I.zoomIn size={13} /></button>
            <button className="icon-btn"><I.zoomOut size={13} /></button>
            <span className="muted-2" style={{ fontSize: 11 }}>62%</span>
            <div style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 4px' }} />
            <button className="icon-btn"><I.undo size={13} /></button>
            <button className="icon-btn"><I.redo size={13} /></button>
            <div className="flex-1" />
            <span className="muted-2" style={{ fontSize: 11 }}>Last edit · 6 min ago by Aman</span>
          </div>
          <div className="builder-stage">
            <svg width="1500" height="500" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <defs>
                <marker id="arr"   viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-3)" /></marker>
                <marker id="arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#22C55E" /></marker>
                <marker id="arr-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#EF4444" /></marker>
              </defs>
              {EDGES.map((e, i) => {
                const a = nodeMap[e.from], b = nodeMap[e.to]
                if (!a || !b) return null
                const stroke = e.color || 'var(--text-3)'
                const marker = e.color === '#22C55E' ? 'arr-g' : e.color === '#EF4444' ? 'arr-r' : 'arr'
                const mid = { x: (a.x + NODE_W + b.x) / 2, y: (a.y + NODE_H / 2 + b.y + NODE_H / 2) / 2 }
                return (
                  <g key={i}>
                    <path d={edgePath(a, b)} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray={e.label ? '4 3' : 'none'} markerEnd={`url(#${marker})`} />
                    {e.label && (
                      <g>
                        <rect x={mid.x - 16} y={mid.y - 9} width="32" height="18" rx="9" fill="var(--surface)" stroke={stroke} />
                        <text x={mid.x} y={mid.y + 3} textAnchor="middle" fontSize="10" fill={stroke} fontWeight="600">{e.label}</text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
            {NODES.map(n => {
              const Ic = I[n.icon]
              return (
                <div key={n.id} className={`flow-node ${n.type}`} style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}>
                  <div className="flow-node-dot in" />
                  <div className="row gap-2" style={{ padding: '10px 12px', alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `color-mix(in srgb, ${n.color} 18%, transparent)`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Ic size={15} />
                    </div>
                    <div className="col" style={{ minWidth: 0, gap: 2 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }} className="truncate">{n.title}</div>
                      <div className="muted-2 truncate" style={{ fontSize: 10.5 }}>{n.sub}</div>
                    </div>
                  </div>
                  <div className="flow-node-type">{n.type}</div>
                  {n.type !== 'end' && <div className="flow-node-dot out" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Inspector */}
        <aside style={{ borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="row gap-2">
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'color-mix(in srgb, #22C55E 18%, transparent)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.wa size={13} /></div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Send WhatsApp</span>
            </div>
            <div className="muted-2" style={{ fontSize: 11, marginTop: 4 }}>Action · uses 1 conversation per send</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div className="ctx-label" style={{ padding: '0 0 6px' }}>Template</div>
            <div className="select-display">
              <div className="col" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>sales-intro-v2</span>
                <span className="muted-2" style={{ fontSize: 11 }}>Approved · marketing · en_IN</span>
              </div>
              <I.chevD size={13} className="muted-2" />
            </div>
            <div className="ctx-label" style={{ padding: '12px 0 6px' }}>Variables</div>
            <div className="col gap-2">
              <div className="var-row"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{'{{1}}'}</span><span className="pill blue">contact.first_name</span></div>
              <div className="var-row"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{'{{2}}'}</span><span className="pill blue">deal.value_inr</span></div>
            </div>
            <div className="ctx-label" style={{ padding: '12px 0 6px' }}>Send window</div>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              <span className="pill">9:00 → 19:00 IST</span>
              <span className="pill">Mon – Sat</span>
            </div>
            <div className="ctx-label" style={{ padding: '12px 0 6px' }}>Fallback</div>
            <label className="row gap-2" style={{ fontSize: 12, color: 'var(--text-2)' }}><input type="checkbox" defaultChecked /> If WhatsApp fails, send Email</label>
            <label className="row gap-2" style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}><input type="checkbox" /> Skip if last contact &lt; 24h</label>
            <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0', paddingTop: 14 }}>
              <div className="ctx-label" style={{ padding: '0 0 6px' }}>Stats (last 30d)</div>
              <div className="row gap-3" style={{ fontSize: 11 }}>
                <div className="col"><span className="muted-2">Sent</span><span style={{ fontSize: 16, fontWeight: 600 }}>1,820</span></div>
                <div className="col"><span className="muted-2">Read</span><span style={{ fontSize: 16, fontWeight: 600 }}>92.1%</span></div>
                <div className="col"><span className="muted-2">Reply</span><span style={{ fontSize: 16, fontWeight: 600 }}>14.2%</span></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ─── Main Automation Page (Workflow List) ─────────────────────────────────────

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [view, setView] = useState<'list' | 'builder'>('list')
  const [activeWf, setActiveWf] = useState<Workflow | null>(null)
  const [topTab, setTopTab] = useState<'workflows' | 'overview' | 'settings'>('workflows')
  const [listTab, setListTab] = useState<'all' | 'review' | 'deleted'>('all')
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  function openBuilder(wf: Workflow | null) { setActiveWf(wf); setView('builder') }

  function handleCreate() {
    if (!newName.trim()) return
    const wf: Workflow = {
      id: Date.now(), name: newName.trim(), status: 'draft',
      totalEnrolled: 0, activeEnrolled: 0,
      lastUpdated: 'Just now', createdOn: 'Just now',
    }
    setWorkflows(prev => [wf, ...prev])
    setNewName('')
    setShowNew(false)
    openBuilder(wf)
  }

  function handleDelete(id: number) {
    setWorkflows(prev => prev.filter(w => w.id !== id))
    showToast('Workflow deleted')
  }

  function handleToggleStatus(id: number) {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'published' ? 'draft' : 'published' } : w))
  }

  const filtered = workflows.filter(w => {
    if (listTab === 'deleted') return false
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Builder view
  if (view === 'builder') {
    return <WorkflowBuilder workflow={activeWf} onBack={() => { setView('list'); setActiveWf(null) }} />
  }

  return (
    <>
      <Topbar
        title="Automation"
        actions={<>
          <button className="btn ghost" style={{ fontSize: 12 }}>What&apos;s new</button>
          <button className="btn" style={{ background: 'color-mix(in srgb, #6366F1 15%, transparent)', color: '#A78BFA', borderColor: 'rgba(99,102,241,.3)', fontSize: 12 }}>Automation Updates</button>
        </>}
      />

      {/* Secondary tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--border)', background: 'var(--surface)', paddingLeft: 24, flexShrink: 0 }}>
        {([
          { key: 'workflows', label: 'Workflows' },
          { key: 'overview',  label: 'Overview', tag: 'Beta' },
          { key: 'settings',  label: 'Global Workflow Settings' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTopTab(t.key)}
            style={{
              padding: '10px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13,
              fontWeight: topTab === t.key ? 600 : 400,
              color: topTab === t.key ? 'var(--text)' : 'var(--text-3)',
              borderBottom: `2px solid ${topTab === t.key ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            {'tag' in t && <span style={{ fontSize: 9, fontWeight: 700, background: '#6366F1', color: '#fff', borderRadius: 3, padding: '1px 4px', letterSpacing: '.03em' }}>BETA</span>}
          </button>
        ))}
      </div>

      <div className="page">

        {topTab === 'workflows' && (
          <>
            {/* Page header */}
            <div className="row gap-3" style={{ marginBottom: 20, alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Workflow List</h2>
              <div className="flex-1" />
              <button className="btn"><I.doc size={13} /> Create Folder</button>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', color: '#fff', border: 'none' }}
                onClick={() => { setNewName('AI-generated workflow'); openBuilder({ id: Date.now(), name: 'AI-generated workflow', status: 'draft', totalEnrolled: 0, activeEnrolled: 0, lastUpdated: 'Just now', createdOn: 'Just now' }) }}
              >
                <I.spark size={13} /> Build using AI
              </button>
              <button className="btn primary" onClick={() => setShowNew(true)}><I.plus size={14} /> Create Workflow</button>
            </div>

            {/* Sub-tabs + toolbar */}
            <div className="row gap-2" style={{ marginBottom: 14, alignItems: 'center' }}>
              <div className="row gap-1 segment">
                <button className={`seg-btn${listTab === 'all' ? ' active' : ''}`} onClick={() => setListTab('all')}>All Workflows</button>
                <button className={`seg-btn${listTab === 'review' ? ' active' : ''}`} onClick={() => setListTab('review')}>Needs Review <span className="muted-2">(0)</span></button>
                <button className={`seg-btn${listTab === 'deleted' ? ' active' : ''}`} onClick={() => setListTab('deleted')}>Deleted</button>
              </div>
              <button className="btn sm ghost"><I.plus size={11} /> New Smart List</button>
              <div className="flex-1" />
              <button className="btn sm ghost"><I.filter size={11} /> Advanced Filters</button>
              <div className="row gap-1" style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                {(['clock','clock','list'] as const).map((ic, i) => {
                  const Ic = I[ic]
                  return <button key={i} className="icon-btn" style={{ borderRadius: 0, width: 30, height: 30 }}><Ic size={13} /></button>
                })}
              </div>
              <div className="input-icon">
                <I.search size={13} />
                <input className="input" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
              </div>
              <button className="btn sm ghost"><I.list size={11} /> Customize List</button>
            </div>

            {/* Workflow table */}
            <div className="card" style={{ padding: 0 }}>
              {/* Folder breadcrumb */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
                Home
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}><input type="checkbox" /></th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Total Enrolled</th>
                    <th>Active Enrolled</th>
                    <th>Last Updated</th>
                    <th>Created On</th>
                    <th style={{ width: 60 }}>Stats</th>
                    <th style={{ width: 32 }}></th>
                    <th style={{ width: 32 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-3)' }}>
                        {listTab === 'deleted' ? 'No deleted workflows' : search ? 'No workflows match your search' : 'No workflows yet'}
                      </td>
                    </tr>
                  ) : filtered.map(w => (
                    <tr key={w.id} style={{ cursor: 'pointer' }} onClick={() => openBuilder(w)}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td>
                        <div className="row gap-2">
                          <span style={{ fontWeight: 500, fontSize: 13 }}>{w.name}</span>
                          <I.ext size={12} className="muted-2" style={{ flexShrink: 0 }} />
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleStatus(w.id)}
                          className={`pill${w.status === 'published' ? ' green' : ''}`}
                          style={{ cursor: 'pointer', border: 'none', fontWeight: 600 }}
                        >
                          {w.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td>
                        {w.totalEnrolled > 0
                          ? <span style={{ color: 'var(--accent-2)', fontWeight: 500, fontSize: 13 }}>{w.totalEnrolled.toLocaleString()}</span>
                          : <span style={{ color: '#3B82F6', fontWeight: 500, fontSize: 13 }}>0</span>
                        }
                      </td>
                      <td>
                        <span style={{ color: '#3B82F6', fontWeight: 500, fontSize: 13 }}>{w.activeEnrolled}</span>
                      </td>
                      <td className="muted" style={{ fontSize: 12 }}>{w.lastUpdated}</td>
                      <td className="muted" style={{ fontSize: 12 }}>{w.createdOn}</td>
                      <td>
                        <I.chevR size={14} className="muted-2" />
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="icon-btn" onClick={() => handleDelete(w.id)}><I.more size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="row gap-2" style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button className="btn sm ghost">Previous</button>
                <span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>1</span>
                <button className="btn sm ghost">Next</button>
                <select style={{ marginLeft: 8, background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
                  <option>25 / page</option>
                  <option>50 / page</option>
                  <option>100 / page</option>
                </select>
              </div>
            </div>
          </>
        )}

        {topTab === 'overview' && (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <I.chart size={28} className="muted-2" style={{ display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 600, fontSize: 15 }}>Automation Overview</div>
            <div className="muted-2" style={{ fontSize: 13, marginTop: 6 }}>Aggregate stats across all workflows — coming soon.</div>
          </div>
        )}

        {topTab === 'settings' && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Global Workflow Settings</div>
            <div className="col gap-4">
              {[
                { label: 'Allow contacts to re-enter workflows', desc: 'Contacts who have completed a workflow can enter it again if triggered.' },
                { label: 'Stop on unsubscribe', desc: 'Automatically remove contacts from active workflows when they unsubscribe.' },
                { label: 'Business hours only', desc: 'Delay all actions to run only during configured business hours.' },
              ].map(s => (
                <div key={s.label} className="row gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.label}</div>
                    <div className="muted-2" style={{ fontSize: 12, marginTop: 2 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New workflow modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-card" style={{ width: 460 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>Create Workflow</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowNew(false)}><I.x size={14} /></button>
            </div>
            <div className="form-field" style={{ marginBottom: 20 }}>
              <label>Workflow name *</label>
              <input
                className="input" autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Welcome series · pricing form"
              />
            </div>
            <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn primary" onClick={handleCreate}><I.plus size={13} /> Create &amp; open builder</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
