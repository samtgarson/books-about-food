import { ComponentProps, FC } from 'react'
import { Profile } from 'src/models/profile'
import cn from 'classnames'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill'

export type AvatarProps = {
  profile: Profile
  size?: AvatarSize
  mobileSize?: AvatarSize
} & ComponentProps<'div'>

export const Avatar: FC<AvatarProps> = ({
  profile,
  size = 'md',
  mobileSize = size,
  className,
  ...props
}) => (
  <div
    {...props}
    className={cn(
      className,
      'rounded-full flex items-center justify-center bg-white bg-opacity-50 aspect-square flex-shrink-0',
      {
        'w-16': mobileSize === 'md',
        'w-12': mobileSize === 'sm',
        'w-8': mobileSize === 'xs',
        'w-36': mobileSize === 'xl',
        'w-full': mobileSize === 'fill',
        'md:w-16': size === 'md',
        'md:w-12': size === 'sm',
        'md:w-8': size === 'xs',
        'md:w-36': size === 'xl',
        'md:w-full': size === 'fill'
      }
    )}
  >
    {profile.initials}
  </div>
)
