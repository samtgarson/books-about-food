export const appUrl = () => {
  const url = process.env.NEXTAUTH_URL
  if (!url) throw new Error('NEXTAUTH_URL not set in environment')
  return url
}
