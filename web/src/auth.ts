import type { Adapter } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import NextAuth, { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.image = user.image || undefined

        const db = await prisma.membership.findMany({
          where: { userId: user.id },
          select: { teamId: true }
        })
        token.teams = db.map((m) => m.teamId)
      }

      if (trigger === 'update') {
        const db = await prisma.user.findUnique({
          where: { id: token.userId },
          include: { memberships: { select: { teamId: true } } }
        })

        if (!db) return token
        token.role = db.role
        token.teams = db.memberships.map((m) => m.teamId)
      }

      return token
    },
    async session({ session, token, trigger }) {
      if (trigger === 'update') {
        console.log('session', session)
      }

      if (token) {
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
