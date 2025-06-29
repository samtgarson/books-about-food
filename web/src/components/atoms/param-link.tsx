'use client'

import { Children, Suspense, cloneElement, type JSX } from 'react'
import { useMergeParams } from 'src/utils/url-helpers'

export type ParamLinkParams = Record<string, unknown> & {
  children: JSX.Element
  _reset?: boolean
}

function ParamLinkContent({
  children,
  _reset: reset,
  ...props
}: ParamLinkParams) {
  const mergeParams = useMergeParams(reset)
  const child = Children.only(children)
  return cloneElement(child, {
    href: mergeParams(props)
  })
}

export function ParamLink({ children, ...props }: ParamLinkParams) {
  return (
    <Suspense fallback={children}>
      <ParamLinkContent {...props}>{children}</ParamLinkContent>
    </Suspense>
  )
}
