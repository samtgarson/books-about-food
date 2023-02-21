import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type ContainerProps = ComponentProps<'div'> & {
  left?: boolean
  right?: boolean
  mobile?: boolean
  desktop?: boolean
  belowNav?: boolean
}

export const Container: FC<ContainerProps> = ({
  children,
  className,
  left = true,
  right = true,
  mobile = true,
  desktop = true,
  belowNav = false,
  ...props
}) => (
  <div
    className={cn(
      {
        'pr-5 md:pr-16': right && mobile && desktop,
        'pl-5 md:pl-16': left && mobile && desktop,
        'pr-5 sm:pr-0': right && mobile && !desktop,
        'pl-5 sm:pl-0': left && mobile && !desktop,
        'md:pr-16': right && !mobile && desktop,
        'md:pl-16': left && !mobile && desktop,
        'mt-12': belowNav
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const AntiContainer: FC<ContainerProps> = ({
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
      {
        '-mr-5 md:-mr-16': right && mobile && desktop,
        '-ml-5 md:-ml-16': left && mobile && desktop,
        '-mr-5 sm:mr-0': right && mobile && !desktop,
        '-ml-5 sm:ml-0': left && mobile && !desktop,
        'md:-mr-16': right && !mobile && desktop,
        'md:-ml-16': left && !mobile && desktop
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
)
