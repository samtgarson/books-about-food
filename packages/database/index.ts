import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  const connectionString = `${process.env.DATABASE_URL}`

  console.log('INITIALIZING PRISMA')
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient()
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
export * from '@prisma/client'
