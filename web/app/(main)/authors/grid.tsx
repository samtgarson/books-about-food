import { Profile } from 'src/models/profile'
import { AuthorItem } from './item'
import cn from 'classnames'
import { FC, ReactNode } from 'react'
import Link from 'next/link'

export type AuthorListProps = {
  profiles: Profile[]
  className?: string
  viewMoreLink?: { path: string; label: string }
}

export const AuthorGridContainer = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => (
  <ul
    className={cn(
      'grid auto-grid-md gap-x-8 gap-y-16 transition-opacity',
      className
    )}
  >
    {children}
  </ul>
)

export const AuthorsGrid: FC<AuthorListProps> = ({
  profiles,
  className,
  viewMoreLink
}) => (
  <AuthorGridContainer className={className}>
    {profiles.map((profile, index) => (
      <AuthorItem key={profile.id} profile={profile} index={index} />
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
  </AuthorGridContainer>
)

export const SkeletonAuthorsGrid = () => (
  <AuthorGridContainer>
    {Array.from({ length: 30 }, (_, i) => (
      <AuthorItem key={i} index={i} />
    ))}
  </AuthorGridContainer>
)
