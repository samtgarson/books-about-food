import { inngest } from '@books-about-food/core/jobs'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import prisma, { Prisma } from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import Color from 'color'
import { revalidatePath } from 'lib/services/revalidate-path'
import { resourceAction } from 'lib/utils/actions'
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
      if (!dataUri.startsWith('data:')) {
        // extract pathname and remove leading and
        const path = new URL(dataUri).pathname.slice(1)
        return prisma.image.findUnique({ where: { path } })
      }

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
            record.background_color && Color.hsl(record.background_color).hex()
        )
      },
      columnType: 'String',
      dependencies: ['background_color']
    })
    .replaceFieldWriting('BackgroundColor', async (value) => {
      if (!value) return { background_color: null }
      const hsl = Color.rgb(value).hsl().object()
      return { background_color: hsl }
    })

  Array(3)
    .fill(0)
    .forEach((_, i) => {
      collection.addField(`Color${i + 1}`, {
        async getValues(records) {
          return records.map(
            (record) => record.palette?.[i] && Color(record.palette[i]).hex()
          )
        },
        columnType: 'String',
        dependencies: ['palette']
      })
    })

  /* =============================================
   * ACTIONS
   * ============================================= */

  collection.addAction('↗️  View in BAF', {
    scope: 'Single',
    execute: async (context, result) => {
      const { slug } = await context.getRecord(['slug'])
      return result.redirectTo(appUrl(`/cookbooks/${slug}`))
    }
  })

  resourceAction({
    collection,
    name: '📤 Publish',
    successMessage: 'Published',
    async fn(id) {
      const book = await prisma.book.findUnique({
        where: { id: id.toString() },
        include: { submitter: true, authors: true, coverImage: true }
      })

      await prisma.book.update({
        where: { id: id.toString() },
        data: { status: 'published' }
      })

      if (
        !book?.submitter ||
        book?.status !== 'inReview' ||
        book.source !== 'submitted'
      )
        return

      await revalidatePath('cookbooks', book.slug)

      await inngest.send({
        name: 'jobs.email',
        data: {
          key: 'submissionPublished',
          props: {
            author: book.authors.map((a) => a.name).join(' • '),
            coverUrl: book.coverImage
              ? imageUrl(book.coverImage?.path)
              : undefined,
            slug: book.slug,
            title: book.title
          }
        },
        user: book.submitter
      })
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
        async options(_context, searchValue) {
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

      if (!jobId) return result.error('Job is required')

      const job = await prisma.job.findUnique({ where: { id: jobId } })
      const tag = context.formValues.Assistant ? 'Assistant' : undefined
      const profileIdOrName = context.formValues.Name

      if (!profileIdOrName) return result.error('Name is required')

      let profileId: string
      if (profileIdOrName.startsWith('||')) {
        const name = profileIdOrName.slice(2, -2)
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

      return result.success('🎉 Collaborator added')
    }
  })

  collection.addAction('🖼️ Generate missing palettes', {
    scope: 'Global',
    execute: async (_, result) => {
      const books = await prisma.book.findMany({
        where: {
          coverImage: { isNot: null },
          backgroundColor: { equals: Prisma.AnyNull }
        },
        select: { id: true }
      })

      await Promise.all(
        books.map(async ({ id }) =>
          inngest.send({
            name: 'book.updated',
            data: { id, coverImageChanged: true }
          })
        )
      )

      return result.success(`🔄 ${books.length} covers queued for generation`)
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

  collection.addHook('Before', 'Update', async (context) => {
    if (context.patch.title) context.patch.slug = slugify(context.patch.title)
    context.patch.updated_at = new Date().toISOString()
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
    revalidatePath('')
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
    const records = await context.collection.list(context.filter, [
      'id',
      'slug'
    ])
    await Promise.all(
      records.flatMap(async (record) => [
        updateProfiles(record.id),
        inngest.send({
          name: 'book.updated',
          data: { id: record.id, coverImageChanged: !!context.patch.Cover }
        }),
        revalidatePath('cookbooks', record.slug)
      ])
    )
    revalidatePath('')
  })

  collection.addHook('After', 'Delete', async () => {
    await revalidatePath('')
  })
}
