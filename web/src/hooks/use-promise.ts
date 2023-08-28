import { useCallback, useEffect, useState } from 'react'

export const usePromise = <
  T extends Record<string, unknown> | unknown[] | boolean | string | number
>(
  input: T | (() => Promise<T>),
  defaultValue: T,
  deps: unknown[] = [input]
) => {
  const [loading, setLoading] = useState(
    typeof input === 'function' ? true : false
  )
  const [value, setValue] = useState<T | null>(
    typeof input === 'function' ? null : input
  )

  useEffect(() => {
    if (typeof input !== 'function') return

    const fetchData = async () => {
      const data = await input()
      setValue(data)
      setLoading(false)
    }

    fetchData()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  const revalidate = useCallback(async () => {
    if (typeof input !== 'function') return
    const data = await input()
    setValue(data)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, value: value ?? defaultValue, revalidate }
}
