import { redirect } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Steps } from 'src/components/edit/steps'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'

export default async function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  const book = await fetchBook.call({ slug })

  return (
    <Container belowNav>
      <PageTitle>Submit a Cookbook</PageTitle>
      <Steps book={book} />
    </Container>
  )
}
