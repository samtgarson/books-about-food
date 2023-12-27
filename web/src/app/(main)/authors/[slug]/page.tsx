import { metadata } from 'app/(main)/people/[slug]/metadata'
import { ProfilePage } from 'app/(main)/people/[slug]/profile-page'
import { PageProps } from 'src/components/types'

type ProfilePageProps = PageProps<{ slug: string }>

export * from 'app/default-static-config'

export const generateMetadata = metadata('people')
export default function PeoplePage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="authors" slug={slug} />
}
