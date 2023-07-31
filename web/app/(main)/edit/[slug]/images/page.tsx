import { Container } from 'src/components/atoms/container'
import { UploadForm } from 'src/components/edit/forms/images'
import { fetchBook } from 'src/services/books/fetch-book'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug })

  return (
    <Container belowNav centered>
      {/* @ts-expect-error RSC */}
      <UploadForm book={book} />
    </Container>
  )
}
