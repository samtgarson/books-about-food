import cn from 'classnames'
import { FC, ReactNode } from 'react'

export type PageTitleType = {
  children: ReactNode
  className?: string
}

export const PageTitle: FC<PageTitleType> = ({ children, className }) => (
  <h1
    className={cn(
      'flex items-center gap-8 py-10 text-24 sm:text-48 md:py-20',
      className
    )}
  >
    {children}
  </h1>
)

export const PageSubtitle: FC<PageTitleType> = ({ children, className }) => (
  <h2
    className={cn(
      'mb-4 flex items-center justify-start gap-8 text-18 font-medium sm:text-20',
      className
    )}
  >
    {children}
  </h2>
)
