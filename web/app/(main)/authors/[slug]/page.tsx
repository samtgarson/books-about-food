// import { fetchProfiles } from 'src/services/profiles/fetch-profiles'

import { createProfilePage } from 'src/components/pages/profile-page'

export * from 'app/default-static-config'

// export const generateStaticParams = async () => {
//   const { profiles } = await fetchProfiles.call({
//     perPage: 0,
//     onlyAuthors: true,
//     sort: 'trending'
//   })
//
//   return profiles.map((profile) => ({
//     slug: profile.slug
//   }))
// }

export default createProfilePage('authors')
