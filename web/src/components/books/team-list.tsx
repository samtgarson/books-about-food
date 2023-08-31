import { FC, useMemo } from 'react'
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
  const [profiles, profileMap] = useMemo(() => {
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
    return [profiles, profileMap]
  }, [contributions])

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
            meta={profileMap.get(profile.id)?.join(' • ')}
          />
        ))}
      </GridContainer>
    </ProfileList>
  )
}
