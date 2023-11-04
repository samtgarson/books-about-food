import cn from 'classnames'
import { FC, ReactNode } from 'react'

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

export const PageSubtitle: FC<PageTitleType> = ({ children, className }) => (
  <h2
    className={cn(
      'text-18 sm:text-20 font-medium flex justify-start items-center gap-8 mb-4',
      className
    )}
  >
    {children}
  </h2>
)
