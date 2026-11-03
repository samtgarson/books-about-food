import { oAuthDiscoveryMetadata } from 'better-auth/plugins'
import { mcpAuth } from 'src/auth'

// OAuth server metadata for MCP clients connecting to /mcp
export const GET = oAuthDiscoveryMetadata(mcpAuth())
