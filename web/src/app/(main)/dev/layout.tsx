import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== 'development') notFound()

  return <>{children}</>
}
