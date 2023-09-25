import cn from 'classnames'
import { GridContainer } from 'src/components/lists/grid-container'
import { Profile } from 'src/models/profile'
import { fetchBooks } from 'src/services/books/fetch-books'
import { AntiContainer, Container } from '../atoms/container'
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
    <AntiContainer
      desktop={false}
      className={cn('border-t border-black sm:border-t-0', className)}
    >
      <Container desktop={false}>
        <h3 className="my-4 sm:mb-8 sm:mt-0 ">Cookbook Portfolio</h3>
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
      </Container>
    </AntiContainer>
  )
}
