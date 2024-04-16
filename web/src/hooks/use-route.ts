import { computeRoute } from '@vercel/speed-insights'
import { useParams, usePathname, useSearchParams } from 'next/navigation'

// https://github.com/vercel/speed-insights/blob/main/packages/web/src/nextjs/utils.ts
export const useRoute = (): string => {
  const params = useParams()
  const searchParams = useSearchParams()
  const path = usePathname()

  const finalParams = {
    ...Object.fromEntries(searchParams.entries()),
    ...(params || {})
  }

  return params ? computeRoute(path, finalParams) || path : path
}
