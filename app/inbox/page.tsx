'use client'

import { useState, useRef, useEffect, ReactElement } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Msg = { from: 'them' | 'us' | 'note'; ch?: string; t: string; body: string; who?: string }
type Conv = { id: number; name: string; ch: string; last: string; t: string; unread: number; status: string; tag: string; avatar: string; color: string; active?: boolean }

const INITIAL_CONVS: Conv[] = [
  { id: 1, name: 'Sana Iqbal',   ch: 'wa',   last: 'Got it, thanks! Will the trial extend automatically?', t: '2m',  unread: 2, status: 'open',     tag: 'hot-lead',    avatar: 'SI', color: '#A78BFA', active: true },
  { id: 2, name: 'Rohit Menon',  ch: 'mail', last: 'Forwarding the procurement contact — please loop them in', t: '14m', unread: 1, status: 'open',  tag: 'enterprise',  avatar: 'RM', color: '#3B82F6' },
  { id: 3, name: 'Aditi Rao',    ch: 'sms',  last: 'YES', t: '1h', unread: 0, status: 'open',     tag: 'demo-booked', avatar: 'AR', color: '#22C55E' },
  { id: 4, name: 'Faraz Khan',   ch: 'wa',   last: 'Can we move the call to Friday 4pm IST?', t: '2h', unread: 0, status: 'snooze', tag: 'enterprise', avatar: 'FK', color: '#EC4899' },
  { id: 5, name: 'Karan Bhatt',  ch: 'mail', last: 'Re: Pricing — see attached deck', t: '3h', unread: 0, status: 'open', tag: 'trial', avatar: 'KB', color: '#14B8A6' },
  { id: 6, name: 'Lina Pereira', ch: 'wa',   last: '¡Perfecto! Mañana firmamos.', t: '5h', unread: 0, status: 'resolved', tag: 'intl', avatar: 'LP', color: '#F59E0B' },
  { id: 7, name: 'Meera Iyer',   ch: 'sms',  last: 'STOP', t: '6h', unread: 0, status: 'resolved', tag: 'opted-out', avatar: 'MI', color: '#6C7187' },
  { id: 8, name: 'Vikram Shah',  ch: 'mail', last: 'Looks good — a few line edits inline', t: '1d', unread: 0, status: 'open', tag: 'hot-lead', avatar: 'VS', color: '#6366F1' },
]

