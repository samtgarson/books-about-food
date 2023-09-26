import { GridContainer } from 'src/components/lists/grid-container'
import { Profile } from 'src/models/profile'
import { fetchBooks } from 'src/services/books/fetch-books'
import { ListContainer } from '../lists/list-context'
import { ContributionVisibility } from './edit/contribution-visibility'

export type ContributionListProps = {
  profile: Profile
  className?: string
}

export const ContributionList = async ({
  profile,
  className
}: ContributionListProps) => {
  const { data } = await fetchBooks.call({
    profile: profile.slug,
    perPage: 0
  })
  if (!data) return null
  const { books, filteredTotal } = data

  if (filteredTotal === 0) return null
  return (
    <ListContainer title="Cookbook Portfolio" className={className}>
      <GridContainer className={'sm:gap-y-16'}>
        {books.map((book) => (
          <ContributionVisibility
            key={book.id}
            book={book}
            data-superjson
            hidden={
              !!book.contributions.find((c) => c.profile.id === profile.id)
                ?.hidden
            }
          />
        ))}
      </GridContainer>
    </ListContainer>
  )
}
