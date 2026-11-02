import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { withMcpAuth } from 'better-auth/plugins'
import { mcpAuth } from 'src/auth'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { createMcpServer } from 'src/mcp/server'

/**
 * MCP server for Claude and other MCP clients. Clients sign in with OAuth
 * (Better Auth's MCP plugin), and only admins can use it.
 */
const handler = withMcpAuth(mcpAuth(), async function (req, session) {
  const payload = await getPayloadClient()
  const user = await payload.findByID({
    collection: 'users',
    id: session.userId,
    depth: 0,
    disableErrors: true
  })
  const roles: unknown[] = Array.isArray(user?.role) ? user.role : []
  if (!roles.includes('admin')) {
    return Response.json(
      {
        jsonrpc: '2.0',
        error: { code: -32003, message: 'Forbidden: admin access required' },
        id: null
      },
      { status: 403 }
    )
  }

  // Stateless: a fresh server and transport for each request.
  const server = createMcpServer(payload)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  })
  await server.connect(transport)
  return transport.handleRequest(req)
})

export { handler as DELETE, handler as GET, handler as POST }
