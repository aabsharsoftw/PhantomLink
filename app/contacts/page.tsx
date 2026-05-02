'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Contact = {
  id: number; name: string; email: string; phone: string; company: string; title: string
  tags: string[]; owner: string; ownerInitials: string; source: string; created: string
  score: number; status: string; lastActivity: string; notes: string
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 1,  name: 'Sana Iqbal',     email: 'sana@levanta.io',      phone: '+91 98103 22018', company: 'Levanta',       title: 'Head of Growth',   tags: ['hot-lead','mumbai'],         owner: 'Riya Acharya',  ownerInitials: 'RA', source: 'Website',  created: 'Apr 28', score: 92, status: 'open',   lastActivity: '2h ago',  notes: 'Interested in annual plan. Has 3 sub-brands. Decision maker.' },
  { id: 2,  name: 'Rohit Menon',    email: 'rohit@arcwise.app',    phone: '+91 99876 11240', company: 'Arcwise',       title: 'CTO',              tags: ['enterprise'],               owner: 'Aman Dubey',    ownerInitials: 'AD', source: 'Referral', created: 'Apr 28', score: 88, status: 'open',   lastActivity: '14m ago', notes: 'Enterprise pilot. Procurement team involved. High intent.' },
  { id: 3,  name: 'Priya Kulkarni', email: 'priya@northwind.co',   phone: '+91 98201 49832', company: 'Northwind',     title: 'Marketing Lead',   tags: ['newsletter'],               owner: 'Riya Acharya',  ownerInitials: 'RA', source: 'Import',   created: 'Apr 27', score: 64, status: 'open',   lastActivity: '3d ago',  notes: 'Subscribed to newsletter. Passive interest.' },
  { id: 4,  name: 'Vikram Shah',    email: 'v.shah@meridian.in',   phone: '+91 98765 41200', company: 'Meridian Labs', title: 'Founder',          tags: ['hot-lead'],                 owner: 'Nikhil Kumar',  ownerInitials: 'NK', source: 'API',      created: 'Apr 27', score: 81, status: 'open',   lastActivity: '1d ago',  notes: 'Reviewing proposal. Legal sign-off expected May 3.' },
  { id: 5,  name: 'Aditi Rao',      email: 'aditi@orbital.tech',   phone: '+91 90120 84411', company: 'Orbital',       title: 'VP Product',       tags: ['demo-booked'],              owner: 'Aman Dubey',    ownerInitials: 'AD', source: 'Website',  created: 'Apr 26', score: 76, status: 'open',   lastActivity: '1h ago',  notes: 'Demo confirmed for May 2 at 11am. Team of 12 users.' },
  { id: 6,  name: 'Faraz Khan',     email: 'faraz@helio.co',       phone: '+91 99008 12340', company: 'Helio',         title: 'CEO',              tags: ['enterprise','demo-booked'], owner: 'Riya Acharya',  ownerInitials: 'RA', source: 'Referral', created: 'Apr 26', score: 84, status: 'open',   lastActivity: '2h ago',  notes: 'Rescheduling call to Friday 4pm. 200 seat deal.' },
  { id: 7,  name: 'Meera Iyer',     email: 'meera@dunes.studio',   phone: '+91 89765 21034', company: 'Dunes Studio',  title: 'Operations Head',  tags: ['agency'],                   owner: 'Nikhil Kumar',  ownerInitials: 'NK', source: 'Form',     created: 'Apr 25', score: 58, status: 'open',   lastActivity: '6h ago',  notes: 'Agency retainer inquiry. Opted out of SMS.' },
  { id: 8,  name: 'Karan Bhatt',    email: 'karan@flux.app',       phone: '+91 99887 76651', company: 'Flux',          title: 'Growth Manager',   tags: ['hot-lead','trial'],         owner: 'Aman Dubey',    ownerInitials: 'AD', source: 'Campaign', created: 'Apr 25', score: 79, status: 'won',    lastActivity: '3h ago',  notes: 'Closed Apr 28. Annual growth plan.' },
  { id: 9,  name: 'Lina Pereira',   email: 'lina@belvedere.es',    phone: '+34 612 88 04 12', company: 'Belvedere',   title: 'Director',         tags: ['intl','enterprise'],        owner: 'Riya Acharya',  ownerInitials: 'RA', source: 'Website',  created: 'Apr 25', score: 71, status: 'open',   lastActivity: '5h ago',  notes: 'International deal. Contract signing tomorrow. €18K.' },
  { id: 10, name: 'Sahil Mehta',    email: 'sahil@quay.io',        phone: '+91 98000 14422', company: 'Quay',          title: 'Co-founder',       tags: ['churned'],                  owner: 'Nikhil Kumar',  ownerInitials: 'NK', source: 'Import',   created: 'Apr 24', score: 32, status: 'churned','lastActivity': '2w ago', notes: 'Churned 30 days ago. Re-engagement attempted.' },
]

