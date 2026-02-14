'use client'

import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { ChevronLeft } from 'src/components/atoms/icons'

export type PageBackLinkType = {
  children: string
  className?: string
  href: string
  back?: boolean
}

export const PageBackLink: FC<PageBackLinkType> = ({
  children,
  className,
  href,
  back
}) => {
  const router = useRouter()
  return (
    <Link
      href={href}
      className={cn('my-8 flex items-center gap-2 self-start', className)}
      onClick={
        back
          ? (e) => {
              e.preventDefault()
              router.back()
            }
          : undefined
      }
    >
      <ChevronLeft strokeWidth={1} size={24} />
      {children}
    </Link>
  )
}
