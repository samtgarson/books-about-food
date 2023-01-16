import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { LinkList } from 'src/components/atoms/link-list'
import { BookList } from 'src/components/books/list'
import { FetchProvider } from 'src/contexts/fetcher'
import { fetchBooks, FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchProfile } from 'src/services/profiles/fetch-profile'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetcherData } from 'src/utils/fetcher-helpers'

export const generateStaticParams = async () => {
  const { profiles } = await fetchProfiles.call({
    perPage: 0
  })

  return profiles.map((profile) => ({
    slug: profile.slug
  }))
}

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const bookFilters = { profile: slug, perPage: 8 } satisfies FetchBooksInput
  const [profile, books] = await Promise.all([
    fetchProfile.call({ slug }),
    fetchBooks.call(bookFilters)
  ])
  if (!profile) return notFound()

  return (
    <FetchProvider data-superjson data={[fetcherData('books', books)]}>
      <Container>
        <div className="flex mt-20">
          <div className="flex-grow">
            <h1 className="text-32 mb-8">{profile.name}</h1>
            <Detail>{profile.jobNames}</Detail>
            <Detail>
              <LinkList links={profile.links} />
            </Detail>
          </div>
        </div>
      </Container>
      <Container className="mt-20">
        {books.filteredTotal > 0 && (
          <>
            <h2 className="all-caps mb-8">Cookbook Portfolio</h2>
            <BookList
              showFilters={false}
              showEmpty={false}
              filters={bookFilters}
            />
          </>
        )}
      </Container>
    </FetchProvider>
  )
}
