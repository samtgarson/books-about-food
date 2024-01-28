import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { getUser } from 'src/utils/user'

export default async function DevLayout({ children }: { children: ReactNode }) {
  const user = await getUser()

  const allow = process.env.NODE_ENV === 'development' || user?.role === 'admin'
  if (!allow) notFound()

  return <>{children}</>
}
