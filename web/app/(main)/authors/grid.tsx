import { Profile } from 'src/models/profile'
import { AuthorItem } from './item'
import cn from 'classnames'
import { FC } from 'react'
import Link from 'next/link'

export type AuthorListProps = {
  profiles: Profile[]
  loading?: boolean
  className?: string
  viewMoreLink?: { path: string; label: string }
}

export const AuthorsGrid: FC<AuthorListProps> = ({
  profiles,
  loading,
  className,
  viewMoreLink
}) => (
  <ul
    className={cn(
      'grid auto-grid-md gap-x-8 gap-y-16 transition-opacity',
      loading && 'opacity-50',
      className
    )}
  >
    {profiles.map((profile) => (
      <AuthorItem key={profile.id} profile={profile} />
    ))}
    {viewMoreLink && (
      <li>
        <Link
          className="rounded-full border border-black aspect-square flex justify-center items-center bg-white text-16 sm:text-24 p-4 text-center"
          href={viewMoreLink.path}
        >
          {viewMoreLink.label}
        </Link>
      </li>
    )}
  </ul>
)
