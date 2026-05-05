'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Template = {
  id: number; name: string; channel: 'wa' | 'email' | 'sms'
  category: string; status: 'approved' | 'pending' | 'rejected' | 'draft'
  preview: string; variables: string[]; updatedAt: string; usedIn: number
}

const INITIAL_TEMPLATES: Template[] = [
  // WhatsApp
  { id: 1,  channel: 'wa',    category: 'Marketing',      status: 'approved', name: 'Welcome to {{company_name}}',     preview: 'Hi {{first_name}}! 👋 Welcome to {{company_name}}. Your account is ready. Reply HELP for assistance.',                          variables: ['first_name','company_name'], updatedAt: 'Apr 28', usedIn: 3 },
  { id: 2,  channel: 'wa',    category: 'Marketing',      status: 'approved', name: 'Trial expiry reminder',           preview: 'Hi {{first_name}}, your {{plan_name}} trial ends in {{days_left}} days. Upgrade now to keep your data: {{upgrade_link}}',       variables: ['first_name','plan_name','days_left','upgrade_link'], updatedAt: 'Apr 25', usedIn: 1 },
  { id: 3,  channel: 'wa',    category: 'Utility',        status: 'approved', name: 'OTP verification',                preview: 'Your {{company_name}} verification code is *{{otp_code}}*. Valid for 10 minutes. Do not share this code.',                       variables: ['company_name','otp_code'], updatedAt: 'Apr 22', usedIn: 5 },
  { id: 4,  channel: 'wa',    category: 'Utility',        status: 'approved', name: 'Appointment reminder',            preview: 'Hi {{first_name}}! Reminder: your call with {{agent_name}} is scheduled for {{date_time}} IST. Reply 1 to confirm, 2 to reschedule.', variables: ['first_name','agent_name','date_time'], updatedAt: 'Apr 20', usedIn: 2 },
  { id: 5,  channel: 'wa',    category: 'Marketing',      status: 'pending',  name: 'Cart recovery',                   preview: 'Hey {{first_name}} 👀 You left something behind! Complete your order for {{product_name}} before it sells out: {{cart_link}}',   variables: ['first_name','product_name','cart_link'], updatedAt: 'May 1', usedIn: 0 },
  { id: 6,  channel: 'wa',    category: 'Authentication', status: 'approved', name: 'Password reset',                  preview: 'Your {{company_name}} password reset link: {{reset_link}} — valid for 30 minutes.',                                            variables: ['company_name','reset_link'], updatedAt: 'Apr 10', usedIn: 1 },
  { id: 7,  channel: 'wa',    category: 'Marketing',      status: 'rejected', name: 'Flash sale promo',                preview: 'FLASH SALE 🔥 {{discount}}% OFF everything today only! Use code {{promo_code}} at checkout.',                                    variables: ['discount','promo_code'], updatedAt: 'Apr 18', usedIn: 0 },
  // Email
  { id: 8,  channel: 'email', category: 'Newsletter',     status: 'draft',    name: 'Monthly product update',          preview: 'Hi {{first_name}}, here\'s what\'s new at {{company_name}} this month. We shipped {{feature_count}} new features...',           variables: ['first_name','company_name','feature_count'], updatedAt: 'May 2', usedIn: 0 },
  { id: 9,  channel: 'email', category: 'Promotional',    status: 'approved', name: 'Spring Promo 2026',               preview: 'Subject: 🌸 Spring into savings — 30% off Pro plans\n\nHi {{first_name}}, Spring is here and we\'re celebrating...',            variables: ['first_name'], updatedAt: 'Apr 22', usedIn: 1 },
  { id: 10, channel: 'email', category: 'Transactional',  status: 'approved', name: 'Invoice receipt',                 preview: 'Hi {{first_name}}, your payment of {{amount}} for {{plan_name}} has been received. Invoice #{{invoice_id}} attached.',          variables: ['first_name','amount','plan_name','invoice_id'], updatedAt: 'Apr 14', usedIn: 4 },
  { id: 11, channel: 'email', category: 'Promotional',    status: 'approved', name: 'Webinar invite',                  preview: 'Subject: You\'re invited — {{webinar_title}}\n\nJoin us on {{webinar_date}} for a live demo of our newest features...',          variables: ['webinar_title','webinar_date'], updatedAt: 'Apr 12', usedIn: 1 },
  { id: 12, channel: 'email', category: 'Transactional',  status: 'approved', name: 'Trial welcome',                   preview: 'Welcome aboard, {{first_name}}! Your {{plan_name}} trial is now active. Here\'s how to get started in 3 steps...',              variables: ['first_name','plan_name'], updatedAt: 'Apr 5', usedIn: 2 },
  { id: 13, channel: 'email', category: 'Newsletter',     status: 'draft',    name: 'May launch announcement',         preview: 'Subject: Something big is coming 👀\n\nHi {{first_name}}, we\'ve been working on something exciting...',                          variables: ['first_name'], updatedAt: 'May 2', usedIn: 0 },
  // SMS
  { id: 14, channel: 'sms',   category: 'Transactional',  status: 'approved', name: 'OTP SMS',                         preview: 'Your {{company_name}} OTP is {{otp_code}}. Valid 10 mins. Do not share.',                                                       variables: ['company_name','otp_code'], updatedAt: 'Apr 28', usedIn: 6 },
  { id: 15, channel: 'sms',   category: 'Marketing',      status: 'approved', name: 'Demo confirmation',               preview: 'Hi {{first_name}}! Confirming your demo on {{date_time}}. Reply YES to confirm or NO to reschedule. - {{company_name}}',         variables: ['first_name','date_time','company_name'], updatedAt: 'Apr 24', usedIn: 3 },
  { id: 16, channel: 'sms',   category: 'Marketing',      status: 'approved', name: 'Renewal reminder SMS',            preview: 'Hi {{first_name}}, your {{plan_name}} renews on {{renewal_date}}. Questions? Reply HELP.',                                        variables: ['first_name','plan_name','renewal_date'], updatedAt: 'Apr 18', usedIn: 2 },
  { id: 17, channel: 'sms',   category: 'Marketing',      status: 'draft',    name: 'Reactivation offer',              preview: 'Hey {{first_name}}! We miss you 👋 Come back to {{company_name}} — use code BACK30 for 30% off.',                               variables: ['first_name','company_name'], updatedAt: 'May 1', usedIn: 0 },
]

