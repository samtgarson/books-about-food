import { ComponentType } from 'react'

export function Wrap<P>({
  c: Component,
  props
}: {
  c: ComponentType<P>
  props: P
}) {
  return <Component {...props} data-superjson />
}
