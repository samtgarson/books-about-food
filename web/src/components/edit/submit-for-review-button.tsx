import cn from 'classnames'
import { FullBook } from 'core/models/full-book'
import { fetchBook } from 'core/services/books/fetch-book'
import { revalidatePath } from 'next/cache'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import { ArrowRight } from 'react-feather'
import { Submit } from '../form/submit'
import { BookEditState } from './state'

export const SubmitForReviewButton: FC<{
  book: FullBook
  disabled?: boolean
}> = ({ book, disabled }) => {
  return (
    <form action={submit}>
      <input type="hidden" name="slug" value={book.slug} />
      <Submit
        className={cn(
          'w-full !p-5',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        variant={disabled ? 'primary' : 'dark'}
        disabled={disabled}
      >
        <span>Submit for Review</span>
        <ArrowRight strokeWidth={1} className="ml-auto" />
      </Submit>
    </form>
  )
}

async function submit(data: FormData) {
  'use server'

  const { data: book } = await fetchBook.parseAndCall(
    Object.fromEntries(data.entries())
  )
  if (!book) return
  await new BookEditState(book).submitForReview()

  revalidatePath(`/edit/${book.slug}`)
  redirect(`/edit/${book.slug}?action=submitted`, RedirectType.replace)
}
