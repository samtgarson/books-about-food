import { RequiredDataFromCollectionSlug } from 'payload'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { sanitizeHtml } from '../utils/html'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'
import { fetchPublisher } from './fetch-publisher'

export type UpdatePublisherInput = z.infer<typeof updatePublisher.input>

export const updatePublisher = new AuthedService(
  z.object({
    slug: z.string(),
    logo: z.string().nullish(),
    hiddenBooks: z.array(z.string()).optional(),
    description: z.string().nullish(),
    website: z.string().nullish(),
    instagram: z.string().nullish()
  }),
  async function ({ slug, logo, description, ...data }, ctx) {
    const { payload, user } = ctx
    const { data: publisher } = await fetchPublisher.call({ slug }, ctx)

    if (!publisher) throw new AppError('NotFound', 'Publisher not found')
    if (!can(user, publisher).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to update this publisher'
      )
    }

    // Build update data
    const updateData: Partial<RequiredDataFromCollectionSlug<'publishers'>> = {
      ...data,
      description: sanitizeHtml(description)
    }

    // Handle logo (null = remove, string = set, undefined = no change)
    if (logo === null) {
      updateData.logo = null
    } else if (logo) {
      updateData.logo = logo
    }

    // Update publisher
    const updated = await payload.update({
      collection: 'publishers',
      id: publisher.id,
      data: updateData,
      depth: PUBLISHER_DEPTH,
      user
    })

    return new Publisher({ ...updated, claimed: publisher.claimed })
  }
)
