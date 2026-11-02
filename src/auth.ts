import type {
  oAuthDiscoveryMetadata,
  oAuthProtectedResourceMetadata,
  withMcpAuth
} from 'better-auth/plugins'
import { getPayloadAuth } from 'payload-auth/better-auth/plugin'
import payloadConfig from 'src/payload.config'

const payload = await getPayloadAuth(payloadConfig)

export const auth = payload.betterAuth

type McpAuth = Parameters<typeof withMcpAuth>[0] &
  Parameters<typeof oAuthDiscoveryMetadata>[0] &
  Parameters<typeof oAuthProtectedResourceMetadata>[0]

function hasMcpPlugin(
  instance: typeof auth
): instance is typeof auth & McpAuth {
  return [
    'getMcpSession',
    'getMcpOAuthConfig',
    'getMCPProtectedResource'
  ].every((endpoint) => endpoint in instance.api)
}

/**
 * The auth instance typed with the MCP plugin's endpoints, which payload-auth's
 * types don't carry through.
 */
export function mcpAuth() {
  if (!hasMcpPlugin(auth)) {
    throw new Error('The Better Auth MCP plugin is not enabled')
  }
  return auth
}
