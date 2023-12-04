import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StatusTag } from 'src/components/books/status-tag'
import { GridContainer } from 'src/components/lists/grid-container'
import { Pagination } from 'src/components/lists/pagination'
import { PageProps } from 'src/components/types'
import { call, getUser } from 'src/utils/service'

export const metadata: Metadata = {
  title: 'Submissions'
}

export * from 'app/default-static-config'

const Page = async ({ searchParams }: PageProps) => {
  const user = await getUser()
  const page = Number(searchParams.page ?? 0)
  const res = await call(fetchBooks, {
    page,
    submitterId: user?.id,
    status: ['draft', 'inReview', 'published']
  })
  if (!res.success) return notFound()
  const { books, filteredTotal, total, perPage } = res.data
  return (
    <Pagination
      page={page}
      total={total}
      perPage={perPage}
      filteredTotal={filteredTotal}
    >
      <GridContainer className="sm:auto-grid-2xl">
        {books.map((book) => (
          <li key={book.id}>
            <Link
              href={`/edit/${book.slug}`}
              className="p-4 border border-black flex gap-4 -mb-px sm:-mr-px items-center"
            >
              {book.cover ? (
                <Image {...book.cover.imageAttrs(50)} />
              ) : (
                <div className="w-9 h-[50px] bg-khaki"></div>
              )}
              <div className="flex flex-col overflow-hidden">
                <p className="font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                  {book.title}
                </p>
                <p className="text-12 whitespace-nowrap text-ellipsis overflow-hidden">
                  {book.authorNames}
                </p>
              </div>
              <StatusTag className="ml-auto !text-10" status={book.status} />
            </Link>
          </li>
        ))}
      </GridContainer>
    </Pagination>
  )
}

export default Page
