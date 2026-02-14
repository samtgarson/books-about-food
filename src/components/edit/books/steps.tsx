import { FC } from 'react'
import { FullBook } from 'src/core/models/full-book'
import { User } from 'src/core/types'
import { BookEditState } from './state'
import { Step } from './step'
import { SubmitForReviewButton } from './submit-for-review-button'

export const Steps: FC<{ book: FullBook; user: User }> = ({ book, user }) => {
  const state = new BookEditState(book, user)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Step
        disabled={state.disabled}
        title="1. General Information"
        href={state.link('title')}
        required
        complete={state.titleComplete}
      />
      <Step
        disabled={state.disabled}
        title="2. Cover & Spreads"
        href={state.link('images')}
        required
        complete={state.imagesComplete}
      />
      <Step
        disabled={state.disabled}
        title="3. Publishing Information"
        href={state.link('publisher')}
        required
        complete={state.publisherComplete}
      />
      <Step
        disabled={state.disabled}
        title="4. Team"
        href={state.link('team')}
        required
        complete={state.teamComplete}
      />
      <Step
        disabled={state.disabled}
        title="5. Links"
        href={state.link('links')}
        complete={state.linksComplete}
      />
      {state.complete ? null : (
        <SubmitForReviewButton book={book} disabled={!state.valid} />
      )}
    </div>
  )
}
