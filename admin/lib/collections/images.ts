import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { ImageBlurrer } from 'shared/services/image-blurrer'
import { Schema } from '../../.schema/types'

export const customiseImages = (
  collection: CollectionCustomizer<Schema, 'images'>
) => {
  collection.addAction('Generate missing placeholders', {
    scope: 'Global',
    execute: async (_context, result) => {
      const images = await prisma.image.findMany({
        where: { placeholderUrl: null },
        select: { url: true, id: true }
      })

      const results = await Promise.all(
        images.map(async ({ id, url }) => {
          try {
            const blurrer = new ImageBlurrer({ s3path: url })
            const placeholderUrl = await blurrer.call()
            await prisma.image.update({
              where: { id },
              data: { placeholderUrl }
            })
            return true
          } catch (e) {
            console.error(`Error for ${id}: `, e)
            return false
          }
        })
      )

      const successes = results.filter((r) => r).length
      if (successes === results.length) {
        result.success(`Generated ${successes} placeholders`)
      } else {
        result.error(
          `Generated ${successes} placeholders, ${
            results.length - successes
          } failed`
        )
      }
    }
  })
}
