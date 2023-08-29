import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { GridContainer } from '../lists/grid-container'
import cn from 'classnames'
import { ProfileList } from '../atoms/profile-list'
import { ProfileItem } from '../profiles/item'
import { Contribution } from 'src/models/contribution'

export type TeamListProps = {
  contributions: Contribution[]
  className?: string
}

export const TeamList: FC<TeamListProps> = ({ contributions, className }) => {
  const profileMap = contributions.reduce<Map<Profile, Contribution[]>>(
    (map, contribution) => {
      const contributions = map.get(contribution.profile) || []
      map.set(contribution.profile, [...contributions, contribution])
      return map
    },
    new Map()
  )
  const profiles = Array.from(profileMap.keys())

  return (
    <ProfileList
      profiles={profiles}
      title="Team"
      className={className}
      data-superjson
    >
      <GridContainer className={cn('-mt-px sm:mt-0')}>
        {profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            display="list"
            meta={profileMap
              .get(profile)
              ?.map((c) => c.jobName)
              .join(' • ')}
          />
        ))}
      </GridContainer>
    </ProfileList>
  )
}
