import Link from 'next/link'
import { FC } from 'react'
import { GridContainer } from 'src/components/lists/grid-container'
import { ProfileItem } from 'src/components/profiles/item'
import { Profile } from 'src/models/profile'

export type PeopleListProps = {
  profiles: Profile[]
  className?: string
  viewMoreLink?: { path: string; label: string }
}

export const PeopleGrid: FC<PeopleListProps> = ({
  profiles,
  className,
  viewMoreLink
}) => (
  <GridContainer className={className}>
    {profiles.map((profile, i) => (
      <ProfileItem key={profile.id} profile={profile} index={i} />
    ))}
    {viewMoreLink && (
      <li>
        <Link
          className="text-16 sm:text-24 -mr-px flex items-center justify-center border border-b border-black bg-white p-4 text-center sm:-mb-px sm:aspect-square"
          href={viewMoreLink.path}
        >
          {viewMoreLink.label}
        </Link>
      </li>
    )}
  </GridContainer>
)

export const SkeletonPeopleGrid = () => (
  <GridContainer>
    {Array.from({ length: 30 }, (_, i) => (
      <ProfileItem key={i} index={i} />
    ))}
  </GridContainer>
)
