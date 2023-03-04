import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useCurrentUser = () => {
  const session = useSession()
  if (session.status !== 'authenticated') return null

  return session.data.user
}

export const useProtected = (ifUnauthenticated: () => void) => {
  const session = useSession()

  useEffect(() => {
    if (session.status !== 'unauthenticated') ifUnauthenticated()
  }, [session.status]) // eslint-disable-line react-hooks/exhaustive-deps
}
