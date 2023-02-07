'use client'

import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar } from '../atoms/avatar'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'
import cn from 'classnames'
import * as Sheet from '../atoms/sheet'

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
      <Sheet.Root mobileOnly>
        <Sheet.Trigger className="w-full mt-4 sm:mt-20 sm:mb-8 flex flex-wrap justify-between items-start">
          <h2>{title}</h2>
          <span className="sm:hidden">Open</span>
          <div className={cn('w-full flex flex-wrap gap-2 sm:hidden mt-4')}>
            {profiles.map((profile) => (
              <Avatar key={profile.id} profile={profile} size="xs" />
            ))}
          </div>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Body>
            <Sheet.Header title="Frequent Collaborators" />
            <ListContent className="pb-8" />
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
      <ListContent className="hidden sm:block" />
    </>
  )
}
