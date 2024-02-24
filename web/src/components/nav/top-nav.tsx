'use client'

import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { FC, useState } from 'react'
import { Menu, Plus, User, X } from 'src/components/atoms/icons'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useScrollLock } from 'src/hooks/use-scroll-lock'
import { Container } from '../atoms/container'
import { Loader } from '../atoms/loader'
import { AuthedButton } from '../auth/authed-button'
import { NewBookButton } from '../books/new-book-button'
import { useNav } from './context'
import { QuickSearch } from './search'

const AccountLink = ({ className }: { className?: string }) => {
  const currentUser = useCurrentUser()
  const { theme } = useNav()
  const pathname = usePathname()

  if (currentUser)
    return (
      <Link href="/account" className={className} aria-label="Account">
        <User strokeWidth={1} />
      </Link>
    )

  return (
    <AuthedButton redirect={pathname}>
      <button className={className} aria-label="Account">
        <User strokeWidth={1} color={theme === 'dark' ? 'white' : 'black'} />
      </button>
    </AuthedButton>
  )
}

const navItemClassNames = () =>
  cn('text-32 sm:text-40 animate-fade-slide-in flex gap-2 items-center')

const navItemAttrs = (index: number, className?: string) => ({
  className: cn(navItemClassNames(), className),
  style: { animationDelay: `${index * 50}ms` }
})

const TopNavItem: FC<{
  children: string
  path: string | null
  className?: string
  index?: number
}> = ({ children, path, className, index = 0 }) => {
  const segment = useSelectedLayoutSegment()
  const active = segment === path
  const href = `/${path || ''}`
  const [loading, setLoading] = useState(false)
  const { setOpen } = useNav()

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      href={href}
      {...navItemAttrs(index, cn(className, loading && '!opacity-50'))}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        active ? setOpen(false) : setLoading(true)
      }}
    >
      {children}
      {loading && <Loader className="animate-fade-slide-in" />}
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
    {...navItemAttrs(index)}
  >
    {children}
  </a>
)

const NavContent = () => {
  useScrollLock()
  const user = useCurrentUser()

  return (
    <div className="animate-fade-in fixed inset-0 z-[60] flex max-h-screen flex-col items-center justify-center gap-3 overflow-auto bg-white pt-20">
      <Container className="absolute inset-x-0 top-0 border-b border-black py-5">
        <Dialog.Close className="all-caps flex items-center gap-8">
          <X strokeWidth={1} />
          Close
        </Dialog.Close>
      </Container>
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
      <TopNavItemExternal
        href="https://www.instagram.com/books.about.food"
        index={5}
      >
        Instagram
      </TopNavItemExternal>
      <TopNavItem index={4} path="account/submissions">
        Submit
      </TopNavItem>
      {user ? (
        <TopNavItem index={5} path="account">
          Account
        </TopNavItem>
      ) : (
        <AuthedButton redirect="/account">
          <button {...navItemAttrs(6)}>Login</button>
        </AuthedButton>
      )}
      <TopNavItem index={4} path="about">
        About
      </TopNavItem>
    </div>
  )
}

export const TopNav: FC = () => {
  const { theme, open, setOpen } = useNav()

  return (
    <nav className="absolute inset-x-0 top-0 z-nav">
      <Container
        className={cn(
          'flex w-screen gap-4 items-stretch border-b border-black py-5 pr-4',
          theme === 'dark' && 'text-white border-none'
        )}
      >
        <Dialog.Root modal open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-8">
            <Dialog.Trigger>
              <Menu
                strokeWidth={1}
                color={theme === 'dark' ? 'white' : 'black'}
              />
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
        <NewBookButton
          className={cn('ml-auto', theme === 'dark' && 'text-white')}
        >
          <Plus strokeWidth={1} />
        </NewBookButton>
        <QuickSearch />
        <AccountLink />
      </Container>
    </nav>
  )
}
