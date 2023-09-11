import { Container } from 'src/components/atoms/container'
import { EditTeamForm } from 'src/components/edit/forms/team'
import { fetchBook } from 'src/services/books/fetch-book'

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug, cache: false })

  return (
    <Container belowNav centered>
      <EditTeamForm book={book} />
    </Container>
  )
}
