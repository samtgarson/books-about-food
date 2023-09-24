import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'
import cn from 'classnames'

export type AuthorItemProps = {
  profile?: Profile
  index?: number
  className?: string
  bordered?: boolean
}

export const AuthorItem = ({
  profile,
  index = 0,
  className,
  bordered = true
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
      <Avatar
        profile={profile}
        size="fill"
        className={cn(
          bordered && ['border', profile ? 'border-black' : 'border-khaki']
        )}
      />
      {profile ? (
        <p className="mt-auto font-medium">{profile.name}</p>
      ) : (
        <p className="bg-khaki w-30 h-4" />
      )}
    </Link>
  </li>
)
