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

export const AntiContainer: FC<
  ContainerProps & { mobile?: boolean; desktop?: boolean }
> = ({
  children,
  className,
  left = true,
  right = true,
  mobile = true,
  desktop = true,
  ...props
}) => (
  <div
    className={cn(
      right && mobile && desktop && '-mr-5 md:-mr-16',
      left && mobile && desktop && '-ml-5 md:-ml-16',
      right && mobile && !desktop && '-mr-5 sm:mr-0',
      left && mobile && !desktop && '-ml-5 sm:ml-0',
      right && !mobile && desktop && 'md:-mr-16',
      left && !mobile && desktop && 'md:-ml-16',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
