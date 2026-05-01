'use client'

import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const cals = [
  { name: 'Discovery — Sana',   color: '#6366F1', count: 14 },
  { name: 'Demo — round robin', color: '#22C55E', count: 32 },
  { name: 'Onboarding — Riya',  color: '#F59E0B', count: 9 },
  { name: 'Customer success',   color: '#A78BFA', count: 21 },
]

const days = ['Mon 28', 'Tue 29', 'Wed 30', 'Thu 1', 'Fri 2']
const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']

const events = [
  { d: 0, h: 0.5, dur: 1,   title: 'Sana Iqbal · Discovery',      who: 'Riya A.',   color: '#6366F1', loc: 'Zoom' },
  { d: 0, h: 3,   dur: 1.5, title: 'Acme HVAC demo',               who: 'Aman D.',   color: '#22C55E', loc: 'Google Meet' },
  { d: 1, h: 1,   dur: 1,   title: 'Faraz Khan · Demo',            who: 'Aman D.',   color: '#22C55E', loc: 'Zoom' },
  { d: 1, h: 5,   dur: 0.5, title: 'Internal · pipeline review',   who: 'Team',      color: '#6C7187', loc: 'Internal' },
  { d: 2, h: 0,   dur: 1,   title: 'Vikram Shah · Discovery',      who: 'Riya A.',   color: '#6366F1', loc: 'Phone' },
  { d: 2, h: 2,   dur: 2,   title: 'Belvedere — onboarding',       who: 'Nikhil K.', color: '#F59E0B', loc: 'Zoom' },
  { d: 3, h: 1,   dur: 1,   title: 'Karan Bhatt · Demo',           who: 'Aman D.',   color: '#22C55E', loc: 'Zoom' },
  { d: 3, h: 5.5, dur: 1,   title: 'Lina Pereira · QBR',           who: 'Riya A.',   color: '#A78BFA', loc: 'Zoom' },
  { d: 4, h: 0,   dur: 0.5, title: 'Sahil Mehta — renewal',        who: 'Riya A.',   color: '#A78BFA', loc: 'Phone' },
  { d: 4, h: 2.5, dur: 1.5, title: 'Orbital · onboarding',         who: 'Nikhil K.', color: '#F59E0B', loc: 'Zoom' },
]

