import {
  and,
  countDistinct,
  eq,
  gt,
  ne,
  notExists,
  sql
} from '@payloadcms/db-postgres/drizzle'
import { alias } from '@payloadcms/db-postgres/drizzle/pg-core'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import {
  books_contributions,
  profiles,
  profiles_rels
} from 'src/payload/schema'
import { z } from 'zod'
import { fetchProfile } from '../profiles/fetch-profile'

export const fetchFrequentCollaborators = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, ctx) => {
    if (!slug) return []

    const { payload } = ctx
    const db = payload.db.drizzle

    // Aliases for self-join
    const p1 = profiles
    const p2 = alias(profiles, 'p2')
    const c1 = books_contributions
    const c2 = alias(books_contributions, 'c2')

    const raw = await db
      .select({
        slug: p1.slug,
        count: countDistinct(c1._parentID).as('book_count')
      })
      .from(p1)
      .innerJoin(c1, eq(p1.id, c1.profile))
      .innerJoin(c2, eq(c2._parentID, c1._parentID))
      .innerJoin(p2, and(eq(p2.id, c2.profile), ne(p2.slug, p1.slug)))
      .where(
        and(
          eq(p2.slug, slug),
          notExists(
            db
              .select()
              .from(profiles_rels)
              .where(
                and(
                  eq(profiles_rels.parent, p2.id),
                  eq(profiles_rels.path, 'hiddenFrequentCollaborators'),
                  eq(profiles_rels.profilesID, p1.id)
                )
              )
          )
        )
      )
      .groupBy(p1.slug)
      .having(gt(countDistinct(c1._parentID), 1))
      .orderBy(sql`count(DISTINCT ${c1._parentID}) DESC`)
      .limit(8)

    const profileResults = await Promise.all(
      raw.flatMap(async ({ slug }) => {
        const { data } = await fetchProfile.call({ slug }, ctx)
        return data ? data : []
      })
    )

    return profileResults.filter((profile): profile is Profile => !!profile)
  }
)
