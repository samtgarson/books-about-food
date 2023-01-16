import { ComponentProps, FC } from 'react'
import { Profile } from 'src/models/profile'
import cn from 'classnames'

export type AvatarProps = {
  profile: Profile
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill'
} & ComponentProps<'div'>

export const Avatar: FC<AvatarProps> = ({
  profile,
  size = 'md',
  className,
  ...props
}) => (
  <div
    {...props}
    className={cn(
      className,
      'rounded-full flex items-center justify-center mb-auto bg-white bg-opacity-50',
      {
        'w-16 h-16': size === 'md',
        'w-12 h-12': size === 'sm',
        'w-8 h-8': size === 'xs',
        'w-36 h-36': size === 'xl',
        'w-full aspect-square': size === 'fill'
      }
    )}
  >
    {profile.initials}
  </div>
)
