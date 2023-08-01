import cn from 'classnames'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import { ArrowRight } from 'react-feather'
import { FullBook } from 'src/models/full-book'
import { fetchBook } from 'src/services/books/fetch-book'
import { Submit } from '../form/submit'
import { BookEditState } from './state'
import { callWithUser } from 'src/utils/call-with-user'

export const SubmitForReviewButton: FC<{
  book: FullBook
  disabled?: boolean
}> = ({ book, disabled }) => {
  return (
    <form action={submit}>
      <input type="hidden" name="slug" value={book.slug} />
      <Submit
        className={cn(
          '!p-5 w-full',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        variant={disabled ? 'primary' : 'dark'}
        disabled={disabled}
      >
        <span>Submit for Review</span>
        {disabled && (
          <span className="ml-auto text-14 opacity-50 flex gap-2 items-center">
            Complete the required steps to submit <ArrowRight strokeWidth={1} />
          </span>
        )}
      </Submit>
    </form>
  )
}

async function submit(data: FormData) {
  'use server'

  const book = await callWithUser(fetchBook, Object.fromEntries(data.entries()))
  await new BookEditState(book).submitForReview()

  redirect(`/edit/${book.slug}`, RedirectType.replace)
}
