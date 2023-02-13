import prisma from 'database'
import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const getUser = new Service(
  z.object({ req: z.never(), res: z.never() }).or(
    z.object({
      req: z.custom<NextApiRequest>((req) => req instanceof IncomingMessage),
      res: z.custom<NextApiResponse>((req) => req instanceof ServerResponse)
    })
  ),
  async ({ req, res } = {}) => {
    const session = req
      ? await getServerSession(req, res, authOptions)
      : await getServerSession(authOptions)

    if (!session?.user.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  }
)
