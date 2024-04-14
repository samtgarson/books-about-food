import { useParams, usePathname, useSearchParams } from 'next/navigation'

// https://github.com/vercel/speed-insights/blob/main/packages/web/src/nextjs/utils.ts
export const useRoute = (): string | null => {
  const params = useParams()
  const searchParams = useSearchParams()
  const path = usePathname()

  const finalParams = {
    ...Object.fromEntries(searchParams.entries()),
    ...(params || {})
  }

  return params ? computeRoute(path, finalParams) : path
}

function computeRoute(
  pathname: string | null,
  pathParams: Record<string, string | string[]> | null
): string | null {
  if (!pathname || !pathParams) {
    return pathname
  }

  let result = pathname

  try {
    for (const [key, valueOrArray] of Object.entries(pathParams)) {
      const isValueArray = Array.isArray(valueOrArray)
      const value = isValueArray ? valueOrArray.join('/') : valueOrArray
      const expr = isValueArray ? `...${key}` : key

      const matcher = new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`)
      if (matcher.test(result)) {
        result = result.replace(matcher, `/[${expr}]`)
      }
    }

    return result
  } catch (e) {
    return pathname
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
