import { useCallback, useEffect, useState } from 'react'

export const usePromise = <
  T extends Record<string, unknown> | unknown[] | unknown
>(
  input: () => Promise<T>,
  defaultValue: T,
  deps: unknown[] = [input]
) => {
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState<T | null>(defaultValue)

  useEffect(() => {
    const fetchData = async () => {
      const data = await input()
      setValue(data)
      setLoading(false)
    }

    fetchData()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  const revalidate = useCallback(async () => {
    const data = await input()
    setValue(data)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, value: value ?? defaultValue, revalidate, setValue }
}
