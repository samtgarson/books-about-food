import { notFound } from 'next/navigation'
import { MoreHorizontal } from 'react-feather'
import { Avatar } from 'src/components/atoms/avatar'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { LinkList } from 'src/components/atoms/link-list'
import { BookList } from 'src/components/books/list'
import { FavouriteButton } from 'src/components/favourites/favourite-button'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { fetchBooks, FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchFrequentCollaborators } from 'src/services/books/fetch-frequent-collaborators'
import { fetchProfile } from 'src/services/profiles/fetch-profile'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'

export * from 'app/default-static-config'

export const generateStaticParams = async () => {
  const { profiles } = await fetchProfiles.call({
    perPage: 0,
    onlyAuthors: false
  })

  return profiles.map((profile) => ({
    slug: profile.slug
  }))
}

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const bookFilters = { profile: slug, perPage: 8 } satisfies FetchBooksInput
  const [profile, books, collaborators] = await Promise.all([
    fetchProfile.call({ slug }),
    fetchBooks.call(bookFilters),
    fetchFrequentCollaborators.call({ slug })
  ])
  if (!profile) return notFound()

  return (
    <>
      <Container className="pt-8 md:pt-20" key="header" belowNav>
        <div className="flex items-stretch md:items-start flex-col md:flex-row relative gap-6">
          <div className="flex-grow w-full">
            <h1 className="font-style-title flex items-center">
              {profile.name}
            </h1>
            {profile.description && (
              <p className="text-16 mt-4 max-w-prose">{profile.description}</p>
            )}
            <div className="mt-8">
              <Detail maxWidth>{profile.jobNames}</Detail>
              {profile.links.length > 0 && (
                <Detail maxWidth>
                  <LinkList links={profile.links} />
                </Detail>
              )}
            </div>
          </div>
          <div className="order-first md:order-last flex md:flex-col flex-shrink-0 items-start md:items-end gap-5 justify-between">
            <Avatar profile={profile} size="xl" mobileSize="md" />
            <div className="flex gap-2 items-center">
              <FavouriteButton profileId={profile.id} />
              <MoreHorizontal strokeWidth={1} />
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
      </Container>
      <Container
        className="mt-8 sm:mt-20 border-t border-black sm:border-t-0"
        key="books"
      >
        {books.filteredTotal > 0 && (
          <>
            <h2 className="all-caps my-4 sm:mt-0 sm:mb-8 ">
              Cookbook Portfolio
            </h2>
            <BookList
              showFilters={false}
              showEmpty={false}
              filters={bookFilters}
              fallback={books}
              data-superjson
            />
          </>
        )}
      </Container>
    </>
  )
}