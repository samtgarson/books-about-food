import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { EditLinksForm } from 'src/components/edit/books/forms/links'
import { slugPage } from 'src/components/types'
import { call } from 'src/utils/service'

export default slugPage<'/edit/[slug]/links'>(
  async function LinksEditPage(slug) {
    const { data: book } = await call(fetchBook, { slug })
    if (!book) notFound()

    return <EditLinksForm book={book} />
  }
)
