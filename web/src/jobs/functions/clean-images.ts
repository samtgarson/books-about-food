import { and, eq, isNull } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'
import { inngest } from 'src/jobs'
import {
  books,
  books_preview_images,
  images,
  profiles,
  publishers
} from 'src/payload/schema'

async function findOrphanedImageIds(payload: Payload) {
  const result = await payload.db.drizzle
    .select({ id: images.id })
    .from(images)
    .leftJoin(books, eq(books.coverImage, images.id))
    .leftJoin(books_preview_images, eq(books_preview_images.image, images.id))
    .leftJoin(profiles, eq(profiles.avatar, images.id))
    .leftJoin(publishers, eq(publishers.logo, images.id))
    .where(
      and(
        isNull(books.id),
        isNull(books_preview_images.id),
        isNull(profiles.id),
        isNull(publishers.id)
      )
    )

  return result.map((row) => row.id)
}

export const cleanImages = inngest.createFunction(
  { id: 'clean-images', name: 'Clean Images' },
  [{ cron: '0 9 * * 1' }],
  async ({ payload }: { payload: Payload }) => {
    const orphanedIds = await findOrphanedImageIds(payload)
    if (!orphanedIds.length) return { success: true, deletedImages: 0 }

    console.info(`Deleting ${orphanedIds.length} orphaned images...`)
    await Promise.all(
      orphanedIds.map((id) => payload.delete({ collection: 'images', id }))
    )
    console.info(`Deleted ${orphanedIds.length} orphaned images`)

    return { success: true, deletedImages: orphanedIds.length }
  }
)
