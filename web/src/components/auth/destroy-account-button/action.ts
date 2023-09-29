'use server'

import { revalidatePath } from 'next/cache'
import { destroyAccount } from 'src/services/auth/destroy-account'

export async function action(provider: string) {
  await destroyAccount.call({ provider })
  revalidatePath('/account')
}
