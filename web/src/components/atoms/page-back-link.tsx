import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { ChevronLeft } from 'react-feather'

export type PageBackLinkType = {
  children: string
  className?: string
  href: string
}

export const PageBackLink: FC<PageBackLinkType> = ({
  children,
  className,
  href
}) => {
  return (
    <Link
      href={href}
      className={cn('flex gap-2 mt-20 mb-8 items-center', className)}
    >
      <ChevronLeft strokeWidth={1} size={24} />
      {children}
    </Link>
  )
}
