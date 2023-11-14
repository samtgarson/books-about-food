import { getEnv } from '@books-about-food/shared/utils/get-env'
import { JWT, decode, encode } from 'next-auth/jwt'
import { cookies } from 'next/headers'

const sessionCookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

/** Get session when in Route Handlers & Server Actions */
export async function getSession() {
  const sessionCookie = cookies().get(sessionCookieName)
  if (!sessionCookie) return

  return await decode({
    token: sessionCookie.value,
    secret: getEnv('NEXTAUTH_SECRET')
  })
}

/** Update session when in Route Handlers only */
export async function updateSession(data: Partial<JWT>) {
  const session = await getSession()
  if (!session) return

  const newSession = await encode({
    secret: getEnv('NEXTAUTH_SECRET'),
    token: { ...session, ...data },
    maxAge: 30 * 24 * 60 * 60
  })

  cookies().set(sessionCookieName, newSession)

  return session
}
