'use client'

import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { FC } from 'react'
import { Menu, User, X } from 'react-feather'
import { useScrollLock } from 'src/hooks/use-scroll-lock'
import { Container } from '../atoms/container'
import { AuthedButton } from '../auth/authed-button'

const AccountLink = ({ className }: { className?: string }) => {
  return (
    <AuthedButton>
      <Link href="/account" className={className}>
        <User strokeWidth={1} />
      </Link>
    </AuthedButton>
  )
}

const navItemClassNames = () => cn('text-32 animate-fade-slide-in')

const TopNavItem: FC<{
  children: string
  path: string | null
  className?: string
  index?: number
}> = ({ children, path, className, index = 0 }) => {
  const segment = useSelectedLayoutSegment()
  const active = segment === path
  const href = `/${path || ''}`

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      href={href}
      className={cn(className, navItemClassNames())}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {children}
    </Link>
  )
}

const TopNavItemExternal: FC<{
  children: string
  href: string
  index: number
}> = ({ children, href, index }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={navItemClassNames()}
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {children}
  </a>
)

const NavContent = () => {
  useScrollLock()
  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-4 animate-fade-in">
      <Dialog.Close>
        <Container className="absolute top-0 inset-x-0 gap-8 flex py-5 border-b border-black all-caps items-center">
          <X strokeWidth={1} />
          Close
        </Container>
      </Dialog.Close>
      <TopNavItem path={null}>Home</TopNavItem>
      <TopNavItem path="cookbooks">Cookbooks</TopNavItem>
      <TopNavItem index={1} path="authors">
        Authors
      </TopNavItem>
      <TopNavItem index={2} path="people">
        People
      </TopNavItem>
      <TopNavItem index={3} path="publishers">
        Publishers
      </TopNavItem>
      <TopNavItem index={4} path="submit">
        Submit
      </TopNavItem>
      <TopNavItemExternal
        href="https://www.instagram.com/books.about.food"
        index={5}
      >
        Instagram
      </TopNavItemExternal>
    </div>
  )
}

export const TopNav: FC = () => {
  return (
    <nav className="z-30 absolute top-0 inset-x-0">
      <Container className="w-screen flex pr-4 items-stretch py-5 border-b border-black">
        <Dialog.Root modal>
          <div className="flex gap-8 items-center">
            <Dialog.Trigger>
              <Menu strokeWidth={1} />
            </Dialog.Trigger>
            <Link href="/" className="all-caps">
              Books About Food
            </Link>
          </div>
          <Dialog.Portal>
            <Dialog.Content>
              <NavContent />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <AccountLink className="ml-auto" />
      </Container>
    </nav>
  )
}
