import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { EditTeamForm } from 'src/components/edit/books/forms/team'
import { call } from 'src/utils/service'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return <EditTeamForm book={book} />
}
