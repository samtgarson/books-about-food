import { BookList, SkeletonBookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'
import { fetchBooks } from 'src/services/books/fetch-books'
import { BookFilters } from 'src/components/books/filters'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookbooks'
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: BookList,
  svc: fetchBooks,
  loading: SkeletonBookList,
  filters: BookFilters
})
