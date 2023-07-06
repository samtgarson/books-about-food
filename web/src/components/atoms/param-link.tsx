'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Children, FC, Suspense, cloneElement } from 'react'
import { mergeParams } from 'src/utils/url-helpers'
import { Loader } from './loader'

type ParamLinkParams = Record<string, unknown | undefined | null> & {
  children: JSX.Element
}

const ParamLinkContent: FC<ParamLinkParams> = ({ children, ...props }) => {
  const searchParams = useSearchParams() || new URLSearchParams()
  const pathName = usePathname() || ''
  const params = new URLSearchParams(Object.fromEntries(searchParams.entries()))

  return cloneElement(Children.only(children), {
    href: mergeParams(props, pathName, params)
  })
}

export const ParamLink: FC<ParamLinkParams> = (props) => (
  <Suspense fallback={<Loader />}>
    <ParamLinkContent {...props} />
  </Suspense>
)
