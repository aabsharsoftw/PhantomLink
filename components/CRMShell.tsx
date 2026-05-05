'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect, createContext, useContext } from 'react'
import { I } from './icons'

const NAV_PRIMARY = [
  { id: 'dashboard',  href: '/dashboard',  label: 'Dashboard',       icon: 'dash' },
  { id: 'contacts',   href: '/contacts',   label: 'Contacts',        icon: 'contact', count: 12482 },
  { id: 'inbox',      href: '/inbox',      label: 'Conversations',   icon: 'inbox', badge: 23 },
  { id: 'telephony',  href: '/telephony',  label: 'Telephony',       icon: 'phone' },
  { id: 'pipeline',   href: '/pipeline',   label: 'Lead Management', icon: 'pipeline' },
  { id: 'calendars',  href: '/calendars',  label: 'Calendars',       icon: 'cal' },
]
const NAV_MARKETING = [
  { id: 'campaigns',  href: '/campaigns',  label: 'Marketing',       icon: 'campaign' },
  { id: 'automation', href: '/automation', label: 'AI Automation',   icon: 'flow' },
  { id: 'ai',         href: '/ai',         label: 'AI Agents',       icon: 'ai' },
  { id: 'templates',  href: '/templates',  label: 'Templates',       icon: 'paper' },
  { id: 'social',     href: '/social',     label: 'Social Planner',  icon: 'share' },
  { id: 'reputation', href: '/reputation', label: 'Google Reviews',  icon: 'reviews', badge: 4 },
]
const NAV_INTELLIGENCE = [
  { id: 'reporting',  href: '/reporting',  label: 'Reporting',       icon: 'chart' },
]
const NAV_BOTTOM = [
  { id: 'admin',      href: '/admin',      label: 'Agency view',     icon: 'shield' },
  { id: 'settings',   href: '/settings',   label: 'Settings',        icon: 'cog' },
]

/* ── App context (theme + dialer) ── */
type Theme = 'dark' | 'light'
type AppCtxType = {
  theme: Theme; toggle: () => void
  dialerOpen: boolean; toggleDialer: () => void
}
const AppCtx = createContext<AppCtxType>({
  theme: 'dark', toggle: () => {},
  dialerOpen: false, toggleDialer: () => {},
})

/* ── Nav item ── */
function NavItem({ href, label, icon, badge, count }: {
  href: string; label: string; icon: string; badge?: number; count?: number
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  const Ico = I[icon]
  return (
    <Link href={href} className={`nav-item${isActive ? ' active' : ''}`}>
      <Ico size={15} />
      <span className="flex-1" style={{ textAlign: 'left' }}>{label}</span>
      {badge !== undefined && <span className="nav-badge">{badge}</span>}
      {count !== undefined && <span className="nav-count">{count.toLocaleString()}</span>}
    </Link>
  )
}

/* ── Sidebar ── */
function Sidebar() {
  const { toggleDialer } = useContext(AppCtx)
  return (
    <aside className="sidebar">
      <div className="agency-switcher">
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>P</div>
        <div className="col flex-1" style={{ minWidth: 0, lineHeight: 1.2 }}>
          <div className="row gap-1" style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>
            <I.building size={9} /> PhantomCore Agency
          </div>
          <div className="row gap-2" style={{ marginTop: 2 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }} className="truncate flex-1">Acme Marketing</span>
            <I.chevD size={12} className="muted-2" />
          </div>
        </div>
      </div>

      <button className="search-trigger">
        <I.search size={13} /><span className="flex-1" style={{ textAlign: 'left' }}>Search…</span><span className="kbd">⌘K</span>
      </button>

      {/* Quick dial button */}
      <button
        onClick={toggleDialer}
        style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(99,102,241,.3)', background: 'var(--accent-soft)', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600, width: '100%' }}
      >
        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.phone size={11} style={{ color: '#fff' }} />
        </div>
        Make a Call
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-3)', fontWeight: 400 }}>Softphone</span>
      </button>

      <div className="col gap-1" style={{ marginTop: 4 }}>
        {NAV_PRIMARY.map(n => <NavItem key={n.id} {...n} />)}
      </div>

      <div className="nav-section-label">Marketing</div>
      <div className="col gap-1">
        {NAV_MARKETING.map(n => <NavItem key={n.id} {...n} />)}
      </div>

      <div className="nav-section-label">Intelligence</div>
      <div className="col gap-1">
        {NAV_INTELLIGENCE.map(n => <NavItem key={n.id} {...n} />)}
      </div>

      <div className="nav-section-label">Pipelines</div>
      <div className="col gap-1">
        <button className="nav-item small"><span className="dot" style={{ background: 'var(--accent)' }} /><span className="flex-1" style={{ textAlign: 'left' }}>Inbound — SaaS</span><span className="muted-2">42</span></button>
        <button className="nav-item small"><span className="dot" style={{ background: 'var(--teal)' }} /><span className="flex-1" style={{ textAlign: 'left' }}>Enterprise</span><span className="muted-2">14</span></button>
        <button className="nav-item small"><span className="dot" style={{ background: 'var(--amber)' }} /><span className="flex-1" style={{ textAlign: 'left' }}>Renewals Q3</span><span className="muted-2">23</span></button>
      </div>

      <div className="flex-1" />

      <div className="col gap-1">
        {NAV_BOTTOM.map(n => <NavItem key={n.id} {...n} />)}
      </div>

      <div className="user-card">
        <div className="avatar" style={{ background: 'linear-gradient(135deg,#A78BFA,#6366F1)' }}>RA</div>
        <div className="col flex-1" style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div className="truncate" style={{ fontWeight: 500, fontSize: 12 }}>Riya Acharya</div>
          <div className="muted-2 truncate" style={{ fontSize: 11 }}>Sub-account Admin</div>
        </div>
        <I.more size={14} className="muted-2" />
      </div>
    </aside>
  )
}

