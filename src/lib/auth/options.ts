import { nextCookies } from 'better-auth/next-js'
import { customSession, magicLink } from 'better-auth/plugins'
import type { PayloadAuthOptions } from 'payload-auth/better-auth/plugin'
import { appUrl } from 'src/utils/app-url'

// NOTE: `getPayloadClient`, `inngest` and `extractMemberships` are imported
// lazily inside the callbacks below. They each transitively import
// `payload.config`, so importing them at module scope creates a circular
// dependency (payload.config → options → payload.config) that throws a TDZ
// "Cannot access 'betterAuthPluginOptions' before initialization" when the
// config is loaded via tsx (e.g. `payload migrate`).

const baseURL = appUrl()

export const betterAuthPluginOptions: PayloadAuthOptions = {
  betterAuthOptions: {
    baseURL,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        try {
          const { inngest } = await import('src/jobs')
          if (process.env.NODE_ENV === 'development') {
            console.log(`Sending verification email to ${user.email} at ${url}`)
          }
          await inngest.send({
            name: 'jobs.email',
            data: { key: 'verifyEmail', props: { url, email: user.email } },
            user: { email: user.email }
          })
          console.log(`Sent verification email to ${user.email}`)
        } catch (error) {
          console.error(
            `Error sending verification email to ${user.email}: `,
            error
          )
        }
      },
      autoSignInAfterVerification: true
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google']
      }
    },
    emailAndPassword: {
      enabled: false
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60
      }
    },
    plugins: [
      magicLink({
        async sendMagicLink({ email, url }) {
          try {
            const { inngest } = await import('src/jobs')
            if (process.env.NODE_ENV === 'development') {
              console.log(`Sending magic link to ${email} at ${url}`)
            }
            await inngest.send({
              name: 'jobs.email',
              data: { key: 'verifyEmail', props: { url, email } },
              user: { email }
            })
            console.log(`Sent magic link to ${email}`)
          } catch (error) {
            console.error(`Error sending magic link to ${email}: `, error)
          }
        },
        expiresIn: 60 * 10
      }),
      customSession(async ({ user, session }) => {
        const { getPayloadClient } =
          await import('src/core/services/utils/payload')
        const { extractMemberships } =
          await import('src/core/services/users/utils')
        const payload = await getPayloadClient()
        const fullUser = await payload.findByID({
          collection: 'users',
          id: user.id,
          depth: 1,
          overrideAccess: true
        })
        const publishers = extractMemberships(fullUser.memberships?.docs)
        return {
          user: { ...user, publishers },
          session
        }
      }),
      nextCookies()
    ]
  },
  users: {
    slug: 'users',
    roles: ['user', 'admin', 'waitlist'] as const,
    allowedFields: ['name', 'email'],
    collectionOverrides: ({ collection }) => {
      for (const field of collection.fields) {
        if (
          'name' in field &&
          field.name === 'email' &&
          field.type === 'email'
        ) {
          if (!field.admin) field.admin = {}
          if (!field.admin.components) field.admin.components = {}
          field.admin.components.Cell = {
            path: 'src/payload/components/fields/custom-title-cell.tsx',
            serverProps: {
              imageAttributeName: 'image',
              imageShape: 'round',
              directSrc: true
            }
          }
        }
      }
      return collection
    }
  },
  sessions: {
    slug: 'sessions'
  },
  accounts: {
    slug: 'accounts'
  },
  verifications: {
    slug: 'verifications'
  }
}
