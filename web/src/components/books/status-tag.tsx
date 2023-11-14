import { BookStatus } from '@books-about-food/database'
import { Tag } from '../atoms/tag'

export function StatusTag({ status }: { status: BookStatus }) {
  switch (status) {
    case BookStatus.draft:
      return <Tag color="grey">Draft</Tag>
    case BookStatus.inReview:
      return <Tag color="purple">In Review</Tag>
    case BookStatus.published:
      return <Tag color="lime">Published</Tag>
  }
}
