import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { Button } from '../atoms/button'
import { Container } from '../atoms/container'
import { Logo } from './logo'

const navItemClassNames = 'text-14'

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
      <div className="flex flex-wrap justify-between gap-8 md:items-center">
        <Logo />
        <div className="flex flex-wrap gap-4 md:order-first md:flex-shrink-0 md:gap-8">
          <FooterItem path="/">Home</FooterItem>
          <FooterItem path="/cookbooks">Cookbooks</FooterItem>
          <FooterItem path="/authors">Authors</FooterItem>
          <FooterItem path="/people">People</FooterItem>
          <FooterItem path="/publishers">Publishers</FooterItem>
          <FooterItemExternal href="https://www.instagram.com/books.about.food/">
            Instagram
          </FooterItemExternal>
        </div>
      </div>
      <div className="mt-16 flex gap-4 md:mt-20 lg:justify-end">
        <Button as="a" href="/" variant="outline">
          Submit
        </Button>
        <Button as="a" href="/" variant="outline">
          Create Account
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-6 md:mt-10">
        <div className="flex flex-wrap gap-4 md:gap-8">
          <Link href="#" className="text-12 opacity-50">
            About
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Claim Your Profile
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Advertise
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Pricing
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Terms
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Privacy Policy
          </Link>
          <Link href="#" className="text-12 opacity-50">
            FAQs
          </Link>
          <Link href="#" className="text-12 opacity-50">
            Credits
          </Link>
        </div>
        <p className="text-12 opacity-50 md:order-first">
          Copyright © 2023 Books About Food. All book covers and images © of
          their respective owners.
        </p>
      </div>
    </Container>
  </footer>
)
