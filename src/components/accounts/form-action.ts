'use server'

import { revalidatePath } from 'next/cache'
import { updateSession } from 'src/app/(frontend)/auth/actions'
import { updateUser } from 'src/core/services/users/update-user'
import { call } from 'src/utils/service'

export const action = async (input: unknown) => {
  const result = await call(updateUser, input)
  if (result.success) {
    revalidatePath('/accounts')
    await updateSession()
  }

  return result
}
