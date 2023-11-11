'use server'

import { getUser } from 'src/utils/service'
import { updateSession } from 'src/utils/session'

export async function checkSession() {
  try {
    const user = await getUser()
    if (!user) return

    await updateSession({ role: user.role })
    return user.role
  } catch (error) {
    console.error(error)
  }
}
