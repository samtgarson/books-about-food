import { and, asc, eq } from '@payloadcms/db-postgres/drizzle'
import { Service } from 'src/core/services/base'
import { books, books_rels, tag_groups, tags } from 'src/payload/schema'
import { z } from 'zod'

export const fetchTagGroups = new Service(z.undefined(), async function (
  _input,
  { payload }
) {
  const rows = await payload.db.drizzle
    .selectDistinct({
      group: tag_groups,
      tag: tags
    })
    .from(tag_groups)
    .innerJoin(tags, eq(tags.group, tag_groups.id))
    .innerJoin(
      books_rels,
      and(eq(books_rels.tagsID, tags.id), eq(books_rels.path, 'tags'))
    )
    .innerJoin(books, eq(books.id, books_rels.parent))
    .where(and(eq(tag_groups.adminOnly, false), eq(books.status, 'published')))
    .orderBy(asc(tag_groups.name), asc(tags.name))

  type Group = (typeof rows)[number]['group']
  type Tag = (typeof rows)[number]['tag']
  const groups = new Map<string, Group & { tags: Tag[] }>()

  for (const { group, tag } of rows) {
    const existing = groups.get(group.id)

    if (existing) {
      existing.tags.push(tag)
    } else {
      groups.set(group.id, { ...group, tags: [tag] })
    }
  }

  return Array.from(groups.values())
})
