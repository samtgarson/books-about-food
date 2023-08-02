import { Container } from 'src/components/atoms/container'
import { EditLinksForm } from 'src/components/edit/forms/links'
import { fetchBook } from 'src/services/books/fetch-book'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug })

  return (
    <Container belowNav centered>
      {/* @ts-expect-error RSC */}
      <EditLinksForm book={book} />
    </Container>
  )
}
