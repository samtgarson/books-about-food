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
        title="Add Title and Author(s)"
        completeTitle="Title and Author(s)"
        href={state.link('title')}
        required
        complete={state.titleComplete}
      />
      <Step
        title="Upload Images"
        completeTitle="Images"
        href={state.link('images')}
        required
        complete={state.imagesComplete}
      />
      <Step
        title="Add Publisher"
        completeTitle="Publisher"
        href="#"
        required
        complete={state.publisherComplete}
      />
      <Step
        title="Add Team"
        completeTitle="Team"
        href="#"
        required
        complete={state.teamComplete}
      />
      <Step
        title="Add Links"
        completeTitle="Links"
        href="#"
        complete={state.linksComplete}
      />
      <Step
        title="Add Further Information"
        completeTitle="Further Information"
        href="#"
        complete={state.furtherInformationComplete}
      />
      <SubmitForReviewButton book={book} disabled={!state.valid} />
    </div>
  )
}
