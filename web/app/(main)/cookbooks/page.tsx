import { BookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'
import { fetchBooks } from 'src/services/books/fetch-books'
import Loading from './loading'
export * from 'app/default-static-config'

export default createIndexPage({
  content: BookList,
  svc: fetchBooks,
  loading: <Loading />
})
