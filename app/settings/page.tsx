'use client'

import { useState } from 'react'
import { I } from '@/components/icons'
import { Topbar } from '@/components/CRMShell'

const SECTIONS = [
  { group: 'Account', items: [
    { id: 'business',     label: 'Business Profile',   icon: 'building' },
    { id: 'branding',     label: 'Branding',           icon: 'swatch' },
    { id: 'team',         label: 'Team & Roles',       icon: 'contact' },
    { id: 'billing',      label: 'Billing & Plan',     icon: 'payments' },
  ]},
  { group: 'Channels', items: [
    { id: 'whatsapp',     label: 'WhatsApp Business',  icon: 'wa' },
    { id: 'email',        label: 'Email (SMTP)',        icon: 'mail' },
    { id: 'sms',          label: 'SMS / Twilio',       icon: 'phone' },
    { id: 'google',       label: 'Google Business',    icon: 'reviews' },
  ]},
  { group: 'CRM', items: [
    { id: 'pipelines',    label: 'Pipelines & Stages', icon: 'pipeline' },
    { id: 'customfields', label: 'Custom Fields',      icon: 'tag' },
    { id: 'tags',         label: 'Tags & Segments',    icon: 'tag' },
  ]},
  { group: 'Automation', items: [
    { id: 'notifications',label: 'Notifications',      icon: 'bell' },
    { id: 'webhooks',     label: 'Webhooks',           icon: 'flow' },
    { id: 'api',          label: 'API Keys',           icon: 'shield' },
  ]},
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start', padding: '16px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <div style={{ fontSize: 13, fontWeight: 500, paddingTop: 8 }}>{label}</div>
      <div>{children}</div>
    </div>
  )
}

function SectionWrap({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
        {subtitle && <p className="muted-2" style={{ fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="row gap-2" style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
      <div className="flex-1" />
      <button className="btn">Discard</button>
      <button className="btn primary" onClick={onSave}><I.check size={13} /> Save changes</button>
    </div>
  )
}

function BusinessSection({ showToast }: { showToast: (m: string) => void }) {
  const [form, setForm] = useState({ name: 'Acme Marketing', email: 'hello@acmemarketing.io', phone: '+91 98100 00001', website: 'acmemarketing.io', address: '204, Bandra West, Mumbai — 400050', timezone: 'Asia/Kolkata', currency: 'INR' })
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <SectionWrap title="Business Profile" subtitle="Basic information about your sub-account.">
      <Field label="Business name"><input className="input" value={form.name} onChange={f('name')} /></Field>
      <Field label="Contact email"><input className="input" type="email" value={form.email} onChange={f('email')} /></Field>
      <Field label="Phone number"><input className="input" value={form.phone} onChange={f('phone')} /></Field>
      <Field label="Website"><input className="input" value={form.website} onChange={f('website')} /></Field>
      <Field label="Address"><textarea className="input" value={form.address} onChange={f('address')} style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} /></Field>
      <Field label="Timezone">
        <select className="input" value={form.timezone} onChange={f('timezone')} style={{ background: 'var(--surface-2)' }}>
          {['Asia/Kolkata','Asia/Dubai','Asia/Singapore','Europe/London','America/New_York','America/Los_Angeles'].map(tz => <option key={tz}>{tz}</option>)}
        </select>
      </Field>
      <Field label="Currency">
        <select className="input" value={form.currency} onChange={f('currency')} style={{ background: 'var(--surface-2)' }}>
          {['INR','USD','EUR','GBP','AED','SGD'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <SaveBar onSave={() => showToast('Business profile saved')} />
    </SectionWrap>
  )
}

function BrandingSection({ showToast }: { showToast: (m: string) => void }) {
  const [color, setColor] = useState('#6366F1')
  return (
    <SectionWrap title="Branding" subtitle="Customize how your brand appears across PhantomCore.">
      <Field label="Brand logo">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22 }}>A</div>
          <div className="col gap-2">
            <button className="btn sm"><I.upload size={12} /> Upload logo</button>
            <span className="muted-2" style={{ fontSize: 11 }}>PNG or SVG · 512×512 recommended</span>
          </div>
        </div>
      </Field>
      <Field label="Brand colour">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8 }} />
          <input className="input" value={color} onChange={e => setColor(e.target.value)} style={{ width: 120 }} />
          <div style={{ width: 40, height: 40, borderRadius: 8, background: color }} />
        </div>
      </Field>
      <Field label="Agency name">
        <input className="input" defaultValue="PhantomCore Agency" />
        <div className="muted-2" style={{ fontSize: 11, marginTop: 6 }}>Shown in the top-left agency switcher</div>
      </Field>
      <Field label="Favicon">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>P</div>
          <button className="btn sm"><I.upload size={12} /> Upload favicon</button>
        </div>
      </Field>
      <SaveBar onSave={() => showToast('Branding saved')} />
    </SectionWrap>
  )
}

