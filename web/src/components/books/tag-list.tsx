import Link from 'next/link'
import { FC, Fragment } from 'react'

export type TagListProps = { tags: string[] }

export const TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <p>
      {tags.map((tag, i) => (
        <Fragment key={tag}>
          <Link
            key={tag}
            href={`/cookbooks?tags=${tag}`}
            className="font-medium"
          >
            {tag}
          </Link>
          {i < tags.length - 1 && ' • '}
        </Fragment>
      ))}
    </p>
  )
}
