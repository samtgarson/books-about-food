import { skipCSRFCheck } from '@auth/core'
import type { Adapter } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@books-about-food/database'
import { inngest } from '@books-about-food/jobs'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import NextAuth, { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  skipCSRFCheck:
    process.env.NODE_ENV === 'development' ? skipCSRFCheck : undefined,
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
        process.env.NODE_ENV === 'development'
          ? undefined
          : 'https://www.booksaboutfood.info/api/auth'
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
        try {
          const user = await prisma.user.findUnique({
            where: { email }
          })
          const newUser = !user || !user?.emailVerified

          await inngest.send({
            name: 'jobs.email',
            data: { key: 'verifyEmail', props: { url, newUser } },
            user: user || { email }
          })
          console.log(`Sent verification email to ${email}`)
        } catch (error) {
          console.error(`Error sending verification email to ${email}: `, error)
        }
      }
    }
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }

      if (session && trigger === 'update') {
        token.userId = session.user.id
        token.role = session.user.role
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...(session.user ?? {}),
          email: token.email,
          name: token.name,
          id: token.userId,
          role: token.role
        }
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  }
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  ...actions
} = NextAuth({
  ...authOptions,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt'
  }
})
