import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchAccounts = new AuthedService(
  z.undefined(),
  async (_, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'accounts',
      where: {
        user: { equals: user.id }
      }
    })

    return docs
  }
)
