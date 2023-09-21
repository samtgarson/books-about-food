import { BookStatus } from 'database'
import { DraftNotes } from './draft'
import { InReviewNotes } from './in-review'
import { PublishedNotes } from './published'

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
    case BookStatus.published:
      return <PublishedNotes className={className} />
  }
}
