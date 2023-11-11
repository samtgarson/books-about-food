'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from 'src/components/atoms/loader'
import { usePromise } from 'src/hooks/use-promise'
import { checkSession } from './action'

export function WelcomeMessage() {
  const { value: role, loading } = usePromise(checkSession, null, [])
  const { refresh } = useRouter()

  useEffect(() => {
    if (role && role !== 'waitlist') refresh()
  }, [role, refresh])

  if (loading) return <Loader size={40} />
  return (
    <p className="lg:text-24">
      Thanks for registering! We&apos;ll be in touch soon.
    </p>
  )
}
