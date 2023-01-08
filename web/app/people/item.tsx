import { Profile } from 'database'
import Link from 'next/link'

export type PeopleItemProps = {
  profile: Profile
}

export const PeopleItem = ({ profile }: PeopleItemProps) => (
  <li>
    <Link href={`/people/${profile.slug}`}>
      <p>{profile.name}</p>
    </Link>
  </li>
)