/* ── Context strip ── */
function ContextStrip() {
  return (
    <div className="ctx-strip">
      <span className="muted-2" style={{ fontSize: 11 }}>Sub-account</span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>Acme Marketing</span>
      <span className="pill green" style={{ fontSize: 10 }}><span className="dot pulse" style={{ background: '#22C55E' }} />Live</span>
      <span className="muted-2" style={{ fontSize: 11 }}>·</span>
      <I.layers size={12} className="muted-2" />
      <span style={{ fontSize: 11 }} className="muted">Snapshot: <b style={{ color: 'var(--text-2)' }}>SaaS Starter v3</b></span>
      <span className="muted-2" style={{ fontSize: 11 }}>·</span>
      <I.globe2 size={12} className="muted-2" />
      <span style={{ fontSize: 11 }} className="muted">app.acmemarketing.io</span>
      <div className="flex-1" />
      <span className="muted-2" style={{ fontSize: 11 }}>3 unread tasks</span>
      <span className="muted-2" style={{ fontSize: 11 }}>·</span>
      <span className="muted-2" style={{ fontSize: 11 }}>API · 99.98%</span>
      <button className="btn sm ghost"><I.swap size={11} /> Switch sub-account</button>
      <button className="btn sm ghost"><I.eye size={11} /> View as agency</button>
    </div>
  )
}

/* ── Topbar ── */
export function Topbar({ title, subtitle, actions, breadcrumb }: {
  title: string; subtitle?: string; actions?: ReactNode; breadcrumb?: string[]
}) {
  const { theme, toggle, toggleDialer } = useContext(AppCtx)
  return (
    <header className="topbar">
      <div className="col gap-1 flex-1">
        {breadcrumb && (
          <div className="row gap-1 muted-2" style={{ fontSize: 11 }}>
            {breadcrumb.map((b, i) => (
              <span key={i} className="row gap-1">{b}{i < breadcrumb.length - 1 && <I.chevR size={11} />}</span>
            ))}
          </div>
        )}
        <div className="row gap-3">
          <h1 className="page-title">{title}</h1>
          {subtitle && <span className="muted" style={{ fontSize: 12, marginTop: 4 }}>{subtitle}</span>}
        </div>
      </div>
      <div className="row gap-2">
        {actions}
        <button
          className="icon-btn"
          title="Open softphone"
          onClick={toggleDialer}
          style={{ position: 'relative' }}
        >
          <I.phone size={15} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', border: '1.5px solid var(--bg-elev)' }} />
        </button>
        <button className="icon-btn" title="Help"><I.flask size={15} /></button>
        <button className="icon-btn"><I.bell size={16} /><span className="dot-badge" /></button>
        <button className="icon-btn" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle} style={{ fontSize: 15, width: 32, height: 32 }}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <div className="topbar-divider" />
        <button className="btn ghost"><I.spark size={14} /> Ask AI</button>
      </div>
    </header>
  )
}