const tagColor: Record<string, string> = {
  'hot-lead': 'red', 'mumbai': 'blue', 'enterprise': 'violet', 'newsletter': '',
  'demo-booked': 'green', 'agency': 'amber', 'trial': 'teal', 'intl': 'pink', 'churned': '',
}

const SMART_LISTS = [
  { name: 'All contacts',       count: 12482, dot: '', filter: 'all' },
  { name: 'Hot leads · Mumbai', count: 284,   dot: '#EF4444', filter: 'hot-lead' },
  { name: 'Demo booked',        count: 42,    dot: '#22C55E', filter: 'demo-booked' },
  { name: 'Enterprise · India', count: 118,   dot: '#A78BFA', filter: 'enterprise' },
  { name: 'Trial — day 7',      count: 96,    dot: '#14B8A6', filter: 'trial' },
  { name: 'Newsletter subs',    count: 8204,  dot: '#3B82F6', filter: 'newsletter' },
  { name: 'Churned (30d)',      count: 212,   dot: '#6C7187', filter: 'churned' },
]

const BLANK = { name: '', email: '', phone: '', company: '', title: '', tags: [] as string[], owner: 'Riya Acharya', ownerInitials: 'RA', source: 'Website', notes: '' }

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS)
  const [search, setSearch] = useState('')
  const [activeList, setActiveList] = useState('all')
  const [selected, setSelected] = useState<Contact | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = contacts.filter(c => {
    const matchSearch = !search || [c.name, c.email, c.company, c.phone].some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchList = activeList === 'all' || c.tags.includes(activeList)
    return matchSearch && matchList
  })

  function handleAdd() {
    if (!form.name.trim()) return
    const newContact: Contact = {
      ...form, id: Date.now(), score: 50, status: 'open',
      created: 'Today', lastActivity: 'just now',
      tags: form.tags,
    }
    setContacts(prev => [newContact, ...prev])
    setForm(BLANK)
    setShowAdd(false)
    showToast('Contact added')
  }

  function handleDelete(id: number) {
    setContacts(prev => prev.filter(c => c.id !== id))
    setSelected(null)
    showToast('Contact deleted')
  }

  function updateScore(contact: Contact, delta: number) {
    const newScore = Math.max(0, Math.min(100, contact.score + delta))
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, score: newScore } : c))
    setSelected(prev => prev ? { ...prev, score: newScore } : prev)
  }

  return (
    <>
      <Topbar
        title="Contacts"
        subtitle={`${filtered.length} of 12,482 visible`}
        actions={<>
          <button className="btn"><I.upload size={14} /> Import</button>
          <button className="btn"><I.download size={14} /> Export</button>
          <button className="btn primary" onClick={() => setShowAdd(true)}><I.plus size={14} /> New contact</button>
        </>}
      />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden', height: '100%' }}>

        {/* Smart list rail */}
        <aside style={{ borderRight: '1px solid var(--border)', padding: '14px 12px', overflow: 'auto' }}>
          <div className="nav-section-label" style={{ padding: '4px 8px' }}>Smart lists</div>
          <div className="col gap-1">
            {SMART_LISTS.map(s => (
              <button key={s.filter} className={`nav-item small${activeList === s.filter ? ' active' : ''}`} onClick={() => setActiveList(s.filter)}>
                {s.dot ? <span className="dot" style={{ background: s.dot }} /> : <I.list size={12} />}
                <span className="flex-1" style={{ textAlign: 'left' }}>{s.name}</span>
                <span className="muted-2" style={{ fontSize: 10 }}>{s.count.toLocaleString()}</span>
              </button>
            ))}
          </div>
          <div className="nav-section-label" style={{ padding: '12px 8px 4px' }}>Static lists</div>
          <div className="col gap-1">
            <button className="nav-item small"><I.list size={12} /><span className="flex-1" style={{ textAlign: 'left' }}>VIP customers</span><span className="muted-2" style={{ fontSize: 10 }}>34</span></button>
            <button className="nav-item small"><I.list size={12} /><span className="flex-1" style={{ textAlign: 'left' }}>Beta program</span><span className="muted-2" style={{ fontSize: 10 }}>120</span></button>
          </div>
          <button className="btn ghost sm" style={{ marginTop: 10, width: '100%', justifyContent: 'flex-start' }} onClick={() => showToast('List feature coming soon')}><I.plus size={12} /> New list</button>
          <div className="nav-section-label" style={{ padding: '14px 8px 4px' }}>Tags</div>
          <div className="row gap-1" style={{ flexWrap: 'wrap', padding: '0 4px' }}>
            {['hot-lead','enterprise','newsletter','mumbai','demo-booked','agency','trial','intl','churned'].map(t =>
              <span key={t} className="tag-chip" style={{ cursor: 'pointer' }} onClick={() => setActiveList(t === activeList ? 'all' : t)}>#{t}</span>
            )}
          </div>
        </aside>

        <div className="col" style={{ minHeight: 0 }}>
          <div className="row gap-2" style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="input-icon flex-1" style={{ maxWidth: 320 }}>
              <I.search size={14} />
              <input className="input" placeholder="Search by name, email, phone, company…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
            </div>
            {search && <button className="btn ghost" onClick={() => setSearch('')}><I.x size={11} /> Clear</button>}
            <div className="flex-1" />
            {activeList !== 'all' && (
              <button className="btn ghost" onClick={() => setActiveList('all')}>
                <I.tag size={13} /> {SMART_LISTS.find(s => s.filter === activeList)?.name || activeList} <I.x size={11} />
              </button>
            )}
            <span className="muted-2" style={{ fontSize: 11 }}>{filtered.length} results</span>
            <button className="icon-btn"><I.refresh size={14} /></button>
          </div>

          <div className="flex-1" style={{ overflow: 'auto' }}>
            <table className="table contacts-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}><input type="checkbox" /></th>
                  <th>Name</th><th>Company</th><th>Tags</th><th>Source</th>
                  <th>Owner</th><th>Score</th><th>Created</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No contacts match your search</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id} className={selected?.id === c.id ? 'row-active' : ''} style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div className="row gap-3">
                        <div className="avatar sm" style={{ background: `hsl(${c.id * 47 % 360},45%,45%)` }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="col" style={{ lineHeight: 1.3 }}>
                          <span style={{ fontWeight: 500 }}>{c.name}</span>
                          <span className="muted-2" style={{ fontSize: 11 }}>{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><div className="row gap-2"><I.building size={12} className="muted-2" />{c.company}</div></td>
                    <td>
                      <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                        {c.tags.map(t => <span key={t} className={`pill ${tagColor[t] || ''}`} style={{ fontSize: 10 }}>{t}</span>)}
                      </div>
                    </td>
                    <td className="muted">{c.source}</td>
                    <td><div className="avatar sm" style={{ background: '#374151' }}>{c.ownerInitials}</div></td>
                    <td>
                      <div className="row gap-2" style={{ alignItems: 'center' }}>
                        <div style={{ width: 50, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${c.score}%`, height: '100%', background: c.score >= 80 ? '#22C55E' : c.score >= 60 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <span className="mono" style={{ fontSize: 11 }}>{c.score}</span>
                      </div>
                    </td>
                    <td className="muted">{c.created}</td>
                    <td onClick={e => e.stopPropagation()}><button className="icon-btn"><I.more size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row gap-3" style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 11 }}>
            <span className="muted">Showing {filtered.length} contacts</span>
            <div className="flex-1" />
            <button className="btn sm">Previous</button>
            <button className="btn sm">Next <I.chevR size={11} /></button>
          </div>
        </div>
      </div>

      {/* Contact detail panel */}
      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-header">
            <div className="avatar lg" style={{ background: `hsl(${selected.id * 47 % 360},45%,45%)`, flexShrink: 0 }}>
              {selected.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="col flex-1" style={{ gap: 2 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{selected.name}</div>
              <div className="muted-2" style={{ fontSize: 12 }}>{selected.title} · {selected.company}</div>
              <div className="row gap-1" style={{ marginTop: 4 }}>
                {selected.tags.map(t => <span key={t} className={`pill ${tagColor[t] || ''}`} style={{ fontSize: 10 }}>{t}</span>)}
              </div>
            </div>
            <button className="icon-btn" onClick={() => setSelected(null)}><I.x size={14} /></button>
          </div>

          <div className="detail-section">
            <div className="row gap-2">
              <button className="btn sm" style={{ flex: 1 }}><I.mail size={12} /> Email</button>
              <button className="btn sm" style={{ flex: 1 }}><I.wa size={12} /> WhatsApp</button>
              <button className="btn sm" style={{ flex: 1 }}><I.phone size={12} /> Call</button>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Contact info</div>
            <div className="detail-row"><span>Email</span><span style={{ fontSize: 11 }}>{selected.email}</span></div>
            <div className="detail-row"><span>Phone</span><span>{selected.phone}</span></div>
            <div className="detail-row"><span>Source</span><span>{selected.source}</span></div>
            <div className="detail-row"><span>Created</span><span>{selected.created}</span></div>
            <div className="detail-row"><span>Owner</span><span>{selected.owner}</span></div>
            <div className="detail-row"><span>Last active</span><span>{selected.lastActivity}</span></div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Lead score</div>
            <div className="row gap-3" style={{ alignItems: 'center' }}>
              <button className="btn sm" onClick={() => updateScore(selected, -5)}>−5</button>
              <div className="col flex-1 gap-1">
                <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${selected.score}%`, height: '100%', background: selected.score >= 80 ? '#22C55E' : selected.score >= 60 ? '#F59E0B' : '#EF4444', transition: 'width .2s' }} />
                </div>
                <div className="row gap-2">
                  <span className="muted-2" style={{ fontSize: 11 }}>Score</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{selected.score}</span>
                </div>
              </div>
              <button className="btn sm" onClick={() => updateScore(selected, 5)}>+5</button>
            </div>
          </div>

          {selected.notes && (
            <div className="detail-section">
              <div className="detail-label">Notes</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{selected.notes}</div>
            </div>
          )}

          <div className="detail-section" style={{ border: 'none' }}>
            <button className="btn sm ghost" style={{ color: '#EF4444' }} onClick={() => handleDelete(selected.id)}>
              <I.x size={12} /> Delete contact
            </button>
          </div>
        </div>
      )}

      {/* Add contact modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="row gap-2" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>New Contact</h3>
              <div className="flex-1" />
              <button className="icon-btn" onClick={() => setShowAdd(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="form-grid">
                <div className="form-field">
                  <label>Full name *</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First Last" />
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Email</label>
                  <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" type="email" />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98000 00000" />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label>Job title</label>
                  <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="CEO, Founder…" />
                </div>
                <div className="form-field">
                  <label>Source</label>
                  <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                    {['Website','Referral','Campaign','Import','API','Form','Event'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Notes</label>
                <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any context about this contact…" style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
              </div>
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn primary" onClick={handleAdd}><I.plus size={13} /> Add contact</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.check size={14} style={{ color: '#22C55E' }} />{toast}</div>}
    </>
  )
}
