import { ComponentType } from 'react'

export function Wrap<P>({
  c: Component,
  ...props
}: {
  c: ComponentType<P>
} & P) {
  return <Component {...(props as P)} data-superjson />
}
