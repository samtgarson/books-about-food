import Link from 'next/link'
import { FC } from 'react'

const TopNavItem: FC<{
  children: string
  href: string
  external?: boolean
}> = ({ children, href, external }) =>
  external ? (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {children}
    </a>
  ) : (
    <Link href={href}>{children}</Link>
  )

export const TopNav: FC = () => (
  <nav className='flex gap-20 py-2 border-b-black border-b'>
    <TopNavItem href='/'>Home</TopNavItem>
    <TopNavItem href='/latest'>Latest</TopNavItem>
    <TopNavItem href='/cookbooks'>Cookbooks</TopNavItem>
    <TopNavItem href='/authors'>Authors</TopNavItem>
    <TopNavItem href='/people'>People</TopNavItem>
    <TopNavItem href='/publishers'>Publishers</TopNavItem>
    <TopNavItem href='/search'>Search</TopNavItem>
    <TopNavItem href='https://www.instagram.com/books.about.food' external>
      Instagram
    </TopNavItem>
  </nav>
)
