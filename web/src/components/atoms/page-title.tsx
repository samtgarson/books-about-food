import { FC } from 'react'
import cn from 'classnames'

export type PageTitleType = {
  children: string
  showBrand?: boolean
  className?: string
}

export const BrandTitle = () => (
  <span className="opacity-25 hidden md:inline"> Books About Food</span>
)

export const PageTitle: FC<PageTitleType> = ({
  children,
  showBrand = true,
  className
}) => (
  <h1
    className={cn('text-24 sm:text-48 py-10 md:py-20 sm:text-right', className)}
  >
    {children}
    {showBrand && <BrandTitle />}
  </h1>
)
