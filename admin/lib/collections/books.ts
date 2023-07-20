import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

const uploadCover = async (dataUri: string, bookId: string) => {
  if (!dataUri) {
    await deleteImage({ coverForId: bookId })
    return
  }

  const prefix = `books/${bookId}/cover`
  await uploadImage(dataUri, prefix, 'coverForId', bookId, true)
}

const uploadPreviews = async (dataUris: string[] = [], bookId: string) => {
  const ids = await Promise.all(
    dataUris.map((dataUri) => {
      const prefix = `books/${bookId}/previews`
      return uploadImage(dataUri, prefix, 'previewForId', bookId)
    })
  )

  await deleteImage({
    previewForId: bookId,
    id: { notIn: ids.filter((id): id is string => !!id) }
  })
}

const updateProfiles = async (bookId: string) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book?.releaseDate) return

  await prisma.profile.updateMany({
    where: {
      contributions: { some: { bookId } },
      mostRecentlyPublishedOn: { lt: book.releaseDate }
    },
    data: { mostRecentlyPublishedOn: book.releaseDate }
  })
}

const updateTags = async (bookId: string, tags: string[] = []) =>
  prisma.book.update({
    where: { id: bookId },
    data: {
      tags: { set: tags.map((name) => ({ name })) }
    }
  })

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
            return image?.path
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Cover', async (dataUri, context) => {
      if (!context.record.id) return
      await uploadCover(dataUri, context.record.id)
    })

  // Preview Images
  collection
    .addField('Preview Images', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const image = await prisma.image.findMany({
              where: { previewForId: record.id }
            })
            return image.map((image) => image.path)
          })
        )
      },
      columnType: ['String']
    })
    .replaceFieldWriting('Preview Images', async (dataUris = [], context) => {
      if (!context.record.id) return
      await uploadPreviews(dataUris, context.record.id)
    })

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
      if (context.record.id) await updateTags(context.record.id, tags)

      return { Tags: tags }
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
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      await prisma.profile.create({
        data: {
          name: context.formValues['Name'],
          slug: slugify(context.formValues['Name']),
          jobTitle: job?.name,
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
      book.status = 'published'
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map(async (record, i) => {
        const data = context.data[i]

        await updateTags(record.id, data.Tags)
        await uploadCover(data.Cover, record.id)
        await uploadPreviews(data['Preview Images'], record.id)
        await updateProfiles(record.id)
      })
    )
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.flatMap((record) => [
        deleteImage({ coverForId: record.id }),
        deleteImage({ previewForId: record.id })
      ])
    )
  })

  collection.addHook('After', 'Update', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(records.map(async (record) => updateProfiles(record.id)))
  })
}
