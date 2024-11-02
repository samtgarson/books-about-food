'use client'

import cn from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { ChevronRight } from 'src/components/atoms/icons'

export type SidebarItemProps = {
  label: string
  href: string
  exact?: boolean
}
export const SidebarItem: FC<SidebarItemProps> = ({ label, href, exact }) => {
  const path = usePathname()
  const active = exact ? path === href : path.startsWith(href)

  return (
    <Link
      scroll={false}
      href={href}
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
