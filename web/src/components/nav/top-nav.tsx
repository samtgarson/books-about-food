'use client'

import Link from 'next/link'
import { FC } from 'react'
import cn from 'classnames'
import { useSelectedLayoutSegment } from 'next/navigation'

const navItemClassNames = (active?: boolean) =>
  cn('all-caps px-4 py-2 rounded-full transition-colors border', {
    'bg-white border-black': active,
    'bg-grey border-transparent': !active
  })

const TopNavItem: FC<{
  children: string
  path: string | null
}> = ({ children, path }) => {
  const segment = useSelectedLayoutSegment()
  const active = segment === path
  const href = `/${path || ''}`
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      href={href}
      className={cn(navItemClassNames(active))}
    >
      {children}
    </Link>
  )
}

const TopNavItemExternal: FC<{
  children: string
  href: string
}> = ({ children, href }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={navItemClassNames()}
  >
    {children}
  </a>
)

export const TopNav: FC = () => (
  <nav className='flex gap-20 py-2 overflow-x-auto'>
    <TopNavItem path={null}>Home</TopNavItem>
    <TopNavItem path='cookbooks'>Cookbooks</TopNavItem>
    <TopNavItem path='authors'>Authors</TopNavItem>
    <TopNavItem path='people'>People</TopNavItem>
    <TopNavItem path='publishers'>Publishers</TopNavItem>
    <TopNavItemExternal href='https://www.instagram.com/books.about.food'>
      Instagram
    </TopNavItemExternal>
  </nav>
)
