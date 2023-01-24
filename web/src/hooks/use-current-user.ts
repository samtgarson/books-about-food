import { useSession } from 'next-auth/react'

export const useCurrentUser = () => {
  const session = useSession()
  if (session.status !== 'authenticated') return null

  return session.data.user
}
