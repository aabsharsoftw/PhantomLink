'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

/* ── Types ── */
type NumStatus   = 'active' | 'paused' | 'pending'
type CallStatus  = 'answered' | 'missed' | 'voicemail' | 'busy' | 'no-answer'
type CallDir     = 'inbound' | 'outbound'
type ProvStatus  = 'connected' | 'available' | 'coming_soon'
type RouteDest   = 'user' | 'team' | 'ivr' | 'queue' | 'voicemail'
type Tab         = 'Phone Numbers' | 'Call Routing' | 'IVR' | 'Call Logs' | 'Integrations' | 'Settings'

/* ── Phone Numbers ── */
interface PhoneNumber {
  id: string; number: string; friendly: string
  provider: 'LC Phone' | 'Twilio' | '3CX' | 'RingCentral'
  status: NumStatus; assignedTo: string; assignedType: 'user'|'team'|'pipeline'|'unassigned'
  monthlyMinutes: number; usedMinutes: number; callVolume: number
  features: string[]
}

const PHONE_NUMBERS: PhoneNumber[] = [
  { id: 'n1', number: '+1 (415) 555-0192', friendly: 'Main Sales Line', provider: 'LC Phone', status: 'active', assignedTo: 'Sales Team', assignedType: 'team', monthlyMinutes: 2000, usedMinutes: 1456, callVolume: 312, features: ['IVR', 'Recording', 'Voicemail', 'Whisper'] },
  { id: 'n2', number: '+1 (415) 555-0148', friendly: 'Support Inbound', provider: 'LC Phone', status: 'active', assignedTo: 'Riya Acharya', assignedType: 'user', monthlyMinutes: 500, usedMinutes: 187, callVolume: 98, features: ['Recording', 'Voicemail'] },
  { id: 'n3', number: '+1 (628) 555-0173', friendly: 'Campaign — SaaS May', provider: 'Twilio', status: 'active', assignedTo: 'Inbound — SaaS', assignedType: 'pipeline', monthlyMinutes: 300, usedMinutes: 241, callVolume: 74, features: ['Call Tracking', 'Recording'] },
  { id: 'n4', number: '+44 20 7946 0321', friendly: 'UK Market', provider: 'Twilio', status: 'paused', assignedTo: 'Enterprise', assignedType: 'pipeline', monthlyMinutes: 200, usedMinutes: 0, callVolume: 0, features: ['IVR', 'Recording'] },
  { id: 'n5', number: '+91 22 6921 0045', friendly: 'India — Enterprise', provider: '3CX', status: 'active', assignedTo: 'Aman Dubey', assignedType: 'user', monthlyMinutes: 400, usedMinutes: 312, callVolume: 56, features: ['SIP', 'Recording'] },
]

/* ── Call Logs ── */
interface CallLog {
  id: number; ts: string; dir: CallDir; callerName: string; callerNum: string
  dest: string; destNum: string; duration: string; status: CallStatus
  agent: string; agentInit: string; hasRecording: boolean; outcome: string; pipeline: string
}

const CALL_LOGS: CallLog[] = [
  { id:1,  ts:'Today, 2:15 PM',    dir:'inbound',  callerName:'Sana Iqbal',    callerNum:'+91 98103 22018', dest:'Main Sales Line',   destNum:'+1 (415) 555-0192', duration:'4:32', status:'answered',  agent:'Riya Acharya',  agentInit:'RA', hasRecording:true,  outcome:'Demo Scheduled', pipeline:'Inbound — SaaS' },
  { id:2,  ts:'Today, 11:42 AM',   dir:'outbound', callerName:'Rohit Menon',   callerNum:'+91 99876 11240', dest:'Rohit Menon',       destNum:'+91 99876 11240',   duration:'1:15', status:'answered',  agent:'Aman Dubey',    agentInit:'AD', hasRecording:true,  outcome:'Follow-up',      pipeline:'Enterprise' },
  { id:3,  ts:'Today, 10:08 AM',   dir:'inbound',  callerName:'Unknown',       callerNum:'+1 415 555 0001', dest:'Support Inbound',   destNum:'+1 (415) 555-0148', duration:'0:00', status:'missed',    agent:'—',             agentInit:'',   hasRecording:false, outcome:'—',              pipeline:'—' },
  { id:4,  ts:'Today, 9:31 AM',    dir:'inbound',  callerName:'Priya Sharma',  callerNum:'+91 88001 45321', dest:'Main Sales Line',   destNum:'+1 (415) 555-0192', duration:'7:48', status:'answered',  agent:'Riya Acharya',  agentInit:'RA', hasRecording:true,  outcome:'Proposal Sent',  pipeline:'Inbound — SaaS' },
  { id:5,  ts:'Yesterday, 5:20 PM',dir:'inbound',  callerName:'Kabir Hussain', callerNum:'+91 70001 99812', dest:'Support Inbound',   destNum:'+1 (415) 555-0148', duration:'2:05', status:'voicemail', agent:'—',             agentInit:'',   hasRecording:true,  outcome:'—',              pipeline:'—' },
  { id:6,  ts:'Yesterday, 3:45 PM',dir:'outbound', callerName:'Meera Nair',    callerNum:'+91 80001 33244', dest:'Meera Nair',        destNum:'+91 80001 33244',   duration:'9:12', status:'answered',  agent:'Nisha Kumar',   agentInit:'NK', hasRecording:true,  outcome:'Closed Won',     pipeline:'Renewals Q3' },
  { id:7,  ts:'Yesterday, 1:10 PM',dir:'inbound',  callerName:'James Liu',     callerNum:'+1 628 555 0090', dest:'Campaign — SaaS',  destNum:'+1 (628) 555-0173', duration:'0:00', status:'busy',      agent:'—',             agentInit:'',   hasRecording:false, outcome:'—',              pipeline:'Inbound — SaaS' },
  { id:8,  ts:'May 2, 11:00 AM',   dir:'outbound', callerName:'Aisha Patel',   callerNum:'+44 7700 900234', dest:'Aisha Patel',       destNum:'+44 7700 900234',   duration:'3:55', status:'answered',  agent:'Aman Dubey',    agentInit:'AD', hasRecording:true,  outcome:'Meeting Booked', pipeline:'Enterprise' },
]