function TeamSection({ showToast }: { showToast: (m: string) => void }) {
  const [members, setMembers] = useState([
    { id: 1, name: 'Riya Acharya', email: 'riya@acme.io',  role: 'Admin',  initials: 'RA', active: true },
    { id: 2, name: 'Aman Dubey',   email: 'aman@acme.io',  role: 'Member', initials: 'AD', active: true },
    { id: 3, name: 'Nikhil Kumar', email: 'nk@acme.io',    role: 'Member', initials: 'NK', active: true },
    { id: 4, name: 'Priya S.',     email: 'priya@acme.io', role: 'Viewer', initials: 'PS', active: false },
  ])
  const [showInvite, setShowInvite] = useState(false)
  const [invite, setInvite] = useState({ email: '', role: 'Member' })
  return (
    <SectionWrap title="Team & Roles" subtitle="Manage who has access to this sub-account.">
      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <div className="row gap-2" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{members.length} members</span>
          <div className="flex-1" />
          <button className="btn sm primary" onClick={() => setShowInvite(true)}><I.plus size={12} /> Invite user</button>
        </div>
        <table className="table">
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id}>
                <td>
                  <div className="row gap-3">
                    <div className="avatar sm" style={{ background: `hsl(${i * 67 % 360},45%,42%)` }}>{m.initials}</div>
                    <div className="col" style={{ lineHeight: 1.3 }}>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</span>
                      <span className="muted-2" style={{ fontSize: 11 }}>{m.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <select defaultValue={m.role} style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
                    <option>Admin</option><option>Member</option><option>Viewer</option>
                  </select>
                </td>
                <td>{m.active ? <span className="pill green"><span className="dot pulse" style={{ background: '#22C55E' }} /> Active</span> : <span className="pill amber"><I.clock size={10} /> Invited</span>}</td>
                <td><button className="icon-btn" onClick={() => { setMembers(p => p.filter(u => u.id !== m.id)); showToast('User removed') }}><I.x size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showInvite && (
        <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16 }} className="col gap-3">
          <div style={{ fontWeight: 600, fontSize: 13 }}>Invite a team member</div>
          <div className="row gap-2">
            <input className="input flex-1" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} placeholder="colleague@company.com" type="email" />
            <select className="input" style={{ width: 140, background: 'var(--surface)' }} value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value })}>
              <option>Admin</option><option>Member</option><option>Viewer</option>
            </select>
            <button className="btn primary sm" onClick={() => {
              if (!invite.email) return
              setMembers(p => [...p, { id: Date.now(), name: invite.email.split('@')[0], email: invite.email, role: invite.role, initials: invite.email.slice(0,2).toUpperCase(), active: false }])
              setInvite({ email: '', role: 'Member' }); setShowInvite(false); showToast('Invite sent')
            }}><I.send size={12} /> Send</button>
            <button className="btn sm" onClick={() => setShowInvite(false)}><I.x size={12} /></button>
          </div>
          <div className="muted-2" style={{ fontSize: 11 }}>Admin: full access · Member: no billing/settings · Viewer: read-only</div>
        </div>
      )}
    </SectionWrap>
  )
}

