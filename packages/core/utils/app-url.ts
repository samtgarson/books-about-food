export const appUrl = () => {
  let url = process.env.NEXTAUTH_URL
  url ||= `https://${process.env.VERCEL_URL}`
  if (!url) throw new Error('NEXTAUTH_URL not set in environment')
  return url
}
