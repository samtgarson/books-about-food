import { FC, Suspense, SuspenseProps } from 'react'
import stringify from 'stable-hash'
import { ClientDebug } from '../utils/client-debug'

export type ObjectSuspenseProps = {
  obj: unknown
} & Omit<SuspenseProps, 'key'>

export const ObjectSuspense: FC<ObjectSuspenseProps> = ({
  obj,
  children,
  ...props
}) => {
  const key = stringify(obj)

  return (
    <>
      <ClientDebug source="object-suspense" string={key} />{' '}
      <Suspense key={key} {...props}>
        {children}
      </Suspense>
    </>
  )
}
