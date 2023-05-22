'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Children, FC, cloneElement } from 'react'
import { mergeParams } from 'src/utils/url-helpers'

export const ParamLink: FC<
  Record<string, unknown | undefined | null> & { children: JSX.Element }
> = ({ children, ...props }) => {
  const searchParams = useSearchParams() || new URLSearchParams()
  const pathName = usePathname() || ''
  const params = new URLSearchParams(Object.fromEntries(searchParams.entries()))

  return cloneElement(Children.only(children), {
    href: mergeParams(props, pathName, params)
  })
}
