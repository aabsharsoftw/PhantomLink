'use client'

import { useState, useRef } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Template = {
  id: number; name: string; channel: 'wa' | 'email' | 'sms'
  category: string; status: 'approved' | 'pending' | 'rejected' | 'draft'
  preview: string; variables: string[]; updatedAt: string; usedIn: number
}
type HeaderType = 'Text' | 'Image' | 'Video' | 'Document' | 'Location'
type WaButton = { type: 'quick_reply' | 'url' | 'phone'; text: string; value: string }

const INITIAL_TEMPLATES: Template[] = [
  { id: 1,  channel: 'wa',    category: 'Marketing',      status: 'approved', name: 'welcome_to_company',      preview: 'Hi {{1}}! 👋 Welcome to {{2}}. Your account is ready. Reply HELP for assistance.',                          variables: ['first_name','company_name'], updatedAt: 'Apr 28', usedIn: 3 },
  { id: 2,  channel: 'wa',    category: 'Marketing',      status: 'approved', name: 'trial_expiry_reminder',   preview: 'Hi {{1}}, your {{2}} trial ends in {{3}} days. Upgrade now to keep your data: {{4}}',                       variables: ['first_name','plan_name','days_left','upgrade_link'], updatedAt: 'Apr 25', usedIn: 1 },
  { id: 3,  channel: 'wa',    category: 'Utility',        status: 'approved', name: 'otp_verification',        preview: 'Your {{1}} verification code is *{{2}}*. Valid for 10 minutes. Do not share this code.',                     variables: ['company_name','otp_code'], updatedAt: 'Apr 22', usedIn: 5 },
  { id: 4,  channel: 'wa',    category: 'Utility',        status: 'approved', name: 'appointment_reminder',    preview: 'Hi {{1}}! Reminder: your call with {{2}} is scheduled for {{3}} IST. Reply 1 to confirm, 2 to reschedule.',  variables: ['first_name','agent_name','date_time'], updatedAt: 'Apr 20', usedIn: 2 },
  { id: 5,  channel: 'wa',    category: 'Marketing',      status: 'pending',  name: 'cart_recovery',           preview: 'Hey {{1}} 👀 You left something behind! Complete your order for {{2}} before it sells out: {{3}}',           variables: ['first_name','product_name','cart_link'], updatedAt: 'May 1', usedIn: 0 },
  { id: 6,  channel: 'wa',    category: 'Authentication', status: 'approved', name: 'password_reset',          preview: 'Your {{1}} password reset link: {{2}} — valid for 30 minutes.',                                            variables: ['company_name','reset_link'], updatedAt: 'Apr 10', usedIn: 1 },
  { id: 7,  channel: 'wa',    category: 'Marketing',      status: 'rejected', name: 'flash_sale_promo',        preview: 'FLASH SALE 🔥 {{1}}% OFF everything today only! Use code {{2}} at checkout.',                               variables: ['discount','promo_code'], updatedAt: 'Apr 18', usedIn: 0 },
  { id: 8,  channel: 'email', category: 'Newsletter',     status: 'draft',    name: 'Monthly product update',  preview: 'Hi {{first_name}}, here\'s what\'s new this month. We shipped {{feature_count}} new features…',             variables: ['first_name','feature_count'], updatedAt: 'May 2', usedIn: 0 },
  { id: 9,  channel: 'email', category: 'Promotional',    status: 'approved', name: 'Spring Promo 2026',       preview: 'Subject: 🌸 Spring into savings — 30% off Pro plans\n\nHi {{first_name}}, Spring is here and we\'re celebrating…', variables: ['first_name'], updatedAt: 'Apr 22', usedIn: 1 },
  { id: 10, channel: 'email', category: 'Transactional',  status: 'approved', name: 'Invoice receipt',         preview: 'Hi {{first_name}}, your payment of {{amount}} for {{plan_name}} has been received. Invoice #{{invoice_id}} attached.', variables: ['first_name','amount','plan_name','invoice_id'], updatedAt: 'Apr 14', usedIn: 4 },
  { id: 11, channel: 'email', category: 'Promotional',    status: 'approved', name: 'Webinar invite',          preview: 'Subject: You\'re invited — {{webinar_title}}\n\nJoin us on {{webinar_date}} for a live demo…',               variables: ['webinar_title','webinar_date'], updatedAt: 'Apr 12', usedIn: 1 },
  { id: 12, channel: 'email', category: 'Transactional',  status: 'approved', name: 'Trial welcome',           preview: 'Welcome aboard, {{first_name}}! Your {{plan_name}} trial is now active. Here\'s how to get started…',        variables: ['first_name','plan_name'], updatedAt: 'Apr 5', usedIn: 2 },
  { id: 13, channel: 'email', category: 'Newsletter',     status: 'draft',    name: 'May launch announcement', preview: 'Subject: Something big is coming 👀\n\nHi {{first_name}}, we\'ve been working on something exciting…',        variables: ['first_name'], updatedAt: 'May 2', usedIn: 0 },
  { id: 14, channel: 'sms',   category: 'Transactional',  status: 'approved', name: 'OTP SMS',                 preview: 'Your {{company_name}} OTP is {{otp_code}}. Valid 10 mins. Do not share.',                                    variables: ['company_name','otp_code'], updatedAt: 'Apr 28', usedIn: 6 },
  { id: 15, channel: 'sms',   category: 'Marketing',      status: 'approved', name: 'Demo confirmation',       preview: 'Hi {{first_name}}! Confirming your demo on {{date_time}}. Reply YES to confirm or NO to reschedule.',         variables: ['first_name','date_time'], updatedAt: 'Apr 24', usedIn: 3 },
  { id: 16, channel: 'sms',   category: 'Marketing',      status: 'approved', name: 'Renewal reminder SMS',    preview: 'Hi {{first_name}}, your {{plan_name}} renews on {{renewal_date}}. Questions? Reply HELP.',                    variables: ['first_name','plan_name','renewal_date'], updatedAt: 'Apr 18', usedIn: 2 },
  { id: 17, channel: 'sms',   category: 'Marketing',      status: 'draft',    name: 'Reactivation offer',      preview: 'Hey {{first_name}}! We miss you 👋 Come back — use code BACK30 for 30% off.',                                variables: ['first_name'], updatedAt: 'May 1', usedIn: 0 },
]

