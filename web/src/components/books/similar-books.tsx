import { fetchSimilarBooks } from '@books-about-food/core/services/books/fetch-similar-books'
import cn from 'classnames'
import { call } from 'src/utils/service'
import { GridContainer } from '../lists/grid-container'
import { ListContainer } from '../lists/list-container'
import { Wrap } from '../utils/wrap'
import { Item } from './item'
import { ItemCarousel } from './item-carousel'

export type SimilarBooksProps = {
  slug: string
  className?: string
}

export const SimilarBooks = async ({ slug, className }: SimilarBooksProps) => {
  const { data: books } = await call(fetchSimilarBooks, { slug })

  if (!books?.length) return null
  return (
    <>
      <Wrap
        c={ItemCarousel}
        title="Similar Cookbooks"
        items={books}
        size="lg"
        carouselClassName="pr-px"
        className={cn(
          'hidden border-t border-black sm:block sm:border-t-0',
          className
        )}
        mobileColorful
        key="similar-books"
        inContainer
      />
      <ListContainer title="Similar Cookbooks" className="sm:hidden">
        <GridContainer>
          {books.map((book) => (
            <Wrap
              c={Item}
              key={book.id.toString()}
              book={book}
              mobileColorful
            />
          ))}
        </GridContainer>
      </ListContainer>
    </>
  )
}