const WA_CATEGORIES = ['All', 'Marketing', 'Utility', 'Authentication']
const EMAIL_CATEGORIES = ['All', 'Newsletter', 'Promotional', 'Transactional']
const SMS_CATEGORIES = ['All', 'Marketing', 'Transactional']

function StatusPill({ status }: { status: Template['status'] }) {
  if (status === 'approved') return <span className="pill green"><I.check size={10} /> Approved</span>
  if (status === 'pending')  return <span className="pill amber"><I.clock size={10} /> Pending</span>
  if (status === 'rejected') return <span className="pill red"><I.x size={10} /> Rejected</span>
  return <span className="pill"><I.pencil size={10} /> Draft</span>
}

type FormState = { name: string; channel: 'wa' | 'email' | 'sms'; category: string; body: string }
const BLANK: FormState = { name: '', channel: 'wa', category: 'Marketing', body: '' }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [channel, setChannel] = useState<'wa' | 'email' | 'sms'>('wa')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Template | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<FormState>(BLANK)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const cats = channel === 'wa' ? WA_CATEGORIES : channel === 'email' ? EMAIL_CATEGORIES : SMS_CATEGORIES

  const filtered = templates.filter(t => {
    if (t.channel !== channel) return false
    if (category !== 'All' && t.category !== category) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleCreate() {
    if (!form.name.trim() || !form.body.trim()) return
    const tpl: Template = {
      id: Date.now(), name: form.name, channel: form.channel,
      category: form.category, status: form.channel === 'wa' ? 'pending' : 'draft',
      preview: form.body, variables: [], updatedAt: 'Today', usedIn: 0,
    }
    setTemplates(prev => [tpl, ...prev])
    setForm(BLANK)
    setShowNew(false)
    showToast(form.channel === 'wa' ? 'Template submitted to Meta for approval' : 'Template saved as draft')
  }

  function handleDuplicate(t: Template) {
    setTemplates(prev => [{ ...t, id: Date.now(), name: `${t.name} (copy)`, status: 'draft', usedIn: 0 }, ...prev])
    showToast('Template duplicated')
  }

  function handleDelete(id: number) {
    setTemplates(prev => prev.filter(t => t.id !== id))
    setSelected(null)
    showToast('Template deleted')
  }

  const stats = {
    wa:    { approved: templates.filter(t => t.channel === 'wa'    && t.status === 'approved').length, pending: templates.filter(t => t.channel === 'wa' && t.status === 'pending').length },
    email: { total: templates.filter(t => t.channel === 'email').length },
    sms:   { total: templates.filter(t => t.channel === 'sms').length },
  }

  return (
    <>
      <Topbar
        title="Templates"
        subtitle={`${templates.length} templates across all channels`}
        actions={<>
          <button className="btn"><I.search size={13} /> Browse library</button>
          <button className="btn primary" onClick={() => { setForm({ ...BLANK, channel }); setShowNew(true) }}><I.plus size={14} /> New template</button>
        </>}
      />
      <div className="page">

        {/* Channel tabs */}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map(t => (
            <div
              key={t.id}
              className="card"
              style={{ padding: 0, cursor: 'pointer', border: selected?.id === t.id ? '2px solid var(--accent)' : '1px solid var(--border)', transition: 'border .15s' }}
              onClick={() => setSelected(t)}
            >
              {/* Card header */}
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
                    {t.preview.length > 120 ? t.preview.slice(0, 120) + '…' : t.preview}
                  </div>
                )}
                {channel === 'email' && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    {t.preview.length > 120 ? t.preview.slice(0, 120) + '…' : t.preview}
                  </div>
                )}
                {channel === 'sms' && (
                  <div style={{ background: '#374151', borderRadius: '4px 12px 12px 12px', padding: '8px 12px', fontSize: 12, color: '#D1D5DB', lineHeight: 1.5, maxWidth: '85%' }}>
                    {t.preview}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="row gap-2" style={{ padding: '8px 14px', borderTop: '1px solid var(--border-soft)' }}>
                {t.variables.length > 0 && (
                  <div className="row gap-1" style={{ flex: 1, flexWrap: 'wrap' }}>
                    {t.variables.slice(0, 3).map(v => (
                      <span key={v} style={{ fontSize: 10, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent-2)', padding: '1px 5px', borderRadius: 4 }}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                    {t.variables.length > 3 && <span className="muted-2" style={{ fontSize: 10 }}>+{t.variables.length - 3}</span>}
                  </div>
                )}
                <div className="flex-1" />
                {t.usedIn > 0 && <span className="muted-2" style={{ fontSize: 10 }}>Used in {t.usedIn} campaign{t.usedIn > 1 ? 's' : ''}</span>}
                <button className="icon-btn" style={{ width: 24, height: 24 }} title="Duplicate" onClick={e => { e.stopPropagation(); handleDuplicate(t) }}><I.copy size={12} /></button>
                <button className="icon-btn" style={{ width: 24, height: 24 }} title="Delete" onClick={e => { e.stopPropagation(); handleDelete(t.id) }}><I.x size={12} /></button>
              </div>
            </div>
          ))}

          {/* Empty add card */}
          <div
            className="card"
            style={{ padding: 0, border: '1px dashed var(--border)', cursor: 'pointer', minHeight: 200 }}
            onClick={() => { setForm({ ...BLANK, channel }); setShowNew(true) }}
          >
            <div className="col gap-2" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.plus size={18} className="muted-2" />
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>New {channel === 'wa' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS'} template</div>
              {channel === 'wa' && <div className="muted-2" style={{ fontSize: 11, textAlign: 'center' }}>Submitted to Meta for approval</div>}
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
              <button className="btn sm primary" style={{ flex: 1 }}><I.pencil size={12} /> Edit</button>
              <button className="btn sm" style={{ flex: 1 }} onClick={() => { handleDuplicate(selected); setSelected(null) }}><I.copy size={12} /> Duplicate</button>
              <button className="btn sm ghost" onClick={() => handleDelete(selected.id)}><I.x size={12} /></button>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Preview</div>
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-2)', border: '1px solid var(--border-soft)' }}>
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
            <div className="detail-section" style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, marginBottom: 4 }}>Rejected by Meta</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Reason: Template contains promotional content not allowed in this category. Edit and resubmit.</div>
              <button className="btn sm" style={{ marginTop: 8 }}><I.pencil size={11} /> Edit & resubmit</button>
            </div>
          )}
        </div>
      )}

      {/* New template modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-card" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>New Template</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowNew(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="form-field">
                <label>Template name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome message" />
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Channel</label>
                  <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value as 'wa' | 'email' | 'sms', category: 'Marketing' })}>
                    <option value="wa">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {(form.channel === 'wa' ? ['Marketing','Utility','Authentication'] : form.channel === 'email' ? ['Newsletter','Promotional','Transactional'] : ['Marketing','Transactional']).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Message body *</label>
                <textarea
                  className="input"
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  placeholder={form.channel === 'wa'
                    ? 'Hi {{first_name}}! Welcome to {{company_name}}…'
                    : form.channel === 'email'
                    ? 'Subject: Your subject here\n\nHi {{first_name}},\n\nYour email body here…'
                    : 'Hi {{first_name}}, your message here. - {{company_name}}'
                  }
                  style={{ resize: 'vertical', minHeight: 120, fontFamily: 'inherit' }}
                />
                <div className="muted-2" style={{ fontSize: 11 }}>Use {'{{variable_name}}'} for dynamic content</div>
              </div>
              {form.channel === 'wa' && (
                <div style={{ padding: 10, background: 'color-mix(in srgb, #F59E0B 10%, transparent)', borderRadius: 8, fontSize: 12, color: 'var(--text-2)' }}>
                  <I.clock size={12} style={{ color: '#F59E0B', display: 'inline', marginRight: 6 }} />
                  WhatsApp templates require Meta approval (24–48 hrs) before use.
                </div>
              )}
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn primary" onClick={handleCreate}>
                {form.channel === 'wa' ? <><I.send size={13} /> Submit for approval</> : <><I.plus size={13} /> Save template</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
