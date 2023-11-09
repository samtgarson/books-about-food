import { fetchBooks } from 'core/services/books/fetch-books'
import { Metadata } from 'next'
import { BookFilters } from 'src/components/books/filters'
import { BookList, SkeletonBookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'

export const metadata: Metadata = {
  title: 'Cookbooks'
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: BookList,
  schema: fetchBooks.input,
  loading: SkeletonBookList,
  filters: BookFilters
})
