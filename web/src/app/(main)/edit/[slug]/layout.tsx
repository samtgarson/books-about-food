import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { Container } from 'src/components/atoms/container'
import { fetchBook } from 'src/services/books/fetch-book'

type EditPageProps = {
  params: { slug: string }
}

export async function generateMetadata({
  params: { slug }
}: EditPageProps): Promise<Metadata> {
  const { data: book } = await fetchBook.call({ slug })
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
