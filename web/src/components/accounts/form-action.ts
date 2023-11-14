'use server'

import { updateUser } from '@books-about-food/core/services/users/update-user'
import { revalidatePath } from 'next/cache'
import { parseAndCall } from 'src/utils/service'

export const action = async (input: Record<string, unknown>) => {
  const result = await parseAndCall(updateUser, input)
  if (result.success) revalidatePath('/accounts')

  return result
}
