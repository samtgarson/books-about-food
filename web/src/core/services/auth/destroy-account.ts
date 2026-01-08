import { and, eq } from '@payloadcms/db-postgres/drizzle'
import { AuthedService } from 'src/core/services/base'
import { users_accounts } from 'src/payload/schema'
import { z } from 'zod'

export const destroyAccount = new AuthedService(
  z.object({ provider: z.string() }),
  async ({ provider }, { user, payload }) => {
    const res = await payload.db.drizzle
      .delete(users_accounts)
      .where(
        and(
          eq(users_accounts._parentID, user.id),
          eq(users_accounts.provider, provider)
        )
      )

    return { count: res.rowCount }
  }
)
