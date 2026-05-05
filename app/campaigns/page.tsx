'use client'

import { useState, ReactNode, ReactElement } from 'react'
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

// ─── Email Scheduler components ───────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0, cursor: 'pointer',
        background: on ? '#6366F1' : 'var(--surface-2)',
        border: `1px solid ${on ? '#6366F1' : 'var(--border)'}`,
        position: 'relative', transition: 'background .2s, border-color .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .2s',
      }} />
    </div>
  )
}

function FormRow({ label, subtitle, required, children }: { label: string; subtitle?: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, padding: '22px 0', borderBottom: '1px solid var(--border-soft)', alignItems: 'start' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
        </div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 5, lineHeight: 1.5 }}>{subtitle}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SpamGauge() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
      <svg width="160" height="95" viewBox="0 0 120 75">
        {/* Red (135°–180°) */}
        <path d="M 21.11 26.11 A 55 55 0 0 0 5 65 L 20 65 A 40 40 0 0 1 31.72 36.72 Z" fill="#EF4444" stroke="var(--surface)" strokeWidth="1.5" />
        {/* Orange (90°–135°) */}
        <path d="M 60 10 A 55 55 0 0 0 21.11 26.11 L 31.72 36.72 A 40 40 0 0 1 60 25 Z" fill="#F97316" stroke="var(--surface)" strokeWidth="1.5" />
        {/* Yellow (45°–90°) */}
        <path d="M 98.89 26.11 A 55 55 0 0 0 60 10 L 60 25 A 40 40 0 0 1 88.28 36.72 Z" fill="#EAB308" stroke="var(--surface)" strokeWidth="1.5" />
        {/* Green (0°–45°) */}
        <path d="M 115 65 A 55 55 0 0 0 98.89 26.11 L 88.28 36.72 A 40 40 0 0 1 100 65 Z" fill="#22C55E" stroke="var(--surface)" strokeWidth="1.5" />
        {/* Needle at ~120° (orange zone) */}
        <line x1="60" y1="65" x2="38" y2="27" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="65" r="5" fill="#374151" />
        <circle cx="60" cy="65" r="2.5" fill="#9CA3AF" />
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
        Spam score: <span style={{ color: '#22C55E', fontWeight: 600 }}>Coming Soon</span>
      </div>
    </div>
  )
}

const SEND_MODES = [
  { key: 'now',     label: 'Send Now',       icon: 'send',   title: 'Send Now',       desc: 'Send the email campaign immediately' },
  { key: 'sched',   label: 'Schedule',       icon: 'cal',    title: 'Schedule',       desc: 'Pick a date and time to schedule' },
  { key: 'batch',   label: 'Batch Schedule', icon: 'layers', title: 'Batch Schedule', desc: 'Send in batches to improve deliverability' },
  { key: 'rss',     label: 'RSS Schedule',   icon: 'globe2', title: 'RSS Schedule',   desc: 'Trigger sends based on RSS feed updates' },
  { key: 'smart',   label: 'Smart Send',     icon: 'spark',  title: 'Smart Send',     desc: 'Send at the optimal time for each recipient' },
] as const

type SendMode = typeof SEND_MODES[number]['key']
type RecipMode = 'contacts' | 'smartlist' | 'choose' | 'prebuilt' | 'build'

