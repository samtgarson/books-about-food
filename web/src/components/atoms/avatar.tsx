import { ComponentProps, FC } from 'react'
import { NullProfile, Profile } from 'src/models/profile'
import cn from 'classnames'
import Image, { ImageProps } from 'next/image'

export type AvatarSize =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'fill'

export type BaseAvatarProps = {
  imgProps?: ImageProps
  backup: string
  size?: AvatarSize
  mobileSize?: AvatarSize
  backgroundColour?: string
  foregroundColour?: string
} & ComponentProps<'div'>

export const BaseAvatar: FC<BaseAvatarProps> = ({
  imgProps,
  backup,
  backgroundColour,
  foregroundColour,
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
      imgProps
        ? undefined
        : {
          backgroundColor: backgroundColour,
          color: foregroundColour
        }
    }
  >
    {imgProps ? (
      <Image
        {...imgProps}
        fill
        className="inset-0 object-cover"
        sizes="300px"
      />
    ) : (
      backup.split(' ').map((word) => word[0]?.toUpperCase())
    )}
  </div>
)

export type AvatarProps = Omit<
  BaseAvatarProps,
  'backup' | 'foregroundColour' | 'backgroundColour' | 'imageProps'
> & {
  profile?: Profile
}

export const Avatar: FC<AvatarProps> = ({
  profile = new NullProfile(),
  ...props
}) => (
  <BaseAvatar
    {...props}
    imgProps={profile.avatar?.imageAttrs()}
    backup={profile.name}
    foregroundColour={profile.foregroundColour}
    backgroundColour={profile.backgroundColour}
  />
)
