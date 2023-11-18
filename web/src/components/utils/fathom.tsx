'use client'

import { load, trackPageview } from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const sideId = process.env.NEXT_PUBLIC_FATHOM_ID

function TrackPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!sideId) return
    load(sideId, {
      auto: false
    })
  }, [])

  useEffect(() => {
    if (!sideId || !pathname) return

    trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer
    })
  }, [pathname, searchParams])

  return null
}

export function Fathom() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  )
}
