import { z } from 'zod'
import { AuthedService } from '../base'

export type UpdateUserInput = z.infer<typeof updateUser.input>

export const updateUser = new AuthedService(
  z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional()
  }),
  async (params, { payload, user }) => {
    const data: Record<string, unknown> = params

    if (params.email && params.email !== user.email) {
      data.emailVerified = null
    }

    return payload.update({
      collection: 'users',
      id: user.id,
      data,
      depth: 0
    })
  }
)
