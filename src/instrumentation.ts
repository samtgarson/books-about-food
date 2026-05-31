export async function register() {
  // Sentry integration will be re-added with @sentry/cloudflare
  // once the Workers deployment is stable
}

export function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath?: string; routeType?: string }
) {
  const err = error instanceof Error ? error : new Error(String(error))
  console.error(
    `[request error] ${request.method} ${request.path} (${context.routerKind}${context.routeType ? '/' + context.routeType : ''}):`,
    err.stack || err.message
  )
}
