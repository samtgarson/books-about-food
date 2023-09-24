import { ComponentProps, FC, forwardRef } from 'react'
import cn from 'classnames'

export type ContainerProps = ComponentProps<'div'> & {
  scroll?: boolean
  left?: boolean
  right?: boolean
  mobile?: boolean
  desktop?: boolean
  belowNav?: boolean
  centered?: boolean
}

export const containerClasses = ({
  left = true,
  right = true,
  mobile = true,
  desktop = true,
  scroll = false,
  belowNav = false,
  centered = false
}: ContainerProps = {}) =>
  cn(
    scroll
      ? {
          'scroll-pr-5 md:scroll-pr-16': right && mobile && desktop,
          'scroll-pl-5 md:scroll-pl-16': left && mobile && desktop,
          'scroll-pr-5 sm:scroll-pr-0': right && mobile && !desktop,
          'scroll-pl-5 sm:scroll-pl-0': left && mobile && !desktop,
          'md:scroll-pr-16': right && !mobile && desktop,
          'md:scroll-pl-16': left && !mobile && desktop
        }
      : {
          'pr-5 md:pr-16': right && mobile && desktop,
          'pl-5 md:pl-16': left && mobile && desktop,
          'pr-5 sm:pr-0': right && mobile && !desktop,
          'pl-5 sm:pl-0': left && mobile && !desktop,
          'md:pr-16': right && !mobile && desktop,
          'md:pl-16': left && !mobile && desktop
        },
    {
      'mt-16': belowNav,
      'flex flex-col items-center justify-start': centered
    }
  )

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      children,
      className,
      left,
      right,
      mobile,
      desktop,
      belowNav,
      centered,
      ...props
    },
    ref
  ) {
    return (
      <div
        key={props.id}
        ref={ref}
        className={cn(
          containerClasses({
            left,
            right,
            mobile,
            desktop,
            belowNav,
            centered
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
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
