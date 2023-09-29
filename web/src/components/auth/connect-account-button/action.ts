'use server'

import { revalidatePath } from 'next/cache'
import { destroyAccount } from 'src/services/auth/destroy-account'

export async function action(id: string) {
  await destroyAccount.call({ id })
  revalidatePath('/account')
}
