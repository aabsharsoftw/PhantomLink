'use client'

import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

const reviews = [
  { src: 'google', rating: 5, name: 'Anita Sharma',   loc: 'Mumbai',    date: '2h ago',  text: 'Riya from the Acme team helped us migrate from HubSpot in under a week. Honestly the smoothest CRM rollout we\'ve done. WhatsApp templates were live by day 3.', tags: ['onboarding','support'], replied: false, sentiment: 'positive' },
  { src: 'google', rating: 4, name: 'Mark Castellan', loc: 'Bengaluru', date: '8h ago',  text: 'Good product, support is responsive. Reporting could use more granularity for multi-location businesses, but everything else is solid.', tags: ['reporting'], replied: true, sentiment: 'positive' },
  { src: 'fb',     rating: 5, name: 'Priya M.',        loc: 'Pune',      date: '1d ago',  text: 'The automation builder is genuinely the best I\'ve used. We replaced Zapier + Mailchimp + Calendly in one sweep.', tags: ['automation','feature'], replied: true, sentiment: 'positive' },
  { src: 'google', rating: 2, name: 'Rishi T.',        loc: 'Delhi',     date: '2d ago',  text: 'Billing issue dragged for 9 days, support kept transferring me. Eventually resolved but the experience was rough.', tags: ['billing','support'], replied: false, sentiment: 'negative' },
  { src: 'g2',     rating: 5, name: 'Lakshmi R.',      loc: 'Chennai',   date: '3d ago',  text: 'Team adoption was 100% in 2 weeks. The unified inbox + WhatsApp Business API integration alone is worth the price.', tags: ['feature'], replied: true, sentiment: 'positive' },
  { src: 'google', rating: 4, name: 'Daniel Wong',     loc: 'Singapore', date: '4d ago',  text: 'Polished, reliable. The new AI Employees feature is impressive but pricing tier should be clearer.', tags: ['ai','pricing'], replied: false, sentiment: 'positive' },
]

const srcMeta: Record<string, { ico: string; label: string; color: string }> = {
  google: { ico: 'gbp',   label: 'Google',   color: '#4285F4' },
  fb:     { ico: 'fb',    label: 'Facebook',  color: '#1877F2' },
  g2:     { ico: 'badge', label: 'G2',        color: '#FF492C' },
}

function Stars({ n }: { n: number }) {
  return (
    <span className="row" style={{ gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <I.star key={i} size={11} fill={i <= n ? '#F59E0B' : 'transparent'} style={{ color: '#F59E0B' }} />
      ))}
    </span>
  )
}