/* ── Softphone dialer ── */
const DIAL_RECENT = [
  { name: 'Sana Iqbal',    num: '+91 98103 22018', dir: 'in'  },
  { name: 'Rohit Menon',   num: '+91 99876 11240', dir: 'out' },
  { name: 'Priya Sharma',  num: '+91 88001 45321', dir: 'in'  },
]

function Softphone({ onClose }: { onClose: () => void }) {
  const [dialNum, setDialNum]       = useState('')
  const [inCall, setInCall]         = useState(false)
  const [callSecs, setCallSecs]     = useState(0)
  const [muted, setMuted]           = useState(false)
  const [held, setHeld]             = useState(false)
  const [status, setStatus]         = useState<'available'|'busy'|'away'>('available')
  const [incoming, setIncoming]     = useState(false)
  const [incomingName]              = useState('Kabir Hussain · +91 70001 99812')

  useEffect(() => {
    if (!inCall) return
    const t = setInterval(() => setCallSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [inCall])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  function press(k: string) { if (!inCall) setDialNum(n => n + k) }
  function backspace() { setDialNum(n => n.slice(0, -1)) }
  function dial() { if (dialNum) { setInCall(true); setCallSecs(0) } }
  function hangUp() { setInCall(false); setDialNum(''); setCallSecs(0); setMuted(false); setHeld(false) }
  function answerIncoming() { setIncoming(false); setDialNum('+91 70001 99812'); setInCall(true); setCallSecs(0) }
  function rejectIncoming() { setIncoming(false) }

  const statusColor = { available: '#22C55E', busy: '#EF4444', away: '#F59E0B' }[status]

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 272, zIndex: 600,
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 18, boxShadow: '0 12px 48px rgba(0,0,0,.4)',
      overflow: 'hidden', userSelect: 'none',
    }}>
      {/* Incoming call overlay */}
      {incoming && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, borderRadius: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>K</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Incoming Call</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{incomingName}</div>
          </div>
          <div className="row gap-4">
            <button onClick={rejectIncoming} style={{ width: 52, height: 52, borderRadius: '50%', background: '#DC2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.phone size={20} style={{ color: '#fff', transform: 'rotate(135deg)' }} />
            </button>
            <button onClick={answerIncoming} style={{ width: 52, height: 52, borderRadius: '50%', background: '#16A34A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.phone size={20} style={{ color: '#fff' }} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Reject · Answer</div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '12px 14px', background: inCall ? (held ? '#B45309' : '#15803D') : 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: inCall ? '#fff' : statusColor, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: inCall ? '#fff' : 'var(--text)', flex: 1 }}>
          {inCall ? (held ? `On Hold · ${fmt(callSecs)}` : fmt(callSecs)) : 'Softphone'}
        </span>
        {!inCall && (
          <select
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', outline: 'none' }}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
          </select>
        )}
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: inCall ? 'rgba(255,255,255,.7)' : 'var(--text-3)', padding: 0, display: 'flex' }}>
          <I.x size={14} />
        </button>
      </div>

      {inCall ? (
        /* ── Active call UI ── */
        <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
            {dialNum.replace(/\D/g,'').slice(-1) || '?'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{dialNum}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 20 }}>LC Phone · {held ? 'On hold' : 'Connected'}</div>

          {/* In-call controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: muted ? 'Unmute' : 'Mute',    icon: 'voice',  on: muted,  action: () => setMuted(m => !m) },
              { label: held  ? 'Resume' : 'Hold',   icon: 'clock',  on: held,   action: () => setHeld(h => !h)  },
              { label: 'Transfer', icon: 'swap',   on: false,  action: () => {} },
            ].map(b => (
              <button key={b.label} onClick={b.action} style={{ padding: '10px 4px', borderRadius: 10, border: `1px solid ${b.on ? 'var(--accent)' : 'var(--border)'}`, background: b.on ? 'var(--accent-soft)' : 'var(--surface-2)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {b.icon === 'voice' && <I.voice size={14} style={{ color: b.on ? 'var(--accent)' : 'var(--text-3)' }} />}
                {b.icon === 'clock' && <I.clock size={14} style={{ color: b.on ? 'var(--accent)' : 'var(--text-3)' }} />}
                {b.icon === 'swap'  && <I.swap  size={14} style={{ color: 'var(--text-3)' }} />}
                <span style={{ fontSize: 10, color: b.on ? 'var(--accent)' : 'var(--text-3)', fontWeight: 500 }}>{b.label}</span>
              </button>
            ))}
          </div>

          {/* Hang up */}
          <button onClick={hangUp} style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <I.phone size={22} style={{ transform: 'rotate(135deg)' }} />
          </button>
        </div>
      ) : (
        /* ── Dial pad UI ── */
        <>
          {/* Provider row */}
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>via</span>
            <select style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 11, outline: 'none' }}>
              <option>LC Phone — +1 (415) 555-0192</option>
              <option>Twilio — +1 (628) 555-0173</option>
              <option>3CX — Ext. 1001</option>
            </select>
          </div>

          {/* Number display */}
          <div style={{ padding: '12px 14px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              value={dialNum}
              onChange={e => setDialNum(e.target.value)}
              placeholder="Enter number…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace', textAlign: 'center', letterSpacing: 1 }}
            />
            {dialNum && (
              <button onClick={backspace} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex', flexShrink: 0 }}>
                <I.x size={13} />
              </button>
            )}
          </div>

          {/* Dial pad */}
          <div style={{ padding: '4px 14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
              <button key={k} onClick={() => press(k)} style={{ padding: '11px 8px', background: 'var(--surface-2)', border: '1px solid var(--border-soft)', borderRadius: 10, fontSize: 17, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', transition: 'background .1s', lineHeight: 1 }}>
                {k}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding: '10px 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <button onClick={() => setIncoming(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.bell size={14} /></div>
              <span>Simulate</span>
            </button>
            <button onClick={dial} disabled={!dialNum} style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', background: dialNum ? '#16A34A' : 'var(--surface-2)', color: dialNum ? '#fff' : 'var(--text-4)', cursor: dialNum ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
              <I.phone size={22} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.voice size={14} /></div>
              <span>Voicemail</span>
            </button>
          </div>

          {/* Recent */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '10px 14px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Recent</div>
            {DIAL_RECENT.map(c => (
              <button key={c.num} onClick={() => setDialNum(c.num)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '5px 4px', borderRadius: 6, textAlign: 'left' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.dir === 'in' ? 'var(--blue-soft)' : 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I.phone size={10} style={{ color: c.dir === 'in' ? 'var(--blue)' : 'var(--accent)', transform: c.dir === 'out' ? 'rotate(-135deg)' : 'rotate(135deg)' }} />
                </div>
                <div className="col flex-1" style={{ gap: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>{c.num}</span>
                </div>
                <I.phone size={12} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Shell ── */
export function CRMShell({ children }: { children: ReactNode }) {
  const [theme, setTheme]         = useState<Theme>('dark')
  const [dialerOpen, setDialer]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('ph-theme') as Theme | null
    if (stored === 'light') setTheme('light')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('ph-theme', theme)
  }, [theme])

  return (
    <AppCtx.Provider value={{
      theme,
      toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
      dialerOpen,
      toggleDialer: () => setDialer(d => !d),
    }}>
      <div className="app">
        <Sidebar />
        <ContextStrip />
        <main className="main">{children}</main>
      </div>
      {dialerOpen && <Softphone onClose={() => setDialer(false)} />}
    </AppCtx.Provider>
  )
}
