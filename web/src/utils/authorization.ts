import { User } from 'next-auth/types'

export function userApproved(user?: User | null) {
  const splashEnabled = process.env.ENABLE_SPLASH === 'true'
  if (!splashEnabled) return true

  return user && user?.role !== 'waitlist'
}
