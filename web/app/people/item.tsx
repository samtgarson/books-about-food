import Link from 'next/link'
import { Avatar } from 'src/components/atoms/avatar'
import { Profile } from 'src/models/profile'

export type PeopleItemProps = {
  profile: Profile
}

export const PeopleItem = ({ profile }: PeopleItemProps) => (
  <li className="border aspect-square -mr-px -mb-px">
    <Link href={`/people/${profile.slug}`} className="h-full flex flex-col p-8">
      <Avatar profile={profile} />
      <p className="font-medium text-16 mb-1 mt-auto">{profile.name}</p>
      <p className="text-14">{profile.jobNames}</p>
    </Link>
  </li>
)
