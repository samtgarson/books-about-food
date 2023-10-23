import { notFound } from 'next/navigation'
import { Edit, Eye } from 'react-feather'
import { Button } from 'src/components/atoms/button'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { StatusTag } from 'src/components/books/status-tag'
import { EditNotes } from 'src/components/edit/notes'
import { Steps } from 'src/components/edit/steps'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

type EditPageProps = {
  params: { slug: string }
}

export default async function Page({ params: { slug } }: EditPageProps) {
  const { data: book } = await fetchBook.call({ slug, cache: false })
  const { data: currentUser } = await getUser.call()

  if (!book) notFound()
  if (currentUser?.id !== book.submitterId && currentUser?.role !== 'admin')
    notFound()

  return (
    <Container belowNav>
      <PageTitle className="flex-wrap items-center">
        <div className="flex flex-nowrap items-center gap-8">
          {book.title}
          <StatusTag status={book.status} />
        </div>
        {book.status === 'published' && (
          <div className="flex items-center gap-2">
            <SheetButton
              sheet="suggestEdit"
              props={{ resource: book }}
              data-superjson
              variant="secondary"
            >
              <Edit strokeWidth={1} />
              Suggest an Edit
            </SheetButton>
            <Button href={book.href}>
              <Eye strokeWidth={1} /> View Your Cookbook
            </Button>
          </div>
        )}
      </PageTitle>
      <div className="flex flex-wrap gap-x-32">
        <AntiContainer
          desktop={false}
          className="mb-12 flex-grow sm:w-full sm:max-w-lg sm:flex-shrink-0 sm:flex-grow-0"
        >
          <Steps book={book} />
        </AntiContainer>
        <EditNotes
          status={book.status}
          className="text-14/6 flex max-w-sm flex-col gap-4"
        />
      </div>
    </Container>
  )
}
