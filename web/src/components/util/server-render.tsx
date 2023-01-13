import { ComponentProps, ComponentType, ReactNode } from 'react'
import superjson from 'superjson'
import { ClientRender } from './client-render'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerRender = <T extends ComponentType<any>>({
  component: Component,
  children,
  ...props
}: ComponentProps<T> & { component: T; children?: ReactNode }) => {
  const serializedProps = superjson.stringify(props)

  return (
    <ClientRender component={Component} serialisedProps={serializedProps}>
      {children}
    </ClientRender>
  )
}
