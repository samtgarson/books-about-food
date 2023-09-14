'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { FC } from 'react'
import cn from 'classnames'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

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

export const SignOutButton: FC = () => {
  return (
    <button
      className="p-3 text-left hover:bg-sand transition-colors w-full"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Sign Out
    </button>
  )
}
