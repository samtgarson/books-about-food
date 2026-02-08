import { appUrl } from '@books-about-food/shared/utils/app-url'

export const deHyperlinkUrl = (link: string) => {
  const cleaned = link.split(/([:?.])/).join('&#65279;')
  return cleaned
}

export const assetUrl = (path: string) =>
  process.env.NODE_ENV === 'production' ? appUrl(path) : `/static${path}`
