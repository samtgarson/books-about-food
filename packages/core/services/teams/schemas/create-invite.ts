import { MembershipRole } from '@books-about-food/database'
import z from 'zod'

export const createInviteSchema = z.object({
  teamId: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(MembershipRole).default(MembershipRole.member)
})

export type CreateInviteInput = z.infer<typeof createInviteSchema>
