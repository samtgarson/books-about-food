import Link from 'next/link'
import { FC } from 'react'
import { Pill, PillList } from '../atoms/pill'

export type TagListProps = { tags: Array<{ name: string; slug: string }> }

export const TagList: FC<TagListProps> = ({ tags }) => {
  return (
    <PillList>
      {tags.map(({ slug, name }) => (
        <Link href={`/cookbooks?tags=${slug}`} key={slug}>
          <Pill small variant="filled">
            {name}
          </Pill>
        </Link>
      ))}
    </PillList>
  )
}
