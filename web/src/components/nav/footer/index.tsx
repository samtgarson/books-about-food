import { Container } from 'src/components/atoms/container'
import { LogoShape } from 'src/components/icons/logo-shape'
import { footerData } from './data'
import { FooterItem, FooterItemExternal } from './items'
import { FooterWrapper } from './wrapper'

export const Footer = async () => {
  return (
    <FooterWrapper>
      <Container>
        <div className="flex flex-wrap flex-col sm:flex-row justify-between gap-8 items-stretch">
          <div className="flex flex-col justify-between gap-8">
            <LogoShape text className="w-16 h-auto" />
            <p className="font-medium text-18">
              The cookbook’s new digital home
            </p>
          </div>
          <div className="flex flex-col gap-8 sm:gap-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-14">
              {footerData.map(({ title, items }) => (
                <ul key={title} className="flex flex-col gap-1">
                  <li className="text-12 opacity-60 mb-1">{title}</li>
                  {items.map((item) => (
                    <li key={item.label}>
                      {item.path ? (
                        <FooterItem path={item.path}>{item.label}</FooterItem>
                      ) : item.href ? (
                        <FooterItemExternal href={item.href}>
                          {item.label}
                        </FooterItemExternal>
                      ) : (
                        <FooterItem path={`/cookbooks?tags=${item.tag}`}>
                          {item.label}
                        </FooterItem>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <p className="text-12 opacity-50">
                Copyright © 2022-{new Date().getFullYear()} Books About Food.
                All book covers and images © of their respective owners.
              </p>
              <a
                href="mailto:info@booksabout.food"
                className="text-12 opacity-50 underline"
              >
                Contact
              </a>
            </div>
            {/*<div className="flex flex-wrap gap-4 md:gap-8">
            <Link href="#" className="text-12 opacity-50">
              Terms
            </Link>
            <Link href="#" className="text-12 opacity-50">
              Privacy Policy
            </Link>
          </div>*/}
          </div>
        </div>
      </Container>
    </FooterWrapper>
  )
}
