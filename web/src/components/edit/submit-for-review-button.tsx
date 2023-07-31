import { FC } from 'react'
import { ArrowRight } from 'react-feather'
import { FullBook } from 'src/models/full-book'
import cn from 'classnames'
import { Submit } from '../form/submit'
import { BookEditState } from './state'
import { redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect'

export const SubmitForReviewButton: FC<{
  book: FullBook
  disabled?: boolean
}> = ({ book, disabled }) => {
  async function submit() {
    'use server'

    const state = new BookEditState(book)
    await state.submitForReview()

    redirect(`/edit/${book.slug}`, RedirectType.replace)
  }

  return (
    <form action={submit}>
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