function StatusPill({ status }: { status: Template['status'] }) {
  if (status === 'approved') return <span className="pill green"><I.check size={10} /> Approved</span>
  if (status === 'pending')  return <span className="pill amber"><I.clock size={10} /> Pending</span>
  if (status === 'rejected') return <span className="pill red"><I.x size={10} /> Rejected</span>
  return <span className="pill"><I.pencil size={10} /> Draft</span>
}

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

// ─── WhatsApp Template Builder ───────────────────────────────────────────────

function WABuilder({ onBack, onCreate }: { onBack: () => void; onCreate: (t: Template) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Utility')
  const [language, setLanguage] = useState('English')
  const [showHeader, setShowHeader] = useState(true)
  const [headerType, setHeaderType] = useState<HeaderType>('Text')
  const [headerText, setHeaderText] = useState('')
  const [body, setBody] = useState('')
  const [footer, setFooter] = useState('')
  const [buttons, setButtons] = useState<WaButton[]>([])
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function addVar(setter: React.Dispatch<React.SetStateAction<string>>, ref?: React.RefObject<HTMLTextAreaElement | null>) {
    setter(prev => {
      const count = (prev.match(/\{\{\d+\}\}/g) || []).length + 1
      if (ref?.current) {
        const pos = ref.current.selectionStart
        return prev.slice(0, pos) + `{{${count}}}` + prev.slice(pos)
      }
      return prev + `{{${count}}}`
    })
  }

  function wrapFormat(marker: string) {
    if (!bodyRef.current) return
    const s = bodyRef.current.selectionStart
    const e = bodyRef.current.selectionEnd
    const sel = body.slice(s, e)
    setBody(b => b.slice(0, s) + marker + (sel || '') + marker + b.slice(e))
  }

  function handleCreate() {
    if (!name.trim() || !body.trim()) return
    const tpl: Template = {
      id: Date.now(), name, channel: 'wa', category,
      status: 'pending', preview: body,
      variables: (body.match(/\{\{\d+\}\}/g) || []).map((_, i) => `var_${i + 1}`),
      updatedAt: 'Today', usedIn: 0,
    }
    onCreate(tpl)
  }

  // Build live preview
  const previewHeader = showHeader && headerType === 'Text' && headerText ? headerText : null
  const previewBody = body || 'Enter template body here'
  const previewFooter = footer || null

  const HEADER_TYPES: { type: HeaderType; icon: string }[] = [
    { type: 'Text', icon: 'pencil' },
    { type: 'Image', icon: 'attach' },
    { type: 'Video', icon: 'play' },
    { type: 'Document', icon: 'doc' },
    { type: 'Location', icon: 'globe2' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>

      {/* Page header */}
      <div style={{ padding: '16px 28px 18px', borderBottom: '1px solid var(--border)' }}>
        <button className="btn ghost" onClick={onBack} style={{ marginBottom: 12, fontSize: 12, gap: 6 }}>
          ← Back to Templates
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Create Template</h1>
        <p className="muted-2" style={{ fontSize: 13, marginTop: 4, marginBottom: 0 }}>
          Fill in the header, body and footer sections of your template.
        </p>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left: Form ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

          {/* Card 1: Name / Category / Language */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

              <div className="form-field">
                <label>Template Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input"
                  value={name}
                  onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="Enter template name here"
                />
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                  Name can only have lowercase letters and underscores.
                </span>
              </div>

              <div className="form-field">
                <label>Category <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}>
                  <option>Utility</option>
                  <option>Marketing</option>
                  <option>Authentication</option>
                </select>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                  Select category option for your template.
                </span>
              </div>

              <div className="form-field">
                <label>Language <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="input" value={language} onChange={e => setLanguage(e.target.value)} style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Portuguese</option>
                </select>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                  Select the language option for your template.
                </span>
              </div>

            </div>

            {/* Show header toggle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingTop: 20, marginTop: 20, borderTop: '1px solid var(--border-soft)' }}>
              <Toggle on={showHeader} onChange={setShowHeader} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Show header</div>
                <div className="muted-2" style={{ fontSize: 12, marginTop: 3 }}>
                  Add a title or choose which type of media you&apos;ll use for this header.
                </div>
              </div>
            </div>

            {/* Header type picker */}
            {showHeader && (
              <div style={{ marginTop: 18 }}>
                <div className="muted-2" style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Choose header type</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {HEADER_TYPES.map(h => {
                    const Ic = I[h.icon]
                    const active = headerType === h.type
                    return (
                      <button
                        key={h.type}
                        onClick={() => setHeaderType(h.type)}
                        style={{
                          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                          padding: '14px 8px', borderRadius: 8, cursor: 'pointer',
                          border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                          background: active ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--surface-2)',
                          color: active ? 'var(--accent-2)' : 'var(--text-3)',
                          transition: 'all .15s',
                        }}
                      >
                        <Ic size={20} />
                        <span style={{ fontSize: 11, fontWeight: 500 }}>{h.type}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Header text input */}
                {headerType === 'Text' && (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                      Header Text <span style={{ color: '#EF4444' }}>*</span>
                    </div>
                    <div className="muted-2" style={{ fontSize: 11, marginBottom: 8 }}>
                      Enter the text for your message in the language that you&apos;ve selected.
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="input"
                        value={headerText}
                        onChange={e => setHeaderText(e.target.value.slice(0, 60))}
                        placeholder="Hello there"
                        style={{ paddingRight: 56 }}
                      />
                      <span className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, pointerEvents: 'none' }}>
                        {headerText.length} / 60
                      </span>
                    </div>
                    <button className="btn sm" style={{ marginTop: 8, color: '#6366F1', borderColor: '#6366F1' }} onClick={() => addVar(setHeaderText)}>
                      <I.plus size={11} /> Add Variable
                    </button>
                  </div>
                )}

                {/* Media placeholder */}
                {headerType !== 'Text' && (
                  <div style={{ marginTop: 16, border: '2px dashed var(--border)', borderRadius: 8, padding: 24, textAlign: 'center' }}>
                    <I.upload size={22} className="muted-2" style={{ display: 'block', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Upload {headerType.toLowerCase()} file</div>
                    <div className="muted-2" style={{ fontSize: 11, marginTop: 4 }}>Or use a sample URL for Meta review</div>
                    <button className="btn sm" style={{ marginTop: 12 }}><I.upload size={11} /> Choose {headerType}</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Body */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              Body <span style={{ color: '#EF4444' }}>*</span>
            </div>
            <div className="muted-2" style={{ fontSize: 11, marginBottom: 10 }}>
              Enter the text for your message in the language that you&apos;ve selected.
            </div>
            <div style={{ position: 'relative' }}>
              <textarea
                ref={bodyRef}
                className="input"
                value={body}
                onChange={e => setBody(e.target.value.slice(0, 1024))}
                placeholder="Enter template body here"
                rows={6}
                style={{ resize: 'vertical', minHeight: 120, paddingBottom: 28, fontFamily: 'inherit', lineHeight: 1.55 }}
              />
              <span className="muted-2" style={{ position: 'absolute', right: 10, bottom: 10, fontSize: 11, pointerEvents: 'none' }}>
                {body.length} / 1024
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              {[['*', 'B', 'bold'], ['_', 'I', 'italic'], ['~', 'S', 'strikethrough'], ['```', '</>', 'code']].map(([mk, label]) => (
                <button
                  key={label}
                  className="btn sm ghost"
                  title={label}
                  onClick={() => wrapFormat(mk)}
                  style={{ minWidth: 32, fontWeight: label === 'B' ? 700 : label === 'I' ? 400 : 400, fontStyle: label === 'I' ? 'italic' : 'normal', textDecoration: label === 'S' ? 'line-through' : 'none', fontFamily: label === '</>' ? 'monospace' : 'inherit' }}
                >
                  {label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="btn sm" style={{ color: '#6366F1', borderColor: '#6366F1' }} onClick={() => addVar(setBody, bodyRef)}>
                <I.plus size={11} /> Add Variable
              </button>
            </div>
          </div>

          {/* Card 3: Footer */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              Footer <span className="muted-2" style={{ fontWeight: 400, fontSize: 12 }}>(Optional)</span>
            </div>
            <div className="muted-2" style={{ fontSize: 11, marginBottom: 10 }}>
              Add a short line of text to the bottom of your message template.
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                value={footer}
                onChange={e => setFooter(e.target.value.slice(0, 60))}
                placeholder="Enter footer body here"
                style={{ paddingRight: 56 }}
              />
              <span className="muted-2" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, pointerEvents: 'none' }}>
                {footer.length} / 60
              </span>
            </div>
          </div>

          {/* Card 4: Buttons */}
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              Button <span className="muted-2" style={{ fontWeight: 400, fontSize: 12 }}>(Optional)</span>
            </div>
            <div className="muted-2" style={{ fontSize: 11, marginBottom: 14, lineHeight: 1.5 }}>
              Create buttons that let customers respond to your message or take action. You can add up to ten buttons. If you add more than three buttons, they will appear in a list.
            </div>
            <div className="col gap-2">
              {buttons.map((btn, i) => (
                <div key={i} className="row gap-2">
                  <select
                    value={btn.type}
                    onChange={e => setButtons(prev => prev.map((b, j) => j === i ? { ...b, type: e.target.value as WaButton['type'] } : b))}
                    style={{ width: 140, flexShrink: 0, background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}
                  >
                    <option value="quick_reply">Quick Reply</option>
                    <option value="url">Visit Website</option>
                    <option value="phone">Call Phone</option>
                  </select>
                  <input
                    className="input flex-1"
                    placeholder="Button text"
                    value={btn.text}
                    onChange={e => setButtons(prev => prev.map((b, j) => j === i ? { ...b, text: e.target.value } : b))}
                  />
                  {btn.type !== 'quick_reply' && (
                    <input
                      className="input flex-1"
                      placeholder={btn.type === 'url' ? 'https://…' : '+971…'}
                      value={btn.value}
                      onChange={e => setButtons(prev => prev.map((b, j) => j === i ? { ...b, value: e.target.value } : b))}
                    />
                  )}
                  <button className="icon-btn" onClick={() => setButtons(prev => prev.filter((_, j) => j !== i))}>
                    <I.x size={12} />
                  </button>
                </div>
              ))}
            </div>
            {buttons.length < 10 && (
              <button
                className="btn sm"
                style={{ marginTop: buttons.length > 0 ? 10 : 0 }}
                onClick={() => setButtons(prev => [...prev, { type: 'quick_reply', text: '', value: '' }])}
              >
                <I.plus size={12} /> Add Button
              </button>
            )}
          </div>

          {/* Action footer */}
          <div className="row gap-2" style={{ justifyContent: 'flex-end', paddingBottom: 32 }}>
            <button className="btn" onClick={onBack}>Cancel</button>
            <button
              className="btn primary"
              onClick={handleCreate}
              style={{ opacity: !name || !body ? 0.5 : 1, cursor: !name || !body ? 'not-allowed' : 'pointer' }}
            >
              <I.send size={13} /> Create
            </button>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: 24, background: 'var(--surface)' }}>
          <div className="row gap-2" style={{ marginBottom: 20 }}>
            <I.eye size={14} className="muted-2" />
            <span style={{ fontWeight: 600, fontSize: 13 }}>Preview</span>
          </div>

          {/* WhatsApp phone frame */}
          <div style={{ background: '#ECE5DD', borderRadius: 16, padding: '24px 14px 20px', minHeight: 300 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '88%' }}>

              {/* Message bubble */}
              <div style={{ background: '#fff', borderRadius: '2px 12px 12px 12px', boxShadow: '0 1px 2px rgba(0,0,0,.15)', overflow: 'hidden' }}>

                {/* Header */}
                {previewHeader && (
                  <div style={{ padding: '10px 12px 6px', fontWeight: 700, fontSize: 13, color: '#111', borderBottom: '1px solid #f0f0f0' }}>
                    {previewHeader}
                  </div>
                )}
                {showHeader && headerType !== 'Text' && (
                  <div style={{ background: '#e0e0e0', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {headerType === 'Image' && <I.attach size={32} style={{ color: '#aaa' }} />}
                    {headerType === 'Video' && <I.play size={32} style={{ color: '#aaa' }} />}
                    {headerType === 'Document' && <I.doc size={32} style={{ color: '#aaa' }} />}
                    {headerType === 'Location' && <I.globe2 size={32} style={{ color: '#aaa' }} />}
                  </div>
                )}

                {/* Body */}
                <div style={{ padding: '10px 12px', fontSize: 13, color: body ? '#111' : '#aaa', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {previewBody}
                </div>

                {/* Footer + time */}
                <div style={{ padding: '0 12px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  {previewFooter
                    ? <span style={{ fontSize: 11, color: '#888' }}>{previewFooter}</span>
                    : <span />
                  }
                  <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto' }}>11:48 am</span>
                </div>
              </div>

              {/* Buttons below bubble */}
              {buttons.filter(b => b.text).map((btn, i) => (
                <div
                  key={i}
                  style={{ background: '#fff', marginTop: 4, borderRadius: 8, padding: '10px 12px', textAlign: 'center', fontSize: 13, color: '#0078C8', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,.1)', cursor: 'default' }}
                >
                  {btn.type === 'url' && '↗ '}{btn.type === 'phone' && '📞 '}{btn.text}
                </div>
              ))}
            </div>
          </div>

          {/* Meta approval notice */}
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'color-mix(in srgb, #F59E0B 10%, transparent)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#FBBF24', fontWeight: 600, marginBottom: 3 }}>Meta Approval Required</div>
            <div className="muted-2" style={{ fontSize: 11, lineHeight: 1.5 }}>
              WhatsApp templates must be approved by Meta before use. Approval typically takes 24–48 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Templates Page ──────────────────────────────────────────────────────

type FormState = { name: string; channel: 'wa' | 'email' | 'sms'; category: string; body: string }
const BLANK: FormState = { name: '', channel: 'wa', category: 'Marketing', body: '' }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [channel, setChannel] = useState<'wa' | 'email' | 'sms'>('wa')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Template | null>(null)
  const [view, setView] = useState<'list' | 'builder'>('list')
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<FormState>(BLANK)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const cats = channel === 'wa' ? ['All','Marketing','Utility','Authentication'] : channel === 'email' ? ['All','Newsletter','Promotional','Transactional'] : ['All','Marketing','Transactional']

  const filtered = templates.filter(t => {
    if (t.channel !== channel) return false
    if (category !== 'All' && t.category !== category) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleSimpleCreate() {
    if (!form.name.trim() || !form.body.trim()) return
    const tpl: Template = {
      id: Date.now(), name: form.name, channel: form.channel,
      category: form.category, status: form.channel === 'wa' ? 'pending' : 'draft',
      preview: form.body, variables: [], updatedAt: 'Today', usedIn: 0,
    }
    setTemplates(prev => [tpl, ...prev])
    setForm(BLANK); setShowNew(false)
    showToast(form.channel === 'wa' ? 'Template submitted to Meta for approval' : 'Template saved as draft')
  }

  function handleDuplicate(t: Template) {
    setTemplates(prev => [{ ...t, id: Date.now(), name: `${t.name}_copy`, status: 'draft', usedIn: 0 }, ...prev])
    showToast('Template duplicated')
  }

  function handleDelete(id: number) {
    setTemplates(prev => prev.filter(t => t.id !== id))
    setSelected(null)
    showToast('Template deleted')
  }

  const stats = {
    wa:    { approved: templates.filter(t => t.channel === 'wa' && t.status === 'approved').length, pending: templates.filter(t => t.channel === 'wa' && t.status === 'pending').length },
    email: { total: templates.filter(t => t.channel === 'email').length },
    sms:   { total: templates.filter(t => t.channel === 'sms').length },
  }

  // Full-page WA builder view
  if (view === 'builder') {
    return (
      <WABuilder
        onBack={() => setView('list')}
        onCreate={(t) => {
          setTemplates(prev => [t, ...prev])
          setView('list')
          showToast('Template submitted to Meta for approval')
        }}
      />
    )
  }

  return (
    <>
      <Topbar
        title="Templates"
        subtitle={`${templates.length} templates across all channels`}
        actions={<>
          <button className="btn"><I.search size={13} /> Browse library</button>
          <button
            className="btn primary"
            onClick={() => { if (channel === 'wa') { setView('builder') } else { setForm({ ...BLANK, channel }); setShowNew(true) } }}
          >
            <I.plus size={14} /> New template
          </button>
        </>}
      />
      <div className="page">

        {/* Channel selector cards */}
        <div className="row gap-3" style={{ marginBottom: 16 }}>
          {([
            { key: 'wa',    label: 'WhatsApp',  icon: 'wa',    color: '#22C55E', count: templates.filter(t => t.channel === 'wa').length,    sub: `${stats.wa.approved} approved · ${stats.wa.pending} pending` },
            { key: 'email', label: 'Email',     icon: 'mail',  color: '#6366F1', count: templates.filter(t => t.channel === 'email').length,  sub: `${stats.email.total} templates` },
            { key: 'sms',   label: 'SMS',       icon: 'phone', color: '#F59E0B', count: templates.filter(t => t.channel === 'sms').length,    sub: `${stats.sms.total} templates` },
          ] as const).map(c => {
            const Ico = I[c.icon]
            return (
              <div
                key={c.key}
                className="card flex-1"
                style={{ padding: '14px 18px', cursor: 'pointer', border: channel === c.key ? `2px solid ${c.color}` : '1px solid var(--border)', transition: 'border .15s' }}
                onClick={() => { setChannel(c.key); setCategory('All') }}
              >
                <div className="row gap-2">
                  <Ico size={16} style={{ color: c.color }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</span>
                  {channel === c.key && <span className="dot pulse" style={{ background: c.color, marginLeft: 4 }} />}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{c.count}</div>
                <div className="muted-2" style={{ fontSize: 11 }}>{c.sub}</div>
              </div>
            )
          })}
        </div>

        {/* Filter bar */}
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          <div className="row gap-1 segment">
            {cats.map(cat => (
              <button key={cat} className={`seg-btn${category === cat ? ' active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div className="input-icon" style={{ marginLeft: 8 }}>
            <I.search size={13} />
            <input className="input" placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
          </div>
          {search && <button className="icon-btn" onClick={() => setSearch('')}><I.x size={12} /></button>}
          <div className="flex-1" />
          <span className="muted-2" style={{ fontSize: 12 }}>{filtered.length} templates</span>
        </div>

        {/* Template grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(t => (
            <div
              key={t.id}
              className="card"
              style={{ padding: 0, cursor: 'pointer', border: selected?.id === t.id ? '2px solid var(--accent)' : '1px solid var(--border)', transition: 'border .15s' }}
              onClick={() => setSelected(t)}
            >
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-soft)' }}>
                <div className="row gap-2" style={{ marginBottom: 6 }}>
                  <span className="tag-chip" style={{ fontSize: 10 }}>{t.category}</span>
                  <StatusPill status={t.status} />
                  <div className="flex-1" />
                  <span className="muted-2" style={{ fontSize: 10 }}>{t.updatedAt}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
              </div>

              {/* Preview bubble */}
              <div style={{ padding: '10px 14px', background: 'var(--bg)', minHeight: 70 }}>
                {channel === 'wa' && (
                  <div style={{ background: '#1F2937', borderRadius: '4px 12px 12px 12px', padding: '8px 12px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, maxWidth: '90%' }}>
                    {t.preview.length > 110 ? t.preview.slice(0, 110) + '…' : t.preview}
                  </div>
                )}
                {channel === 'email' && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    {t.preview.length > 110 ? t.preview.slice(0, 110) + '…' : t.preview}
                  </div>
                )}
                {channel === 'sms' && (
                  <div style={{ background: '#374151', borderRadius: '4px 12px 12px 12px', padding: '8px 12px', fontSize: 12, color: '#D1D5DB', lineHeight: 1.5, maxWidth: '85%' }}>
                    {t.preview}
                  </div>
                )}
              </div>

              <div className="row gap-2" style={{ padding: '8px 14px', borderTop: '1px solid var(--border-soft)' }}>
                {t.variables.length > 0 && (
                  <div className="row gap-1 flex-1" style={{ flexWrap: 'wrap' }}>
                    {t.variables.slice(0, 3).map(v => (
                      <span key={v} style={{ fontSize: 10, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent-2)', padding: '1px 5px', borderRadius: 4 }}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                    {t.variables.length > 3 && <span className="muted-2" style={{ fontSize: 10 }}>+{t.variables.length - 3}</span>}
                  </div>
                )}
                <div className="flex-1" />
                {t.usedIn > 0 && <span className="muted-2" style={{ fontSize: 10 }}>Used in {t.usedIn}</span>}
                <button className="icon-btn" style={{ width: 24, height: 24 }} title="Duplicate" onClick={e => { e.stopPropagation(); handleDuplicate(t) }}><I.copy size={12} /></button>
                <button className="icon-btn" style={{ width: 24, height: 24 }} title="Delete" onClick={e => { e.stopPropagation(); handleDelete(t.id) }}><I.x size={12} /></button>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div
            className="card"
            style={{ padding: 0, border: '1px dashed var(--border)', cursor: 'pointer', minHeight: 180 }}
            onClick={() => { if (channel === 'wa') { setView('builder') } else { setForm({ ...BLANK, channel }); setShowNew(true) } }}
          >
            <div className="col gap-2" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.plus size={18} className="muted-2" />
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>New {channel === 'wa' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS'} template</div>
              {channel === 'wa' && <div className="muted-2" style={{ fontSize: 11, textAlign: 'center' }}>Opens full template builder</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Template detail panel */}
      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-header">
            <div className="col flex-1" style={{ gap: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{selected.name}</div>
              <div className="row gap-2"><StatusPill status={selected.status} /><span className="tag-chip">{selected.category}</span></div>
            </div>
            <button className="icon-btn" onClick={() => setSelected(null)}><I.x size={14} /></button>
          </div>

          <div className="detail-section">
            <div className="row gap-2">
              <button className="btn sm primary" style={{ flex: 1 }} onClick={() => { if (selected.channel === 'wa') setView('builder'); setSelected(null) }}><I.pencil size={12} /> Edit</button>
              <button className="btn sm" style={{ flex: 1 }} onClick={() => { handleDuplicate(selected); setSelected(null) }}><I.copy size={12} /> Duplicate</button>
              <button className="btn sm ghost" onClick={() => handleDelete(selected.id)}><I.x size={12} /></button>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Preview</div>
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-2)', border: '1px solid var(--border-soft)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {selected.preview}
            </div>
          </div>

          {selected.variables.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">Variables</div>
              <div className="col gap-1">
                {selected.variables.map(v => (
                  <div key={v} className="row gap-2" style={{ fontSize: 12 }}>
                    <code style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent-2)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{`{{${v}}}`}</code>
                    <span className="muted-2">→ replace at send time</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">Details</div>
            <div className="detail-row"><span>Channel</span><span>{selected.channel === 'wa' ? 'WhatsApp' : selected.channel === 'email' ? 'Email' : 'SMS'}</span></div>
            <div className="detail-row"><span>Category</span><span>{selected.category}</span></div>
            <div className="detail-row"><span>Updated</span><span>{selected.updatedAt}</span></div>
            <div className="detail-row"><span>Used in</span><span>{selected.usedIn} campaign{selected.usedIn !== 1 ? 's' : ''}</span></div>
          </div>

          {selected.status === 'rejected' && (
            <div className="detail-section">
              <div style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, marginBottom: 4 }}>Rejected by Meta</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Reason: Template contains promotional content not allowed in this category. Edit and resubmit.</div>
                <button className="btn sm" style={{ marginTop: 8 }}><I.pencil size={11} /> Edit & resubmit</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email / SMS modal (simple) */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-card" style={{ width: 540 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>New {form.channel === 'email' ? 'Email' : 'SMS'} Template</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowNew(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="form-field">
                <label>Template name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome email" />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 13 }}>
                  {(form.channel === 'email' ? ['Newsletter','Promotional','Transactional'] : ['Marketing','Transactional']).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Message body *</label>
                <textarea
                  className="input"
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  placeholder={form.channel === 'email' ? 'Subject: Your subject here\n\nHi {{first_name}},\n\nEmail body here…' : 'Hi {{first_name}}, your message here.'}
                  style={{ resize: 'vertical', minHeight: 120, fontFamily: 'inherit' }}
                />
                <div className="muted-2" style={{ fontSize: 11 }}>Use {'{{variable_name}}'} for dynamic content</div>
              </div>
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn primary" onClick={handleSimpleCreate}><I.plus size={13} /> Save template</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