function EmailScheduler({ camp, onBack, onSend }: { camp: Campaign; onBack: () => void; onSend: () => void }) {
  const [mode, setMode] = useState<SendMode>('now')
  const [campName, setCampName] = useState(camp.name)
  const [editName, setEditName] = useState(false)
  const [senderName, setSenderName] = useState('')
  const [senderDomain] = useState('lc.phantomcoretech.com')
  const [senderEmail, setSenderEmail] = useState('')
  const [customReply, setCustomReply] = useState(false)
  const [replyEmail, setReplyEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [preheader, setPreheader] = useState('')
  const [recipMode, setRecipMode] = useState<RecipMode>('contacts')
  const [schedDate, setSchedDate] = useState('2026-05-05')
  const [schedTime, setSchedTime] = useState('14:00')
  const [trackClicks, setTrackClicks] = useState(false)
  const [utmTracking, setUtmTracking] = useState(false)
  const [addTags, setAddTags] = useState(false)
  const [resendUnopened, setResendUnopened] = useState(false)
  const [showAdditional, setShowAdditional] = useState(true)
  const [reqExpanded, setReqExpanded] = useState(false)

  const modeInfo = SEND_MODES.find(m => m.key === mode)!
  const criticalCount = [!senderEmail, !subject, !senderDomain].filter(Boolean).length
  const criticalFields = [
    !senderEmail && 'Sender Email',
    !subject && 'Subject line',
    !senderDomain && 'Sender Domain',
  ].filter(Boolean) as string[]

  const RECIP_OPTIONS: { key: RecipMode; label: string }[] = [
    { key: 'contacts',  label: 'Choose Contacts' },
    { key: 'smartlist', label: 'Send to Smart List' },
    { key: 'choose',    label: 'Choose Contacts…' },
    { key: 'prebuilt',  label: 'Pre-built Segments' },
    { key: 'build',     label: 'Build Segments' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Custom top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 52, borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
        <button className="btn ghost" onClick={onBack} style={{ fontSize: 12, gap: 6, flexShrink: 0 }}>
          ← Back to email builder
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {editName ? (
            <input
              autoFocus
              value={campName}
              onChange={e => setCampName(e.target.value)}
              onBlur={() => setEditName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditName(false)}
              style={{ background: 'transparent', border: '1px solid var(--accent)', borderRadius: 6, padding: '4px 10px', fontSize: 14, fontWeight: 600, color: 'var(--text)', textAlign: 'center', minWidth: 260 }}
            />
          ) : (
            <button onClick={() => setEditName(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontSize: 14, fontWeight: 600, padding: '4px 8px', borderRadius: 6 }}>
              {campName}
              <I.pencil size={13} className="muted-2" />
            </button>
          )}
        </div>
        <div className="row gap-2" style={{ flexShrink: 0 }}>
          <button className="icon-btn"><I.more size={15} /></button>
          <button className="btn"><I.eye size={13} /> Preview</button>
          <button className="btn"><I.download size={13} /> Save</button>
          <button className="btn primary" onClick={onSend}>
            <I.send size={13} /> Review and {mode === 'now' ? 'Send' : 'Schedule'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left: Form ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px', background: 'var(--bg)' }}>

          {/* Page title */}
          <div className="row gap-3" style={{ marginBottom: 24, alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Send or Schedule</h1>
            </div>
            <div className="flex-1" />
            <button className="btn"><I.attach size={13} /> Attach Files</button>
          </div>

          {/* Mode tabs */}
          <div className="row gap-2" style={{ marginBottom: 24 }}>
            {SEND_MODES.map(m => {
              const Ic = I[m.icon]
              const active = mode === m.key
              return (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
                    background: active ? 'var(--surface)' : 'transparent',
                    color: active ? 'var(--accent-2)' : 'var(--text-3)',
                    border: active ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: active ? '0 1px 4px rgba(0,0,0,.15)' : 'none',
                    transition: 'all .15s',
                  }}
                >
                  <Ic size={14} />
                  {m.label}
                </button>
              )
            })}
          </div>

          {/* Mode description */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{modeInfo.title}</div>
            <div className="muted-2" style={{ fontSize: 13, marginTop: 3 }}>{modeInfo.desc}</div>
          </div>

          {/* Batch / RSS / Smart placeholder */}
          {(mode === 'batch' || mode === 'rss' || mode === 'smart') && (
            <div style={{ marginTop: 24, padding: 32, border: '1px dashed var(--border)', borderRadius: 12, textAlign: 'center' }}>
              <I.spark size={24} className="muted-2" style={{ display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {mode === 'batch' ? 'Batch Schedule' : mode === 'rss' ? 'RSS Schedule' : 'Smart Send'}
              </div>
              <div className="muted-2" style={{ fontSize: 13, marginTop: 6, maxWidth: 360, margin: '6px auto 0' }}>
                {mode === 'batch'
                  ? 'Configure how many emails to send per hour and over how many days.'
                  : mode === 'rss'
                  ? 'Connect an RSS feed URL and set the trigger frequency.'
                  : 'Our AI will analyse each contact\'s past engagement and send at their optimal open time.'}
              </div>
              <button className="btn primary" style={{ marginTop: 16 }}><I.spark size={13} /> Configure</button>
            </div>
          )}

          {/* Schedule date/time - only for 'sched' mode */}
          {mode === 'sched' && (
            <FormRow label="Schedule At" required subtitle="GMT+04:00 Asia/Dubai">
              <div className="row gap-3">
                <input
                  type="date"
                  className="input"
                  value={schedDate}
                  onChange={e => setSchedDate(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select
                  className="input"
                  value={schedTime}
                  onChange={e => setSchedTime(e.target.value)}
                  style={{ flex: 1, background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}
                >
                  {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                    const [h] = t.split(':')
                    const hour = parseInt(h)
                    const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
                    return <option key={t} value={t}>{label}</option>
                  })}
                </select>
              </div>
            </FormRow>
          )}

          {/* Common form fields for now + sched */}
          {(mode === 'now' || mode === 'sched') && (
            <>
              <FormRow label="Sender Name" subtitle="The name recipients will see">
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="(Optional)"
                    style={{ paddingRight: 36 }}
                  />
                  <I.tag size={14} className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </FormRow>

              <FormRow label="Sender Domain" required subtitle="Choose a verified domain you want to send this email from">
                <div>
                  <div style={{ padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{senderDomain}</span>
                    <I.chevD size={12} className="muted-2" />
                  </div>
                  <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-3)' }}>
                    Check your Domain Configuration{' '}
                    <span style={{ color: 'var(--accent-2)', cursor: 'pointer', textDecoration: 'underline' }}>here</span>
                  </div>
                </div>
              </FormRow>

              <FormRow label="Sender Email" required subtitle="The email address recipients will see">
                <div className="col gap-2">
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      value={senderEmail}
                      onChange={e => setSenderEmail(e.target.value)}
                      placeholder="From Email"
                      style={{ paddingRight: 36 }}
                    />
                    <I.tag size={14} className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  <label className="row gap-2" style={{ cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
                    <input type="checkbox" checked={customReply} onChange={e => setCustomReply(e.target.checked)} style={{ accentColor: '#6366F1' }} />
                    Set a custom reply-to address for this campaign.
                  </label>
                  {customReply && (
                    <input className="input" value={replyEmail} onChange={e => setReplyEmail(e.target.value)} placeholder="Reply-to email address" />
                  )}
                </div>
              </FormRow>

              <FormRow label="Subject line" required>
                <div className="row gap-2">
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      className="input"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Type the subject of your message"
                      style={{ paddingRight: 36 }}
                    />
                    <I.tag size={14} className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  <button className="btn" style={{ flexShrink: 0 }}><I.spark size={13} /> Content AI</button>
                </div>
              </FormRow>

              <FormRow label="Preview Text" subtitle="This will be used as the preview text that displays in some email clients.">
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    value={preheader}
                    onChange={e => setPreheader(e.target.value)}
                    placeholder="(Optional)"
                    style={{ paddingRight: 36 }}
                  />
                  <I.tag size={14} className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </FormRow>

              <FormRow label="Recipient (To)" required subtitle="Choose the recipients you wish to send this email to.">
                <div className="col gap-3">
                  {/* Radio row */}
                  <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
                    {RECIP_OPTIONS.map(r => (
                      <label key={r.key} className="row gap-2" style={{ cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
                        <input
                          type="radio"
                          name="recip"
                          checked={recipMode === r.key}
                          onChange={() => setRecipMode(r.key)}
                          style={{ accentColor: '#6366F1' }}
                        />
                        {r.label}
                      </label>
                    ))}
                  </div>

                  {recipMode === 'contacts' && (
                    <div>
                      <div className="row gap-2" style={{ marginBottom: 6 }}>
                        <button className="btn sm"><I.plus size={11} /></button>
                        <button className="btn sm"><I.contact size={11} /> All contacts</button>
                        <button className="btn sm ghost" style={{ color: '#EF4444' }}>Clear all</button>
                      </div>
                      <div className="muted-2" style={{ fontSize: 12 }}>(0 contacts selected)</div>
                    </div>
                  )}

                  {recipMode === 'smartlist' && (
                    <select className="input" style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}>
                      <option>Hot leads — Apr</option>
                      <option>Newsletter subs</option>
                      <option>Renewals — Q2</option>
                    </select>
                  )}

                  {(recipMode === 'choose' || recipMode === 'prebuilt' || recipMode === 'build') && (
                    <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 8, fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>
                      <I.filter size={16} className="muted-2" style={{ display: 'block', margin: '0 auto 8px' }} />
                      {recipMode === 'prebuilt' ? 'Select a pre-built segment' : recipMode === 'build' ? 'Build a custom segment with filters' : 'Search and choose specific contacts'}
                    </div>
                  )}
                </div>
              </FormRow>

              {/* Additional Settings */}
              <div style={{ paddingTop: 20 }}>
                <button
                  onClick={() => setShowAdditional(v => !v)}
                  className="row gap-2"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text)', fontWeight: 600, fontSize: 14 }}
                >
                  <I.cog size={16} /> Additional Settings
                  <I.chevD size={12} className="muted-2" style={{ transform: showAdditional ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                {showAdditional && (
                  <div className="col" style={{ marginTop: 16, gap: 0 }}>
                    {[
                      { key: 'trackClicks', label: 'Track clicks', desc: 'Discover which links were clicked, how many times each link were clicked, and who did the clicking.', val: trackClicks, set: setTrackClicks },
                      { key: 'utm', label: 'UTM Tracking', desc: 'When enabled, this setting automatically adds the default UTM parameters to every link in the campaign.', val: utmTracking, set: setUtmTracking },
                      { key: 'tags', label: 'Add tags', desc: 'Automate adding to contacts depending on how they interact with your campaigns.', val: addTags, set: setAddTags },
                      { key: 'resend', label: 'Resend email to unopened', desc: 'Enable it to configure your resend to unopened settings.', val: resendUnopened, set: setResendUnopened },
                    ].map(row => (
                      <div key={row.key} className="row gap-4" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-soft)', alignItems: 'flex-start' }}>
                        <Toggle on={row.val} onChange={row.set} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{row.label}</div>
                          <div className="muted-2" style={{ fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{row.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ height: 40 }} />
            </>
          )}
        </div>

        {/* ── Right: Preview panel ── */}
        <div style={{ width: 360, flexShrink: 0, borderLeft: '1px solid var(--border)', overflowY: 'auto', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>

          {/* Preview actions */}
          <div className="row gap-4" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
            <button className="btn sm ghost" style={{ gap: 6, color: 'var(--accent-2)' }}><I.eye size={13} /> Preview in browser</button>
            <button className="btn sm ghost" style={{ gap: 6, color: 'var(--accent-2)' }}><I.send size={13} /> Send test email</button>
          </div>

          {/* Email preview */}
          <div style={{ padding: 16, flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
              {subject && (
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                  {subject}
                </div>
              )}
              <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>Hi There!</p>
              <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>Start from scratch</p>
              {preheader && (
                <p style={{ margin: '12px 0 0', fontSize: 11, color: '#888' }}>{preheader}</p>
              )}
            </div>
          </div>

          {/* Spam gauge */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <SpamGauge />
          </div>

          {/* Required fields */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => setReqExpanded(v => !v)}
              className="row gap-2"
              style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                Required fields <I.chevR size={12} className="muted-2" />
              </span>
              {criticalCount > 0 && (
                <span style={{ background: '#F59E0B', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                  {criticalCount} Critical
                </span>
              )}
            </button>
            {reqExpanded && (
              <div className="col" style={{ padding: '0 18px 16px', gap: 6 }}>
                {criticalFields.length === 0 ? (
                  <div className="row gap-2" style={{ fontSize: 12, color: '#22C55E' }}><I.check size={13} /> All required fields complete</div>
                ) : criticalFields.map(f => (
                  <div key={f} className="row gap-2" style={{ fontSize: 12, color: '#EF4444' }}><I.x size={12} /> {f} is required</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Campaigns Page ──────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [camps, setCamps] = useState<Campaign[]>(INITIAL_CAMPS)
  const [channel, setChannel] = useState<'all' | 'mail' | 'wa' | 'sms'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newCamp, setNewCamp] = useState({ name: '', ch: 'mail', audience: '' })
  const [toast, setToast] = useState('')
  const [sendView, setSendView] = useState(false)
  const [sendCamp, setSendCamp] = useState<Campaign | null>(null)

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

  function handleLaunch(c: Campaign) {
    if (c.ch === 'mail') {
      setSendCamp(c)
      setSendView(true)
      setSelected(null)
    } else {
      setCamps(prev => prev.map(camp => camp.id === c.id ? { ...camp, status: 'running' } : camp))
      setSelected(prev => prev ? { ...prev, status: 'running' } : prev)
      showToast('Campaign launched!')
    }
  }

  function openScheduler(c: Campaign) {
    setSendCamp(c)
    setSendView(true)
    setSelected(null)
  }

  function handlePause(id: number) {
    setCamps(prev => prev.map(c => c.id === id ? { ...c, status: 'scheduled' } : c))
    setSelected(prev => prev ? { ...prev, status: 'scheduled' } : prev)
    showToast('Campaign paused')
  }

  // Full-page email scheduler
  if (sendView && sendCamp) {
    return (
      <EmailScheduler
        camp={sendCamp}
        onBack={() => { setSendView(false); setSendCamp(null) }}
        onSend={() => {
          setCamps(prev => prev.map(c => c.id === sendCamp.id ? { ...c, status: 'running' } : c))
          setSendView(false)
          setSendCamp(null)
          showToast('Campaign sent successfully!')
        }}
      />
    )
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
                        {c.ch === 'mail' && (
                          <button
                            className="btn sm primary"
                            title="Send or Schedule"
                            onClick={() => handleLaunch(c)}
                            style={{ fontSize: 11, padding: '4px 10px' }}
                          >
                            <I.send size={11} /> Send
                          </button>
                        )}
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
              {selected.ch === 'mail' ? (
                <button className="btn sm primary" style={{ flex: 1 }} onClick={() => openScheduler(selected)}>
                  <I.send size={12} /> Send or Schedule
                </button>
              ) : selected.status === 'draft' || selected.status === 'scheduled' ? (
                <button className="btn sm primary" style={{ flex: 1 }} onClick={() => handleLaunch(selected)}>
                  <I.send size={12} /> Launch
                </button>
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
                <select value={newCamp.ch} onChange={e => setNewCamp({ ...newCamp, ch: e.target.value })} style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}>
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
