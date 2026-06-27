import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const destroyAccount = new AuthedService(
  z.object({ provider: z.string() }),
  async ({ provider }, { user, payload }) => {
    const { docs } = await payload.find({
      collection: 'accounts',
      where: {
        user: { equals: user.id },
        providerId: { equals: provider }
      },
      limit: 1
    })

    if (docs.length === 0) return { count: 0 }

    await payload.delete({
      collection: 'accounts',
      id: docs[0].id
    })

    return { count: 1 }
  }
)
