import { BookStatus } from 'src/core/models/types'
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
    case 'draft':
      return <DraftNotes className={className} />
    case 'inReview':
      return <InReviewNotes className={className} />
    default:
      return null
  }
}
