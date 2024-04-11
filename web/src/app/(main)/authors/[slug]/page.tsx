import { fetchFeaturedProfiles } from '@books-about-food/core/services/home/fetch'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { metadata } from 'app/(main)/people/[slug]/metadata'
import { ProfilePage } from 'app/(main)/people/[slug]/profile-page'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'

type ProfilePageProps = PageProps<{ slug: string }>

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export const generateMetadata = metadata('people')
export default function AuthorsPage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="authors" slug={slug} />
}

export async function generateStaticParams() {
  const { data } = await call(fetchProfiles, { onlyAuthors: true })
  const featured = await fetchFeaturedProfiles()

  return [...(data?.profiles ?? []), ...featured].map((profile) => ({
    slug: profile.slug
  }))
}
