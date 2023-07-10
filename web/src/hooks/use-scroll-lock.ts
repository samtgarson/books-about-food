import { useEffect } from 'react'

export const useScrollLock = () => {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = 'auto'
    }
  }, [])
}
