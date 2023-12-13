import { Session } from 'next-auth/types'
import { actions } from 'src/auth'

/** Update session when in Route Handlers only */
export async function updateSession(user: Partial<Session['user']>) {
  const session = await actions.update({ user })

  return session
}
