import { FC } from 'react'
import { FullBook } from 'src/models/full-book'
import { Step } from './step'
import { SubmitForReviewButton } from './submit-for-review-button'
import { BookEditState } from './state'

export const Steps: FC<{ book: FullBook }> = ({ book }) => {
  const state = new BookEditState(book)

  return (
    <div className="flex flex-col gap-2 max-w-lg">
      <Step
        disabled={state.inReview}
        title="Add Title and Author(s)"
        completeTitle="Title and Author(s)"
        href={state.link('title')}
        required
        complete={state.titleComplete}
      />
      <Step
        disabled={state.inReview}
        title="Upload Images"
        completeTitle="Images"
        href={state.link('images')}
        required
        complete={state.imagesComplete}
      />
      <Step
        disabled={state.inReview}
        title="Add Publisher"
        completeTitle="Publisher"
        href={state.link('publisher')}
        required
        complete={state.publisherComplete}
      />
      <Step
        disabled={state.inReview}
        title="Add Team"
        completeTitle="Team"
        href={state.link('team')}
        required
        complete={state.teamComplete}
      />
      <Step
        disabled={state.inReview}
        title="Add Links"
        completeTitle="Links"
        href={state.link('links')}
        complete={state.linksComplete}
      />
      <Step
        disabled={state.inReview}
        title="Add More Information"
        completeTitle="More Information"
        href={state.link('meta')}
        complete={state.furtherInformationComplete}
      />
      {state.inReview ? null : (
        <SubmitForReviewButton book={book} disabled={!state.valid} />
      )}
    </div>
  )
}
