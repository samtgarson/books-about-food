import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type ContainerProps = ComponentProps<'div'> & {
  left?: boolean
  right?: boolean
}

export const Container: FC<ContainerProps> = ({
  children,
  className,
  left = true,
  right = true,
  ...props
}) => (
  <div className={cn(right && 'pr-16', left && 'pl-16', className)} {...props}>
    {children}
  </div>
)
