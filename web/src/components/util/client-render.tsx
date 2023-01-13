'use client'

import { ComponentType, ReactNode } from 'react'
import superjson from 'superjson'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ClientRender = <Props,>({
  component: Component,
  children,
  serialisedProps
}: {
  component: ComponentType<Props>
  children?: ReactNode
  serialisedProps: string
}) => {
  const props = superjson.parse<Props>(serialisedProps)
  return <Component {...props}>{children}</Component>
}
