export const websites = [
  'Amazon',
  'Edelweiss+',
  'Bookshop.org',
  'Worldcat',
  'AbeBooks'
] as const

export type Website = (typeof websites)[number]

export function isWebsite(value: string): value is Website {
  return websites.includes(value as Website)
}
