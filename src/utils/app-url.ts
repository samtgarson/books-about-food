export function appUrl(path?: string) {
  return new URL(path || '', baseUrl()).toString()
}

function baseUrl() {
  let url = process.env.BASE_URL
  if (process.env.RAILWAY_PUBLIC_DOMAIN)
    url ||= `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  if (!url) throw new Error('BASE_URL not set in environment')
  return url
}
