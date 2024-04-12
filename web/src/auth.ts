import { PrismaAdapter } from '@auth/prisma-adapter'
import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import NextAuth from 'next-auth'
import { identify } from './lib/tracking/identify'
import { authConfig } from './utils/auth-config'

export const {
  handlers: { GET, POST },
  auth,
  ...actions
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
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
          await inngest.send({
            name: 'jobs.email',
            data: { key: 'verifyEmail', props: { url, email } },
            user: { email }
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
        token.userId = user.id as string
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
  },
  events: {
    async signIn({ user }) {
      await identify(user)
    }
  }
})
