import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'

export type AuthorItemProps = {
  profile: Profile
}

export const AuthorItem = ({ profile }: AuthorItemProps) => (
  <li>
    <Link
      href={`/authors/${profile.slug}`}
      className="flex flex-col text-center gap-6 h-full"
    >
      <Avatar profile={profile} size="fill" className="border border-black" />
      <p className="font-medium mt-auto">{profile.name}</p>
    </Link>
  </li>
)
