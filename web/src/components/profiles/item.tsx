import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'
import cn from 'classnames'
import { ReactNode } from 'react'

export type ProfileItemProps = {
  profile?: Profile
  display?: 'list' | 'grid'
  className?: string
  index?: number
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
      'relative border border-black sm:-mr-px -mb-px last:mb-0 sm:last:-mb-px list-none',
      className,
      !profile && 'border-khaki animate-pulse'
    )}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    {children}
  </li>
)

export const Content = ({
  profile,
  display = 'grid',
  className
}: Pick<ProfileItemProps, 'profile' | 'display' | 'className'>) => (
  <Link
    href={profile ? `/people/${profile.slug}` : '#'}
    className={cn(
      className,
      'h-full flex p-4 items-center gap-4',
      display === 'grid' &&
      'sm:items-stretch sm:flex-col sm:aspect-square sm:justify-between sm:p-8',
      !profile && 'pointer-events-none'
    )}
  >
    <Avatar
      profile={profile}
      size={display === 'grid' ? 'md' : 'sm'}
      mobileSize="sm"
    />
    <div className="flex flex-col gap-2">
      {profile ? (
        <>
          <p className="leading-none font-medium text-16">{profile.name}</p>
          <p className="leading-none text-14">{profile.jobTitle}</p>
        </>
      ) : (
        <>
          <p className="leading-none h-4 w-40 mb-1 bg-khaki"></p>
          <p className="leading-none h-3.5 w-30 bg-khaki"></p>
        </>
      )}
    </div>
  </Link>
)

export const ProfileItem = ({
  profile,
  display = 'grid',
  index = 0,
  className
}: ProfileItemProps) => (
  <Wrapper profile={profile} className={className} index={index}>
    <Content profile={profile} display={display} />
  </Wrapper>
)
