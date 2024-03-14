export const appUrl = () => {
  let url = process.env.BASE_URL
  if (process.env.VERCEL_URL) url ||= `https://${process.env.VERCEL_URL}`
  if (!url) throw new Error('BASE_URL not set in environment')
  return url
}
