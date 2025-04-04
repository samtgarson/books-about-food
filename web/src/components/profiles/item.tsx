import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Avatar } from 'src/components/atoms/avatar'

export type ProfileItemProps = {
  profile?: Profile
  display?: 'list' | 'grid'
  className?: string
  index?: number
  meta?: string | false
}

export const Wrapper = ({
  profile,
  className,
  index = 0,
  children
}: Pick<ProfileItemProps, 'profile' | 'index' | 'className'> & {
  children: ReactNode
}) => (
  <li
    className={cn(
      'relative -mb-px list-none border border-black last:mb-0 group-[.profile-list]:border-neutral-grey group-[.profile-list]:first:border-t-transparent sm:-mr-px sm:border-black sm:last:-mb-px',
      className,
      !profile && 'animate-pulse border-khaki'
    )}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    {children}
  </li>
)

export const Content = ({
  profile,
  display = 'grid',
  className,
  meta = profile?.jobTitle,
  disabled
}: Pick<ProfileItemProps, 'profile' | 'display' | 'className' | 'meta'> & {
  disabled?: boolean
}) => (
  <Link
    href={profile && !disabled ? `/people/${profile.slug}` : '#'}
    className={cn(
      className,
      'flex h-full items-center gap-4 p-4',
      display === 'grid' &&
        'sm:aspect-square sm:flex-col sm:items-stretch sm:justify-between sm:p-8',
      (!profile || disabled) && 'pointer-events-none'
    )}
    tabIndex={disabled ? -1 : undefined}
  >
    <Avatar
      profile={profile}
      size={display === 'grid' ? 'md' : 'sm'}
      mobileSize="sm"
    />
    <div className="flex flex-col gap-1">
      {profile ? (
        <>
          <p className="text-16 font-medium leading-none">{profile.name}</p>
          {meta && <p className="text-14 leading-tight">{meta}</p>}
        </>
      ) : (
        <>
          <p className="mb-1 h-4 w-40 bg-khaki leading-none"></p>
          <p className="w-30 h-3.5 bg-khaki leading-none"></p>
        </>
      )}
    </div>
  </Link>
)

export const ProfileItem = ({
  profile,
  display = 'grid',
  className,
  index,
  meta
}: ProfileItemProps) => (
  <Wrapper profile={profile} index={index} className={className}>
    <Content profile={profile} display={display} meta={meta} />
  </Wrapper>
)
