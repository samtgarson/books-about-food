import { FC, ReactNode } from 'react'
import cn from 'classnames'

export type PageTitleType = {
  children: ReactNode
  className?: string
}

export const PageTitle: FC<PageTitleType> = ({ children, className }) => (
  <h1
    className={cn(
      'text-24 sm:text-48 flex items-center gap-8 py-10 md:py-20',
      className
    )}
  >
    {children}
  </h1>
)