export default function ReputationPage() {
  return (
    <>
      <Topbar
        title="Reputation"
        subtitle="284 reviews · 4 awaiting reply"
        actions={<>
          <button className="btn"><I.send size={13} /> Request reviews</button>
          <button className="btn"><I.refresh size={13} /> Sync now</button>
          <button className="btn primary"><I.spark size={14} /> Auto-reply with AI</button>
        </>}
      />
      <div className="page">
        <div className="row gap-3" style={{ marginBottom: 14 }}>
          {/* Average rating */}
          <div className="card flex-1" style={{ padding: '18px 20px' }}>
            <div className="muted-2" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Average rating</div>
            <div className="row gap-3" style={{ marginTop: 6, alignItems: 'baseline' }}>
              <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em' }}>4.7</span>
              <Stars n={5} />
            </div>
            <div className="muted-2" style={{ fontSize: 11, marginTop: 4 }}>Based on 284 reviews · last 90 days</div>
            <div className="col gap-1" style={{ marginTop: 14 }}>
              {[{ n: 5, c: 208 }, { n: 4, c: 48 }, { n: 3, c: 14 }, { n: 2, c: 8 }, { n: 1, c: 6 }].map(r => (
                <div key={r.n} className="row gap-2" style={{ fontSize: 11 }}>
                  <span style={{ width: 14 }}>{r.n}★</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(r.c / 208) * 100}%`, height: '100%', background: r.n >= 4 ? '#22C55E' : r.n >= 3 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                  <span className="muted-2" style={{ width: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By source */}
          <div className="card flex-1" style={{ padding: '18px 20px' }}>
            <div className="muted-2" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>By source</div>
            <div className="col gap-3" style={{ marginTop: 14 }}>
              {[
                { src: 'google', n: 'Google',   r: 4.8, c: 184, color: '#4285F4' },
                { src: 'fb',     n: 'Facebook', r: 4.6, c: 62,  color: '#1877F2' },
                { src: 'g2',     n: 'G2',       r: 4.7, c: 38,  color: '#FF492C' },
              ].map(s => {
                const Ic = I[srcMeta[s.src].ico]
                return (
                  <div key={s.src} className="row gap-3">
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `color-mix(in srgb, ${s.color} 18%, transparent)`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={14} /></div>
                    <div className="col flex-1" style={{ minWidth: 0, lineHeight: 1.3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{s.n}</span>
                      <span className="muted-2" style={{ fontSize: 11 }}>{s.c} reviews</span>
                    </div>
                    <div className="col" style={{ textAlign: 'right', lineHeight: 1.3 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{s.r}</span>
                      <Stars n={Math.round(s.r)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sentiment */}
          <div className="card flex-1" style={{ padding: '18px 20px' }}>
            <div className="muted-2" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Sentiment · 30d</div>
            <div style={{ marginTop: 14 }}>
              <div className="row gap-1" style={{ height: 14, borderRadius: 7, overflow: 'hidden' }}>
                <div style={{ flex: 78, background: '#22C55E' }} />
                <div style={{ flex: 14, background: '#F59E0B' }} />
                <div style={{ flex: 8, background: '#EF4444' }} />
              </div>
              <div className="row gap-3" style={{ fontSize: 11, marginTop: 10 }}>
                <span className="row gap-1"><span className="dot" style={{ background: '#22C55E' }} />Positive 78%</span>
                <span className="row gap-1"><span className="dot" style={{ background: '#F59E0B' }} />Neutral 14%</span>
                <span className="row gap-1"><span className="dot" style={{ background: '#EF4444' }} />Negative 8%</span>
              </div>
            </div>
            <div className="ctx-label" style={{ padding: '14px 0 6px' }}>Top topics</div>
            <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
              {[['onboarding',42,'pos'],['support',28,'mix'],['automation',24,'pos'],['pricing',18,'neg'],['reporting',12,'mix']].map(([t,c,s]) => (
                <span key={t as string} className={`pill ${s === 'pos' ? 'green' : s === 'neg' ? 'red' : ''}`}>{t} · {c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="row gap-2" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <div className="row gap-1 segment">
              <button className="seg-btn active">All <span className="muted-2">284</span></button>
              <button className="seg-btn">Awaiting reply <span className="muted-2">4</span></button>
              <button className="seg-btn">Negative <span className="muted-2">14</span></button>
              <button className="seg-btn">Positive <span className="muted-2">256</span></button>
            </div>
            <div className="flex-1" />
            <button className="btn sm ghost">Sort: Newest <I.chevD size={11} /></button>
          </div>
          <div className="col">
            {reviews.map((r, i) => {
              const meta = srcMeta[r.src]
              const SrcIc = I[meta.ico]
              return (
                <div key={i} className="review-row">
                  <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
                    <div className="avatar lg" style={{ background: `hsl(${i * 47 % 360},45%,42%)` }}>{r.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                    <div className="col flex-1" style={{ minWidth: 0 }}>
                      <div className="row gap-2">
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                        <span className="muted-2" style={{ fontSize: 11 }}>· {r.loc}</span>
                        <Stars n={r.rating} />
                        <span className="muted-2" style={{ fontSize: 11 }}>· {r.date}</span>
                        <div className="flex-1" />
                        <span className="row gap-1" style={{ fontSize: 11, color: meta.color }}>
                          <SrcIc size={12} /> {meta.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.55, color: 'var(--text)' }}>{r.text}</div>
                      <div className="row gap-2" style={{ marginTop: 10 }}>
                        <div className="row gap-1">
                          {r.tags.map(t => <span key={t} className="tag-chip">#{t}</span>)}
                          <span className={`pill ${r.sentiment === 'positive' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>
                            {r.sentiment === 'positive' ? <I.thumbsUp size={9} /> : <I.thumbsDn size={9} />} {r.sentiment}
                          </span>
                        </div>
                        <div className="flex-1" />
                        {r.replied
                          ? <span className="muted-2" style={{ fontSize: 11 }}><I.check size={11} /> Replied · 1d ago</span>
                          : <>
                              <button className="btn sm"><I.spark size={11} /> AI suggest</button>
                              <button className="btn sm primary"><I.reply size={11} /> Reply</button>
                            </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
