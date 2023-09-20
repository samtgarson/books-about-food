export const appURl =
  process.env.NEXTAUTH_URL ||
  `https://${process.env.VERCEL_URL}` ||
  'http:localhost:5000'
