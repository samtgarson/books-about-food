import { Profile } from 'database'
import Link from 'next/link'

export type AuthorItemProps = {
  profile: Profile
}

export const AuthorItem = ({ profile }: AuthorItemProps) => (
  <li>
    <Link href={`/people/${profile.slug}`}>
      <p>{profile.name}</p>
    </Link>
  </li>
)
