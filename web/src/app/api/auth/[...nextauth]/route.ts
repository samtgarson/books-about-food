import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { inngest } from 'core/gateways/inngest'
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
      },
      allowDangerousEmailAccountLinking: true
    }),
    {
      id: 'email',
      type: 'email',
      name: 'Email',
      from: '',
      server: '',
      maxAge: 60 * 10,
      options: {},
      async sendVerificationRequest({ url, identifier: email }) {
        const user = await unextended.user.findUnique({
          where: { email }
        })
        const newUser = !user?.emailVerified

        inngest.send({
          name: 'email',
          data: { key: 'verifyEmail', props: { url, newUser } },
          user
        })
      }
    }
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }

      return token
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.userId
        session.user.role = token.role
      }

      if (user) {
        session.user.id = user.id
        session.user.role = user.role
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  },
  events: {
    async createUser({ user }) {
      if (process.env.NODE_ENV !== 'production') return
      await unextended.user.update({
        where: { id: user.id },
        data: { role: 'waitlist' }
      })
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
