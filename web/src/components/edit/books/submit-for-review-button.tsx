import { FullBook } from '@books-about-food/core/models/full-book'
import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import cn from 'classnames'
import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { FC } from 'react'
import { ArrowRight } from 'src/components/atoms/icons'
import { Submit } from 'src/components/form/submit'
import { parseAndCall } from 'src/utils/service'
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

  const { data: book } = await parseAndCall(
    fetchBook,
    Object.fromEntries(data.entries())
  )
  if (!book) return
  await new BookEditState(book).submitForReview()

  revalidatePath(`/edit/${book.slug}`)
  redirect(`/edit/${book.slug}?action=submitted`, RedirectType.replace)
}
