import { notFound } from 'next/navigation'
import { EditPublisherForm } from 'src/components/edit/books/forms/publisher'
import { slugPage } from 'src/components/types'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export default slugPage<'/edit/[slug]/publisher'>(
  async function PublisherEditPage(slug) {
    const { data: book } = await call(fetchBook, { slug })
    if (!book) notFound()

    return <EditPublisherForm book={book} />
  }
)
