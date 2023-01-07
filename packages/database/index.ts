import { PrismaClient } from '@prisma/client'
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    const devPrisma = new PrismaClient()

    globalWithPrisma.prisma = devPrisma
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
export * from '@prisma/client'
