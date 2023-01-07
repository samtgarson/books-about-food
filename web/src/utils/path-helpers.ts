export const addParam = (
  path: string,
  key: string,
  value?: string | number | null
) => {
  const url = new URL(path, 'https://booksaboutfood.com')
  if (typeof value === 'undefined' || value === null || value === '') {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value.toString())
  }
  return `${url.pathname}${url.search}`
}

export const pathFor = (
  base: string,
  params: Record<string, string | number | undefined>
) => {
  return Object.keys(params).reduce((path, key) => {
    const val = params[key]
    return val ? addParam(path, key, val) : path
  }, base)
}
