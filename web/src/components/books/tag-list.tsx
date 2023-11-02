import Link from 'next/link'
import { FC, Fragment } from 'react'
import { Pill } from '../atoms/pill'

export type TagListProps = { tags: string[] }

export const TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <p className="flex justify-start">
      {tags.map((tag, i) => (
        <Fragment key={tag}>
          <Link href={`/cookbooks?tags=${tag}`}>
            <Pill small variant="filled">
              {tag}
            </Pill>
          </Link>
          {i < tags.length - 1 && ' • '}
        </Fragment>
      ))}
    </p>
  )
}
