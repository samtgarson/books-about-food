import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { UploadForm } from 'src/components/edit/forms/images'
import { call } from 'src/utils/service'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await call(fetchBook, { slug, cache: false })
  if (!book) notFound()

  return <UploadForm book={book} />
}
