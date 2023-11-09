'use server'

import { updateUser } from 'core/services/users/update-user'
import { revalidatePath } from 'next/cache'

export const action = async (input: Record<string, unknown>) => {
  const result = await updateUser.parseAndCall(input)
  if (result.success) revalidatePath('/accounts')

  return result
}
