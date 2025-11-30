'use server'

import { updateUser } from '@books-about-food/core/services/users/update-user'
import { updateSession } from 'app/auth/actions'
import { revalidatePath } from 'next/cache'
import { call } from 'src/utils/service'

export const action = async (input: unknown) => {
  const result = await call(updateUser, input)
  if (result.success) {
    revalidatePath('/accounts')
    await updateSession()
  }

  return result
}
