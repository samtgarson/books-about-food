import { z } from 'zod'
import { extractMemberships, extractRole } from './utils'
import { AuthedService } from '../base'

export const fetchUser = new AuthedService(
  z.undefined(),
  async (_input, { payload, user: sessionUser }) => {
    const { id, name, email, image, role, emailVerified, memberships } =
      await payload.findByID({
        collection: 'users',
        id: sessionUser.id,
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
  },
  { cache: false }
)
