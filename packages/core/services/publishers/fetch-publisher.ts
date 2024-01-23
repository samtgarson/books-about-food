import prisma from '@books-about-food/database'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { Service } from '../base'
import { publisherIncludes } from '../utils'

export const fetchPublisher = new Service(
  z.object({ slug: z.string() }),
  async function ({ slug } = {}) {
    const raw = await prisma.publisher.findUnique({
      where: { slug },
      include: publisherIncludes
    })

    if (raw) return new Publisher(raw)
  }
)
