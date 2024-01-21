import { BookStatus } from '@books-about-food/database'
import { DraftNotes } from './draft'
import { InReviewNotes } from './in-review'

export function EditNotes({
  status,
  className
}: {
  status: BookStatus
  className?: string
}) {
  switch (status) {
    case BookStatus.draft:
      return <DraftNotes className={className} />
    case BookStatus.inReview:
      return <InReviewNotes className={className} />
    default:
      return null
  }
}
