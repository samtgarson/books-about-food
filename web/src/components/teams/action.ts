'use server'

import { createInvite } from '@books-about-food/core/services/teams/create-invite'
import { CreateInviteInput } from '@books-about-food/core/services/teams/create-invite-schema'
import { revalidatePath } from 'next/cache'
import { call } from 'src/utils/service'
import { parseAppError } from '../form/utils'

export async function send({
  teamSlug,
  ...data
}: CreateInviteInput & { teamSlug: string }) {
  const result = await call(createInvite, data)
  if (result.success) {
    revalidatePath(`/teams/${teamSlug}/settings`)
    return
  }
  return parseAppError(
    result.errors,
    {
      email: {
        UniqueConstraintViolation: 'This email is already invited to this team.'
      }
    },
    { team_id: 'email' }
  )
}
