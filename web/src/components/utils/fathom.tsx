'use client'

import { load, trackPageview } from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const siteId =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_FATHOM_ID
    : null

function TrackPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!siteId) return
    load(siteId, {
      auto: false
    })
  }, [])

  useEffect(() => {
    if (!siteId || !pathname) return

    trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer
    })
  }, [pathname, searchParams])

  return null
}

export function Fathom() {
  return <Suspense fallback={null}>{siteId && <TrackPageView />}</Suspense>
}
