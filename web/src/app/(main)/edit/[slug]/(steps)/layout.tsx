import { fetchBook } from 'core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { call } from 'src/utils/service'

type EditPageProps = {
  params: { slug: string }
}

export default async function EditLayout({
  children,
  params: { slug }
}: EditPageProps & { children: ReactNode }) {
  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return (
    <>
      <PageBackLink href={`/edit/${book.slug}`}>
        Back to Submission
      </PageBackLink>
      {children}
    </>
  )
}
