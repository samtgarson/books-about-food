import { updateSession } from 'app/(frontend)/auth/actions'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useUpdateSession() {
  const { status } = useSession()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    setReady(true)
  }, [status])

  const update = useCallback(async () => {
    if (!ready) return
    const updated = await updateSession()
    return updated?.user
  }, [ready])

  return useMemo(() => ({ update, ready }), [update, ready])
}
