import { FC } from 'react'
import { Profile } from 'src/core/models/profile'
import { ProfileList } from '../atoms/profile-list'
import { Wrap } from '../utils/wrap'
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
    <Wrap
      c={ProfileList}
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
