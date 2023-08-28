'use client'

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
}

export const ProfileListSection: FC<ProfileListSectionProps> = ({
  profiles,
  title,
  className
}) => {
  return (
    <ProfileList profiles={profiles} title={title} className={className}>
      <GridContainer className={cn('-mt-px sm:mt-0')}>
        {profiles.map((profile) => (
          <ProfileItem key={profile.id} profile={profile} display="list" />
        ))}
      </GridContainer>
    </ProfileList>
  )
}
