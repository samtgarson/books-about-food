import { z } from 'zod'
import { AuthedService } from '../base'
import { extractMemberships, extractRole } from './utils'

export type UpdateUserInput = z.infer<typeof updateUser.input>

export const updateUser = new AuthedService(
  z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional()
  }),
  async (params, { payload, user }) => {
    const data: Record<string, unknown> = params

    if (params.email && params.email !== user.email) {
      data.emailVerified = false
    }

    const { id, name, email, image, role, emailVerified, memberships } =
      await payload.update({
        collection: 'users',
        id: user.id,
        data,
        depth: 1,
        overrideAccess: true
      })

    const publishers = extractMemberships(memberships?.docs)

    return {
      id,
      name,
      email,
      image: image ?? null,
      emailVerified,
      role: extractRole(role),
      publishers
    }
  }
)