/* ── Providers ── */
interface Provider {
  id: string; name: string; logo: string; color: string
  description: string; status: ProvStatus
  features: string[]; callsToday?: number; activeLines?: number
  accountId?: string; webhookOk?: boolean
}

const PROVIDERS: Provider[] = [
  { id: 'lcphone',      name: 'LC Phone (Native)',         logo: 'LC', color: '#6366F1', status: 'connected', features: ['IVR', 'Recording', 'Voicemail Drop', 'Call Tracking', 'SMS', 'Whisper'], callsToday: 142, activeLines: 8, accountId: 'LC-ACM-8821', webhookOk: true, description: 'PhantomCore\'s built-in phone system. Included with your plan — no extra credentials required.' },
  { id: 'twilio',       name: 'Twilio Voice',              logo: 'TW', color: '#F22F46', status: 'connected', features: ['Programmable Voice', 'Transcription', 'IVR', 'Insights', 'SIP'],          callsToday: 28,  activeLines: 2, accountId: 'ACb8d3...f12e', webhookOk: true, description: 'Programmable voice API for inbound/outbound calls, IVR flows, and call transcription.' },
  { id: '3cx',          name: '3CX PBX',                   logo: '3X', color: '#0078D4', status: 'connected', features: ['SIP Trunking', 'Video Calls', 'Live Chat', 'IVR', 'Call Recording'],      callsToday: 56,  activeLines: 4, accountId: 'pbx.acmemarketing.io', webhookOk: true, description: 'Enterprise PBX system with SIP trunking, video calls, and live chat. Self-hosted or cloud.' },
  { id: 'cisco',        name: 'Cisco Webex Calling',       logo: 'WX', color: '#00BCEB', status: 'available', features: ['PSTN', 'Webex Integration', 'Analytics', 'IVR', 'Hunt Groups'], description: 'Enterprise-grade cloud calling with Webex integration and advanced analytics.' },
  { id: 'ringcentral',  name: 'RingCentral',               logo: 'RC', color: '#FF8800', status: 'available', features: ['UCaaS', 'Contact Center', 'Analytics', 'IVR', 'Video'],         description: 'Cloud communications platform with UCaaS, contact center, and team messaging.' },
  { id: 'vonage',       name: 'Vonage (Ericsson)',          logo: 'VG', color: '#6D1FCC', status: 'available', features: ['Voice API', 'PSTN', 'Global Coverage', 'SIP', 'WebRTC'],        description: 'Cloud communications API for voice, SMS, and video with global PSTN coverage.' },
  { id: 'zoom',         name: 'Zoom Phone',                logo: 'ZP', color: '#2D8CFF', status: 'coming_soon', features: ['PSTN', 'Zoom Integration', 'IVR', 'Call Queues', 'Analytics'], description: 'Cloud phone system integrated with Zoom meetings and PSTN support.' },
  { id: 'teams',        name: 'Microsoft Teams Calling',   logo: 'MT', color: '#5558AF', status: 'coming_soon', features: ['Direct Routing', 'Calling Plans', 'Auto Attendant', 'Compliance'], description: 'Direct routing and calling plans through Microsoft Teams for enterprise telephony.' },
]

/* ── IVR Flows ── */
const IVR_FLOWS = [
  { id: 'ivr1', name: 'Main Sales IVR', status: 'active', numbers: 1, steps: 6, updated: 'May 1, 2026', calls: 234, resolution: '68%' },
  { id: 'ivr2', name: 'Support Menu',   status: 'active', numbers: 1, steps: 4, updated: 'Apr 22, 2026', calls: 98,  resolution: '54%' },
  { id: 'ivr3', name: 'After Hours',    status: 'active', numbers: 2, steps: 3, updated: 'Mar 10, 2026', calls: 41,  resolution: '100%' },
  { id: 'ivr4', name: 'UK Inbound',     status: 'draft',  numbers: 0, steps: 5, updated: 'Apr 30, 2026', calls: 0,   resolution: '—' },
]

