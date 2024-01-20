import { NullProfile, Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Image, { ImageProps } from 'next/image'
import { ComponentProps, FC } from 'react'

export const avatarSize = [
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'fill'
] as const

export type AvatarSize = (typeof avatarSize)[number]

export type BaseAvatarProps = {
  imgProps?: ImageProps | null
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
      'relative flex aspect-square flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white bg-opacity-50',
      {
        'w-16': mobileSize === 'md' || (!mobileSize && size === 'md'),
        'w-12': mobileSize === 'sm' || (!mobileSize && size === 'sm'),
        'w-10': mobileSize === 'xs' || (!mobileSize && size === 'xs'),
        'w-32': mobileSize === 'xl' || (!mobileSize && size === 'xl'),
        'w-48': mobileSize === '2xl' || (!mobileSize && size === '2xl'),
        'w-64': mobileSize === '3xl' || (!mobileSize && size === '3xl'),
        'text-12 w-8': mobileSize === '2xs' || (!mobileSize && size === '2xs'),
        'text-10 w-6': mobileSize === '3xs' || (!mobileSize && size === '3xs'),
        'w-full': mobileSize === 'fill' || (!mobileSize && size === 'fill'),
        'md:w-48': size === '3xl',
        'md:w-32': size === '2xl',
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
      <span className="leading-none mt-px">
        {backup.split(' ').map((word) => word[0]?.toUpperCase())}
      </span>
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
