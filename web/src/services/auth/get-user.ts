import { authOptions } from 'app/api/auth/[...nextauth]/route'
import prisma from 'database'
import { getServerSession } from 'next-auth'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const getUser = new Service(z.undefined(), async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id }
  })
})
