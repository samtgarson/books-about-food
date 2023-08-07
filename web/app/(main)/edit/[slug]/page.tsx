import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Steps } from 'src/components/edit/steps'
import { fetchBook } from 'src/services/books/fetch-book'
import { callWithUser } from 'src/utils/call-with-user'

export default async function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const book = await callWithUser(fetchBook, { slug })

  return (
    <Container belowNav>
      <PageTitle>{`Editing: ${book.title}`}</PageTitle>
      <Steps book={book} />
    </Container>
  )
}
