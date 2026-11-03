import type { BetterAuthPlugin } from 'better-auth'
import { APIError, createAuthMiddleware } from 'better-auth/api'

/**
 * Where Claude's MCP clients send the user back after signing in. claude.ai
 * and Claude Desktop use Anthropic's hosted callback; Claude Code and local
 * tools use a loopback address on a random port.
 */
const HOSTED_CALLBACKS = [
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback'
]
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]']

export function isAllowedMcpRedirect(value: unknown) {
  if (typeof value !== 'string') return false
  if (HOSTED_CALLBACKS.includes(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' && LOOPBACK_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

/**
 * The MCP plugin lets any client register itself and then issues sign-in
 * codes to a signed-in user without a consent screen. Only allowing Claude's
 * own redirect addresses stops another website from registering a client and
 * collecting a code from an admin's browser.
 */
export function mcpRedirectAllowlist(): BetterAuthPlugin {
  return {
    id: 'mcp-redirect-allowlist',
    hooks: {
      before: [
        {
          matcher(context) {
            return context.path === '/mcp/register'
          },
          handler: createAuthMiddleware(async function (ctx) {
            const body: unknown = ctx.body
            const uris =
              body && typeof body === 'object' && 'redirect_uris' in body
                ? body.redirect_uris
                : undefined
            if (
              !Array.isArray(uris) ||
              !uris.length ||
              !uris.every(isAllowedMcpRedirect)
            ) {
              throw new APIError('BAD_REQUEST', {
                error: 'invalid_redirect_uri',
                error_description:
                  'Only Claude MCP clients can connect to this server'
              })
            }
          })
        }
      ]
    }
  }
}
