import { useParams, usePathname, useSearchParams } from 'next/navigation'

// Replaces dynamic segment values in a pathname with their param names,
// e.g. `/books/123` + `{ id: '123' }` -> `/books/[id]`
function computeRoute(
  pathname: string,
  pathParams: Record<string, string | string[]>
): string {
  if (!pathname || !pathParams) return pathname

  let result = pathname
  try {
    const entries = Object.entries(pathParams)

    for (const [key, value] of entries) {
      if (Array.isArray(value)) continue
      const matcher = turnValueToRegExp(value)
      if (matcher.test(result)) result = result.replace(matcher, `/[${key}]`)
    }

    for (const [key, value] of entries) {
      if (!Array.isArray(value)) continue
      const matcher = turnValueToRegExp(value.join('/'))
      if (matcher.test(result)) result = result.replace(matcher, `/[...${key}]`)
    }

    return result
  } catch {
    return pathname
  }
}

function turnValueToRegExp(value: string): RegExp {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const useRoute = (): string => {
  const params = useParams()
  const searchParams = useSearchParams()
  const path = usePathname()

  const finalParams = {
    ...Object.fromEntries(searchParams.entries()),
    ...Object.keys(params || {}).reduce(
      (acc, key) => ({
        ...acc,
        [key]: params[key]?.toString()
      }),
      {}
    )
  }

  return params ? computeRoute(path, finalParams) || path : path
}
