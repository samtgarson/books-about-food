'use client'

import { FC, ReactNode } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar } from '../atoms/avatar'
import cn from 'classnames'
import * as Sheet from '../atoms/sheet'
import { Eye } from 'react-feather'

export type ProfileListProps = {
  profiles: Profile[]
  title: string
  className?: string
  children: ReactNode
}

export const ProfileList: FC<ProfileListProps> = ({
  profiles,
  title,
  className,
  children
}) => {
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
          <Sheet.Body className="pb-8">
            <Sheet.Header title={title} />
            {children}
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
      <div className="hidden sm:block">{children}</div>
    </div>
  )
}
