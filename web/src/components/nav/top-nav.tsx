'use client'

import cn from 'classnames'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { FC, useState } from 'react'
import { Menu, Plus, Settings, User, X } from 'src/components/atoms/icons'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useScrollLock } from 'src/hooks/use-scroll-lock'
import { Container } from '../atoms/container'
import { Loader } from '../atoms/loader'
import { AuthedButton } from '../auth/authed-button'
import { NewBookButton } from '../books/new-book-button'
import { useNav } from './context'
import { QuickSearch } from './search'

const AccountLink = ({ className }: { className?: string }) => {
  const session = useSession()
  const { theme } = useNav()

  if (session.status === 'loading')
    return <Loader className={cn(className, 'opacity-50')} />
  const currentUser = session.data?.user

  if (currentUser)
    return (
      <Link href="/account" className={className} aria-label="Account">
        <User strokeWidth={1} />
      </Link>
    )

  return (
    <AuthedButton source="Top navigation">
      <button className={className} aria-label="Account">
        <User strokeWidth={1} color={theme === 'dark' ? 'white' : 'black'} />
      </button>
    </AuthedButton>
  )
}

const navItemClassNames = (small?: boolean) =>
  cn(
    'animate-fade-slide-in flex gap-2 items-center',
    small ? 'text-18 sm:text-24' : 'text-32 sm:text-40'
  )

const navItemAttrs = (index: number, small?: boolean, className?: string) => ({
  className: cn(navItemClassNames(small), className),
  style: { animationDelay: `${index * 50}ms` }
})

const TopNavItem: FC<{
  children: string
  path: string | null
  className?: string
  index?: number
  small?: boolean
}> = ({ children, path, className, index = 0, small }) => {
  const segment = useSelectedLayoutSegment()
  const active = segment === path
  const href = `/${path || ''}`
  const [loading, setLoading] = useState(false)
  const { setOpen } = useNav()

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      href={href}
      {...navItemAttrs(index, small, cn(className, loading && 'opacity-50!'))}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        if (active) setOpen(false)
        else setLoading(true)
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
  small?: boolean
}> = ({ children, href, index, small }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    {...navItemAttrs(index, small)}
  >
    {children}
  </a>
)

const NavContent = () => {
  useScrollLock()
  const user = useCurrentUser()

  return (
    <div className="z-60 animate-fade-in fixed inset-0 max-h-screen overflow-auto bg-white pt-32 sm:pt-36">
      <Container className="absolute inset-x-0 top-0 border-b border-black py-5">
        <Dialog.Close className="all-caps flex items-center gap-6 sm:gap-10">
          <X strokeWidth={1} />
          Close
        </Dialog.Close>
      </Container>
      <div className="items-between flex flex-wrap gap-24 px-16 sm:px-32">
        <div className="flex grow flex-col gap-3">
          <TopNavItem path={null}>Home</TopNavItem>
          <TopNavItem index={2} path="about">
            About
          </TopNavItem>
          <TopNavItem path="cookbooks">Cookbooks</TopNavItem>
          <TopNavItem index={3} path="people">
            People Directory
          </TopNavItem>
          <TopNavItem index={4} path="publishers">
            Publishers
          </TopNavItem>
        </div>
        <div className="flex flex-col gap-1">
          <TopNavItem small index={1} path="account/submissions">
            Submit a Cookbook
          </TopNavItem>
          <TopNavItemExternal
            small
            href="https://www.buymeacoffee.com/booksaboutfood"
            index={2}
          >
            Buy us a Coffee
          </TopNavItemExternal>
          <TopNavItemExternal
            small
            href="https://www.instagram.com/booksabout.food"
            index={5}
          >
            Follow on Instagram
          </TopNavItemExternal>
          {user ? (
            <TopNavItem small index={5} path="account">
              Account
            </TopNavItem>
          ) : (
            <AuthedButton redirect="/account" source="Main menu">
              <button {...navItemAttrs(6, true)}>Login</button>
            </AuthedButton>
          )}
        </div>
      </div>
    </div>
  )
}

export const TopNav: FC = () => {
  const currentUser = useCurrentUser()
  const { theme, open, setOpen } = useNav()

  return (
    <nav className="z-nav absolute inset-x-0 top-0">
      <Container
        className={cn(
          'flex w-screen items-center gap-4 border-b border-black py-5 pr-4',
          theme === 'dark' && 'border-none text-white'
        )}
      >
        <Dialog.Root modal open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-8">
            <Dialog.Trigger title="Menu">
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
        {currentUser?.role === 'admin' && (
          <Link href="/admin">
            <Settings strokeWidth={1} size={22} />
          </Link>
        )}
        <QuickSearch />
        <AccountLink />
      </Container>
    </nav>
  )
}
