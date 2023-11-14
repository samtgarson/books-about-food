import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { AuthorItem } from './item'

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
      'auto-grid-md grid gap-x-8 gap-y-16 transition-opacity',
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
          className="text-16 sm:text-24 flex aspect-square items-center justify-center rounded-full border border-black bg-white p-4 text-center"
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
