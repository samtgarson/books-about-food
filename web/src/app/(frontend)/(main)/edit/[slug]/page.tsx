import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { Button } from 'src/components/atoms/button'
import { Edit2, Eye } from 'src/components/atoms/icons'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { StatusTag } from 'src/components/books/status-tag'
import { EditNotes } from 'src/components/edit/books/notes'
import { Steps } from 'src/components/edit/books/steps'
import { ParamSheet } from 'src/components/sheets/use-param-sheet'
import { slugPage } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'
import { Wrap } from 'src/components/utils/wrap'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

export default slugPage<'/edit/[slug]'>(async function EditBook(slug) {
  const { data: book } = await call(fetchBook, { slug })
  const currentUser = await getSessionUser()

  if (!book || !currentUser) notFound()
  if (currentUser.id !== book.submitterId && currentUser.role !== 'admin')
    notFound()

  return (
    <>
      <Toaster action="saved" message="Cookbook saved" type="success" />
      <Toaster action="created" message="Cookbook created" type="success" />
      <ParamSheet
        sheet="submitted"
        props={{ title: `${book.title} Submitted!` }}
      />
      <PageBackLink href="/account/submissions" back>
        Back to Submissions
      </PageBackLink>
      <div className="flex w-full max-w-xl flex-col items-stretch gap-6">
        <div className="mb-4 flex flex-nowrap items-center gap-4 sm:gap-6">
          {book.cover ? (
            <Image {...book.cover?.imageAttrs(80)} />
          ) : (
            <div className="h-20 w-14 shrink-0 bg-khaki" />
          )}
          <div className="flex grow flex-col items-start gap-2 overflow-hidden sm:flex-row sm:items-center sm:gap-6">
            <div className="flex w-full grow flex-col overflow-hidden sm:gap-2">
              <h1
                className="overflow-hidden text-20 text-ellipsis whitespace-nowrap sm:text-32"
                title={book.title}
              >
                {book.title}
              </h1>
              <p className="text-14 empty:hidden sm:text-16">
                {book.authorNames}
              </p>
            </div>
            <StatusTag status={book.status} />
          </div>
        </div>
        <EditNotes status={book.status} />
        {book.status === 'published' && (
          <div className="flex flex-wrap gap-2">
            <Wrap
              c={SheetButton}
              className="grow"
              sheet="suggestEdit"
              props={{ resource: book }}
            >
              <Edit2 strokeWidth={1} />
              Suggest an Edit
            </Wrap>
            <Button className="grow" href={book.href}>
              <Eye strokeWidth={1} /> View Your Cookbook
            </Button>
          </div>
        )}
        <Steps book={book} user={currentUser} />
        {book.status !== 'published' && (
          <form
            action={async function () {
              'use server'
              const payload = await getPayloadClient()
              await payload.delete({
                collection: 'books',
                id: book.id
              })
              redirect('/account/submissions?action=deleted')
            }}
            className="text-center"
          >
            <button className="text-14 underline">Delete Cookbook</button>
          </form>
        )}
      </div>
    </>
  )
})
