'use server'

import { revalidatePath } from 'next/cache'
import { destroyAccount } from 'src/core/services/auth/destroy-account'
import { call } from 'src/utils/service'

export async function action(provider: string) {
  await call(destroyAccount, { provider })
  revalidatePath('/account')
}
