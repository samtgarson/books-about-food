import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter: adapter() })
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter: adapter() })
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
export * from './generated/client'

function adapter() {
  const connectionString = `${process.env.DATABASE_URL}`

  // Use Neon adapter only in Vercel production
  if (process.env.VERCEL) {
    return new PrismaNeon({ connectionString })
  }

  // Use standard PostgreSQL adapter everywhere else
  return new PrismaPg({ connectionString })
}
