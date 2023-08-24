import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Avatar } from 'src/components/atoms/avatar'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { LinkList } from 'src/components/atoms/link-list'
import { Loader } from 'src/components/atoms/loader'
import { BookList } from 'src/components/books/list'
import { FavouriteButton } from 'src/components/favourites/favourite-button'
import { ClaimProfileButton } from 'src/components/profiles/claim-button'
import { EditProfileProvider } from 'src/components/profiles/edit/context'
import { Field } from 'src/components/profiles/edit/field'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { ProfileOverflow } from 'src/components/profiles/profile-overflow'
import { PageProps } from 'src/components/types'
import { fetchBooks, FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchFrequentCollaborators } from 'src/services/books/fetch-frequent-collaborators'
import { fetchProfile } from 'src/services/profiles/fetch-profile'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'

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
    const bookFilters = { profile: slug, perPage: 8 } satisfies FetchBooksInput
    const [profile, books, collaborators] = await Promise.all([
      fetchProfile.call({ slug }),
      fetchBooks.call(bookFilters),
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
                {profile.description && (
                  <Field
                    attr="description"
                    className="text-16 mt-4 max-w-prose"
                  />
                )}
                <div className="mt-8">
                  <Detail maxWidth>
                    <Field attr="jobTitle" />
                  </Detail>
                  {profile.links.length > 0 && (
                    <Detail maxWidth>
                      <LinkList links={profile.links} />
                    </Detail>
                  )}
                </div>
              </div>
              <div className="order-first lg:order-last flex lg:flex-col flex-shrink-0 items-start lg:items-end gap-5 justify-between">
                <Avatar profile={profile} size="xl" mobileSize="md" />
                <div className="flex gap-2 items-center">
                  <ClaimProfileButton
                    data-superjson
                    profile={profile}
                    className="hidden sm:flex"
                  />
                  <FavouriteButton profileId={profile.id} />
                  <ProfileOverflow profile={profile} data-superjson />
                </div>
              </div>
            </div>
            {collaborators.length > 0 && (
              <ProfileListSection
                data-superjson
                profiles={collaborators}
                title="Frequent collaborators"
                className="mt-4 sm:mt-20"
              />
            )}
          </div>
          <div className="mt-8 sm:mt-20 border-t border-black sm:border-t-0">
            {books.filteredTotal > 0 && (
              <>
                <h2 className="all-caps my-4 sm:mt-0 sm:mb-8 ">
                  Cookbook Portfolio
                </h2>
                <Suspense fallback={<Loader />}>
                  <BookList showEmpty={false} filters={bookFilters} />
                </Suspense>
              </>
            )}
          </div>
        </Container>
      </EditProfileProvider>
    )
  }

export default createProfilePage('people')
