import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { EditLinksForm } from 'src/components/edit/forms/links'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await fetchBook.call({ slug, cache: false })
  if (!book) notFound()

  return (
    <Container belowNav centered>
      <EditLinksForm book={book} />
    </Container>
  )
}
