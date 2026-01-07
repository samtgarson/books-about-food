import { JWT } from '@auth/core/jwt'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import GoogleProvider from 'next-auth/providers/google'
import type { EnrichedAuthConfig } from 'payload-authjs'
import { inngest } from 'src/core/jobs'
import { identify, IdentifyUser } from 'src/lib/tracking/identify'
import { track } from 'src/lib/tracking/track'

export const authConfig: EnrichedAuthConfig = {
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
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/account',
    error: '/auth/sign-in'
  },
  events: {
    async signIn({ user, isNewUser, account }) {
      if (!user?.id || !account) return

      await Promise.all([
        identify(user as IdentifyUser),
        track('Signed in', {
          'First Time': !!isNewUser,
          userId: user.id,
          Provider: account?.provider
        })
      ])
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (!user) return token

      const publishers = user.memberships?.docs?.flatMap((membership) =>
        typeof membership === 'string'
          ? []
          : typeof membership.publisher === 'string'
            ? membership.publisher
            : membership.publisher?.id
      )
      return {
        id: user.id as string,
        role: user.role,
        email: user.email!,
        name: user.name || undefined,
        picture: user.image || undefined,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        publishers
      } as JWT
    },
    async session({ session, token }) {
      if (token) {
        const { id, picture, publishers, role, name, email, emailVerified } =
          token

        session.userId = id
        session.user = {
          id,
          role,
          email,
          name,
          picture: picture || undefined,
          publishers,
          emailVerified: emailVerified ? new Date(emailVerified) : null
        }
      }

      return session
    }
  }
}
