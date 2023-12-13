'use server'

import { destroyAccount } from '@books-about-food/core/services/auth/destroy-account'
import { revalidatePath } from 'next/cache'
import { call } from 'src/utils/service'

export async function action(provider: string) {
  await call(destroyAccount, { provider })
  revalidatePath('/account')
}
