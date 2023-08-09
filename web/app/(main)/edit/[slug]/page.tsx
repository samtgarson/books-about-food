import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Steps } from 'src/components/edit/steps'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'
import { callWithUser } from 'src/utils/call-with-user'

export default async function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const book = await callWithUser(fetchBook, { slug })
  const currentUser = await getUser.call()

  if (!book) notFound()
  if (currentUser?.id !== book.submitterId || currentUser?.role !== 'admin')
    notFound()

  return (
    <Container belowNav>
      <PageTitle>{`Editing: ${book.title}`}</PageTitle>
      <Steps book={book} />
    </Container>
  )
}
