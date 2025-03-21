import { fetchFeaturedProfiles } from '@books-about-food/core/services/home/fetch'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { metadata } from 'app/(main)/people/[slug]/metadata'
import { ProfilePage } from 'app/(main)/people/[slug]/profile-page'
import { slugPage } from 'src/components/types'
import { call } from 'src/utils/service'

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export const generateMetadata = metadata('people')
export default slugPage(async function AuthorsPage(slug) {
  return <ProfilePage segment="authors" slug={slug} />
})

export async function generateStaticParams() {
  const [{ data }, featured] = await Promise.all([
    call(fetchProfiles, { onlyAuthors: true }, { bypassCache: true }),
    fetchFeaturedProfiles()
  ])

  return [...(data?.profiles ?? []), ...featured].map((profile) => ({
    slug: profile.slug
  }))
}
