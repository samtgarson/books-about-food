import { Container } from 'src/components/atoms/container'
import { EditTitleForm } from 'src/components/edit/forms/title'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug, cache: false })

  return (
    <Container belowNav centered>
      <EditTitleForm book={book} />
    </Container>
  )
}
