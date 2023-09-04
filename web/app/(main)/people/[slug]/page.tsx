import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Loader } from 'src/components/atoms/loader'
import { FavouriteButton } from 'src/components/favourites/favourite-button'
import { ClaimProfileButton } from 'src/components/profiles/claim-button'
import { ContributionList } from 'src/components/profiles/contribution-list'
import { EditProfileProvider } from 'src/components/profiles/edit/context'
import { EditableAvatar } from 'src/components/profiles/edit/editable-avatar'
import { Field } from 'src/components/profiles/edit/field'
import { FrequentCollaborators } from 'src/components/profiles/edit/frequent-collaborators'
import { LinkList } from 'src/components/profiles/link-list'
import { ProfileOverflow } from 'src/components/profiles/profile-overflow'
import { PageProps } from 'src/components/types'
import { fetchFrequentCollaborators } from 'src/services/books/fetch-frequent-collaborators'
import { fetchProfile } from 'src/services/profiles/fetch-profile'

// export * from 'app/default-static-config'
// export const dynamic = 'force-dynamic'

// export const generateStaticParams = async () => {
//   const { profiles } = await fetchProfiles.call({
//     perPage: 0,
//     onlyAuthors: false
//   })
//
//   return profiles.map((profile) => ({
//     slug: profile.slug
//   }))
// }

export const createProfilePage = (segment: 'authors' | 'people') =>
  async function ProfilePage({
    params: { slug }
  }: PageProps<{ slug: string }>) {
    const [profile, collaborators] = await Promise.all([
      fetchProfile.call({ slug }),
      fetchFrequentCollaborators.call({ slug })
    ])
    if (!profile) return notFound()

    return (
      <EditProfileProvider profile={profile} segment={segment} data-superjson>
        <Container belowNav id="container">
          <div className="pt-8 md:pt-20">
            <div className="flex items-stretch lg:items-start flex-col lg:flex-row relative gap-6">
              <div className="flex-grow w-full">
                <Field
                  as="h1"
                  attr="name"
                  className="font-style-title items-center mr-auto"
                />
                <ClaimProfileButton
                  data-superjson
                  profile={profile}
                  className="sm:hidden mb-10 mt-6 w-full"
                />
                <Field
                  attr="description"
                  className="text-16 mt-4 max-w-prose"
                  placeholder="Add a description"
                />
                <div className="mt-8">
                  <Field attr="jobTitle" detail />
                  <LinkList />
                  <Field attr="location" placeholder="Add a location" detail />
                </div>
              </div>
              <div className="order-first lg:order-last flex lg:flex-col flex-shrink-0 items-start lg:items-end gap-5 justify-between">
                <EditableAvatar />
                <div className="flex gap-2 items-center">
                  <FavouriteButton profileId={profile.id} />
                  <ClaimProfileButton
                    data-superjson
                    profile={profile}
                    className="hidden sm:flex"
                  />
                  <ProfileOverflow profile={profile} data-superjson />
                </div>
              </div>
            </div>
            <FrequentCollaborators
              data-superjson
              profiles={collaborators}
              className="mt-4 sm:mt-20"
            />
          </div>
          <Suspense fallback={<Loader />}>
            <ContributionList profile={profile} className="mt-8 sm:mt-20" />
          </Suspense>
        </Container>
      </EditProfileProvider>
    )
  }

export default createProfilePage('people')
