import { fetchBook } from 'core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { EditTeamForm } from 'src/components/edit/forms/team'
import { call } from 'src/utils/service'

export * from 'app/default-static-config'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await call(fetchBook, { slug, cache: false })
  if (!book) notFound()

  return <EditTeamForm book={book} />
}
