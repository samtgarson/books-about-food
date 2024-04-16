const s3Host = process.env.S3_DOMAIN as string

type TrimArgs = {
  top: number
  right: number
  bottom: number
  left: number
}

// Docs: https://developers.cloudflare.com/images/url-format
export default function cloudflareLoader({
  src,
  width,
  quality,
  format = 'auto',
  trim
}: {
  src: string
  width: number
  quality?: number
  format?: string
  trim?: TrimArgs
}): string {
  if (src.startsWith('/_next')) return src
  if (src.startsWith('http')) src = new URL(src).pathname
  else if (!src.startsWith('/')) src = `/${src}`

  let params = `w=${normalizeWidth(width)},fit=scale-down`
  if (quality) params += `,q=${quality}`
  if (format) params += `,f=${format}`
  if (trim) params += `,${buildTrimArgs(trim)}`

  return new URL(`/cdn-cgi/image/${params}${src}`, s3Host).toString()
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

// https://developers.cloudflare.com/images/transform-images/transform-via-url/#trim
function buildTrimArgs(trim: TrimArgs) {
  return `trim=${trim.top};${trim.right};${trim.bottom};${trim.left}`
}
