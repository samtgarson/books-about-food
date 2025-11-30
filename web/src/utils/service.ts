/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ServiceClass,
  ServiceInput,
  ServiceReturn
} from '@books-about-food/core/services/base'
import { AppError } from '@books-about-food/core/services/utils/errors'
import * as Sentry from '@sentry/nextjs'
import { cache } from 'react'
import { parse, stringify } from 'superjson'
import z from 'zod'
import { getOrPopulateKv } from './kv'
import { getSessionUser } from './user'

class DeserializationError extends Error {}

type CallOptions = { bypassCache?: boolean; maxAgeOverride?: number }
/**
 * Determines if a service requires arguments.
 * Returns false for services with z.undefined() input schema.
 */
type ServiceRequiresArgs<S extends ServiceClass<any, any>> =
  ServiceInput<S> extends undefined ? false : true

// Overload 1: Services with no args (z.undefined())
export async function call<S extends ServiceClass<any, any>>(
  service: S,
  args?: ServiceRequiresArgs<S> extends false ? undefined : never
): Promise<ServiceReturn<S>>

// Overload 2: Services with args
export async function call<
  S extends ServiceClass<any, any>,
  I extends z.ZodType<ServiceInput<S>>
>(
  service: S,
  args: ServiceRequiresArgs<S> extends true ? z.output<I> : never
): Promise<ServiceReturn<S>>

export async function call<
  S extends ServiceClass<any, any>,
  I extends z.ZodType<ServiceInput<S>>
>(
  ...params: z.output<I> extends undefined
    ? [service: S, args?: undefined]
    : [service: S, args: z.output<I>]
): Promise<ServiceReturn<S>> {
  const [service, args] = params
  const stringArgs = stringify(args)
  try {
    return await cachedCall<I, S>(service, stringArgs)
  } catch (e) {
    // @ts-expect-error TODO: resolve this undefined args issue
    if (e instanceof DeserializationError) return rawCall<I, S>(service, args)
    throw e
  }
}

async function _cachedCall<
  I extends z.ZodType<ServiceInput<S>>,
  S extends ServiceClass<I, any>
>(
  service: S,
  stringArgs: string,
  {
    bypassCache = !!process.env.SKIP_REDIS_CACHE,
    maxAgeOverride
  }: CallOptions = {}
) {
  let args: z.output<I>
  try {
    args = parse(stringArgs)
  } catch {
    throw new DeserializationError()
  }
  const enabled = !service.authed && !!service.cacheKey && !bypassCache
  if (!enabled) return rawCall<I, S>(service, args)

  return getOrPopulateKv(
    ['svc', service.cacheKey, btoa(stringArgs ?? '')],
    () => rawCall<I, S>(service, args),
    {
      expiry: maxAgeOverride || service.defaultCacheMaxAge,
      skipResult: (data) => !data.success
    }
  )
}
const cachedCall = cache(_cachedCall)

async function rawCall<
  I extends z.ZodType<ServiceInput<S>>,
  S extends ServiceClass<I, any>
>(service: S, args: z.output<I>) {
  if (!service.authed) return service.call(args) as Promise<ServiceReturn<S>>

  const user = await getSessionUser()
  if (!user)
    return {
      success: false,
      errors: [
        new AppError(
          'Unauthorized',
          'Not authorized to perform this action'
        ).toJSON()
      ]
    } as ServiceReturn<S>

  return service.call(args, user) as Promise<ServiceReturn<S>>
}

export async function parseAndCall<
  S extends ServiceClass<any, any>,
  I extends z.ZodType<ServiceInput<S>>
>(service: S, args: unknown): Promise<ServiceReturn<S>> {
  try {
    const input = z.parse(service.input as I, args)
    // @ts-expect-error TODO: resolve this undefined args issue
    return call<S, I>(service, input)
  } catch (e) {
    if (!(e instanceof z.ZodError)) {
      Sentry.captureException(e)
      throw e
    }
    return {
      success: false,
      errors: e.issues.map((issue) =>
        new AppError(
          'InvalidInput',
          issue.message,
          issue.path.pop() as string
        ).toJSON()
      )
    } as ServiceReturn<S>
  }
}
