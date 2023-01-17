export const normalizeLink = (link?: string) => {
  if (!link) return undefined
  if (link.startsWith('http')) return link
  return `https://${link}`
}
