'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Tab = 'Getting Started' | 'Agent Studio' | 'Voice AI' | 'Conversation AI' | 'Knowledge Base' | 'Agent Templates' | 'Content AI' | 'Agent Logs'
const TABS: Tab[] = ['Getting Started', 'Agent Studio', 'Voice AI', 'Conversation AI', 'Knowledge Base', 'Agent Templates', 'Content AI', 'Agent Logs']

/* ── Knowledge Base ── */
interface KB { id: string; name: string; updatedAt: string; createdAt: string; sources: number }
const INITIAL_KBS: KB[] = [
  { id: 'k1', name: 'PhantomCore KB',          updatedAt: '4 May 2026, 3:14 PM',  createdAt: '4 May 2026, 3:10 PM',  sources: 12 },
  { id: 'k2', name: 'scentivo',                updatedAt: '30 Apr 2026, 6:02 PM', createdAt: '30 Apr 2026, 6:02 PM', sources: 5  },
  { id: 'k3', name: 'PhantomCore',             updatedAt: '29 Apr 2026, 8:30 PM', createdAt: '29 Apr 2026, 8:03 PM', sources: 8  },
  { id: 'k4', name: 'Qawanat',                 updatedAt: '24 Apr 2026, 6:48 PM', createdAt: '11 Mar 2026, 4:48 PM', sources: 3  },
  { id: 'k5', name: 'Existing knowledge base', updatedAt: '22 Feb 2026, 3:37 AM', createdAt: '22 Feb 2026, 3:37 AM', sources: 1  },
]

/* ── Voice AI ── */
const VOICE_AGENTS = [
  { id: 'v1', name: 'Sales Qualifier',    voice: 'Aria', lang: 'English (US)', status: 'active', calls: 312, booked: 48, handoff: '18%' },
  { id: 'v2', name: 'Support Bot',        voice: 'Josh', lang: 'English (UK)', status: 'active', calls: 98,  booked: 0,  handoff: '32%' },
  { id: 'v3', name: 'Appointment Setter', voice: 'Aria', lang: 'English (US)', status: 'draft',  calls: 0,   booked: 0,  handoff: '—'   },
]

/* ── Agent Templates ── */
const AGENT_TEMPLATES = [
  { id: 't1', name: 'Lead Qualification Bot',  cat: 'Sales',    desc: 'Qualifies inbound leads, scores them, and books demos automatically.',           icon: '🎯' },
  { id: 't2', name: 'Appointment Scheduler',   cat: 'Sales',    desc: 'Handles scheduling, reminders, and rescheduling via voice or chat.',              icon: '📅' },
  { id: 't3', name: 'Customer Support Agent',  cat: 'Support',  desc: 'Answers FAQs from your knowledge base, escalates to humans when needed.',         icon: '🎧' },
  { id: 't4', name: 'Onboarding Assistant',    cat: 'Success',  desc: 'Walks new customers through setup, collects info, and answers questions.',         icon: '🚀' },
  { id: 't5', name: 'Review Collector',        cat: 'Reviews',  desc: 'Follows up after service to collect reviews on Google, Trustpilot, etc.',          icon: '⭐' },
  { id: 't6', name: 'Re-engagement Campaign',  cat: 'Marketing',desc: 'Reaches out to cold leads with personalized AI-generated outreach.',               icon: '💬' },
]

/* ── Agent Logs ── */
const AGENT_LOGS = [
  { id: 1, agent: 'Sales Qualifier',  contact: 'Sana Iqbal',   type: 'Voice', outcome: 'Booked',    dur: '3:42', ts: 'Today, 2:14 PM'      },
  { id: 2, agent: 'Support Bot',      contact: 'Rohit Menon',  type: 'Chat',  outcome: 'Resolved',  dur: '5:18', ts: 'Today, 11:30 AM'     },
  { id: 3, agent: 'Sales Qualifier',  contact: 'Priya Sharma', type: 'Voice', outcome: 'Handoff',   dur: '1:55', ts: 'Today, 9:20 AM'      },
  { id: 4, agent: 'Support Bot',      contact: 'Unknown',      type: 'Chat',  outcome: 'Abandoned', dur: '0:41', ts: 'Yesterday, 4:10 PM'  },
  { id: 5, agent: 'Sales Qualifier',  contact: 'James Liu',    type: 'Voice', outcome: 'Booked',    dur: '4:05', ts: 'Yesterday, 1:00 PM'  },
]
const OUTCOME_CLS: Record<string, string> = { Booked: 'green', Resolved: 'green', Handoff: 'blue', Abandoned: 'red' }

