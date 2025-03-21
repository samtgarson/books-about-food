import { ComponentType, ReactNode } from 'react'
import WrapClient from './client'
import { serialize } from './utils'

export function Wrap<P extends object>({
  c,
  children,
  ...props
}: {
  c: ComponentType<P>
  children?: ReactNode
} & P) {
  return <WrapClient
    props={serialize(props as P)}
    component={c}
  >{children}</WrapClient>
}
