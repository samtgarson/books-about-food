export const mergeParams = (
  newParams: Record<string, unknown>,
  path?: string,
  params?: URLSearchParams
) => {
  let definedPath: string
  let definedParams: URLSearchParams
  if (typeof window !== 'undefined') {
    definedPath = path || window.location.pathname
    definedParams = params || new URLSearchParams(window.location.search)
  } else {
    definedPath = path || '/'
    definedParams = params || new URLSearchParams()
  }

  definedParams.delete('page')

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined') {
      definedParams.delete(key)
    } else {
      if (Array.isArray(value)) {
        definedParams.delete(key)
        value.forEach((v) => definedParams.append(key, v))
      } else definedParams.set(key, `${value}`)
    }
  })

  return [definedPath, definedParams.toString()].filter(Boolean).join('?')
}

export function prettyWebsiteLabel(url: string) {
  try {
    const hostname = new URL(url).hostname
    if (hostname.endsWith('linkedin.com')) return 'LinkedIn'
    return hostname
  } catch (e) {
    return ''
  }
}
