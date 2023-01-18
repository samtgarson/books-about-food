import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type GridContainerProps = ComponentProps<'ul'>

export const GridContainer: FC<GridContainerProps> = ({
  children,
  className,
  ...props
}) => (
  <div className="-mx-5 sm:mx-0">
    <ul className={cn('sm:grid sm:auto-grid-lg -mx-1', className)} {...props}>
      {children}
    </ul>
  </div>
)
