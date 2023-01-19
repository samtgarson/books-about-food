import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type GridContainerProps = ComponentProps<'ul'>

export const GridContainer: FC<GridContainerProps> = ({
  children,
  className,
  ...props
}) => (
  <div className="-mx-5 sm:mx-0 overflow-hidden sm:overflow-visible">
    <ul
      className={cn(
        'flex flex-col items-stretch sm:grid sm:auto-grid-lg -mx-px sm:mx-0',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  </div>
)
