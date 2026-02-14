import { auth } from 'src/auth'
import { User } from 'src/core/types'

export const getSessionUser = async (): Promise<User | null> => {
  const session = await auth()
  if (!session?.user) return null

  return session.user
}
