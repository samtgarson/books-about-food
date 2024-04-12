import { AuthConfig } from '@auth/core'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import GoogleProvider from 'next-auth/providers/google'

export const authConfig = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline'
        }
      },
      allowDangerousEmailAccountLinking: true,
      redirectProxyUrl:
        process.env.NODE_ENV === 'development' ? undefined : appUrl('/api/auth')
    })
  ],
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  }
} satisfies AuthConfig
