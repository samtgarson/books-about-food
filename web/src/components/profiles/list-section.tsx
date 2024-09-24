import { Profile } from '@books-about-food/core/models/profile'
import { FC } from 'react'
import { ProfileList } from '../atoms/profile-list'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'

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
      <GridContainer>
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
