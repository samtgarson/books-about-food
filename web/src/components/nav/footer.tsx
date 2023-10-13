import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { Button } from '../atoms/button'
import { Container } from '../atoms/container'
import { AuthedButton } from '../auth/authed-button'
import { LogoShape } from '../icons/logo-shape'

const navItemClassNames = 'text-12 md:text-14'

const FooterItem: FC<{
  children: string
  path: string
  className?: string
}> = ({ children, path, className }) => {
  return (
    <Link href={path} className={cn(className, navItemClassNames)}>
      {children}
    </Link>
  )
}

const FooterItemExternal: FC<{
  children: string
  href: string
}> = ({ children, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={navItemClassNames}
  >
    {children}
  </a>
)

export const Footer = () => (
  <footer className="mt-20 bg-white pb-6 pt-12 md:pb-10 md:pt-20">
    <Container>
      <div className="flex flex-wrap justify-between gap-16 md:gap-8 items-center mb-16 md:mb-20">
        <LogoShape text className="w-16 h-auto" />
        <div className="flex gap-4">
          <AuthedButton>
            <Button as="a" href="/account/books" variant="outline">
              Submit Cookbook
            </Button>
          </AuthedButton>
          <AuthedButton>
            <Button as="a" href="/account" variant="outline">
              Create Account
            </Button>
          </AuthedButton>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex flex-wrap w-full md:flex-shrink-0 gap-y-2 gap-x-4 md:gap-x-8">
          <FooterItem path="/">Home</FooterItem>
          <FooterItem path="/">About</FooterItem>
          <FooterItem path="/cookbooks">Cookbooks</FooterItem>
          <FooterItem path="/authors">Authors</FooterItem>
          <FooterItem path="/people">People</FooterItem>
          <FooterItem path="/publishers">Publishers</FooterItem>
          <FooterItem path="/frequently-asked-questions">FAQs</FooterItem>
          <FooterItemExternal href="https://www.instagram.com/books.about.food/">
            Instagram
          </FooterItemExternal>
        </div>
        <p className="text-12 opacity-50">
          Copyright © {new Date().getFullYear()} Books About Food. All book
          covers and images © of their respective owners.
        </p>
        <div className="flex flex-wrap gap-4 md:gap-8">
          <Link href="#" className="text-12 opacity-50">
            Terms
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Privacy Policy
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Credits
          </Link>
        </div>
      </div>
    </Container>
  </footer>
)
