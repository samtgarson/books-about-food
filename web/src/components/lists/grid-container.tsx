'use client'

import cn from 'classnames'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { AntiContainer } from '../atoms/container'
import { useListDisplay } from './list-context'

export type GridContainerProps = ComponentPropsWithoutRef<'ul'>

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  function GridContainer({ children, className, ...props }, ref) {
    const { display } = useListDisplay()
    return (
      <AntiContainer
        desktop={false}
        className="overflow-hidden sm:overflow-visible"
        ref={ref}
      >
        <ul
          className={cn(
            'auto-grid-md sm:auto-grid-lg -mx-px flex-col items-stretch transition-opacity sm:mx-0',
            display === 'grid' ? 'grid' : 'flex sm:grid',
            className
          )}
          {...props}
        >
          {children}
        </ul>
      </AntiContainer>
    )
  }
)
