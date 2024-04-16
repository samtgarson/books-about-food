/* eslint-disable import/no-extraneous-dependencies */
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient
const connectionString = `${process.env.DATABASE_URL}`

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
export * from '@prisma/client'

function adapter() {
  const pool = new Pool({ connectionString })
  return new PrismaNeon(pool)
}
