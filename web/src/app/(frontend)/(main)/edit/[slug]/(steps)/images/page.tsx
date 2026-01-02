import { notFound } from 'next/navigation'
import { UploadForm } from 'src/components/edit/books/forms/images'
import { slugPage } from 'src/components/types'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export default slugPage<'/edit/[slug]/images'>(
  async function ImagesEditPage(slug) {
    const { data: book } = await call(fetchBook, { slug })
    if (!book) notFound()

    return <UploadForm book={book} />
  }
)
