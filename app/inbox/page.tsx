'use client'

import { ReactElement } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const convs = [
  { id: 1, name: 'Sana Iqbal',   ch: 'wa',   last: 'Got it, thanks! Will the trial extend automatically?', t: '2m',  unread: 2, status: 'open',     tag: 'hot-lead',   avatar: 'SI', color: '#A78BFA', active: true },
  { id: 2, name: 'Rohit Menon',  ch: 'mail', last: 'Forwarding the procurement contact — please loop them in', t: '14m', unread: 1, status: 'open',     tag: 'enterprise', avatar: 'RM', color: '#3B82F6' },
  { id: 3, name: 'Aditi Rao',    ch: 'sms',  last: 'YES', t: '1h', unread: 0, status: 'open',     tag: 'demo-booked', avatar: 'AR', color: '#22C55E' },
  { id: 4, name: 'Faraz Khan',   ch: 'wa',   last: 'Can we move the call to Friday 4pm IST?', t: '2h', unread: 0, status: 'snooze', tag: 'enterprise', avatar: 'FK', color: '#EC4899' },
  { id: 5, name: 'Karan Bhatt',  ch: 'mail', last: 'Re: Pricing — see attached deck', t: '3h', unread: 0, status: 'open', tag: 'trial', avatar: 'KB', color: '#14B8A6' },
  { id: 6, name: 'Lina Pereira', ch: 'wa',   last: '¡Perfecto! Mañana firmamos.', t: '5h', unread: 0, status: 'resolved', tag: 'intl', avatar: 'LP', color: '#F59E0B' },
  { id: 7, name: 'Meera Iyer',   ch: 'sms',  last: 'STOP', t: '6h', unread: 0, status: 'resolved', tag: 'opted-out', avatar: 'MI', color: '#6C7187' },
  { id: 8, name: 'Vikram Shah',  ch: 'mail', last: 'Looks good — a few line edits inline', t: '1d', unread: 0, status: 'open', tag: 'hot-lead', avatar: 'VS', color: '#6366F1' },
]

const ChIcon: Record<string, (p: { size: number }) => ReactElement> = { wa: I.wa, mail: I.mail, sms: I.phone }
const chColor: Record<string, string> = { wa: '#22C55E', mail: '#6366F1', sms: '#F59E0B' }

const thread = [
  { from: 'them', ch: 'wa', t: 'Yesterday 4:42pm', body: 'Hi! I just signed up for the trial — quick question on the WhatsApp limits.' },
  { from: 'us',   ch: 'wa', t: 'Yesterday 4:48pm', body: 'Hey Sana — happy to help. On the Pro plan you get 10K WA conversations / month included, and we bill ₹0.42 per extra conversation.' },
  { from: 'them', ch: 'wa', t: 'Yesterday 5:01pm', body: 'Perfect. And template approval — typical turnaround?' },
  { from: 'us',   ch: 'wa', t: 'Today 9:12am',     body: 'Meta usually replies within 24–48 hours. We auto-resync as soon as approval lands.' },
  { from: 'note', who: 'Aman D.', t: 'Today 9:18am', body: '@Riya — heads-up, Sana mentioned 3 sub-brands. Worth flagging in CRM as multi-brand.' },
  { from: 'them', ch: 'wa', t: 'Today 9:32am',     body: 'Got it, thanks! Will the trial extend automatically?' },
]

