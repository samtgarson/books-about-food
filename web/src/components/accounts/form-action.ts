'use server'

import { revalidatePath } from 'next/cache'
import { updateUser } from 'src/services/users/update-user'

export const action = async (input: Record<string, unknown>) => {
  const result = await updateUser.parseAndCall(input)
  if (result.success) revalidatePath('/accounts')

  return result
}
