import { Pagination } from 'src/components/lists/pagination'
import { fetchBooks, FetchBooksOptions } from 'src/services/books/fetch-books'
import { CookbookItem } from './item'

type CookbooksListProps = { currentPath: string; filters: FetchBooksOptions }

export const CookbooksList = async ({
  currentPath,
  filters: { page: pageParam, sort, tag, search }
}: CookbooksListProps) => {
  const page = Number(pageParam) || 0
  const { books, filteredTotal, total, perPage } = await fetchBooks({
    page,
    sort,
    tag,
    search
  })

  return (
    <>
      <ul className='flex flex-wrap gap-4'>
        {books.map((book) => (
          <CookbookItem key={book.id} book={book} />
        ))}
      </ul>
      {books.length === 0 && <p>No books found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={page}
        path={currentPath}
        filteredTotal={filteredTotal}
      />
    </>
  )
}
