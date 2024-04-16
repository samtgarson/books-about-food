'use client'

import { load, trackPageview } from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const siteIdVar =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_FATHOM_ID
    : null

function TrackPageView({ siteId }: { siteId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    load(siteId, {
      auto: false
    })
  }, [siteId])

  useEffect(() => {
    const search = searchParams.toString().length ? `?${searchParams}` : ''

    trackPageview({
      url: `${pathname}${search}`,
      referrer: document.referrer
    })
  }, [pathname, searchParams])

  return null
}

export function Fathom() {
  return (
    <Suspense fallback={null}>
      {siteIdVar && <TrackPageView siteId={siteIdVar} />}
    </Suspense>
  )
}
