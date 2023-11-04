import { notFound } from 'next/navigation'
import { UploadForm } from 'src/components/edit/forms/images'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await fetchBook.call({ slug, cache: false })
  if (!book) notFound()

  return <UploadForm book={book} />
}
