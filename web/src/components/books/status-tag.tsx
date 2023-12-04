import { BookStatus } from '@books-about-food/database'
import { Tag, TagProps } from '../atoms/tag'

export function StatusTag({
  status,
  ...props
}: { status: BookStatus } & Omit<TagProps, 'children' | 'color'>) {
  switch (status) {
    case BookStatus.draft:
      return (
        <Tag {...props} color="grey">
          Draft
        </Tag>
      )
    case BookStatus.inReview:
      return (
        <Tag {...props} color="purple">
          In Review
        </Tag>
      )
    case BookStatus.published:
      return (
        <Tag {...props} color="lime">
          Published
        </Tag>
      )
  }
}
