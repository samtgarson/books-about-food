import { useCallback } from 'react'
import { authClient } from 'src/lib/auth/client'

export function useUpdateSession() {
  const session = authClient.useSession()

  const update = useCallback(async () => {
    await session.refetch()
    return session.data?.user
  }, [session])

  return {
    update,
    ready: !session.isPending
  }
}
