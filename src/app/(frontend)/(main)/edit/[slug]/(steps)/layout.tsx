import { notFound } from 'next/navigation'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export default async function EditLayout(props: LayoutProps<'/edit/[slug]'>) {
  const { children, params } = props
  const { slug } = await params

  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return (
    <>
      <PageBackLink href={`/edit/${book.slug}`} back>
        Back to Submission
      </PageBackLink>
      {children}
    </>
  )
}
