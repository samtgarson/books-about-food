import { FC } from 'react'

export type Link = { name: string; url: string }
export type LinkListProps = { links: Link[] }

export const LinkList: FC<LinkListProps> = ({ links }) => {
  if (!links.length) return null
  return (
    <>
      {links.map((link, i) => (
        <>
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline mr-2 last:mr-0"
          >
            {link.name}
          </a>
          {i < links.length - 1 && ' • '}
        </>
      ))}
    </>
  )
}
