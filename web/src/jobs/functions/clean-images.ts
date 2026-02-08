import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'
import { inngest } from 'src/jobs'

async function findOrphanedImageIds(payload: Payload) {
  const result = await payload.db.drizzle.execute<{ id: string }>(sql`
    SELECT i.id
    FROM images i
    LEFT JOIN books b_cover ON b_cover.cover_image_id = i.id
    LEFT JOIN books_preview_images bpi ON bpi.image = i.id
    LEFT JOIN profiles p ON p.avatar_id = i.id
    LEFT JOIN publishers pub ON pub.logo_id = i.id
    LEFT JOIN search_results sr ON sr.image = i.id
    WHERE b_cover.id IS NULL
      AND bpi.id IS NULL
      AND p.id IS NULL
      AND pub.id IS NULL
      AND sr.id IS NULL
  `)

  return result.rows.map((row) => row.id)
}

export const cleanImages = inngest.createFunction(
  { id: 'clean-images', name: 'Clean Images' },
  { cron: '0 9 * * 1' },
  async ({ payload }: { payload: Payload }) => {
    const orphanedIds = await findOrphanedImageIds(payload)
    if (!orphanedIds.length) return { success: true, deletedImages: 0 }

    payload.logger.info(`Deleting ${orphanedIds.length} orphaned images...`)
    await Promise.all(
      orphanedIds.map((id) => payload.delete({ collection: 'images', id }))
    )
    payload.logger.info(`Deleted ${orphanedIds.length} orphaned images`)

    return { success: true, deletedImages: orphanedIds.length }
  }
)
