import cn from 'classnames'
import { fetchSimilarBooks } from 'src/services/books/fetch-similar-books'
import { AntiContainer } from '../atoms/container'
import { ItemCarousel } from './item-carousel'

export type SimilarBooksProps = {
  slug: string
  className?: string
}

export const SimilarBooks = async ({ slug, className }: SimilarBooksProps) => {
  const { data: books } = await fetchSimilarBooks.call({ slug })

  if (!books?.length) return null
  return (
    <AntiContainer
      className={cn('border-t border-black sm:border-t-0', className)}
    >
      <ItemCarousel
        title="Similar Cookbooks"
        items={books}
        size="lg"
        data-superjson
        carouselClassName="pr-px"
      />
    </AntiContainer>
  )
}
