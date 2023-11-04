import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Edit2, Eye } from 'react-feather'
import { Button } from 'src/components/atoms/button'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { StatusTag } from 'src/components/books/status-tag'
import { EditNotes } from 'src/components/edit/notes'
import { Steps } from 'src/components/edit/steps'
import { ParamSheet } from 'src/components/sheets/use-param-sheet'
import { Toaster } from 'src/components/utils/toaster'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'

export * from 'app/default-static-config'

type EditPageProps = {
  params: { slug: string }
}

export default async function Page({ params: { slug } }: EditPageProps) {
  const { data: book } = await fetchBook.call({ slug, cache: false })
  const { data: currentUser } = await getUser.call()

  if (!book || !currentUser) notFound()
  if (currentUser.id !== book.submitterId && currentUser.role !== 'admin')
    notFound()

  return (
    <>
      <Toaster action="saved" message="Cookbook saved" type="success" />
      <Toaster action="created" message="Cookbook created" type="success" />
      <ParamSheet sheet="submitted" props={{ title: book.title }} />
      <PageBackLink href={`/account/submissions`}>
        Back to Submissions
      </PageBackLink>
      <div className="w-full max-w-xl flex flex-col items-stretch gap-6">
        <div className="flex flex-nowrap items-center gap-4 sm:gap-6 mb-4">
          {book.cover ? (
            <Image {...book.cover?.imageAttrs(80)} />
          ) : (
            <div className="bg-khaki w-16 h-20" />
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center overflow-hidden">
            <div className="flex flex-col sm:gap-2 grow overflow-hidden w-full">
              <h1 className="text-20 sm:text-32 whitespace-nowrap text-ellipsis overflow-hidden">
                {book.title}
              </h1>
              <p className="text-14 sm:text-16 empty:hidden">
                {book.authorNames}
              </p>
            </div>
            <StatusTag status={book.status} />
          </div>
        </div>
        <EditNotes status={book.status} />
        {book.status === 'published' && (
          <div className="flex flex-wrap gap-2">
            <SheetButton
              className="grow sm:grow-0"
              sheet="suggestEdit"
              props={{ resource: book }}
              data-superjson
            >
              <Edit2 strokeWidth={1} />
              Suggest an Edit
            </SheetButton>
            <Button className="grow sm:grow-0" href={book.href}>
              <Eye strokeWidth={1} /> View Your Cookbook
            </Button>
          </div>
        )}
        <Steps book={book} user={currentUser} />
      </div>
    </>
  )
}
