/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service, ServiceReturn } from '@books-about-food/core/services/base'
import prisma, { User } from '@books-about-food/database'
import { cache } from 'react'
import { auth } from 'src/auth'
import z from 'zod'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
}

export const getUser = cache(async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  } catch (e) {
    console.error(e)
    return null
  }
})

export const call = cache(
  async <S extends Service<any, any>>(
    service: S,
    args?: S extends Service<infer I, any> ? z.infer<I> : never,
    user?: User | null
  ): Promise<ServiceReturn<S>> => {
    user ||= await getUser()

    return service.call(args, user) as Promise<ServiceReturn<S>>
  }
)

export async function _parseAndCall<S extends Service<any, any>>(
  service: S,
  args?: unknown | S extends Service<infer I, any> ? z.input<I> : unknown,
  user?: User | null
): Promise<ServiceReturn<S>> {
  user ||= await getUser()
  return service.parseAndCall(args, user) as Promise<ServiceReturn<S>>
}

export const parseAndCall = cache(_parseAndCall)
