import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'

export type AuthorItemProps = {
  profile?: Profile
  index?: number
  className?: string
}

export const AuthorItem = ({
  profile,
  index = 0,
  className
}: AuthorItemProps) => (
  <li>
    <Link
      href={profile ? `/authors/${profile?.slug}` : '#'}
      className={cn(
        'flex h-full flex-col gap-6 text-center',
        !profile && 'pointer-events-none animate-pulse',
        className
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Avatar profile={profile} size="3xl" fill />
      {profile ? (
        <p className="mt-auto font-medium">{profile.name}</p>
      ) : (
        <p className="w-30 h-4 bg-khaki" />
      )}
    </Link>
  </li>
)
