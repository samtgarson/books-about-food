import { Contribution } from '@books-about-food/core/models/contribution'
import { Profile } from '@books-about-food/core/models/profile'
import { ProfileList } from '../atoms/profile-list'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from '../profiles/item'

export type TeamListProps = {
  contributions: Contribution[]
  className?: string
}

export function TeamList({ contributions, className }: TeamListProps) {
  const profiles: Profile[] = []
  const profileMap = contributions.reduce<Map<string, string[]>>(
    (map, { profile, jobName }) => {
      if (!profiles.find((p) => p.id === profile.id)) {
        profiles.push(profile)
      }

      const jobs = map.get(profile.id) || []
      map.set(profile.id, [...jobs, jobName])
      return map
    },
    new Map()
  )

  return (
    <ProfileList
      profiles={profiles}
      title="Team"
      className={className}
      data-superjson
    >
      <GridContainer>
        {profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            display="list"
            meta={profileMap.get(profile.id)?.join(' • ')}
          />
        ))}
      </GridContainer>
    </ProfileList>
  )
}
