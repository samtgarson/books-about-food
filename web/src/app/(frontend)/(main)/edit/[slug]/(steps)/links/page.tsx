import { notFound } from 'next/navigation'
import { EditLinksForm } from 'src/components/edit/books/forms/links'
import { slugPage } from 'src/components/types'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export default slugPage<'/edit/[slug]/links'>(
  async function LinksEditPage(slug) {
    const { data: book } = await call(fetchBook, { slug })
    if (!book) notFound()

    return <EditLinksForm book={book} />
  }
)
