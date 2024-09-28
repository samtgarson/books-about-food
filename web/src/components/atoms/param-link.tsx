'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Children, Suspense, cloneElement } from 'react'
import { mergeParams } from 'src/utils/url-helpers'

export type ParamLinkParams = Record<string, unknown | undefined | null> & {
  children: JSX.Element
  _reset?: boolean
}

function ParamLinkContent({
  children,
  _reset: reset,
  ...props
}: ParamLinkParams) {
  const currentParams = useSearchParams()
  const searchParams = reset
    ? new URLSearchParams()
    : currentParams || new URLSearchParams()
  const pathName = usePathname() || ''
  const params = new URLSearchParams(Object.fromEntries(searchParams.entries()))

  const child = Children.only(children)
  return cloneElement(child, {
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
