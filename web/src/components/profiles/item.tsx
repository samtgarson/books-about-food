import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'
import cn from 'classnames'

export type ProfileItemProps = {
  profile: Profile
  display?: 'list' | 'grid'
}

export const ProfileItem = ({
  profile,
  display = 'grid'
}: ProfileItemProps) => (
  <li className="border -mr-px -mb-px">
    <Link
      href={`/people/${profile.slug}`}
      className={cn(
        'h-full flex p-4 items-center gap-4',
        display === 'grid' &&
          'md:items-stretch md:flex-col md:aspect-square md:justify-between md:p-8'
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
