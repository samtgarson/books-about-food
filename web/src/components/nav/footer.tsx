import Link from 'next/link'
import { Container } from '../atoms/container'
import { Logo } from './logo'
import cn from 'classnames'
import { FC } from 'react'
import { Button } from '../atoms/button'

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
  <footer className="bg-white mt-20 pt-12 md:pt-20 pb-6 md:pb-10">
    <Container>
      <div className="flex justify-between md:items-center flex-wrap gap-8">
        <Logo />
        <div className="md:order-first flex gap-4 md:gap-8 flex-wrap md:flex-shrink-0">
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
      <div className="flex lg:justify-end mt-16 md:mt-20 gap-4">
        <Button as="a" href="/" variant="outline">
          Submit
        </Button>
        <Button as="a" href="/" variant="outline">
          Create Account
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 justify-between items-center mt-6 md:mt-10">
        <div className="flex gap-4 md:gap-8 flex-wrap">
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
