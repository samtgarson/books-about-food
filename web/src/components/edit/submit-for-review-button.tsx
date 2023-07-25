import { FC } from 'react'
import { ArrowRight } from 'react-feather'
import { FullBook } from 'src/models/full-book'
import cn from 'classnames'
import { Button } from '../atoms/button'

export const SubmitForReviewButton: FC<{
  book: FullBook
  disabled?: boolean
}> = ({ book, disabled }) => {
  return (
    <Button
      className={cn('!p-5', disabled && 'opacity-50')}
      variant={disabled ? 'primary' : 'dark'}
    >
      <span>Submit for Review</span>
      {disabled && (
        <span className="ml-auto text-14 opacity-50 flex gap-2 items-center">
          Complete the required steps to submit <ArrowRight strokeWidth={1} />
        </span>
      )}
    </Button>
  )
}
