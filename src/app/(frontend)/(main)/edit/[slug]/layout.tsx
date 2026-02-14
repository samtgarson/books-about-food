import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { Container } from 'src/components/atoms/container'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { call } from 'src/utils/service'

export async function generateMetadata(
  props: LayoutProps<'/edit/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params

  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return { title: `Editing ${book.title}` }
}

export default async function EditLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <Container belowNav centered>
      {children}
    </Container>
  )
}
