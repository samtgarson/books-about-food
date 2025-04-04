import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { SlugProps } from 'src/components/types'
import { call } from 'src/utils/service'

export default async function EditLayout(
  props: SlugProps & { children: ReactNode }
) {
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
