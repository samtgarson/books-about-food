import { PrismaClient } from '@prisma/client'
import {
  PrismaCacheStrategy,
  withAccelerate
} from '@prisma/extension-accelerate'

const extendClient = (client: PrismaClient) => client.$extends(withAccelerate())
let prisma: ReturnType<typeof extendClient>
let unextended: PrismaClient

if (process.env.NODE_ENV === 'production') {
  unextended = new PrismaClient()
  prisma = extendClient(unextended)
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: ReturnType<typeof extendClient>
    unextendedPrisma: PrismaClient
  }
  if (!globalWithPrisma.unextendedPrisma) {
    globalWithPrisma.unextendedPrisma = new PrismaClient()
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = extendClient(globalWithPrisma.unextendedPrisma)
  }
  prisma = globalWithPrisma.prisma
  unextended = globalWithPrisma.unextendedPrisma
}

export default prisma
export { unextended }
export * from '@prisma/client'

export const cacheStrategy = {
  ttl: 60 * 5,
  swr: 24 * 60 * 60
} satisfies PrismaCacheStrategy['cacheStrategy']
