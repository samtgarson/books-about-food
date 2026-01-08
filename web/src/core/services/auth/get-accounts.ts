import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const fetchAccounts = new AuthedService(
  z.undefined(),
  async (_, { payload, user }) => {
    const dbUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 0
    })

    return dbUser.accounts || []
  }
)
