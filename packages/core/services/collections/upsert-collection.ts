import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import z from 'zod'
import { Collection } from '../../models/collection'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { fetchPublisher } from '../publishers/fetch-publisher'
import { collectionIncludes } from '../utils'
import { AppError } from '../utils/errors'
import { upsertCollectionSchema } from './schemas/upsert-collection'

export type UpsertCollectionInput = z.infer<typeof upsertCollectionSchema>

export const upsertCollection = new AuthedService(
  upsertCollectionSchema,
  async function ({ publisherSlug, ...attrs }, user) {
    const { data: publisher } = await fetchPublisher.call({
      slug: publisherSlug
    })
    if (!publisher || !can(user, publisher).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to update this publisher.'
      )
    }

    const data = await upsert(attrs, publisher.id)
    return new Collection(data)
  }
)

async function upsert(
  { id, title, bookIds }: Omit<UpsertCollectionInput, 'publisherSlug'>,
  publisherId: string
) {
  const collectionItemData = bookIds.map((bookId, i) => ({ bookId, order: i }))
  if (id) {
    return await prisma.collection.update({
      where: { id, publisherId },
      include: collectionIncludes,
      data: {
        title,
        collectionItems: {
          deleteMany: {},
          createMany: { data: collectionItemData }
        }
      }
    })
  }

  return await prisma.collection.create({
    include: collectionIncludes,
    data: {
      title,
      slug: slugify(title),
      publisherId: publisherId,
      collectionItems: { createMany: { data: collectionItemData } }
    }
  })
}
