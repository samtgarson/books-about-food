import { BookStatus } from 'src/core/models/types'
import { Tag, TagProps } from '../atoms/tag'

export function StatusTag({
  status,
  ...props
}: { status: BookStatus } & Omit<TagProps, 'children' | 'color'>) {
  switch (status) {
    case 'draft':
      return (
        <Tag {...props} color="grey">
          Draft
        </Tag>
      )
    case 'inReview':
      return (
        <Tag {...props} color="purple">
          In Review
        </Tag>
      )
    case 'published':
      return (
        <Tag {...props} color="lime">
          Published
        </Tag>
      )
  }
}
