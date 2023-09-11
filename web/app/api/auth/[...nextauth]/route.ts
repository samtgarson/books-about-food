import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { unextended } from 'database'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getEnv } from 'shared/utils/get-env'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(unextended),
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
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId
      session.user.role = token.role

      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
