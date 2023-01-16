import Link from 'next/link'
import { Profile } from 'src/models/profile'

export type PeopleItemProps = {
  profile: Profile
}

export const PeopleItem = ({ profile }: PeopleItemProps) => (
  <li className="border aspect-square -mr-px -mb-px">
    <Link href={`/people/${profile.slug}`} className="h-full flex flex-col p-8">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-auto bg-white bg-opacity-50">
        {profile.initials}
      </div>
      <p className="font-medium text-16 mb-1 mt-auto">{profile.name}</p>
      <p className="text-14">{profile.jobNames}</p>
    </Link>
  </li>
)
