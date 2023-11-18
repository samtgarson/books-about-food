import Link from 'next/link'
import { FC } from 'react'
import { Pill } from '../atoms/pill'

export type TagListProps = { tags: string[] }

export const TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <p className="flex justify-start gap-2">
      {tags.map((tag) => (
        <Link href={`/cookbooks?tags=${tag}`} key={tag}>
          <Pill small variant="filled">
            {tag}
          </Pill>
        </Link>
      ))}
    </p>
  )
}
