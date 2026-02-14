import z from 'zod'
import { Collection } from '../../models/collection'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { COLLECTION_DEPTH } from '../utils/payload-depth'

export const archiveCollection = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id }, { payload, user }) {
    const collection = await payload.findByID({
      collection: 'collections',
      id,
      depth: COLLECTION_DEPTH
    })

    if (!collection) {
      throw new AppError('NotFound', 'Collection not found')
    }

    const existing = new Collection(collection)
    if (!can(user, existing).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to archive this collection'
      )
    }

    throw new AppError(
      'ServerError',
      'Archiving collections is not yet implemented'
    )
    // await payload.update({
    //   collection: 'collections',
    //   id,
    //   data: { until: new Date().toISOString() }
    // })

    // return existing
  }
)
