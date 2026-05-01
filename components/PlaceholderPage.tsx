'use client'

import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

export function PlaceholderPage({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) {
  const Ic = I[icon] || I.spark
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="col gap-4" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic size={32} className="muted-2" />
          </div>
          <div className="col gap-2" style={{ alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>{title}</h2>
            <p className="muted" style={{ fontSize: 13 }}>{subtitle}</p>
          </div>
          <button className="btn primary"><I.spark size={13} /> Coming in Phase 2</button>
        </div>
      </div>
    </>
  )
}
