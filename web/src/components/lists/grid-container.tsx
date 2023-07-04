import { ComponentProps, forwardRef } from 'react'
import cn from 'classnames'
import { AntiContainer } from '../atoms/container'

export type GridContainerProps = ComponentProps<'ul'>

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  ({ children, className, ...props }, ref) => (
    <AntiContainer
      desktop={false}
      className="overflow-hidden sm:overflow-visible"
      ref={ref}
    >
      <ul
        className={cn(
          'flex flex-col items-stretch sm:grid sm:auto-grid-lg -mx-px sm:mx-0 transition-opacity',
          className
        )}
        {...props}
      >
        {children}
      </ul>
    </AntiContainer>
  )
)

GridContainer.displayName = 'GridContainer'
