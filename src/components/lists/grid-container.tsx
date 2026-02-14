'use client'

import cn from 'classnames'
import { forwardRef } from 'react'
import { AntiContainer, ContainerProps } from '../atoms/container'
import { useListDisplay } from './list-container'

export type GridContainerProps = ContainerProps & {
  size?: 'default' | 'large'
}

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  function GridContainer(
    { children, className, size = 'default', ...props },
    ref
  ) {
    const { display } = useListDisplay()
    return (
      <AntiContainer
        desktop={false}
        className="overflow-hidden sm:overflow-visible"
        {...props}
        ref={ref}
      >
        <ul
          className={cn(
            'grid-container -mx-px flex-col items-stretch transition-opacity sm:mx-0',
            display === 'grid' ? 'grid' : 'flex sm:grid',
            size === 'default'
              ? 'auto-grid-md sm:auto-grid-lg'
              : 'auto-grid-lg md:auto-grid-xl',
            className
          )}
        >
          {children}
        </ul>
      </AntiContainer>
    )
  }
)
