/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringify } from 'src/utils/superjson'
import { BoundaryClient } from './client'

export function Boundary<P extends Record<string, any>>({
  children,
  ...props
}: P & { children: JSX.Element }) {
  const serialized = stringify(props)

  console.log('serialized', serialized)
  return <BoundaryClient props={serialized}>{children}</BoundaryClient>
}