/* ── Create KB modal ── */
function CreateKBModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName]             = useState('')
  const [srcType, setSrcType]       = useState<'text'|'url'|'file'>('text')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
        <div className="row gap-3" style={{ marginBottom: 20 }}>
          <div className="col flex-1 gap-1">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Create Knowledge Base</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Add documents, URLs, or text your AI agents can reference</div>
          </div>
          <button className="icon-btn" onClick={onClose}><I.x size={14} /></button>
        </div>
        <div className="col gap-3">
          <div className="form-field">
            <label>Knowledge Base Name</label>
            <input className="input" placeholder="e.g. Product FAQ, Support Docs…" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="form-field">
            <label>Add Source</label>
            <div className="row gap-2" style={{ marginBottom: 10 }}>
              {(['text','url','file'] as const).map(t => (
                <button key={t} onClick={() => setSrcType(t)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${srcType === t ? 'var(--accent)' : 'var(--border)'}`, background: srcType === t ? 'var(--accent-soft)' : 'var(--surface-2)', color: srcType === t ? 'var(--accent)' : 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {t === 'url' ? 'Website URL' : t === 'file' ? 'Upload File' : 'Plain Text'}
                </button>
              ))}
            </div>
            {srcType === 'text' && (
              <textarea placeholder="Paste your content here…" style={{ width: '100%', minHeight: 120, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
            )}
            {srcType === 'url' && <input className="input" placeholder="https://yoursite.com/docs" />}
            {srcType === 'file' && (
              <div style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '28px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 12, background: 'var(--surface-2)', cursor: 'pointer' }}>
                <I.upload size={22} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 500 }}>Click to upload or drag & drop</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>PDF, DOCX, TXT, CSV up to 25MB</div>
              </div>
            )}
          </div>
        </div>
        <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!name.trim()} onClick={() => { onCreate(name.trim()); onClose() }}>
            <I.plus size={13} /> Create Knowledge Base
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AIAgentsPage() {
  const [tab, setTab]           = useState<Tab>('Knowledge Base')
  const [kbs, setKbs]           = useState<KB[]>(INITIAL_KBS)
  const [search, setSearch]     = useState('')
  const [showCreate, setCreate] = useState(false)
  const [confirmDel, setConfirm]= useState<string|null>(null)

  const QUOTA = 15
  const filtered = kbs.filter(k => k.name.toLowerCase().includes(search.toLowerCase()))

  function createKB(name: string) {
    const now = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    setKbs(p => [{ id: Date.now().toString(), name, updatedAt: now, createdAt: now, sources: 0 }, ...p])
  }

  return (
    <>
      <Topbar
        title="AI Agents"
        subtitle="Automate calls, chats, and follow-ups with AI"
        breadcrumb={['AI Agents']}
        actions={
          tab === 'Knowledge Base' ? (
            <button className="btn primary" style={{ fontSize: 12 }} onClick={() => setCreate(true)}>
              <I.plus size={13} /> Create Knowledge Base
            </button>
          ) : tab === 'Voice AI' ? (
            <button className="btn primary" style={{ fontSize: 12 }}><I.plus size={13} /> New Voice Agent</button>
          ) : tab === 'Agent Studio' ? (
            <button className="btn primary" style={{ fontSize: 12 }}><I.plus size={13} /> New Agent</button>
          ) : undefined
        }
      />

      {/* Tab bar */}
      <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? 'var(--accent)' : 'var(--text-3)', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap', transition: 'color .15s' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Knowledge Base ── */}
      {tab === 'Knowledge Base' && (
        <div style={{ padding: '24px' }}>
          {/* Section header */}
          <div className="row gap-3" style={{ marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Knowledge Base</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Create and Manage Multiple Knowledge Bases for Your Business</div>
            </div>
            <div className="flex-1" />
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              Knowledge Base Quota
              <b style={{ color: kbs.length >= QUOTA * 0.8 ? 'var(--amber)' : 'var(--text)', marginLeft: 4 }}>{kbs.length}</b>
              <span style={{ color: 'var(--text-4)' }}>/ {QUOTA}</span>
            </div>
            <button className="btn primary" style={{ fontSize: 12 }} onClick={() => setCreate(true)}>
              <I.plus size={13} /> Create Knowledge Base
            </button>
          </div>

          {/* Toolbar */}
          <div className="row gap-2" style={{ marginBottom: 0, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
              <I.arrowUp size={11} className="muted-2" />
              <I.arrowDn size={11} className="muted-2" />
              Sort By
              <I.chevD size={11} className="muted-2" />
            </div>
            <div className="flex-1" />
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 240, marginBottom: 0 }}>
              <I.search size={13} className="muted-2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search knowledge base" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', flex: 1 }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Name</th>
                  <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', width: 210 }}>Last updated</th>
                  <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', width: 210 }}>Created at</th>
                  <th style={{ padding: '11px 20px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((kb, i) => (
                  <tr
                    key={kb.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-soft)' : 'none', transition: 'background .1s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div className="row gap-3">
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <I.doc size={15} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div className="col" style={{ gap: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{kb.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{kb.sources} source{kb.sources !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-3)' }}>{kb.updatedAt}</td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-3)' }}>{kb.createdAt}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" title="Edit" style={{ width: 30, height: 30 }}><I.pencil size={13} /></button>
                        {confirmDel === kb.id ? (
                          <>
                            <button className="btn" style={{ fontSize: 11, background: 'var(--red)', color: '#fff', borderColor: 'var(--red)', padding: '4px 10px' }} onClick={() => { setKbs(p => p.filter(k => k.id !== kb.id)); setConfirm(null) }}>Delete</button>
                            <button className="btn ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setConfirm(null)}>Cancel</button>
                          </>
                        ) : (
                          <button className="icon-btn" title="Delete" style={{ width: 30, height: 30 }} onClick={() => setConfirm(kb.id)}><I.trash size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                    {search ? `No results for "${search}"` : 'No knowledge bases yet — create one to get started.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Getting Started ── */}
      {tab === 'Getting Started' && (
        <div style={{ padding: '32px 24px', maxWidth: 760 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Get started with AI Agents</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>Set up your AI to handle calls, chats, bookings, and follow-ups — automatically.</div>
          <div className="col gap-3">
            {[
              { step: 1, title: 'Create a Knowledge Base', desc: 'Upload your FAQs, product docs, or paste text. Your agent uses this to answer questions accurately.', icon: 'doc',   cta: 'Create KB',      action: () => { setTab('Knowledge Base'); setCreate(true) } },
              { step: 2, title: 'Build an AI Agent',       desc: 'Choose Voice AI or Conversation AI. Pick a template or build from scratch in Agent Studio.',    icon: 'ai',    cta: 'Open Studio',    action: () => setTab('Agent Studio') },
              { step: 3, title: 'Connect to a Workflow',   desc: 'Attach your agent to an automation — trigger on new leads, missed calls, or form submissions.',   icon: 'flow',  cta: 'View Workflows', action: () => {} },
              { step: 4, title: 'Go Live & Monitor',       desc: 'Publish your agent and track calls handled, bookings, and resolution rate in Agent Logs.',         icon: 'chart', cta: 'View Logs',      action: () => setTab('Agent Logs') },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon === 'doc'   && <I.doc   size={16} style={{ color: 'var(--accent)' }} />}
                  {s.icon === 'ai'    && <I.ai    size={16} style={{ color: 'var(--accent)' }} />}
                  {s.icon === 'flow'  && <I.flow  size={16} style={{ color: 'var(--accent)' }} />}
                  {s.icon === 'chart' && <I.chart size={16} style={{ color: 'var(--accent)' }} />}
                </div>
                <div className="col flex-1 gap-1">
                  <div className="row gap-2">
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: 4, padding: '1px 6px' }}>Step {s.step}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                <button className="btn ghost" style={{ fontSize: 11, flexShrink: 0 }} onClick={s.action}>{s.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Voice AI ── */}
      {tab === 'Voice AI' && (
        <div style={{ padding: '24px' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th style={{ width: 100 }}>Voice</th>
                  <th style={{ width: 140 }}>Language</th>
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 70 }}>Calls</th>
                  <th style={{ width: 80 }}>Booked</th>
                  <th style={{ width: 100 }}>Handoff Rate</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {VOICE_AGENTS.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="row gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <I.voice size={14} style={{ color: 'var(--violet)' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.voice}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.lang}</span></td>
                    <td><span className={`pill ${a.status === 'active' ? 'green' : 'gray'}`} style={{ fontSize: 10, textTransform: 'capitalize' }}>{a.status === 'active' && <span className="dot" style={{ background: 'var(--green)' }} />}{a.status}</span></td>
                    <td><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.calls}</span></td>
                    <td><span style={{ fontSize: 12, color: a.booked > 0 ? 'var(--green)' : 'var(--text-4)', fontWeight: 500 }}>{a.booked > 0 ? a.booked : '—'}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.handoff}</span></td>
                    <td>
                      <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Edit</button>
                        <button className="icon-btn" style={{ width: 28, height: 28 }}><I.more size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Agent Studio ── */}
      {tab === 'Agent Studio' && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 24px', maxWidth: 480, margin: '0 auto' }}>
            <I.brain size={36} style={{ color: 'var(--accent)', marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Agent Studio</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 20 }}>Build custom AI agents with a flow editor. Connect to knowledge bases, set personality, and define conversation paths.</div>
            <button className="btn primary" style={{ fontSize: 12 }}><I.plus size={13} /> Create New Agent</button>
          </div>
        </div>
      )}

      {/* ── Conversation AI ── */}
      {tab === 'Conversation AI' && (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, maxWidth: 860 }}>
            {[
              { title: 'Auto-Reply Bot',  status: 'active', handled: 214, resolved: '71%', channel: 'SMS + Chat' },
              { title: 'Lead Nurture AI', status: 'active', handled: 88,  resolved: '64%', channel: 'Email'      },
              { title: 'WhatsApp Agent',  status: 'draft',  handled: 0,   resolved: '—',   channel: 'WhatsApp'   },
            ].map(a => (
              <div key={a.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
                <div className="row gap-2" style={{ marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I.bot size={15} style={{ color: 'var(--teal)' }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.channel}</div>
                  </div>
                  <span className={`pill ${a.status === 'active' ? 'green' : 'gray'}`} style={{ fontSize: 10, textTransform: 'capitalize' }}>{a.status}</span>
                </div>
                <div className="row gap-4" style={{ fontSize: 12, marginBottom: 12 }}>
                  <div><span style={{ color: 'var(--text-3)' }}>Handled </span><b style={{ color: 'var(--text)' }}>{a.handled}</b></div>
                  <div><span style={{ color: 'var(--text-3)' }}>Resolved </span><b style={{ color: a.resolved !== '—' ? 'var(--green)' : 'var(--text-4)' }}>{a.resolved}</b></div>
                </div>
                <button className="btn ghost" style={{ fontSize: 11, width: '100%' }}>Configure →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Agent Templates ── */}
      {tab === 'Agent Templates' && (
        <div style={{ padding: '24px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Pre-built agents ready to deploy. Customize after installing.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {AGENT_TEMPLATES.map(t => (
              <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
                <div className="row gap-3" style={{ marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                    <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600 }}>{t.cat}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 14 }}>{t.desc}</p>
                <button className="btn primary" style={{ fontSize: 11, width: '100%' }}>Use Template</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Content AI ── */}
      {tab === 'Content AI' && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 24px', maxWidth: 480, margin: '0 auto' }}>
            <I.spark size={36} style={{ color: 'var(--accent)', marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Content AI</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 20 }}>Generate emails, SMS, social posts, and more using AI trained on your brand voice and knowledge bases.</div>
            <button className="btn primary" style={{ fontSize: 12 }}><I.spark size={13} /> Generate Content</button>
          </div>
        </div>
      )}

      {/* ── Agent Logs ── */}
      {tab === 'Agent Logs' && (
        <div style={{ padding: '24px' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Contact</th>
                  <th style={{ width: 80 }}>Type</th>
                  <th style={{ width: 100 }}>Outcome</th>
                  <th style={{ width: 80 }}>Duration</th>
                  <th style={{ width: 160 }}>Time</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {AGENT_LOGS.map(l => (
                  <tr key={l.id}>
                    <td><span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{l.agent}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{l.contact}</span></td>
                    <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: l.type === 'Voice' ? 'var(--violet-soft)' : 'var(--teal-soft)', color: l.type === 'Voice' ? 'var(--violet)' : 'var(--teal)', fontWeight: 600 }}>{l.type}</span></td>
                    <td><span className={`pill ${OUTCOME_CLS[l.outcome] ?? 'gray'}`} style={{ fontSize: 10 }}>{l.outcome}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' }}>{l.dur}</span></td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{l.ts}</span></td>
                    <td><button className="icon-btn" style={{ width: 28, height: 28 }}><I.more size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && <CreateKBModal onClose={() => setCreate(false)} onCreate={createKB} />}
    </>
  )
}
