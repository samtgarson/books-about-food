/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { cloneElement } from 'react'
import { Stringified, parse } from 'src/utils/superjson'

export function BoundaryClient<P extends Record<string, any>>({
  props,
  children
}: {
  props: Stringified<P>
  children: JSX.Element
}) {
  return cloneElement(children, parse(props))
}
