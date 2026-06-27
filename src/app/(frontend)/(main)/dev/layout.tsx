import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { getSessionUser } from 'src/utils/user'

// Dev tool pages are admin/development-only and interactive — never prerender
// them at build (their client forms aren't static-generation compatible).
export const dynamic = 'force-dynamic'

export default async function DevLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()

  const allow = process.env.NODE_ENV === 'development' || user?.role === 'admin'
  console.log({ allow })
  if (!allow) notFound()

  return <>{children}</>
}