function MiniCalendar() {
  const dayNames = ['S','M','T','W','T','F','S']
  const calDays = Array.from({ length: 35 }, (_, i) => i - 2)
  return (
    <div className="card" style={{ padding: 10 }}>
      <div className="row gap-2" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>April 2026</span>
        <button className="icon-btn" style={{ width: 20, height: 20 }}><I.chevR size={11} style={{ transform: 'rotate(180deg)' }} /></button>
        <button className="icon-btn" style={{ width: 20, height: 20 }}><I.chevR size={11} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {dayNames.map((d, i) => <div key={i} style={{ fontSize: 9, color: 'var(--text-3)', textAlign: 'center', padding: '2px' }}>{d}</div>)}
        {calDays.map((d, i) => {
          const valid = d >= 1 && d <= 30
          const today = d === 30
          const hasEvent = [3,8,12,15,18,22,25,28,29,30].includes(d)
          return (
            <div key={i} style={{
              fontSize: 10.5, textAlign: 'center', padding: '4px 0', borderRadius: 4,
              color: valid ? (today ? '#fff' : 'var(--text)') : 'var(--text-4)',
              background: today ? 'var(--accent)' : 'transparent',
              fontWeight: today ? 600 : 400,
              cursor: valid ? 'pointer' : 'default',
              position: 'relative',
            }}>
              {valid ? d : ''}
              {hasEvent && !today && <span style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)' }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CalendarsPage() {
  return (
    <>
      <Topbar
        title="Calendars"
        subtitle="Apr 28 – May 2 · 14 appointments"
        actions={<>
          <div className="row gap-1 segment">
            <button className="seg-btn">Day</button>
            <button className="seg-btn active">Week</button>
            <button className="seg-btn">Month</button>
            <button className="seg-btn">Agenda</button>
          </div>
          <button className="btn"><I.link size={13} /> Copy booking link</button>
          <button className="btn primary"><I.plus size={14} /> New appointment</button>
        </>}
      />
      <div className="page" style={{ padding: 0, display: 'grid', gridTemplateColumns: '240px 1fr 280px', overflow: 'hidden', height: '100%' }}>
        <aside style={{ borderRight: '1px solid var(--border)', padding: '14px 12px', overflow: 'auto' }}>
          <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }}><I.plus size={13} /> Create</button>
          <div style={{ marginTop: 14 }}>
            <MiniCalendar />
          </div>
          <div className="ctx-label" style={{ padding: '14px 4px 6px' }}>My calendars</div>
          <div className="col gap-1">
            {cals.map(c => (
              <label key={c.name} className="row gap-2" style={{ padding: '4px 6px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span className="dot" style={{ background: c.color, width: 8, height: 8, borderRadius: 2 }} />
                <span style={{ flex: 1, fontSize: 12 }}>{c.name}</span>
                <span className="muted-2" style={{ fontSize: 10 }}>{c.count}</span>
              </label>
            ))}
          </div>
          <div className="ctx-label" style={{ padding: '14px 4px 6px' }}>Team availability</div>
          <div className="col gap-2">
            {[
              { n: 'Riya Acharya', s: 'available', c: '#22C55E' },
              { n: 'Aman Doshi',   s: 'in a call', c: '#EF4444' },
              { n: 'Nikhil K.',    s: 'OOO Apr 30', c: '#F59E0B' },
            ].map(p => (
              <div key={p.n} className="row gap-2" style={{ fontSize: 11 }}>
                <span className="dot" style={{ background: p.c }} />
                <span style={{ flex: 1 }}>{p.n}</span>
                <span className="muted-2">{p.s}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="cal-grid">
          <div className="cal-head">
            <div className="cal-head-cell" />
            {days.map((d, i) => (
              <div key={d} className={`cal-head-cell${i === 2 ? ' today' : ''}`} style={{ textAlign: 'center' }}>
                <div className="muted-2" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>{d.split(' ')[0]}</div>
                <div style={{ fontSize: 18, fontWeight: 600, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', background: i === 2 ? 'var(--accent)' : 'transparent', color: i === 2 ? '#fff' : 'var(--text)' }}>{d.split(' ')[1]}</div>
              </div>
            ))}
          </div>
          <div className="cal-body">
            <div className="cal-hours">
              {hours.map(h => <div key={h} className="cal-hour-cell">{h}</div>)}
            </div>
            {days.map((_, di) => (
              <div key={di} className={`cal-day-col${di === 2 ? ' today' : ''}`}>
                {hours.map((_, hi) => <div key={hi} className="cal-slot" />)}
                {events.filter(e => e.d === di).map((e, i) => (
                  <div key={i} className="cal-event" style={{ top: `${e.h * 56}px`, height: `${e.dur * 56 - 4}px`, background: `color-mix(in srgb, ${e.color} 22%, transparent)`, borderLeft: `3px solid ${e.color}` }}>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }} className="truncate">{e.title}</div>
                    <div className="muted-2 truncate" style={{ fontSize: 10 }}>{e.who} · {e.loc}</div>
                  </div>
                ))}
                {di === 2 && (
                  <div className="cal-now-line" style={{ top: `${1.65 * 56}px` }}>
                    <span />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside style={{ borderLeft: '1px solid var(--border)', padding: '14px 14px', overflow: 'auto' }}>
          <div className="ctx-label">Booking pages</div>
          <div className="col gap-2">
            {[
              { n: '30-min discovery',    s: '14 booked · 7 day window', c: '#6366F1' },
              { n: 'Demo · round robin',  s: '32 booked · 4 hosts',      c: '#22C55E' },
              { n: 'Onboarding kickoff',  s: '9 booked · 60 min slot',   c: '#F59E0B' },
            ].map(b => (
              <div key={b.n} className="card" style={{ padding: 10 }}>
                <div className="row gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: b.c }} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{b.n}</span>
                  <div className="flex-1" />
                  <button className="icon-btn" style={{ width: 22, height: 22 }}><I.copy size={11} /></button>
                </div>
                <div className="muted-2" style={{ fontSize: 11, marginTop: 4 }}>{b.s}</div>
                <div className="row gap-1" style={{ marginTop: 8 }}>
                  <span className="pill blue" style={{ fontSize: 10 }}>Public</span>
                  <span className="pill" style={{ fontSize: 10 }}>Confirmation: WA + email</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ctx-label" style={{ marginTop: 18 }}>Upcoming</div>
          <div className="col gap-2">
            {[
              { t: 'Today 11:00', n: 'Sana Iqbal · Discovery', who: 'Riya', c: '#6366F1' },
              { t: 'Today 14:00', n: 'Acme HVAC demo',          who: 'Aman', c: '#22C55E' },
              { t: 'Tue 10:00',   n: 'Faraz Khan · Demo',       who: 'Aman', c: '#22C55E' },
            ].map((u, i) => (
              <div key={i} className="row gap-2" style={{ fontSize: 11.5, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--border-soft)' : 'none' }}>
                <span className="dot" style={{ background: u.c, width: 6, height: 6 }} />
                <div className="col" style={{ lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                  <span className="truncate">{u.n}</span>
                  <span className="muted-2" style={{ fontSize: 10 }}>{u.t} · {u.who}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
