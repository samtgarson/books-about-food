import { FC } from 'react'

export type PageTitleType = {
  children: string
  showBrand?: boolean
}

export const PageTitle: FC<PageTitleType> = ({
  children,
  showBrand = true
}) => (
  <h1 className='text-48 py-20 text-right'>
    {children}
    {showBrand && <span className='opacity-25'> Books About Food</span>}
  </h1>
)
