import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { slugifyField } from 'lib/utils/slugify'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

export const customiseBooks = (
  collection: CollectionCustomizer<Schema, 'books'>
) => {
  // Cover Images
  collection
    .addField('Cover', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const image = await prisma.image.findUnique({
              where: { coverForId: record.id }
            })
            return image?.url
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Cover', async (dataUri, context) => {
      if (!dataUri) {
        await deleteImage({ coverForId: context.record.id })
        return
      }

      const prefix = `books/cover/${context.record.id}`
      await uploadImage(dataUri, prefix, 'coverForId', context.record.id)
    })

  // Preview Images
  collection.addField('Preview Images', {
    dependencies: ['id'],
    getValues: async (records) => {
      return Promise.all(
        records.map(async (record) => {
          const image = await prisma.image.findMany({
            where: { previewForId: record.id }
          })
          return image.map((image) => image.url)
        })
      )
    },
    columnType: ['String']
  })
  collection.replaceFieldWriting(
    'Preview Images',
    async (dataUris = [], context) => {
      const ids = await Promise.all(
        dataUris.map((dataUri) => {
          const prefix = `books/previews/${context.record.id}`
          return uploadImage(dataUri, prefix, 'previewForId', context.record.id)
        })
      )

      await deleteImage({
        previewForId: context.record.id,
        id: { notIn: ids.filter((id): id is string => !!id) }
      })
    }
  )

  // Tags
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

  collection.addAction('Add new collaborator', {
    scope: 'Single',
    form: [
      {
        label: 'Name',
        type: 'String'
      },
      { label: 'Job', type: 'Collection', collectionName: 'jobs' }
    ],
    execute: async (context, result) => {
      const bookId = await context.getRecordId()
      const jobId = context.formValues.Job[0]
      await prisma.profile.create({
        data: {
          name: context.formValues['Name'],
          slug: slugify(context.formValues['Name']),
          jobs: { connect: { id: jobId } },
          contributions: {
            create: {
              book: {
                connect: { id: bookId.toString() }
              },
              job: { connect: { id: jobId } }
            }
          }
        }
      })

      return result.success('Collaborator added')
    }
  })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((book) => {
      book.slug ||= slugify(book.title)
    })
  })
}
