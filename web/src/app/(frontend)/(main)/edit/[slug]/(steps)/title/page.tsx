import { notFound } from 'next/navigation'
import { EditTitleForm } from 'src/components/edit/books/forms/title'
import { slugPage } from 'src/components/types'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export default slugPage<'/edit/[slug]/title'>(
  async function TitleEditPage(slug) {
    const { data: book } = await call(fetchBook, { slug })
    if (!book) notFound()

    return <EditTitleForm book={book} />
  }
)
