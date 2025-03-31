import { useRef } from 'react'

// This function debounces the function passed to it, and returns a promise that resolves only after the debounce has completed.
export const useDebouncedPromise = <A extends Array<unknown>, R>(
  fn: (...args: A) => Promise<R>,
  delay: number
) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (...args: A): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId.current) clearTimeout(timeoutId.current)

      timeoutId.current = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error as Error)
        }
      }, delay)
    })
  }
}
