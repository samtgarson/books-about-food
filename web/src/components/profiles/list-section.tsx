import { Profile } from '@books-about-food/core/models/profile'
import { FC } from 'react'
import { ProfileList } from '../atoms/profile-list'
import { ProfileItem } from './item'
import { Wrap } from '../utils/wrap'

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
    <Wrap c={ProfileList}
      profiles={profiles}
      title={title}
      className={className}
    >
      {profiles.map((profile) => (
        <ProfileItem
          key={profile.id}
          profile={profile}
          display="list"
          meta={hideMeta ? false : undefined}
        />
      ))}
    </Wrap>
  )
}
