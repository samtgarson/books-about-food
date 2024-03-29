'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Children, Suspense, cloneElement } from 'react'
import { mergeParams } from 'src/utils/url-helpers'

type ParamLinkParams = Record<string, unknown | undefined | null> & {
  children: JSX.Element
}

function ParamLinkContent({ children, ...props }: ParamLinkParams) {
  const searchParams = useSearchParams() || new URLSearchParams()
  const pathName = usePathname() || ''
  const params = new URLSearchParams(Object.fromEntries(searchParams.entries()))

  return cloneElement(Children.only(children), {
    href: mergeParams(props, pathName, params)
  })
}

export function ParamLink({ children, ...props }: ParamLinkParams) {
  return (
    <Suspense fallback={children}>
      <ParamLinkContent {...props}>{children}</ParamLinkContent>
    </Suspense>
  )
}
