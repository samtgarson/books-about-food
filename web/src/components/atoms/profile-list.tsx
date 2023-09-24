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
        <Sheet.Trigger className={cn('flex w-full flex-wrap items-center')}>
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
          <Eye className="sm:hidden" size={22} strokeWidth={1}>
            Open
          </Eye>
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
