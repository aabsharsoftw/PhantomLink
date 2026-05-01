import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import { CRMShell } from '@/components/CRMShell'

export const metadata: Metadata = {
  title: 'PhantomCore CRM',
  description: 'A modern marketing + CRM platform — GHL-style',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CRMShell>{children}</CRMShell>
      </body>
    </html>
  )
}