const THREADS: Record<number, Msg[]> = {
  1: [
    { from: 'them', ch: 'wa', t: 'Yesterday 4:42pm', body: 'Hi! I just signed up for the trial — quick question on the WhatsApp limits.' },
    { from: 'us',   ch: 'wa', t: 'Yesterday 4:48pm', body: 'Hey Sana — happy to help. On the Pro plan you get 10K WA conversations / month included, and we bill ₹0.42 per extra conversation.' },
    { from: 'them', ch: 'wa', t: 'Yesterday 5:01pm', body: 'Perfect. And template approval — typical turnaround?' },
    { from: 'us',   ch: 'wa', t: 'Today 9:12am',     body: 'Meta usually replies within 24–48 hours. We auto-resync as soon as approval lands.' },
    { from: 'note', who: 'Aman D.', t: 'Today 9:18am', body: '@Riya — heads-up, Sana mentioned 3 sub-brands. Worth flagging in CRM as multi-brand.' },
    { from: 'them', ch: 'wa', t: 'Today 9:32am',     body: 'Got it, thanks! Will the trial extend automatically?' },
  ],
  2: [
    { from: 'us',   ch: 'mail', t: 'Yesterday 2:10pm', body: 'Hi Rohit, following up on the enterprise proposal we sent last week. Happy to walk your team through a live demo.' },
    { from: 'them', ch: 'mail', t: 'Yesterday 4:30pm', body: 'Thanks — we reviewed it internally. Our procurement team needs to be looped in before we move forward.' },
    { from: 'us',   ch: 'mail', t: 'Today 10:00am',    body: 'Of course! Could you share their contact or CC them on the next reply?' },
    { from: 'them', ch: 'mail', t: 'Today 10:14am',    body: 'Forwarding the procurement contact — please loop them in' },
  ],
  3: [
    { from: 'us',  ch: 'sms', t: 'Today 8:00am', body: 'Hi Aditi! Confirming your demo tomorrow at 11am IST. Reply YES to confirm or NO to reschedule.' },
    { from: 'them', ch: 'sms', t: 'Today 8:04am', body: 'YES' },
    { from: 'note', who: 'Riya A.', t: 'Today 8:05am', body: 'Demo confirmed. Prepped Orbital use-case deck. Joining link sent to aditi@orbital.tech.' },
  ],
  4: [
    { from: 'them', ch: 'wa', t: 'Today 11:00am', body: 'Hey, something came up — can we reschedule our Thursday call?' },
    { from: 'us',   ch: 'wa', t: 'Today 11:08am', body: 'Of course! What works best for you?' },
    { from: 'them', ch: 'wa', t: 'Today 11:12am', body: 'Can we move the call to Friday 4pm IST?' },
  ],
  5: [
    { from: 'us',   ch: 'mail', t: 'Apr 28 9:00am', body: 'Hi Karan, attached is our pricing breakdown for the growth plan. Let me know if you have questions.' },
    { from: 'them', ch: 'mail', t: 'Apr 28 3:30pm', body: 'Re: Pricing — see attached deck' },
    { from: 'note', who: 'Riya A.', t: 'Apr 28 4:00pm', body: 'Karan shared their current spend. They are on Mailchimp + Intercom. Migration ROI is strong — worth pushing.' },
  ],
  6: [
    { from: 'us',   ch: 'wa', t: 'Apr 25 10:00am', body: 'Hola Lina! Just checking in on the contract review.' },
    { from: 'them', ch: 'wa', t: 'Apr 25 6:10pm',  body: '¡Todo bien! Solo necesitamos la firma del director.' },
    { from: 'us',   ch: 'wa', t: 'Apr 26 9:00am',  body: 'Perfecto. Reenviaré el contrato hoy.' },
    { from: 'them', ch: 'wa', t: 'Apr 26 11:30am', body: '¡Perfecto! Mañana firmamos.' },
  ],
  7: [
    { from: 'us',  ch: 'sms', t: 'Apr 25 2:00pm', body: 'Hi Meera! Just a quick check-in on your subscription renewal.' },
    { from: 'them', ch: 'sms', t: 'Apr 25 2:03pm', body: 'STOP' },
    { from: 'note', who: 'System', t: 'Apr 25 2:03pm', body: 'Contact opted out of SMS. Unsubscribed from all SMS campaigns.' },
  ],
  8: [
    { from: 'us',   ch: 'mail', t: 'Apr 27 11:00am', body: 'Hi Vikram, please find the revised proposal attached. Key changes on pages 3 and 7.' },
    { from: 'them', ch: 'mail', t: 'Apr 27 4:45pm',  body: 'Looks good — a few line edits inline' },
    { from: 'note', who: 'Riya A.', t: 'Apr 27 5:00pm', body: 'Vikram approved pricing. Waiting on legal sign-off. Expected by May 3.' },
  ],
}

