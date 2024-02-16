'use client'

import { useEffect } from 'react'
import { useUpdateSession } from 'src/hooks/use-update-session'

export function RefreshSession() {
  const updateSession = useUpdateSession()

  useEffect(() => {
    if (!updateSession.ready) return
    updateSession.update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSession.ready]) // Changing these can cause infinite loops

  return null
}