/* ── Routing config for selected number ── */
const ROUTING_PRIORITIES = [
  { step: 1, label: 'Workflow / Automation', sublabel: 'Runs first if a trigger matches', icon: 'flow',    enabled: true,  detail: 'Sales Intake v2' },
  { step: 2, label: 'IVR / Auto-Attendant',  sublabel: 'Interactive menu for callers',   icon: 'branch',  enabled: true,  detail: 'Main Sales IVR' },
  { step: 3, label: 'Voice AI Agent',         sublabel: 'AI handles screening & FAQs',    icon: 'ai',      enabled: false, detail: 'Not configured' },
  { step: 4, label: 'Ring / Forward',         sublabel: 'Ring team or forward to number', icon: 'phone',   enabled: true,  detail: 'Sales Team · 30s timeout' },
  { step: 5, label: 'Voicemail',              sublabel: 'Final fallback if unanswered',   icon: 'voice',   enabled: true,  detail: 'Custom greeting · 90s' },
]

/* ── Helpers ── */
const STATUS_PILL: Record<CallStatus, { cls: string; label: string }> = {
  answered:  { cls: 'green', label: 'Answered' },
  missed:    { cls: 'red',   label: 'Missed' },
  voicemail: { cls: 'blue',  label: 'Voicemail' },
  busy:      { cls: 'amber', label: 'Busy' },
  'no-answer':{ cls: 'gray', label: 'No Answer' },
}

const TABS: Tab[] = ['Phone Numbers', 'Call Routing', 'IVR', 'Call Logs', 'Integrations', 'Settings']

