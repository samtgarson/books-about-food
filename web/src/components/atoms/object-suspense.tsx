import stringify from 'fast-json-stable-stringify'
import { FC, Suspense, SuspenseProps } from 'react'

export type ObjectSuspenseProps = {
  obj: unknown
} & Omit<SuspenseProps, 'key'>

export const ObjectSuspense: FC<ObjectSuspenseProps> = ({ obj, ...props }) => {
  const key = stringify(obj)

  return <Suspense key={key} {...props} />
}
