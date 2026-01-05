import { and, eq } from '@payloadcms/db-postgres/drizzle'
import { Service } from 'src/core/services/base'
import { books, books_rels, tags } from 'src/payload/schema'
import { z } from 'zod'
import { AppError } from '../utils/errors'
import { fetchBooks } from './fetch-books'

export const fetchSimilarBooks = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, { payload }) => {
    const db = payload.db.drizzle

    const inputBookTags = await db
      .select({ tagSlug: tags.slug })
      .from(tags)
      .innerJoin(
        books_rels,
        and(eq(books_rels.tagsID, tags.id), eq(books_rels.path, 'tags'))
      )
      .innerJoin(books, eq(books_rels.parent, books.id))
      .where(eq(books.slug, slug))

    const tagSlugs = inputBookTags
      .map((row) => row.tagSlug)
      .filter((id): id is string => id !== null)

    // If no tags, return empty array
    if (tagSlugs.length === 0) {
      return []
    }

    const res = await fetchBooks.call(
      { tags: tagSlugs, perPage: 10 },
      { payload }
    )
    if (!res.success) {
      throw AppError.fromJSON(res.errors[0])
    }

    return res.data.books.filter((book) => book.slug !== slug)
  }
)
