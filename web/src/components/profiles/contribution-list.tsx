import { fetchBooks } from 'src/services/books/fetch-books'
import { GridContainer } from 'src/components/lists/grid-container'
import { Item } from 'src/components/books/item'
import { ContributionVisibility } from './edit/contribution-visibility'
import { Profile } from 'src/models/profile'

export type ContributionListProps = {
  profile: Profile
}

export const ContributionList = async ({ profile }: ContributionListProps) => {
  const { books, filteredTotal } = await fetchBooks.call({
    profile: profile.slug,
    perPage: 0
  })

  if (filteredTotal === 0) return null
  return (
    <GridContainer className={'sm:gap-y-16'}>
      {books.map((book) => (
        <ContributionVisibility key={book.id} bookId={book.id}>
          <Item key={book.id} book={book} />
        </ContributionVisibility>
      ))}
    </GridContainer>
  )
}
