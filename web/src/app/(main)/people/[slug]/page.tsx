import { PageProps } from 'src/components/types'
import { metadata } from './metadata'
import { ProfilePage } from './profile-page'

type ProfilePageProps = PageProps<{ slug: string }>

export * from 'app/default-static-config'

export const generateMetadata = metadata('people')

export default function PeoplePage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="people" slug={slug} />
}
