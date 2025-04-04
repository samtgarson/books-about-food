import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { UploadForm } from 'src/components/edit/books/forms/images'
import { slugPage } from 'src/components/types'
import { call } from 'src/utils/service'

export default slugPage(async (slug) => {
  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return <UploadForm book={book} />
})
