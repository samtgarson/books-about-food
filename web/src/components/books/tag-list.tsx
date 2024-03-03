import Link from 'next/link'
import { FC } from 'react'
import { Pill } from '../atoms/pill'

export type TagListProps = { tags: Array<{ name: string; slug: string }> }

export const TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <p className="flex justify-start gap-2">
      {tags.map(({ slug, name }) => (
        <Link href={`/cookbooks?tags=${slug}`} key={slug}>
          <Pill small variant="filled">
            {name}
          </Pill>
        </Link>
      ))}
    </p>
  )
}
