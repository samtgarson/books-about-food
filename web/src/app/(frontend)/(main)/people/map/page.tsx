import { Metadata } from 'next'
import { ProfilesMap } from 'src/components/maps/profiles-map'

export const metadata: Metadata = {
  title: 'People Map'
}

export default function PeopleMapPage() {
  return <ProfilesMap className="mt-16 h-[calc(100vh-64px)] w-full" />
}
