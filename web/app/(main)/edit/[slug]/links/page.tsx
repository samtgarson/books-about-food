import { Container } from 'src/components/atoms/container'
import { EditLinksForm } from 'src/components/edit/forms/links'
import { fetchBook } from 'src/services/books/fetch-book'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug })

  return (
    <Container belowNav centered>
      <EditLinksForm book={book} />
    </Container>
  )
}
