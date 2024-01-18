import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import prisma from '@books-about-food/database'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { Button } from 'src/components/atoms/button'
import { Edit2, Eye } from 'src/components/atoms/icons'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { StatusTag } from 'src/components/books/status-tag'
import { EditNotes } from 'src/components/edit/notes'
import { Steps } from 'src/components/edit/steps'
import { ParamSheet } from 'src/components/sheets/use-param-sheet'
import { Toaster } from 'src/components/utils/toaster'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

type EditPageProps = {
  params: { slug: string }
}

export default async function Page({ params: { slug } }: EditPageProps) {
  const { data: book } = await call(fetchBook, { slug, cache: false })
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
      <PageBackLink href={`/account/submissions`} back>
        Back to Submissions
      </PageBackLink>
      <div className="w-full max-w-xl flex flex-col items-stretch gap-6">
        <div className="flex flex-nowrap items-center gap-4 sm:gap-6 mb-4">
          {book.cover ? (
            <Image {...book.cover?.imageAttrs(80)} />
          ) : (
            <div className="bg-khaki w-14 h-20 shrink-0" />
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center overflow-hidden grow">
            <div className="flex flex-col sm:gap-2 grow overflow-hidden w-full">
              <h1
                className="text-20 sm:text-32 whitespace-nowrap text-ellipsis overflow-hidden"
                title={book.title}
              >
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
              className="grow"
              sheet="suggestEdit"
              props={{ resource: book }}
              data-superjson
            >
              <Edit2 strokeWidth={1} />
              Suggest an Edit
            </SheetButton>
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
              await prisma.book.delete({ where: { id: book.id } })
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
}
