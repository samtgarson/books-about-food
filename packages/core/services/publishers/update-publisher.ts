import prisma from '@books-about-food/database'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'
import { fetchPublisher } from './fetch-publisher'

export type UpdatePublisherInput = z.infer<typeof updatePublisher.input>

export const updatePublisher = new AuthedService(
  z.object({
    slug: z.string(),
    logo: z.string().nullish()
  }),
  async function ({ slug, logo } = {}, user) {
    const { data: publisher } = await fetchPublisher.call({ slug })

    if (!publisher) throw new AppError('NotFound', 'Publisher not found')
    if (!can(user, publisher).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to update this publisher'
      )
    }

    const updated = await prisma.publisher.update({
      data: { logo: logoProps(logo) },
      where: { slug },
      include: publisherIncludes
    })

    return new Publisher(updated)
  }
)

function logoProps(id?: string | null) {
  if (id === null) return { disconnect: true }
  if (id) return { connect: { id } }
  return undefined
}
