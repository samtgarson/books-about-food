import { fetchSimilarBooks } from '@books-about-food/core/services/books/fetch-similar-books'
import cn from 'classnames'
import { call } from 'src/utils/service'
import { AntiContainer } from '../atoms/container'
import { GridContainer } from '../lists/grid-container'
import { ListContainer } from '../lists/list-context'
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
      <AntiContainer
        className={cn(
          'hidden border-t border-black sm:block sm:border-t-0',
          className
        )}
      >
        <Wrap
          c={ItemCarousel}
          title="Similar Cookbooks"
          items={books}
          size="lg"
          carouselClassName="pr-px"
          mobileColorful
          key="similar-books"
          rightPadding
        />
      </AntiContainer>
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
