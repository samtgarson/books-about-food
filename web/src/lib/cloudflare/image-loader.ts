//

import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { ImageLoaderProps } from 'next/image'

// Docs: https://developers.cloudflare.com/images/url-format
export default function cloudflareLoader({
  src,
  width,
  quality,
  format = 'auto'
}: ImageLoaderProps & { format?: string }): string {
  if (src.startsWith('/_next')) return src
  if (src.startsWith('http')) src = new URL(src).pathname
  else if (!src.startsWith('/')) src = `/${src}`

  let params = `w=${normalizeWidth(width)},fit=scale-down`
  if (quality) params += `,q=${quality}`
  if (format) params += `,f=${format}`

  return imageUrl(`/cdn-cgi/image/${params}${src}`)
}

const widths = [50, 200, 500, 800, 1200]

function normalizeWidth(value?: number): number {
  let result = 1000
  if (!value) return result

  for (const width of widths) {
    if (width >= value) {
      result = width
      break
    }
  }

  return result
}
