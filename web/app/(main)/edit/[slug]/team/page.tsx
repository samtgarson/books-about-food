import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { EditTeamForm } from 'src/components/edit/forms/team'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: book } = await fetchBook.call({ slug, cache: false })
  if (!book) notFound()

  return (
    <Container belowNav centered>
      <EditTeamForm book={book} />
    </Container>
  )
}
