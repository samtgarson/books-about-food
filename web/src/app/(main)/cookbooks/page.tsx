import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { BookFilters } from 'src/components/books/filters'
import { BookList, SkeletonBookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'

export const revalidate = 3600

export const generateMetadata = indexPageMetadata({
  title: 'Cookbooks',
  service: fetchBooks,
  collection: 'curated cookbooks',
  path: '/cookbooks'
})

export default createIndexPage({
  components: {
    content: BookList,
    loading: SkeletonBookList,
    filters: BookFilters
  },
  schema: fetchBooks.input,
  config: {
    wrapInListContext: true
  }
})
