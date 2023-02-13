import { Link } from 'database'
import Image from 'next/image'
import { FC } from 'react'
import { ArrowUpRight } from 'react-feather'
import { linkLogos } from 'src/assets/link-logos'

export type BookLinksProps = {
  links: Link[]
  className?: string
}

const DefaultLogo = () => (
  <span className="bg-white w-10 h-10 flex items-center justify-center">
    <ArrowUpRight strokeWidth={1} size={27} />
  </span>
)

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
      <p className="mb-4">Links</p>
      <ul className="flex flex-wrap gap-4">
        {links.map((link) => (
          <li
            key={link.id}
            className="min-w-[250px] basis-[calc(50%-8px)] flex-grow"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-center"
            >
              {linkLogos[link.site] ? (
                <Image
                  width={40}
                  height={40}
                  src={linkLogos[link.site]}
                  alt={link.site}
                />
              ) : (
                <DefaultLogo />
              )}
              {titleFor(link)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
