import { fetchBooks } from 'src/services/books/fetch-books'
import { GridContainer } from 'src/components/lists/grid-container'
import { ContributionVisibility } from './edit/contribution-visibility'
import { Profile } from 'src/models/profile'
import { fetchContributions } from 'src/services/profiles/fetch-contributions'
import { AntiContainer, Container } from '../atoms/container'
import cn from 'classnames'

export type ContributionListProps = {
  profile: Profile
  className?: string
}

export const ContributionList = async ({
  profile,
  className
}: ContributionListProps) => {
  const [{ books, filteredTotal }, contributions] = await Promise.all([
    fetchBooks.call({
      profile: profile.slug,
      perPage: 0
    }),
    fetchContributions.call({ profileId: profile.id })
  ])

  if (filteredTotal === 0) return null
  return (
    <AntiContainer
      desktop={false}
      className={cn('border-t border-black sm:border-t-0', className)}
    >
      <Container desktop={false}>
        <h2 className="all-caps my-4 sm:mt-0 sm:mb-8 ">Cookbook Portfolio</h2>
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
      </Container>
    </AntiContainer>
  )
}
