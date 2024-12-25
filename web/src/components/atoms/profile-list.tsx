'use client'

import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { ReactNode } from 'react'
import { Eye } from 'src/components/atoms/icons'
import { Avatar } from '../atoms/avatar'
import * as Sheet from '../atoms/sheet'
import { GridContainer } from '../lists/grid-container'

export type ProfileListProps = {
  profiles: Profile[]
  title: string
  className?: string
  children: ReactNode
}

export function ProfileList({
  profiles,
  title,
  className,
  children
}: ProfileListProps) {
  return (
    <div className={className}>
      <Sheet.Root mobileOnly>
        <Sheet.Trigger className={cn('flex w-full flex-nowrap items-center')}>
          <div className={cn('flex grow flex-wrap gap-2')}>
            <h2 className="all-caps mb-4 w-full text-left">{title}</h2>
            {profiles.map((profile) => (
              <Avatar
                key={profile.id}
                profile={profile}
                size="xs"
                className="sm:hidden"
              />
            ))}
          </div>
          <Eye className="sm:hidden shrink-0 ml-4" size={22} strokeWidth={1}>
            Open
          </Eye>
        </Sheet.Trigger>
        <Sheet.Content title={title}>
          <Sheet.Body className="pb-8">
            <GridContainer>{children}</GridContainer>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
      <GridContainer className="hidden sm:block">{children}</GridContainer>
    </div>
  )
}
