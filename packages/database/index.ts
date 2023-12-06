import { PrismaClient } from '@prisma/client'
// import {
//   PrismaCacheStrategy,
//   withAccelerate
// } from '@prisma/extension-accelerate'

// const extendClient = (client: PrismaClient) => client.$extends(withAccelerate())
let prisma: PrismaClient
let unextended: PrismaClient

if (process.env.NODE_ENV === 'production') {
  unextended = new PrismaClient()
  prisma = unextended
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
    unextendedPrisma: PrismaClient
  }
  if (!globalWithPrisma.unextendedPrisma) {
    globalWithPrisma.unextendedPrisma = new PrismaClient()
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = globalWithPrisma.unextendedPrisma
  }
  prisma = globalWithPrisma.prisma
  unextended = globalWithPrisma.unextendedPrisma
}

export default prisma
export * from '@prisma/client'
export { unextended }

// export const cacheStrategy = {
//   ttl: 0,
//   swr: 0
// } satisfies PrismaCacheStrategy['cacheStrategy']
