import { notFound } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { StatusTag } from 'src/components/books/status-tag'
import { EditNotes } from 'src/components/edit/notes'
import { Steps } from 'src/components/edit/steps'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'
import { callWithUser } from 'src/utils/call-with-user'

export * from 'app/default-static-config'

type EditPageProps = {
  params: { slug: string }
}

export default async function Page({ params: { slug } }: EditPageProps) {
  const book = await callWithUser(fetchBook, { slug, cache: false })
  const currentUser = await getUser.call()

  if (!book) notFound()
  if (currentUser?.id !== book.submitterId && currentUser?.role !== 'admin')
    notFound()

  return (
    <Container belowNav>
      <PageTitle>
        {`Editing: ${book.title}`}
        <StatusTag status={book.status} />
      </PageTitle>
      <div className="flex gap-x-32 flex-wrap">
        <AntiContainer
          desktop={false}
          className="flex-grow sm:flex-grow-0 sm:flex-shrink-0 mb-12 sm:max-w-lg sm:w-full"
        >
          <Steps book={book} />
        </AntiContainer>
        <EditNotes
          status={book.status}
          className="flex flex-col gap-4 max-w-sm text-14/6"
        />
      </div>
    </Container>
  )
}
