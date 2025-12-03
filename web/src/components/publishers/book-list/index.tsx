import { Publisher } from '@books-about-food/core/models/publisher'
import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { SkeletonBookList } from 'src/components/books/list'
import { GridContainer } from 'src/components/lists/grid-container'
import { ListContainer } from 'src/components/lists/list-container'
import { Wrap } from 'src/components/utils/wrap'
import { call } from 'src/utils/service'
import { PublisherBookListItem } from './item'

type PublisherBookListProps = {
  publisher: Publisher
  page?: number
}

export async function PublisherBookList({ publisher }: PublisherBookListProps) {
  const { data } = await call(fetchBooks, {
    publisherSlug: publisher.slug,
    perPage: 'all'
  })

  if (!data?.filteredTotal) return null
  const { books } = data
  return (
    <ListContainer title="All Releases">
      <GridContainer className="sm:gap-y-16">
        {books.map((book) => {
          return (
            <Wrap
              c={PublisherBookListItem}
              key={book.id}
              hidden={publisher.hiddenBooks.includes(book.id)}
              book={book}
            />
          )
        })}
      </GridContainer>
    </ListContainer>
  )
}

export function SkeletonPublisherBookList() {
  return (
    <ListContainer title="All Releases">
      <SkeletonBookList />
    </ListContainer>
  )
}
