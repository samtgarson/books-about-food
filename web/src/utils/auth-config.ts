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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id as string
        token.role = user.role
        token.image = user.image || undefined
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        // @ts-expect-error next-auth types are still weird
        session.user = {
          email: token.email,
          name: token.name || null,
          id: token.userId,
          role: token.role,
          image: token.picture || null,
          teams: token.teams
        }
      }

      return session
    }
  }
} satisfies AuthConfig
