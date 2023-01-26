'use client'

import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar } from '../atoms/avatar'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'
import cn from 'classnames'
import { AntiContainer } from '../atoms/container'
import { Sheet } from '../atoms/sheet'

export type ProfileListSectionProps = {
  profiles: Profile[]
  title: string
}

export const ProfileListSection: FC<ProfileListSectionProps> = ({
  profiles,
  title
}) => {
  const ListContent = ({ className }: { className?: string }) => (
    <GridContainer className={cn('-mt-px sm:mt-0', className)}>
      {profiles.map((profile) => (
        <ProfileItem key={profile.id} profile={profile} display="list" />
      ))}
    </GridContainer>
  )

  return (
    <>
      <Sheet
        title={title}
        mobileOnly
        triggerClassName="w-full mt-4 sm:mt-20 sm:mb-8 flex flex-wrap justify-between items-start"
        content={<ListContent className="pb-8" />}
      >
        <h2>{title}</h2>
        <span className="sm:hidden">Open</span>
        <div className={cn('w-full flex flex-wrap gap-2 sm:hidden mt-4')}>
          {profiles.map((profile) => (
            <Avatar key={profile.id} profile={profile} size="xs" />
          ))}
        </div>
      </Sheet>
      <AntiContainer mobile={false}>
        <ListContent className="hidden sm:block" />
      </AntiContainer>
    </>
  )
}
