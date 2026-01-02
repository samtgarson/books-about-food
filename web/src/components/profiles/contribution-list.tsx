import { GridContainer } from 'src/components/lists/grid-container'
import { Profile } from 'src/core/models/profile'
import { fetchBooks } from 'src/core/services/books/fetch-books'
import { call } from 'src/utils/service'
import { ListContainer } from '../lists/list-container'
import { Wrap } from '../utils/wrap'
import { ContributionVisibility } from './edit/contribution-visibility'

export type ContributionListProps = {
  profile: Profile
  className?: string
}

export async function ContributionList({
  profile,
  className
}: ContributionListProps) {
  const { data } = await call(fetchBooks, {
    profile: profile.slug,
    perPage: 'all'
  })
  if (!data) return null
  const { books, filteredTotal } = data

  if (filteredTotal === 0) return null
  return (
    <ListContainer title="Cookbook Portfolio" className={className}>
      <GridContainer className="sm:gap-y-16">
        {books.map((book) => {
          const found = book.contributions.find(
            (c) => c.profile.id === profile.id
          )
          return (
            <Wrap
              c={ContributionVisibility}
              key={book.id}
              book={book}
              hidden={!!found?.hidden}
            />
          )
        })}
      </GridContainer>
    </ListContainer>
  )
}
