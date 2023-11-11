import { Link } from 'database'
import Image from 'next/image'
import { FC } from 'react'
import { ArrowUpRight } from 'react-feather'
import { isWebsite } from 'shared/data/websites'
import { linkLogos } from 'src/assets/link-logos'

export type BookLinksProps = {
  links: Link[]
  className?: string
}

const DefaultLogo = () => <ArrowUpRight strokeWidth={1} size={27} />

const titleFor = (link: Link) => {
  switch (link.site) {
    case 'Amazon':
    case 'Bookshop.org':
      return (
        <span>
          Buy on <u>{link.site}</u>
        </span>
      )
    default:
      return (
        <span>
          View on <u>{link.site}</u>
        </span>
      )
  }
}

export const BookLinks: FC<BookLinksProps> = ({ links, className }) =>
  links.length === 0 ? null : (
    <div className={className}>
      <p className="mb-4 all-caps">Links</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {links.map((link) => (
          <li
            key={link.id}
            className="min-w-[250px] flex-grow basis-[calc(50%-8px)]"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-white">
                {isWebsite(link.site) ? (
                  <Image
                    width={24}
                    height={24}
                    src={linkLogos[link.site]}
                    alt={link.site}
                  />
                ) : (
                  <DefaultLogo />
                )}
              </span>
              {titleFor(link)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