export default function InboxPage() {
  return (
    <>
      <Topbar
        title="Conversations"
        subtitle="23 open · 4 assigned to you"
        actions={<>
          <button className="btn"><I.filter size={13} /> Filter</button>
          <button className="btn primary"><I.plus size={14} /> New message</button>
        </>}
      />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '320px 1fr 280px', overflow: 'hidden', height: '100%' }}>
        {/* Conversation list */}
        <aside style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="row gap-1" style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <button className="seg-btn active" style={{ padding: '4px 9px', fontSize: 11 }}>All <span className="muted-2">23</span></button>
            <button className="seg-btn" style={{ padding: '4px 9px', fontSize: 11 }}>Mine <span className="muted-2">4</span></button>
            <button className="seg-btn" style={{ padding: '4px 9px', fontSize: 11 }}>Unread <span className="muted-2">7</span></button>
            <div className="flex-1" />
            <button className="icon-btn" style={{ width: 24, height: 24 }}><I.search size={13} /></button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {convs.map(c => {
              const Ch = ChIcon[c.ch]
              return (
                <div key={c.id} className={`conv-row${c.active ? ' active' : ''}`}>
                  <div className="avatar md" style={{ background: c.color, position: 'relative' }}>
                    {c.avatar}
                    <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chColor[c.ch] }}>
                      <Ch size={9} />
                    </span>
                  </div>
                  <div className="col flex-1" style={{ minWidth: 0, gap: 2 }}>
                    <div className="row gap-2">
                      <span style={{ fontWeight: c.unread ? 600 : 500, fontSize: 13 }} className="truncate flex-1">{c.name}</span>
                      <span className="muted-2" style={{ fontSize: 10 }}>{c.t}</span>
                    </div>
                    <div className="row gap-2">
                      <span className="truncate flex-1 muted" style={{ fontSize: 12, color: c.unread ? 'var(--text)' : 'var(--text-3)' }}>{c.last}</span>
                      {c.unread > 0 && <span className="nav-badge" style={{ fontSize: 9, padding: '0 5px' }}>{c.unread}</span>}
                    </div>
                    <div className="row gap-1">
                      <span className="tag-chip" style={{ fontSize: 10 }}>#{c.tag}</span>
                      {c.status === 'snooze' && <span className="pill amber" style={{ fontSize: 10 }}><I.clock size={9} /> Snoozed</span>}
                      {c.status === 'resolved' && <span className="pill green" style={{ fontSize: 10 }}><I.check size={9} /> Resolved</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Active thread */}
        <section className="col" style={{ minHeight: 0 }}>
          <div className="row gap-3" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
            <div className="avatar lg" style={{ background: '#A78BFA' }}>SI</div>
            <div className="col flex-1" style={{ lineHeight: 1.3 }}>
              <div className="row gap-2">
                <span style={{ fontWeight: 600, fontSize: 14 }}>Sana Iqbal</span>
                <span className="pill green"><I.wa size={10} /> WhatsApp</span>
                <span className="tag-chip">#hot-lead</span>
              </div>
              <div className="muted-2" style={{ fontSize: 11 }}>+91 98103 22018 · Levanta · Owner Riya A.</div>
            </div>
            <button className="btn"><I.user size={13} /> Assign</button>
            <button className="btn"><I.clock size={13} /> Snooze</button>
            <button className="btn primary"><I.check size={14} /> Resolve</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', background: 'var(--bg)' }}>
            {thread.map((m, i) => {
              if (m.from === 'note') return (
                <div key={i} className="note-bubble">
                  <div className="row gap-2" style={{ fontSize: 11 }}><I.pin size={11} /> Internal note · {m.who} · {m.t}</div>
                  <div style={{ marginTop: 4, fontSize: 12.5 }}>{m.body}</div>
                </div>
              )
              const us = m.from === 'us'
              return (
                <div key={i} className={`msg ${us ? 'us' : 'them'}`}>
                  {!us && <div className="avatar sm" style={{ background: '#A78BFA' }}>SI</div>}
                  <div className="col" style={{ gap: 3, alignItems: us ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div className={`bubble ${us ? 'us' : 'them'}`}>{m.body}</div>
                    <div className="muted-2" style={{ fontSize: 10 }}>{m.t} {us && '· delivered'}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="composer">
            <div className="row gap-2" style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>
              <button className="seg-btn active" style={{ fontSize: 11 }}><I.wa size={11} /> WhatsApp</button>
              <button className="seg-btn" style={{ fontSize: 11 }}><I.mail size={11} /> Email</button>
              <button className="seg-btn" style={{ fontSize: 11 }}><I.phone size={11} /> SMS</button>
              <div className="flex-1" />
              <button className="seg-btn" style={{ fontSize: 11 }}><I.paper size={11} /> Templates</button>
              <button className="seg-btn" style={{ fontSize: 11 }}>/ Canned</button>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)', minHeight: 38 }}>
                Hi <span style={{ background: 'var(--accent-soft)', color: 'var(--accent-2)', padding: '1px 5px', borderRadius: 4 }}>{'{{first_name}}'}</span> — yes, your trial auto-extends to the Pro plan on May 12. Want me to send a recap?
              </div>
              <div className="row gap-1" style={{ marginTop: 10 }}>
                <button className="icon-btn"><I.attach size={14} /></button>
                <button className="icon-btn"><I.smile size={14} /></button>
                <button className="icon-btn"><I.tag size={14} /></button>
                <div className="flex-1" />
                <button className="btn ghost"><I.pin size={13} /> Add note</button>
                <button className="btn primary"><I.send size={13} /> Send</button>
              </div>
            </div>
          </div>
        </section>

        {/* Right context */}
        <aside style={{ borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '16px 14px' }}>
          <div className="col gap-2" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className="avatar xl" style={{ background: '#A78BFA' }}>SI</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>Sana Iqbal</div>
            <div className="muted" style={{ fontSize: 12 }}>Head of Growth · Levanta</div>
            <div className="row gap-1" style={{ marginTop: 4 }}>
              <button className="icon-btn"><I.mail size={13} /></button>
              <button className="icon-btn"><I.phone size={13} /></button>
              <button className="icon-btn"><I.wa size={13} /></button>
              <button className="icon-btn"><I.link size={13} /></button>
            </div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Details</div>
            <div className="ctx-row"><span>Email</span><span className="truncate" style={{ maxWidth: 140 }}>sana@levanta.io</span></div>
            <div className="ctx-row"><span>Phone</span><span>+91 98103 22018</span></div>
            <div className="ctx-row"><span>Source</span><span>Website · /pricing</span></div>
            <div className="ctx-row"><span>Created</span><span>Apr 28, 2026</span></div>
            <div className="ctx-row"><span>Owner</span><span>Riya Acharya</span></div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Tags</div>
            <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
              <span className="pill red">hot-lead</span>
              <span className="pill blue">mumbai</span>
              <span className="tag-chip">trial</span>
              <span className="tag-chip">+ add</span>
            </div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Linked deal</div>
            <div className="card" style={{ padding: 10 }}>
              <div className="row gap-2"><I.pipeline size={12} className="muted-2" /><span style={{ fontSize: 12, fontWeight: 500 }}>Levanta — annual</span></div>
              <div className="row gap-2" style={{ marginTop: 6 }}>
                <span className="pill violet">Qualified</span>
                <span className="mono" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>₹8,40,000</span>
              </div>
            </div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Recent activity</div>
            <div className="col gap-2" style={{ fontSize: 11 }}>
              <div className="row gap-2"><I.flow size={11} style={{ color: 'var(--violet)' }} /><span className="flex-1">Workflow &quot;Welcome series&quot; running</span><span className="muted-2">9:18am</span></div>
              <div className="row gap-2"><I.mail size={11} style={{ color: 'var(--accent)' }} /><span className="flex-1">Opened &quot;Pricing email v3&quot;</span><span className="muted-2">8:42am</span></div>
              <div className="row gap-2"><I.spark size={11} style={{ color: '#F59E0B' }} /><span className="flex-1">Form: pricing-page</span><span className="muted-2">Apr 28</span></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
