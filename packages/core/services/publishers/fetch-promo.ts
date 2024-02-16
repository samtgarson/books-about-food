import prisma from '@books-about-food/database'
import z from 'zod'
import { Promo } from '../../models/promo'
import { Service } from '../base'
import { promoIncludes } from '../utils'

export const fetchPromo = new Service(
  z.object({ publisherSlug: z.string() }),
  async function ({ publisherSlug } = {}) {
    const data = await prisma.promo.findMany({
      where: {
        publisher: { slug: publisherSlug },
        OR: [{ until: { gt: new Date() } }, { until: { equals: null } }]
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: promoIncludes
    })

    return data.map((promo) => new Promo(promo))[0]
  }
)
