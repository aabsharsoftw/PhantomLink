'use client'

import { useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type ProviderStatus = 'connected' | 'available' | 'coming_soon'

interface Provider {
  id: string
  name: string
  logo: string
  logoColor: string
  description: string
  status: ProviderStatus
  features: string[]
  callsToday?: number
  activeLines?: number
}

const PROVIDERS: Provider[] = [
  {
    id: '3cx',
    name: '3CX',
    logo: '3CX',
    logoColor: '#0078D4',
    description: 'Enterprise PBX system with SIP trunking, video calls, and live chat. Self-hosted or cloud.',
    status: 'connected',
    features: ['SIP Trunking', 'Video Calls', 'Live Chat', 'IVR', 'Call Recording'],
    callsToday: 142,
    activeLines: 8,
  },
  {
    id: 'cisco',
    name: 'Cisco Webex Calling',
    logo: 'WX',
    logoColor: '#00BCEB',
    description: 'Enterprise-grade cloud calling with Webex integration, PSTN, and advanced analytics.',
    status: 'available',
    features: ['PSTN', 'Webex Integration', 'Analytics', 'IVR', 'Hunt Groups'],
  },
  {
    id: 'twilio',
    name: 'Twilio Voice',
    logo: 'TW',
    logoColor: '#F22F46',
    description: 'Programmable voice API for inbound/outbound calls, IVR flows, and call transcription.',
    status: 'available',
    features: ['Programmable Voice', 'Call Transcription', 'IVR Builder', 'Insights', 'SIP'],
  },
  {
    id: 'ringcentral',
    name: 'RingCentral',
    logo: 'RC',
    logoColor: '#FF8800',
    description: 'Cloud communications platform with UCaaS, contact center, and team messaging.',
    status: 'available',
    features: ['UCaaS', 'Contact Center', 'Analytics', 'IVR', 'Video'],
  },
  {
    id: 'vonage',
    name: 'Vonage (Ericsson)',
    logo: 'VG',
    logoColor: '#6D1FCC',
    description: 'Cloud communications API for voice, SMS, and video with global PSTN coverage.',
    status: 'available',
    features: ['Voice API', 'PSTN', 'Global Coverage', 'SIP', 'WebRTC'],
  },
  {
    id: 'plivo',
    name: 'Plivo',
    logo: 'PL',
    logoColor: '#1DB954',
    description: 'Cloud telephony platform with voice APIs, SIP trunking, and number management.',
    status: 'available',
    features: ['Voice API', 'SIP Trunking', 'Number Masking', 'Recording', 'IVR'],
  },
  {
    id: 'zoom',
    name: 'Zoom Phone',
    logo: 'ZP',
    logoColor: '#2D8CFF',
    description: 'Cloud phone system integrated with Zoom meetings, with PSTN and SIP trunking.',
    status: 'coming_soon',
    features: ['PSTN', 'Zoom Integration', 'IVR', 'Call Queues', 'Analytics'],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams Calling',
    logo: 'MT',
    logoColor: '#5558AF',
    description: 'Direct routing and calling plans through Microsoft Teams for enterprise telephony.',
    status: 'coming_soon',
    features: ['Direct Routing', 'Calling Plans', 'IVR', 'Auto Attendant', 'Compliance'],
  },
]

const MOCK_RECENT_CALLS = [
  { id: 1, name: 'Sana Iqbal',     number: '+91 98103 22018', direction: 'inbound',  duration: '4:32', status: 'answered',  time: '2h ago',  provider: '3cx' },
  { id: 2, name: 'Rohit Menon',    number: '+91 99876 11240', direction: 'outbound', duration: '1:15', status: 'answered',  time: '3h ago',  provider: '3cx' },
  { id: 3, name: 'Unknown',        number: '+1 415 555 0192', direction: 'inbound',  duration: '0:00', status: 'missed',    time: '5h ago',  provider: '3cx' },
  { id: 4, name: 'Priya Sharma',   number: '+91 88001 45321', direction: 'outbound', duration: '7:48', status: 'answered',  time: 'Yesterday',provider: '3cx' },
  { id: 5, name: 'Kabir Hussain',  number: '+91 70001 99812', direction: 'inbound',  duration: '2:05', status: 'voicemail', time: 'Yesterday',provider: '3cx' },
]

type Tab = 'Integrations' | 'Recent Calls' | 'Numbers' | 'Settings'
const TABS: Tab[] = ['Integrations', 'Recent Calls', 'Numbers', 'Settings']

type ModalProvider = Provider | null

export default function TelephonyPage() {
  const [tab, setTab] = useState<Tab>('Integrations')
  const [configModal, setConfigModal] = useState<ModalProvider>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | ProviderStatus>('all')

  const connected = PROVIDERS.filter(p => p.status === 'connected')
  const filtered = filterStatus === 'all' ? PROVIDERS : PROVIDERS.filter(p => p.status === filterStatus)

  return (
    <>
      <Topbar
        title="Telephony"
        subtitle={`${connected.length} provider connected · ${MOCK_RECENT_CALLS.filter(c => c.status === 'missed').length} missed calls today`}
        breadcrumb={['Telephony']}
        actions={
          <button className="btn primary" style={{ fontSize: 12 }}>
            <I.plus size={13} /> Add Provider
          </button>
        }
      />

      {/* Stats row */}
      <div className="row gap-3" style={{ padding: '0 24px 20px' }}>
        {[
          { label: 'Calls Today', value: '142', icon: 'phone', color: 'var(--accent)' },
          { label: 'Avg Duration', value: '3:24', icon: 'clock', color: 'var(--teal)' },
          { label: 'Missed', value: '12', icon: 'bell', color: 'var(--red)' },
          { label: 'Active Lines', value: '8', icon: 'voice', color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div className="row gap-2" style={{ marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `color-mix(in srgb, ${s.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon === 'phone' && <I.phone size={13} style={{ color: s.color }} />}
                {s.icon === 'clock' && <I.clock size={13} style={{ color: s.color }} />}
                {s.icon === 'bell' && <I.bell size={13} style={{ color: s.color }} />}
                {s.icon === 'voice' && <I.voice size={13} style={{ color: s.color }} />}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-row" style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
        {TABS.map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Integrations' && (
        <div style={{ padding: '20px 24px' }}>
          {/* Filter */}
          <div className="row gap-2" style={{ marginBottom: 20 }}>
            {(['all', 'connected', 'available', 'coming_soon'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`btn ghost${filterStatus === f ? ' active' : ''}`}
                style={{ fontSize: 11, padding: '5px 12px', textTransform: f === 'coming_soon' ? 'none' : undefined }}
              >
                {f === 'all' ? 'All Providers' : f === 'connected' ? 'Connected' : f === 'available' ? 'Available' : 'Coming Soon'}
              </button>
            ))}
          </div>

          {/* Connected banner */}
          {connected.length > 0 && filterStatus === 'all' && (
            <div style={{ background: 'var(--green-soft)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="dot pulse" style={{ background: 'var(--green)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>
                {connected.map(p => p.name).join(', ')} connected and active
              </span>
              <div className="flex-1" />
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>142 calls handled today</span>
            </div>
          )}

          {/* Provider grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {filtered.map(provider => (
              <div
                key={provider.id}
                style={{
                  background: 'var(--surface)', border: `1px solid ${provider.status === 'connected' ? 'rgba(34,197,94,.25)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '18px 20px',
                  opacity: provider.status === 'coming_soon' ? 0.6 : 1,
                }}
              >
                <div className="row gap-3" style={{ marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: `color-mix(in srgb, ${provider.logoColor} 15%, var(--surface-2))`,
                    border: `1px solid color-mix(in srgb, ${provider.logoColor} 25%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: provider.logoColor, letterSpacing: '-.5px',
                  }}>
                    {provider.logo}
                  </div>
                  <div className="col flex-1" style={{ gap: 3 }}>
                    <div className="row gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{provider.name}</span>
                      {provider.status === 'connected' && (
                        <span className="pill green" style={{ fontSize: 9 }}>
                          <span className="dot" style={{ background: 'var(--green)' }} />Connected
                        </span>
                      )}
                      {provider.status === 'coming_soon' && (
                        <span className="pill" style={{ fontSize: 9, background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>Soon</span>
                      )}
                    </div>
                    {provider.status === 'connected' && (
                      <div className="row gap-3" style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        <span><b style={{ color: 'var(--text-2)' }}>{provider.callsToday}</b> calls today</span>
                        <span><b style={{ color: 'var(--text-2)' }}>{provider.activeLines}</b> active lines</span>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>
                  {provider.description}
                </p>

                <div className="row gap-1" style={{ flexWrap: 'wrap', marginBottom: 14 }}>
                  {provider.features.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)', fontWeight: 500 }}>
                      {f}
                    </span>
                  ))}
                </div>

                <div className="row gap-2">
                  {provider.status === 'connected' ? (
                    <>
                      <button className="btn ghost" style={{ fontSize: 11, flex: 1 }} onClick={() => setConfigModal(provider)}>
                        <I.cog size={12} /> Configure
                      </button>
                      <button className="btn ghost" style={{ fontSize: 11, color: 'var(--red)', borderColor: 'rgba(239,68,68,.3)' }}>
                        Disconnect
                      </button>
                    </>
                  ) : provider.status === 'coming_soon' ? (
                    <button className="btn ghost" style={{ fontSize: 11, flex: 1 }} disabled>
                      Coming Soon
                    </button>
                  ) : (
                    <button className="btn primary" style={{ fontSize: 11, flex: 1 }} onClick={() => setConfigModal(provider)}>
                      <I.plus size={12} /> Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom SIP section */}
          <div style={{ marginTop: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
            <div className="row gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.globe size={18} className="muted-2" />
              </div>
              <div className="col flex-1" style={{ gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Custom SIP / Generic Provider</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Connect any SIP-compatible PBX or carrier using standard SIP credentials</span>
              </div>
              <button className="btn ghost" style={{ fontSize: 12 }}>
                <I.plus size={13} /> Add SIP Trunk
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'Recent Calls' && (
        <div style={{ padding: '20px 24px' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 32 }}></th>
                  <th>Contact</th>
                  <th style={{ width: 160 }}>Number</th>
                  <th style={{ width: 100 }}>Direction</th>
                  <th style={{ width: 90 }}>Duration</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 100 }}>Provider</th>
                  <th style={{ width: 100 }}>Time</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RECENT_CALLS.map(call => (
                  <tr key={call.id}>
                    <td>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: call.direction === 'inbound' ? 'var(--blue-soft)' : 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <I.phone size={12} style={{ color: call.direction === 'inbound' ? 'var(--blue)' : 'var(--accent)', transform: call.direction === 'outbound' ? 'scaleX(-1)' : undefined }} />
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{call.name}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono, monospace)' }}>{call.number}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: call.direction === 'inbound' ? 'var(--blue)' : 'var(--accent)', fontWeight: 500, textTransform: 'capitalize' }}>
                        {call.direction}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{call.duration}</span>
                    </td>
                    <td>
                      <span className={`pill ${call.status === 'answered' ? 'green' : call.status === 'missed' ? 'red' : 'gray'}`} style={{ fontSize: 10, textTransform: 'capitalize' }}>
                        {call.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#0078D4', background: 'rgba(0,120,212,.1)', borderRadius: 4, padding: '2px 6px' }}>
                        {call.provider.toUpperCase()}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{call.time}</span></td>
                    <td>
                      <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" title="Call back" style={{ width: 28, height: 28 }}><I.phone size={12} /></button>
                        <button className="icon-btn" title="More" style={{ width: 28, height: 28 }}><I.more size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Numbers' && (
        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
            <I.phone size={32} className="muted-2" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Phone Numbers</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Manage inbound numbers, assign to pipelines or agents</div>
            <button className="btn primary" style={{ fontSize: 12 }}><I.plus size={13} /> Add Number</button>
          </div>
        </div>
      )}

      {tab === 'Settings' && (
        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
            <I.cog size={32} className="muted-2" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Telephony Settings</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Call routing, IVR, voicemail, and recording settings coming soon</div>
          </div>
        </div>
      )}

      {/* Connect / Configure Modal */}
      {configModal && (
        <div className="modal-overlay" onClick={() => setConfigModal(null)}>
          <div className="modal-card" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="row gap-3" style={{ marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 9, flexShrink: 0,
                background: `color-mix(in srgb, ${configModal.logoColor} 15%, var(--surface-2))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: configModal.logoColor,
              }}>
                {configModal.logo}
              </div>
              <div className="col flex-1" style={{ gap: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  {configModal.status === 'connected' ? 'Configure' : 'Connect'} {configModal.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Enter your credentials to {configModal.status === 'connected' ? 'update' : 'activate'} this integration</div>
              </div>
              <button className="icon-btn" onClick={() => setConfigModal(null)}><I.x size={14} /></button>
            </div>

            <div className="col gap-3">
              {configModal.id === '3cx' || configModal.id === 'cisco' ? (
                <>
                  <div className="form-field">
                    <label>PBX / Server Host</label>
                    <input className="input" placeholder="pbx.yourcompany.com" defaultValue={configModal.status === 'connected' ? 'pbx.acmemarketing.io' : ''} />
                  </div>
                  <div className="form-field">
                    <label>SIP Port</label>
                    <input className="input" placeholder="5060" defaultValue={configModal.status === 'connected' ? '5060' : ''} />
                  </div>
                  <div className="form-field">
                    <label>Username / Extension</label>
                    <input className="input" placeholder="1001" />
                  </div>
                  <div className="form-field">
                    <label>Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label>Account SID / API Key</label>
                    <input className="input" placeholder={`${configModal.name} Account SID`} />
                  </div>
                  <div className="form-field">
                    <label>Auth Token / Secret</label>
                    <input className="input" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <div className="form-field">
                    <label>Default From Number</label>
                    <input className="input" placeholder="+1 415 000 0000" />
                  </div>
                </>
              )}

              <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--text-2)' }}>Note:</b> Credentials are encrypted at rest. PhantomCore never stores call recordings on its servers — they remain in your provider account.
              </div>
            </div>

            <div className="row gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn ghost" onClick={() => setConfigModal(null)}>Cancel</button>
              <button
                className="btn primary"
                onClick={() => setConfigModal(null)}
              >
                {configModal.status === 'connected' ? <><I.check size={13} /> Save Changes</> : <><I.plus size={13} /> Connect Provider</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
