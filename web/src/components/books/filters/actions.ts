'use server'

import { fetchTagGroups } from '@books-about-food/core/services/tags/fetch-groups'
import { call } from 'src/utils/service'
import { Tag } from './pill-list'

type TagGroup = {
  slug: string
  name: string
  tags: Tag[]
}

export async function fetchTagGroupOptions(): Promise<TagGroup[]> {
  const { data: tagGroups = [] } = await call(fetchTagGroups)

  return tagGroups.map((group) => ({
    name: group.name,
    slug: group.slug,
    tags: group.tags.map((tag) => ({
      label: tag.name,
      value: tag.slug
    }))
  }))
}
