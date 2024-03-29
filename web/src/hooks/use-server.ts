import { useEffect, useState } from 'react'

export function useServer() {
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])

  return isServer
}
