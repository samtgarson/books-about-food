import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { BookFilters } from 'src/components/books/filters'
import { BookList, SkeletonBookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'

export const revalidate = 3600

export const generateMetadata = indexPageMetadata({
  title: 'Cookbooks',
  service: fetchBooks,
  path: '/cookbooks'
})

export default createIndexPage({
  content: BookList,
  schema: fetchBooks.input,
  loading: SkeletonBookList,
  filters: BookFilters
})
