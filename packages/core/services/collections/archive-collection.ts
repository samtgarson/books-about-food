import prisma from '@books-about-food/database'
import z from 'zod'
import { Collection } from '../../models/collection'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { collectionIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const archiveCollection = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id }, user) {
    const existing = new Collection(
      await prisma.collection.findUniqueOrThrow({
        where: { id },
        include: collectionIncludes
      })
    )

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
    // await prisma.collection.update({
    //   where: { id },
    //   data: { until: new Date() }
    // })

    // return existing
  }
)
