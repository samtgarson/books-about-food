import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'
import cn from 'classnames'

export type ProfileItemProps = {
  profile: Profile
  display?: 'list' | 'grid'
  className?: string
}

export const ProfileItem = ({
  profile,
  display = 'grid',
  className
}: ProfileItemProps) => (
  <li
    className={cn(
      'border sm:-mr-px -mb-px last:mb-0 sm:last:-mb-px',
      className
    )}
  >
    <Link
      href={`/people/${profile.slug}`}
      className={cn(
        'h-full flex p-4 items-center gap-4',
        display === 'grid' &&
          'sm:items-stretch sm:flex-col sm:aspect-square sm:justify-between sm:p-8'
      )}
    >
      <Avatar
        profile={profile}
        size={display === 'grid' ? 'md' : 'sm'}
        mobileSize="sm"
      />
      <div className="flex flex-col gap-2">
        <p className="font-medium text-16">{profile.name}</p>
        <p className="text-14">{profile.jobNames}</p>
      </div>
    </Link>
  </li>
)
