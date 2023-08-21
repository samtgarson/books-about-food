'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { FC } from 'react'
import cn from 'classnames'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'

export type AccountNavItemProps = {
  label: string
  href: string
}
export const AccountNavItem: FC<AccountNavItemProps> = ({ label, href }) => {
  const segment = useSelectedLayoutSegment()
  const active = href === segment || (href === '' && segment === null)

  return (
    <Link
      scroll={false}
      href={`/account/${href}`}
      className={cn(
        'flex justify-between items-center p-3 transition-colors',
        active ? 'bg-white' : 'hover:bg-sand'
      )}
    >
      {label}
      {active && <ChevronRight strokeWidth={1} size={24} />}
    </Link>
  )
}
