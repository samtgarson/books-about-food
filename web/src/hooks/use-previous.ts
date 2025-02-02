import { useEffect, useRef } from 'react'

export function usePrevious<V>(value: V) {
  const ref = useRef<V>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
