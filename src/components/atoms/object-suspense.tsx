import { FC, Suspense, SuspenseProps } from 'react'
import stringify from 'stable-hash'

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
    <Suspense key={key} {...props}>
      {children}
    </Suspense>
  )
}
