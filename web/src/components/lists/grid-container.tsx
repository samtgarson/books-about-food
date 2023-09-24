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
          'sm:auto-grid-lg -mx-px flex flex-col items-stretch transition-opacity sm:mx-0 sm:grid',
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
