import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { MiniItem } from 'src/components/books/mini-item'
import { NewBookButton } from 'src/components/books/new-book-button'
import { GridContainer } from 'src/components/lists/grid-container'
import { PaginationButtons } from 'src/components/lists/pagination'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

export async function SubmissionsList({ page }: { page: number }) {
  const user = await getSessionUser()
  const perPage = 12
  const res = await call(fetchBooks, {
    page,
    submitterId: user?.id,
    status: ['draft', 'inReview', 'published'],
    perPage
  })
  if (!res.success) throw res.originalError

  const { books, filteredTotal, total } = res.data

  return (
    <>
      <GridContainer className="sm:auto-grid-xl!">
        {books.map((book) => (
          <li key={book.id}>
            <MiniItem book={book} />
          </li>
        ))}
      </GridContainer>
      <NewBookButton className="flex w-full items-center gap-4 self-start text-14" />
      <PaginationButtons
        page={page}
        total={total}
        perPage={perPage}
        filteredTotal={filteredTotal}
      />
    </>
  )
}
