import { MembershipRole } from '@books-about-food/database/client'
import z from 'zod'

export const createInviteSchema = z.object({
  publisherId: z.string(),
  email: z.email(),
  role: z.enum(MembershipRole).default(MembershipRole.member)
})

export type CreateInviteInput = z.infer<typeof createInviteSchema>
