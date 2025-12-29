import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { slugPage } from 'src/components/types'
import { call } from 'src/utils/service'
import { metadata } from './metadata'
import { ProfilePage } from './profile-page'

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

export const generateMetadata = metadata('people')

export default slugPage<'/people/[slug]'>(async function PeoplePage(slug) {
  return <ProfilePage segment="people" slug={slug} />
})

export async function generateStaticParams() {
  const { data } = await call(fetchProfiles, {})

  return data?.profiles.map((profile) => ({ slug: profile.slug })) ?? []
}
