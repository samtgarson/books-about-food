import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import prisma from '@books-about-food/database'
import { inngest } from '@books-about-food/jobs'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import Color from 'color'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

const uploadCover = async (dataUri: string | null, bookId: string) => {
  if (!dataUri) {
    await deleteImage({ coverForId: bookId })
    return
  }

  const prefix = `books/${bookId}/cover`
  return await uploadImage(dataUri, prefix, 'coverForId', bookId, true)
}

const uploadPreviews = async (dataUris: string[] = [], bookId: string) => {
  const images = await Promise.all(
    dataUris.map((dataUri) => {
      if (!dataUri.startsWith('data:'))
        return prisma.image.findUnique({ where: { path: dataUri } })
      const prefix = `books/${bookId}/previews`
      return uploadImage(dataUri, prefix, 'previewForId', bookId)
    })
  )

  await deleteImage({
    previewForId: bookId,
    id: { notIn: images.flatMap((image) => image?.id || []) }
  })

  return images
}

const updateProfiles = async (bookId: string) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book?.releaseDate) return
  const profiles = await prisma.profile.findMany({
    where: {
      OR: [
        { contributions: { some: { bookId } } },
        { authoredBooks: { some: { id: bookId } } }
      ]
    }
  })

  await Promise.all(
    profiles.map(async (profile) => {
      const latestBook = await prisma.book.findFirst({
        where: {
          OR: [
            { contributions: { some: { profileId: profile.id } } },
            { authors: { some: { id: profile.id } } }
          ],
          releaseDate: { not: null },
          status: 'published'
        },
        orderBy: { releaseDate: 'desc' }
      })

      if (!latestBook) return
      await prisma.profile.update({
        where: { id: profile.id },
        data: { mostRecentlyPublishedOn: latestBook.releaseDate }
      })
    })
  )
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
  /* =============================================
   * FIELDS
   * ============================================= */

  // Cover Images
  collection
    .addField('Cover', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            if (!record.id) return
            const image = await prisma.image.findUnique({
              where: { coverForId: record.id }
            })
            return image && imageUrl(image.path)
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Cover', async (dataUri, context) => {
      if (!context.filter) return
      const records = await context.collection.list(context.filter, ['id'])
      await Promise.all(
        records.map((record) => uploadCover(dataUri, record.id))
      )
    })

  // Preview Images
  collection
    .addField('PreviewImages', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const image = await prisma.image.findMany({
              where: { previewForId: record.id }
            })
            return image.map((image) => imageUrl(image.path))
          })
        )
      },
      columnType: ['String']
    })
    .replaceFieldWriting('PreviewImages', async (dataUris, context) => {
      if (!context.filter) return
      const records = await context.collection.list(context.filter, ['id'])
      await Promise.all(
        records.map((record) => uploadPreviews(dataUris, record.id))
      )
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
      if (!context.filter) return
      const records = await context.collection.list(context.filter, ['id'])
      await Promise.all(records.map((record) => updateTags(record.id, tags)))

      return { Tags: tags }
    })
    .emulateFieldFiltering('Tags')

  collection.addManyToManyRelation('Authors', 'profiles', '_authored_books', {
    originKey: 'A',
    foreignKey: 'B'
  })

  collection
    .removeField('background_color')
    .addField('BackgroundColor', {
      async getValues(records) {
        return records.map(
          (record) =>
            record.background_color.length &&
            Color.rgb(record.background_color).hex()
        )
      },
      columnType: 'String',
      dependencies: ['background_color']
    })
    .replaceFieldWriting('BackgroundColor', async (value) => {
      if (!value) return { background_color: [] }
      const rgb = Color(value).rgb().array()
      return { background_color: rgb }
    })

  collection
    .removeField('primary_color')
    .addField('PrimaryColor', {
      async getValues(records) {
        return records.map(
          (record) =>
            record.primary_color.length && Color.rgb(record.primary_color).hex()
        )
      },
      columnType: 'String',
      dependencies: ['primary_color']
    })
    .replaceFieldWriting('PrimaryColor', async (value) => {
      if (!value) return { primary_color: [] }
      const rgb = Color(value).rgb().array()
      return { primary_color: rgb }
    })

  // Array(6)
  //   .fill(0)
  //   .forEach((_, i) => {
  //     collection.addField(`Color${i + 1}`, {
  //       async getValues(records) {
  //         return records.map(
  //           (record) =>
  //             record.palette.length && Color.rgb(record.palette[i]).hex()
  //         )
  //       },
  //       columnType: 'String',
  //       dependencies: ['palette']
  //     })
  //   })

  collection
    .removeField('background_color')
    .addField('BackgroundColor', {
      async getValues(records) {
        return records.map(
          (record) =>
            record.background_color.length &&
            Color.rgb(record.background_color).hex()
        )
      },
      columnType: 'String',
      dependencies: ['background_color']
    })
    .replaceFieldWriting('BackgroundColor', async (value) => {
      const rgb = Color(value).rgb().array()
      return { background_color: rgb }
    })

  /* =============================================
   * ACTIONS
   * ============================================= */

  collection.addAction('↗️  View in BAF', {
    scope: 'Single',
    execute: async (context, result) => {
      const { slug } = await context.getRecord(['slug'])
      return result.redirectTo(
        `https://books-about-food-web.vercel.app/cookbooks/${slug}`
      )
    }
  })

  collection.addAction('🤝 Add new collaborator', {
    scope: 'Single',
    form: [
      {
        label: 'Name',
        type: 'String',
        widget: 'Dropdown',
        search: 'dynamic',
        placeholder: 'Search for an existing profile or create a new one',
        async options(context, searchValue) {
          if (!searchValue) return []
          const options = [
            { value: `||${searchValue}||`, label: `Create: ${searchValue}` }
          ]
          const search = await fetchProfiles.call({
            search: searchValue,
            perPage: 10
          })
          if (!search.success) return options

          return [
            ...options,
            ...search.data.profiles.map(({ id, name }) => ({
              value: id,
              label: name
            }))
          ]
        }
      },
      { label: 'Job', type: 'Collection', collectionName: 'jobs' },
      { label: 'Assistant', type: 'Boolean' }
    ],
    execute: async (context, result) => {
      const bookId = `${await context.getRecordId()}`
      const jobId = context.formValues.Job[0]
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      const tag = context.formValues.Assistant ? 'Assistant' : undefined
      const profileIdOrName = context.formValues.Name
      let profileId: string
      if (profileIdOrName.startsWith('||')) {
        const name = profileIdOrName.slice(2)
        const created = await prisma.profile.create({
          data: {
            name,
            slug: slugify(name),
            jobTitle: job?.name
          }
        })
        profileId = created.id
      } else {
        profileId = profileIdOrName
      }

      await prisma.contribution.create({
        data: {
          bookId,
          profileId,
          jobId,
          tag
        }
      })

      return result.success('Collaborator added')
    }
  })

  /* =============================================
   * HOOKS
   * ============================================= */

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((book) => {
      book.slug ||= slugify(book.title)
      book.status = 'published'
      book.source = 'admin'
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map(async (record, i) => {
        const data = context.data[i]

        await Promise.all([
          updateTags(record.id, data.Tags),
          uploadCover(data.Cover, record.id),
          uploadPreviews(data['PreviewImages'], record.id),
          updateProfiles(record.id),
          inngest.send({
            name: 'book.updated',
            data: { id: record.id, coverImageChanged: !!data.Cover }
          })
        ])
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
    await Promise.all(
      records.map(async (record) => {
        await updateProfiles(record.id)
        await inngest.send({
          name: 'book.updated',
          data: { id: record.id, coverImageChanged: !!context.patch.Cover }
        })
      })
    )
  })
}
