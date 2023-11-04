import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
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
      className={cn('my-8 flex items-center gap-2 self-start', className)}
    >
      <ChevronLeft strokeWidth={1} size={24} />
      {children}
    </Link>
  )
}
