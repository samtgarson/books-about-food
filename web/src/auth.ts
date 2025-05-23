import { PrismaAdapter } from '@auth/prisma-adapter'
import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import NextAuth from 'next-auth'
import { identify } from './lib/tracking/identify'
import { track } from './lib/tracking/track'
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
          if (process.env.NODE_ENV === 'development') {
            console.log(`Sending verification email to ${email} at ${url}`)
          }
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
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      const db = await prisma.user.findUnique({
        where: { id: user?.id || token.userId },
        include: { memberships: { select: { publisherId: true } } }
      })
      if (!db) return token

      token.email = db.email
      token.name = db.name
      token.userId = db.id
      token.role = db.role
      token.image = db?.image || undefined
      token.publishers = db.memberships.map((m) => m.publisherId)

      return token
    }
  },
  events: {
    async signIn({ user, isNewUser, account }) {
      await Promise.all([
        identify(user),
        track('Signed in', {
          'First Time': !!isNewUser,
          userId: user.id,
          Provider: account?.provider
        })
      ])
    }
  }
})
