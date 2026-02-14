export function appUrl(path?: string) {
  return new URL(path || '', baseUrl()).toString()
}

function baseUrl() {
  let url = process.env.BASE_URL
  if (process.env.VERCEL_URL) url ||= `https://${process.env.VERCEL_URL}`
  if (!url) throw new Error('BASE_URL not set in environment')
  return url
}
