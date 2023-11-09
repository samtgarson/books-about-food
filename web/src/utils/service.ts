/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { Service, ServiceReturn } from 'core/services/base'
import prisma, { User } from 'database'
import { getServerSession } from 'next-auth'
import { cache } from 'react'
import z from 'zod'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
}

async function _getUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  } catch (e) {
    return null
  }
}

async function _call<S extends Service<any, any>>(
  service: S,
  args?: S extends Service<infer I, any> ? z.infer<I> : never,
  user?: User | null
): Promise<ServiceReturn<S>> {
  user ||= await getUser()

  return service.call(args, user) as Promise<ServiceReturn<S>>
}

export const getUser = cache(_getUser)
export const call = cache(_call)
