import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { ImageBlurrer } from 'shared/services/image-blurrer'
import { Schema } from '../../.schema/types'

const generatePlaceholder = async ({
  id,
  path
}: {
  id: string
  path: string
}) => {
  try {
    const blurrer = new ImageBlurrer({ s3path: path })
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
}

export const customiseImages = (
  collection: CollectionCustomizer<Schema, 'images'>
) => {
  collection.addAction('Generate missing placeholders', {
    scope: 'Global',
    execute: async (_context, result) => {
      const images = await prisma.image.findMany({
        where: { placeholderUrl: null },
        select: { path: true, id: true }
      })

      console.log(`Generating placeholders for ${images.length} images`)
      const results = await Promise.all(images.map(generatePlaceholder))

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
