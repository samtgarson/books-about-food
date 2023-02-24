import { Profile } from 'src/models/profile'
import cn from 'classnames'
import { FC } from 'react'
import Link from 'next/link'
import { GridContainer } from 'src/components/lists/grid-container'
import { ProfileItem } from 'src/components/profiles/item'

export type PeopleListProps = {
  profiles: Profile[]
  loading?: boolean
  className?: string
  viewMoreLink?: { path: string; label: string }
}

export const PeopleGrid: FC<PeopleListProps> = ({
  profiles,
  loading,
  className,
  viewMoreLink
}) => (
  <GridContainer
    className={cn('transition-opacity', loading && 'opacity-50', className)}
  >
    {profiles.map((profile) => (
      <ProfileItem key={profile.id} profile={profile} />
    ))}
    {viewMoreLink && (
      <li>
        <Link
          className="border border-black sm:aspect-square flex justify-center items-center bg-white text-16 sm:text-24 p-4 border-b text-center -mr-px sm:-mb-px"
          href={viewMoreLink.path}
        >
          {viewMoreLink.label}
        </Link>
      </li>
    )}
  </GridContainer>
)
