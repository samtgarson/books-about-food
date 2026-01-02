'use server'

import { revalidatePath } from 'next/cache'
import { createInvite } from 'src/core/services/memberships/create-invite'
import { CreateInviteInput } from 'src/core/services/memberships/schemas/create-invite'
import { call } from 'src/utils/service'
import { parseAppError } from '../form/utils'

export async function send({
  publisherSlug,
  ...data
}: CreateInviteInput & { publisherSlug: string }) {
  const result = await call(createInvite, data)
  if (result.success) {
    revalidatePath(`/account/publishers/${publisherSlug}`)
    return
  }
  return parseAppError(
    result.errors,
    {
      email: {
        UniqueConstraintViolation:
          'This email is already invited to this publisher.'
      }
    },
    { publisher_id: 'email' }
  )
}
