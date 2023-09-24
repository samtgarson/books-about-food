import cn from 'classnames'
import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import { ArrowRight } from 'react-feather'
import { FullBook } from 'src/models/full-book'
import { fetchBook } from 'src/services/books/fetch-book'
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

  const book = await fetchBook.parseAndCall(Object.fromEntries(data.entries()))
  await new BookEditState(book).submitForReview()

  redirect(`/edit/${book.slug}`, RedirectType.replace)
}
