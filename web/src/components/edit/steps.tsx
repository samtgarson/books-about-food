import { FC } from 'react'
import { FullBook } from 'src/models/full-book'
import { Step } from './step'
import { SubmitForReviewButton } from './submit-for-review-button'
import { BookEditState } from './state'

export const Steps: FC<{ book: FullBook }> = ({ book }) => {
  const state = new BookEditState(book)

  return (
    <div className="flex flex-col gap-2">
      <Step
        disabled={state.complete}
        title="General Information"
        href={state.link('title')}
        required
        complete={state.titleComplete}
      />
      <Step
        disabled={state.complete}
        title="Cover & Spreads"
        href={state.link('images')}
        required
        complete={state.imagesComplete}
      />
      <Step
        disabled={state.complete}
        title="Publishing Information"
        href={state.link('publisher')}
        required
        complete={state.publisherComplete}
      />
      <Step
        disabled={state.complete}
        title="Team"
        href={state.link('team')}
        required
        complete={state.teamComplete}
      />
      <Step
        disabled={state.complete}
        title="Links"
        href={state.link('links')}
        complete={state.linksComplete}
      />
      {state.complete ? null : (
        <SubmitForReviewButton book={book} disabled={!state.valid} />
      )}
    </div>
  )
}