const CONTACTS: Record<number, {
  subtitle: string; email: string; phone: string; source: string; created: string; owner: string
  tags: string[]; deal?: { name: string; stage: string; value: string }
  activity: { icon: string; text: string; time: string; color: string }[]
}> = {
  1: { subtitle: '+91 98103 22018 · Levanta · Owner Riya A.', email: 'sana@levanta.io', phone: '+91 98103 22018', source: 'Website · /pricing', created: 'Apr 28, 2026', owner: 'Riya Acharya', tags: ['hot-lead','mumbai','trial'], deal: { name: 'Levanta — annual', stage: 'Qualified', value: '₹8,40,000' }, activity: [{ icon: 'flow', text: 'Workflow "Welcome series" running', time: '9:18am', color: 'var(--violet)' }, { icon: 'mail', text: 'Opened "Pricing email v3"', time: '8:42am', color: 'var(--accent)' }, { icon: 'spark', text: 'Form: pricing-page', time: 'Apr 28', color: '#F59E0B' }] },
  2: { subtitle: '+91 99876 11240 · Arcwise · Owner Aman D.', email: 'rohit@arcwise.app', phone: '+91 99876 11240', source: 'Referral', created: 'Apr 22, 2026', owner: 'Aman Dubey', tags: ['enterprise'], deal: { name: 'Arcwise pilot', stage: 'Contacted', value: '₹6,00,000' }, activity: [{ icon: 'mail', text: 'Opened "Enterprise proposal"', time: '4:30pm', color: 'var(--accent)' }, { icon: 'contact', text: 'Referred by Helio', time: 'Apr 22', color: '#22C55E' }] },
  3: { subtitle: '+91 90120 84411 · Orbital · Owner Aman D.', email: 'aditi@orbital.tech', phone: '+91 90120 84411', source: 'Website', created: 'Apr 20, 2026', owner: 'Aman Dubey', tags: ['demo-booked'], deal: { name: 'Orbital · team plan', stage: 'Qualified', value: '₹1,80,000' }, activity: [{ icon: 'cal', text: 'Demo booked — May 2 11am', time: '8:05am', color: '#F59E0B' }, { icon: 'spark', text: 'Form: demo-request', time: 'Apr 20', color: '#F59E0B' }] },
  4: { subtitle: '+91 99008 12340 · Helio · Owner Riya A.', email: 'faraz@helio.co', phone: '+91 99008 12340', source: 'Referral', created: 'Apr 18, 2026', owner: 'Riya Acharya', tags: ['enterprise','demo-booked'], deal: { name: 'Helio · 200 seats', stage: 'New Lead', value: '₹4,80,000' }, activity: [{ icon: 'cal', text: 'Call rescheduled to Friday', time: '11:12am', color: '#F59E0B' }] },
  5: { subtitle: '+91 99887 76651 · Flux · Owner Aman D.', email: 'karan@flux.app', phone: '+91 99887 76651', source: 'Campaign', created: 'Apr 15, 2026', owner: 'Aman Dubey', tags: ['hot-lead','trial'], deal: { name: 'Flux growth plan', stage: 'Won', value: '₹2,40,000' }, activity: [{ icon: 'mail', text: 'Replied to pricing email', time: '3:30pm', color: 'var(--accent)' }] },
  6: { subtitle: '+34 612 88 04 12 · Belvedere · Owner Riya A.', email: 'lina@belvedere.es', phone: '+34 612 88 04 12', source: 'Website', created: 'Mar 10, 2026', owner: 'Riya Acharya', tags: ['intl','enterprise'], deal: { name: 'Belvedere Iberia', stage: 'Proposal Sent', value: '€18,000' }, activity: [{ icon: 'check', text: 'Contract signing tomorrow', time: '11:30am', color: '#22C55E' }] },
  7: { subtitle: '+91 89765 21034 · Dunes Studio · Owner NK', email: 'meera@dunes.studio', phone: '+91 89765 21034', source: 'Form', created: 'Apr 10, 2026', owner: 'Nikhil Kumar', tags: ['opted-out'], activity: [{ icon: 'x', text: 'Opted out of SMS', time: '2:03pm', color: '#EF4444' }] },
  8: { subtitle: 'v.shah@meridian.in · Meridian Labs · Owner NK', email: 'v.shah@meridian.in', phone: '+91 98765 41200', source: 'API', created: 'Apr 14, 2026', owner: 'Nikhil Kumar', tags: ['hot-lead'], deal: { name: 'Meridian add-on', stage: 'Qualified', value: '₹95,000' }, activity: [{ icon: 'mail', text: 'Sent line edits on proposal', time: '4:45pm', color: 'var(--accent)' }, { icon: 'flow', text: 'Workflow "Follow-up" triggered', time: 'Apr 27', color: 'var(--violet)' }] },
}

const ChIcon: Record<string, (p: { size: number }) => ReactElement> = { wa: I.wa, mail: I.mail, sms: I.phone }
const chColor: Record<string, string> = { wa: '#22C55E', mail: '#6366F1', sms: '#F59E0B' }

