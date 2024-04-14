'use client'

import { load, trackPageview } from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { track } from 'src/lib/tracking/track'

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

    const search = searchParams.toString().length ? `?${searchParams}` : ''

    trackPageview({
      url: `${pathname}${search}`,
      referrer: document.referrer
    })
  }, [pathname, searchParams])

  return null
}

function Track() {
  const pathname = usePathname()
  const search = Object.fromEntries(useSearchParams().entries())

  useEffect(() => {
    if (!pathname) return
    track('Viewed a page', {
      Path: pathname,
      Search: Object.keys(search).length > 0 ? search : undefined
    })
  }, [pathname, search])

  return null
}

export function Fathom() {
  return (
    <Suspense fallback={null}>
      {siteId && <TrackPageView />}
      <Track />
    </Suspense>
  )
}
