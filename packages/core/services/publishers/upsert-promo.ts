import prisma from '@books-about-food/database'
import z from 'zod'
import { Promo } from '../../models/promo'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { promoIncludes } from '../utils'
import { AppError } from '../utils/errors'
import { fetchPublisher } from './fetch-publisher'
import { upsertPromoSchema } from './schemas/upsert-promo'

export type UpsertPromoInput = z.infer<typeof upsertPromoSchema>

export const upsertPromo = new AuthedService(upsertPromoSchema, async function (
  { publisherSlug, ...attrs } = {},
  user
) {
  const { data: publisher } = await fetchPublisher.call({ slug: publisherSlug })
  if (!publisher || !can(user, publisher).update) {
    throw new AppError(
      'Forbidden',
      'You do not have permission to update this publisher.'
    )
  }

  const data = await upsert(attrs, publisher.id)
  return new Promo(data)
})

async function upsert(
  { id, title, bookIds }: Omit<UpsertPromoInput, 'publisherSlug'>,
  publisherId: string
) {
  const promoItemData = bookIds.map((bookId, i) => ({ bookId, order: i }))
  if (id) {
    return await prisma.promo.update({
      where: { id },
      include: promoIncludes,
      data: {
        title,
        promoItems: {
          deleteMany: {},
          createMany: { data: promoItemData }
        }
      }
    })
  }

  return await prisma.promo.create({
    include: promoIncludes,
    data: {
      title,
      publisherId: publisherId,
      promoItems: { createMany: { data: promoItemData } }
    }
  })
}
