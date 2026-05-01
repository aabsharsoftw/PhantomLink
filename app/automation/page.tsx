'use client'

import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const nodes = [
  { id: 'trg',  type: 'trigger',   x: 40,   y: 200, title: 'Form submitted',      sub: 'website / pricing-page',       icon: 'spark',    color: '#F59E0B' },
  { id: 'wait', type: 'delay',     x: 280,  y: 200, title: 'Wait 2 hours',         sub: 'business hours · IST',          icon: 'clock',    color: '#6C7187' },
  { id: 'cond', type: 'condition', x: 520,  y: 200, title: 'If contact.score ≥ 70',sub: 'Lead scoring rule',            icon: 'branch',   color: '#A78BFA' },
  { id: 'wa',   type: 'action',    x: 780,  y: 80,  title: 'Send WhatsApp',        sub: 'tmpl: sales-intro-v2',          icon: 'wa',       color: '#22C55E' },
  { id: 'task', type: 'action',    x: 1040, y: 80,  title: 'Create task',          sub: 'Owner: round-robin sales',      icon: 'check',    color: '#3B82F6' },
  { id: 'mail', type: 'action',    x: 780,  y: 320, title: 'Send email',           sub: 'campaign: nurture-day-1',       icon: 'mail',     color: '#6366F1' },
  { id: 'tag',  type: 'action',    x: 1040, y: 320, title: 'Add tag',              sub: '#newsletter, #cold-lead',       icon: 'tag',      color: '#EC4899' },
  { id: 'end',  type: 'end',       x: 1300, y: 200, title: 'End',                  sub: 'Continue in CRM',              icon: 'flag',     color: '#6C7187' },
]

const edges = [
  { from: 'trg',  to: 'wait' },
  { from: 'wait', to: 'cond' },
  { from: 'cond', to: 'wa',   label: 'Yes', color: '#22C55E' },
  { from: 'cond', to: 'mail', label: 'No',  color: '#EF4444' },
  { from: 'wa',   to: 'task' },
  { from: 'mail', to: 'tag' },
  { from: 'task', to: 'end' },
  { from: 'tag',  to: 'end' },
]

function PaletteNode({ n, i, c }: { n: string; i: string; c: string }) {
  const Ic = I[i]
  return (
    <div className="palette-node">
      <div style={{ width: 24, height: 24, borderRadius: 6, background: `color-mix(in srgb, ${c} 18%, transparent)`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic size={12} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500 }}>{n}</span>
      <div className="flex-1" />
      <I.drag size={12} className="muted-2" />
    </div>
  )
}

const NODE_W = 200, NODE_H = 80

function path(a: typeof nodes[0], b: typeof nodes[0]) {
  const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2
  const x2 = b.x, y2 = b.y + NODE_H / 2
  const mx = (x1 + x2) / 2
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
}

export default function AutomationPage() {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <>
      <Topbar
        title="Welcome series — pricing form"
        breadcrumb={['Automations', 'Workflows']}
        actions={<>
          <span className="pill green"><span className="dot" style={{ background: '#22C55E' }} /> Live</span>
          <button className="btn"><I.flow size={13} /> Test run</button>
          <button className="btn"><I.history size={13} /> History</button>
          <button className="btn primary"><I.check size={14} /> Publish changes</button>
        </>}
      />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '240px 1fr 280px', overflow: 'hidden', height: '100%' }}>
        {/* Palette */}
        <aside className="builder-rail">
          <div className="ctx-label" style={{ padding: '10px 12px 6px' }}>Triggers</div>
          {[
            { n: 'Form submitted',     i: 'spark',    c: '#F59E0B' },
            { n: 'Tag added',          i: 'tag',      c: '#EC4899' },
            { n: 'Deal stage changed', i: 'pipeline', c: '#22C55E' },
            { n: 'Email opened',       i: 'mail',     c: '#6366F1' },
            { n: 'Schedule',           i: 'clock',    c: '#6C7187' },
          ].map(p => <PaletteNode key={p.n} {...p} />)}

          <div className="ctx-label" style={{ padding: '14px 12px 6px' }}>Actions</div>
          {[
            { n: 'Send email',      i: 'mail',     c: '#6366F1' },
            { n: 'Send WhatsApp',   i: 'wa',       c: '#22C55E' },
            { n: 'Send SMS',        i: 'phone',    c: '#F59E0B' },
            { n: 'Create task',     i: 'check',    c: '#3B82F6' },
            { n: 'Update contact',  i: 'contact',  c: '#A78BFA' },
            { n: 'Move deal stage', i: 'pipeline', c: '#22C55E' },
            { n: 'Webhook',         i: 'link',     c: '#6C7187' },
          ].map(p => <PaletteNode key={p.n} {...p} />)}

          <div className="ctx-label" style={{ padding: '14px 12px 6px' }}>Logic</div>
          {[
            { n: 'If / else',   i: 'branch', c: '#A78BFA' },
            { n: 'Wait',        i: 'clock',  c: '#6C7187' },
            { n: 'Split test',  i: 'split',  c: '#3B82F6' },
            { n: 'Goal',        i: 'flag',   c: '#22C55E' },
          ].map(p => <PaletteNode key={p.n} {...p} />)}
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
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--text-3)" />
                </marker>
                <marker id="arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="#22C55E" />
                </marker>
                <marker id="arr-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="#EF4444" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const a = nodeMap[e.from], b = nodeMap[e.to]
                if (!a || !b) return null
                const stroke = e.color || 'var(--text-3)'
                const marker = e.color === '#22C55E' ? 'arr-g' : e.color === '#EF4444' ? 'arr-r' : 'arr'
                const mid = { x: (a.x + NODE_W + b.x) / 2, y: (a.y + NODE_H / 2 + b.y + NODE_H / 2) / 2 }
                return (
                  <g key={i}>
                    <path d={path(a, b)} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray={e.label ? '4 3' : 'none'} markerEnd={`url(#${marker})`} />
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
            {nodes.map(n => {
              const Ic = I[n.icon]
              const selected = n.id === 'wa'
              return (
                <div key={n.id} className={`flow-node ${n.type}${selected ? ' selected' : ''}`} style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}>
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
              <div className="var-row">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{'{{1}}'}</span>
                <span className="pill blue">contact.first_name</span>
              </div>
              <div className="var-row">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{'{{2}}'}</span>
                <span className="pill blue">deal.value_inr</span>
              </div>
            </div>

            <div className="ctx-label" style={{ padding: '12px 0 6px' }}>Send window</div>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              <span className="pill">9:00 → 19:00 IST</span>
              <span className="pill">Mon – Sat</span>
            </div>

            <div className="ctx-label" style={{ padding: '12px 0 6px' }}>Fallback</div>
            <label className="row gap-2" style={{ fontSize: 12, color: 'var(--text-2)' }}>
              <input type="checkbox" defaultChecked /> If WhatsApp fails, send Email
            </label>
            <label className="row gap-2" style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
              <input type="checkbox" /> Skip if last contact &lt; 24h
            </label>

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
    </>
  )
}
