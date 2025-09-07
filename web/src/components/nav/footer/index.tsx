import { Container } from 'src/components/atoms/container'
import { LogoShape } from 'src/components/icons/logo-shape'
import { footerData } from './data'
import { FooterItem, FooterItemExternal } from './items'
import { FooterWrapper } from './wrapper'

export const Footer = async () => {
  return (
    <FooterWrapper>
      <Container>
        <div className="flex flex-col flex-wrap items-stretch justify-between gap-8 sm:flex-row">
          <div className="flex flex-col justify-between gap-8">
            <LogoShape text className="h-auto w-16" />
            <p className="text-18 font-medium">
              Beautifully designed cookbooks and the people making them
            </p>
          </div>
          <div className="flex flex-col gap-8 sm:gap-16">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-14">
              {footerData.map(({ title, items }) => (
                <ul key={title} className="flex flex-col gap-1">
                  <li className="mb-1 text-12 opacity-60">{title}</li>
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
            <div className="flex flex-wrap gap-3">
              <p className="text-12 opacity-50">
                Copyright © 2022-
                {new Date().getFullYear()} Books About Food. All book covers and
                images © of their respective owners.
              </p>
              <a
                href="mailto:jamin@booksabout.food"
                className="text-12 underline opacity-50"
              >
                Contact
              </a>
            </div>
            {/* <div className="flex flex-wrap gap-4 md:gap-8">
            <Link href="#" className="text-12 opacity-50">
              Terms
            </Link>
            <Link href="#" className="text-12 opacity-50">
              Privacy Policy
            </Link>
          </div> */}
          </div>
        </div>
      </Container>
    </FooterWrapper>
  )
}
