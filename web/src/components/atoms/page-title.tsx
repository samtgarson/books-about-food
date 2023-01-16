import { FC } from 'react'

export type PageTitleType = {
  children: string
  showBrand?: boolean
}

export const BrandTitle = () => (
  <span className="opacity-25 hidden md:inline"> Books About Food</span>
)

export const PageTitle: FC<PageTitleType> = ({
  children,
  showBrand = true
}) => (
  <h1 className="text-48 py-20 text-right">
    {children}
    {showBrand && <BrandTitle />}
  </h1>
)
