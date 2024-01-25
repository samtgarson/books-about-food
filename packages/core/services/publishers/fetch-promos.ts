import prisma from '@books-about-food/database'
import z from 'zod'
import { Promo } from '../../models/promo'
import { Service } from '../base'
import { promoIncludes } from '../utils'

export const fetchPromos = new Service(
  z.object({ publisherSlug: z.string() }),
  async function ({ publisherSlug } = {}) {
    const data = await prisma.promo.findMany({
      where: { publisher: { slug: publisherSlug } },
      include: promoIncludes
    })

    return data.map((promo) => new Promo(promo))
  }
)
