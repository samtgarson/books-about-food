'use client'

import * as Collapsible from '@radix-ui/react-collapsible'
import cn from 'classnames'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { CSSProperties, FC } from 'react'

const navItemClassNames = (active?: boolean) =>
  cn(
    'all-caps px-4 py-2 my-2 rounded-full transition-colors border [[data-state="closed"]_&]:animate-fade-out [[data-state="open"]_&]:animate-fade-in',
    {
      'bg-white border-black': active,
      'bg-transparent border-transparent': !active
    }
  )

const TopNavItem: FC<{
  children: string
  path: string | null
  className?: string
  delay?: number
}> = ({ children, path, className, delay = 0 }) => {
  const segment = useSelectedLayoutSegment()
  const active = segment === path
  const href = `/${path || ''}`
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      href={href}
      className={cn(className, navItemClassNames(active))}
      style={
        {
          '--nav-item-delay': `${delay + 1000}ms`,
          '--nav-item-closed-delay': `${300 - delay}ms`
        } as CSSProperties
      }
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
    target="_blank"
    rel="noopener noreferrer"
    className={navItemClassNames()}
  >
    {children}
  </a>
)

const NavContent = () => (
  <>
    <TopNavItem path={null} className="hidden md:block">
      Home
    </TopNavItem>
    <TopNavItem path="cookbooks">Cookbooks</TopNavItem>
    <TopNavItem delay={100} path="authors">
      Authors
    </TopNavItem>
    <TopNavItem delay={200} path="people">
      People
    </TopNavItem>
    <TopNavItem delay={300} path="publishers">
      Publishers
    </TopNavItem>
    <TopNavItemExternal href="https://www.instagram.com/books.about.food">
      Instagram
    </TopNavItemExternal>
  </>
)

const DesktopTopNav: FC = () => {
  return (
    <nav className="gap-20 hidden md:flex w-screen overflow-x-auto">
      <NavContent />
    </nav>
  )
}

const MobileTopNav: FC = () => {
  return (
    <Collapsible.Root>
      <nav className="h-16 relative bg-white md:bg-transparent md:hidden flex items-center">
        <p className="px-4 text-16 flex-grow">Books About Food</p>
        <Collapsible.Trigger className="px-4">Menu</Collapsible.Trigger>
        <Collapsible.Content className="z-10 absolute top-full inset-x-0 flex flex-col bg-white items-start overflow-y-hidden data-[state=open]:animate-collapsible-open data-[state=closed]:animate-collapsible-closed">
          <NavContent />
        </Collapsible.Content>
      </nav>
    </Collapsible.Root>
  )
}

export const TopNav = () => (
  <>
    <DesktopTopNav />
    <MobileTopNav />
  </>
)
