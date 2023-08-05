import { fetchProfiles } from 'src/services/profiles/fetch-profiles'

export * from 'app/default-static-config'

export const generateStaticParams = async () => {
  const { profiles } = await fetchProfiles.call({
    perPage: 80,
    onlyAuthors: true,
    sort: 'trending'
  })

  return profiles.map((profile) => ({
    slug: profile.slug
  }))
}

export { default } from 'app/(main)/people/[slug]/page'
