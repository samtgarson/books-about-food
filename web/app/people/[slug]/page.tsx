import { notFound } from 'next/navigation'
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
      <Container className="mt-20" key="header">
        <div className="flex md:items-end flex-col md:flex-row relative">
          <div className="flex-grow">
            <h1 className="text-32 mb-8">{profile.name}</h1>
            <Detail>{profile.jobNames}</Detail>
            {profile.links.length > 0 && (
              <Detail>
                <LinkList links={profile.links} />
              </Detail>
            )}
          </div>
          <div className="pb-2 absolute md:relative top-0 right-0">
            <FavouriteButton profileId={profile.id} />
          </div>
        </div>
        {collaborators.length > 0 && (
          <ProfileListSection
            data-superjson
            profiles={collaborators}
            title="Frequent collaborators"
          />
        )}
      </Container>
      <Container className="mt-20" key="books">
        {books.filteredTotal > 0 && (
          <>
            <h2 className="all-caps mb-8">Cookbook Portfolio</h2>
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
