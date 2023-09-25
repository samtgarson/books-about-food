import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
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

export default function EditLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
