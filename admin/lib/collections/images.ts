import prisma from '@books-about-food/database'
import { ImageBlurrer } from '@books-about-food/jobs/lib/image-blurrer'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { CollectionCustomizer } from '@forestadmin/agent'
import { map } from 'async-parallel'
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
  collection.addField('Source', {
    dependencies: ['path'],
    getValues: async (records) => {
      return records.map((record) => imageUrl(record.path))
    },
    columnType: 'String'
  })

  collection.addAction('Generate missing placeholders', {
    scope: 'Global',
    execute: async (_context, result) => {
      const images = await prisma.image.findMany({
        where: { placeholderUrl: null },
        select: { path: true, id: true }
      })

      console.log(`Generating placeholders for ${images.length} images`)
      const results = await map(images, generatePlaceholder, 5)

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
