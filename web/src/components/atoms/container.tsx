import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type ContainerProps = ComponentProps<'main'>

export const Container: FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => (
  <main className={cn('px-16', className)} {...props}>
    {children}
  </main>
)
