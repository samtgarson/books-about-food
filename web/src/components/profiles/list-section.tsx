'use client'

import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar } from '../atoms/avatar'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'
import cn from 'classnames'
import * as Sheet from '../atoms/sheet'
import { Eye } from 'react-feather'

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
  const ListContent = ({ className }: { className?: string }) => (
    <GridContainer className={cn('-mt-px sm:mt-0', className)}>
      {profiles.map((profile) => (
        <ProfileItem key={profile.id} profile={profile} display="list" />
      ))}
    </GridContainer>
  )

  return (
    <div className={className}>
      <Sheet.Root mobileOnly>
        <Sheet.Trigger
          className={cn(
            'w-full sm:mb-4 flex flex-wrap justify-between items-start'
          )}
        >
          <h2>{title}</h2>
          <Eye className="sm:hidden" size={22} strokeWidth={1}>
            Open
          </Eye>
          <div className={cn('w-full flex flex-wrap gap-2 sm:hidden mt-4')}>
            {profiles.map((profile) => (
              <Avatar key={profile.id} profile={profile} size="xs" />
            ))}
          </div>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Body>
            <Sheet.Header title={title} />
            <ListContent className={cn('pb-8')} />
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
      <ListContent className={cn('hidden sm:block')} />
    </div>
  )
}
