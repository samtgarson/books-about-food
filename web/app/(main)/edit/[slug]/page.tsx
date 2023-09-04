import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Steps } from 'src/components/edit/steps'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'
import { callWithUser } from 'src/utils/call-with-user'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const book = await callWithUser(fetchBook, { slug })
  const currentUser = await getUser.call()

  if (!book) notFound()
  if (currentUser?.id !== book.submitterId && currentUser?.role !== 'admin')
    notFound()

  return (
    <Container belowNav>
      <PageTitle>{`Editing: ${book.title}`}</PageTitle>
      <div className="flex gap-x-32 gap-y-12 flex-wrap">
        <Steps book={book} />
        <div className="flex flex-col gap-4 max-w-sm text-14/6">
          <h3 className="font-medium">Notes on submitting</h3>
          <ol className="list-outside pl-5 list-decimal">
            <li>
              Fill as much of the information as you can. We hope the wider
              community would then help complete the submission.
            </li>
            <li>
              If you are logged in, you can save your progress and come back to
              it later.
            </li>
            <li>
              Only upload good quality flat images of the cover and spreads—not
              photographs of them.
            </li>
            <li>
              The more detail you add the better it represents the book and the
              people involved in creating it.
            </li>
            <li>We will manually check and publish every submission.</li>
          </ol>
          <p>
            Thank you for considering submitting a cookbook. The beauty of this
            platform relies on the community maintaining projects they’ve been a
            part of.
          </p>
        </div>
      </div>
    </Container>
  )
}
