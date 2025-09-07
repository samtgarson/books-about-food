import cn from 'classnames'
import Image, { StaticImageData } from 'next/image'
import instaIcon from 'src/assets/homepage-links/insta.png'
import readMoreIcon from 'src/assets/homepage-links/read-more.png'
import spotifyIcon from 'src/assets/homepage-links/spotify.png'
import submitIcon from 'src/assets/homepage-links/submit.png'
import { ArrowUpRight } from 'src/components/atoms/icons'
import { NewBookButton } from '../books/new-book-button'

export function HomepageLinks() {
  return (
    <div className="flex flex-wrap">
      <HomepageLink
        label="Read more about us"
        icon={readMoreIcon}
        href="/about"
      />
      <HomepageLink
        label="Listen to our playlists"
        icon={spotifyIcon}
        href="https://open.spotify.com/user/32thenp9jsfpl01lv7xvx5dpc?si=9d53faf11a7742bf"
      />
      <HomepageLink
        label="Follow on Instagram"
        icon={instaIcon}
        href="https://www.instagram.com/booksabout.food"
      />
      <NewBookButton className={cn(linkClasses, invertedLinkClasses)}>
        <HomepageLinkContent label="Submit a cookbook" icon={submitIcon} />
      </NewBookButton>
    </div>
  )
}

const linkClasses =
  'flex w-full items-center gap-4 border-b border-black p-5 transition-colors first:border-l-transparent md:w-1/2 md:gap-6 md:px-12 md:py-10 md:even:border-l xl:w-1/4 xl:border-l'
const invertedLinkClasses = 'bg-black text-white hover:bg-black/80'

function HomepageLink({
  label,
  icon,
  href
}: {
  label: string
  icon: StaticImageData
  href: string
  invert?: boolean
}) {
  const external = href?.startsWith('http')
  return (
    <a
      className={cn(linkClasses, 'hover:bg-khaki')}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <HomepageLinkContent label={label} icon={icon} />
    </a>
  )
}

function HomepageLinkContent({
  label,
  icon
}: {
  label: string
  icon: StaticImageData
}) {
  return (
    <>
      <Image
        src={icon}
        width={48}
        height={48}
        alt={`Icon for link to ${label}`}
        className="size-8 rounded-lg md:size-12 md:rounded-xl"
      />
      {label}
      <ArrowUpRight className="ml-auto" strokeWidth={1} />
    </>
  )
}
