import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchBooks } from 'src/services/books/fetch-books'

export const generateStaticParams = async () => {
  const { books } = await fetchBooks({ perPage: 0 })

  return books.map((book) => ({
    slug: book.slug
  }))
}

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook(slug)
  if (!book) return notFound()

  return (
    <div>
      {book.cover && (
        <Image
          alt={book.cover.caption}
          src={book.cover.src}
          width={book.cover.widthFor(200)}
          height={200}
        />
      )}
      <h1>{book.title}</h1>
    </div>
  )
}
