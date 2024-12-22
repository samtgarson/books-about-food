'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  ComponentProps,
  ReactNode,
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect
} from 'react'
import { useRoute } from 'src/hooks/use-route'
import { TrackableEvents } from 'src/lib/tracking/events'
import { track as action } from 'src/lib/tracking/track'
import { stringify } from 'src/utils/superjson'

type TrackingContext = {
  track: <T extends keyof TrackableEvents>(
    name: T,
    properties: TrackableEvents[T]
  ) => Promise<void>
  currentPath: string
  currentRoute: string
}

const TrackingContext = createContext({} as TrackingContext)

function TrackingProviderContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const route = useRoute()

  useEffect(() => {
    if (!pathname) return
    const search = Object.fromEntries(searchParams.entries())
    action('Viewed a page', {
      Path: pathname,
      Search: Object.keys(search).length > 0 ? search : undefined,
      Route: route
    })
  }, [pathname, searchParams, route])

  const track = useCallback(
    async function <T extends keyof TrackableEvents>(
      name: T,
      properties: TrackableEvents[T]
    ) {
      const path = searchParams.toString().length
        ? `${pathname}?${searchParams}`
        : pathname

      await action(
        name,
        stringify({
          ...properties,
          'Tracked from (path)': path,
          'Tracked from (route)': route,
          $referrer: document.referrer
        })
      )
    },
    [pathname, searchParams, route]
  )

  return (
    <TrackingContext.Provider
      value={{ track, currentPath: pathname, currentRoute: route }}
    >
      {children}
    </TrackingContext.Provider>
  )
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TrackingProviderContent>{children}</TrackingProviderContent>
    </Suspense>
  )
}

export function useTracking() {
  return useContext(TrackingContext)
}

export function TrackedLink(
  props: ComponentProps<typeof Link> & { title: string }
) {
  const { track } = useTracking()

  return (
    <Link
      {...props}
      onClick={() => {
        track('Clicked a link', {
          URL: props.href.toString(),
          Label: props.title
        })
      }}
    />
  )
}
