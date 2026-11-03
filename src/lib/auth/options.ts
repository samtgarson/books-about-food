import { nextCookies } from 'better-auth/next-js'
import { customSession, magicLink, mcp } from 'better-auth/plugins'
import type { CollectionConfig } from 'payload'
import type { PayloadAuthOptions } from 'payload-auth/better-auth/plugin'
import { appUrl } from 'src/utils/app-url'
import { mcpRedirectAllowlist } from './mcp-redirects'

// Imported lazily in the callbacks below to avoid a circular dependency with payload.config.

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
      // OAuth for the MCP server at /mcp (see src/app/mcp/route.ts)
      mcpWithPayloadCollections(
        mcp({ loginPage: '/auth/sign-in', resource: appUrl('/mcp') })
      ),
      mcpRedirectAllowlist(),
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
  pluginCollectionOverrides: {
    oauthAccessTokens: clientIdAsText,
    oauthConsents: clientIdAsText
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

type McpPlugin = ReturnType<typeof mcp>

function renamed<F extends object>(field: F, fieldName: string) {
  return { ...field, fieldName }
}

/**
 * payload-auth stores the OAuth models in its own collections, but only maps
 * the model and field names for the oidc plugin, so map them for mcp too.
 */
function mcpWithPayloadCollections(plugin: McpPlugin): McpPlugin {
  const { oauthApplication, oauthAccessToken, oauthConsent } = plugin.schema
  return {
    ...plugin,
    schema: {
      oauthApplication: {
        ...oauthApplication,
        modelName: 'oauthApplications',
        fields: {
          ...oauthApplication.fields,
          userId: renamed(oauthApplication.fields.userId, 'user')
        }
      },
      oauthAccessToken: {
        ...oauthAccessToken,
        modelName: 'oauthAccessTokens',
        fields: {
          ...oauthAccessToken.fields,
          userId: renamed(oauthAccessToken.fields.userId, 'user'),
          clientId: renamed(oauthAccessToken.fields.clientId, 'client')
        }
      },
      oauthConsent: {
        ...oauthConsent,
        modelName: 'oauthConsents',
        fields: {
          ...oauthConsent.fields,
          userId: renamed(oauthConsent.fields.userId, 'user'),
          clientId: renamed(oauthConsent.fields.clientId, 'client')
        }
      }
    }
  }
}

/**
 * Better Auth stores the OAuth client's public client_id string on access
 * tokens and consents, but payload-auth makes the field a relationship to the
 * application's row id, so writes fail. Store it as text instead.
 */
function clientIdAsText({
  collection
}: {
  collection: CollectionConfig
}): CollectionConfig {
  return {
    ...collection,
    fields: collection.fields.map(function (field) {
      if (!('name' in field) || field.name !== 'client') return field
      return {
        name: 'client',
        type: 'text',
        index: true,
        // Keeps payload-auth's mapping to Better Auth's clientId field
        custom: field.custom,
        admin: { readOnly: true, description: 'OAuth client ID' }
      }
    })
  }
}
