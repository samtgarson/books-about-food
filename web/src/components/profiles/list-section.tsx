import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'
import cn from 'classnames'
import { ProfileList } from '../atoms/profile-list'

export type ProfileListSectionProps = {
  profiles: Profile[]
  title: string
  className?: string
  hideMeta?: boolean
}

export const ProfileListSection: FC<ProfileListSectionProps> = ({
  profiles,
  title,
  className,
  hideMeta = false
}) => {
  return (
    <ProfileList
      profiles={profiles}
      title={title}
      className={className}
      data-superjson
    >
      <GridContainer className={cn('-mt-px sm:mt-0')}>
        {profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            display="list"
            meta={hideMeta ? false : undefined}
          />
        ))}
      </GridContainer>
    </ProfileList>
  )
}
