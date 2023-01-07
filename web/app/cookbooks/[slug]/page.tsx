import prisma from 'database'
import { notFound } from 'next/navigation'
import { fetchBooks } from 'src/services/books/fetch'

export const generateStaticParams = async () => {
  const { books } = await fetchBooks({ perPage: Number.POSITIVE_INFINITY })

  return books.map((book) => ({
    slug: book.slug
  }))
}

const fetchBook = async (slug: string) =>
  prisma.book.findUnique({
    where: { slug },
    include: {
      publisher: true,
      tags: true,
      contributions: { include: { profile: true } }
    }
  })

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook(slug)
  if (!book) return notFound()

  return <div>{book.title}</div>
}
