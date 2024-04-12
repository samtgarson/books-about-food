import { updateSession } from 'app/auth/actions'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return useMemo(() => ({ update, ready }), [update, ready])
}
