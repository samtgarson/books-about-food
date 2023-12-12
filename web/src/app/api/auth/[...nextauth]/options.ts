import prisma from '@books-about-food/database'
import { inngest } from '@books-about-food/jobs'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

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
  }
}
