import { oAuthProtectedResourceMetadata } from 'better-auth/plugins'
import { mcpAuth } from 'src/auth'

// Protected resource metadata for /mcp. Also served at
// /.well-known/oauth-protected-resource/mcp, where some MCP clients look.
export const GET = oAuthProtectedResourceMetadata(mcpAuth())
