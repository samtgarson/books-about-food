import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

export const customiseBooks = (
  collection: CollectionCustomizer<Schema, 'books'>
) => {
  collection.replaceFieldWriting('cover_url', async (dataUri, context) => {
    if (!dataUri) return { cover_url: undefined }

    const prefix = `book-covers/${context.record.id}`
    const path = await uploadImage(dataUri, prefix)

    return { cover_url: path }
  })

  collection.replaceFieldWriting(
    'image_urls',
    async (dataUris = [], context) => {
      const paths = await Promise.all(
        dataUris.map((dataUri) => {
          const prefix = `book-images/${context.record.id}`
          return uploadImage(dataUri, prefix)
        })
      )

      return { image_urls: paths.filter((path): path is string => !!path) }
    }
  )

  collection
    .addField('Tags', {
      dependencies: ['id'],
      getValues: async (records) => {
        const tags = await prisma.tag.findMany({
          where: { books: { some: { id: { in: records.map((r) => r.id) } } } },
          include: { books: true }
        })
        return records.map((book) =>
          tags
            .filter((tag) => tag.books.some((b) => b.id === book.id))
            .map((tag) => tag.name)
        )
      },
      columnType: ['String']
    })
    .replaceFieldWriting('Tags', async (tags, context) => {
      await prisma.book.update({
        where: { id: context.record.id },
        data: {
          tags: { set: tags.map((name) => ({ name })) }
        }
      })
    })
    .emulateFieldFiltering('Tags')
}
