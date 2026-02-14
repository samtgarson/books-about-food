'use server'

import { unstable_update } from 'src/auth'
import { identify } from 'src/lib/tracking/identify'

export async function updateSession() {
  const updated = await unstable_update({})
  if (updated?.user) await identify(updated.user)
  return updated
}
