import { ComponentProps, FC } from 'react'
import { NullProfile, Profile } from 'src/models/profile'
import cn from 'classnames'
import Image from 'next/image'

export type AvatarSize =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'fill'

export type AvatarProps = {
  profile?: Profile
  size?: AvatarSize
  mobileSize?: AvatarSize
} & ComponentProps<'div'>

export const Avatar: FC<AvatarProps> = ({
  profile = new NullProfile(),
  size = 'md',
  mobileSize = size,
  className,
  ...props
}) => (
  <div
    {...props}
    className={cn(
      className,
      'rounded-full flex items-center justify-center bg-white bg-opacity-50 aspect-square flex-shrink-0 relative overflow-hidden',
      {
        'w-16': mobileSize === 'md' || (!mobileSize && size === 'md'),
        'w-12': mobileSize === 'sm' || (!mobileSize && size === 'sm'),
        'w-10': mobileSize === 'xs' || (!mobileSize && size === 'xs'),
        'w-32': mobileSize === 'xl' || (!mobileSize && size === 'xl'),
        'w-8 text-12': mobileSize === '2xs' || (!mobileSize && size === '2xs'),
        'w-6 text-10': mobileSize === '3xs' || (!mobileSize && size === '3xs'),
        'w-full': mobileSize === 'fill' || (!mobileSize && size === 'fill'),
        'md:w-16': size === 'md',
        'md:w-12': size === 'sm',
        'md:w-10': size === 'xs',
        'md:w-36': size === 'xl',
        'md:w-8': size === '2xs',
        'md:w-full': size === 'fill'
      }
    )}
    style={
      profile.avatar
        ? undefined
        : {
          backgroundColor: profile.backgroundColour,
          color: profile.foregroundColour
        }
    }
  >
    {profile.avatar ? (
      <Image
        {...profile.avatar.imageAttrs()}
        fill
        className="inset-0 object-cover"
        sizes="300px"
      />
    ) : (
      profile.initials
    )}
  </div>
)
