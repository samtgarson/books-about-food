import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { fetchBook } from 'src/services/books/fetch-book'

type EditPageProps = {
  params: { slug: string }
}

export default async function EditLayout({
  children,
  params: { slug }
}: EditPageProps & { children: ReactNode }) {
  const { data: book } = await fetchBook.call({ slug })
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
