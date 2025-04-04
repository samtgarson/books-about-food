import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { FC } from 'react'
import { Avatar, AvatarProps } from '../atoms/avatar'

export const AvatarList: FC<{ profiles: Profile[] } & AvatarProps> = ({
  profiles,
  size = 'xs',
  className,
  ...props
}) => {
  return (
    <div className={cn('flex', className)}>
      {profiles.map((profile) => (
        <Avatar
          key={profile.id}
          profile={profile}
          {...props}
          size={size}
          className="-mr-1 last:mr-0"
        />
      ))}
    </div>
  )
}