export default function InboxPage() {
  const [convs, setConvs] = useState<Conv[]>(INITIAL_CONVS)
  const [activeId, setActiveId] = useState(1)
  const [threads, setThreads] = useState<Record<number, Msg[]>>(THREADS)
  const [draft, setDraft] = useState('')
  const [composerCh, setComposerCh] = useState('wa')
  const [filter, setFilter] = useState<'all' | 'mine' | 'unread'>('all')
  const [toast, setToast] = useState('')
  const threadEndRef = useRef<HTMLDivElement>(null)

  const activeConv = convs.find(c => c.id === activeId)!
  const contactInfo = CONTACTS[activeId]
  const thread = threads[activeId] || []

  const visibleConvs = convs.filter(c => {
    if (filter === 'mine') return [1, 4, 5, 6].includes(c.id)
    if (filter === 'unread') return c.unread > 0
    return true
  })

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length, activeId])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleSelect(id: number) {
    setActiveId(id)
    setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
    const conv = convs.find(c => c.id === id)
    if (conv) setComposerCh(conv.ch)
  }

  function handleSend() {
    if (!draft.trim()) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const newMsg: Msg = { from: 'us', ch: composerCh, t: `Today ${now}`, body: draft }
    setThreads(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }))
    setConvs(prev => prev.map(c => c.id === activeId ? { ...c, last: draft, t: 'now' } : c))
    setDraft('')
  }

  function handleAddNote() {
    if (!draft.trim()) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const note: Msg = { from: 'note', who: 'Riya A.', t: `Today ${now}`, body: draft }
    setThreads(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), note] }))
    setDraft('')
    showToast('Note added')
  }

  function handleResolve() {
    setConvs(prev => prev.map(c => c.id === activeId ? { ...c, status: 'resolved', unread: 0 } : c))
    showToast('Conversation resolved')
  }

  function handleSnooze() {
    setConvs(prev => prev.map(c => c.id === activeId ? { ...c, status: 'snooze' } : c))
    showToast('Snoozed until tomorrow 9am')
  }

  function handleReopen() {
    setConvs(prev => prev.map(c => c.id === activeId ? { ...c, status: 'open' } : c))
    showToast('Conversation reopened')
  }

  const isResolved = activeConv?.status === 'resolved'

  return (
    <>
      <Topbar
        title="Conversations"
        subtitle={`${convs.filter(c => c.status === 'open').length} open · ${convs.filter(c => c.unread > 0).length} unread`}
        actions={<>
          <button className="btn"><I.filter size={13} /> Filter</button>
          <button className="btn primary"><I.plus size={14} /> New message</button>
        </>}
      />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '320px 1fr 280px', overflow: 'hidden', height: '100%' }}>

        {/* Conversation list */}
        <aside style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="row gap-1" style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            {(['all','mine','unread'] as const).map(f => (
              <button key={f} className={`seg-btn${filter === f ? ' active' : ''}`} style={{ padding: '4px 9px', fontSize: 11 }} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'mine' ? 'Mine' : 'Unread'}
                <span className="muted-2"> {f === 'all' ? convs.length : f === 'mine' ? 4 : convs.filter(c => c.unread > 0).length}</span>
              </button>
            ))}
            <div className="flex-1" />
            <button className="icon-btn" style={{ width: 24, height: 24 }}><I.search size={13} /></button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {visibleConvs.map(c => {
              const Ch = ChIcon[c.ch]
              return (
                <div key={c.id} className={`conv-row${c.id === activeId ? ' active' : ''}`} onClick={() => handleSelect(c.id)} style={{ cursor: 'pointer' }}>
                  <div className="avatar md" style={{ background: c.color, position: 'relative', flexShrink: 0 }}>
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
            <div className="avatar lg" style={{ background: activeConv.color }}>{activeConv.avatar}</div>
            <div className="col flex-1" style={{ lineHeight: 1.3 }}>
              <div className="row gap-2">
                <span style={{ fontWeight: 600, fontSize: 14 }}>{activeConv.name}</span>
                <span className="pill green"><I.wa size={10} /> {activeConv.ch === 'wa' ? 'WhatsApp' : activeConv.ch === 'mail' ? 'Email' : 'SMS'}</span>
                <span className="tag-chip">#{activeConv.tag}</span>
                {isResolved && <span className="pill green"><I.check size={10} /> Resolved</span>}
              </div>
              <div className="muted-2" style={{ fontSize: 11 }}>{contactInfo?.subtitle}</div>
            </div>
            <button className="btn"><I.user size={13} /> Assign</button>
            {!isResolved
              ? <button className="btn" onClick={handleSnooze}><I.clock size={13} /> Snooze</button>
              : <button className="btn" onClick={handleReopen}><I.refresh size={13} /> Reopen</button>
            }
            {!isResolved
              ? <button className="btn primary" onClick={handleResolve}><I.check size={14} /> Resolve</button>
              : <span className="pill green" style={{ padding: '6px 12px', fontSize: 12 }}><I.check size={12} /> Resolved</span>
            }
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
                  {!us && <div className="avatar sm" style={{ background: activeConv.color }}>{activeConv.avatar}</div>}
                  <div className="col" style={{ gap: 3, alignItems: us ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div className={`bubble ${us ? 'us' : 'them'}`}>{m.body}</div>
                    <div className="muted-2" style={{ fontSize: 10 }}>{m.t}{us && ' · delivered'}</div>
                  </div>
                </div>
              )
            })}
            <div ref={threadEndRef} />
          </div>

          {!isResolved && (
            <div className="composer">
              <div className="row gap-2" style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>
                {(['wa','mail','sms'] as const).map(ch => (
                  <button key={ch} className={`seg-btn${composerCh === ch ? ' active' : ''}`} style={{ fontSize: 11 }} onClick={() => setComposerCh(ch)}>
                    {ch === 'wa' ? <><I.wa size={11} /> WhatsApp</> : ch === 'mail' ? <><I.mail size={11} /> Email</> : <><I.phone size={11} /> SMS</>}
                  </button>
                ))}
                <div className="flex-1" />
                <button className="seg-btn" style={{ fontSize: 11 }}><I.paper size={11} /> Templates</button>
                <button className="seg-btn" style={{ fontSize: 11 }}>/ Canned</button>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend() }}
                  placeholder="Type a message… (⌘Enter to send)"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 13, color: 'var(--text)', minHeight: 48, fontFamily: 'inherit' }}
                />
                <div className="row gap-1" style={{ marginTop: 10 }}>
                  <button className="icon-btn"><I.attach size={14} /></button>
                  <button className="icon-btn"><I.smile size={14} /></button>
                  <button className="icon-btn"><I.tag size={14} /></button>
                  <div className="flex-1" />
                  <button className="btn ghost" onClick={handleAddNote}><I.pin size={13} /> Add note</button>
                  <button className="btn primary" onClick={handleSend}><I.send size={13} /> Send</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right contact context */}
        <aside style={{ borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '16px 14px' }}>
          <div className="col gap-2" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className="avatar xl" style={{ background: activeConv.color }}>{activeConv.avatar}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{activeConv.name}</div>
            <div className="muted" style={{ fontSize: 12 }}>{contactInfo?.email}</div>
            <div className="row gap-1" style={{ marginTop: 4 }}>
              <button className="icon-btn"><I.mail size={13} /></button>
              <button className="icon-btn"><I.phone size={13} /></button>
              <button className="icon-btn"><I.wa size={13} /></button>
              <button className="icon-btn"><I.link size={13} /></button>
            </div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Details</div>
            <div className="ctx-row"><span>Email</span><span className="truncate" style={{ maxWidth: 140 }}>{contactInfo?.email}</span></div>
            <div className="ctx-row"><span>Phone</span><span>{contactInfo?.phone}</span></div>
            <div className="ctx-row"><span>Source</span><span>{contactInfo?.source}</span></div>
            <div className="ctx-row"><span>Created</span><span>{contactInfo?.created}</span></div>
            <div className="ctx-row"><span>Owner</span><span>{contactInfo?.owner}</span></div>
          </div>

          <div className="ctx-section">
            <div className="ctx-label">Tags</div>
            <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
              {(contactInfo?.tags || []).map(t => (
                <span key={t} className="pill blue">{t}</span>
              ))}
              <span className="tag-chip" style={{ cursor: 'pointer' }}>+ add</span>
            </div>
          </div>

          {contactInfo?.deal && (
            <div className="ctx-section">
              <div className="ctx-label">Linked deal</div>
              <div className="card" style={{ padding: 10 }}>
                <div className="row gap-2"><I.pipeline size={12} className="muted-2" /><span style={{ fontSize: 12, fontWeight: 500 }}>{contactInfo.deal.name}</span></div>
                <div className="row gap-2" style={{ marginTop: 6 }}>
                  <span className="pill violet">{contactInfo.deal.stage}</span>
                  <span className="mono" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{contactInfo.deal.value}</span>
                </div>
              </div>
            </div>
          )}

          <div className="ctx-section">
            <div className="ctx-label">Recent activity</div>
            <div className="col gap-2" style={{ fontSize: 11 }}>
              {(contactInfo?.activity || []).map((a, i) => {
                const Ico = I[a.icon]
                return (
                  <div key={i} className="row gap-2">
                    {Ico && <Ico size={11} style={{ color: a.color, flexShrink: 0 }} />}
                    <span className="flex-1">{a.text}</span>
                    <span className="muted-2">{a.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="toast">
          <I.check size={14} style={{ color: '#22C55E' }} />
          {toast}
        </div>
      )}
    </>
  )
}
