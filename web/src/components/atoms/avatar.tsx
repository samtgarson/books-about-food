import { NullProfile, Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Image, { ImageProps } from 'next/image'
import { CSSProperties, ComponentProps, FC, useId } from 'react'

export const avatarSize = {
  '3xs': 24,
  '2xs': 32,
  xs: 40,
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
  '2xl': 192,
  '3xl': 256
} as const

export type AvatarSize = keyof typeof avatarSize

export type BaseAvatarProps = {
  imgProps?: ImageProps | null
  backup: string
  size?: AvatarSize
  mobileSize?: AvatarSize
  backgroundColour?: string
  foregroundColour?: string
  fill?: boolean
} & ComponentProps<'div'>

export function BaseAvatar({
  imgProps,
  backup,
  backgroundColour,
  foregroundColour,
  size = 'md',
  mobileSize = size,
  className,
  fill,
  ...props
}: BaseAvatarProps) {
  const sizeVal = avatarSize[size]
  const id = `avatar-${useId()}`
  const style: CSSProperties = {}

  if (imgProps) {
    imgProps.width = sizeVal
    imgProps.height = sizeVal
    imgProps.fill = false
  } else {
    style.backgroundColor = backgroundColour
    style.color = foregroundColour
  }

  if (!fill) {
    style.width = sizeVal
    style.height = sizeVal
  }

  return (
    <>
      <div
        {...props}
        id={id}
        className={cn(
          className,
          'relative flex aspect-square flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white bg-opacity-50'
        )}
        style={style}
      >
        {imgProps ? (
          <Image
            {...imgProps}
            placeholder={sizeVal >= 40 ? imgProps.placeholder : undefined}
            className={cn(
              'inset-0 object-cover aspect-square',
              fill && 'w-full h-full'
            )}
          />
        ) : (
          <span className="leading-none mt-px">
            {backup.split(' ').map((word) => word[0]?.toUpperCase())}
          </span>
        )}
      </div>
      {mobileSize !== size && (
        <style>{`
        @media (max-width: 640px) {
          #${id.replace(/:/g, '\\:')} {
            width: ${avatarSize[mobileSize]}px !important;
            height: ${avatarSize[mobileSize]}px !important;
          }
        }
      `}</style>
      )}
    </>
  )
}

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
