import cn from 'classnames'
import { FC } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar, AvatarProps } from '../atoms/avatar'

export const AvatarList: FC<{ profiles: Profile[] } & AvatarProps> = ({
  profiles,
  size = 'xs',
  className,
  ...props
}) => {
  return (
    <div className="flex">
      {profiles.map((profile) => (
        <Avatar
          key={profile.id}
          profile={profile}
          {...props}
          size={size}
          className={cn('-mr-1 last:mr-0', className)}
        />
      ))}
    </div>
  )
}
