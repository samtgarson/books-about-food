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
  <div
    className={cn(right && 'pr-5 md:pr-16', left && 'pl-5 md:pl-16', className)}
    {...props}
  >
    {children}
  </div>
)

export const AntiContainer: FC<ContainerProps & { mobile?: boolean }> = ({
  children,
  className,
  left = true,
  right = true,
  mobile = true,
  ...props
}) => (
  <div
    className={cn(
      right && mobile && 'sm:-mr-16',
      left && mobile && 'sm:-ml-16',
      right && !mobile && '-mr-5 sm:mr-0',
      left && !mobile && '-ml-5 sm:ml-0',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
