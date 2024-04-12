'use server'

import { updateUser } from '@books-about-food/core/services/users/update-user'
import { updateSession } from 'app/auth/actions'
import { revalidatePath } from 'next/cache'
import { parseAndCall } from 'src/utils/service'

export const action = async (input: Record<string, unknown>) => {
  const result = await parseAndCall(updateUser, input)
  if (result.success) {
    revalidatePath('/accounts')
    await updateSession()
  }

  return result
}
