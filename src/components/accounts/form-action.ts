'use server'

import { revalidatePath } from 'next/cache'
import { updateUser } from 'src/core/services/users/update-user'
import { call } from 'src/utils/service'

export async function updateAccountAction(input: unknown) {
  const result = await call(updateUser, input)
  if (result.success) {
    revalidatePath('/account')
  }
  return result
}
