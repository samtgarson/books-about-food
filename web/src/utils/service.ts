/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from 'react'
import {
  AuthedServiceContext,
  ServiceClass,
  ServiceContext,
  ServiceInput,
  ServiceReturn
} from 'src/core/services/base'
import { AppError } from 'src/core/services/utils/errors'
import { getPayloadClient } from 'src/core/services/utils/payload'
import hash from 'stable-hash'
import { parse, stringify } from 'superjson'
import { getOrPopulateKv } from './kv'
import { getSessionUser } from './user'

/**
 * Call a backend service with automatic authentication, caching, and validation.
 *
 * This function provides a unified interface for calling backend services with three
 * usage patterns:
 *
 * 1. **Services without arguments** - Optional args parameter for services with `z.undefined()` input
 * 2. **Services with typed arguments** - Provides IDE autocomplete and compile-time type checking
 * 3. **Services with unknown arguments** - Accepts `unknown` for runtime validation (e.g., form data)
 *
 * @template S - The service class type extending ServiceClass
 * @param service - The service instance to call (e.g., `fetchBook`, `updateUser`)
 * @param args - Arguments for the service (optional for services with no args, typed or unknown)
 *
 * @returns Promise resolving to ServiceResult<T> with either:
 *   - `{ success: true, data: T }` on success
 *   - `{ success: false, errors: AppErrorJSON[] }` on validation or execution failure
 *
 * @example
 * // Service with no arguments
 * const { data: features } = await call(fetchFeatures)
 *
 * @example
 * // Service with typed arguments (autocomplete works)
 * const { data: book } = await call(fetchBook, { slug: 'my-book' })
 *
 * @example
 * // Service with unknown arguments (runtime validation)
 * const result = await call(updateUser, formData)
 *
 * **Behavior:**
 * - **Validation**: Input is validated against the service's Zod schema
 * - **Authentication**: Authenticated services automatically receive the current user
 * - **Caching**: Non-authenticated services with a cache key are cached in Redis
 * - **Deduplication**: All calls are deduplicated per-request via React cache
 */
// Overload 1: Services with no args
export async function call<S extends ServiceClass<any, any>>(
  service: S,
  ...args: ServiceInput<S> extends undefined ? [] | [undefined] : never
): Promise<ServiceReturn<S>>

// Overload 2: Services with typed args - provides autocomplete
export async function call<S extends ServiceClass<any, any>>(
  service: S,
  args: ServiceInput<S>
): Promise<ServiceReturn<S>>

// Overload 3: Services with unknown args - for runtime validation
export async function call<S extends ServiceClass<any, any>>(
  service: S,
  args: unknown
): Promise<ServiceReturn<S>>

// Implementation
export async function call<S extends ServiceClass<any, any>>(
  service: S,
  ...args: [] | [unknown]
): Promise<ServiceReturn<S>> {
  const input = args[0]
  if (service.skipCacheCompletely) {
    return executeService(service, input)
  }
  // Stringify for React cache (needs primitives for shallow equality)
  const stringifiedArgs = stringify(input)

  // Pass primitives to React cache
  return cachedCall(service, stringifiedArgs)
}

// React cache requires primitive arguments for shallow equality comparison
const cachedCall = cache(_cachedCall)

async function _cachedCall<S extends ServiceClass<any, any>>(
  service: S,
  stringifiedArgs: string // Primitive for React cache
): Promise<ServiceReturn<S>> {
  // Parse stringified args back to object
  const args = parse(stringifiedArgs)

  const bypassCache = !!process.env.SKIP_REDIS_CACHE
  const shouldCache = !service.authed && !!service.cacheKey && !bypassCache

  if (!shouldCache) {
    return executeService(service, args)
  }

  // Hash for shorter, deterministic Redis keys
  const argsHash = hash(args)

  return getOrPopulateKv(
    ['svc', service.cacheKey, argsHash],
    () => executeService(service, args),
    {
      expiry: service.defaultCacheMaxAge,
      skipResult: (data) => !data.success
    }
  )
}

async function executeService<S extends ServiceClass<any, any>>(
  service: S,
  args: any
): Promise<ServiceReturn<S>> {
  // Get Payload client for all services
  const payload = await getPayloadClient()

  // Non-authenticated services
  if (!service.authed) {
    const context: ServiceContext = { payload }
    return service.call(args, context) as Promise<ServiceReturn<S>>
  }

  // Authenticated services - get user
  const user = await getSessionUser()
  if (user) {
    const context: AuthedServiceContext = { payload, user }
    return service.call(args, context) as Promise<ServiceReturn<S>>
  }

  return {
    success: false,
    errors: [
      new AppError(
        'Unauthorized',
        'Not authorized to perform this action'
      ).toJSON()
    ]
  } as ServiceReturn<S>
}
