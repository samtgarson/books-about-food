import { Profile } from 'core/models/profile'
import { fetchBooks } from 'core/services/books/fetch-books'
import { GridContainer } from 'src/components/lists/grid-container'
import { call } from 'src/utils/service'
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
  const { data } = await call(fetchBooks, {
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
