//

// Docs: https://developers.cloudflare.com/images/url-format
export function cloudflareLoader(src: string, height?: number): string {
  if (src.startsWith('/_next')) return src

  const params = [`h=${normalizeHeight(height)}`, 'fit=scale-down']

  return new URL(
    `/cdn-cgi/image/${params.join(',')}/${src}`,
    process.env.S3_DOMAIN
  ).toString()
}

const heights = [50, 200, 500, 800, 1200]

function normalizeHeight(value?: number): number {
  let result = 1000
  if (!value) return result

  for (const height of heights) {
    if (height >= value) {
      result = height
      break
    }
  }

  return result
}
