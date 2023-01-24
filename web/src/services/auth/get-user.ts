import prisma from 'database'
import { IncomingMessage } from 'http'
import { NextApiRequest } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const getUser = new Service(
  z.object({
    req: z
      .custom<NextApiRequest>((req) => req instanceof IncomingMessage)
      .optional()
  }),
  async ({ req } = {}) => {
    const session = req
      ? await getSession({ req })
      : await unstable_getServerSession(authOptions)

    if (!session?.user.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  }
)
