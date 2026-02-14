import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useMergeParams(reset?: boolean) {
  const search = useSearchParams()
  const pathName = usePathname() || ''

  const fn = useCallback(
    function (toMerge: { [key: string]: unknown }) {
      const params = reset
        ? new URLSearchParams()
        : new URLSearchParams(Array.from(search.entries()))
      params.delete('page')

      // do not mix old and new params
      for (const key of Object.keys(toMerge)) {
        params.delete(key)
      }

      for (const [key, value] of Object.entries(toMerge)) {
        if (value === undefined || value === null) continue

        if (Array.isArray(value)) {
          // Handle array values - append each item
          for (const item of value) {
            params.append(key, stringify(item))
          }
        } else {
          // Handle single values
          params.append(key, stringify(value))
        }
      }

      return [pathName, params.toString()].filter(Boolean).join('?')
    },
    [reset, search, pathName]
  )

  return fn
}

function stringify(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}

export function prettyWebsiteLabel(url: string) {
  try {
    const hostname = new URL(url).hostname
    if (hostname.endsWith('linkedin.com')) return 'LinkedIn'
    return hostname
  } catch {
    return ''
  }
}