export default function TelephonyPage() {
  const [tab, setTab]               = useState<Tab>('Phone Numbers')
  const [selectedNum, setSelectedNum] = useState<string>('n1')
  const [configProvider, setConfig]  = useState<Provider | null>(null)
  const [buyModal, setBuyModal]      = useState(false)
  const [callFilter, setCallFilter]  = useState<'all'|CallStatus>('all')
  const [callDirFilter, setCallDirFilter] = useState<'all'|CallDir>('all')
  const [routeToggles, setRouteToggles] = useState<Record<number,boolean>>(
    Object.fromEntries(ROUTING_PRIORITIES.map(r => [r.step, r.enabled]))
  )

  const selectedNumber = PHONE_NUMBERS.find(n => n.id === selectedNum)!
  const connectedProviders = PROVIDERS.filter(p => p.status === 'connected')

  const filteredCalls = CALL_LOGS.filter(c => {
    if (callFilter !== 'all' && c.status !== callFilter) return false
    if (callDirFilter !== 'all' && c.dir !== callDirFilter) return false
    return true
  })

  const totalCalls = CALL_LOGS.length
  const answered   = CALL_LOGS.filter(c => c.status === 'answered').length
  const missed     = CALL_LOGS.filter(c => c.status === 'missed').length
  const avgDur     = '3:24'

  return (
    <>
      <Topbar
        title="Telephony"
        subtitle={`${connectedProviders.length} providers connected · ${missed} missed today`}
        breadcrumb={['Telephony']}
        actions={
          <button className="btn primary" style={{ fontSize: 12 }} onClick={() => setBuyModal(true)}>
            <I.plus size={13} /> Buy Number
          </button>
        }
      />

      {/* Stats */}
      <div className="row gap-3" style={{ padding: '0 24px 20px' }}>
        {[
          { label: 'Calls Today',   value: String(totalCalls), sub: `${answered} answered`, color: 'var(--accent)',  icon: 'phone' },
          { label: 'Answer Rate',   value: `${Math.round(answered/totalCalls*100)}%`,    sub: `${totalCalls - answered} missed/VM`, color: 'var(--green)',  icon: 'check' },
          { label: 'Avg Handle',    value: avgDur,             sub: 'per call',           color: 'var(--teal)',   icon: 'clock' },
          { label: 'Active Lines',  value: String(connectedProviders.reduce((a,p)=>a+(p.activeLines??0),0)), sub: 'right now', color: 'var(--blue)', icon: 'voice' },
          { label: 'IVR Resolution',value: '68%',              sub: 'self-served',        color: 'var(--violet)', icon: 'branch' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div className="row gap-2" style={{ marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: `color-mix(in srgb, ${s.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon === 'phone'  && <I.phone  size={12} style={{ color: s.color }} />}
                {s.icon === 'check'  && <I.check  size={12} style={{ color: s.color }} />}
                {s.icon === 'clock'  && <I.clock  size={12} style={{ color: s.color }} />}
                {s.icon === 'voice'  && <I.voice  size={12} style={{ color: s.color }} />}
                {s.icon === 'branch' && <I.branch size={12} style={{ color: s.color }} />}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-row" style={{ padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {/* ── Phone Numbers ── */}
      {tab === 'Phone Numbers' && (
        <div style={{ padding: '20px 24px' }}>
          <div className="row gap-2" style={{ marginBottom: 16 }}>
            <div className="search-box" style={{ flex: 1, maxWidth: 300 }}>
              <I.search size={13} className="muted-2" />
              <input placeholder="Search numbers…" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }} />
            </div>
            <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 'auto' }}>
              <option>All providers</option>
              {connectedProviders.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
            <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 'auto' }}>
              <option>All statuses</option>
              <option>Active</option><option>Paused</option><option>Pending</option>
            </select>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th style={{ width: 120 }}>Provider</th>
                  <th style={{ width: 90 }}>Status</th>
                  <th style={{ width: 170 }}>Assigned To</th>
                  <th style={{ width: 160 }}>Usage This Month</th>
                  <th style={{ width: 80 }}>Calls</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {PHONE_NUMBERS.map(n => {
                  const pct = Math.round(n.usedMinutes / n.monthlyMinutes * 100)
                  const barColor = pct > 85 ? 'var(--red)' : pct > 65 ? 'var(--amber)' : 'var(--green)'
                  return (
                    <tr key={n.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', fontFamily: 'monospace' }}>{n.number}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{n.friendly}</div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                          {n.provider}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${n.status === 'active' ? 'green' : n.status === 'paused' ? 'amber' : 'gray'}`} style={{ fontSize: 10, textTransform: 'capitalize' }}>
                          {n.status === 'active' && <span className="dot" style={{ background: 'var(--green)' }} />}
                          {n.status}
                        </span>
                      </td>
                      <td>
                        <div className="row gap-2">
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: n.assignedType === 'team' ? 'var(--accent-soft)' : n.assignedType === 'pipeline' ? 'var(--teal-soft)' : 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: n.assignedType === 'team' ? 'var(--accent)' : n.assignedType === 'pipeline' ? 'var(--teal)' : 'var(--violet)', flexShrink: 0 }}>
                            {n.assignedType === 'team' ? 'T' : n.assignedType === 'pipeline' ? 'P' : n.assignedTo.split(' ').map(w=>w[0]).join('')}
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{n.assignedTo}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="row gap-2" style={{ marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{n.usedMinutes} / {n.monthlyMinutes} min</span>
                            <span style={{ fontSize: 10, color: pct > 85 ? 'var(--red)' : 'var(--text-3)' }}>{pct}%</span>
                          </div>
                          <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden', width: 120 }}>
                            <div style={{ height: '100%', width: `${Math.min(pct,100)}%`, background: barColor, borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{n.callVolume}</span></td>
                      <td>
                        <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                          <button className="icon-btn" title="Configure" style={{ width: 28, height: 28 }} onClick={() => { setTab('Call Routing'); setSelectedNum(n.id) }}><I.cog size={12} /></button>
                          <button className="icon-btn" title="More" style={{ width: 28, height: 28 }}><I.more size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Feature tags legend */}
          <div style={{ marginTop: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Active Features Across Numbers</div>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              {['IVR', 'Call Recording', 'Voicemail Drop', 'Whisper Messages', 'Call Tracking', 'SIP Trunking'].map(f => (
                <span key={f} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'var(--accent-soft)', border: '1px solid rgba(99,102,241,.2)', color: 'var(--accent)', fontWeight: 500 }}>
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Call Routing ── */}
      {tab === 'Call Routing' && (
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
          {/* Number picker */}
          <div className="col gap-1">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Select Number</div>
            {PHONE_NUMBERS.map(n => (
              <button
                key={n.id}
                onClick={() => setSelectedNum(n.id)}
                style={{
                  background: selectedNum === n.id ? 'var(--accent-soft)' : 'var(--surface)',
                  border: `1px solid ${selectedNum === n.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'monospace' }}>{n.number}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{n.friendly}</div>
              </button>
            ))}
          </div>

          {/* Routing config */}
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
              <div className="row gap-3" style={{ marginBottom: 16 }}>
                <div className="col flex-1">
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Call Routing — {selectedNumber.friendly}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Configure how inbound calls are handled in priority order</div>
                </div>
                <button className="btn ghost" style={{ fontSize: 12 }}><I.check size={13} /> Save Changes</button>
              </div>

              {/* Priority stack */}
              <div className="col gap-2">
                {ROUTING_PRIORITIES.map((r, idx) => (
                  <div key={r.step}>
                    <div style={{
                      background: routeToggles[r.step] ? 'var(--surface-2)' : 'var(--surface)',
                      border: `1px solid ${routeToggles[r.step] ? 'var(--border-strong)' : 'var(--border-soft)'}`,
                      borderRadius: 10, padding: '14px 16px',
                      opacity: routeToggles[r.step] ? 1 : 0.45,
                    }}>
                      <div className="row gap-3">
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: routeToggles[r.step] ? 'var(--accent-soft)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: routeToggles[r.step] ? 'var(--accent)' : 'var(--text-4)', flexShrink: 0 }}>
                          {r.step}
                        </div>
                        <div className="col flex-1" style={{ gap: 2 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.sublabel}</div>
                        </div>
                        {routeToggles[r.step] && (
                          <span style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: 5, padding: '2px 8px', fontWeight: 500 }}>
                            {r.detail}
                          </span>
                        )}
                        <div
                          onClick={() => setRouteToggles(t => ({ ...t, [r.step]: !t[r.step] }))}
                          style={{ width: 34, height: 18, borderRadius: 9, background: routeToggles[r.step] ? 'var(--accent)' : 'var(--border-strong)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}
                        >
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: routeToggles[r.step] ? 18 : 2, transition: 'left .2s' }} />
                        </div>
                      </div>
                    </div>
                    {idx < ROUTING_PRIORITIES.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 28, marginTop: 2 }}>
                        <div style={{ width: 2, height: 8, background: 'var(--border)', borderRadius: 1 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Business Hours</div>
              <div className="col gap-2">
                {['Mon–Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="row gap-3">
                    <span style={{ fontSize: 12, color: 'var(--text-2)', width: 60 }}>{day}</span>
                    {i === 0 ? (
                      <>
                        <input className="input" defaultValue="9:00 AM" style={{ fontSize: 12, width: 90 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>to</span>
                        <input className="input" defaultValue="6:00 PM" style={{ fontSize: 12, width: 90 }} />
                        <span className="pill green" style={{ fontSize: 10 }}>Open</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Closed · after-hours routing active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── IVR ── */}
      {tab === 'IVR' && (
        <div style={{ padding: '20px 24px' }}>
          <div className="row gap-2" style={{ marginBottom: 16 }}>
            <div className="flex-1" />
            <button className="btn primary" style={{ fontSize: 12 }}><I.plus size={13} /> Create IVR Flow</button>
          </div>

          <div className="table-wrap" style={{ marginBottom: 24 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Flow Name</th>
                  <th style={{ width: 90 }}>Status</th>
                  <th style={{ width: 120 }}>Numbers Using</th>
                  <th style={{ width: 80 }}>Steps</th>
                  <th style={{ width: 80 }}>Calls</th>
                  <th style={{ width: 120 }}>IVR Resolution</th>
                  <th style={{ width: 130 }}>Last Updated</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {IVR_FLOWS.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div className="row gap-2">
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <I.branch size={14} style={{ color: 'var(--accent)' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{f.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`pill ${f.status === 'active' ? 'green' : 'gray'}`} style={{ fontSize: 10, textTransform: 'capitalize' }}>
                        {f.status === 'active' && <span className="dot" style={{ background: 'var(--green)' }} />}
                        {f.status}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.numbers} number{f.numbers !== 1 ? 's' : ''}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.steps} steps</span></td>
                    <td><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{f.calls}</span></td>
                    <td>
                      <div className="row gap-2">
                        <div style={{ height: 4, width: 60, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: f.resolution === '—' ? '0%' : f.resolution, background: 'var(--teal)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.resolution}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{f.updated}</span></td>
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

          {/* IVR preview */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Main Sales IVR — Flow Preview</div>
            <div className="col gap-0" style={{ alignItems: 'flex-start', maxWidth: 480 }}>
              {[
                { icon: 'voice', label: 'Play Message', detail: '"Thank you for calling Acme Marketing…"', color: 'var(--blue)' },
                { icon: 'phone', label: 'Collect Input', detail: 'Press 1 · Sales  /  Press 2 · Support  /  Press 3 · Billing', color: 'var(--teal)' },
                { icon: 'branch', label: 'Branch',       detail: 'Routes to Sales Team / Support IVR / Billing voicemail', color: 'var(--accent)' },
                { icon: 'bell',  label: 'Ring Team',     detail: 'Sales Team · Round-robin · 30s timeout', color: 'var(--amber)' },
                { icon: 'voice', label: 'Voicemail',     detail: 'Custom greeting · Email + SMS notify', color: 'var(--violet)' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in srgb, ${step.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.icon === 'voice'  && <I.voice  size={14} style={{ color: step.color }} />}
                      {step.icon === 'phone'  && <I.phone  size={14} style={{ color: step.color }} />}
                      {step.icon === 'branch' && <I.branch size={14} style={{ color: step.color }} />}
                      {step.icon === 'bell'   && <I.bell   size={14} style={{ color: step.color }} />}
                    </div>
                    {i < 4 && <div style={{ width: 2, height: 20, background: 'var(--border)', margin: '2px 0' }} />}
                  </div>
                  <div style={{ paddingTop: 6, paddingBottom: i < 4 ? 0 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1, marginBottom: 8 }}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Call Logs ── */}
      {tab === 'Call Logs' && (
        <div style={{ padding: '20px 24px' }}>
          <div className="row gap-2" style={{ marginBottom: 16 }}>
            <div className="search-box" style={{ flex: 1, maxWidth: 300 }}>
              <I.search size={13} className="muted-2" />
              <input placeholder="Search by name or number…" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }} />
            </div>
            <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 'auto' }}>
              <option>Today</option><option>Yesterday</option><option>This week</option><option>This month</option><option>Custom</option>
            </select>
            <div className="row gap-1">
              {(['all','inbound','outbound'] as const).map(d => (
                <button key={d} onClick={() => setCallDirFilter(d)} className={`btn ghost${callDirFilter === d ? ' active' : ''}`} style={{ fontSize: 11, padding: '5px 10px', textTransform: 'capitalize' }}>
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </div>
            <div className="row gap-1">
              {(['all','answered','missed','voicemail'] as const).map(s => (
                <button key={s} onClick={() => setCallFilter(s)} className={`btn ghost${callFilter === s ? ' active' : ''}`} style={{ fontSize: 11, padding: '5px 10px', textTransform: 'capitalize' }}>
                  {s === 'all' ? 'All' : STATUS_PILL[s as CallStatus]?.label ?? s}
                </button>
              ))}
            </div>
            <button className="btn ghost" style={{ fontSize: 11 }}><I.download size={12} /> Export</button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th>Caller</th>
                  <th>Destination</th>
                  <th style={{ width: 90 }}>Duration</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 130 }}>Agent</th>
                  <th style={{ width: 130 }}>Outcome</th>
                  <th style={{ width: 70 }}>Rec.</th>
                  <th style={{ width: 130 }}>Time</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.dir === 'inbound' ? 'var(--blue-soft)' : 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <I.phone size={11} style={{ color: c.dir === 'inbound' ? 'var(--blue)' : 'var(--accent)', transform: c.dir === 'outbound' ? 'rotate(-135deg)' : 'rotate(135deg)' }} />
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.callerName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{c.callerNum}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.dest}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{c.destNum}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: c.status === 'missed' ? 'var(--red)' : 'var(--text-2)', fontFamily: 'monospace' }}>
                        {c.duration}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${STATUS_PILL[c.status].cls}`} style={{ fontSize: 10 }}>
                        {STATUS_PILL[c.status].label}
                      </span>
                    </td>
                    <td>
                      {c.agent !== '—' ? (
                        <div className="row gap-2">
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{c.agentInit}</div>
                          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.agent}</span>
                        </div>
                      ) : <span style={{ fontSize: 12, color: 'var(--text-4)' }}>—</span>}
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: c.outcome === '—' ? 'var(--text-4)' : 'var(--text-2)' }}>{c.outcome}</span>
                    </td>
                    <td>
                      {c.hasRecording ? (
                        <button className="icon-btn" title="Play recording" style={{ width: 28, height: 28 }}>
                          <I.play size={10} style={{ color: 'var(--accent)' }} />
                        </button>
                      ) : <span style={{ color: 'var(--text-4)', fontSize: 12 }}>—</span>}
                    </td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.ts}</span></td>
                    <td>
                      <button className="icon-btn" style={{ width: 28, height: 28 }}><I.more size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row gap-3" style={{ marginTop: 14, fontSize: 12, color: 'var(--text-3)' }}>
            <span>Showing {filteredCalls.length} of {CALL_LOGS.length} calls</span>
          </div>
        </div>
      )}

      {/* ── Integrations ── */}
      {tab === 'Integrations' && (
        <div style={{ padding: '20px 24px' }}>
          {/* Connected providers summary */}
          <div className="row gap-3" style={{ marginBottom: 24 }}>
            {connectedProviders.map(p => (
              <div key={p.id} style={{ flex: 1, background: 'var(--surface)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 12, padding: '16px 18px' }}>
                <div className="row gap-3" style={{ marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, ${p.color} 15%, var(--surface-2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: p.color }}>
                    {p.logo}
                  </div>
                  <div className="col flex-1">
                    <div className="row gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                      <span className="pill green" style={{ fontSize: 9 }}><span className="dot pulse" style={{ background: 'var(--green)' }} />Live</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Account: {p.accountId}</span>
                  </div>
                </div>
                <div className="row gap-4" style={{ fontSize: 11 }}>
                  <div><span style={{ color: 'var(--text-3)' }}>Today: </span><b style={{ color: 'var(--text)' }}>{p.callsToday}</b> calls</div>
                  <div><span style={{ color: 'var(--text-3)' }}>Lines: </span><b style={{ color: 'var(--text)' }}>{p.activeLines}</b> active</div>
                  <div><I.check size={10} style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--green)', marginLeft: 4 }}>Webhook OK</span></div>
                </div>
                <div className="row gap-2" style={{ marginTop: 12 }}>
                  <button className="btn ghost" style={{ fontSize: 11, flex: 1 }} onClick={() => setConfig(p)}><I.cog size={12} /> Configure</button>
                  <button className="btn ghost" style={{ fontSize: 11 }}>Test</button>
                </div>
              </div>
            ))}
          </div>

          {/* Available providers */}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Connect More Providers</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {PROVIDERS.filter(p => p.status !== 'connected').map(p => (
              <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', opacity: p.status === 'coming_soon' ? 0.55 : 1 }}>
                <div className="row gap-3" style={{ marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, ${p.color} 12%, var(--surface-2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: p.color }}>
                    {p.logo}
                  </div>
                  <div className="col flex-1 gap-1">
                    <div className="row gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                      {p.status === 'coming_soon' && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>Soon</span>}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 10 }}>{p.description}</p>
                <div className="row gap-1" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
                  {p.features.slice(0, 4).map(f => (
                    <span key={f} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>{f}</span>
                  ))}
                </div>
                <button className="btn primary" style={{ fontSize: 11, width: '100%' }} disabled={p.status === 'coming_soon'} onClick={() => p.status === 'available' && setConfig(p)}>
                  {p.status === 'coming_soon' ? 'Coming Soon' : <><I.plus size={12} /> Connect</>}
                </button>
              </div>
            ))}
          </div>

          {/* Custom SIP */}
          <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.globe size={16} className="muted-2" /></div>
            <div className="flex-1">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Custom SIP / Generic Provider</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Connect any SIP-compatible PBX or carrier using standard SIP credentials (RFC 3261)</div>
            </div>
            <button className="btn ghost" style={{ fontSize: 12 }}><I.plus size={13} /> Add SIP Trunk</button>
          </div>
        </div>
      )}

      {/* ── Settings ── */}
      {tab === 'Settings' && (
        <div style={{ padding: '20px 24px', maxWidth: 680 }}>
          {[
            {
              title: 'Call Recording',
              items: [
                { label: 'Enable call recording', sub: 'Record all inbound and outbound calls', on: true },
                { label: 'Ask for consent before recording', sub: 'Plays a compliance notice to both parties', on: true },
                { label: 'Auto-transcription', sub: 'AI transcribes recordings — searchable in call logs', on: false },
              ],
              extra: (
                <div className="row gap-3" style={{ marginTop: 12 }}>
                  <div className="form-field" style={{ flex: 1 }}>
                    <label>Retention Period</label>
                    <select className="input" style={{ fontSize: 12 }}><option>90 days</option><option>30 days</option><option>1 year</option><option>Unlimited</option></select>
                  </div>
                  <div className="form-field" style={{ flex: 1 }}>
                    <label>Storage</label>
                    <select className="input" style={{ fontSize: 12 }}><option>Cloud (Default)</option><option>AWS S3</option><option>On-premise</option></select>
                  </div>
                </div>
              ),
            },
            {
              title: 'Voicemail',
              items: [
                { label: 'Enable voicemail', sub: 'Allow callers to leave a voicemail when no one answers', on: true },
                { label: 'Voicemail transcription', sub: 'Transcribe and send voicemail text via email/SMS', on: true },
                { label: 'Notify by email', sub: 'Send new voicemail alert to assigned agent\'s email', on: true },
              ],
              extra: (
                <div style={{ marginTop: 12 }}>
                  <div className="form-field">
                    <label>Voicemail Greeting</label>
                    <div className="row gap-2">
                      <select className="input" style={{ fontSize: 12, flex: 1 }}><option>Custom greeting</option><option>Default greeting</option><option>Text-to-speech</option></select>
                      <button className="btn ghost" style={{ fontSize: 11 }}><I.upload size={12} /> Upload</button>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: 'Voicemail Drop',
              items: [
                { label: 'Enable voicemail drop', sub: 'Drop a pre-recorded voicemail without ringing the contact', on: true },
                { label: 'Track voicemail drops in analytics', sub: 'Shows drop success rate in call reports', on: true },
              ],
            },
            {
              title: 'Whisper Messages',
              items: [
                { label: 'Enable whisper messages', sub: 'Play a brief note to the agent before connecting caller', on: false },
              ],
            },
            {
              title: 'Compliance',
              items: [
                { label: 'TCPA compliance mode', sub: 'Enforce opt-in requirements for outbound calls (US)', on: true },
                { label: 'GDPR call data handling', sub: 'Auto-delete call data for EU contacts after retention period', on: true },
              ],
              extra: (
                <div style={{ background: 'var(--green-soft)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 14px', marginTop: 12, fontSize: 12, color: 'var(--text-2)' }}>
                  <I.check size={13} style={{ color: 'var(--green)', marginRight: 6 }} />
                  Compliance status: <b style={{ color: 'var(--green)' }}>Fully compliant</b> — Last audit: Jan 2026
                </div>
              ),
            },
          ].map(section => (
            <div key={section.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{section.title}</div>
              <div className="col gap-3">
                {section.items.map(item => (
                  <div key={item.label} className="row gap-3">
                    <div className="col flex-1" style={{ gap: 2 }}>
                      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.sub}</span>
                    </div>
                    <div style={{ width: 34, height: 18, borderRadius: 9, background: item.on ? 'var(--accent)' : 'var(--border-strong)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: item.on ? 18 : 2 }} />
                    </div>
                  </div>
                ))}
              </div>
              {section.extra}
            </div>
          ))}
        </div>
      )}

      {/* ── Connect / Configure Modal ── */}
      {configProvider && (
        <div className="modal-overlay" onClick={() => setConfig(null)}>
          <div className="modal-card" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-3" style={{ marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: `color-mix(in srgb, ${configProvider.color} 15%, var(--surface-2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: configProvider.color, flexShrink: 0 }}>
                {configProvider.logo}
              </div>
              <div className="col flex-1 gap-1">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  {configProvider.status === 'connected' ? 'Configure' : 'Connect'} {configProvider.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {configProvider.status === 'connected' ? 'Update your integration settings' : 'Enter your credentials to activate this integration'}
                </div>
              </div>
              <button className="icon-btn" onClick={() => setConfig(null)}><I.x size={14} /></button>
            </div>

            <div className="col gap-3">
              {(configProvider.id === '3cx') ? (
                <>
                  <div className="form-field">
                    <label>PBX Host</label>
                    <input className="input" placeholder="pbx.yourcompany.com" defaultValue={configProvider.status === 'connected' ? 'pbx.acmemarketing.io' : ''} />
                  </div>
                  <div className="row gap-2">
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>SIP Port</label>
                      <input className="input" placeholder="5060" defaultValue="5060" />
                    </div>
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Protocol</label>
                      <select className="input" style={{ fontSize: 12 }}><option>UDP (5060)</option><option>TLS (5061)</option><option>TCP</option></select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Auth ID / Extension</label>
                    <input className="input" placeholder="1001 or admin@pbx.host" />
                  </div>
                  <div className="form-field">
                    <label>Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </>
              ) : configProvider.id === 'lcphone' ? (
                <>
                  <div style={{ background: 'var(--green-soft)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: 'var(--text-2)' }}>
                    <I.check size={13} style={{ color: 'var(--green)', marginRight: 6 }} />
                    LC Phone is managed automatically — no credentials required.
                  </div>
                  <div className="form-field">
                    <label>Default Caller ID</label>
                    <select className="input" style={{ fontSize: 12 }}>
                      {PHONE_NUMBERS.filter(n=>n.provider==='LC Phone').map(n=><option key={n.id}>{n.number} — {n.friendly}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Outbound Call Recording</label>
                    <select className="input" style={{ fontSize: 12 }}><option>Always record</option><option>Ask agent</option><option>Never</option></select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label>Account SID / API Key</label>
                    <input className="input" placeholder={`${configProvider.name} Account SID`} defaultValue={configProvider.status === 'connected' ? 'ACb8d3••••••••f12e' : ''} />
                  </div>
                  <div className="form-field">
                    <label>Auth Token / Secret</label>
                    <input className="input" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <div className="form-field">
                    <label>Default From Number</label>
                    <input className="input" placeholder="+1 415 000 0000" />
                  </div>
                  <div className="form-field">
                    <label>Webhook URL <span style={{ fontWeight: 400, color: 'var(--text-3)', textTransform: 'none' }}>(auto-generated)</span></label>
                    <div className="row gap-2">
                      <input className="input flex-1" readOnly value="https://app.phantomcore.io/webhook/twilio/v1" style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)' }} />
                      <button className="btn ghost" style={{ fontSize: 11 }}><I.copy size={12} /></button>
                    </div>
                  </div>
                </>
              )}

              <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--text-2)' }}>Security:</b> Credentials are AES-256 encrypted at rest. Call recordings are stored in your provider account — PhantomCore never holds raw audio.
              </div>
            </div>

            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn ghost" style={{ fontSize: 12 }}>Test Connection</button>
              <button className="btn ghost" onClick={() => setConfig(null)}>Cancel</button>
              <button className="btn primary" onClick={() => setConfig(null)}>
                {configProvider.status === 'connected' ? <><I.check size={13} /> Save Changes</> : <><I.plus size={13} /> Connect Provider</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Buy Number Modal ── */}
      {buyModal && (
        <div className="modal-overlay" onClick={() => setBuyModal(false)}>
          <div className="modal-card" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-3" style={{ marginBottom: 20 }}>
              <div className="col flex-1">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Buy Phone Number</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Search for available numbers in any country</div>
              </div>
              <button className="icon-btn" onClick={() => setBuyModal(false)}><I.x size={14} /></button>
            </div>
            <div className="col gap-3">
              <div className="row gap-2">
                <div className="form-field" style={{ flex: 1 }}>
                  <label>Country</label>
                  <select className="input" style={{ fontSize: 12 }}><option>United States (+1)</option><option>United Kingdom (+44)</option><option>India (+91)</option><option>Canada (+1)</option><option>Australia (+61)</option></select>
                </div>
                <div className="form-field" style={{ flex: 1 }}>
                  <label>Area Code (optional)</label>
                  <input className="input" placeholder="e.g. 415" />
                </div>
              </div>
              <div className="form-field">
                <label>Number Type</label>
                <div className="row gap-2">
                  {['Local', 'Toll-Free', 'Mobile'].map(t => (
                    <button key={t} className={`btn ghost${t === 'Local' ? ' active' : ''}`} style={{ fontSize: 11, flex: 1 }}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label>Available Numbers</label>
                {['+1 (415) 555-0234', '+1 (415) 555-0187', '+1 (415) 555-0298'].map((num, i) => (
                  <div key={num} className="row gap-3" style={{ padding: '10px 12px', background: i === 0 ? 'var(--accent-soft)' : 'var(--surface-2)', border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, marginTop: i === 0 ? 0 : 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'monospace', flex: 1 }}>{num}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Local · $2/mo</span>
                    {i === 0 && <span className="pill green" style={{ fontSize: 9 }}>Selected</span>}
                  </div>
                ))}
              </div>
              <div className="form-field">
                <label>Friendly Name</label>
                <input className="input" placeholder="e.g. Campaign — Summer 2026" />
              </div>
              <div className="form-field">
                <label>Assign To</label>
                <select className="input" style={{ fontSize: 12 }}><option>Unassigned</option><option>Sales Team</option><option>Riya Acharya</option><option>Inbound — SaaS pipeline</option></select>
              </div>
            </div>
            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn ghost" onClick={() => setBuyModal(false)}>Cancel</button>
              <button className="btn primary" onClick={() => setBuyModal(false)}><I.check size={13} /> Purchase Number · $2/mo</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
