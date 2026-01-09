import { slugify } from '@books-about-food/shared/utils/slugify'
import { BasePayload } from 'payload'
import z from 'zod'
import { Collection } from '../../models/collection'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { fetchPublisher } from '../publishers/fetch-publisher'
import { AppError } from '../utils/errors'
import { COLLECTION_DEPTH } from '../utils/payload-depth'
import { upsertCollectionSchema } from './schemas/upsert-collection'

export type UpsertCollectionInput = z.infer<typeof upsertCollectionSchema>

export const upsertCollection = new AuthedService(
  upsertCollectionSchema,
  async function ({ publisherSlug, ...attrs }, ctx) {
    const { user, payload } = ctx
    const { data: publisher } = await fetchPublisher.call(
      { slug: publisherSlug },
      ctx
    )
    if (!publisher || !can(user, publisher).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to update this publisher.'
      )
    }

    const data = await upsert(attrs, publisher.id, payload)
    return new Collection(data)
  },
  { cache: false }
)

async function upsert(
  { id, title, bookIds }: Omit<UpsertCollectionInput, 'publisherSlug'>,
  publisherId: string,
  payload: BasePayload
) {
  if (id) {
    return await payload.update({
      collection: 'collections',
      id,
      data: {
        title,
        books: bookIds // Payload handles ordering based on array position
      },
      depth: COLLECTION_DEPTH
    })
  }

  return await payload.create({
    collection: 'collections',
    data: {
      title,
      slug: slugify(title),
      publisher: publisherId,
      books: bookIds // Array order becomes _order in collections_rels
    },
    depth: COLLECTION_DEPTH
  })
}
