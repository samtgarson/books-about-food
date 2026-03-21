import { useParams, usePathname, useSearchParams } from 'next/navigation'

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function computeRoute(
  pathname: string,
  pathParams: Record<string, string | string[]>
): string {
  if (!pathname || !pathParams) return pathname

  let result = pathname
  try {
    const entries = Object.entries(pathParams)
    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        const matcher = new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`)
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[${key}]`)
        }
      }
    }
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const matcher = new RegExp(
          `/${escapeRegExp(value.join('/'))}(?=[/?#]|$)`
        )
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[...${key}]`)
        }
      }
    }
    return result
  } catch {
    return pathname
  }
}

export function useRoute(): string {
  const params = useParams()
  const searchParams = useSearchParams()
  const path = usePathname()

  const finalParams: Record<string, string | string[]> = {
    ...Object.fromEntries(searchParams.entries())
  }

  if (params) {
    for (const key of Object.keys(params)) {
      const val = params[key]
      if (val != null) {
        finalParams[key] = typeof val === 'string' ? val : val.join('/')
      }
    }
  }

  return params ? computeRoute(path, finalParams) || path : path
}
