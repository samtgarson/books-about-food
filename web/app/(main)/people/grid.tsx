import { Profile } from 'src/models/profile'
import { FC } from 'react'
import Link from 'next/link'
import { GridContainer } from 'src/components/lists/grid-container'
import { ProfileItem } from 'src/components/profiles/item'

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
          className="border border-black sm:aspect-square flex justify-center items-center bg-white text-16 sm:text-24 p-4 border-b text-center -mr-px sm:-mb-px"
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
