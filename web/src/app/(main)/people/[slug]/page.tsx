import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'
import { metadata } from './metadata'
import { ProfilePage } from './profile-page'

type ProfilePageProps = PageProps<{ slug: string }>

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export const generateMetadata = metadata('people')

export default function PeoplePage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="people" slug={slug} />
}

export async function generateStaticParams() {
  const { data } = await call(fetchProfiles, { onlyAuthors: false })

  return data?.profiles.map((profile) => ({ slug: profile.slug })) ?? []
}
