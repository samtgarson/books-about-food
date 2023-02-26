import { useEffect, useState } from 'react'

export const useDelayedFlag = (flag: boolean, delay: number) => {
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    if (!flag) {
      setDelayed(false)
      return
    }

    const timeout = setTimeout(() => {
      if (!flag) return
      setDelayed(true)
    }, delay)
    return () => clearTimeout(timeout)
  }, [flag, delay])

  return delayed
}
