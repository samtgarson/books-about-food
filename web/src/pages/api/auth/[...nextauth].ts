import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from 'database'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getEnv } from 'shared/utils/get-env'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId

      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  }
}

export default NextAuth(authOptions)