function BillingSection({ showToast }: { showToast: (m: string) => void }) {
  return (
    <SectionWrap title="Billing & Plan" subtitle="Manage your subscription and usage.">
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16, background: 'linear-gradient(135deg,color-mix(in srgb,var(--accent) 12%,var(--surface)),var(--surface))' }}>
        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div className="col flex-1 gap-1">
            <div className="muted-2" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Current plan</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Pro · Annual</div>
            <div className="muted-2" style={{ fontSize: 12 }}>Renews May 12, 2027 · ₹18,000/yr</div>
          </div>
          <span className="pill green">Active</span>
        </div>
      </div>
      <div className="row gap-3" style={{ marginBottom: 20 }}>
        {[{ label: 'Contacts', used: 12482, limit: 25000 }, { label: 'WA conversations', used: 8240, limit: 10000 }, { label: 'Email sends', used: 48210, limit: 100000 }, { label: 'Team members', used: 4, limit: 10 }].map(u => (
          <div key={u.label} className="card flex-1" style={{ padding: '12px 14px' }}>
            <div className="muted-2" style={{ fontSize: 11 }}>{u.label}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{u.used.toLocaleString()}</div>
            <div style={{ marginTop: 6, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(u.used / u.limit) * 100}%`, height: '100%', background: (u.used / u.limit) > 0.85 ? '#EF4444' : 'var(--accent)' }} />
            </div>
            <div className="muted-2" style={{ fontSize: 10, marginTop: 4 }}>of {u.limit.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <Field label="Payment method">
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <div style={{ padding: '6px 10px', background: 'var(--surface-2)', borderRadius: 6, fontSize: 12 }}>Visa •••• 4242</div>
          <button className="btn sm">Update card</button>
        </div>
      </Field>
      <Field label="Invoices"><button className="btn sm"><I.download size={12} /> Download all</button></Field>
      <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 13, fontWeight: 600 }}>Upgrade to Business</div><div className="muted-2" style={{ fontSize: 12 }}>50K contacts, unlimited seats, white-label</div></div>
        <button className="btn primary"><I.zap size={13} /> Upgrade</button>
      </div>
    </SectionWrap>
  )
}

function WhatsAppSection({ showToast }: { showToast: (m: string) => void }) {
  const [form, setForm] = useState({ businessId: '103829481092834', phoneNumber: '+91 98100 22018', displayName: 'Acme Marketing', verifyToken: 'acme_wh_verify_2026' })
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <SectionWrap title="WhatsApp Business API" subtitle="Connect your Meta Business account to send WhatsApp campaigns and conversations.">
      <div style={{ padding: '12px 16px', background: 'color-mix(in srgb,#22C55E 10%,transparent)', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="dot pulse" style={{ background: '#22C55E' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Connected — WhatsApp Business API active</span>
        <div className="flex-1" /><button className="btn sm">Reconnect</button>
      </div>
      <Field label="Business Account ID"><input className="input" value={form.businessId} onChange={f('businessId')} /></Field>
      <Field label="Access Token">
        <div className="row gap-2"><input className="input flex-1" type="password" defaultValue="EAAGm0..." /><button className="btn sm"><I.eye size={12} /></button></div>
      </Field>
      <Field label="Phone number"><input className="input" value={form.phoneNumber} onChange={f('phoneNumber')} /></Field>
      <Field label="Display name"><input className="input" value={form.displayName} onChange={f('displayName')} /></Field>
      <Field label="Webhook verify token">
        <div className="row gap-2">
          <input className="input flex-1 mono" value={form.verifyToken} readOnly style={{ fontSize: 12 }} />
          <button className="btn sm" onClick={() => { navigator.clipboard?.writeText(form.verifyToken); showToast('Copied!') }}><I.copy size={12} /></button>
        </div>
        <div className="muted-2" style={{ fontSize: 11, marginTop: 6 }}>Webhook URL: <code style={{ fontSize: 10 }}>https://app.phantomcore.io/api/webhooks/whatsapp</code></div>
      </Field>
      <SaveBar onSave={() => showToast('WhatsApp settings saved')} />
    </SectionWrap>
  )
}

function EmailSection({ showToast }: { showToast: (m: string) => void }) {
  const [provider, setProvider] = useState('smtp')
  const [form, setForm] = useState({ host: 'smtp.sendgrid.net', port: '587', from: 'hello@acmemarketing.io', fromName: 'Acme Marketing' })
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <SectionWrap title="Email (SMTP)" subtitle="Configure your sending domain for email campaigns and transactional emails.">
      <Field label="Provider">
        <div className="row gap-1 segment">
          {['smtp','sendgrid','mailgun','ses'].map(p => <button key={p} className={`seg-btn${provider === p ? ' active' : ''}`} onClick={() => setProvider(p)}>{p === 'ses' ? 'Amazon SES' : p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
        </div>
      </Field>
      <Field label="SMTP host"><input className="input" value={form.host} onChange={f('host')} /></Field>
      <Field label="SMTP port"><input className="input" value={form.port} onChange={f('port')} style={{ width: 100 }} /></Field>
      <Field label="Username / API key"><input className="input" defaultValue="apikey" /></Field>
      <Field label="From email"><input className="input" type="email" value={form.from} onChange={f('from')} /></Field>
      <Field label="From name"><input className="input" value={form.fromName} onChange={f('fromName')} /></Field>
      <Field label="Domain verification">
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }} className="col gap-2">
          <div className="row gap-2" style={{ fontSize: 12 }}><span className="pill green"><I.check size={10} /> SPF</span><span className="muted-2">acmemarketing.io → verified</span></div>
          <div className="row gap-2" style={{ fontSize: 12 }}><span className="pill green"><I.check size={10} /> DKIM</span><span className="muted-2">pm._domainkey → verified</span></div>
          <div className="row gap-2" style={{ fontSize: 12 }}><span className="pill amber"><I.clock size={10} /> DMARC</span><span className="muted-2">Pending — check DNS</span></div>
        </div>
      </Field>
      <SaveBar onSave={() => showToast('Email settings saved')} />
    </SectionWrap>
  )
}

function SMSSection({ showToast }: { showToast: (m: string) => void }) {
  const [form, setForm] = useState({ accountSid: 'ACab12...', fromNumber: '+1 415 000 0001', region: 'India (Twilio)' })
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <SectionWrap title="SMS / Twilio" subtitle="Send SMS campaigns and transactional messages via Twilio.">
      <Field label="Account SID"><input className="input" value={form.accountSid} onChange={f('accountSid')} /></Field>
      <Field label="Auth token"><div className="row gap-2"><input className="input flex-1" type="password" placeholder="••••••••••••" /><button className="btn sm"><I.eye size={12} /></button></div></Field>
      <Field label="From number"><input className="input" value={form.fromNumber} onChange={f('fromNumber')} /></Field>
      <Field label="Region / sender ID">
        <select className="input" style={{ background: 'var(--surface-2)' }} value={form.region} onChange={f('region')}>
          {['India (Twilio)','India (TRAI DLT)','US/Canada','UK','Australia','Singapore'].map(r => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="DLT registration">
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }} className="col gap-1">
          <div className="row gap-2" style={{ fontSize: 12 }}><I.check size={12} style={{ color: '#22C55E' }} /><span>Principal Entity ID: <b>110200001234567</b></span></div>
          <div className="row gap-2" style={{ fontSize: 12 }}><I.check size={12} style={{ color: '#22C55E' }} /><span>Content templates registered: <b>6</b></span></div>
        </div>
      </Field>
      <SaveBar onSave={() => showToast('SMS settings saved')} />
    </SectionWrap>
  )
}

function GoogleSection({ showToast }: { showToast: (m: string) => void }) {
  return (
    <SectionWrap title="Google Business Profile" subtitle="Connect Google My Business to sync reviews and send review requests.">
      <div style={{ padding: '12px 16px', background: 'color-mix(in srgb,#22C55E 10%,transparent)', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="dot pulse" style={{ background: '#22C55E' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Connected — Acme Marketing (4.7 ★ · 284 reviews)</span>
        <div className="flex-1" /><button className="btn sm">Disconnect</button>
      </div>
      <Field label="Business name"><input className="input" defaultValue="Acme Marketing" readOnly /></Field>
      <Field label="Location ID"><input className="input" defaultValue="ChIJrTLr-GyuEmsRBfy61i59si4" readOnly /></Field>
      <Field label="Auto-sync reviews">
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <div style={{ width: 40, height: 22, background: '#22C55E', borderRadius: 11, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, background: '#fff', borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: 13 }}>Sync every hour</span>
        </div>
      </Field>
      <Field label="Review request delay">
        <select className="input" defaultValue="3 days after close" style={{ background: 'var(--surface-2)' }}>
          {['Immediately','1 day after close','3 days after close','7 days after close'].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Request channel">
        <div className="row gap-1 segment">
          <button className="seg-btn active"><I.wa size={11} /> WhatsApp</button>
          <button className="seg-btn"><I.mail size={11} /> Email</button>
          <button className="seg-btn"><I.phone size={11} /> SMS</button>
        </div>
      </Field>
      <SaveBar onSave={() => showToast('Google settings saved')} />
    </SectionWrap>
  )
}

function PipelinesSection({ showToast }: { showToast: (m: string) => void }) {
  const [stages, setStages] = useState([
    { id: 1, name: 'New Lead',      color: '#6C7187', probability: 10 },
    { id: 2, name: 'Contacted',     color: '#3B82F6', probability: 25 },
    { id: 3, name: 'Qualified',     color: '#A78BFA', probability: 50 },
    { id: 4, name: 'Proposal Sent', color: '#EC4899', probability: 70 },
    { id: 5, name: 'Won',           color: '#22C55E', probability: 100 },
  ])
  const [newStage, setNewStage] = useState({ name: '', color: '#6366F1', probability: 50 })
  return (
    <SectionWrap title="Pipelines & Stages" subtitle="Configure the stages in your Lead Management pipeline.">
      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>Inbound — SaaS</div>
        {stages.map(s => (
          <div key={s.id} className="row gap-3" style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-soft)', alignItems: 'center' }}>
            <I.drag size={14} className="muted-2" style={{ cursor: 'grab', flexShrink: 0 }} />
            <input type="color" value={s.color} onChange={e => setStages(p => p.map(st => st.id === s.id ? { ...st, color: e.target.value } : st))} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6 }} />
            <input className="input flex-1" value={s.name} onChange={e => setStages(p => p.map(st => st.id === s.id ? { ...st, name: e.target.value } : st))} />
            <div className="row gap-1" style={{ alignItems: 'center' }}>
              <span className="muted-2" style={{ fontSize: 11 }}>Win prob</span>
              <input type="number" min={0} max={100} className="input mono" style={{ width: 60 }} value={s.probability} onChange={e => setStages(p => p.map(st => st.id === s.id ? { ...st, probability: Number(e.target.value) } : st))} />
              <span className="muted-2" style={{ fontSize: 11 }}>%</span>
            </div>
            <button className="icon-btn" onClick={() => { setStages(p => p.filter(st => st.id !== s.id)); showToast('Stage removed') }}><I.x size={13} /></button>
          </div>
        ))}
        <div className="row gap-3" style={{ padding: '12px 14px' }}>
          <input className="input flex-1" placeholder="New stage name" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} />
          <button className="btn sm primary" onClick={() => {
            if (!newStage.name.trim()) return
            setStages(p => [...p, { id: Date.now(), ...newStage }])
            setNewStage({ name: '', color: '#6366F1', probability: 50 }); showToast('Stage added')
          }}><I.plus size={12} /> Add stage</button>
        </div>
      </div>
      <SaveBar onSave={() => showToast('Pipeline saved')} />
    </SectionWrap>
  )
}

function CustomFieldsSection({ showToast }: { showToast: (m: string) => void }) {
  const [fields, setFields] = useState([
    { id: 1, name: 'GST Number',      entity: 'Contact', type: 'text' },
    { id: 2, name: 'Sub-brand count', entity: 'Contact', type: 'number' },
    { id: 3, name: 'Industry',        entity: 'Contact', type: 'dropdown' },
    { id: 4, name: 'Contract value',  entity: 'Deal',    type: 'currency' },
    { id: 5, name: 'Signed date',     entity: 'Deal',    type: 'date' },
  ])
  const [form, setForm] = useState({ name: '', entity: 'Contact', type: 'text' })
  return (
    <SectionWrap title="Custom Fields" subtitle="Add custom fields to Contacts and Deals to capture data specific to your business.">
      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <table className="table">
          <thead><tr><th>Field name</th><th>Entity</th><th>Type</th><th></th></tr></thead>
          <tbody>
            {fields.map(f => (
              <tr key={f.id}>
                <td style={{ fontWeight: 500 }}>{f.name}</td>
                <td><span className={`pill ${f.entity === 'Contact' ? 'blue' : 'violet'}`}>{f.entity}</span></td>
                <td className="muted" style={{ textTransform: 'capitalize' }}>{f.type}</td>
                <td><button className="icon-btn" onClick={() => { setFields(p => p.filter(x => x.id !== f.id)); showToast('Field deleted') }}><I.x size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row gap-2" style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <input className="input flex-1" placeholder="Field name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className="input" style={{ width: 110, background: 'var(--surface-2)' }} value={form.entity} onChange={e => setForm({ ...form, entity: e.target.value })}><option>Contact</option><option>Deal</option></select>
          <select className="input" style={{ width: 120, background: 'var(--surface-2)' }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {['text','number','date','dropdown','checkbox','currency','url'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn sm primary" onClick={() => { if (!form.name.trim()) return; setFields(p => [...p, { id: Date.now(), ...form }]); setForm({ name: '', entity: 'Contact', type: 'text' }); showToast('Custom field added') }}><I.plus size={12} /> Add</button>
        </div>
      </div>
    </SectionWrap>
  )
}

function TagsSection({ showToast }: { showToast: (m: string) => void }) {
  const [tags, setTags] = useState(['hot-lead','enterprise','newsletter','mumbai','demo-booked','agency','trial','intl','churned','event-2026','vip','beta'])
  const [input, setInput] = useState('')
  function addTag() { if (!input.trim()) return; setTags(p => [...p, input.trim()]); setInput(''); showToast('Tag added') }
  return (
    <SectionWrap title="Tags & Segments" subtitle="Manage tags used across contacts and deals.">
      <div className="row gap-2" style={{ marginBottom: 16 }}>
        <input className="input flex-1" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="New tag name, press Enter to add" />
        <button className="btn sm primary" onClick={addTag}><I.plus size={12} /> Add</button>
      </div>
      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
        {tags.map(t => (
          <div key={t} className="row gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 10px', alignItems: 'center' }}>
            <span style={{ fontSize: 12 }}>#{t}</span>
            <button className="icon-btn" style={{ width: 16, height: 16 }} onClick={() => { setTags(p => p.filter(x => x !== t)); showToast(`Tag "${t}" deleted`) }}><I.x size={10} /></button>
          </div>
        ))}
      </div>
    </SectionWrap>
  )
}

function NotificationsSection({ showToast }: { showToast: (m: string) => void }) {
  const rows = [
    { key: 'newLead',          label: 'New lead created' },
    { key: 'dealWon',          label: 'Deal marked as won' },
    { key: 'convAssigned',     label: 'Conversation assigned to me' },
    { key: 'reviewReceived',   label: 'New Google review received' },
    { key: 'campaignComplete', label: 'Campaign finished sending' },
  ]
  const [prefs, setPrefs] = useState<Record<string, Record<string, boolean>>>({
    newLead: { email: true, wa: true, inApp: true },
    dealWon: { email: true, wa: true, inApp: true },
    convAssigned: { email: false, wa: true, inApp: true },
    reviewReceived: { email: true, wa: false, inApp: true },
    campaignComplete: { email: true, wa: false, inApp: false },
  })
  function toggle(key: string, ch: string) { setPrefs(p => ({ ...p, [key]: { ...p[key], [ch]: !p[key][ch] } })) }
  return (
    <SectionWrap title="Notifications" subtitle="Choose when and how you get notified.">
      <div className="card" style={{ padding: 0 }}>
        <div className="row gap-2" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>
          <span style={{ flex: 1 }}>Event</span>
          {['Email','WhatsApp','In-app'].map(ch => <span key={ch} style={{ width: 80, textAlign: 'center' }}>{ch}</span>)}
        </div>
        {rows.map(r => (
          <div key={r.key} className="row gap-2" style={{ padding: '13px 14px', borderBottom: '1px solid var(--border-soft)', alignItems: 'center' }}>
            <span style={{ flex: 1, fontSize: 13 }}>{r.label}</span>
            {['email','wa','inApp'].map(ch => (
              <div key={ch} style={{ width: 80, display: 'flex', justifyContent: 'center' }}>
                <div onClick={() => toggle(r.key, ch)} style={{ width: 38, height: 20, background: prefs[r.key][ch] ? '#22C55E' : 'var(--surface-2)', borderRadius: 10, position: 'relative', cursor: 'pointer', transition: 'background .2s', border: '1px solid var(--border)' }}>
                  <div style={{ position: 'absolute', top: 2, left: prefs[r.key][ch] ? 18 : 2, width: 14, height: 14, background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <SaveBar onSave={() => showToast('Notification preferences saved')} />
    </SectionWrap>
  )
}

function WebhooksSection({ showToast }: { showToast: (m: string) => void }) {
  const [hooks, setHooks] = useState([
    { id: 1, url: 'https://n8n.acme.io/webhook/crm',       events: ['contact.created','deal.won'], active: true },
    { id: 2, url: 'https://hooks.zapier.com/hooks/catch/…', events: ['campaign.completed'],         active: false },
  ])
  const [url, setUrl] = useState('')
  return (
    <SectionWrap title="Webhooks" subtitle="Send real-time event payloads to external URLs.">
      <div className="col gap-3">
        {hooks.map(h => (
          <div key={h.id} className="card" style={{ padding: '14px 16px' }}>
            <div className="row gap-2" style={{ alignItems: 'center' }}>
              <code style={{ fontSize: 12, flex: 1, color: 'var(--text-2)' }}>{h.url}</code>
              <span className={`pill ${h.active ? 'green' : ''}`}>{h.active ? 'Active' : 'Inactive'}</span>
              <button className="icon-btn" onClick={() => { setHooks(p => p.filter(x => x.id !== h.id)); showToast('Webhook removed') }}><I.x size={13} /></button>
            </div>
            <div className="row gap-1" style={{ marginTop: 8, flexWrap: 'wrap' }}>
              {h.events.map(e => <span key={e} className="tag-chip" style={{ fontSize: 10 }}>{e}</span>)}
            </div>
          </div>
        ))}
        <div className="row gap-2">
          <input className="input flex-1" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-server.com/webhook" />
          <button className="btn sm primary" onClick={() => { if (!url.trim()) return; setHooks(p => [...p, { id: Date.now(), url, events: ['contact.created'], active: true }]); setUrl(''); showToast('Webhook added') }}><I.plus size={12} /> Add</button>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div className="muted-2" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Available events</div>
          <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
            {['contact.created','contact.updated','deal.created','deal.stage_changed','deal.won','campaign.completed','review.received','conversation.assigned'].map(e => <span key={e} className="tag-chip" style={{ fontSize: 10 }}>{e}</span>)}
          </div>
        </div>
      </div>
    </SectionWrap>
  )
}

function APISection({ showToast }: { showToast: (m: string) => void }) {
  const [visible, setVisible] = useState(false)
  const key = 'pc_live_sk_aAbB12cCdD34eEfF56gGhH78iIjJ90kK'
  return (
    <SectionWrap title="API Keys" subtitle="Use the PhantomCore API to integrate with your own systems.">
      <Field label="API base URL"><code style={{ fontSize: 12, color: 'var(--text-2)' }}>https://api.phantomcore.io/v1</code></Field>
      <Field label="Secret key">
        <div className="row gap-2">
          <input className="input flex-1 mono" value={visible ? key : '•'.repeat(40)} readOnly style={{ fontSize: 12 }} />
          <button className="btn sm" onClick={() => setVisible(v => !v)}><I.eye size={12} /> {visible ? 'Hide' : 'Show'}</button>
          <button className="btn sm" onClick={() => { navigator.clipboard?.writeText(key); showToast('API key copied!') }}><I.copy size={12} /> Copy</button>
        </div>
        <div className="muted-2" style={{ fontSize: 11, marginTop: 6 }}>Never share your secret key. Rotate it if compromised.</div>
      </Field>
      <Field label="Rotate key">
        <button className="btn sm" style={{ color: '#EF4444' }} onClick={() => showToast('Key rotated — update your integrations')}><I.refresh size={12} /> Rotate key</button>
      </Field>
      <div className="card" style={{ padding: 14, marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Quick start</div>
        <pre style={{ fontSize: 11, color: 'var(--text-2)', overflowX: 'auto', lineHeight: 1.6, margin: 0 }}>{`curl https://api.phantomcore.io/v1/contacts \\\n  -H "Authorization: Bearer ${visible ? key : 'YOUR_API_KEY'}" \\\n  -H "Content-Type: application/json"`}</pre>
      </div>
    </SectionWrap>
  )
}

const SECTION_MAP: Record<string, (p: { showToast: (m: string) => void }) => React.ReactNode> = {
  business: BusinessSection, branding: BrandingSection, team: TeamSection, billing: BillingSection,
  whatsapp: WhatsAppSection, email: EmailSection, sms: SMSSection, google: GoogleSection,
  pipelines: PipelinesSection, customfields: CustomFieldsSection, tags: TagsSection,
  notifications: NotificationsSection, webhooks: WebhooksSection, api: APISection,
}

export default function SettingsPage() {
  const [active, setActive] = useState('business')
  const [toast, setToast] = useState('')
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const SectionComp = SECTION_MAP[active]

  return (
    <>
      <Topbar title="Settings" subtitle="Account, channels, and integrations" />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden', height: '100%' }}>
        <aside style={{ borderRight: '1px solid var(--border)', padding: '16px 10px', overflowY: 'auto' }}>
          {SECTIONS.map(group => (
            <div key={group.group}>
              <div className="nav-section-label" style={{ padding: '10px 10px 4px' }}>{group.group}</div>
              <div className="col gap-1">
                {group.items.map(item => {
                  const Ico = I[item.icon]
                  return (
                    <button key={item.id} className={`nav-item${active === item.id ? ' active' : ''}`} onClick={() => setActive(item.id)}>
                      {Ico && <Ico size={14} />}
                      <span className="flex-1" style={{ textAlign: 'left', fontSize: 13 }}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </aside>
        <div style={{ overflowY: 'auto', padding: '28px 36px' }}>
          {SectionComp && <SectionComp showToast={showToast} />}
        </div>
      </div>
      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
