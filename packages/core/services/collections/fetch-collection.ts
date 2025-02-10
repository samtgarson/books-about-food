import prisma from '@books-about-food/database'
import z from 'zod'
import { Collection } from '../../models/collection'
import { Service } from '../base'
import { collectionIncludes } from '../utils'

export const fetchCollection = new Service(
  z.object({ slug: z.string().optional() }),
  async function ({ slug } = {}) {
    const data = await prisma.collection.findUniqueOrThrow({
      where: { slug, status: 'published' },
      include: collectionIncludes
    })

    return new Collection(data)
  }
)
