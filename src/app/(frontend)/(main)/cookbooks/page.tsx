import { ComponentProps } from 'react'
import { BookFilters } from 'src/components/books/filters'
import { BookList, SkeletonBookList } from 'src/components/books/list'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { fetchBooks } from 'src/core/services/books/fetch-books'

export const revalidate = 3600

export const generateMetadata = indexPageMetadata({
  title: 'Cookbooks',
  service: fetchBooks,
  collection: 'curated cookbooks',
  path: '/cookbooks'
})

export default createIndexPage({
  components: {
    content: (props: ComponentProps<typeof BookList>) => (
      <BookList {...props} showCollection />
    ),
    loading: SkeletonBookList,
    filters: BookFilters
  },
  schema: fetchBooks.input,
  config: {
    wrapInListContext: true
  }
})
