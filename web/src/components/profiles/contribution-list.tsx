import { fetchBooks } from 'src/services/books/fetch-books'
import { GridContainer } from 'src/components/lists/grid-container'
import { ContributionVisibility } from './edit/contribution-visibility'
import { Profile } from 'src/models/profile'
import { fetchContributions } from 'src/services/profiles/fetch-contributions'

export type ContributionListProps = {
  profile: Profile
}

export const ContributionList = async ({ profile }: ContributionListProps) => {
  const [{ books, filteredTotal }, contributions] = await Promise.all([
    fetchBooks.call({
      profile: profile.slug,
      perPage: 0
    }),
    fetchContributions.call({ profileId: profile.id })
  ])

  if (filteredTotal === 0) return null
  return (
    <GridContainer className={'sm:gap-y-16'}>
      {books.map((book) => (
        <ContributionVisibility
          key={book.id}
          book={book}
          data-superjson
          hidden={!!contributions.find((c) => c.bookId === book.id)?.hidden}
        />
      ))}
    </GridContainer>
  )
}
