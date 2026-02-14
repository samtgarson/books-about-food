import { enum_memberships_role } from 'src/payload/schema'
import z from 'zod'

export const createInviteSchema = z.object({
  publisherId: z.string(),
  email: z.email(),
  role: z.enum(enum_memberships_role.enumValues).default('member')
})

export type CreateInviteInput = z.infer<typeof createInviteSchema>
