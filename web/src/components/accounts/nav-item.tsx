'use client'

import cn from 'classnames'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { FC } from 'react'
import { ChevronRight } from 'src/components/atoms/icons'

export type AccountNavItemProps = {
  label: string
  href: string
}
export const AccountNavItem: FC<AccountNavItemProps> = ({ label, href }) => {
  const segment = useSelectedLayoutSegments().join('/')
  const active = href === segment || (href === '' && segment === null)

  return (
    <Link
      scroll={false}
      href={`/account/${href}`}
      className={cn(
        'flex items-center justify-between px-4 py-2.5 transition-colors',
        active ? 'bg-white' : 'hover:bg-sand'
      )}
    >
      {label}
      {active && <ChevronRight strokeWidth={1} size={24} />}
    </Link>
  )
}
